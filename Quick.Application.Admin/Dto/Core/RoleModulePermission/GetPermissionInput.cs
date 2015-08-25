using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quick.Application
{
    public class GetPermissionInput
    {
        public int RoleId {get;set;}

        public string SelectedModules { get; set; }
    }
}