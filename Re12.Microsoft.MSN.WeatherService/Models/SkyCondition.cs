using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Re12.Microsoft.MSN.WeatherService.Models {
    public class SkyCondition {
        public string IconCode { get; set; }
        public string Description { get; set; }

        public SkyCondition(string iconCode, string description) {
            IconCode = iconCode;
            Description = description;
        }
    }
}