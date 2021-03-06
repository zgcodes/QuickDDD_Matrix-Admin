﻿using Quick.Domain;
using Core.Domain.Entities;
using Quick.Repositories;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Practices.Unity;
using System;
using Core.Application.Services.Dto;
using Core.Extensions;
using Core.Application.Services;

namespace Quick.Application
{
    /// <summary>
    /// 服务层实现类 —— 
    /// </summary>
    public class ModuleService : ServiceBase, IModuleService
    {
        private readonly IModuleRepository _moduleRepository;
        private readonly IModulePermissionRepository _modulePermissionRepository;
        private readonly IRoleModulePermissionRepository _roleModulePermissionRepository;


        // public IUnitOfWork UnitOfWork { get; set; }
        public ModuleService(IModuleRepository moduleRepository,
             IModulePermissionRepository modulePermissionRepository,
             IRoleModulePermissionRepository roleModulePermissionRepository)
        {
            _moduleRepository = moduleRepository;
            _modulePermissionRepository = modulePermissionRepository;
            _roleModulePermissionRepository = roleModulePermissionRepository;

        }

        #region 公共方法

        public void Create(ModuleDto model)
        {
            if (!string.IsNullOrEmpty(model.LinkUrl) && model.LinkUrl.Split('/').Length == 3)
            {
                string[] link = model.LinkUrl.Split('/');
                model.Area = link[0];
                model.Controller = link[1];
                model.Action = link[2];
            }
            model.Enabled = false;
            _moduleRepository.Insert(model.MapTo<Module>());
        }

        public void Update(ModuleDto model)
        {
            if (!string.IsNullOrEmpty(model.LinkUrl) && model.LinkUrl.Split('/').Length == 3)
            {
                string[] link = model.LinkUrl.Split('/');
                model.Area = link[0];
                model.Controller = link[1];
                model.Action = link[2];
            }
            var entity = _moduleRepository.GetById(model.Id);
            _moduleRepository.Update(model.MapTo(entity));
        }

        public ModuleDto GetById(int id)
        {
            var entity = _moduleRepository.GetById(id);
            return entity.MapTo<ModuleDto>();
        }

        #endregion

        public QueryRequestOut<ModuleItem> GetAll(ModuleQueryInput input)
        {
            return _moduleRepository.GetAll()
                .WhereIf(!input.Keywords.IsNullOrWhiteSpace(),m=>m.Name.Contains(input.Keywords))
                .ToOutPut<ModuleItem>(input);
        }

        public IEnumerable<ModuleDto> GetModuleListByRole(ModuleQueryInput input)
        {  //Title:对于这种input不允许不传值的，直接比较，如果没值，就查不到。
            //传入角色对应的模块ID集合
            var moduleIdList = _roleModulePermissionRepository.GetAll()
                .Where(m => input.RoleIdList.Contains(m.RoleId) && !m.IsDeleted).Select(m => m.ModuleId).Distinct()
                .ToList();
            //先查第一级
            var resulModuleList = _moduleRepository.GetAll().Where(m => moduleIdList.Contains(m.Id) && !m.ParentId.HasValue && !m.IsDeleted).OrderBy(m=>m.OrderSort).MapToList<ModuleDto>();
            //所有的二级
            var childrenModuleList = _moduleRepository.GetAll().Where(m => moduleIdList.Contains(m.Id) && m.ParentId.HasValue && !m.IsDeleted).MapToList<ModuleDto>();
            //循环给第一级添加下级
            foreach (var item in resulModuleList)
            {
                item.ChildModule = childrenModuleList.Where(m => m.ParentId == item.Id).OrderBy(m=>m.OrderSort).ToList();
            }
            return resulModuleList;
        }

        public IQueryable<Module> GetAll()
        {
            return _moduleRepository.GetAll();
        }

        public IEnumerable<ModuleItem> GetParentModuleList()
        {
            var list = _moduleRepository.GetAll().Where(m => !m.ParentId.HasValue && m.IsMenu && m.Enabled == true).MapToList<ModuleItem>();
            return list;
        }

        public void Delete(int id)
        {
            _moduleRepository.Delete(id);
        }

        public void SetButton(SetButtonDto model)
        {
            foreach (var permissionId in model.SelectedPermissionIds)
            {
                var entity = new ModulePermission()
                {
                    PermissionId = permissionId,
                    ModuleId = model.ModuleId
                };
                _modulePermissionRepository.Insert(entity);
            }



        }
    }
}
