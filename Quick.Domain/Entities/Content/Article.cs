﻿using Quick.Framework.Tool;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Quick.Domain
{

    [Description("文章")]
    public class Article : FullAuditedEntity
    {
        /// <summary>
        /// 名称
        /// </summary>
        [MaxLength(128)]
        public string Name { get; set; }

        /// <summary>
        /// 文章内容
        /// </summary>
        public string Content { get; set; }

        /// <summary>
        /// 简介
        /// </summary>
        [MaxLength(256)]
        public string Introduction { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        [MaxLength(256)]
        public string Remark{ get; set; }
    }
}