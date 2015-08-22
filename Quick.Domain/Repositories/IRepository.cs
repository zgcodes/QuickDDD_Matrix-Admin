
using Quick.Framework.Tool;
using System.Collections.Generic;
using System.Linq;

namespace Quick.Domain
{
    // 仓储接口
    public interface IRepository<TEntity> :IDependency
        where TEntity :Entity
    {
        IQueryable<TEntity> GetAll();

        TEntity GetById(object id);

        void Insert(TEntity entity);

        void Delete(object id);

        void DeleteList(List<int> idList);

        void Delete(TEntity entityToDelete);

        void Update(TEntity entityToUpdate);
    }
}
