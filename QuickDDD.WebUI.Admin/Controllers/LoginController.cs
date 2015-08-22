using Microsoft.Practices.Unity;
using Quick.Application;
using Quick.Domain;
using Quick.Framework.Tool;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Quick.WebUI.Admin.Controllers
{
    public class LoginController : Controller
    {
        private readonly IUserService _userService;

        public LoginController(IUserService userService)
        {
            _userService = userService;
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
            Session["SidebarMenu"] = InitSidebarMenu();
            Session["CurrentUser"] = model;
            Session.Timeout = 200000;

            return Json(result);
        }


        public List<ModuleDto> InitSidebarMenu()
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
                Action = "Index"
                },
                new ModuleDto()
                {
                Id=12,
                ParentId = 1,
                Name="模块管理",
                Icon = "icon-cloud",
                Area = "Account",
                Controller = "Module",
                Action = "Index"
                },
                 new ModuleDto()
                {
                Id=13,
                ParentId = 1,
                Name="角色管理",
                Icon = "icon-cloud",
                Area = "Account",
                Controller = "Role",
                Action = "Index"
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
            return moduleDtoList;
        }

    }
}
