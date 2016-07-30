using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Auditing
{
    class SimpleLogAuditingStore
    {
        public static Logger logger = LogManager.GetCurrentClassLogger();

        public Task SaveAsync(AuditInfo auditInfo)
        {
            logger.Info(auditInfo.ToString());
            return Task.FromResult(0);
        }
    }
}
