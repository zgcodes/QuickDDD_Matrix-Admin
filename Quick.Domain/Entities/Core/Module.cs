using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Quick.Framework.Tool;

namespace Quick.Domain
{
    public class Module : FullAuditedEntity
    {
        public Module()
        {
			this.ChildModule = new List<Module>();
			this.ModulePermission = new List<ModulePermission>();
			this.RoleModulePermission = new List<RoleModulePermission>();        
        }

		public int? ParentId { get; set; }
        public string Name { get; set; }
        public string LinkUrl { get; set; }
        public string Area { get; set; }
        public string Controller { get; set; }
        public string Action { get; set; }
        public string Icon { get; set; }
        public string Code { get; set; }
        public int OrderSort { get; set; }
        public string Description { get; set; }
        public bool IsMenu { get; set; }
        public bool Enabled { get; set; }


		public virtual Module ParentModule { get; set; }
        public virtual ICollection<Module> ChildModule { get; set; }       
        public virtual ICollection<ModulePermission> ModulePermission { get; set; }
		public virtual ICollection<RoleModulePermission> RoleModulePermission { get; set; }

    }
}
