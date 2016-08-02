using Core.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Quick.Domain
{
    public class UserRole : FullAuditedEntity
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
    }
}
