﻿using Core.Application.Services;
using Core.Application.Services.Dto;
using Core.Domain.Entities;
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
        IList<ButtonModel> GetViewButtons(GetUserPermissionInput input);

        /// <summary>
        /// 判断用户是否有某个action的权限，如果action是index，匹配菜单的controller就行
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        bool IsHavaPermission(GetUserPermissionInput input);

        #endregion
    }
}