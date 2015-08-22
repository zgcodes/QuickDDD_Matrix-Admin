﻿using Quick.Domain;
using Quick.Framework.Tool;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Quick.Application
{
    public interface IModuleService : IServiceBase
    {
        #region 公共方法

        QueryRequestOut<ModuleItem> GetAll(ModuleQueryInput input);

        IQueryable<Module> GetAll();

        ModuleDto GetById(int id);

        void Delete(int id);

        void Create(ModuleDto model);

        void Update(ModuleDto model);

        /// <summary>
        /// 获取一级菜单列表
        /// </summary>
        /// <returns></returns>
        IEnumerable<ModuleItem> GetParentModuleList();

        #endregion

        void SetButton(SetButtonDto model);
    }
}