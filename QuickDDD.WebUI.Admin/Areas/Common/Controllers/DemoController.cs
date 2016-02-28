using Quick.Application;
using Quick.WebUI.Admin.Controllers;
using System.Linq;
using System.Web.Mvc;

namespace Quick.WebUI.Admin.Areas.Common
{

    public class DemoController : BaseController
    {

        public DemoController()
        {
        }
        
        [AdminLayout]
        [PermissionValidation(false)]
        public ActionResult Index()
        {
            return View();
        }
    }
}
