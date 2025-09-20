using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Re12.Microsoft.MSN.WeatherService.Models;
using Re12.Microsoft.MSN.WeatherService.Utils;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using System.Xml.Linq;

namespace Re12.Microsoft.MSN.WeatherService {
    public partial class data : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            Response.Clear();
            Response.ContentType = "application/xml";

            string locationCode = Request.QueryString["wealocations"] ?? string.Empty;
            string degreeType = Request.QueryString["weadegreetype"] ?? "C";
            string culture = Request.QueryString["culture"] ?? "en-GB";

            var locationMap = LocationMap.Load();
            if (!locationMap.TryGetValue(locationCode, out var location)) {
                Response.StatusCode = 404;
                Response.Write("<error>Unknown location code</error>");
                Response.End();

                return;
            }

            string xml = buildXml(locationCode, degreeType, culture, location);
            Response.Write(xml);
            Response.End();
        }

        private string buildXml(string locationCode, string degreeType, string culture, LocationInfo location) {
            bool isMetric = degreeType.ToUpper() == "C";

            string url = string.Format(
                "https://api.open-meteo.com/v1/forecast?latitude={0}&longitude={1}" +
                "&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m" +
                "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode" +
                "&timezone=auto", // TODO: we might want to make this the country's/user's TZ if it doesn't automatically
                location.Latitude.ToString(CultureInfo.InvariantCulture),
                location.Longitude.ToString(CultureInfo.InvariantCulture)
            );

            string json = new WebClient().DownloadString(url);
            var data = JObject.Parse(json);

            var doc = new XmlDocument();
            var root = doc.CreateElement("weatherdata");
            doc.AppendChild(root);

            #region Metadata
            var weather = doc.CreateElement("weather");
            weather.SetAttribute("weatherlocationcode", locationCode);
            weather.SetAttribute("weatherlocationname", location.Name);
            weather.SetAttribute("zipcode", "");
            weather.SetAttribute("url", "http://local.msn.com/worldweather.aspx?q=" + HttpUtility.UrlEncode(location.Name));
            weather.SetAttribute("imagerelativeurl", "http://blst.msn.com/as/wea3/i/en-us/");
            weather.SetAttribute("degreetype", degreeType);
            weather.SetAttribute("provider", "Open-Meteo");
            weather.SetAttribute("attribution", "Data from Open-Meteo");
            weather.SetAttribute("attribution2", "© Open-Meteo");
            weather.SetAttribute("lat", location.Latitude.ToString(CultureInfo.InvariantCulture));
            weather.SetAttribute("long", location.Longitude.ToString(CultureInfo.InvariantCulture));
            weather.SetAttribute("timezone", data["timezone"].ToString());
            weather.SetAttribute("alert", "");
            weather.SetAttribute("entityid", locationCode.GetHashCode().ToString());
            weather.SetAttribute("encodedlocationname", HttpUtility.UrlEncode(location.Name));
            #endregion

            #region Current weather
            var current = (JObject)data["current"];
            string obsTime = DateTime.UtcNow.ToString("HH:mm:ss");

            var currentEl = doc.CreateElement("current");
            currentEl.SetAttribute("temperature", ((int)Math.Round((double)current["temperature_2m"])).ToString());
            currentEl.SetAttribute("skycode", SkyCode.ToSkyCode((int)current["weathercode"]));
            currentEl.SetAttribute("skytext", SkyCode.ToSkyText((int)current["weathercode"]));
            currentEl.SetAttribute("date", DateTime.UtcNow.ToString("yyyy-MM-dd"));
            currentEl.SetAttribute("observationtime", obsTime);
            currentEl.SetAttribute("observationpoint", location.Name);
            currentEl.SetAttribute("feelslike", ((int)Math.Round((double)current["temperature_2m"])).ToString());
            currentEl.SetAttribute("humidity", ((int)current["relative_humidity_2m"]).ToString());
            currentEl.SetAttribute("windspeed", ((int)Math.Round((double)current["windspeed_10m"])).ToString());
            currentEl.SetAttribute("winddisplay", string.Format("{0} {1}", Math.Round((double)current["windspeed_10m"]), isMetric ? "kph" : "mph"));
            currentEl.SetAttribute("day", DateTime.UtcNow.ToString("dddd", CultureInfo.InvariantCulture));
            currentEl.SetAttribute("shortday", DateTime.UtcNow.ToString("ddd", CultureInfo.InvariantCulture));
            weather.AppendChild(currentEl);
            #endregion

            #region Forecast
            var daily = (JObject)data["daily"];
            var dates = (JArray)daily["time"];
            var highs = (JArray)daily["temperature_2m_max"];
            var lows = (JArray)daily["temperature_2m_min"];
            var codes = (JArray)daily["weathercode"];
            var precips = (JArray)daily["precipitation_sum"];

            for (int i = 0; i < Math.Min(5, dates.Count); i++) {
                var date = DateTime.ParseExact((string)dates[i], "yyyy-MM-dd", CultureInfo.InvariantCulture);

                var forecast = doc.CreateElement("forecast");
                forecast.SetAttribute("low", Math.Round((double)lows[i]).ToString());
                forecast.SetAttribute("high", Math.Round((double)highs[i]).ToString());
                forecast.SetAttribute("skycodeday", SkyCode.ToSkyCode((int)codes[i]));
                forecast.SetAttribute("skytextday", SkyCode.ToSkyText((int)codes[i]));
                forecast.SetAttribute("date", date.ToString("yyyy-MM-dd"));
                forecast.SetAttribute("day", date.ToString("dddd", CultureInfo.InvariantCulture));
                forecast.SetAttribute("shortday", date.ToString("ddd", CultureInfo.InvariantCulture));
                forecast.SetAttribute("precip", ((int)Math.Round((double)precips[i])).ToString());

                weather.AppendChild(forecast);
            }
            #endregion

            #region Toolbar
            var toolbar = doc.CreateElement("toolbar");
            toolbar.SetAttribute("timewindow", "60"); // UNKNOWN, seconds until refresh?
            toolbar.SetAttribute("minversion", "1.0.1965.0"); // correlates to the Windows 7 revision
            weather.AppendChild(toolbar);
            #endregion

            root.AppendChild(weather);
            return doc.OuterXml;
        }
    }
}