using Quick.Domain;
using Core.Auditing;

namespace Quick.Repositories
{
	/// <summary>
    /// 仓储操作层实现 ——
    /// </summary>
    public class AuditInfoRepository : EfRepositoryBase<AuditInfo>, IAuditInfoRepository
    {

        public AuditInfoRepository()
            : base(new QuickDbContext())
        { }
    
    }
}
