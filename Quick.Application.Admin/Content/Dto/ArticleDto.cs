﻿// <autogenerated>
//   This file was generated by T4 code generator CodeScript.tt.
//   Any changes made to this file manually will be lost next time the file is regenerated.
// </autogenerated>

using Core.Application.Services.Dto;
using Quick.Domain;
using System;
using System.Collections.Generic;

namespace Quick.Application
{

    public class ArticleDto : DtoBase
    {
        public string Name { get; set; }
        public string Content { get; set; }
        public string Introduction { get; set; }
        public string Remark { get; set; }

    }
}
