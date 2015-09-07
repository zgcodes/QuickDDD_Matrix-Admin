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
    public class ModuleController : BaseController
    {
        private readonly IModuleService _moduleService;
        private readonly IPermissionService _permissionService;

        public ModuleController(IModuleService moduleService,
            IPermissionService permissionService)
        {
            _moduleService = moduleService;
            _permissionService = permissionService;
        }

        [AdminLayout]
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult List(ModuleQueryInput input)
        {
            var list = _moduleService.GetAll(input);

            var json = new
            {
                iTotalRecords = list.total,
                iTotalDisplayRecords = list.total,
                aaData = list.rows
            };
            return Json(json, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Edit(int? id)
        {
            ModuleDto model = null;
            ViewBag.ParentModuleList = _moduleService.GetParentModuleList();
            if (!id.HasValue)  //新建
            {
                model = new ModuleDto();
            }
            else  //编辑
            {
                model = _moduleService.GetById(id.Value);
            }
            return View(model);
        }

        public JsonResult Delete(int id)
        {
            _moduleService.Delete(id);
            return Json(1, JsonRequestBehavior.AllowGet);

        }

        public ActionResult SetButton(int id)
        {
            ModuleDto model = _moduleService.GetById(id);
            //全部权限
            ViewBag.PermissionList = _permissionService.GetList();
            //已选的权限
            ViewBag.SelectedPermissionIds = model.ModulePermission.Where(m => m.ModuleId == id).Select(m => m.PermissionId).ToList();
            return View(model);

        }

        [HttpPost]
        public ActionResult SetButton(SetButtonDto dto)
        {

            _moduleService.SetButton(dto);
            return Json(1, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Create(ModuleDto model)
        {
            _moduleService.Create(model);
            return Json(1, JsonRequestBehavior.AllowGet);

        }

        public JsonResult Update(ModuleDto model)
        {
            _moduleService.Update(model);
            return Json(1, JsonRequestBehavior.AllowGet);

        }

    }
}
