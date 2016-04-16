using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Quick.Resources.Web.Startup))]
namespace Quick.Resources.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {

        }
    }
}
