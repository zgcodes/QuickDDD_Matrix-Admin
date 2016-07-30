using Core.Auditing;
using Core.Utils;
using Newtonsoft.Json;
using NLog;
using Quick.Application;
using Quick.Domain;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace Quick.WebUI.Admin
{
    public class APILogAttribute : ActionFilterAttribute
    {
        private const string StopwatchKey = "ApiStopwatch";
        private static Logger logger = LogManager.GetCurrentClassLogger();

        public IAuditingStore auditInfoService { get; set; }


        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            if (SkipLogging(actionContext))//是否该类标记为NoLog
            {
                base.OnActionExecuting(actionContext);
            }

            //记录进入请求的时间
            actionContext.Request.Properties[StopwatchKey] = Stopwatch.StartNew();

            base.OnActionExecuting(actionContext);
        }
        /// <summary>
        /// 在请求执行完后 记录请求的数据以及返回数据
        /// </summary>
        /// <param name="actionExecutedContext"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            try
            {
                object watch = null;
                if (actionExecutedContext.Request.Properties.TryGetValue(StopwatchKey, out watch))
                {
                    string errorString = "";
                    //记录异常日志
                    if (actionExecutedContext.Exception != null)
                    {
                        errorString = JsonConvert.SerializeObject(actionExecutedContext.Exception);
                        logger.Error(actionExecutedContext.Exception);
                    }

                    var stopwatch = (Stopwatch)actionExecutedContext.Request.Properties[StopwatchKey];
                    stopwatch.Stop();

                    var arguments = JsonUtil.ConvertArgumentsToJson(actionExecutedContext.ActionContext.ActionArguments);
                    var s = actionExecutedContext.Request.Content.ReadAsStringAsync().Result;
                    var httpContext = HttpContext.Current;
                    var auditInfo = new AuditInfo()
                    {
                        Exception = errorString,
                        MethodName = actionExecutedContext.ActionContext.ActionDescriptor.ActionName,
                        ExecutionTime = DateTime.Now,
                        ExecutionDuration = stopwatch.ElapsedMilliseconds,
                        Parameters = arguments,
                        ServiceName =
                            actionExecutedContext.ActionContext.ControllerContext.ControllerDescriptor.ControllerType
                                .FullName,
                        BrowserInfo = HttpContextExtension.GetBrowserInfo(httpContext),
                        ClientIpAddress = HttpContextExtension.GetClientIpAddress(httpContext),
                        ClientName = HttpContextExtension.GetComputerName(httpContext),
                        Result =
                            actionExecutedContext.Response != null
                                ? actionExecutedContext.Response.Content.ReadAsStringAsync().Result
                                : null
                    };
                    SaveAuditInfo(auditInfo);
                }
            }
            catch
            {

            }
            base.OnActionExecuted(actionExecutedContext);
        }

        /// <summary>
        /// 保存
        /// </summary>
        /// <param name="entity"></param>
        public void SaveAuditInfo(AuditInfo entity)
        {
            auditInfoService.Save(entity);
        }

        /// <summary>
        /// 判断类和方法头上的特性是否要进行Action拦截
        /// </summary>
        /// <param name="actionContext"></param>
        /// <returns></returns>
        private static bool SkipLogging(HttpActionContext actionContext)
        {
            return actionContext.ActionDescriptor.GetCustomAttributes<NoLogAttribute>().Any() || actionContext.ActionDescriptor.ControllerDescriptor.GetCustomAttributes<NoLogAttribute>().Any();
        }
    }
}