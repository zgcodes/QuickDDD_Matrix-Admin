using Core.Domain.Entities;
using Quick.Domain;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Linq;


namespace Quick.Repositories
{
    public class EfRepositoryBase<TEntity> : IRepository<TEntity>
        where TEntity : Entity
    {
        internal QuickDbContext context;
        internal DbSet<TEntity> dbSet;

        public EfRepositoryBase(QuickDbContext context)
        {
            this.context = context;
            this.dbSet = context.Set<TEntity>();//如果DbSet不用泛型，定义了DbSet entity，那就是：context.entity

        }

        public virtual IQueryable<TEntity> GetAll()
        {
            //DbSet<TEntity> 实现了IQueryable<TEntity>接口，但是IQueryable<TEntity>的方法更多，查询更强大，所以返回IQueryable<TEntity>类型数据
            IQueryable<TEntity> query = dbSet;
            return query;
        }

        public virtual TEntity GetById(object id)
        {
            return dbSet.Find(id);
        }

        public virtual void Insert(TEntity entity)
        {
            if (entity is IAudited)
            {
                (entity as IAudited).CreateTime = DateTime.Now;
            }
            dbSet.Add(entity);
            context.SaveChanges();
            //TODO:提交数据库。注意，如果多次“数据操作（insert，undate,delete）”后再提交这一个公用的context，
            //就可以作为事务了，
            //所以，在这里保存不合适,
            //需要用工作单元来保存
            DetachedAllEntities();
        }

        public virtual void Delete(object id)
        {
            TEntity entity = dbSet.Find(id);
            Delete(entity);
        }

        public virtual void DeleteList(List<int> idList)
        {
            foreach (int id in idList)
            {
                TEntity entity = dbSet.Find(id);
                Delete(entity);
            }
        }

        public virtual void Delete(TEntity entity)
        {
            //假删
            if (entity is ISoftDelete)
            {   //  TODO:这里用了Udate，可能不太好
                (entity as ISoftDelete).IsDeleted = true;
                Update(entity);
            }
            else
            {
                //真删
                //EntityState.Detached:对象存在，但没有被跟踪。 在创建实体之后、但将其添加到对象上下文之前，该实体处于此状态
                if (context.Entry(entity).State == EntityState.Detached)
                {
                    AttachIfNot(entity);
                }
                dbSet.Remove(entity);
                context.SaveChanges();
                DetachedAllEntities();
            }

        }

        public virtual void Update(TEntity entity)
        {
            DetachedAllEntities();
            AttachIfNot(entity);
            context.Entry(entity).State = EntityState.Modified;//设为待保存状态
            context.SaveChanges();//保存
        }

        protected virtual void AttachIfNot(TEntity entity)
        {
            if (!dbSet.Local.Contains(entity))
            {
                ////将给定实体附加到集的基础上下文中。 也就是说，将实体以“未更改”的状态放置到上下文中，就好像从数据库读取了该实体一样。
                //Attach 用于在上下文中重新填充数据库中已存在的实体。 SaveChanges 不会尝试将已附加的实体插入到数据库中，因为假定该实体存在于数据库中。 
                //请注意，上下文中已处于其他状态的实体会将它们的状态设置为“未更改”。 如果该实体在上下文中已处于“未更改”状态，则 Attach 不执行任何操作。
                dbSet.Attach(entity);
            }
        }

        /// <summary>
        /// 清空DB上下文中所有缓存的实体对象
        /// </summary>
        private void DetachedAllEntities()
        {
            var objectContext = ((IObjectContextAdapter)context).ObjectContext;
            List<ObjectStateEntry> entries = new List<ObjectStateEntry>();
            var states = new[] { EntityState.Added, EntityState.Deleted, EntityState.Modified, EntityState.Unchanged };
            foreach (var state in states)
            {
                entries.AddRange(objectContext.ObjectStateManager.GetObjectStateEntries(state));
            }

            foreach (var item in entries)
            {
                objectContext.Detach(item.Entity);
            }
        }
    }
}