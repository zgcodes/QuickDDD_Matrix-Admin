﻿using Quick.Domain;
using Quick.Framework.Tool;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Quick.Application
{
    public class RoleQueryInput : QueryRequestInput
    {
        public int? UserId { get; set; }
    }
}
