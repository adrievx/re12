using Newtonsoft.Json.Linq;
using Re12.Microsoft.MSN.WeatherService.Models;
using Re12.Microsoft.MSN.WeatherService.Utils;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;

namespace Re12.Microsoft.MSN.WeatherService {
    public partial class find : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            Response.Clear();
            Response.ContentType = "application/xml";

            string query = Request.QueryString["weasearchstr"] ?? string.Empty;
            string degreeType = Request.QueryString["weadegreetype"] ?? "C";
            string culture = Request.QueryString["culture"] ?? "en-GB";

            if (string.IsNullOrWhiteSpace(query)) {
                Response.StatusCode = 400;
                Response.Write("<error>Missing query</error>");
                Response.End();
                return;
            }

            var locationMap = LocationMap.Load();
            var matches = locationMap.Where(kvp => kvp.Value.Name.IndexOf(query, StringComparison.InvariantCultureIgnoreCase) >= 0).Take(5).ToList();

            var doc = new XmlDocument();
            var root = doc.CreateElement("weatherdata");
            root.SetAttribute("xmlns:xsd", "http://www.w3.org/2001/XMLSchema");
            root.SetAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
            doc.AppendChild(root);

            #region Results
            foreach (var kvp in matches) {
                string locationCode = kvp.Key;
                LocationInfo location = kvp.Value;

                string units = degreeType.ToUpper() == "C" ? "metric" : "imperial";
                string url = string.Format(
                    "https://api.open-meteo.com/v1/forecast?latitude={0}&longitude={1}" +
                    "&current=temperature_2m,weathercode&timezone=auto",
                    location.Latitude.ToString(CultureInfo.InvariantCulture),
                    location.Longitude.ToString(CultureInfo.InvariantCulture)
                );

                JObject data = null;
                try {
                    string json = new WebClient().DownloadString(url);
                    data = JObject.Parse(json);
                }
                catch {
                    continue;
                }

                var current = (JObject)data["current"];
                int temperature = (int)Math.Round((double)current["temperature_2m"]);
                int weathercode = (int)current["weathercode"];

                var weather = doc.CreateElement("weather");
                weather.SetAttribute("weatherlocationcode", locationCode);
                weather.SetAttribute("weatherlocationname", location.Name);
                weather.SetAttribute("zipcode", "");
                weather.SetAttribute("weatherfullname", location.Name);
                weather.SetAttribute("searchlocation", $"{location.Name}, {Country.FromCode(location.CountryCode)}");
                weather.SetAttribute("searchdistance", "0");
                weather.SetAttribute("searchscore", "0.95");
                weather.SetAttribute("url", ""); // TODO: populate later
                weather.SetAttribute("imagerelativeurl", "http://wst.s-msn.com/i/en/");
                weather.SetAttribute("degreetype", degreeType);
                weather.SetAttribute("provider", "Open-Meteo");
                weather.SetAttribute("isregion", "False");
                weather.SetAttribute("region", ""); // TODO: populate later
                weather.SetAttribute("alert", ""); // TODO: populate later
                weather.SetAttribute("searchresult", location.Name);
                weather.SetAttribute("lat", location.Latitude.ToString(CultureInfo.InvariantCulture));
                weather.SetAttribute("lon", location.Longitude.ToString(CultureInfo.InvariantCulture));
                weather.SetAttribute("entityid", locationCode.GetHashCode().ToString());

                #region Current weather
                var currentEl = doc.CreateElement("current");
                currentEl.SetAttribute("temperature", temperature.ToString());
                currentEl.SetAttribute("skycode", SkyCode.ToSkyCode(weathercode));
                currentEl.SetAttribute("skytext", SkyCode.ToSkyText(weathercode));
                weather.AppendChild(currentEl);
                #endregion

                root.AppendChild(weather);
            }
            #endregion

            Response.Write(doc.OuterXml);
            Response.End();
        }
    }
}