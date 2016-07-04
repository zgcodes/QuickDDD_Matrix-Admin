using Quick.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Quick.WebUI.Member.Controllers
{
    public class ArticleController : ApiController
    {
        private readonly IArticleService _articleService;

        public ArticleController(IArticleService articleService)
        {
            _articleService = articleService;
        }

        // GET api/<controller>
        [HttpGet]
        public dynamic GetArticle(int id)
        {
            var result = _articleService.GetById(id);
            return result;
        }

        // POST api/<controller>/5
        [HttpPost]
        public dynamic GetArticleList(ArticleQueryInput input)
        {
            return _articleService.GetArticleList(input);
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }
    }
}