﻿using Quick.Application;
using Quick.WebUI.Admin.Controllers;
using System.Linq;
using System.Web.Mvc;

namespace Quick.WebUI.Admin.Areas.Content
{

    public class ArticleController : BaseController
    {
        private readonly IArticleService _articleService;

        public ArticleController(IArticleService articleService)
        {
            _articleService = articleService;
        }
        
        [AdminLayout]
        public ActionResult Index()
        {
            return View();
        }

        [PermissionValidation(false)]
        public JsonResult List(ArticleQueryInput input)
        {
            var list = _articleService.GetAll(input);
            return ToJson(list);
        }

        [PermissionValidation(false)]
        public ActionResult Edit(int? id)
        {
            ArticleDto model = null;
            if (!id.HasValue)  //新建
            {
                model = new ArticleDto();
            }
            else  //编辑
            {
                model = _articleService.GetById(id.Value);
            }
            return View(model);
        }

        public JsonResult Delete(int id)
        {
            _articleService.Delete(id);
            return Json(1, JsonRequestBehavior.AllowGet);
        }

        [ValidateInput(false)]
        [PermissionValidation(false)]
        public JsonResult CreateOrUpdate(ArticleDto model)
        {
            if (model.Id == 0)
            {
                this.Create(model);
            }
            else
            {
                this.Update(model);
            }
            return Json(1, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Create(ArticleDto model)
        {
            _articleService.Create(model);
            return Json(1, JsonRequestBehavior.AllowGet);

        }

        public JsonResult Update(ArticleDto model)
        {
            _articleService.Update(model);
            return Json(1, JsonRequestBehavior.AllowGet);

        }
    }
}
