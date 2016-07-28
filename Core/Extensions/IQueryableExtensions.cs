using Core.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace Core.Extensions
{
    public static class IQueryableExtensions
    {
        /// <summary>
        /// 分页并返回封装的结果
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="queryable"></param>
        /// <param name="input"></param>
        /// <returns></returns>
        public static QueryRequestOut<T> ToOutPut<T>(this IQueryable<object> queryable, QueryRequestInput input)
        {

            QueryRequestOut<T> result = new QueryRequestOut<T>();
            //分页
            var newQueryable = queryable.OrderBy(m => input.order).Skip(input.iDisplayStart).Take(input.pageSize);
            List<object> list = newQueryable.ToList();
            result.pageData = list.MapToList<T>().ToArray();
            result.pageCount = queryable.Count();//总页数
            return result;
        }
    }
}