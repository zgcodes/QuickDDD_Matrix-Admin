using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quick.WebUI.Member.Extension
{
    public class ApiResultModel
    {
        public bool success { get; set; }
        public object result { get; set; }
        public string error { get; set; }
    }
}