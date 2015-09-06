using Quick.Application;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.ComponentModel.Composition.Hosting;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace Quick.WebUI.Admin
{
	/// <summary>
	/// 页面布局
	/// </summary>
    public class AdminLayoutAttribute : ActionFilterAttribute 
    {
        public IUserService _userService { set; get; }
        public IRoleService _roleService { set; get; }
        public IModuleService _moduleService { set; get; }
        public IPermissionService _permissionService { set; get; }

        //public AdminLayoutAttribute(IUserService userService,
        //    IRoleService roleService,
        //    IModuleService moduleService,
        //    IPermissionService permissionService
        //    )
        //{
        //    _userService = userService;
        //    _roleService = roleService;
        //    _moduleService = moduleService;
        //    _permissionService = permissionService;

        //    var user = HttpContext.Current.Session["CurrentUser"] as UserDto;
        //}

		public override void OnResultExecuting(ResultExecutingContext filterContext)
		{
            var user = HttpContext.Current.Session["CurrentUser"] as UserDto;

			if (user != null)
			{
				//左侧菜单，这里可不取，在登录时取。
				//((ViewResult)filterContext.Result).ViewBag.SidebarMenuModel = InitSidebarMenu(user);

				//按钮
				InitButton(user, filterContext);
			}
		}

        //private IEnumerable<ModuleDto> InitSidebarMenu(UserDto user)
        //{
        //   var roleList = _roleService.GetRoleListByUserId(new RoleQueryInput(){ UserId = user.Id}).Select(m=>m.Id).ToList();

        //    var moduleDtoList = _moduleService.GetModuleListByRole(new ModuleQueryInput(){RoleId = roleList[0]});

        //    return moduleDtoList;
        //}



        private void InitButton(UserDto user, ResultExecutingContext filterContext)
        {
            var roleIds = user.UserRole.Select(t => t.RoleId);
            var controller = filterContext.RouteData.Values["controller"].ToString().ToLower();
            var buttonList = _roleService.GetViewButtons(new GetButtonModelInput() { RoleIdList = roleIds.ToList(), Controller = controller });

            ((ViewResult)filterContext.Result).ViewBag.ButtonList = buttonList;

            //if (buttonList.FirstOrDefault(m => m.Code.ToLower() == "create") != null)
            //{
            //    ((ViewResult)filterContext.Result).ViewBag.Create = buttonList.FirstOrDefault(m => m.Code.ToLower() == "create");
            //}
            //else if (buttonList.FirstOrDefault(m => m.Code.ToLower() == "edit") != null)
            //{
            //    ((ViewResult)filterContext.Result).ViewBag.Edit = buttonList.FirstOrDefault(m => m.Code.ToLower() == "edit");
            //}
            //else if (buttonList.FirstOrDefault(m => m.Code.ToLower() == "delete") != null)
            //{
            //    ((ViewResult)filterContext.Result).ViewBag.Delete = buttonList.FirstOrDefault(m => m.Code.ToLower() == "delete");
            //}
            //else if (buttonList.FirstOrDefault(m => m.Code.ToLower() == "setbutton") != null)
            //{
            //    ((ViewResult)filterContext.Result).ViewBag.SetButton = buttonList.FirstOrDefault(m => m.Code.ToLower() == "setbutton");
            //}
        }
	}
}