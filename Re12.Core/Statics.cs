using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Re12.Core {
    public class Statics {
        public static string DataRoot {
            get {
                string path = "C:\\Re12_Data";

                if(!Directory.Exists(path)) {
                    Directory.CreateDirectory(path);
                }

                return path;
            }
        }
    }
}
