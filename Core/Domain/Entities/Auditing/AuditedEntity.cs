using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Domain.Entities
{
    public class AuditedEntity : Entity, IAudited
    {

        #region 构造函数

        protected AuditedEntity()
        {
        }

        #endregion

        #region 属性

        /// <summary>
        /// 创建者Id
        /// </summary>
        public virtual int? CreateId { get; set; }

        public string CreateBy { get; set; }

        /// <summary>
        /// 创建日期
        /// </summary>
        public virtual DateTime? CreateTime { get; set; }

        /// <summary>
        /// 修改者Id
        /// </summary>
        public virtual int? ModifyId { get; set; }

        public string ModifyBy { get; set; }

        /// <summary>
        /// 修改日期
        /// </summary>
        public virtual DateTime? ModifyTime { get; set; }

        #endregion
    }
}
