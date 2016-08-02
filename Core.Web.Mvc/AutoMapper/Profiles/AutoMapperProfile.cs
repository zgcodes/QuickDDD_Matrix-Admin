
using AutoMapper;
using Quick.Application;
using Quick.Domain;

namespace Core.Web.Mvc.Profiles
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<User, UserItem>();

            CreateMap<Module, ModuleDto>();
            CreateMap<Module, ModuleItem>();

            CreateMap<Permission, PermissionDto>();
            CreateMap<Permission, PermissionItem>();

            CreateMap<Role, RoleDto>();
            CreateMap<Role, RoleItem>();

            CreateMap<Permission, PermissionDto>();
            CreateMap<Permission, PermissionItem>();

            CreateMap<Article, ArticleDto>();
            CreateMap<Article, ArticleItem>();

            CreateMap<ArticleCategory, ArticleCategoryDto>();
            CreateMap<ArticleCategory, ArticleCategoryItem>();
        }
    }
}