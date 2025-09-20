using Newtonsoft.Json;
using Re12.Microsoft.MSN.WeatherService.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace Re12.Microsoft.MSN.WeatherService.Utils {
    public class LocationMap {
        private static readonly string _locationFile = HttpContext.Current.Server.MapPath("~/App_Data/locations.json");

        public static Dictionary<string, LocationInfo> Load() {
            if (!File.Exists(_locationFile)) {
                throw new FileNotFoundException("Data not found at " + _locationFile);
            }

            string json = File.ReadAllText(_locationFile);
            return JsonConvert.DeserializeObject<Dictionary<string, LocationInfo>>(json);
        }
    }
}