using System.Web;
using System.Web.Mvc;

namespace Quick.WebUI.Member
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}