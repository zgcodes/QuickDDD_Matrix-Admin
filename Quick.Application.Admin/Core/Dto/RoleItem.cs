using Quick.Domain;
using Core.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Core.Application.Services.Dto;

namespace Quick.Application
{
    public class RoleItem : DtoBase
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int OrderSort { get; set; }
        public bool Enabled { get; set; }
    }
}
