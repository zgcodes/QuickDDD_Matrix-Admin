using Quick.Application;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace Quick.WebUI.Admin
{
    /// <summary>
    /// 权限验证过滤器
    /// </summary>
    public class PermissionValidationAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var areaName = string.Empty;
            if (filterContext.RouteData.DataTokens["area"] != null)
            {
                areaName = filterContext.RouteData.DataTokens["area"].ToString();
            }

            var controllerName = string.Empty;
            if (filterContext.RouteData.Values["controller"] != null)
            {
                controllerName = filterContext.RouteData.Values["controller"].ToString();
            }

            var actionName = string.Empty;
            if (filterContext.RouteData.Values["action"] != null)
            {
                actionName = filterContext.RouteData.Values["action"].ToString();
            }

            //默认未授权
            var isAuth = false;

            if (filterContext.HttpContext.Session != null && filterContext.HttpContext.Session["CurrentUser"] != null && filterContext.HttpContext.Session["SidebarMenu"] != null)
            {
                var currentUserSession = filterContext.HttpContext.Session["CurrentUser"];
                //TODO:第一级菜单不判断，二级菜单的area和controller知道，操作action的权限根据code判断。Index的权限匹配到控制器名就行。
                var sidebarMenuList = filterContext.HttpContext.Session["SidebarMenu"] as IEnumerable<ModuleDto>;
                if (currentUserSession != null)
                {
                    foreach (var menu in sidebarMenuList)
                    {
                        if (string.Compare(menu.Area, areaName, StringComparison.CurrentCultureIgnoreCase) == 0 &&
                            string.Compare(menu.Controller, controllerName, StringComparison.CurrentCultureIgnoreCase) == 0 &&
                            string.Compare(menu.Action, actionName, StringComparison.CurrentCultureIgnoreCase) == 0)
                        {
                            //已授权
                            isAuth = true;
                        }
                    }
                }
            }

            //未授权
            if (isAuth == false)
            {
                filterContext.Result = new RedirectResult("/Home/Unauthorized");
            }

            base.OnActionExecuting(filterContext);
        }
    }
}