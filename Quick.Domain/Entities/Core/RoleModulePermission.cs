﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Core.Domain.Entities;

namespace Quick.Domain
{
    public class RoleModulePermission : FullAuditedEntity
    {
        public int RoleId { get; set; }
        public int ModuleId { get; set; }
		public int? PermissionId { get; set; }

        public virtual Role Role { get; set; }
        public virtual Module Module { get; set; }
		public virtual Permission Permission { get; set; }
    }
}
