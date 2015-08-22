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
    /// 服务层实现类 —— UserService
    /// </summary>
    public class UserService : ServiceBase,IUserService 
    {

        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IUserRoleRepository _userRoleRepository;
       // public IUnitOfWork UnitOfWork { get; set; }

        public UserService(IUserRepository userRepository,
            IRoleRepository roleRepository,
            IUserRoleRepository userRoleRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _userRoleRepository = userRoleRepository;
        }
        
        #region 公共方法

        public void Create(UserDto model)
        {
            model.PwdErrorCount = 0;
            model.LoginCount = 0;
            model.RegisterTime = DateTime.Now;
            var entity = model.MapTo<User>();

            foreach (int roleId in model.SelectedRoleIds)
            {
                if (_roleRepository.GetAll().Any(t => t.Id == roleId))
                {
                    entity.UserRole.Add(
                        new UserRole()
                        {
                            UserId = entity.Id,
                            RoleId = roleId,
                            CreateId = entity.CreateId,
                            CreateBy = entity.CreateBy,
                            CreateTime = DateTime.Now,
                            ModifyId = entity.ModifyId,
                            ModifyBy = entity.ModifyBy,
                            ModifyTime = DateTime.Now
                        });
                }
            }

            _userRepository.Insert(entity);
        }

        public void Update(UserDto model)
        {
            var entity = _userRepository.GetById(model.Id);
            entity = model.MapTo(entity);
            //删除之前的中间数据（改成真删）
            var oldUserRoleIds = _userRoleRepository.GetAll().Where(m => m.IsDeleted == false && m.UserId == entity.Id).Select(m => m.Id).ToList();
            _userRoleRepository.DeleteList(oldUserRoleIds);
            
            var newRoleIds = model.SelectedRoleIds.ToList();

            foreach (var newRoleId in newRoleIds)
            {
                var userRole = new UserRole()
                {
                    UserId = entity.Id,
                    RoleId = newRoleId,
                    CreateId = entity.CreateId,
                    CreateBy = entity.CreateBy,
                    CreateTime = DateTime.Now,
                    ModifyId = entity.ModifyId,
                    ModifyBy = entity.ModifyBy,
                    ModifyTime = DateTime.Now
                };
                _userRoleRepository.Insert(userRole);

            }
            _userRepository.Update(entity);
        }

        public UserDto GetById(int id) {
            var entity = _userRepository.GetById(id);


            return entity.MapTo<UserDto>();
        }

        public QueryRequestOut<UserItem> GetAll(UserQueryInput input)
        {
            return _userRepository.GetAll()
                .Where(m=>!m.IsDeleted)
                .WhereIf(!string.IsNullOrWhiteSpace(input.LoginName), m => m.LoginName.Contains(input.LoginName))
                .ToOutPut<UserItem>(input);
        }


        public void Delete(int id)
        {
            _userRepository.Delete(id);
        }

        #endregion

        //<summary>
         //用户登录
         //</summary>
        public OperationResult Login(UserDto model)
        {

            User user = _userRepository.GetAll().Where(m => m.LoginName == model.LoginName).FirstOrDefault();
            if (user == null)
            {
                return new OperationResult(OperationResultType.QueryNull, "指定账号的用户不存在。");
            }
            if (user.LoginPwd != model.LoginPwd)
            {
                return new OperationResult(OperationResultType.Warning, "登录密码不正确。");
            }
            return new OperationResult(OperationResultType.Success, "登录成功。", user);
        }


	}
}
