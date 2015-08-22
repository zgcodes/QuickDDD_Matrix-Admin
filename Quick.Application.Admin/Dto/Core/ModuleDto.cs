using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Quick.Framework.Tool;
using Quick.Domain;

namespace Quick.Application
{
    public class ModuleDto : DtoBase
    {
        public ModuleDto()
        {
            this.ChildModule = new List<ModuleDto>();//不写还不能给ChildModule赋值，很奇怪
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

        public virtual ICollection<ModulePermission> ModulePermission { get; set; }
        public List<ModuleDto> ChildModule { get; set; }
    }
}
