﻿namespace Core.Domain.Entities
{
    public class Entity
    {

        #region 构造函数

        /// <summary>
        ///     数据实体基类
        /// </summary>
        protected Entity()
        {
        }

        #endregion

        #region 属性

        public virtual int Id { get; set; }

       
        #endregion
    }
}
