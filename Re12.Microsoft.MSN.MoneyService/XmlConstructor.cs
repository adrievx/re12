using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Web;
using System.Xml;

namespace Re12.Microsoft.MSN.MoneyService {
    public class XmlConstructor {
        public static void WriteEmpty(HttpContext ctx) {
            ctx.Response.Write("<quotesdata></quotesdata>");
        }

        public static XmlElement GetStockTicker(XmlDocument doc, string symbol) {
            string url = $"https://financialmodelingprep.com/stable/quote?symbol={HttpUtility.UrlEncode(symbol)}&apikey={Keys.FMPKey}";

            string json = new WebClient().DownloadString(url);
            var arr = JArray.Parse(json);
            if (arr.Count == 0) {
                return null;
            }

            var obj = (JObject)arr[0];
            if (obj["price"] == null) {
                return null;
            }

            double last = obj["price"].Value<double>();
            string name = obj["name"]?.ToString() ?? symbol;

            var ticker = createTickerXml(doc, symbol, name, last, "Equity", obj["exchange"]?.ToString() ?? "N/A", DateTime.UtcNow.ToString("M/d/yyyy h:mm:ss tt", CultureInfo.InvariantCulture));
            ticker.SetAttribute("change", obj["change"]?.ToString() ?? "unch");
            ticker.SetAttribute("percentchange", obj["changesPercentage"]?.ToString() ?? "0.00%");
            ticker.SetAttribute("volume", obj["volume"]?.ToString() ?? "0");
            ticker.SetAttribute("marketcap", obj["marketCap"]?.ToString() ?? "$0");
            ticker.SetAttribute("open", obj["open"]?.ToString() ?? last.ToString("0.####"));
            ticker.SetAttribute("close", obj["previousClose"]?.ToString() ?? last.ToString("0.####"));
            ticker.SetAttribute("high", obj["dayHigh"]?.ToString() ?? last.ToString("0.####"));
            ticker.SetAttribute("low", obj["dayLow"]?.ToString() ?? last.ToString("0.####"));
            ticker.SetAttribute("ask", obj["ask"]?.ToString() ?? last.ToString("0.####"));
            ticker.SetAttribute("bid", obj["bid"]?.ToString() ?? last.ToString("0.####"));
            ticker.SetAttribute("yearhigh", obj["yearHigh"]?.ToString() ?? "0.0000");
            ticker.SetAttribute("yearlow", obj["yearLow"]?.ToString() ?? "0.0000");
            ticker.SetAttribute("pe", obj["pe"]?.ToString() ?? "0.00");
            ticker.SetAttribute("eps", obj["eps"]?.ToString() ?? "0.00");
            ticker.SetAttribute("sizeoflastsale", "0");

            return ticker;
        }

        public static XmlElement GetCurrencyTicker(XmlDocument doc, string symbol) {
            // TODO:
            /*
            Implement:

            - percentchange
            - volume
            - exchange
            - marketcap
            - yearhigh
            - yearlow
            - pe
            - eps
            - sizeoflastsale
            */

            string pair = symbol.Trim('/').ToUpperInvariant();
            if (pair.Length != 6) {
                return null;
            }

            string from = pair.Substring(0, 3);
            string to = pair.Substring(3, 3);

            string url = $"https://api.exchangerate.host/live?access_key={Keys.ERKey}";
            string json = new WebClient().DownloadString(url);
            var data = JObject.Parse(json);

            if (data["success"]?.Value<bool>() != true || data["quotes"] == null) {
                return null;
            }

            var quotes = (JObject)data["quotes"];
            double rate = 0.0;

            string directKey = $"USD{to}";
            string inverseKey = $"USD{from}";

            if (from == "USD" && quotes[directKey] != null) {
                rate = quotes[directKey].Value<double>();
            }
            else if (to == "USD" && quotes[inverseKey] != null) {
                rate = 1.0 / quotes[inverseKey].Value<double>();
            }
            else if (quotes[directKey] != null && quotes[inverseKey] != null) {
                double usdTo = quotes[directKey].Value<double>();
                double usdFrom = quotes[inverseKey].Value<double>();
                rate = usdTo / usdFrom;
            }
            else {
                return null;
            }

            long unixTimestamp = data["timestamp"]?.Value<long>() ?? 0;
            string timeStamp = unixTimestamp > 0 ? DateTimeOffset.FromUnixTimeSeconds(unixTimestamp).UtcDateTime.ToString("yyyy-MM-dd") : DateTime.UtcNow.ToString("yyyy-MM-dd");

            return createTickerXml(doc, symbol, $"{from} to {to}", rate, "Currency", "N/A", timeStamp);
        }

        public static XmlElement GetIndexTicker(XmlDocument doc, string symbol) {
            string cleaned = symbol.TrimStart('$');
            string mappedSymbol = StockIndex.MapIndexSymbol(cleaned);

            string url = $"https://financialmodelingprep.com/stable/quote?symbol={HttpUtility.UrlEncode(mappedSymbol)}&apikey={Keys.FMPKey}";
            string json = new WebClient().DownloadString(url);

            var arr = JArray.Parse(json);
            if (arr.Count == 0) {
                return null;
            }

            var obj = (JObject)arr[0];
            if (obj["price"] == null) {
                return null;
            }

            double last = obj["price"].Value<double>();
            string name = obj["name"]?.ToString() ?? cleaned;

            var ticker = createTickerXml(doc, symbol, name, last, "Index", obj["exchange"]?.ToString() ?? "N/A", DateTime.UtcNow.ToString("M/d/yyyy h:mm:ss tt", CultureInfo.InvariantCulture));
            ticker.SetAttribute("change", obj["change"]?.ToString() ?? "unch");
            ticker.SetAttribute("percentchange", obj["changesPercentage"]?.ToString() ?? "0.00%");
            ticker.SetAttribute("volume", obj["volume"]?.ToString() ?? "0");
            ticker.SetAttribute("marketcap", obj["marketCap"]?.ToString() ?? "$0");
            ticker.SetAttribute("open", obj["open"]?.ToString() ?? last.ToString("0.####"));
            ticker.SetAttribute("close", obj["previousClose"]?.ToString() ?? last.ToString("0.####"));
            ticker.SetAttribute("high", obj["dayHigh"]?.ToString() ?? last.ToString("0.####"));
            ticker.SetAttribute("low", obj["dayLow"]?.ToString() ?? last.ToString("0.####"));
            ticker.SetAttribute("ask", obj["ask"]?.ToString() ?? last.ToString("0.####"));
            ticker.SetAttribute("bid", obj["bid"]?.ToString() ?? last.ToString("0.####"));
            ticker.SetAttribute("yearhigh", obj["yearHigh"]?.ToString() ?? "0.0000");
            ticker.SetAttribute("yearlow", obj["yearLow"]?.ToString() ?? "0.0000");
            ticker.SetAttribute("pe", obj["pe"]?.ToString() ?? "0.00");
            ticker.SetAttribute("eps", obj["eps"]?.ToString() ?? "0.00");
            ticker.SetAttribute("sizeoflastsale", "0");

            return ticker;
        }

        private static XmlElement createTickerXml(XmlDocument doc, string symbol, string name, double rate, string type, string exchange, string timestamp) {
            var ticker = doc.CreateElement("ticker");
            ticker.SetAttribute("symbol", symbol);
            ticker.SetAttribute("name", name);
            ticker.SetAttribute("last", rate.ToString("0.####", CultureInfo.InvariantCulture));
            ticker.SetAttribute("change", "unch");
            ticker.SetAttribute("percentchange", "0.00%");
            ticker.SetAttribute("type", type);
            ticker.SetAttribute("volume", "0");
            ticker.SetAttribute("exchange", exchange);
            ticker.SetAttribute("timeoflastsale", timestamp ?? DateTime.UtcNow.ToString("dd/MM/yyyy h:mm:ss tt", CultureInfo.InvariantCulture));
            ticker.SetAttribute("marketcap", "$0");
            ticker.SetAttribute("open", rate.ToString("0.####", CultureInfo.InvariantCulture));
            ticker.SetAttribute("close", rate.ToString("0.####", CultureInfo.InvariantCulture));
            ticker.SetAttribute("high", rate.ToString("0.####", CultureInfo.InvariantCulture));
            ticker.SetAttribute("low", rate.ToString("0.####", CultureInfo.InvariantCulture));
            ticker.SetAttribute("ask", rate.ToString("0.####", CultureInfo.InvariantCulture));
            ticker.SetAttribute("bid", rate.ToString("0.####", CultureInfo.InvariantCulture));
            ticker.SetAttribute("yearhigh", "0.0000");
            ticker.SetAttribute("yearlow", "0.0000");
            ticker.SetAttribute("pe", "0.00");
            ticker.SetAttribute("eps", "0.00");
            ticker.SetAttribute("sizeoflastsale", "0");

            return ticker;
        }
    }
}