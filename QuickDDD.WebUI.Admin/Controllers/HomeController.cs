using Quick.Domain;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace Quick.WebUI.Admin.Controllers
{
    public class HomeController : BaseController
    {
        //
        // GET: /Common/Home/

        [PermissionValidation(false)]
        public ActionResult Index()
        {
            logger.Info("访问首页");
            if (Session["CurrentUser"] == null)
            {
                Response.Redirect("/Login/Index");
                return null;
            }
            else
            {
                return View();
            }
        }

        [PermissionValidation(false)]
        public ActionResult Welcome()
        {
            return View();
        }

        [PermissionValidation(false)]
        public ActionResult Unauthorized()
        {
            return View();
        }

    }
}
