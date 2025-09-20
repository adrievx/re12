using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace Re12.Microsoft.MSN.WeatherService.Utils {
    public static class Country {
        public static string FromCode(string iso2) {
            try {
                return new RegionInfo(iso2).DisplayName;
            }
            catch {
                return "World";
            }
        }
    }
}