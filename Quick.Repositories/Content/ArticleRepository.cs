﻿// <autogenerated>
//   This file was generated by T4 code generator CodeScript.tt.
//   Any changes made to this file manually will be lost next time the file is regenerated.
// </autogenerated>

using System;
using System.Linq;
using Quick.Domain;
using System.Collections.Generic;

namespace Quick.Repositories
{
	public class ArticleRepository : EfRepositoryBase<Article>, IArticleRepository
	{
        public ArticleRepository()
            : base(new QuickDbContext())
        { }
	}
}
