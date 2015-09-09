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
    public class UserController : BaseController
    {

        private readonly IUserService _userService;
        private readonly IRoleService _roleService;


        public UserController(IUserService userService,
            IRoleService roleService)
        {
            _userService = userService;
            _roleService = roleService;
        }

        [AdminLayout]
        public ActionResult Index()
        {
            return View();
        }

        [PermissionValidation(false)]
        public JsonResult List(UserQueryInput input)
        {
            var list = _userService.GetAll(input);

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
            //所有角色
            ViewBag.roleList = _roleService.GetList();

            UserDto model = null;
            if (!id.HasValue)  //新建
            {
                model = new UserDto();
            }
            else  //编辑
            {
                model = _userService.GetById(id.Value);
                //已经选择的角色id集合
                ViewBag.SelectedRoleIds = model.UserRole.Where(m => !m.IsDeleted).Select(m => m.RoleId).ToList();
            }
            return View(model);
        }

        public JsonResult Delete(int id)
        {
            _userService.Delete(id);
            return Json(1, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Create(UserDto model)
        {
            _userService.Create(model);
            return Json(1, JsonRequestBehavior.AllowGet);

        }

        public JsonResult Update(UserDto model)
        {
            _userService.Update(model);
            return Json(1, JsonRequestBehavior.AllowGet);

        }

    }
}
