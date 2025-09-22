using Re12.Core;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace Re12.Microsoft.MSN.MoneyService {
    public class Keys {
        public static string FMPKey {
            get {
                string path = Path.Combine(Statics.DataRoot, "key_fmp.txt");

                if (!File.Exists(path)) {
                    File.CreateText(path).Close();
                }

                return File.ReadAllText(path);
            }
        }

        public static string ERKey {
            get {
                string path = Path.Combine(Statics.DataRoot, "key_exchangerate.txt");

                if (!File.Exists(path)) {
                    File.CreateText(path).Close();
                }

                return File.ReadAllText(path);
            }
        }
    }
}