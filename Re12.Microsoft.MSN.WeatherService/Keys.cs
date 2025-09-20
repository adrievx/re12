using Re12.Core;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace Re12.Microsoft.MSN.WeatherService {
    public class Keys {
        public static string OpenWeatherMapApiKey {
            get {
                string path = Path.Combine(Statics.DataRoot, "key_openweather.txt");

                if (!File.Exists(path)) {
                    File.CreateText(path).Close();
                }

                return path;
            }
        }
    }
}