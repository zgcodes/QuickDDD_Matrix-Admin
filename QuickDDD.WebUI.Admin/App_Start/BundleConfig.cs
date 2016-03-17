using System.Web;
using System.Web.Optimization;

namespace Quick.WebUI.Admin
{
    public class BundleConfig
    {
        // 有关 Bundling 的详细信息，请访问 http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
    //        //公用样式
    //        bundles.Add(new StyleBundle("~/css/base").Include(
    //                  "~/content/bootstrap.css",
    //                  "~/content/bootstrap-theme.css",
    //                  "~/css/modal/bootstrap-modal-bs3patch.css",
    //                  "~/css/modal/bootstrap-modal.css",
    //                  "~/css/modal/modal.css",
    //                  "~/content/font-awesome.css",
    //                  "~/css/site.css"
    //                  ));

    //        //每个文件都引用的基础样式
    //        bundles.Add(new ScriptBundle("~/js/base").Include(
    //                    "~/scripts/jquery-1.11.3.js",
    //                    "~/scripts/bootstrap.js",
    //                    "~/scripts/juicer.js",
    //                    "~/js/site.js",
    //                    "~/scripts/jquery-ui.js",

    //                    "~/Scripts/bootstrap-datetimepicker.zh-CN.js",
    //                    "~/js/bootbox.min.js",
    //                    "~/Scripts/spinjs/spin.js",
    //                    "~/Scripts/spinjs/jquery.spin.js",
    //                    "~/Scripts/jquery.blockUI.js",
    //                    "~/Scripts/toastr.min.js",
    //                    "~/js/abp.js",
    //                    "~/js/abp.jquery.js",
    //                    "~/Scripts/jquery.cookie.js",
    //                    "~/Scripts/jquery.Jcrop.min.js",
    //                    "~/js/site.js"
    //                    ));

    //         <script src="~/scripts/jquery-ui.js"></script>
    //<script src="~/scripts/jqueryDataTables/jquery.dataTables.js"></script>
    //<script src="~/scripts/jqueryDataTables/dataTables.bootstrap.js"></script>
    //<script src="~/scripts/jqueryDataTables/plugin/dataTables.colVis.js"></script>
    //<script src="~/scripts/jqueryDataTables/plugin/dataTables.colReorder.js"></script>
    //<script src="~/scripts/bootstrap-editable.js"></script>
    //<script src="~/js/site-utils.js"></script>
    //<script src="~/js/site-jquery-tables.js"></script>
    //<script src="~/js/site-dialog.js"></script>


    //        //列表页面需引用的js
    //        bundles.Add(new ScriptBundle("~/js/datatables").Include(
    //                    "~/Scripts/jquery.dataTables.min.js",
    //                    "~/js/dataTables.colReorder.min.js",
    //                    "~/js/dataTables.colVis.min.js",
    //                    "~/js/jquery.dataTables.bootstrap.js",
    //                    "~/js/abp.grid.js"
    //                    ));

    //        //表单页面需引用的js
    //        bundles.Add(new ScriptBundle("~/js/form").Include(
    //                  "~/Scripts/jquery.form.min.js",
    //                  "~/Scripts/jquery.validate.js",
    //                  "~/Scripts/jquery.validate.unobtrusive.min.js",
    //                  "~/js/jquery.validate.messages_zh.js",
    //                  "~/js/formextend.js"));
        }
    }
}