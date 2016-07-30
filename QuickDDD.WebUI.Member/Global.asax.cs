using Autofac;
using Autofac.Integration.WebApi;
using Core.Dependency;
using Core.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace Quick.WebUI.Member
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


            var configuration = GlobalConfiguration.Configuration;
            #region Autofac WebAPI注入
            var builder = new ContainerBuilder();
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            builder.RegisterAssemblyTypes(Assembly.GetExecutingAssembly()).AsImplementedInterfaces().AsSelf();


            //这里一个一个程序集获取，没用上面的Assembly.GetExecutingAssembly()或者AppDomain.CurrentDomain.GetAssemblies()
            //来获取程序集数组，因为获取不到，原因不明
            var dataAccessAssembly = Assembly.Load("Quick.Application");
            var dataAccessAssembly2 = Assembly.Load("Quick.Repositories");
            var dataAccessAssembly3 = Assembly.Load("Quick.Domain");
            builder.RegisterAssemblyTypes(dataAccessAssembly, dataAccessAssembly2, dataAccessAssembly3)
                .Where(t => typeof(IDependency).IsAssignableFrom(t)).AsImplementedInterfaces().InstancePerLifetimeScope();//InstancePerLifetimeScope 保证对象生命周期基于请求
            var container = builder.Build();

           // DependencyResolver.SetResolver(new AutofacWebApiDependencyResolver(container));

            configuration.DependencyResolver = new AutofacWebApiDependencyResolver(container);
            #endregion

        }

    }
}