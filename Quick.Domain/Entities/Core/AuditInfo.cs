using Quick.Framework.Tool;
using System;
using System.ComponentModel.DataAnnotations;

namespace Quick.Domain
{
    public class AuditInfo : Entity
    {
        /// <summary>
        /// 用户唯一标识
        /// </summary>
        public int? UserId { get; set; }

        /// <summary>
        /// 命名空间加类名 
        /// </summary>
        [MaxLength(256)]
        public string ServiceName { get; set; }

        /// <summary>
        /// 执行的方法名
        /// </summary>
        [MaxLength(64)]
        public string MethodName { get; set; }

        /// <summary>
        /// 参数
        /// </summary>
        public string Parameters { get; set; }

        /// <summary>
        /// 返回值
        /// </summary>
        public string Result { get; set; }

        /// <summary>
        /// 执行时间
        /// </summary>
        public DateTime ExecutionTime { get; set; }

        /// <summary>
        /// 方法执行时长（毫秒）
        /// </summary>
        public long ExecutionDuration { get; set; }

        /// <summary>
        /// IP address of the client.
        /// </summary>
        [MaxLength(256)]
        public string ClientIpAddress { get; set; }

        /// <summary>
        /// 发送请求的计算机名
        /// </summary>
        [MaxLength(256)]
        public string ClientName { get; set; }

        /// <summary>
        /// 发送请求的浏览器信息
        /// </summary>
        [MaxLength(256)]
        public string BrowserInfo { get; set; }

        /// <summary>
        /// 异常信息
        /// </summary>
        public string Exception { get; set; }
    }
}