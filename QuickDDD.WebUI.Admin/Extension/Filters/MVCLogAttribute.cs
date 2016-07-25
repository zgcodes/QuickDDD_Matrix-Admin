using Newtonsoft.Json;
using NLog;
using Quick.Application;
using Quick.Domain;
using System;
using System.Diagnostics;
using System.Web;
using System.Web.Mvc;
using UtilLibrary;

namespace Quick.WebUI.Admin
{
    public class MVCLogAttribute : ActionFilterAttribute
    {
        private const string StopwatchKey = "ActionStopwatch";
        private const string ArgumentsKey = "ActionArguments";
        private static Logger logger = LogManager.GetCurrentClassLogger();

        private readonly IAuditInfoService _auditInfoService;

        public MVCLogAttribute(IAuditInfoService auditInfoService)
        {
            _auditInfoService = auditInfoService;
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (SkipLogging(filterContext))//是否该类标记为NoLog
            {
                return;
            }
            filterContext.HttpContext.Items[StopwatchKey] = Stopwatch.StartNew();

            var actionArguments = filterContext.ActionParameters;
            string arguments = JsonUtil.ConvertArgumentsToJson(actionArguments);//参数
            filterContext.HttpContext.Items[ArgumentsKey] = arguments;
        }

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            try
            {
                if (filterContext.HttpContext.Items[StopwatchKey] != null)
                {
                    var stopwatch = (Stopwatch)filterContext.HttpContext.Items[StopwatchKey];
                    stopwatch.Stop();
                    string errorString = "";
                    if (filterContext.Exception != null)
                    {
                        errorString = JsonConvert.SerializeObject(filterContext.Exception);
                        logger.Error(filterContext.Exception);
                    }

                    string arguments = filterContext.HttpContext.Items[ArgumentsKey].ToString();

                    var httpContext = HttpContext.Current;
                    var auditInfo = new AuditInfo()
                    {
                        Exception = errorString,
                        MethodName = filterContext.ActionDescriptor.ActionName,
                        ExecutionTime = DateTime.Now,
                        ExecutionDuration = stopwatch.ElapsedMilliseconds,
                        Parameters = arguments,
                        ServiceName = filterContext.ActionDescriptor.ControllerDescriptor.ControllerType.FullName,
                        BrowserInfo = HttpContextExtension.GetBrowserInfo(httpContext),
                        ClientIpAddress = HttpContextExtension.GetClientIpAddress(httpContext),
                        ClientName = HttpContextExtension.GetComputerName(httpContext)
                    };
                    SaveAuditInfo(auditInfo);
                }
            }
            catch
            {

            }
        }

        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="entity"></param>
        public void SaveAuditInfo(AuditInfo entity)
        {
            _auditInfoService.Create(entity);
        }

        /// <summary>
        /// 判断类和方法头上的特性是否要进行Action拦截
        /// </summary>
        /// <param name="actionContext"></param>
        /// <returns></returns>
        private static bool SkipLogging(ActionExecutingContext actionContext)
        {
            return actionContext.ActionDescriptor.GetCustomAttributes(typeof(NoLogAttribute), false).Length > 0 || actionContext.ActionDescriptor.ControllerDescriptor.GetCustomAttributes(typeof(NoLogAttribute), false).Length > 0;
        }


    }
}