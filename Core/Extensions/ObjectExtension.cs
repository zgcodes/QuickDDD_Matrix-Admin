using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Core.Extensions
{
    public  static class ObjectExtension
    {
        public static bool IsNullOrWhiteSpace(this string s)
        {
            return string.IsNullOrWhiteSpace(s);
        }
    }
}