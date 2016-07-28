using Quick.Domain;
using Core.Auditing;
using Core.Application.Services;

namespace Quick.Application
{
    /// <summary>
    /// 服务层实现类 —— UserService
    /// </summary>
    public class AuditInfoService : ServiceBase, IAuditingStore
    {
        private readonly IAuditInfoRepository _auditInfoRepository;

        public AuditInfoService(IAuditInfoRepository auditInfoRepository)
        {
            _auditInfoRepository = auditInfoRepository;
        }

        public void Save(AuditInfo auditInfo)
        {
            _auditInfoRepository.Insert(auditInfo);
        }
    }
}
