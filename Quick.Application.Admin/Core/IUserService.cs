﻿using Quick.Domain;
using Core.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using Core.Application.Services.Dto;
using Core.Application.Services;

namespace Quick.Application
{
	/// <summary>
    /// 服务层接口 —— IUserService
    /// </summary>
    public interface IUserService : IServiceBase
    {
        #region 公共方法

        OperationResult Login(UserDto model);

        QueryRequestOut<UserItem> GetAll(UserQueryInput input);

        UserDto GetById(int id);

        void Delete(int id);

        void Create(UserDto model);

        void Update(UserDto model);

        #endregion
	}
}
