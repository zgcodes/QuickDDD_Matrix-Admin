/* author：mien 614573519@qq.com*/
define("widgets/HtmlBlock",
function (require, exports, module) {
    var WX_Utils = require('utils');
    var WX_Info = require('info');
    var WX_Dom = require('dom');
    var WX_Components = require('components');
    var WX_Validation = require('validation');

    var WX_Widget = {};
    WX_Widget.HtmlBlock = {
        defaultData: {
            FWidgetCode: "HtmlBlock",
            FWidgetName: "Html块组件",
            FHtml: ""
        },
        showWidgetTemplate: function () {
            return ['<section class="htmlblock">',
                "$${FHtml}",
                "</section>"].join("\n")
        },
        editWidgetTemplate: [
            '<div id="edit-block" class="edit-block container" style="min-height:100px;">',
            '    <textarea id="umeditor" class="txt_html input-xxlarge" rows="15">$${FHtml}</textarea>',
            '</div>'].join("\n"),
        returnWidgetEditData: function (node) {
            //var tmp = WX_Utils.modelData(node, "FHtml"),
            data = {
                FWidgetCode: 'HtmlBlock',
                FHtml: $(".txt_html").val()
                //FHtml: um.getContent()
            };
            //console.log(data.FHtml);
            return data;
        },
        // 做组件初始化事件绑定等
        initWidgetEditNode: function ($showNode, $editNode, showNodeData) {
            //um = UM.getEditor('umeditor');
        }
    },
    module.exports = WX_Widget.HtmlBlock
});