using Quick.Domain;
using Quick.Repositories;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition.Hosting;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Data.Entity;
using Microsoft.Practices.Unity;
using Autofac;
using Quick.Framework.Tool;
using Autofac.Integration.Mvc;
using Quick.Application;
using System.Reflection;
using UtilLibrary;
using Castle.DynamicProxy;
using Autofac.Extras.DynamicProxy2;

namespace Quick.WebUI.Admin
{
    // 注意: 有关启用 IIS6 或 IIS7 经典模式的说明，
    // 请访问 http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);


            //Ninject，设置Controller工厂
            //ControllerBuilder.Current.SetControllerFactory(new NinjectControllerFactory());


            //Unity注入 Ioc
            //IUnityContainer container = new DependencyRegisterType().GetUnityContainer();
            //DependencyResolver.SetResolver(new UnityDependencyResolver(container));

            //autofac自动注入
            this.register();

            //指定初始化策略
            //Database.SetInitializer(new SampleDataInitializer());
            //也可换种写法：封装个静态方法，把上句封装起来，或者在QuickDbContext的构造函数中指定
            //DatabaseInitializer.Initialize();

            //using (var context = new QuickDbContext())
            //{
            //    context.Database.Initialize(true);
            //}


        }
        private void register()
        {

            //最原始的根据接口和类注入
            //var builder = new ContainerBuilder();
            //builder.RegisterType<UserService>().As<IUserService>();
            //builder.RegisterType(typeof(UserRepository)).As(typeof(IUserRepository));
            //builder.RegisterControllers(Assembly.GetExecutingAssembly());
            //var container = builder.Build();
            //DependencyResolver.SetResolver(new AutofacDependencyResolver(container));  



            //根据程序集批量注入
            var builder = new ContainerBuilder();

            //注册泛型，并且可以构造函数注入
            //builder.RegisterGeneric(typeof(EfRepositoryBase<>)).As(typeof(IRepository<>)).InstancePerDependency();

            //控制器注入
            builder.RegisterControllers(Assembly.GetExecutingAssembly());
           
            builder.RegisterFilterProvider();


            //这里一个一个程序集获取，没用上面的Assembly.GetExecutingAssembly()或者AppDomain.CurrentDomain.GetAssemblies()
            //来获取程序集数组，因为获取不到，原因不明
            var dataAccessAssembly = Assembly.Load("Quick.Application");
            var dataAccessAssembly2 = Assembly.Load("Quick.Repositories");
            var dataAccessAssembly3 = Assembly.Load("Quick.Domain");

            builder.RegisterAssemblyTypes(dataAccessAssembly, dataAccessAssembly2, dataAccessAssembly3)
                .EnableInterfaceInterceptors().InterceptedBy(typeof(Interceptor))
                .Where(t => typeof(IDependency).IsAssignableFrom(t)).AsImplementedInterfaces()
                .InstancePerLifetimeScope();//InstancePerLifetimeScope 保证对象生命周期基于请求

            builder.RegisterType<Interceptor>();
            var container = builder.Build();


            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }

    }
}