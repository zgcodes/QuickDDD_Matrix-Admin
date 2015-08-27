using System;
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

            //if (filterContext.HttpContext.Session != null && filterContext.HttpContext.Session[filterContext.HttpContext.Session.SessionID] != null)
            //{
            //    var currentUserSession = filterContext.HttpContext.Session[filterContext.HttpContext.Session.SessionID] ;

            //    if (currentUserSession != null)
            //    {
            //        foreach (var menu in currentUserSession.UserMenuList)
            //        {
            //            if (string.Compare(menu.AreaName, areaName, StringComparison.CurrentCultureIgnoreCase) == 0 &&
            //                string.Compare(menu.ControllerName, controllerName, StringComparison.CurrentCultureIgnoreCase) == 0 &&
            //                string.Compare(menu.ActionName, actionName, StringComparison.CurrentCultureIgnoreCase) == 0)
            //            {
            //                //已授权
            //                isAuth = true;
            //            }
            //        }
            //    }
            //}

            //未授权
            if (isAuth == false)
            {
                filterContext.Result = new RedirectResult("/Home/Unauthorized");
            }

            base.OnActionExecuting(filterContext);
        }
    }
}