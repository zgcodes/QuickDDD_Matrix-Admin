using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Quick.Framework.Tool;

namespace Quick.Domain
{
    public class ModulePermission : FullAuditedEntity
    {
        public int ModuleId { get; set; }
        public int PermissionId { get; set; }

        //public virtual Module Module { get; set; }
        //public virtual Permission Permission { get; set; }
    }
}
