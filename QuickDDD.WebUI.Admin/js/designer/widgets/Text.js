/* author：mien 614573519@qq.com*/
define("widgets/Text",
function (require, exports, module) {
    var WX_Utils = require('utils');
    var WX_Info = require('info');
    var WX_Dom = require('dom');
    var WX_Components = require('components');
    var WX_Validation = require('validation');

    var WX_Widget = {};
    WX_Widget.Text = {
        defaultData: {
            FWidgetCode: "Text",
            FWidgetName: "文字组件",
            FData: {
                HtmlBody: "文字内容"
            }
        },
        validate: {
            HtmlBody: {
                type: "richText",
                attr: "[1, 5000]",
                tips: "请输入1-5000个字的文本内容"
            }
        },
        showWidgetTemplate: function () {
            return ['<section class="wText">',
                ' <article class="content rich-text">$${FData.HtmlBody}</article>',
                "</section>"].join("\n")
        },
        editWidgetTemplate: [
            '<div id="edit-block" class="edit-block container" style="min-height:100px;">',
            '    <div class="form-group">',
           // '        <label>内容：</label><span class="help-inline"></span>',
            '        <div class="controls">',
            '            <textarea id="text_body" style="height:250px" data-tmpldata="HtmlBody">$${FData.HtmlBody}</textarea>',
            '        </div>',
            '    </div>',
            '</div>'].join("\n"),
        //preRenderWidget: function (e) {
        //    if (!e.FBody) return e;
        //    return e;
        //},
        returnWidgetEditData: function ($editNode) {
            var data = {
                FWidgetCode: "Text",
                FData: {
                    HtmlBody: $editNode.find('[data-tmpldata="HtmlBody"]').val()
                }
            };
            return data;
        },
        initWidgetEditNode: function ($showNode, $editNode, data) {
            WX_Components.initUEditorMini($showNode, "text_body", $editNode.find('[data-tmpldata="HtmlBody"]'))
            //WX_Utils.wordLimitTips({
            //    limitObj: [{
            //        limitEle: $('input[data-tmpldata="FTitle"]'),
            //        tipsEle: $('input[data-tmpldata="FTitle"]').parent().prev().find(".help-inline"),
            //        wordMax: 15
            //    }]
            //})
        }
    },
    module.exports = WX_Widget.Text
});