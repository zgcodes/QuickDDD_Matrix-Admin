using Quick.Domain;
using Core.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Core.Application.Services.Dto;

namespace Quick.Application
{
    public class UserRoleDto : DtoBase
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }

        public virtual User User { get; set; }
        public virtual Role Role { get; set; }
    }
}
