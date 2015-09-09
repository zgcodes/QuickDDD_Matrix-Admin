using Microsoft.Practices.Unity;
using Quick.Application;
using Quick.WebUI.Admin.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Quick.WebUI.Admin.Areas.Account.Controllers
{
    public class PermissionController : BaseController
    {
        private readonly IPermissionService _permissionService;
        public PermissionController(IPermissionService permissionService)
        {
            _permissionService = permissionService;
        }

        [AdminLayout]
        public ActionResult Index()
        {
            return View();
        }

        [PermissionValidation(false)]
        public JsonResult List(PermissionQueryInput input)
        {
            var list = _permissionService.GetAll(input);

            var json = new
            {
                iTotalRecords = list.total,
                iTotalDisplayRecords = list.total,
                aaData = list.rows
            };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        [PermissionValidation(false)]
        public ActionResult Edit(int? id)
        {
            PermissionDto model = null;
            if (!id.HasValue)  //新建
            {
                model = new PermissionDto();
            }
            else  //编辑
            {
                model = _permissionService.GetById(id.Value);
            }
            return View(model);
        }

        public JsonResult Delete(int id)
        {
            _permissionService.Delete(id);
            return Json(1, JsonRequestBehavior.AllowGet);

        }

        public JsonResult Create(PermissionDto model)
        {
            _permissionService.Create(model);
            return Json(1, JsonRequestBehavior.AllowGet);

        }

          [PermissionValidation(false)]
        public JsonResult Update(PermissionDto model)
        {
            _permissionService.Update(model);
            return Json(1, JsonRequestBehavior.AllowGet);

        }

    }
}
