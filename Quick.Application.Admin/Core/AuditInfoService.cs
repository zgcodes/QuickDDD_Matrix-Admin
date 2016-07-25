using Quick.Domain;

namespace Quick.Application
{
	/// <summary>
    /// 服务层实现类 —— UserService
    /// </summary>
    public class AuditInfoService : ServiceBase, IAuditInfoService
    {

        private readonly IAuditInfoRepository _auditInfoRepository;
       // public IUnitOfWork UnitOfWork { get; set; }

        public AuditInfoService(IAuditInfoRepository auditInfoRepository)
        {
            _auditInfoRepository = auditInfoRepository;
        }
        
        #region 公共方法

        public void Create(AuditInfo entity)
        {
            _auditInfoRepository.Insert(entity);
        }

        #endregion

	}
}
