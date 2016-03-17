/**
 * 作者：yujinjin9@126.com
 * 时间：2015-10-25
 * 描述：设计器的图文组件
 */
define(["api", "designerUtils", "render", "components", "template"], function (api, designerUtils, render, components, template) {
	var info = render.info, dom = render.dom;
    var Image = {
        defaultData: {
            FWidgetCode: "Image",
            FType: "image",
            FWidgetName: "图片组件",
            FData: {
                Title: '',
                TitleShow: 0,
                PicUrl: '',
                LinkDisplay: '',
                LinkSrc: '',
                LinkUrl: ''
            },
            FStyle: {
                Margin: 0,
                BoxShadow: "",
                BorderRadius: "",
                ShowHtmlEditor: "",
                CssHtml: ""
            }
        },
        validate: {
            length: {
                type: "length",
                attr: function (data) {
                    return data.FData.PicUrl == null || data.FData.PicUrl == "" ? false : true;
                },
                tips: "请上传图片"
            }
        },
        showWidgetTemplate: function () {
            return ['<section class="wImage ${FWidgetId}">',
            '<style>',
            'section.wImage.${FWidgetId} {',
            '  padding: ${FStyle.Margin|padding};',
            '}',
            'section.wImage.${FWidgetId} img {',
            '  {@if (FStyle.BoxShadow)}box-shadow: ${FStyle.BoxShadow};-webkit-box-shadow:${FStyle.BoxShadow};{@/if}',
            '  {@if (FStyle.BorderRadius)}border-radius: ${FStyle.BorderRadius};{@/if}',
            '}',
            '$${FStyle.CssHtml}',
            '</style>',
            '{@if count == 0}<div class="message">图片组件：请上传图片。</div>{@else}',
            '{@if FData.LinkUrl}<a href="${FData.LinkUrl}">{@/if}<img src="${FData.PicUrl|picurl}" width="100%">{@if FData.LinkUrl}</a>{@/if}',
            '{@if FData.TitleShow == 1}<div class="title">$${FData.Title}</div>{@/if}',
            "{@/if}",
            "</section>"].join("\n")
        },
        editWidgetTemplate: [
            '<div id="edit-block" class="edit-block container" data-widget-id="${FWidgetId}" style="min-height:100px;">',
            '     <div class="numhint help-block"></div>',
            '    <dl class="edit-block-row">',
            '        <dt class="delete-btn" title="删除"></dt>',
            '        <dd class="row">',
            '            <div class="col-xs-3" style="width:105px">',
            '                <div class="image-box" title="点击此处设置背景图"><div style="width:90px;height:90px;"></div><input type="hidden" data-tmpldata="PicUrl" value="${FData.PicUrl}" /></div>',
            '            </div>',
            '            <div class="col-xs-9">',
            '                <div class="form-group">',
            '                    <label>图片标题：</label><span class="help-inline">（限20个字）</span>',
            '                    <div class="controls">',
            '                        <input class="form-control inline" type="text" maxlength="20" name="Title" style="width:250px;" data-tmpldata="Title" value="$${FData.Title}" placeholder="请输入标题">',
            '                        <label><input name="TitleShow" type="checkbox" class="ace" data-tmpldata="TitleShow" {@if FData.TitleShow == 1}checked{@/if}><span class="lbl">显示</span></label>',
            '                    </div>',
            '                </div>',
            '                <div class="form-group">',
            '                    <label>图片链接：</label><span class="help-inline">（点击下框进行设置）</span>',
            '                    <div class="controls outlink">',
            '                        <input class="form-control link-src" type="text" readonly data-tmpldata="LinkDisplay" value="${FData.LinkDisplay}">',
            '                        <input type="hidden" data-tmpldata="LinkSrc" value="${FData.LinkSrc}">',
            '                        <input type="hidden" data-tmpldata="LinkUrl" value="${FData.LinkUrl}">',
            '                    </div>',
            '                </div>',
            '            </div>',
            '        </dd>',
            '    </dl>',
            '     <div style="margin-bottom:10px;">',
            '     <div class="numhint help-block"></div>',
            '     <div class="help-block">建议图片宽度为720像素，200K以下JPG、PNG格式</div>',
            '     </div>',
            '</div>'].join("\n"),
        styleWidgetTemplate: [
            '<div id="style-block" class="form-horizontal container style-block">',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">外边距：</label>',
            '        <div class="col-xs-9" id="margin">',
            '        </div>',
            '    </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">阴影：</label>',
            '        <div class="col-xs-4 controls">',
            '            <select class="form-control input-xsmall" id="box_shadow" data-selected="${FStyle.BoxShadow}">',
            '<option value="">无</option>',
            '<option value="1px 1px 4px #999">浅</option>',
            '<option value="1px 1px 5px #666">中</option>',
            '<option value="1px 1px 5px #333">深</option>',
            '            </select>',
            '        </div>',
            '        <div class="col-xs-5"><span class="help-block">（需设置外边距才有效果）</span></div>',
            '    </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">圆角：</label>',
            '        <div class="col-xs-4 controls">',
            '            <select class="form-control input-xsmall inline" id="border_radius" data-selected="${FStyle.BorderRadius}">',
            '<option value="">不圆角</option>',
            '<option value="4px">4px</option>',
            '<option value="6px">6px</option>',
            '<option value="8px">8px</option>',
            '<option value="10px">10px</option>',
            '<option value="15px">15px</option>',
            '<option value="20px">20px</option>',
            '<option value="30px">30px</option>',
            '<option value="1000px">半圆</option>',
            '<option value="50%">全圆</option>',
            '            </select>',
            '        </div>',
            '        <div class="col-xs-5"><span class="help-block"></span></div>',
            '    </div>',
            '   <div class="edit-block-split"></div>',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">其他选项：</label>',
            '	    <div class="col-xs-9 controls">',
            '	        <label><input id="showHtmlEditor" class="ace" type="checkbox" {@if (FStyle.ShowHtmlEditor=="1")}checked{@/if}  /><span class="lbl">显示高级扩展</span></label> (仅针对程序人员！)',
            '	    </div>',
            '	</div>',
            '	<div class="form-group stylehtml {@if (FStyle.ShowHtmlEditor!="1")}hide{@/if}">',
            '	    <div class="controls">',
            '	    <div class="red">请注意：如果在这里随意填写，将导致页面显示混乱！</div>',
            '	        <textarea id="txt_html" class="input-xxlarge" rows="15">{@if (FStyle.CssHtml=="")}/*section.wImage.${FWidgetId} { }*/{@else}$${FStyle.CssHtml}{@/if}</textarea>',
            '	    </div>',
            '	</div>',
            '</div>'].join("\n"),
        preRenderWidget: function (data) {
            data.count = data.FData.PicUrl ? 1 : 0;
            return data;
        },
        // 做组件初始化事件绑定等
        initWidgetEditNode: function ($showNode, $editNode, data) {
            var $this = this;

            var limitObjs = [];
            $.each(dom.getEditNode().find('input[data-tmpldata="Title"]'), function (i, ele) {
                limitObj = {};
                limitObj.limitEle = $(ele);
                limitObj.tipsEle = $(ele).closest('.form-group').find(".help-inline");
                limitObj.wordMax = 20;
                limitObjs.push(limitObj);
            });
            //剩余字数提示
            designerUtils.wordLimitTips({
                limitObj: limitObjs
            });
            //设置图片框点击上传
            components.initImageBox(".image-box", $showNode, $editNode);
            //设置链接
            components.initOutLink(".outlink", $showNode, $editNode);
            //------------初始化样式设置控件状态-------------------------
            var $stylePanel = dom.getStylePanel();
            //外边距
            components.initPadding('#margin', $showNode, $editNode, data.FStyle.Margin, { min: 0, max: 300, step: 1 });
            $stylePanel.find("#border_radius").val(data.FStyle.BorderRadius);
            $stylePanel.find("#box_shadow").val(data.FStyle.BoxShadow);
            $("#showHtmlEditor").change(function () {
                $(".stylehtml").toggleClass('hide');
            });
        },
        returnWidgetEditData: function ($editNode) {
            var tmp = designerUtils.modelData($editNode, "Title TitleShow PicUrl LinkDisplay LinkSrc LinkUrl", false);
            data = {
                FWidgetCode: 'Image',
                FWidgetId: $editNode.find("#edit-block").data("widget-id"),
                FData: {
                    Title: tmp.Title,
                    TitleShow: tmp.TitleShow,
                    PicUrl: tmp.PicUrl,
                    LinkDisplay: tmp.LinkDisplay,
                    LinkSrc: tmp.LinkSrc,
                    LinkUrl: tmp.LinkUrl
                }
            };
            var $stylePanel = dom.getStylePanel();
            data.FStyle = {
                Margin: designerUtils.getPadding('#margin'),
                BoxShadow: $("#box_shadow").val(),
                BorderRadius: $("#border_radius").val(),
                ShowHtmlEditor: $("#showHtmlEditor").prop('checked') ? 1 : 0,
                CssHtml: $("#txt_html").val()
            };
            return data;
        }
    }
    return Image;
});