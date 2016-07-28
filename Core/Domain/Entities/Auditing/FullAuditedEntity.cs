using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Domain.Entities
{
    /// <summary>
    /// 带假删的实体基类
    /// </summary>
    public class FullAuditedEntity : Entity, IFullAudited, ISoftDelete
    {

        #region 构造函数

        /// <summary>
        ///     数据实体基类
        /// </summary>
        protected FullAuditedEntity()
        {
            IsDeleted = false;
        }

        #endregion

        #region 属性

        /// <summary>
        ///是否删除，逻辑上的删除，非物理删除
        /// </summary>
        public virtual bool IsDeleted { get; set; }

        /// <summary>
        /// 删除日期
        /// </summary>
        public virtual DateTime? DeletedTime { get; set; }

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
