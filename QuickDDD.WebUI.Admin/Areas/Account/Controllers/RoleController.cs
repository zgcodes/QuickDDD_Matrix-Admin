﻿using Microsoft.Practices.Unity;
using Newtonsoft.Json;
using Quick.Application;
using Quick.Framework.Tool;
using Quick.WebUI.Admin.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Quick.WebUI.Admin.Areas.Account.Controllers
{
    public class RoleController : BaseController
    {
        private readonly IRoleService _roleService;
        private readonly IModuleService _moduleService;

        public RoleController(IRoleService roleService,
            IModuleService moduleService)
        {
            _roleService = roleService;
            _moduleService = moduleService;
        }

        [AdminLayout]
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult List(RoleQueryInput input)
        {
            var list = _roleService.GetAll(input);

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
            RoleDto model = null;
            if (!id.HasValue)  //新建
            {
                model = new RoleDto();
            }
            else  //编辑
            {
                model = _roleService.GetById(id.Value);
            }
            return View(model);
        }

        public JsonResult Delete(int id)
        {
            _roleService.Delete(id);
            return Json(1, JsonRequestBehavior.AllowGet);

        }

        public JsonResult Create(RoleDto model)
        {
            _roleService.Create(model);
            return Json(1, JsonRequestBehavior.AllowGet);

        }

        public JsonResult Update(RoleDto model)
        {
            _roleService.Update(model);
            return Json(1, JsonRequestBehavior.AllowGet);

        }

        public ActionResult SetPermission(int Id)
        {
            //角色 - 菜单
            var model = _roleService.GetRoleSelectedModuleModel(Id);
            return PartialView(model);
        }

        [HttpPost]
        public JsonResult SetPermission(int roleId, string isSet, string newModulePermission)
        {

            if (isSet == "0")
            {
                return Json(0, JsonRequestBehavior.AllowGet);
            }
            else
            {
                var input = new SetPermissionInput() { RoleId = roleId, IsSet = isSet, MewModulePermission = newModulePermission };
                _roleService.SetPermission(input);
            }
            return Json(1, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetPermission(int roleId, string selectedModules)
        {
            var input = new GetPermissionInput() { RoleId = roleId, SelectedModules = selectedModules };
            RoleSelectedPermissionModel model = _roleService.GetPermission(input);

            return PartialView("Permission", model);
        }
    }
}
