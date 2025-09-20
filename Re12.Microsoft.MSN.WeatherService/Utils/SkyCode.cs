using Re12.Microsoft.MSN.WeatherService.Models;
using System;
using System.Collections.Generic;

namespace Re12.Microsoft.MSN.WeatherService.Utils {
    public class SkyCode {
        private static readonly Dictionary<int, SkyCondition> Conditions = new Dictionary<int, SkyCondition> {
            { 0, new SkyCondition("32", "Clear") },
            { 1, new SkyCondition("30", "Mainly clear") },
            { 2, new SkyCondition("30", "Partly cloudy") },
            { 3, new SkyCondition("28", "Overcast") },
            { 45, new SkyCondition("22", "Fog") },
            { 48, new SkyCondition("22", "Depositing rime fog") },
            { 51, new SkyCondition("11", "Drizzle") },
            { 53, new SkyCondition("11", "Drizzle") },
            { 55, new SkyCondition("11", "Drizzle") },
            { 61, new SkyCondition("12", "Rain") },
            { 63, new SkyCondition("12", "Rain") },
            { 65, new SkyCondition("12", "Rain") },
            { 66, new SkyCondition("12", "Freezing Rain") },
            { 67, new SkyCondition("12", "Freezing Rain") },
            { 71, new SkyCondition("16", "Snow") },
            { 73, new SkyCondition("16", "Snow") },
            { 75, new SkyCondition("16", "Snow") },
            { 77, new SkyCondition("16", "Snow") },
            { 80, new SkyCondition("11", "Rain Showers") },
            { 81, new SkyCondition("11", "Rain Showers") },
            { 82, new SkyCondition("11", "Rain Showers") },
            { 95, new SkyCondition("4", "Thunderstorm") },
            { 96, new SkyCondition("4", "Thunderstorm w/ hail") },
            { 99, new SkyCondition("4", "Thunderstorm w/ hail") }
        };

        private static readonly SkyCondition DefaultCondition = new SkyCondition("44", "Unknown");

        public static string ToSkyCode(int code) {
            return Conditions.TryGetValue(code, out var condition) ? condition.IconCode : DefaultCondition.IconCode;
        }

        public static string ToSkyText(int code) {
            return Conditions.TryGetValue(code, out var condition) ? condition.Description : DefaultCondition.Description;
        }
    }
}