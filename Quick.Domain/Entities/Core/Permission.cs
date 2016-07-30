using Core.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Quick.Domain
{
    public class Permission : FullAuditedEntity
    {
        public Permission()
        {
			this.ModulePermission = new List<ModulePermission>();
			this.RoleModulePermission = new List<RoleModulePermission>();
        }

        public string Code { get; set; }
        public string Name { get; set; }
        public int OrderSort { get; set; }
        public string Icon { get; set; }
        public string Description { get; set; }
        public bool Enabled { get; set; }

        public virtual ICollection<ModulePermission> ModulePermission { get; set; }
		public virtual ICollection<RoleModulePermission> RoleModulePermission { get; set; }
    }
}
