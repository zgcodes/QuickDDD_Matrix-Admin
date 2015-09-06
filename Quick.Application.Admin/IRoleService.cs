using Quick.Framework.Tool;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quick.Application
{
    public interface IRoleService : IServiceBase
    {
        #region 公共方法

        QueryRequestOut<RoleItem> GetAll(RoleQueryInput input);

        IEnumerable<RoleDto> GetList();

        IEnumerable<RoleDto> GetRoleListByUserId(RoleQueryInput input);

        RoleDto GetById(int id);

        void Delete(int id);

        void Create(RoleDto model);

        void Update(RoleDto model);

        RoleSelectedModuleModel GetRoleSelectedModuleModel(int id);

        void SetPermission(SetPermissionInput input);

        RoleSelectedPermissionModel GetPermission(GetPermissionInput input);

        /// <summary>
        /// 获取Index页面按钮集合
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        IList<ButtonModel> GetViewButtons(GetButtonModelInput input);

        #endregion
    }
}