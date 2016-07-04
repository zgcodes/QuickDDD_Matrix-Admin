namespace Quick.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class quickddd : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Content_Article",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(maxLength: 128),
                        Content = c.String(),
                        Introduction = c.String(maxLength: 256),
                        Remark = c.String(maxLength: 256),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedTime = c.DateTime(),
                        CreateId = c.Int(),
                        CreateBy = c.String(),
                        CreateTime = c.DateTime(),
                        ModifyId = c.Int(),
                        ModifyBy = c.String(),
                        ModifyTime = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Content_ArticleCategory",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(maxLength: 128),
                        Remark = c.String(maxLength: 256),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedTime = c.DateTime(),
                        CreateId = c.Int(),
                        CreateBy = c.String(),
                        CreateTime = c.DateTime(),
                        ModifyId = c.Int(),
                        ModifyBy = c.String(),
                        ModifyTime = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Auth_Module",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ParentId = c.Int(),
                        Name = c.String(),
                        LinkUrl = c.String(),
                        Area = c.String(),
                        Controller = c.String(),
                        Action = c.String(),
                        Icon = c.String(),
                        Code = c.String(),
                        OrderSort = c.Int(nullable: false),
                        Description = c.String(),
                        IsMenu = c.Boolean(nullable: false),
                        Enabled = c.Boolean(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedTime = c.DateTime(),
                        CreateId = c.Int(),
                        CreateBy = c.String(),
                        CreateTime = c.DateTime(),
                        ModifyId = c.Int(),
                        ModifyBy = c.String(),
                        ModifyTime = c.DateTime(),
                        ParentModule_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Auth_Module", t => t.ParentModule_Id)
                .Index(t => t.ParentModule_Id);
            
            CreateTable(
                "dbo.Auth_ModulePermission",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ModuleId = c.Int(nullable: false),
                        PermissionId = c.Int(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedTime = c.DateTime(),
                        CreateId = c.Int(),
                        CreateBy = c.String(),
                        CreateTime = c.DateTime(),
                        ModifyId = c.Int(),
                        ModifyBy = c.String(),
                        ModifyTime = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Auth_Module", t => t.ModuleId, cascadeDelete: true)
                .ForeignKey("dbo.Auth_Permission", t => t.PermissionId, cascadeDelete: true)
                .Index(t => t.ModuleId)
                .Index(t => t.PermissionId);
            
            CreateTable(
                "dbo.Auth_RoleModulePermission",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        RoleId = c.Int(nullable: false),
                        ModuleId = c.Int(nullable: false),
                        PermissionId = c.Int(),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedTime = c.DateTime(),
                        CreateId = c.Int(),
                        CreateBy = c.String(),
                        CreateTime = c.DateTime(),
                        ModifyId = c.Int(),
                        ModifyBy = c.String(),
                        ModifyTime = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Auth_Module", t => t.ModuleId, cascadeDelete: true)
                .ForeignKey("dbo.Auth_Permission", t => t.PermissionId)
                .ForeignKey("dbo.Auth_Role", t => t.RoleId, cascadeDelete: true)
                .Index(t => t.RoleId)
                .Index(t => t.ModuleId)
                .Index(t => t.PermissionId);
            
            CreateTable(
                "dbo.Auth_Permission",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Code = c.String(),
                        Name = c.String(),
                        OrderSort = c.Int(nullable: false),
                        Icon = c.String(),
                        Description = c.String(),
                        Enabled = c.Boolean(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedTime = c.DateTime(),
                        CreateId = c.Int(),
                        CreateBy = c.String(),
                        CreateTime = c.DateTime(),
                        ModifyId = c.Int(),
                        ModifyBy = c.String(),
                        ModifyTime = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Auth_Role",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Description = c.String(),
                        OrderSort = c.Int(nullable: false),
                        Enabled = c.Boolean(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedTime = c.DateTime(),
                        CreateId = c.Int(),
                        CreateBy = c.String(),
                        CreateTime = c.DateTime(),
                        ModifyId = c.Int(),
                        ModifyBy = c.String(),
                        ModifyTime = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Auth_UserRole",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(nullable: false),
                        RoleId = c.Int(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedTime = c.DateTime(),
                        CreateId = c.Int(),
                        CreateBy = c.String(),
                        CreateTime = c.DateTime(),
                        ModifyId = c.Int(),
                        ModifyBy = c.String(),
                        ModifyTime = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Auth_Role", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.Auth_User", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.Auth_User",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        LoginName = c.String(),
                        LoginPwd = c.String(),
                        FullName = c.String(),
                        Email = c.String(),
                        Phone = c.String(),
                        Enabled = c.Boolean(nullable: false),
                        PwdErrorCount = c.Int(nullable: false),
                        LoginCount = c.Int(nullable: false),
                        RegisterTime = c.DateTime(),
                        LastLoginTime = c.DateTime(),
                        IsDeleted = c.Boolean(nullable: false),
                        DeletedTime = c.DateTime(),
                        CreateId = c.Int(),
                        CreateBy = c.String(),
                        CreateTime = c.DateTime(),
                        ModifyId = c.Int(),
                        ModifyBy = c.String(),
                        ModifyTime = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Auth_UserRole", "UserId", "dbo.Auth_User");
            DropForeignKey("dbo.Auth_RoleModulePermission", "RoleId", "dbo.Auth_Role");
            DropForeignKey("dbo.Auth_UserRole", "RoleId", "dbo.Auth_Role");
            DropForeignKey("dbo.Auth_RoleModulePermission", "PermissionId", "dbo.Auth_Permission");
            DropForeignKey("dbo.Auth_ModulePermission", "PermissionId", "dbo.Auth_Permission");
            DropForeignKey("dbo.Auth_RoleModulePermission", "ModuleId", "dbo.Auth_Module");
            DropForeignKey("dbo.Auth_ModulePermission", "ModuleId", "dbo.Auth_Module");
            DropForeignKey("dbo.Auth_Module", "ParentModule_Id", "dbo.Auth_Module");
            DropIndex("dbo.Auth_UserRole", new[] { "RoleId" });
            DropIndex("dbo.Auth_UserRole", new[] { "UserId" });
            DropIndex("dbo.Auth_RoleModulePermission", new[] { "PermissionId" });
            DropIndex("dbo.Auth_RoleModulePermission", new[] { "ModuleId" });
            DropIndex("dbo.Auth_RoleModulePermission", new[] { "RoleId" });
            DropIndex("dbo.Auth_ModulePermission", new[] { "PermissionId" });
            DropIndex("dbo.Auth_ModulePermission", new[] { "ModuleId" });
            DropIndex("dbo.Auth_Module", new[] { "ParentModule_Id" });
            DropTable("dbo.Auth_User");
            DropTable("dbo.Auth_UserRole");
            DropTable("dbo.Auth_Role");
            DropTable("dbo.Auth_Permission");
            DropTable("dbo.Auth_RoleModulePermission");
            DropTable("dbo.Auth_ModulePermission");
            DropTable("dbo.Auth_Module");
            DropTable("dbo.Content_ArticleCategory");
            DropTable("dbo.Content_Article");
        }
    }
}
