using Quick.WebUI.Member.Extension;
using System.Net.Http;
using System.Web.Http.Filters;

public class ApiResultAttribute : System.Web.Http.Filters.ActionFilterAttribute
{
    public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
    {
        // 若发生例外则不在这边处理
        if (actionExecutedContext.Exception != null)
            return;

        base.OnActionExecuted(actionExecutedContext);

        ApiResultModel result = new ApiResultModel();

        // 取得由 API 返回的状态代码
        result.success = actionExecutedContext.ActionContext.Response.StatusCode == System.Net.HttpStatusCode.OK;
        // 取得由 API 返回的资料
        result.result = actionExecutedContext.ActionContext.Response.Content.ReadAsAsync<object>().Result;
        // 重新封装回传格式ss
        actionExecutedContext.Response = actionExecutedContext.Request.CreateResponse(actionExecutedContext.ActionContext.Response.StatusCode, result);
    }
}