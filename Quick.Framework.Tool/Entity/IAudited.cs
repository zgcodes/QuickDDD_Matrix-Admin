using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quick.Framework.Tool
{
    //审计接口
    public interface IAudited
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