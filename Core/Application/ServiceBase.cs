using NLog;

namespace Core.Application.Services
{
    /// <summary>
    /// 业务实现基类
    /// </summary>
    public abstract class ServiceBase : IServiceBase
    {
        public static Logger logger = LogManager.GetCurrentClassLogger();
    }
}
