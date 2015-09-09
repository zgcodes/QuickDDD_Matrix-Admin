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

        private void InitButton(UserDto user, ResultExecutingContext filterContext)
        {
            var roleIds = user.UserRole.Select(t => t.RoleId);
            var controller = filterContext.RouteData.Values["controller"].ToString().ToLower();
            var buttonList = _roleService.GetViewButtons(new GetUserPermissionInput() { RoleIdList = roleIds.ToList(), Controller = controller });

            ((ViewResult)filterContext.Result).ViewBag.ButtonList = buttonList;
        }
	}
}