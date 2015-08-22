using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quick.Application
{
    public class SetButtonDto
    {
        public IList<int> SelectedPermissionIds { get; set; }
        public int ModuleId { get; set; }
    }
}