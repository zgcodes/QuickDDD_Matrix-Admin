using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quick.Framework.Tool
{
    //假删审计接口，比IAudited多了删除时间，删除操作者，先不加
    public interface IFullAudited : IAudited
    {
        /// <summary>
        /// 创建者Id
        /// </summary>
        int? CreateId { get; set; }

        string CreateBy { get; set; }

        /// <summary>
        /// 创建日期
        /// </summary>
        DateTime? CreateTime { get; set; }

        /// <summary>
        /// 修改者Id
        /// </summary>
        int? ModifyId { get; set; }

        string ModifyBy { get; set; }

        /// <summary>
        /// 修改日期
        /// </summary>
        DateTime? ModifyTime { get; set; }
    }
}