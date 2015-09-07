using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using Quick.Framework.Tool;
using Quick.WebUI.Admin;

namespace Quick.WebUI.Admin.Areas.SysConfig.Controllers
{
    public class AppendixController : Controller
    {
		[AdminLayout]
		public ActionResult Icon()
		{
			return View();
		}
	}
}