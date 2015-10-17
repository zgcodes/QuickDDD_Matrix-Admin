using Quick.Framework.Tool;
using System;
using System.Collections.Generic;
using System.ComponentModel;//Title:System.EnterpriseServices 也含有Description的定义，但是不能用于反射，切记别引用错了
using System.Linq;
using System.Text;

namespace Quick.Domain
{
    /// <summary>
    /// 用户信息
    /// </summary>
    [Description("用户信息")]
    public class User : FullAuditedEntity
    {
        public User()
        {
            this.UserRole = new List<UserRole>();
        }

        public virtual string LoginName { get; set; }
        public virtual string LoginPwd { get; set; }
        public virtual string FullName { get; set; }
        public virtual string Email { get; set; }
        public virtual string Phone { get; set; }
        public virtual bool Enabled { get; set; }
        public virtual int PwdErrorCount { get; set; }
        public virtual int LoginCount { get; set; }
        public virtual DateTime? RegisterTime { get; set; }
        public virtual DateTime? LastLoginTime { get; set; }

        public virtual ICollection<UserRole> UserRole { get; set; }
    }
}
