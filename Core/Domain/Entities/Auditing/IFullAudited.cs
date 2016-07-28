using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Core.Domain.Entities
{
    //假删审计接口，比IAudited多了删除时间，删除操作者，先不加
    public interface IFullAudited : IAudited
    {     
        /// <summary>
        /// 删除日期
        /// </summary>
        DateTime? DeletedTime { get; set; }
    }
}