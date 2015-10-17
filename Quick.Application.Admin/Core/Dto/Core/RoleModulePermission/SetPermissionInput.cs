using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quick.Application
{
    public class SetPermissionInput
    {
        public int RoleId {get;set;}
        public string IsSet { get; set; }
        public string MewModulePermission { get; set; }
    }
}