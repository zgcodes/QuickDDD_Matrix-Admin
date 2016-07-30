

using Core.Application.Services.Dto;

namespace Quick.Application
{
    public class RoleDto : DtoBase
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int OrderSort { get; set; }
        public bool Enabled { get; set; }
    }
}
