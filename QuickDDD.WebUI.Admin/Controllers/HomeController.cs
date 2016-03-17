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
    public class HomeController : Controller
    {
        //
        // GET: /Common/Home/

        public ActionResult Index()
        {
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

        public ActionResult Welcome()
        {
            return View();
        }

        public ActionResult Unauthorized()
        {
            return View();
        }

    }
}
