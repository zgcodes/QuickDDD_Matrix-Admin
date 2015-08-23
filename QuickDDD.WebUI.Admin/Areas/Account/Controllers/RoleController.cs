using Microsoft.Practices.Unity;
using Newtonsoft.Json;
using Quick.Application;
using Quick.Framework.Tool;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Quick.WebUI.Admin.Areas.Account.Controllers
{
    public class RoleController : Controller
    {
        private readonly IRoleService _roleService;
        private readonly IModuleService _moduleService;

        public RoleController(IRoleService roleService,
            IModuleService moduleService)
        {
            _roleService = roleService;
            _moduleService = moduleService;
        }

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
               var input = new SetPermissionInput() { RoleId =roleId,IsSet=isSet,MewModulePermission = newModulePermission };
               _roleService.SetPermission(input);
            }
            return Json(1, JsonRequestBehavior.AllowGet);
        }

        //public ActionResult GetPermission(int roleId, string selectedModules)
        //{
        //    //选中模块
        //    List<int> selectedModuleId = new List<int>();

        //    string[] strSelectedModules = selectedModules.Split(',');
        //    foreach (var Id in strSelectedModules)
        //    {
        //        selectedModuleId.Add(Convert.ToInt32(Id));
        //    }

        //    //权限列表
        //    var model = new RoleSelectedPermissionModel();

        //    model.HeaderPermissionList = PermissionService.Permissions.Where(t => t.IsDeleted == false && t.Enabled == true)
        //                                                .OrderBy(t => t.OrderSort)
        //                                                .Select(t => new PermissionModel
        //                                                {
        //                                                    PermissionId = t.Id,
        //                                                    PermissionName = t.Name,
        //                                                    OrderSort = t.OrderSort
        //                                                }).ToList();

        //    //权限列表 (从选中的菜单获取)
        //    foreach (var moduleId in selectedModuleId.Distinct())
        //    {
        //        var module = ModuleService.Modules.FirstOrDefault(t => t.Id == moduleId);

        //        var modulePermissionModel = new ModulePermissionModel
        //        {
        //            ModuleId = module.Id,
        //            ParentId = module.ParentId,
        //            ModuleName = module.Name,
        //            Code = module.Code
        //        };

        //        //所有权限列表
        //        foreach (var permission in model.HeaderPermissionList)
        //        {
        //            modulePermissionModel.PermissionDataList.Add(new PermissionModel
        //            {
        //                PermissionId = permission.PermissionId,
        //                PermissionName = permission.PermissionName,
        //                OrderSort = permission.OrderSort,
        //            });
        //        }

        //        //模块包含的按钮
        //        var modulePermission = ModulePermissionService.ModulePermissions.Where(t => t.ModuleId == moduleId && t.IsDeleted == false);
        //        var selectedModulePermission = RoleModulePermissionService.RoleModulePermissions.Where(t => t.RoleId == roleId && t.ModuleId == moduleId && t.IsDeleted == false);

        //        if (module.ChildModule.Count > 0 && selectedModulePermission.Count() > 0)
        //        {
        //            modulePermissionModel.Selected = true;
        //        }

        //        foreach (var mp in modulePermission)
        //        {
        //            var permission = PermissionService.Permissions.FirstOrDefault(t => t.Id == mp.PermissionId);

        //            foreach (var p in modulePermissionModel.PermissionDataList)
        //            {
        //                if (p.PermissionId == permission.Id)
        //                {
        //                    //设置Checkbox可用
        //                    p.Enabled = true;
        //                    //设置选中
        //                    var rmp = RoleModulePermissionService.RoleModulePermissions.FirstOrDefault(t => t.RoleId == roleId && t.ModuleId == moduleId && t.PermissionId == permission.Id && t.IsDeleted == false);
        //                    if (rmp != null)
        //                    {
        //                        //设置父节点选中
        //                        modulePermissionModel.Selected = true;
        //                        p.Selected = true;
        //                    }
        //                }
        //            }

        //        }
        //        model.ModulePermissionDataList.Add(modulePermissionModel);
        //    }

        //    //权限按照Code排序
        //    model.ModulePermissionDataList = model.ModulePermissionDataList.OrderBy(t => t.Code).ToList();

        //    return PartialView("Permission", model);
        //}
    }
}
