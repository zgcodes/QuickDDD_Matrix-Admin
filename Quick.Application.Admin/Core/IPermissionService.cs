using Quick.Framework.Tool;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quick.Application
{
    public interface IPermissionService : IServiceBase
    {
        #region 公共方法

        QueryRequestOut<PermissionItem> GetAll(PermissionQueryInput input);

        IEnumerable<PermissionItem> GetList();

        PermissionDto GetById(int id);

        void Delete(int id);

        void Create(PermissionDto model);

        void Update(PermissionDto model);

        #endregion
    }
}