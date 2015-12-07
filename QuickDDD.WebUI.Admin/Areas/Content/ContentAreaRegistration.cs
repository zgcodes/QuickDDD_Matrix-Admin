using System.Web.Mvc;

namespace Quick.WebUI.Admin.Areas.Content
{
    public class ContentAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Content";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Content_default",
                "Content/{controller}/{action}/{id}",
                new {action = "Index", id = UrlParameter.Optional },
                new string[] { "Quick.WebUI.Admin.Areas.Content" }
            );
        }
    }
}
