using Microsoft.Practices.Unity;
using Quick.Application;
using Quick.Domain;
using Quick.Framework.Tool;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace Quick.WebUI.Admin.Controllers
{
    public class LoginController : Controller
    {
        private readonly IUserService _userService;
        private readonly IRoleService _roleService;
        private readonly IModuleService _moduleService;

        public LoginController(IUserService userService,
              IRoleService roleService,
              IModuleService moduleService)
        {
            _userService = userService;
            _roleService = roleService;
            _moduleService = moduleService;
        }

        //登录界面
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(UserDto model)
        {
            model.LastLoginTime = DateTime.Now;
            var result = _userService.Login(model);
            //Session["SidebarMenu"] = InitSidebarMenu();
            Session["CurrentUser"] = result.AppendData;
            Session.Timeout = 200000;

            return Json(result);
        }

        //private IEnumerable<ModuleDto> InitSidebarMenu(UserDto user)
        //{
        //    var roleList = _roleService.GetRoleListByUserId(new RoleQueryInput() { UserId = user.Id }).Select(m => m.Id).ToList();

        //    var moduleDtoList = _moduleService.GetModuleListByRole(new ModuleQueryInput() { RoleIdList = roleList });

        //    return moduleDtoList;
        //}

        public JsonResult InitSidebarMenu()
        {
            List<ModuleDto> moduleDtoList = new List<ModuleDto>()
            {
            new ModuleDto()
            {
            Id=1,
            ParentId = 0,
            Name = "权限管理",
            ChildModule = new List<ModuleDto>() {new ModuleDto()
                {
                Id=11,
                ParentId = 1,
                Name="用户管理",
                Icon = "icon-cloud",
                Area = "Account",
                Controller = "User",
                Action = "Index",
                LinkUrl = "Account/User/Index"
                },
                new ModuleDto()
                {
                Id=12,
                ParentId = 1,
                Name="模块管理",
                Icon = "icon-cloud",
                Area = "Account",
                Controller = "Module",
                Action = "Index",
                LinkUrl = "Account/Module/Index"
                },
                 new ModuleDto()
                {
                Id=13,
                ParentId = 1,
                Name="角色管理",
                Icon = "icon-cloud",
                Area = "Account",
                Controller = "Role",
                Action = "Index",
                LinkUrl = "Account/Role/Index"
                },
                 new ModuleDto()
                {
                Id=13,
                ParentId = 1,
                Name="权限管理",
                Icon = "icon-cloud",
                Area = "Account",
                Controller = "Permission",
                Action = "Index"
                }
             }
            },
             new ModuleDto()
            {
            Id=2,
            ParentId = 0,
            LinkUrl = "Home/Index",
            Name="菜单2",
            Icon = "icon-cloud"
            }
            };
            return Json(moduleDtoList, JsonRequestBehavior.AllowGet);
        }

    }
}
