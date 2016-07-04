using Quick.Domain;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;

namespace Quick.Repositories
{
    /// <summary>
    /// 数据库初始化策略
    /// </summary>
    public class SampleDataInitializer : CreateDatabaseIfNotExists<QuickDbContext>
    {
        //始化策略满足时执行
        protected override void Seed(QuickDbContext context)
        {
            //用户
            var users = new List<User>
            {
                new User {LoginName = "admin", LoginPwd = "1", FullName="admin", Email = "terrychen@qq.com", Phone ="123456", Enabled = true, IsDeleted = false, PwdErrorCount = 0, LoginCount = 0, RegisterTime = DateTime.Now, LastLoginTime = DateTime.Now, CreateId = 1, CreateTime = DateTime.Now, ModifyId = 1, ModifyTime = DateTime.Now }
            };
            users.ForEach(s => context.Users.Add(s));
            context.SaveChanges();

            //角色
            var roles = new List<Role>
            {
                new Role { Name = "系统管理员", Description = "开发人员、系统配置人员使用", OrderSort = 1, Enabled = true, IsDeleted = false, CreateId = 1, CreateTime = DateTime.Now, ModifyId = 1, ModifyTime = DateTime.Now },
                new Role { Name = "网站管理员", Description = "网站内容管理人员", OrderSort = 2, Enabled = true, IsDeleted = false, CreateId = 1, CreateTime = DateTime.Now, ModifyId = 1, ModifyTime = DateTime.Now }
            };
            roles.ForEach(s => context.Roles.Add(s));
            context.SaveChanges();

            List<Module> moduleList = new List<Module>()
                {
                    new Module()
                    {
                    Id=1,
                    ParentId = 0,
                    Name = "权限管理",
                    ChildModule = new List<Module>()
                    {
                        new Module()
                        {
                        Id=11,
                        ParentId = 1,
                        Name="用户管理",
                        Icon = "icon-cloud",
                        Area = "Account",
                        Controller = "User",
                        Action = "Index",
                        LinkUrl = "Account/User/Index"
                        },
                        new Module()
                        {
                        Id=12,
                        ParentId = 1,
                        Name="模块管理",
                        Icon = "icon-cloud",
                        Area = "Account",
                        Controller = "Module",
                        Action = "Index",
                        LinkUrl = "Account/Module/Index"
                        },
                         new Module()
                        {
                        Id=13,
                        ParentId = 1,
                        Name="角色管理",
                        Icon = "icon-cloud",
                        Area = "Account",
                        Controller = "Role",
                        Action = "Index",
                        LinkUrl = "Account/Role/Index"
                        },
                         new Module()
                        {
                        Id=13,
                        ParentId = 1,
                        Name="权限管理",
                        Icon = "icon-cloud",
                        Area = "Account",
                        Controller = "Permission",
                        Action = "Index"
                        }
                     }
                    },
                     new Module()
                    {
                    Id=2,
                    ParentId = 0,
                    Name="内容管理",
                    Icon = "icon-cloud",
                     ChildModule = new List<Module>()
                    {
                          new Module()
                        {
                        Id=13,
                        ParentId = 1,
                        Name="文章管理",
                        Icon = "icon-cloud",
                        Area = "Content",
                        Controller = "Article",
                        Action = "Index"
                        },
                            new Module()
                        {
                        Id=13,
                        ParentId = 1,
                        Name="文章分类管理",
                        Icon = "icon-cloud",
                        Area = "Content",
                        Controller = "ArticleCategory",
                        Action = "Index"
                        }
                     }
                    }
                };

            moduleList.ForEach(s => context.Module.Add(s));
        }
    }
}
