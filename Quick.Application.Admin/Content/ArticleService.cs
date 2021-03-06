﻿// <autogenerated>
//   This file was generated by T4 code generator CodeScript.tt.
//   Any changes made to this file manually will be lost next time the file is regenerated.
// </autogenerated>

using Quick.Domain;
using Core.Domain.Entities;
using Quick.Repositories;
using System.Collections.Generic;
using System.Linq;
using System;
using Core.Application.Services.Dto;
using Core.Extensions;

namespace Quick.Application
{
    public class ArticleService : IArticleService
    {
        private readonly IArticleRepository _articleRepository;

        public ArticleService(IArticleRepository articleRepository)
        {
            _articleRepository = articleRepository;
        }

        public QueryRequestOut<ArticleItem> GetAll(ArticleQueryInput input)
        {
            return _articleRepository.GetAll()
                .Where(m => !m.IsDeleted)
                .WhereIf(!input.Keywords.IsNullOrWhiteSpace(), m => m.Name.Contains(input.Keywords))
                .ToOutPut<ArticleItem>(input);
        }

        public ArticleDto GetById(int id)
        {
            var entity = _articleRepository.GetById(id);
            return entity.MapTo<ArticleDto>();
        }

        public void Create(ArticleDto model)
        {
            _articleRepository.Insert(model.MapTo<Article>());
        }

        public void Update(ArticleDto model)
        {
            var entity = _articleRepository.GetById(model.Id);
            _articleRepository.Update(model.MapTo(entity));
        }

        public void Delete(int id)
        {
            _articleRepository.Delete(id);
        }

        #region 前端接口

        public List<ArticleItem> GetArticleList(ArticleQueryInput input)
        {
            var query = _articleRepository.GetAll()
                .Where(m => !m.IsDeleted)
                .WhereIf(!input.Keywords.IsNullOrWhiteSpace(), m => m.Name.Contains(input.Keywords))
                .OrderByDescending(m => m.CreateTime).Skip(input.iDisplayStart).Take(input.pageSize)
                .Select(m => new ArticleItem
                {
                    Content = m.Content.Contains("&lt;!--以上是摘要--&gt;") ? m.Content.Substring(0, m.Content.IndexOf("&lt;!--以上是摘要--&gt;")) : m.Introduction,
                    Id = m.Id,
                    Name = m.Name
                });
            return query.ToList();
        }

        #endregion
    }
}
