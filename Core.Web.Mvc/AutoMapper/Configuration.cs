using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Core.Web.Mvc.AutoMapper
{
    public static class Configuration
    {
        public static void Configure()
        {
            Mapper.Initialize(cfg =>
            {
                cfg.AddProfile<Profiles.AutoMapperProfile>();
            });

            //Mapper.Initialize(cfg =>
            //{
            //    foreach (
            //        var t in
            //            Assembly.GetAssembly(typeof(Profile))
            //                .GetTypes()
            //                .Where(t => t.IsSubclassOf(typeof(Profile))))
            //    {
            //        cfg.AddProfile((Profile)Activator.CreateInstance(t));
            //    }
            //});
        }
    }
}
