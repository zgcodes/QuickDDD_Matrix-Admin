using NLog;
using Quick.Framework.Tool;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Quick.Application
{
    /// <summary>
    /// 业务实现基类
    /// </summary>
    public abstract class ServiceBase : IServiceBase
    {
        public static Logger logger = LogManager.GetCurrentClassLogger();
    }
}
