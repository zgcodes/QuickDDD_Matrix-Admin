namespace Quick.Domain.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class 添加审计表 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.AuditInfo",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.Int(),
                        ServiceName = c.String(maxLength: 256),
                        MethodName = c.String(maxLength: 64),
                        Parameters = c.String(),
                        Result = c.String(),
                        ExecutionTime = c.DateTime(nullable: false),
                        ExecutionDuration = c.Long(nullable: false),
                        ClientIpAddress = c.String(maxLength: 256),
                        ClientName = c.String(maxLength: 256),
                        BrowserInfo = c.String(maxLength: 256),
                        Exception = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.AuditInfo");
        }
    }
}
