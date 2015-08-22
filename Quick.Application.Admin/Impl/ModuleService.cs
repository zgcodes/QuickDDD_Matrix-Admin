using Quick.Domain;
using Quick.Framework.Tool;
using Quick.Repositories;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Practices.Unity;
using System;



namespace Quick.Application
{
    /// <summary>
    /// 服务层实现类 —— 
    /// </summary>
    public class ModuleService : ServiceBase, IModuleService
    {
        private readonly IModuleRepository _moduleRepository;
        private readonly IModulePermissionRepository _modulePermissionRepository;
     


        // public IUnitOfWork UnitOfWork { get; set; }
        public ModuleService(IModuleRepository moduleRepository,
             IModulePermissionRepository modulePermissionRepository)
        {
            _moduleRepository = moduleRepository;
            _modulePermissionRepository = modulePermissionRepository;
           
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
                .ToOutPut<ModuleItem>(input);
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
