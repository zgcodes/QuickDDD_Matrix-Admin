using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace Quick.WebUI.Admin.Controllers
{
    [PermissionValidation]
    public class BaseController : Controller
    {
        /// <summary>
        /// 返回JsonResult
        /// </summary>
        /// <param name="data">数据</param>
        /// <param name="contentType">内容类型</param>
        /// <param name="contentEncoding">内容编码</param>
        /// <param name="behavior">行为</param>
        /// <returns>JsonReuslt</returns>
        protected override JsonResult Json(object data, string contentType, System.Text.Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new ToJsonResult
            {
                Data = data,
                ContentType = contentType,
                ContentEncoding = contentEncoding,
                JsonRequestBehavior = behavior,
                FormateStr = "yyyy-MM-dd HH:mm:ss"
            };
        }

        /// <summary>
        /// 返回JsonResult.24         /// </summary>
        /// <param name="data">数据</param>
        /// <param name="behavior">行为</param>
        /// <param name="format">json中dateTime类型的格式</param>
        /// <returns>Json</returns>
        protected JsonResult DateJson(object data, JsonRequestBehavior behavior, string format = "yyyy-MM-dd")
        {
            return new ToJsonResult
            {
                Data = data,
                JsonRequestBehavior = behavior,
                FormateStr = format
            };
        }


        /// <summary>
        /// 返回JsonResult.24         /// </summary>
        /// <param name="data">数据</param>
        /// <param name="behavior">行为</param>
        /// <param name="format">json中dateTime类型的格式</param>
        /// <returns>Json</returns>
        protected JsonResult DateTimeJson(object data, JsonRequestBehavior behavior, string format = "yyyy-MM-dd HH:mm:ss")
        {
            return new ToJsonResult
            {
                Data = data,
                JsonRequestBehavior = behavior,
                FormateStr = format
            };
        }

        /// <summary>
        /// 返回JsonResult42         /// </summary>
        /// <param name="data">数据</param>
        /// <param name="format">数据格式</param>
        /// <returns>Json</returns>
        protected JsonResult DateJson(object data, string format)
        {
            return new ToJsonResult
            {
                Data = data,
                FormateStr = format
            };
        }

        protected string ToDateJson(string json)
        {
            string p = @"\\/Date\((\d+)\)\\/";
            MatchEvaluator matchEvaluator = new MatchEvaluator(this.ConvertJsonDateToDateString);
            Regex reg = new Regex(p);
            json = reg.Replace(json, matchEvaluator);
            return json;

        }

        private string ConvertJsonDateToDateString(Match m)
        {
            string result = string.Empty;
            DateTime dt = new DateTime(1970, 1, 1);
            dt = dt.AddMilliseconds(long.Parse(m.Groups[1].Value));
            dt = dt.ToLocalTime();
            result = dt.ToString("yyyy-MM-dd HH:mm:ss");
            return result;
        }

        public void EndResponse(string message)
        {
            Response.Clear();
            Response.Write(message);
            Response.End();
        }


        /// <summary>
        /// 当对象为空时抛出参数错误的异常
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        //public void 检查参数是否为空Json(object obj, string paramName)
        //{
        //    if (obj == null)
        //    {
        //        ReturnJsonError(string.Format("参数{0}错误", paramName));
        //    }
        //}
        //public void 检查参数是否为空Json(object obj)
        //{
        //    if (obj == null)
        //    {
        //        ReturnJsonError("参数错误");
        //    }
        //}

    }


    /// <summary>
    /// 自定义Json视图
    /// </summary>
    public class ToJsonResult : JsonResult
    {
        /// <summary>
        /// 格式化字符串
        /// </summary>
        public string FormateStr
        {
            get;
            set;
        }

        /// <summary>
        /// 重写执行视图
        /// </summary>
        /// <param name="context">上下文</param>
        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            HttpResponseBase response = context.HttpContext.Response;

            if (string.IsNullOrEmpty(this.ContentType))
            {
                response.ContentType = this.ContentType;
            }
            else
            {
                response.ContentType = "application/json";
            }

            if (this.ContentEncoding != null)
            {
                response.ContentEncoding = this.ContentEncoding;
            }

            if (this.Data != null)
            {
                JavaScriptSerializer jss = new JavaScriptSerializer();
                string jsonString = jss.Serialize(Data);
                string p = @"\\/Date\((\d+)\)\\/";
                MatchEvaluator matchEvaluator = new MatchEvaluator(this.ConvertJsonDateToDateString);
                Regex reg = new Regex(p);
                jsonString = reg.Replace(jsonString, matchEvaluator);

                response.Write(jsonString);
            }
        }

        /// <summary>  
        /// 将Json序列化的时间由/Date(1294499956278)转为字符串 .
        /// </summary>  
        /// <param name="m">正则匹配</param>
        /// <returns>格式化后的字符串</returns>
        private string ConvertJsonDateToDateString(Match m)
        {
            string result = string.Empty;
            DateTime dt = new DateTime(1970, 1, 1);
            dt = dt.AddMilliseconds(long.Parse(m.Groups[1].Value));
            dt = dt.ToLocalTime();
            result = dt.ToString(FormateStr);
            return result;
        }
    }
}