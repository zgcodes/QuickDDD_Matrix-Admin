using Quick.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Routing;

namespace Quick.WebUI.Admin
{
    /// <summary>
    /// 权限验证过滤器
    /// </summary>
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
    public class PermissionValidationAttribute : AuthorizeAttribute
    {
        /// <summary>
        /// 是否拦截
        /// </summary>
        private bool Validate;

        public IUserService _userService { set; get; }
        public IRoleService _roleService { set; get; }
        public IModuleService _moduleService { set; get; }
        public IPermissionService _permissionService { set; get; }

        public PermissionValidationAttribute(bool validate = true)
        {
            Validate = validate;
        }

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            //权限拦截是否忽略
            if (Validate == false)
            {
                return;
            }

            //验证用户是否登录
            var user = filterContext.HttpContext.Session["CurrentUser"] as UserDto;
            if (user == null)
            {
                //跳转到登录页面
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new { controller = "Login", action = "Index" }));
            }
            else
            {
                // 权限拦截与验证
                var area = filterContext.RouteData.DataTokens.ContainsKey("area") ? filterContext.RouteData.DataTokens["area"].ToString() : string.Empty;
                var controller = filterContext.RouteData.Values["controller"].ToString().ToLower();
                var action = filterContext.RouteData.Values["action"].ToString().ToLower();

                var isAllowed = this.IsAllowed(user, controller, action);

                if (!isAllowed)
                {
                    filterContext.Result = new RedirectResult("/Error/Page400");
                }
            }
        }

        public bool IsAllowed(UserDto user, string controller, string action)
        {
            var roleIds = user.UserRole.Select(t => t.RoleId);
            var isHavaPermission = _roleService.IsHavaPermission(new GetUserPermissionInput() { RoleIdList = roleIds.ToList(), Controller = controller, Action = action });
            return isHavaPermission;
        }
    }
}