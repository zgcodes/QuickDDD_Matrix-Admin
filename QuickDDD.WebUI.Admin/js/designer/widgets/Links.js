/* author：mien 614573519@qq.com*/
define("widgets/Links",
function (require, exports, module) {
    var WX_Utils = require('utils');
    var WX_Info = require('info');
    var WX_Dom = require('dom');
    var WX_Components = require('components');
    var WX_Validation = require('validation');

    var WX_Widget = {};
    WX_Widget.Links = {
        defaultData: {
            FWidgetCode: 'Links',
            FWidgetName: "链接组件",
            FData: {
                LinksUrl: [{
                    LinkTitle: "文字链接",
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: ""
                }]
            },
            FStyle: {
                BgImage: "",
                BgColor: "",
                Margin: 0,
                Padding: {
                    iseach: 1,
                    t: 5,
                    b: 5,
                    l: 10,
                    r: 10
                },
                BoxShadow: "",
                BorderRadius: "",
                TextSize: "14px",
                TextLineHeight: "1.8",
                TextAlign: "left",
                TextColor: "#3d85c6",
                TextBold: "",
                TextWrap: 1,
                ShowHtmlEditor: "",
                CssHtml: ""
            }
        },
        validate: {
            LinkTitle: {
                type: "text",
                attr: "[1,30]",
                tips: "请输入1-30个文字作为链接的标题"
            },
            length: {
                type: "length",
                attr: function (e) {
                    return e.FData.LinksUrl && e.FData.LinksUrl.length >= 1;
                },
                tips: "请至少添加一个链接"
            }
        },
        showWidgetTemplate: function () {
            return ['<section class="wLinks ${FWidgetId}">',
            '<style>',
            'section.wLinks.${FWidgetId} {',
            '  padding: ${FStyle.Margin|padding};',
            '}',
            'section.wLinks.${FWidgetId} div.content {',
            '  {@if (FStyle.BgImage.CssText)}$${FStyle.BgImage.CssText|csstext};{@/if}',
            '  {@if (FStyle.BgColor)}background-color: ${FStyle.BgColor};{@/if}',
            '  {@if (FStyle.BoxShadow)}box-shadow: ${FStyle.BoxShadow};-webkit-box-shadow:${FStyle.BoxShadow};{@/if}',
            '  {@if (FStyle.BorderRadius)}border-radius: ${FStyle.BorderRadius};{@/if}',
            '  {@if (FStyle.TextAlign)}text-align: ${FStyle.TextAlign};{@/if}',
            '  padding: ${FStyle.Padding|padding};',
            '}',
            'section.wLinks.${FWidgetId} a {',
            '  {@if (FStyle.TextSize)}font-size: ${FStyle.TextSize};{@/if}',
            '  {@if (FStyle.TextLineHeight)}line-height:  ${FStyle.TextLineHeight};{@/if}',
            '  {@if (FStyle.TextColor)}color: ${FStyle.TextColor};{@/if}',
            '  {@if (FStyle.TextBold==1)}font-weight:bold;{@/if}',
            '  {@if (FStyle.TextWrap==1)}display:table;{@/if}',
            '}',
            '$${FStyle.CssHtml}',
            '</style>',
             '<div class="content">',
             '{@if count == 0}<div class="message">链接组件：请添加链接。</div>{@else}',
             '{@each FData.LinksUrl as FLink, index}',
             '<a {@if (FLink.LinkUrl != "")}href="${FLink.LinkUrl}"{@/if}>${FLink.LinkTitle}</a>',
             '{@/each}',
             '{@/if}',
             '</div>',
             '</section>'].join("\n")
        },
        editWidgetTemplate: ['<div id="edit-block" class="edit-block container" data-widget-id="${FWidgetId}" style="min-height:100px;">',
            '    {@if count > 0}',
            '    {@each FData.LinksUrl as FLink}',
            '    <dl class="edit-block-row sortable">',
            '        <dt class="delete-btn" title="删除"></dt>',
            '        <dd class="row">',
            '                <div class="form-group">',
            '                    <label>标题：<span class="asterisk">*</span></label><span class="help-inline">（限30个字）</span>',
            '                    <div class="controls">',
            '                        <input class="form-control" type="text" maxlength="30" name="LinkTitle" data-tmpldata="LinkTitle" value="$${FLink.LinkTitle}" placeholder="请输入标题">',
            '                    </div>',
            '                </div>',
            '                <div class="form-group">',
            '                    <label>链接：</label><span class="help-inline">（点击下框进行设置）</span>',
            '                    <div class="controls outlink">',
            '                        <input class="form-control link-src" type="text" readonly data-tmpldata="LinkDisplay" value="${FLink.LinkDisplay}">',
            '                        <input type="hidden" data-tmpldata="LinkSrc" value="${FLink.LinkSrc}">',
            '                        <input type="hidden" data-tmpldata="LinkUrl" value="${FLink.LinkUrl}">',
            '                    </div>',
            '                </div>',
            '        </dd>',
            '    </dl>',
            '    {@/each}',
            '    {@/if}',
            '    <div style="margin-bottom:10px;"><button class="btn btn-default add-link" type="button"><i class="icon-plus"></i> 添加链接 </button></div>',
            '</div>'].join("\n"),

        styleWidgetTemplate: [
            '<div id="style-block" class="form-horizontal container style-block">',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">背景图：</label>',
            '        <div class="col-xs-4 controls">',
            '	        <div id="bgbox" class="bgimg-box" title="点击此处设置背景图">',
            '	            <input class="bgimg-data" type="hidden" value="$${FStyle.BgImage.Data}" />',
            '	            <input class="bgimg-csstext" type="hidden" value="${FStyle.BgImage.CssText}" />',
            '            </div>',
            '	        <button class="bgimg-delbtn btn btn-default btn-sm hide">清除</button>',
            '        </div>',
            '        <div class="col-xs-5"><span class="help-block">（点击图片框上传图片）</span></div>',
            '    </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">背景色：</label>',
            '        <div class="col-xs-4 controls">',
            '	        <input class="form-control input-mini" id="bgcolor" readonly type="text" value="${FStyle.BgColor}" />',
            '        </div>',
            '        <div class="col-xs-5"><span class="help-block">（可以设置为透明）</span></div>',
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
            '        <div class="col-xs-5"><span class="help-block">（仅对彩色图片图标有效）</span></div>',
            '    </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">外边距：</label>',
            '        <div class="col-xs-9" id="margin">',
            '        </div>',
            '    </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">内边距：</label>',
            '        <div class="col-xs-9" id="padding">',
            '        </div>',
            '    </div>',
            '   <div class="edit-block-split"></div>',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">文字大小：</label>',
            '	    <div class="col-xs-9 controls">',
            '	      <select class="form-control input-xsmall" id="text_size" data-selected="${FStyle.TextSize}">',
            '	    	  <option value="12px">12px</option>',
            '	          <option value="14px">14px</option>',
            '	          <option value="16px">16px</option>',
            '	          <option value="18px">18px</option>',
            '	          <option value="20px">20px</option>',
            '	          <option value="24px">24px</option>',
            '	          <option value="30px">30px</option>',
            '	          <option value="36px">36px</option>',
            '	      </select>',
            '	    </div>',
            '	</div>',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">文字行高：</label>',
            '	    <div class="col-xs-9 controls">',
            '	      <select class="form-control input-xsmall" id="text_lineheight">',
            '	          <option value="1">特小</option>',
            '	    	  <option value="1.4">小</option>',
            '	    	  <option value="1.8">中</option>',
            '	          <option value="2.5">大</option>',
            '	          <option value="3">特大</option>',
            '	      </select>',
            '	    </div>',
            '	</div>',
            '  <div class="form-group hide">',
            '      <label class="col-xs-3 control-label">文字对齐：</label>',
            '      <div class="col-xs-9 controls">',
            '          <div class="btn-group btn-group-sm" data-toggle="buttons">',
            '              <label class="btn btn-default {@if (FStyle.TextAlign=="left")}active{@/if}"><input name="text_align" type="radio" {@if (FStyle.TextAlign=="left")}checked="checked"{@/if} data-tmpldata="text_align" value="left" title="居左"><i class="icon-paragraph-left2"></i></label>',
            '              <label class="btn btn-default {@if (FStyle.TextAlign=="center")}active{@/if}"><input name="text_align" type="radio" {@if (FStyle.TextAlign=="center")}checked="checked"{@/if} data-tmpldata="text_align" value="center" title="居中"><i class="icon-paragraph-center2"></i></label>',
            '              <label class="btn btn-default {@if (FStyle.TextAlign=="right")}active{@/if}"><input name="text_align" type="radio" {@if (FStyle.TextAlign=="right")}checked="checked"{@/if} data-tmpldata="text_align" value="right" title="居右"><i class="icon-paragraph-right2"></i></label>',
            '          </div>',
            '      </div>',
            '  </div>',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">文字颜色：</label>',
            '	    <div class="col-xs-9 controls">',
            '	        <input class="form-control input-mini" id="text_color" readonly type="text" value="${FStyle.TextColor}" />',
            '	    </div>',
            '	</div>',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">文字加粗：</label>',
            '	    <div class="col-xs-9 controls">',
            '	        <label><input id="text_bold" class="ace" type="checkbox" {@if (FStyle.TextBold==1)}checked{@/if}  /><span class="lbl">加粗</span></label>',
            '	    </div>',
            '	</div>',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">文字换行：</label>',
            '	    <div class="col-xs-9 controls">',
            '	        <label><input id="text_wrap" class="ace" type="checkbox" {@if (FStyle.TextWrap==1)}checked{@/if}  /><span class="lbl">换行</span></label>',
            '	    </div>',
            '	</div>',
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
            '	        <textarea id="txt_html" class="input-xxlarge" rows="15">{@if (FStyle.CssHtml=="")}/*section.wLinks.${FWidgetId} { }*/{@else}$${FStyle.CssHtml}{@/if}</textarea>',
            '	    </div>',
            '	</div>',
            '</div>'].join("\n"),

        preRenderWidget: function (data) {
            data.count = typeof (data.FData.LinksUrl) == "undefined" ? 0 : data.FData.LinksUrl.length;
            return data;
        },
        initWidgetShowNode: function (e) {
        },
        // 做组件初始化事件绑定等
        initWidgetEditNode: function ($showNode, $editNode, data) {
            var $this = this;
            $editNode.find(".delete-btn").click(function () {
                $removeNode = $(this).parent(".edit-block-row"),
                WX_Utils.confirm("您确定删除此链接吗？", $this.removeLink, { args: $removeNode })
            }),
            $editNode.sortable({
                items: ".sortable",
                axis: "y",
                distance: 5,
                stop: function () {
                    var e = WX_Dom.getShowNode();
                    e.trigger("refresh")
                }
            }),
            $(".add-link").click(function () {
                $this.addLink();
            });
            var limitObjs = [];
            $.each(WX_Dom.getEditNode().find('input[data-tmpldata="LinkTitle"]'), function (i, ele) {
                limitObj = {};
                limitObj.limitEle = $(ele);
                limitObj.tipsEle = $(ele).closest('.form-group').find(".help-inline");
                limitObj.wordMax = 30;
                limitObjs.push(limitObj);
            })

            //剩余字数提示
            WX_Utils.wordLimitTips({
                limitObj: limitObjs
            });

            //设置链接
            WX_Components.initOutLink(".outlink", $showNode, $editNode);

            //------------初始化样式设置控件状态-------------------------
            var $stylePanel = WX_Dom.getStylePanel();

            $stylePanel.find("#box_shadow").val(data.FStyle.BoxShadow);
            $stylePanel.find("#border_radius").val(data.FStyle.BorderRadius);
            $stylePanel.find("#text_size").val(data.FStyle.TextSize);
            $stylePanel.find("#text_lineheight").val(data.FStyle.TextLineHeight);

            WX_Components.colorInput($stylePanel.find("#bgcolor"));
            WX_Components.colorInput($stylePanel.find("#text_color"));

            //标题栏背景图
            WX_Components.initBgImage('#bgbox', $showNode, $editNode);

            //外边距
            WX_Components.initPadding('#margin', $showNode, $editNode, data.FStyle.Margin, { min: 0, max: 300, step: 1 });

            //内边距
            WX_Components.initPadding('#padding', $showNode, $editNode, data.FStyle.Padding, { min: 0, max: 300, step: 1 });

            $("#showHtmlEditor").change(function () {
                $(".stylehtml").toggleClass('hide');
            })

        },
        returnWidgetEditData: function ($editNode) {
            var tmp = WX_Utils.modelData($editNode, "LinkTitle LinkDisplay LinkSrc LinkUrl", true),
            n = tmp.LinkTitle.length,
            data = {
                FWidgetCode: 'Links',
                FWidgetId: $editNode.find("#edit-block").data("widget-id"),
                FData: {
                    LinksUrl: []
                }
            };
            for (var i = 0; i < n; i++) {
                var FImg = {
                    LinkTitle: tmp.LinkTitle[i],
                    LinkDisplay: tmp.LinkDisplay[i],
                    LinkSrc: tmp.LinkSrc[i],
                    LinkUrl: tmp.LinkUrl[i]
                };
                data.FData.LinksUrl.push(FImg);
            }

            var $stylePanel = WX_Dom.getStylePanel();

            data.FStyle = {
                BgImage: WX_Components.getBgImage('#bgbox'),
                BgColor: $("#bgcolor").val(),
                Margin: WX_Components.getPadding('#margin'),
                Padding: WX_Components.getPadding('#padding'),
                BoxShadow: $("#box_shadow").val(),
                BorderRadius: $("#border_radius").val(),
                TextSize: $("#text_size").val(),
                TextLineHeight: $("#text_lineheight").val(),
                TextAlign: WX_Utils.getRadioValue($stylePanel, "text_align"),
                TextColor: $("#text_color").val(),
                TextBold: $("#text_bold").prop('checked') ? 1 : 0,
                TextWrap: $("#text_wrap").prop('checked') ? 1 : 0,
                ShowHtmlEditor: $("#showHtmlEditor").prop('checked') ? 1 : 0,
                CssHtml: $("#txt_html").val()
            };
            //console.log(data);
            return data;
        },
        addLink: function () {
            $editNode = WX_Dom.getEditNode();
            t = ['<input type="hidden" data-tmpldata="LinkTitle" value="${FLink.LinkTitle}"/>', '<input type="hidden" data-tmpldata="LinkDisplay" value="${FLink.LinkDisplay}"/>', '<input type="hidden" data-tmpldata="LinkSrc" value="${FLink.LinkSrc}"/>', '<input type="hidden" data-tmpldata="LinkUrl" value="${FLink.LinkUrl}"/>'].join("\n"),
            n = {
                FLink: {
                    LinkTitle: "文字链接",
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: ""
                }
            },
            r = WX_Utils.tmpl(t, n);
            setTimeout(function () {
                $editNode.find("#edit-block").append(r);
                var e = WX_Dom.getShowNode();
                e.trigger("refresh");
                e.trigger("refreshEdit");
            }, 50)
        },
        removeLink: function (result, e) {
            if (!result) return;
            var t = this;
            e.remove();
            var n = WX_Dom.getShowNode();
            n.trigger("refresh");
        }
    },
    module.exports = WX_Widget.Links
});