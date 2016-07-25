using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace UtilLibrary
{
    public static class EnumExtensions
    {
        public static string GetEnumDescription(this Enum enumSubitem)
        {
            string strValue = enumSubitem.ToString();

            FieldInfo fieldinfo = enumSubitem.GetType().GetField(strValue);
            if (fieldinfo == null)
            {
                return "";
            }
            Object[] objs = fieldinfo.GetCustomAttributes(typeof(DescriptionAttribute), false);
            if (objs.Length == 0)
            {
                return strValue;
            }
            else
            {
                DescriptionAttribute da = (DescriptionAttribute)objs[0];
                return da.Description;
            }
        }

        public static string GetEnumDisplay(this Enum enumSubitem)
        {
            string strValue = enumSubitem.ToString();

            FieldInfo fieldinfo = enumSubitem.GetType().GetField(strValue);
            Object[] objs = fieldinfo.GetCustomAttributes(typeof(DisplayAttribute), false);
            if (objs.Length == 0)
            {
                return strValue;
            }
            else
            {
                DisplayAttribute da = (DisplayAttribute)objs[0];
                return da.Name;
            }
        }
    }
}
