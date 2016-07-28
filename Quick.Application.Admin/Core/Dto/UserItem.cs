using Core.Application.Services.Dto;
using System;

namespace Quick.Application
{
    //TODO:如果Item的属性数量和table的列数不同，会报错
    public class UserItem : DtoBase
    {
        public string LoginName { get; set; }
        public string LoginPwd { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public bool Enabled { get; set; }
        public DateTime? RegisterTime { get; set; }
        public DateTime? LastLoginTime { get; set; }
    }
}
