using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;

namespace Re12.Microsoft.MSN.MoneyService {
    public class StockIndex {
        private static Dictionary<string, string> _indexMap;
        private static readonly object _lock = new object();

        public static string MapIndexSymbol(string cleaned) {
            EnsureLoaded();

            return _indexMap.TryGetValue(cleaned, out string mapped) ? mapped : cleaned;
        }

        private static void EnsureLoaded() {
            if (_indexMap != null) return;

            lock (_lock) {
                if (_indexMap != null) {
                    return;
                }

                string path = HostingEnvironment.MapPath("~/App_Data/symbolmap.json");
                if (!File.Exists(path)) {
                    _indexMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                    return;
                }

                string json = File.ReadAllText(path);
                _indexMap = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, string>>(json) ?? new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            }
        }
    }
}