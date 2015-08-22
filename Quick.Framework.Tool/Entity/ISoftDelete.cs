using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quick.Framework.Tool
{
    //假删实体的接口
    public interface ISoftDelete
    {
        /// <summary>
        ///是否删除，逻辑上的删除，非物理删除
        /// </summary>
        bool IsDeleted { get; set; }
    }
}