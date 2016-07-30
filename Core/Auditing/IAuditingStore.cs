using System.Threading.Tasks;

namespace Core.Auditing
{
    public interface IAuditingStore
    {
        void Save(AuditInfo auditInfo);
    }
}
