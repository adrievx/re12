using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;

namespace Re12.Microsoft.MSN.MoneyService {
    public partial class StockQuotes : System.Web.UI.Page {
        protected void Page_Load(object sender, EventArgs e) {
            Response.Clear();
            Response.ContentType = "application/xml";

            string symbolQuery = Request.QueryString["symbols"];
            if (string.IsNullOrWhiteSpace(symbolQuery)) {
                XmlConstructor.WriteEmpty(Context);
                return;
            }

            var symbols = symbolQuery.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(s => s.Trim()).ToList();

            var doc = new XmlDocument();
            var root = doc.CreateElement("quotesdata");
            doc.AppendChild(root);

            foreach (var symbol in symbols) {
                var tickerNode = getTickerNode(doc, symbol);
                if (tickerNode != null) {
                    root.AppendChild(tickerNode);
                }
            }

            Response.Write(doc.OuterXml);
        }

        private XmlElement getTickerNode(XmlDocument doc, string symbol) {
            try {
                if (symbol.StartsWith("/")) {
                    return XmlConstructor.GetCurrencyTicker(doc, symbol);
                }
                else if (symbol.StartsWith("$")) {
                    return XmlConstructor.GetIndexTicker(doc, symbol);
                }
                else {
                    return XmlConstructor.GetStockTicker(doc, symbol);
                }
            }
            catch { }

            return null;
        }
    }
}