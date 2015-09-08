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
        private readonly IRoleModulePermissionRepository _roleModulePermissionRepository;
        private readonly IPermissionRepository _permissionRepository;
        private readonly IUserRoleRepository _userRoleRepository;

        // public IUnitOfWork UnitOfWork { get; set; }
        public RoleService(IRoleRepository roleRepository,
               IModulePermissionRepository modulePermissionRepository,
            IRoleModulePermissionRepository roleModulePermissionRepository,
            IModuleRepository moduleRepository,
            IPermissionRepository permissionRepository,
             IUserRoleRepository userRoleRepository)
        {
            _roleRepository = roleRepository;
            _modulePermissionRepository = modulePermissionRepository;
            _roleModulePermissionRepository = roleModulePermissionRepository;
            _moduleRepository = moduleRepository;
            _permissionRepository = permissionRepository;
            _userRoleRepository = userRoleRepository;
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

        public IEnumerable<RoleDto> GetRoleListByUserId(RoleQueryInput input)
        {
            //Title:对于这种input不允许不传值的，直接比较，如果没值，就查不到。
            //这里没用导航属性，用了两次查询，这是避免每次都连表查，查询次数过多，两次查，第一次可以用缓存呢，以后都查单表了
            var roleIdList = _userRoleRepository.GetAll().Where(m => m.UserId == input.UserId).Select(m => m.RoleId).ToList();
            return _roleRepository.GetAll()
                .Where(m => !m.IsDeleted && roleIdList.Contains(m.Id))
                .MapToList<RoleDto>();
        }

        public QueryRequestOut<RoleItem> GetAll(RoleQueryInput input)
        {
            return _roleRepository.GetAll()
                .WhereIf(!input.Keywords.IsNullOrWhiteSpace(),m=>m.Name.Contains(input.Keywords))
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
            var selectedModule = _roleModulePermissionRepository.GetAll().Where(t => t.RoleId == id && t.IsDeleted == false).Select(t => t.ModuleId).ToList();

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

        public RoleSelectedPermissionModel GetPermission(GetPermissionInput input)
        {
            //选中模块
            List<int> selectedModuleId = new List<int>();

            string[] strSelectedModules = input.SelectedModules.Split(',');
            foreach (var Id in strSelectedModules)
            {
                selectedModuleId.Add(Convert.ToInt32(Id));
            }

            //权限列表
            var model = new RoleSelectedPermissionModel();

            model.HeaderPermissionList = _permissionRepository.GetAll().Where(t => t.IsDeleted == false && t.Enabled == true)
                                                        .OrderBy(t => t.OrderSort)
                                                        .Select(t => new PermissionModel
                                                        {
                                                            PermissionId = t.Id,
                                                            PermissionName = t.Name,
                                                            OrderSort = t.OrderSort
                                                        }).ToList();

            //权限列表 (从选中的菜单获取)
            foreach (var moduleId in selectedModuleId.Distinct())
            {
                var module = _moduleRepository.GetAll().FirstOrDefault(t => t.Id == moduleId);

                var modulePermissionModel = new ModulePermissionModel
                {
                    ModuleId = module.Id,
                    ParentId = module.ParentId,
                    ModuleName = module.Name,
                    Code = module.Code
                };

                //所有权限列表
                foreach (var permission in model.HeaderPermissionList)
                {
                    modulePermissionModel.PermissionDataList.Add(new PermissionModel
                    {
                        PermissionId = permission.PermissionId,
                        PermissionName = permission.PermissionName,
                        OrderSort = permission.OrderSort,
                    });
                }

                //模块包含的按钮
                var modulePermission = _modulePermissionRepository.GetAll().Where(t => t.ModuleId == moduleId && t.IsDeleted == false);
                var selectedModulePermission = _roleModulePermissionRepository.GetAll().Where(t => t.RoleId == input.RoleId && t.ModuleId == moduleId && t.IsDeleted == false);

                if (module.ChildModule.Count > 0 && selectedModulePermission.Count() > 0)
                {
                    modulePermissionModel.Selected = true;
                }

                foreach (var mp in modulePermission)
                {
                    var permission = _permissionRepository.GetAll().FirstOrDefault(t => t.Id == mp.PermissionId);

                    foreach (var p in modulePermissionModel.PermissionDataList)
                    {
                        if (p.PermissionId == permission.Id)
                        {
                            //设置Checkbox可用
                            p.Enabled = true;
                            //设置选中
                            var rmp = _roleModulePermissionRepository.GetAll().FirstOrDefault(t => t.RoleId == input.RoleId && t.ModuleId == moduleId && t.PermissionId == permission.Id && t.IsDeleted == false);
                            if (rmp != null)
                            {
                                //设置父节点选中
                                modulePermissionModel.Selected = true;
                                p.Selected = true;
                            }
                        }
                    }

                }
                model.ModulePermissionDataList.Add(modulePermissionModel);
            }

            //权限按照Code排序
            model.ModulePermissionDataList = model.ModulePermissionDataList.OrderBy(t => t.Code).ToList();
            return model;
        }

        public void SetPermission(SetPermissionInput input)
        {
            //选中的模块权限
            var oldModulePermissionList = _roleModulePermissionRepository.GetAll().Where(t => t.RoleId == input.RoleId && t.IsDeleted == false)
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
                    var updateEntity = _roleModulePermissionRepository.GetAll().FirstOrDefault(t => t.RoleId == roleId && t.ModuleId == rmp.ModuleId && t.PermissionId == rmp.PermissionId && t.IsDeleted == false);
                    if (updateEntity != null)
                    {
                        updateEntity.IsDeleted = true;
                        _roleModulePermissionRepository.Update(updateEntity);
                    }
                }
            }
            //插入 & 更新
            if (addModulePermissionList.Count() > 0)
            {
                foreach (var amp in addModulePermissionList)
                {
                    var updateEntity = _roleModulePermissionRepository.GetAll().FirstOrDefault(t => t.RoleId == roleId && t.ModuleId == amp.ModuleId && t.PermissionId == amp.PermissionId && t.IsDeleted == true);
                    if (updateEntity != null)
                    {
                        updateEntity.IsDeleted = false;
                        _roleModulePermissionRepository.Update(updateEntity);
                    }
                    else
                    {
                        var addEntity = new RoleModulePermission
                        {
                            RoleId = roleId,
                            ModuleId = amp.ModuleId,
                            PermissionId = amp.PermissionId
                        };
                        _roleModulePermissionRepository.Insert(addEntity);
                    }
                }
            }

        }

        public IList<ButtonModel> GetViewButtons(GetButtonModelInput input)
        {
            //取到当前控制器对应的模块
            var module = _moduleRepository.GetAll().FirstOrDefault(t => t.Controller.ToLower() == input.Controller && t.ParentId.HasValue && !t.IsDeleted);
            var buttonModelList = new List<ButtonModel>();
            if (module != null)
            {//取得用户在当前模块的权限ID集合
                var permissionIds = _roleModulePermissionRepository.GetAll().Where(t => input.RoleIdList.Contains(t.RoleId) && t.ModuleId == module.Id && !t.IsDeleted).Select(t => t.PermissionId).Distinct();

                foreach (var permissionId in permissionIds)
                {
                    var entity = _permissionRepository.GetAll().FirstOrDefault(t => t.Id == permissionId && t.Enabled == true && !t.IsDeleted);
                    if (entity != null)
                    {
                        var btnButton = new ButtonModel
                        {
                            Icon = entity.Icon,
                            Text = entity.Name,
                            Code = entity.Code
                        };
                        buttonModelList.Add(btnButton);

                    }
                }
            }
            return buttonModelList;
        }
    }
}
