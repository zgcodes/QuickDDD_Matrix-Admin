/* author：mien 614573519@qq.com*/
define('widgets/Button', function (require, exports, module) {
    var WX_Utils = require('utils');
    var WX_Info = require('info');
    var WX_Dom = require('dom');
    var WX_Components = require('components');
    var WX_Validation = require('validation');

    var WX_Widget = {};

    WX_Widget.Button = {
        defaultData: {
            FWidgetCode: 'Button',
            FWidgetName: '按钮组件',
            FData: {
                Title: '首页',
                Icon: 'micon-home',
                LinkDisplay: "",
                LinkSrc: "",
                LinkUrl: ""
            },
            FStyle: {
                BgImage: "",
                BgColor: "#6fa8dc",
                Margin: 0,
                Padding: 8,
                Align: "left",
                BoxShadow: "",
                BorderRadius: "",
                IconBorderRadius: "",
                IconSize: "16px",
                IconColor: "#fff",
                TextSize: "14px",
                TextColor: "#fff",
                TextBold: "",
                ShowHtmlEditor: "",
                CssHtml: ""
            }
        },
        // 字段校验规则
        validate: {
            'Title': {
                type: 'text',
                attr: '[0, 30]',
                tips: '请输入0-30个字的标题'
            }
        },
        // 必须存在的key
        // 手机内显示模板
        showWidgetTemplate: function () {
            return [
			'<section class="wButton ${FWidgetId}">',
            '<style>',
            'section.wButton.${FWidgetId} {',
            '  padding: ${FStyle.Margin|padding};',
            '}',
            'section.wButton.${FWidgetId} a {',
            '  {@if (FStyle.BgImage.CssText)}$${FStyle.BgImage.CssText|csstext};{@/if}',
            '  {@if (FStyle.BgColor)}background-color: ${FStyle.BgColor};{@/if}',
            '  {@if (FStyle.BoxShadow)}box-shadow: ${FStyle.BoxShadow};-webkit-box-shadow:${FStyle.BoxShadow};{@/if}',
            '  {@if (FStyle.BorderRadius)}border-radius: ${FStyle.BorderRadius};{@/if}',
            '  text-align: ${FStyle.Align};',
            '  padding: ${FStyle.Padding|padding};',
            '}',
            'section.wButton.${FWidgetId} .divicon {',
            '  font-size: ${FStyle.IconSize};',
            '  color: ${FStyle.IconColor};',
            '}',
            'section.wButton.${FWidgetId} .divicon > img {',
            '  width:${FStyle.IconSize};height:${FStyle.IconSize};',
            '  {@if (FStyle.IconBorderRadius)}border-radius: ${FStyle.IconBorderRadius};background-color:${FStyle.IconColor};{@/if}',
            '}',
            'section.wButton.${FWidgetId} .divtext {',
            '    font-size: ${FStyle.TextSize};',
            '    color:  ${FStyle.TextColor};',
            '  {@if (FStyle.TextBold==1)}font-weight:bold;{@/if}',
            '}',
            '$${FStyle.CssHtml}',
            '</style>',
            '<a {@if (FData.LinkUrl != "")}href="${FData.LinkUrl}"{@/if}>',
            '   <div class="divicon">$${FData.Icon|icon}</div>',
            '   <div class="divtext">${FData.Title}</div>',
            '</a>',
            '</section>'
            ].join("\n");
        },
        // 属性框模板
        editWidgetTemplate: [
            '<div id="edit-block" class="edit-block container" data-widget-id="${FWidgetId}" style="min-height:100px;">',
            '        <div class="row">',
            '            <div class="col-xs-2" style="width:80px">',
            '<label>图标</label>',
            '<div class="icon-box" title="点击选择图标">$${FData.Icon|icon}</div>',
            '<input type="hidden" data-tmpldata="Icon" value="${FData.Icon}" />',
            '            </div>',
            '            <div class="col-xs-8">',
            '<div class="form-group">',
            '    <label>标题文字<span class="asterisk">*</span></label><span class="help-inline">（限30个字）</span>',
            '    <div class="controls">',
            '        <input class="form-control" type="text" maxlength="30" data-tmpldata="Title" value="$${FData.Title}" placeholder="请输入标题文字">',
            '    </div>',
            '</div>',
            '<div class="form-group">',
            '    <label>链接地址</label><span class="help-inline">（如需链接，请点击下框进行设置）</span>',
            '    <div class="controls outlink">',
            '        <input class="form-control link-src" type="text" readonly data-tmpldata="LinkDisplay" value="${FData.LinkDisplay}">',
            '        <input type="hidden" data-tmpldata="LinkSrc" value="${FData.LinkSrc}">',
            '        <input type="hidden" data-tmpldata="LinkUrl" value="${FData.LinkUrl}">',
            '    </div>',
            '</div>',
            '            </div>',
            '        </div>',
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
            '  <div class="form-group">',
            '      <label class="col-xs-3 control-label">对齐方式：</label>',
            '      <div class="col-xs-9 controls">',
            '          <div class="btn-group btn-group-sm" data-toggle="buttons">',
            '              <label class="btn btn-default {@if (FStyle.Align=="left")}active{@/if}"><input name="text_align" type="radio" {@if (FStyle.Align=="left")}checked="checked"{@/if} data-tmpldata="text_align" value="left" title="居左"><i class="icon-paragraph-left2"></i></label>',
            '              <label class="btn btn-default {@if (FStyle.Align=="center")}active{@/if}"><input name="text_align" type="radio" {@if (FStyle.Align=="center")}checked="checked"{@/if} data-tmpldata="text_align" value="center" title="居中"><i class="icon-paragraph-center2"></i></label>',
            '              <label class="btn btn-default {@if (FStyle.Align=="right")}active{@/if}"><input name="text_align" type="radio" {@if (FStyle.Align=="right")}checked="checked"{@/if} data-tmpldata="text_align" value="right" title="居右"><i class="icon-paragraph-right2"></i></label>',
            '          </div>',
            '      </div>',
            '  </div>',
            '   <div class="edit-block-split"></div>',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">图标大小：</label>',
            '	    <div class="col-xs-9 controls">',
            '	      <select class="form-control input-xsmall" id="icon_size" data-selected="${FStyle.IconSize}">',
            '	    	  <option value="16px">小</option>',
            '	          <option value="24px">中</option>',
            '	          <option value="32px">大</option>',
            '	          <option value="48px">加大</option>',
            '	          <option value="64px">特大</option>',
            '	      </select>',
            '	    </div>',
            '	</div>',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">图标颜色：</label>',
            '	    <div class="col-xs-4 controls">',
            '	        <input class="form-control input-mini" id="icon_color" readonly type="text" value="${FStyle.IconColor}" />',
            '	    </div>',
            '       <div class="col-xs-5"><span class="help-block">（仅对单色文字图标有效）</span></div>',
            '	</div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">图标圆角：</label>',
            '        <div class="col-xs-4 controls">',
            '            <select class="form-control input-xsmall inline" id="icon_border_radius" data-selected="${FStyle.IconBorderRadius}">',
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
            '	        <textarea id="txt_html" class="input-xxlarge" rows="15">{@if (FStyle.CssHtml=="")}/*section.wButton.${FWidgetId} { }*/{@else}$${FStyle.CssHtml}{@/if}</textarea>',
            '	    </div>',
            '	</div>',
            '</div>'].join("\n"),
        initWidgetShowNode: function ($showNode) {

        },
        // 做组件初始化事件绑定等
        initWidgetEditNode: function ($showNode, $editNode, data) {
            var $this = this;

            WX_Components.initIconBox(".icon-box", $showNode, $editNode, data);

            //区块背景色
            $editNode.find('input[data-tmpldata="BgColor"]').each(function (i, ele) {
                WX_Components.colorInput($(ele));
            })

            var limitObjs = [];
            $.each(WX_Dom.getEditNode().find('input[data-tmpldata="Title"]'), function (i, ele) {
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
            $stylePanel.find("#icon_border_radius").val(data.FStyle.IconBorderRadius);
            $stylePanel.find("#icon_size").val(data.FStyle.IconSize);
            $stylePanel.find("#text_size").val(data.FStyle.TextSize);

            WX_Components.colorInput($stylePanel.find("#bgcolor"));
            WX_Components.colorInput($stylePanel.find("#icon_color"));
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
        // 返回提交数据时 组件数据json
        returnWidgetEditData: function ($editNode) {
            // 第三个参数控制是否为数组,默认为false
            var inputData = WX_Utils.modelData($editNode, 'Title Icon LinkDisplay LinkSrc LinkUrl', false); // 通用格式获取数据
            var data = {
                //FWidgetCode: 'Button',
                //FWidgetId: $editNode.find("#edit-block").data("widget-id"),
                FData: {
                    Title: inputData.Title,
                    Icon: inputData.Icon,
                    LinkDisplay: inputData.LinkDisplay,
                    LinkSrc: inputData.LinkSrc,
                    LinkUrl: inputData.LinkUrl
                }
            };


            var $stylePanel = WX_Dom.getStylePanel();

            data.FStyle = {
                BgImage: WX_Components.getBgImage('#bgbox'),
                BgColor: $("#bgcolor").val(),
                Margin: WX_Components.getPadding('#margin'),
                Padding: WX_Components.getPadding('#padding'),
                Align: WX_Utils.getRadioValue($stylePanel, "text_align"),
                BoxShadow: $("#box_shadow").val(),
                BorderRadius: $("#border_radius").val(),
                IconBorderRadius: $("#icon_border_radius").val(),
                IconSize: $("#icon_size").val(),
                IconColor: $("#icon_color").val(),
                TextSize: $("#text_size").val(),
                TextColor: $("#text_color").val(),
                TextBold: $("#text_bold").prop('checked') ? 1 : 0,
                ShowHtmlEditor: $("#showHtmlEditor").prop('checked') ? 1: 0,
                CssHtml: $("#txt_html").val()
            };
            //console.log(data);
            return data;
        },
        // 可选
        preRenderWidget: function (data) {
            return data;
        }
    };

    module.exports = WX_Widget.Button;
});




