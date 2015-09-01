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
				//左侧菜单
				//((ViewResult)filterContext.Result).ViewBag.SidebarMenuModel = InitSidebarMenu(user);

				//按钮
				//InitButton(user, filterContext);
			}
		}

		private IEnumerable<ModuleDto> InitSidebarMenu(UserDto user)
        {
           var roleList = _roleService.GetRoleListByUserId(new RoleQueryInput(){ UserId = user.Id}).Select(m=>m.Id).ToList();

            var moduleDtoList = _moduleService.GetModuleListByRole(new ModuleQueryInput(){RoleId = roleList[0]});

            return moduleDtoList;
		}

		

        //private void InitButton(User user, ResultExecutingContext filterContext)
        //{
        //    var roleIds = user.UserRole.Select(t => t.RoleId);
        //    var controller = filterContext.RouteData.Values["controller"].ToString().ToLower();
        //    var action = filterContext.RouteData.Values["action"].ToString().ToLower();
        //    var module = ModuleService.Modules.FirstOrDefault(t => t.Controller.ToLower() == controller);
        //    if (module != null)
        //    {
        //        var permissionIds = RoleModulePermissionService.RoleModulePermissions.Where(t => roleIds.Contains(t.RoleId) && t.ModuleId == module.Id).Select(t => t.PermissionId).Distinct();
        //        foreach (var permissionId in permissionIds)
        //        {
        //            var entity = PermissionService.Permissions.FirstOrDefault(t => t.Id == permissionId && t.Enabled == true && t.IsDeleted == false);
        //            if (entity != null)
        //            {
        //                var btnButton = new ButtonModel
        //                {
        //                    Icon = entity.Icon,
        //                    Text = entity.Name
        //                };
        //                if (entity.Code.ToLower() == "create")
        //                {
        //                    ((ViewResult)filterContext.Result).ViewBag.Create = btnButton;
        //                }
        //                else if (entity.Code.ToLower() == "edit")
        //                {
        //                    ((ViewResult)filterContext.Result).ViewBag.Edit = btnButton;
        //                }
        //                else if (entity.Code.ToLower() == "delete")
        //                {
        //                    ((ViewResult)filterContext.Result).ViewBag.Delete = btnButton;
        //                }
        //                else if (entity.Code.ToLower() == "setbutton")
        //                {
        //                    ((ViewResult)filterContext.Result).ViewBag.SetButton = btnButton;
        //                }
        //                else if (entity.Code.ToLower() == "setpermission")
        //                {
        //                    ((ViewResult)filterContext.Result).ViewBag.SetPermission = btnButton;
        //                }
        //                else if (entity.Code.ToLower() == "changepwd")
        //                {
        //                    ((ViewResult)filterContext.Result).ViewBag.ChangePwd = btnButton;
        //                }
        //                else if (entity.Code.ToLower() == "deleteall")
        //                {
        //                    ((ViewResult)filterContext.Result).ViewBag.DeleteAll = btnButton;
        //                }
        //            }
        //        }
        //    }
        //}
	}
}