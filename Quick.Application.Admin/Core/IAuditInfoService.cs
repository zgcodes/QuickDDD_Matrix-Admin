using Quick.Domain;
using Quick.Framework.Tool;
using System;
using System.Collections.Generic;
using System.Linq;



namespace Quick.Application
{
    /// <summary>
    /// 服务层接口 —— IAuditInfoService
    /// </summary>
    public interface IAuditInfoService : IServiceBase
    {
        #region 公共方法

        void Create(AuditInfo entity);

        #endregion
	}
}
