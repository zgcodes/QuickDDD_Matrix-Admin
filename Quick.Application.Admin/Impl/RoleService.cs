using Quick.Domain;
using Quick.Framework.Tool;
using Quick.Repositories;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Practices.Unity;
using System;
using Newtonsoft.Json;



namespace Quick.Application
{
	/// <summary>
    /// 服务层实现类 —— 
    /// </summary>
    public class RoleService : ServiceBase, IRoleService 
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IModuleRepository _moduleRepository;
        private readonly IModulePermissionRepository _modulePermissionRepository;
        private readonly IRoleModulePermissionRepository _roleModulePermission;

       // public IUnitOfWork UnitOfWork { get; set; }
        public RoleService(IRoleRepository roleRepository,
               IModulePermissionRepository modulePermissionRepository,
            IRoleModulePermissionRepository roleModulePermission,
            IModuleRepository moduleRepository)
        {
            _roleRepository = roleRepository;
            _modulePermissionRepository = modulePermissionRepository;
            _roleModulePermission = roleModulePermission;
            _moduleRepository = moduleRepository;
        }
        
        #region 公共方法

        public void Create(RoleDto model)
        {
            _roleRepository.Insert(model.MapTo<Role>());
        }

        public void Update(RoleDto model)
        {
            var entity = _roleRepository.GetById(model.Id);
            _roleRepository.Update(model.MapTo(entity));
        }

        public RoleDto GetById(int id)
        {
            var entity = _roleRepository.GetById(id);
            return entity.MapTo<RoleDto>();
        }

        public IEnumerable<RoleDto> GetList()
        {
            return _roleRepository.GetAll()
                .Where(m => !m.IsDeleted)
                .MapToList<RoleDto>();
        }

        public QueryRequestOut<RoleItem> GetAll(RoleQueryInput input)
        {
            return _roleRepository.GetAll()
                .ToOutPut<RoleItem>(input);
        }

        public void Delete(int id)
        {
            _roleRepository.Delete(id);
        }

        #endregion

        public RoleSelectedModuleModel GetRoleSelectedModuleModel(int id)
        {
            //角色 - 菜单
            var model = new RoleSelectedModuleModel();
            #region 角色
            var role = this.GetById(id);
            model.RoleId = role.Id;
            model.RoleName = role.Name;
            #endregion

            #region 菜单
            //菜单列表
            model.ModuleDataList = _moduleRepository.GetAll().Where(m => m.IsMenu && !m.IsDeleted && m.Enabled)
                                .Select(t => new ModuleModel
                                {
                                    ModuleId = t.Id,
                                    ParentId = t.ParentId,
                                    ModuleName = t.Name,
                                    Code = t.Code,
                                }).OrderBy(t => t.Code).ToList();

            //选中菜单
            var selectedModule = _roleModulePermission.GetAll().Where(t => t.RoleId == id && t.IsDeleted == false).Select(t => t.ModuleId).ToList();

            //对比菜单
            foreach (var item in model.ModuleDataList)
            {
                if (selectedModule.Contains(item.ModuleId))
                {
                    //选中此菜单
                    item.Selected = true;
                }
            }
            #endregion

            return model;
        }

        public void SetPermission(SetPermissionInput input)
        {
        //选中的模块权限
            var oldModulePermissionList = _roleModulePermission.GetAll().Where(t => t.RoleId == input.RoleId && t.IsDeleted == false)
                                                .Select(t => new RoleModulePermissionModel
                                                {
                                                    RoleId = t.RoleId,
                                                    ModuleId = t.ModuleId,
                                                    PermissionId = t.PermissionId
                                                }).ToList();

            var newModulePermissionList = JsonConvert.DeserializeObject<List<RoleModulePermissionModel>>(input.MewModulePermission);
                var sameModulePermissionList = oldModulePermissionList.Intersect(newModulePermissionList);
                var addModulePermissionList = newModulePermissionList.Except(sameModulePermissionList);
                var removeModulePermissionList = oldModulePermissionList.Except(sameModulePermissionList);

             this.SetRoleModulePermission(input.RoleId, addModulePermissionList, removeModulePermissionList);
        }

        public void SetRoleModulePermission(int roleId, IEnumerable<RoleModulePermissionModel> addModulePermissionList, IEnumerable<RoleModulePermissionModel> removeModulePermissionList)
        {
            //逻辑删除
            if (removeModulePermissionList.Count() > 0)
            {
                foreach (var rmp in removeModulePermissionList)
                {
                    var updateEntity = _roleModulePermission.GetAll().FirstOrDefault(t => t.RoleId == roleId && t.ModuleId == rmp.ModuleId && t.PermissionId == rmp.PermissionId && t.IsDeleted == false);
                    if (updateEntity != null)
                    {
                        updateEntity.IsDeleted = true;
                        _roleModulePermission.Update(updateEntity);
                    }
                }
            }
            //插入 & 更新
            if (addModulePermissionList.Count() > 0)
            {
                foreach (var amp in addModulePermissionList)
                {
                    var updateEntity = _roleModulePermission.GetAll().FirstOrDefault(t => t.RoleId == roleId && t.ModuleId == amp.ModuleId && t.PermissionId == amp.PermissionId && t.IsDeleted == true);
                    if (updateEntity != null)
                    {
                        updateEntity.IsDeleted = false;
                        _roleModulePermission.Update(updateEntity);
                    }
                    else
                    {
                        var addEntity = new RoleModulePermission
                        {
                            RoleId = roleId,
                            ModuleId = amp.ModuleId,
                            PermissionId = amp.PermissionId
                        };
                        _roleModulePermission.Insert(addEntity);
                    }
                }
            }

        } 
    }
}
