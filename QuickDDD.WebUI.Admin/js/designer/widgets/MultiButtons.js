/**
 * 作者：yujinjin9@126.com
 * 时间：2015-11-26
 * 描述：导航栏组件
 */
define(["api", "designerUtils", "render", "components", "template"], function (api, designerUtils, render, components, template) {
	var info = render.info, dom = render.dom;
    var MultiButtons = {
        defaultData: {
            FWidgetName: '并排导航栏',
            FWidgetCode: 'MultiButtons',
            FType: "abreast",
            FData: {
                Buttons: [{
                    Title: '产品中心',
                    Icon: 'glyphicon glyphicon-gift',
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: "",
                    BgColor: ""
                }, {
                    Title: "服务社区",
                    Icon: "glyphicon glyphicon-comment",
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: "",
                    BgColor: ""
                }, {
                    Title: "门店查找",
                    Icon: "glyphicon glyphicon-bishop",
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: "",
                    BgColor: ""
                }, {
                    Title: "在线预订",
                    Icon: "glyphicon glyphicon-shopping-cart",
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: "",
                    BgColor: ""
                }, {
                    Title: "联系我们",
                    Icon: "glyphicon glyphicon-earphone",
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: "",
                    BgColor: ""
                }, {
                    Title: "在线客服",
                    Icon: "glyphicon glyphicon-headphones",
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: "",
                    BgColor: ""
                }]
            },
            FStyle: {
                BgImage: "",
                BgColor: "",
                Padding: "2",
                ButtonColumns: "2",
                ButtonMargin: "1",
                ButtonPadding: "8",
                ButtonBgImage: "",
                ButtonBgColor: "#6fa8dc",
                ButtonBorderRadius: "",
                IconSize: "32px",
                IconAlign: "center",
                IconColor: "#fff",
                TextSize: "14px",
                TextLineHeight: "1.8",
                TextAlign: "center",
                TextColor: "#fff",
                TextBold: "",
                IsWaterfall: 0,
                ShowHtmlEditor: "",
                CssHtml: ""
            }
        },
        
        tilesData: {
            FWidgetName: '色块导航栏',
            FWidgetCode: 'MultiButtons',
            FType: "tiles",
            FData: {
                Buttons: [{
                    "Title": "产品中心",
                    "Icon": "glyphicon glyphicon-gift",
                    "BgColor": "#dd7e6b",
                    "LinkDisplay": "",
                    "LinkSrc": "",
                    "LinkUrl": ""
                },
                {
                    "Title": "服务社区",
                    "Icon": "glyphicon glyphicon-comment",
                    "BgColor": "#6d9eeb",
                    "LinkDisplay": "",
                    "LinkSrc": "",
                    "LinkUrl": ""
                },
                {
                    "Title": "门店查找",
                    "Icon": "glyphicon glyphicon-bishop",
                    "BgColor": "#674ea7",
                    "LinkDisplay": "",
                    "LinkSrc": "",
                    "LinkUrl": ""
                },
                {
                    "Title": "系统消息",
                    "Icon": "glyphicon glyphicon-envelope",
                    "BgColor": "#6aa84f",
                    "LinkDisplay": "",
                    "LinkSrc": "",
                    "LinkUrl": ""
                },
                {
                    "Title": "在线预订",
                    "Icon": "glyphicon glyphicon-shopping-cart",
                    "BgColor": "#6fa8dc",
                    "LinkDisplay": "",
                    "LinkSrc": "",
                    "LinkUrl": ""
                },
                {
                    "Title": "个人中心",
                    "Icon": "glyphicon glyphicon-user",
                    "BgColor": "#45818e",
                    "LinkDisplay": "",
                    "LinkSrc": "",
                    "LinkUrl": ""
                },
                {
                    "Title": "联系我们",
                    "Icon": "glyphicon glyphicon-earphone",
                    "BgColor": "#8e7cc3",
                    "LinkDisplay": "",
                    "LinkSrc": "",
                    "LinkUrl": ""
                },
                {
                    "Title": "在线客服",
                    "Icon": "glyphicon glyphicon-headphones",
                    "BgColor": "#c27ba0",
                    "LinkDisplay": "",
                    "LinkSrc": "",
                    "LinkUrl": ""
                }]
            },
            FStyle: {
                BgImage: "",
                BgColor: "",
                Padding: "2",
                ButtonColumns: "2",
                ButtonMargin: "2",
                ButtonPadding: "8",
                ButtonBgImage: "",
                ButtonBgColor: "#6fa8dc",
                ButtonBorderRadius: "",
                IconSize: "64px",
                IconAlign: "center",
                IconColor: "#fff",
                TextSize: "14px",
                TextLineHeight: "1.8",
                TextAlign: "center",
                TextColor: "#fff",
                TextBold: "",
                IsWaterfall: 1,
                ShowHtmlEditor: "",
                CssHtml: ""
            }
        },
        
        //瀑布流的规则
        WaterfallOrder: [2, 1, 2, 1, 1, 2, 2, 1],
        
        // 字段校验规则
        validate: {
            'Title': {
                type: 'text',
                attr: '[0, 20]',
                tips: '请输入0-20个字的标题'
            },
            // 校验按钮个数
            'length': {
                type: 'length',
                attr: function (data) {
                    return data.FData.Buttons.length < 1 ? false : true;
                },
                tips: '导航按钮个数不能为0'
            }
        },
        // 必须存在的key
        // 手机内显示模板
        showWidgetTemplate: function (widgetData) {
        	var _script = '', _Ftype = {};
        	if(widgetData && widgetData.FData.Buttons.length > 0 && (widgetData.FType == "tiles" || widgetData.FStyle.IsWaterfall === "1")){
        		_Ftype.ButtonColumns = widgetData.FStyle.ButtonColumns;
        		_Ftype.ButtonMargin = widgetData.FStyle.ButtonMargin;
        		_Ftype.WaterfallOrder = MultiButtons.WaterfallOrder;
        		_script = ['<script type="text/javascript">',
        		           '	$(function(){',
        		           '		require(["preview/jquery.waterfall"], function () {',
        		           '			var $ele = $(".${FWidgetId}"),ds = $ele.data("fstyle"),culNumber = ds.ButtonColumns / 1;',
        		           '			var initWaterfall = function() {',
        		           '				$ele.find(".wMultiButtons-wrapper").waterfall({',
        		           '					autoresize : false,useCalc : false,useTranslate3d : false,',
        		           '					colMinWidth : $ele.find(".wMultiButtons-wrapper").width() / culNumber',
        		           '				});',
        		           '			};',
        		           '			var setButtonHeight = function() {',
        		           '				var padding = ds.ButtonMargin / 2,width = $ele.find(".wMultiButtons-wrapper").width() / culNumber,height = Math.round((width - 2 * padding) / 2);',
        		           '				$ele.find(".navbutton").each(function(i) {',
        		           '					var f = ds.WaterfallOrder[i % ds.WaterfallOrder.length];',
        		           '					var h = f == 1 ? height : f * height + f * padding;',
        		           '					$(this).addClass(f == 1 ? "fsmall" : "flarge");',
        		           '					$(this).children("a").css("height", h);',
        		           '				});',
        		           '				initWaterfall();',
        		           '			};',
        		           '			if ($ele.find(".navbutton").length > 0) {',
        		           '				setTimeout(function() {setButtonHeight();}, 1);',
        		           '			}',
        		           '			$(window).resize(function() {setButtonHeight();});',
        		           '		});',
        		           '	});',
        		           '</script>'].join("\n");
        	}
        	//JSON.stringify(_Ftype)).replace(new RegExp("\"",'gm'),"\\\"")
            return [
            '<section class="wMultiButtons ${FWidgetId}'+(_script!=''?(' Waterfall" data-fstyle="'+designerUtils.filterXss(JSON.stringify(_Ftype))):'')+'">',
            '<style>',
            'section.wMultiButtons.${FWidgetId} {',
            '  {@if (FStyle.BgImage.CssText)}$${FStyle.BgImage.CssText|csstext};{@/if}',
            '  {@if (FStyle.BgColor)}background-color: ${FStyle.BgColor};{@/if}',
            '  {@if (FStyle.Padding)}padding: ${FStyle.Padding|padding};{@/if}',
            '}',
            'section.wMultiButtons.${FWidgetId} li {',
            '  width: ${FStyle.ButtonColumns|buttonColumns};',
            '  padding: ${FStyle.ButtonMargin|padding};',
            '}',
            'section.wMultiButtons.${FWidgetId} li a {',
            '  {@if (FStyle.ButtonBgImage.CssText)}$${FStyle.ButtonBgImage.CssText|csstext};{@/if}',
            '  {@if (FStyle.ButtonBgColor)}background-color: ${FStyle.ButtonBgColor};{@/if}',
            '  {@if (FStyle.ButtonBoxShadow)}box-shadow: ${FStyle.ButtonBoxShadow};-webkit-box-shadow:${FStyle.ButtonBoxShadow};{@/if}',
            '  {@if (FStyle.ButtonBorderRadius)}border-radius: ${FStyle.ButtonBorderRadius};{@/if}',
            '  {@if (FStyle.ButtonPadding>0)}padding: ${FStyle.ButtonPadding|padding};{@/if}',
            '  {@if (FStyle.IconTextOneRow==1)}text-align: ${FStyle.TextAlign};{@/if}',
            '}',
            'section.wMultiButtons.${FWidgetId} li .divicon {',
            '  {@if (FStyle.IconSize && FStyle.IconSize != "100%")}font-size: ${FStyle.IconSize};{@/if}',
            '  {@if (FStyle.IconAlign)}text-align:  ${FStyle.IconAlign};{@/if}',
            '  {@if (FStyle.IconColor)}color: ${FStyle.IconColor};{@/if}',
            '  {@if (FStyle.IconTextOneRow==1)}display: inline-block!important;vertical-align: middle;border-top-left-radius: 0; border-top-right-radius: 0;{@/if}',
            '}',
            'section.wMultiButtons.${FWidgetId} li.flarge .divicon {',
            '  {@if (FStyle.IconSize != "100%")}top: 50%; margin-top: -${FStyle.IconSize|half}px;display:block;{@/if}',
            '}',
            'section.wMultiButtons.${FWidgetId} li.fsmall .divicon {',
            '  {@if (FStyle.IconSize != "100%")}font-size: ${FStyle.IconSize|half}px;',
            '  top: 50%; margin-top: -${FStyle.IconSize|half}px;display:block;{@/if}',
            '}',
            'section.wMultiButtons.${FWidgetId} li.flarge .divtext, section.wMultiButtons li.fsmall .divtext {',
            '  position: absolute; padding: inherit; left: 0; bottom: 0; width: 100%;',
            '}',
            'section.wMultiButtons.${FWidgetId} li .divicon > i {',
            '  margin-top: 1px;',  //为兼容图片图标和文字图标高度相等，以免造成图标错位
            '}',
            'section.wMultiButtons.${FWidgetId} li .divicon > img {',
            '  {@if (FStyle.IconSize)}{@if (FStyle.IconBorderRadius && FStyle.IconSize!="100%")}width:${FStyle.IconSize};height:${FStyle.IconSize};{@else}width:${FStyle.IconSize};{@if (FStyle.IconSize!="100%")}height:${FStyle.IconSize};{@else}border-radius: inherit;{@/if}{@/if}{@/if}',
            '  {@if (FStyle.IconBorderRadius)}border-radius: ${FStyle.IconBorderRadius};background-color:${FStyle.IconColor};box-shadow: 0 0 2px 1px rgba(255, 255, 255, 0.5); margin:2px 0;{@/if}',
            '}',
            'section.wMultiButtons.${FWidgetId} li.fsmall .divicon > img {',
            '  width:${FStyle.IconSize|half}px;height:${FStyle.IconSize|half}px;',
            //'  width:calc(${FStyle.IconSize} / 2{@if (FStyle.IconBorderRadius && FStyle.IconSize!="100%")} + 4px{@/if});height:calc(${FStyle.IconSize} / 2{@if (FStyle.IconBorderRadius && FStyle.IconSize!="100%")} + 4px{@/if});',
            '}',
            'section.wMultiButtons.${FWidgetId} li a .divtext {',
            '    {@if (FStyle.TextSize)}font-size: ${FStyle.TextSize};{@/if}',
            '    {@if (FStyle.TextAlign)}text-align:  ${FStyle.TextAlign};{@/if}',
            '    {@if (FStyle.TextLineHeight)}line-height:  ${FStyle.TextLineHeight};{@/if}',
            '    {@if (FStyle.TextColor)}color:  ${FStyle.TextColor};{@/if}',
            '    {@if (FStyle.TextBold==1)}font-weight:bold;{@/if}',
            '    {@if (FStyle.IconTextOneRow==1)}display: inline-block;vertical-align: middle;position:relative;{@/if}',
            '}',
            '$${FStyle.CssHtml}',
            '</style>',
            '    <ul class="wMultiButtons-wrapper clearfix">',
            '        {@if count == 0}',
            '        <li><div class="message">并排导航：请添加导航。</div></li>{@else}',
            '        {@each FData.Buttons as Button}',
            '        <li class="navbutton">',
            '            <a href="${Button.LinkUrl}" style="{@if (Button.BgColor)}background-color: ${Button.BgColor};{@/if}">',
            '               <div class="divicon" style="{@if (Button.IconColor)}color: ${Button.IconColor};{@/if}">$${Button.Icon|icon}</div>',
            '               <div class="divtext" style="{@if (Button.TitleColor)}color: ${Button.TitleColor};{@/if}">${Button.Title}</div>',
            '            </a></li>',
            '        {@/each}',
            '        {@/if}',
            '    </ul>',
            _script,
            '</section>'
            ].join("\n");
        },
        // 属性框模板
        editWidgetTemplate: [
            '<div id="edit-block" class="edit-block container" data-widget-id="${FWidgetId}" style="min-height:100px;">',
			'     <label>单个组件最多可设置20个按钮</label>',
            '    {@each FData.Buttons as Button, index}',
            '    <dl class="edit-block-row sortable">',
            '        <dt class="delete-btn" title="删除"></dt>',
            '        <dd class="row">',
            '            <div class="col-xs-2">',
            '	<div class="form-group" style="width:80px;">',
            '<label>按钮图标<span class="asterisk invisible">*</span></label>',
            '<div class="icon-box" title="点击选择图标">$${Button.Icon|icon}</div>',
            '<input type="hidden" data-tmpldata="Icon" value="${Button.Icon}" />',
            '<span class="inline" style="margin-top:13px;" title="设置此按钮的图标颜色"><input class="form-control colorInput input-mini" readonly type="text" data-tmpldata="IconColor" value="${Button.IconColor}" /></span>',
            '            </div>',
            '	</div>',
            '            <div class="col-xs-7">',
            '<div class="form-group">',
            '    <label>按钮标题<span class="asterisk">*</span></label><span class="help-inline">（限20个字）</span>',
            '    <div class="controls">',
            '        <input class="form-control" type="text" maxlength="20" data-tmpldata="Title" value="$${Button.Title}" placeholder="请输入按钮标题">',
            '    </div>',
            '</div>',
            '<div class="form-group">',
            '    <label>链接地址</label><span class="help-inline">（点击下框进行设置）</span>',
            '    <div class="controls outlink">',
            '        <input class="form-control" type="text" readonly data-tmpldata="LinkDisplay" value="${Button.LinkDisplay}">',
            '        <input type="hidden" data-tmpldata="LinkSrc" value="${Button.LinkSrc}">',
            '        <input type="hidden" data-tmpldata="LinkUrl" value="${Button.LinkUrl}">',
            '    </div>',
            '</div>',
            '            </div>',
            '            <div class="col-xs-2" style="text-align:center">',
            '<div class="form-group">',
            '    <label>标题颜色</label>',
            '    <div class="controls">',
            '        <input class="form-control colorInput input-mini" readonly type="text" data-tmpldata="TitleColor" value="${Button.TitleColor}" />',
            '    </div>',
            '</div>',
            '<div class="form-group">',
            '    <label>背景颜色</label>',
            '    <div class="controls">',
            '        <input class="form-control colorInput input-mini" readonly type="text" data-tmpldata="BgColor" value="${Button.BgColor}" />',
            '    </div>',
            '</div>',
            '            </div>',
            '        </dd>',
            '    </dl>',
            '    {@/each}',
            '    <div style="margin-bottom:10px;">',
            '        <div class="numhint bold help-block"></div>',
            '        <div><button class="add_Block btn btn-lg btn-primary"><i class="icon-plus"></i>添加按钮</button><lable class="lblMax hide">已达到最多允许的按钮数量，不能继续添加</lable></div>',
            '    </div>',
            '</div>'].join("\n"),
        styleWidgetTemplate: [
            '<div id="style-block" class="edit-block style-block container form-horizontal">',
            '    <div class="edit-block-row">',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">组件背景图：</label>',
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
            '        <label class="col-xs-3 control-label">组件背景色：</label>',
            '        <div class="col-xs-4 controls">',
            '	        <input class="form-control input-mini" id="bgcolor" readonly type="text" value="${FStyle.BgColor}" />',
            '        </div>',
            '        <div class="col-xs-5"><span class="help-block">（可以设置为透明）</span></div>',
            '    </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">组件边距：</label>',
            '        <div class="col-xs-9" id="padding">',
            '        </div>',
            '    </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">每行按钮数：</label>',
            '        <div class="col-xs-4 controls">',
            '            <input class="form-control input-mini" id="button_columns" readonly type="text" value="${FStyle.ButtonColumns}" />',
            '        </div>',
            '        <div class="col-xs-5"><span class="help-block">（限1～6个）</span></div>',
            '    </div>',
            '    </div>',
            '    <div class="edit-block-row">',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">按钮背景图：</label>',
            '        <div class="col-xs-4 controls">',
            '	        <div id="bgbox-btn" class="bgimg-box" title="点击此处设置背景图">',
            '	            <input class="bgimg-data" type="hidden" value="$${FStyle.ButtonBgImage.Data}" />',
            '	            <input class="bgimg-csstext" type="hidden" value="${FStyle.ButtonBgImage.CssText}" />',
            '            </div>',
            '	        <button class="bgimg-delbtn btn btn-default btn-sm hide">清除</button>',
            '        </div>',
            '        <div class="col-xs-5"><span class="help-block">（点击图片框上传图片）</span></div>',
            '    </div>',
            '	 <div class="form-group">',
            '	    <label class="col-xs-3 control-label">按钮背景色：</label>',
            '	    <div class="col-xs-9 controls">',
            '	        <input class="form-control input-mini" id="button_bgcolor" readonly type="text" value="${FStyle.ButtonBgColor}" />',
            '	    </div>',
            '	 </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">按钮间距：</label>',
            '        <div class="col-xs-9 controls" id="button-margin">',
            '        </div>',
            '    </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">按钮内边距：</label>',
            '        <div class="col-xs-9 controls" id="button-padding">',
            '        </div>',
            '    </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">按钮阴影：</label>',
            '        <div class="col-xs-9 controls">',
            '            <select class="form-control input-xsmall" id="button_box_shadow">',
            '<option value="">无</option>',
            '<option value="1px 1px 4px #999">浅</option>',
            '<option value="1px 1px 5px #666">中</option>',
            '<option value="1px 1px 5px #333">深</option>',
            '            </select>',
            '        </div>',
            '    </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">按钮圆角：</label>',
            '        <div class="col-xs-9 controls">',
            '            <select class="form-control input-xsmall" id="button_border_radius">',
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
            '    </div>',
            '    </div>',
            '    <div class="edit-block-row">',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">图标大小：</label>',
            '	    <div class="col-xs-9 controls">',
            '	      <select class="form-control input-xsmall" id="icon_size">',
            '	          <option value="18px">特小</option>',
            '	    	  <option value="24px">小</option>',
            '	          <option value="32px">中</option>',
            '	          <option value="48px">大</option>',
            '	          <option value="64px">加大</option>',
            '	          <option value="96px">特大</option>',
            '	          <option value="100%">填满(仅对图片有效)</option>',
            '	      </select>',
            '	    </div>',
            '	</div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">图标圆角：</label>',
            '        <div class="col-xs-9 controls">',
            '            <select class="form-control input-xsmall inline" id="icon_border_radius">',
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
            '            </select>&nbsp;（仅对彩色图片图标有效）',
            '        </div>',
            '    </div>',
            '  <div class="form-group">',
            '      <label class="col-xs-3 control-label">图标对齐：</label>',
            '      <div class="col-xs-9 controls">',
            '          <div class="btn-group btn-group-sm" data-toggle="buttons">',
            '              <label class="btn btn-default {@if (FStyle.IconAlign=="left")}active{@/if}"><input name="icon_align" type="radio" {@if (FStyle.IconAlign=="left")}checked="checked"{@/if} data-tmpldata="icon_align" value="left" title="居左"><i class="glyphicon glyphicon-align-left"></i></label>',
            '              <label class="btn btn-default {@if (FStyle.IconAlign=="center")}active{@/if}"><input name="icon_align" type="radio" {@if (FStyle.IconAlign=="center")}checked="checked"{@/if} data-tmpldata="icon_align" value="center" title="居中"><i class="glyphicon glyphicon-align-center"></i></label>',
            '              <label class="btn btn-default {@if (FStyle.IconAlign=="right")}active{@/if}"><input name="icon_align" type="radio" {@if (FStyle.IconAlign=="right")}checked="checked"{@/if} data-tmpldata="icon_align" value="right" title="居右"><i class="glyphicon glyphicon-align-right"></i></label>',
            '          </div>&nbsp;&nbsp;<i class="icon-info2" style="font-size:16px;" data-toggle="tooltip" title="当勾选了“图标文字在同一行”时，此项设置无效。图标文字的对齐方式将使用“文字对齐”的设置。"></i>',
            '      </div>',
            '  </div>',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">图标颜色：</label>',
            '	    <div class="col-xs-9 controls">',
            '	        <input class="form-control input-mini" id="icon_color" readonly type="text" value="${FStyle.IconColor}" />',
            '	    </div>',
            '	</div>',
            '   </div>',
            '   <div class="edit-block-row">',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">文字大小：</label>',
            '	    <div class="col-xs-9 controls">',
            '	      <select class="form-control input-xsmall" id="text_size">',
            '	          <option value="10px">特小</option>',
            '	    	  <option value="12px">小</option>',
            '	          <option value="14px">中</option>',
            '	          <option value="16px">大</option>',
            '	          <option value="18px">特大</option>',
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
            '  <div class="form-group">',
            '      <label class="col-xs-3 control-label">文字对齐：</label>',
            '      <div class="col-xs-9 controls">',
            '          <div class="btn-group btn-group-sm" data-toggle="buttons">',
            '              <label class="btn btn-default {@if (FStyle.TextAlign=="left")}active{@/if}"><input name="text_align" type="radio" {@if (FStyle.TextAlign=="left")}checked="checked"{@/if} data-tmpldata="text_align" value="left" title="居左"><i class="glyphicon glyphicon-align-left"></i></label>',
            '              <label class="btn btn-default {@if (FStyle.TextAlign=="center")}active{@/if}"><input name="text_align" type="radio" {@if (FStyle.TextAlign=="center")}checked="checked"{@/if} data-tmpldata="text_align" value="center" title="居中"><i class="glyphicon glyphicon-align-center"></i></label>',
            '              <label class="btn btn-default {@if (FStyle.TextAlign=="right")}active{@/if}"><input name="text_align" type="radio" {@if (FStyle.TextAlign=="right")}checked="checked"{@/if} data-tmpldata="text_align" value="right" title="居右"><i class="glyphicon glyphicon-align-right"></i></label>',
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
            '    </div>',
            '    <div class="block-row">',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">其他选项：</label>',
            '	    <div class="col-xs-9 controls">',
            '	        <label><input class="ace" id="icontext_onerow" type="checkbox" {@if (FStyle.IconTextOneRow==1)}checked="checked"{@/if} data-tmpldata="icontext_onerow" value="1" /><span class="lbl">图标文字在同一行</span></label>',
            '	    </div>',
            '	</div>',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label"></label>',
            '	    <div class="col-xs-9 controls">',
            '	        <label><input class="ace" id="iswaterfall" type="checkbox" {@if (FStyle.IsWaterfall==1)}checked="checked"{@/if} data-tmpldata="iswaterfall" value="1" /><span class="lbl">启用两列非对称布局</span></label>',
            '	    </div>',
            '	</div>',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label"></label>',
            '	    <div class="col-xs-9 controls">',
            '	        <label><input class="ace" id="showHtmlEditor" type="checkbox" {@if (FStyle.ShowHtmlEditor==1)}checked{@/if}  /><span class="lbl">显示高级扩展</span>(仅针对程序人员！)</label> ',
            '	    </div>',
            '	</div>',
            '	<div class="stylehtml {@if (FStyle.ShowHtmlEditor!="1")}hide{@/if}">',
            '	    <div class="red">请注意：如果在这里随意填写，将导致页面显示混乱！</div>',
            '	    <textarea id="txt_html" class="input-xxlarge" rows="15">{@if (FStyle.CssHtml=="")}/*section.wMultiButtons.${FWidgetId} { }*/{@else}$${FStyle.CssHtml}{@/if}</textarea>',
            '	</div>',
            '    </div>',
            '</div>'].join("\n"),
        addWidgetTemplate: [
            '<dl class="edit-block-row sortable">',
            '<input type="hidden" data-tmpldata="Icon" value="${Button.Icon}" />',
            '<input type="hidden" data-tmpldata="Title" value="${Button.Title}" />',
            '<input type="hidden" data-tmpldata="BgColor" value="${Button.BgColor}" />',
            '<input type="hidden" data-tmpldata="LinkDisplay" value="${Button.LinkDisplay}" />',
            '<input type="hidden" data-tmpldata="LinkSrc" value="${Button.LinkSrc}" />',
            '<input type="hidden" data-tmpldata="LinkUrl" value="${Button.LinkUrl}" />',
            '</dl>'
        ].join("\n"),
        initWidgetShowNode: function ($showNode) {
//            var data = designerUtils.paramDecode($showNode.attr('data-widget-data'));
//            if (data.FStyle.IsWaterfall == "1" && $showNode.find(".navbutton").length > 1) {
//                //给html元素加上Waterfall标识及相关属性，用于浏览模式还原
//                var ds = {
//                    ButtonColumns: data.FStyle.ButtonColumns,
//                    ButtonMargin: data.FStyle.ButtonMargin,
//                    WaterfallOrder: MultiButtons.WaterfallOrder
//                }
//                $showNode.find("section.wMultiButtons").addClass("Waterfall").attr("data-fstyle", JSON.stringify(ds));
//                var culNumber = data.FStyle.ButtonColumns / 1;
//                var initWaterfall = function () {
////                    $showNode.find('.wMultiButtons-wrapper').waterfall({
////                        autoresize: false,
////                        useCalc: false,
////                        useTranslate3d: false,
////                        colMinWidth: $showNode.find('.wMultiButtons-wrapper').width() / culNumber
////                    });
//                };
//
//                var getPaddingFull = function (data) {
//                    if (data == null || data == "") data = 0;
//                    var n = parseInt(data);
//                    if (!isNaN(n)) {  //是数字，表示统一设置
//                        data = { iseach: 0, t: n, b: n, l: n, r: n };
//                    }
//                    return data;
//                }
//                var setButtonHeight = function () {
//                    var buttonMargin = getPaddingFull(data.FStyle.ButtonMargin);
//                    var padding = (buttonMargin.l + buttonMargin.r) / 2;
//                    var width = $showNode.find('.wMultiButtons-wrapper').width() / culNumber;
//                    var height = Math.round((width - 2 * padding) / 2);
//
//                    $showNode.find(".navbutton").each(function (i) {
//                        var f = MultiButtons.WaterfallOrder[i % MultiButtons.WaterfallOrder.length];
//                        var h = f == 1 ? height : f * height + f * padding;
//                        $(this).addClass(f == 1 ? 'fsmall' : 'flarge');
//                        //$(this).children("a").css('min-height', h);
//                        $(this).children("a").css('height', h);
//                    });
//                    initWaterfall();
//                };
//
//                if ($showNode.find(".navbutton").length > 0) {
//                    setTimeout(function () {
//                        //initWaterfall();
//                        setButtonHeight();
//                    }, 1);
//                }
//
//                $showNode.closest(".show-panel").resize(function () {
//                    setButtonHeight();
//                });
//
//            }
        },
        // 做组件初始化事件绑定等
        initWidgetEditNode: function ($showNode, $editNode, data) {
            var $this = this;
            // 删除
            $editNode.find(".delete-btn").click(function () {
                $removeNode = $(this).parent('.edit-block-row');
                designer.confirm("删除后不能恢复，您确定删除此按钮吗？", $this.removeBlock, { args: $removeNode });
            });

            $editNode.find(".add_Block").click(function () {
                MultiButtons.addBlock();
            });
            //设置图标
            components.initIconBox(".icon-box", $showNode, $editNode, data);
            //设置链接
            components.initOutLink(".outlink", $showNode, $editNode);
            //区块背景色
            $editNode.find('.colorInput').each(function (i, ele) {
            	components.colorInput($(ele));
            })
            // 顺序拖拽
            $editNode.sortable({
                items: '.sortable',
                axis: "y",
                distance: 5,
                stop: function () {
                    dom.getShowNode().trigger('refresh');
                }
            });

            var limitObjs = [];
            $.each(dom.getEditNode().find('input[data-tmpldata="Title"]'), function (i, ele) {
                limitObj = {};
                limitObj.limitEle = $(ele);
                limitObj.tipsEle = $(ele).closest('.form-group').find(".help-inline");
                limitObj.wordMax = 20;
                limitObjs.push(limitObj);
            })
            //剩余字数提示
            designerUtils.wordLimitTips({
                limitObj: limitObjs
            });
            MultiButtons.refreshAddButton();
            //初始化控件状态
            var $stylePanel = dom.getStylePanel();
            //$stylePanel.find("#button_columns").wx_spinner({ min: 1, max: 6, step: 1 });
            components.addSpinner($stylePanel.find("#button_columns"), { min: 1, max: 6, step: 1 });
            $stylePanel.find("#button_box_shadow").val(data.FStyle.ButtonBoxShadow);
            $stylePanel.find("#button_border_radius").val(data.FStyle.ButtonBorderRadius);
            $stylePanel.find("#icon_border_radius").val(data.FStyle.IconBorderRadius);
            $stylePanel.find("#icon_size").val(data.FStyle.IconSize);
            $stylePanel.find("#text_size").val(data.FStyle.TextSize);
            $stylePanel.find("#text_lineheight").val(data.FStyle.TextLineHeight);
            components.colorInput($stylePanel.find("#bgcolor"));
            components.colorInput($stylePanel.find("#button_bgcolor"));
            components.colorInput($stylePanel.find("#icon_color"));
            components.colorInput($stylePanel.find("#text_color"));
            //组件背景图
            components.initBgImage('#bgbox', $showNode, $editNode);
            //按钮背景图
            components.initBgImage('#bgbox-btn', $showNode, $editNode);
            //组件边距
            components.initPadding('#padding', $showNode, $editNode, data.FStyle.Padding, { min: 0, max: 300, step: 1 });
            //按钮间距
            components.initPadding('#button-margin', $showNode, $editNode, data.FStyle.ButtonMargin, { min: 0, max: 50, step: 1 });
            //按钮内边距
            components.initPadding('#button-padding', $showNode, $editNode, data.FStyle.ButtonPadding, { min: 0, max: 50, step: 1 });
            $("#showHtmlEditor").change(function () {
                $(".stylehtml").toggleClass('hide');
            })
            //启用瀑布流时图标和文字不能在同一行
            var iswaterfallstatus = function () {
                if ($('#iswaterfall').prop('checked')) {  
                	//启用瀑布流
                    $('#icontext_onerow').prop('checked', false).prop('disabled', true);
                } else {
                    $('#icontext_onerow').prop('disabled', false);
                }
            };
            $('#iswaterfall').change(function () {
                iswaterfallstatus();
            })
            iswaterfallstatus();
        },
        // 返回提交数据时 组件数据json
        returnWidgetEditData: function ($editNode) {
            // 第三个参数控制是否为数组,默认为false
            var inputData = designerUtils.modelData($editNode, 'Title Icon TitleColor IconColor BgColor LinkDisplay LinkSrc LinkUrl', true); // 通用格式获取数据
            var count = inputData.Title.length;
            var data = {
                FWidgetCode: 'MultiButtons',
                FWidgetId: $editNode.find("#edit-block").data("widget-id"),
                FData: {
                    Buttons: []
                },
                //FBackground: inputData.FBackground[0],
                count: count
            };

            for (var i = 0; i < count; i++) {
                var button = {
                    'Title': inputData.Title[i],
                    'Icon': inputData.Icon[i],
                    'TitleColor': inputData.TitleColor[i],
                    'IconColor': inputData.IconColor[i],
                    'BgColor': inputData.BgColor[i],
                    'LinkDisplay': inputData.LinkDisplay[i],
                    'LinkSrc': inputData.LinkSrc[i],
                    'LinkUrl': inputData.LinkUrl[i]
                };
                data.FData.Buttons[i] = button;
            }
            var $stylePanel = dom.getStylePanel();
            var styleData = designerUtils.modelData($stylePanel, 'iswaterfall icon_align text_align icontext_onerow', false);
            data.FStyle = {
                IsWaterfall: styleData["iswaterfall"],
                BgImage: components.getBgImage('#bgbox'),
                BgColor: $("#bgcolor").val(),
                Padding: designerUtils.getPadding('#padding'),
                ButtonBgImage: components.getBgImage('#bgbox-btn'),
                ButtonBgColor: $("#button_bgcolor").val(),
                ButtonColumns: $("#button_columns").val(),
                ButtonMargin: designerUtils.getPadding('#button-margin'),
                ButtonPadding: designerUtils.getPadding('#button-padding'),
                ButtonBoxShadow: $("#button_box_shadow").val(),
                ButtonBorderRadius: $("#button_border_radius").val(),
                IconBorderRadius: $("#icon_border_radius").val(),
                IconSize: $("#icon_size").val(),
                IconAlign: styleData["icon_align"],  //使用通用方法获取select、checkbox、radio的值
                IconColor: $("#icon_color").val(),
                TextSize: $("#text_size").val(),
                TextLineHeight: $("#text_lineheight").val(),
                TextAlign: styleData["text_align"],
                TextColor: $("#text_color").val(),
                TextBold: $("#text_bold").prop('checked') ? 1 : 0,
                IconTextOneRow: styleData["icontext_onerow"],
                ShowHtmlEditor: $("#showHtmlEditor").prop('checked') ? 1 : 0,
                CssHtml: $("#txt_html").val()
            };
            if (data.FStyle.IsWaterfall == "1")  //启用两列瀑布流
                data.FStyle.ButtonColumns = 2;
            return data;
        },
        // 可选
        preRenderWidget: function (data) {
            data.count = 'undefined' == typeof data.FData.Buttons ? 0 : data.FData.Buttons.length;
            return data;
        },
        addBlock: function () {
            var blockNum = dom.getEditNode().find('input[data-tmpldata="Title"]').length;
            var data = {
                Button: {
                    Title: "标题",
                    Icon: "glyphicon glyphicon-question-sign",
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: ""
                }
            };
            dom.getEditNode().append(template.render(MultiButtons.addWidgetTemplate, data));
            var $showNode = dom.getShowNode();
            $showNode.trigger('refresh');
            $showNode.trigger('refreshEdit', true);
            MultiButtons.refreshAddButton();
        },
        refreshAddButton: function () {
            var blockNum = dom.getEditNode().find('input[data-tmpldata="Title"]').length;
            if (blockNum >= 20) {
            	dom.getEditNode().find(".add_Block").hide();
            	dom.getEditNode().find(".lblMax").removeClass('hide');
            } else {
            	dom.getEditNode().find(".add_Block").show();
            	dom.getEditNode().find(".lblMax").addClass('hide');
            }
        },
        removeBlock: function (result, $removeNode) {
            if (!result) return;
            $removeNode.remove();
            var $showNode = dom.getShowNode();
            $showNode.trigger('refresh');
            MultiButtons.refreshAddButton();
        },
        
        returnDefaultData: function(type){
        	if(type === "tiles"){
        		return MultiButtons.tilesData;
        	}
        	return MultiButtons.defaultData;
        }
    };

    return MultiButtons;
});




