using Quick.Domain;
using Core.Domain.Entities;
using Quick.Repositories;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Practices.Unity;
using System;
using Core.Extensions;
using Core.Application.Services.Dto;
using Core.Application.Services;

namespace Quick.Application
{
	/// <summary>
    /// 服务层实现类 —— 
    /// </summary>
    public class PermissionService : ServiceBase, IPermissionService 

    {
        private readonly IPermissionRepository _permissionRepository;

       // public IUnitOfWork UnitOfWork { get; set; }
        public PermissionService(IPermissionRepository permissionRepository)
        {
            _permissionRepository = permissionRepository;
        }
        
        #region 公共方法

        public void Create(PermissionDto model)
        {
            _permissionRepository.Insert(model.MapTo<Permission>());
        }

        public void Update(PermissionDto model)
        {
            var entity = _permissionRepository.GetById(model.Id);
            _permissionRepository.Update(model.MapTo(entity));
        }

        public PermissionDto GetById(int id)
        {
            var entity = _permissionRepository.GetById(id);
            return entity.MapTo<PermissionDto>();
        }

        public IEnumerable<PermissionItem> GetList()
        {
            return _permissionRepository.GetAll().MapToList<PermissionItem>();
                    
        }

        public QueryRequestOut<PermissionItem> GetAll(PermissionQueryInput input)
        {
            return _permissionRepository.GetAll()
                .WhereIf(!input.Keywords.IsNullOrWhiteSpace(),m=>m.Name.Contains(input.Keywords))
                .ToOutPut<PermissionItem>(input);
        }

        public void Delete(int id)
        {
            _permissionRepository.Delete(id);
        }

        #endregion
    }
}
