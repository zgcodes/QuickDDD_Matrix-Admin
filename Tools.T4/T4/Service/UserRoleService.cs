﻿// <autogenerated>
//   This file was generated by T4 code generator ServiceCodeScript.tt.
//   Any changes made to this file manually will be lost next time the file is regenerated.
// </autogenerated>

//------------------------------------------------------------------------------
// <auto-generated>
//     此代码由工具生成。
//     对此文件的更改可能会导致不正确的行为，并且如果
//     重新生成代码，这些更改将会丢失。
// </auto-generated>
//
// <copyright file="UserRoleService.cs">
//        生成时间：2015-09-29 00:26
// </copyright>
//------------------------------------------------------------------------------
using Quick.Domain;
using Quick.Framework.Tool;
using Quick.Repositories;
using System.Collections.Generic;
using System.Linq;
using System;

namespace Quick.Application
{
	public class UserRoleService : IUserRoleService
	{
        private readonly IUserRoleRepository _userroleRepository;
		
        public UserRoleService(IUserRoleRepository userroleRepository)
        {
            _userroleRepository = userroleRepository
        }
	}
}
