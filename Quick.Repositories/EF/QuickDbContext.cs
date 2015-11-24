
using Quick.Domain;
using Quick.Framework.Tool;
using System.ComponentModel.Composition;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using EntityFramework.DynamicFilters;

namespace Quick.Repositories
{
    /// <summary>
    ///     QuickDDD项目数据访问上下文
    /// </summary>
    public class QuickDbContext : DbContext
    {
        #region 构造函数

        /// <summary>
        ///     初始化一个 使用连接名称为“default”的数据访问上下文类 的新实例
        /// </summary>
        public QuickDbContext()
            : base("default") { }

        /// <summary>
        /// 初始化一个 使用指定数据连接名称或连接串 的数据访问上下文类 的新实例
        /// </summary>
        public QuickDbContext(string nameOrConnectionString)
            : base(nameOrConnectionString) {  }

        #endregion

        #region Core模块  (针对每个聚合根都会定义一个DbSet的属性)

        public DbSet<Role> Roles { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<UserRole> UserRoles { get; set; }

        public DbSet<Module> Module { get; set; }

        public DbSet<Permission> Permission { get; set; }

        public DbSet<ModulePermission> ModulePermission { get; set; }

        public DbSet<RoleModulePermission> RoleModulePermission { get; set; }

        #endregion

        #region Content模块

        public DbSet<Article> Article { get; set; }

        public DbSet<ArticleCategory> ArticleCategory { get; set; }

        #endregion

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //base.OnModelCreating(modelBuilder);

            //modelBuilder.Filter("SoftDelete", (ISoftDelete d) => d.IsDeleted, false);

            modelBuilder.Entity<User>().ToTable("Auth_User");
            modelBuilder.Entity<Role>().ToTable("Auth_Role");
            modelBuilder.Entity<Module>().ToTable("Auth_Module");
            modelBuilder.Entity<Permission>().ToTable("Auth_Permission");
            modelBuilder.Entity<UserRole>().ToTable("Auth_UserRole");
            modelBuilder.Entity<ModulePermission>().ToTable("Auth_ModulePermission");
            modelBuilder.Entity<RoleModulePermission>().ToTable("Auth_RoleModulePermission");

            modelBuilder.Entity<Article>().ToTable("Content_Article");
            modelBuilder.Entity<ArticleCategory>().ToTable("Content_ArticleCategory");

            //移除一对多的级联删除约定，想要级联删除可以在 EntityTypeConfiguration<TEntity>的实现类中进行控制
            //modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
            //多对多启用级联删除约定，不想级联删除可以在删除前判断关联的数据进行拦截
            //modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();
            //移除复数表名的契约，这里也用不到，因为我们是自定义表明，不使用契约
            //modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }

    }
}