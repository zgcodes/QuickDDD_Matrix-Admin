using System.Web.Mvc;

namespace Quick.WebUI.Admin.Areas.Account
{
    public class AccountAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Account";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "Account_default",
                "Account/{controller}/{action}/{id}",
                new {action = "Index", id = UrlParameter.Optional },
                new string[] { "Quick.WebUI.Admin.Areas.Account.Controllers" }
            );
        }
    }
}
