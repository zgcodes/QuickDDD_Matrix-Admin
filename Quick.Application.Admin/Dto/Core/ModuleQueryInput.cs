using Quick.Domain;
using Quick.Framework.Tool;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Quick.Application
{
    public class ModuleQueryInput : QueryRequestInput
    {
        public int? RoleId { get; set; }
    }
}
