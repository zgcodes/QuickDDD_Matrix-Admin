using Quick.Framework.Tool;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace System.Linq
{
    public static class IQueryableExtensions
    {
        /// <summary>
        /// 分页查询(## this IQueryable<TEntity> queryable，说明是扩展的IQueryable<TEntity>类型的方法)
        /// 泛型方法，由调用方确定的类型，都是放在方法名<这里>来声明的。如扩展方法类型，参数类型
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="queryable"></param>
        /// <param name="input"></param>
        /// <returns></returns>
        //public static IQueryable<TEntity> Query<TEntity>(this IQueryable<TEntity> queryable, QueryRequestInput input)
        //{
        //    return queryable.OrderBy(m=>input.order).Skip(input.SkipCount).Take(input.rows);
        //}

        /// <summary>
        /// 分页并返回封装的结果
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="queryable"></param>
        /// <param name="input"></param>
        /// <returns></returns>
        public static QueryRequestOut<T> ToOutPut<T>(this IQueryable<object> queryable, QueryRequestInput input)
        {

            //Type tType = typeof(T);
            //Type type = typeof(QueryRequestOut<>);
            //type = type.MakeGenericType(tType);
            //QueryRequestOut<T> result = (QueryRequestOut<T>)Activator.CreateInstance(type);
            //上面这四句可以反射生成对象，之前以为静态方法不能new对象，是我想多了。。

            QueryRequestOut<T> result = new QueryRequestOut<T>();
            //分页
            var newQueryable = queryable.OrderBy(m => input.order).Skip(input.iDisplayStart).Take(input.pageSize);
            IList<object> list = newQueryable.ToList();
            result.pageData = list.MapToList<T>().ToArray();
            result.pageCount = queryable.Count();//总页数
            return result;
        }
    }
}