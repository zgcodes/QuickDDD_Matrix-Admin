/**
 * 作者：yujinjin9@126.com
 * 时间：2015-10-25
 * 描述：设计器的图文列表组件
 */
define(["api", "designerUtils", "render", "components", "template"], function (api, designerUtils, render, components, template) {
	var info = render.info, dom = render.dom;
    var List = {
        defaultData: {
            FWidgetCode: "List",
            FType: "list",
            FWidgetName: "图文列表",
            FVer: "1.0",
            FData: {
                Buttons: [{
                    Title: '附近美食',
                    Summary: '附近美食附近美食附近美食',
                    Icon: 'glyphicon glyphicon-cutlery',
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: "",
                    BgColor: ""
                }, {
                    Title: "订单列表",
                    Summary: '订单列表订单列表订单列表',
                    Icon: "glyphicon glyphicon-th-list",
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: "",
                    BgColor: ""
                }, {
                    Title: "商品查找",
                    Summary: '产品查找产品查找产品查找产品查找',
                    Icon: "glyphicon glyphicon-search",
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
                ButtonColumns: "1",
                ButtonBgImage: "",
                ButtonBgColor: "#6fa8dc",
                ButtonMargin: "1",
                ButtonPadding: "8",
                ButtonBoxShadow: "",
                ButtonBorderRadius: "",
                IconPosition: "left",
                IconSize: "50px",
                IconBorderRadius: "",
                IconPadding: "",
                TextSize: "16px",
                TextAlign: "left",
                TextColor: "#fff",
                TextBold: "",
                TextPadding: "",
                SummarySize: "12px",
                SummaryAlign: "left",
                SummaryColor: "#cfe2f3",
                SummaryPadding: "",
                ShowArrow: 1,
                ArrowSize: "12px",
                ArrowColor: "#cfe2f3",
                ShowHtmlEditor: "",
                CssHtml: ""
            }
        },
        // 字段校验规则
        validate: {
            'Title': {
                type: 'text',
                attr: '[0, 20]',
                tips: '请输入0-20个字的导航名称'
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
        showWidgetTemplate: function () {
            return [
            '<section class="wList ${FWidgetId}">',
            '<style>',
            'section.wList.${FWidgetId} {',
            '  {@if (FStyle.BgImage.CssText)}$${FStyle.BgImage.CssText|csstext};{@/if}',
            '  {@if (FStyle.BgColor)}background-color: ${FStyle.BgColor};{@/if}',
            '  {@if (FStyle.Padding)}padding: ${FStyle.Padding|padding};{@/if}',
            '}',
            'section.wList.${FWidgetId} li {',
            '  width: ${FStyle.ButtonColumns|buttonColumns};',
            '  padding: ${FStyle.ButtonMargin|padding};',
            '}',
            'section.wList.${FWidgetId} li a {',
            '  {@if (FStyle.ButtonBgImage.CssText)}$${FStyle.ButtonBgImage.CssText};{@/if}',
            '  {@if (FStyle.ButtonBgColor)}background-color: ${FStyle.ButtonBgColor};{@/if}',
            '  {@if (FStyle.ButtonBoxShadow)}box-shadow: ${FStyle.ButtonBoxShadow};-webkit-box-shadow:${FStyle.ButtonBoxShadow};{@/if}',
            '  {@if (FStyle.ButtonBorderRadius)}border-radius: ${FStyle.ButtonBorderRadius};{@/if}',
            '  {@if (FStyle.ButtonPadding)}padding: ${FStyle.ButtonPadding|padding};{@/if}',
            '}',
            'section.wList.${FWidgetId} li .divicon {',
            '  {@if (FStyle.IconSize)}width: ${FStyle.IconSize};{@/if}',
            '  {@if (FStyle.IconSize != "100%")}height: ${FStyle.IconSize};{@/if}',
            '  {@if (FStyle.IconPosition=="left")}float: left;{@/if}',
            '  {@if (FStyle.IconPosition=="right")}float: right;{@/if}',
            '  {@if (FStyle.IconPadding)}padding: ${FStyle.IconPadding|padding};{@/if}',
            '}',
            'section.wList.${FWidgetId} li .divicon > i {',
            '  {@if (FStyle.IconSize && FStyle.IconSize != "100%")}font-size: ${FStyle.IconSize};{@/if}',
            '  margin-top: 1px;',  //为兼容图片图片和文字图片高度相等，以免造成图片错位
            '}',
            'section.wList.${FWidgetId} li .divicon > img {',
            //'  {@if (FStyle.IconSize)}{@if (FStyle.IconBorderRadius && FStyle.IconSize!="100%")}width:${FStyle.IconSize};height:${FStyle.IconSize};{@else}width:${FStyle.IconSize};{@if (FStyle.IconSize!="100%")}height:${FStyle.IconSize};{@else}border-radius: inherit;{@/if}{@/if}{@/if}',
            '  {@if (FStyle.IconBorderRadius)}border-radius: ${FStyle.IconBorderRadius};{@/if}',
            '}',
            'section.wList.${FWidgetId} li a .divtext {',
            '  {@if (FStyle.IconPosition=="left" && FStyle.IconSize != "100%")}margin-left: ${FStyle.IconSize};{@/if}',
            '  {@if (FStyle.IconPosition=="right" && FStyle.IconSize != "100%")}margin-right: ${FStyle.IconSize};{@/if}',
            '}',
            'section.wList.${FWidgetId} li a .divtext .divtitle {',
            '    {@if (FStyle.TextSize)}font-size: ${FStyle.TextSize};{@/if}',
            '    {@if (FStyle.TextAlign)}text-align:  ${FStyle.TextAlign};{@/if}',
            //'    {@if (FStyle.TextLineHeight)}line-height:  ${FStyle.TextLineHeight};{@/if}',
            '    {@if (FStyle.TextColor)}color:  ${FStyle.TextColor};{@/if}',
            '    {@if (FStyle.TextBold==1)}font-weight:bold;{@/if}',
            '    {@if (FStyle.TextPadding)}padding: ${FStyle.TextPadding|padding};{@/if}',
            '}',
            'section.wList.${FWidgetId} li a .divtext .divsummary {',
            '    {@if (FStyle.SummarySize)}font-size: ${FStyle.SummarySize};{@/if}',
            '    {@if (FStyle.SummaryAlign)}text-align:  ${FStyle.SummaryAlign};{@/if}',
            //'    {@if (FStyle.SummaryLineHeight)}line-height:  ${FStyle.SummaryLineHeight};{@/if}',
            '    {@if (FStyle.SummaryColor)}color:  ${FStyle.SummaryColor};{@/if}',
            '    {@if (FStyle.SummaryPadding)}padding: ${FStyle.SummaryPadding|padding};{@/if}',
            '}',
            'section.wList.${FWidgetId} li a .divarrow {',
            '  {@if (FStyle.ArrowSize)}font-size: ${FStyle.ArrowSize};{@/if}',
            '  {@if (FStyle.ArrowColor)}color: ${FStyle.ArrowColor};{@/if}',
            '}',
            '$${FStyle.CssHtml}',
            '</style>',
            '    <ul class="wList-wrapper clearfix">',
            '        {@if count == 0}',
            '        <li><div class="message">图文列表：请添加列表标题。</div></li>{@else}',
            '        {@each FData.Buttons as Button}',
            '        <li class="navbutton">',
            '            <a {@if (Button.LinkUrl != "")}href="${Button.LinkUrl}"{@/if} class="clearfix" style="{@if (Button.BgColor)}background-color: ${Button.BgColor};{@/if}">',
            '{@if (FStyle.IconPosition=="bottom")}',
            '<div class="divtext"><div class="divtitle">${Button.Title}</div><div class="divsummary">${Button.Summary}</div></div><div class="divicon">$${Button.Icon|icon}</div>',
            '{@else}',
            '<div class="divicon">$${Button.Icon|icon}</div><div class="divtext"><div class="divtitle">${Button.Title}</div><div class="divsummary">${Button.Summary}</div></div>',
            '{@/if}',
            '{@if (FStyle.ShowArrow==1)}<div class="divarrow"><i class="glyphicon glyphicon-chevron-right"></i></div>{@/if}',
            '            </a></li>',
            '        {@/each}',
            '        {@/if}',
            '    </ul>',
            '</section>'
            ].join("\n");
        },
        // 属性框模板
        editWidgetTemplate: [
            '<div id="edit-block" class="edit-block container" data-widget-id="${FWidgetId}" style="min-height:100px;">',
			'     <label>单个组件最多可设置20个列表项</label>',
            '    {@each FData.Buttons as Button, index}',
            '    <dl class="edit-block-row sortable">',
            '        <dt class="delete-btn" title="删除"></dt>',
            '        <dd class="row">',
            '            <div class="col-xs-3" style="width:80px">',
            '<label class="text-center">图标<span class="asterisk invisible">*</span></label>',
            '<div class="icon-box" title="点击选择图标">$${Button.Icon|icon}</div>',
            '<input type="hidden" data-tmpldata="Icon" value="${Button.Icon}" />',
            '<span class="inline" style="margin-top:13px;" title="设置按钮背景颜色"><input class="form-control input-mini" readonly type="text" data-tmpldata="BgColor" value="${Button.BgColor}" /></span>',
            '            </div>',
            '            <div class="col-xs-8">',
            '<div class="form-group">',
            '    <label>标题<span class="asterisk">*</span></label><span class="help-inline">（限20个字）</span>',
            '    <div class="controls">',
            '        <input class="form-control" type="text" maxlength="20" data-tmpldata="Title" value="$${Button.Title}" placeholder="请输入标题">',
            '    </div>',
            '</div>',
            '<div class="form-group">',
            '    <label>摘要</label><span class="help-inline">（限40个字）</span>',
            '    <div class="controls">',
            '        <input class="form-control" type="text" maxlength="40" data-tmpldata="Summary" value="$${Button.Summary}" placeholder="请输入摘要">',
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
            '        </dd>',
            '    </dl>',
            '    {@/each}',
            '    <div style="margin-bottom:10px;">',
            '        <div class="numhint bold help-block"></div>',
            '        <div><button class="add_Block btn btn-lg btn-primary"><i class="icon-plus"></i>添加列表项</button><lable class="lblMax hide">已达到最多允许的列表项数量，不能继续添加</lable></div>',
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
            '        <div class="col-xs-5"><span class="help-block">（限1～2个）</span></div>',
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
            '	    	  <option value="0">0</option>',
            '	    	  <option value="20px">20px</option>',
            '	    	  <option value="30px">30px</option>',
            '	    	  <option value="40px">40px</option>',
            '	          <option value="50px">50px</option>',
            '	          <option value="60px">60px</option>',
            '	          <option value="70px">70px</option>',
            '	          <option value="80px">80px</option>',
            '	          <option value="90px">90px</option>',
            '	          <option value="100px">100px</option>',
            '	          <option value="100%">填满</option>',
            '	      </select>',
            '	    </div>',
            '	</div>',
            '  <div class="form-group">',
            '      <label class="col-xs-3 control-label">图标位置：</label>',
            '      <div class="col-xs-9 controls">',
            '	      <select class="form-control input-xsmall" id="icon_position">',
            '	    	  <option value="left">左</option>',
            '	    	  <option value="right">右</option>',
            '	    	  <option value="top">上</option>',
            '	    	  <option value="bottom">下</option>',
            '	      </select>',
            '      </div>',
            '  </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">图标边距：</label>',
            '        <div class="col-xs-9" id="icon_padding">',
            '        </div>',
            '    </div>',
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
            '            </select>',
            '        </div>',
            '    </div>',
            '   </div>',
            '   <div class="edit-block-row">',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">标题大小：</label>',
            '	    <div class="col-xs-9 controls">',
            '	      <select class="form-control input-xsmall" id="text_size">',
            '	          <option value="12px">12px</option>',
            '	    	  <option value="14px">14px</option>',
            '	          <option value="16px">16px</option>',
            '	          <option value="18px">18px</option>',
            '	          <option value="20px">20px</option>',
            '	          <option value="24px">24px</option>',
            '	      </select>',
            '	    </div>',
            '	</div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">标题边距：</label>',
            '        <div class="col-xs-9" id="text_padding">',
            '        </div>',
            '    </div>',
            '  <div class="form-group">',
            '      <label class="col-xs-3 control-label">标题对齐：</label>',
            '      <div class="col-xs-9 controls">',
            '          <div class="btn-group btn-group-sm" data-toggle="buttons">',
            '              <label class="btn btn-default {@if (FStyle.TextAlign=="left")}active{@/if}"><input name="text_align" type="radio" {@if (FStyle.TextAlign=="left")}checked="checked"{@/if} data-tmpldata="text_align" value="left" title="居左"><i class="icon-paragraph-left2"></i></label>',
            '              <label class="btn btn-default {@if (FStyle.TextAlign=="center")}active{@/if}"><input name="text_align" type="radio" {@if (FStyle.TextAlign=="center")}checked="checked"{@/if} data-tmpldata="text_align" value="center" title="居中"><i class="icon-paragraph-center2"></i></label>',
            '              <label class="btn btn-default {@if (FStyle.TextAlign=="right")}active{@/if}"><input name="text_align" type="radio" {@if (FStyle.TextAlign=="right")}checked="checked"{@/if} data-tmpldata="text_align" value="right" title="居右"><i class="icon-paragraph-right2"></i></label>',
            '          </div>',
            '      </div>',
            '  </div>',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">标题颜色：</label>',
            '	    <div class="col-xs-9 controls">',
            '	        <input class="form-control input-mini" id="text_color" readonly type="text" value="${FStyle.TextColor}" />',
            '	    </div>',
            '	</div>',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">标题加粗：</label>',
            '	    <div class="col-xs-9 controls">',
            '	        <label><input id="text_bold" class="ace" type="checkbox" {@if (FStyle.TextBold==1)}checked{@/if}  /><span class="lbl">加粗</span></label>',
            '	    </div>',
            '	</div>',
            '    </div>',
            '   <div class="edit-block-row">',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">摘要文字大小：</label>',
            '	    <div class="col-xs-9 controls">',
            '	      <select class="form-control input-xsmall" id="summary_size">',
            '	          <option value="10px">10px</option>',
            '	          <option value="12px">12px</option>',
            '	    	  <option value="14px">14px</option>',
            '	          <option value="16px">16px</option>',
            '	          <option value="18px">18px</option>',
            '	          <option value="20px">20px</option>',
            '	          <option value="24px">24px</option>',
            '	      </select>',
            '	    </div>',
            '	</div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">摘要文字边距：</label>',
            '        <div class="col-xs-9" id="summary_padding">',
            '        </div>',
            '    </div>',
            '  <div class="form-group">',
            '      <label class="col-xs-3 control-label">摘要文字对齐：</label>',
            '      <div class="col-xs-9 controls">',
            '          <div class="btn-group btn-group-sm" data-toggle="buttons">',
            '              <label class="btn btn-default {@if (FStyle.SummaryAlign=="left")}active{@/if}"><input name="summary_align" type="radio" {@if (FStyle.SummaryAlign=="left")}checked="checked"{@/if} data-tmpldata="summary_align" value="left" title="居左"><i class="glyphicon glyphicon-align-left"></i></label>',
            '              <label class="btn btn-default {@if (FStyle.SummaryAlign=="center")}active{@/if}"><input name="summary_align" type="radio" {@if (FStyle.SummaryAlign=="center")}checked="checked"{@/if} data-tmpldata="summary_align" value="center" title="居中"><i class="glyphicon glyphicon-align-center"></i></label>',
            '              <label class="btn btn-default {@if (FStyle.SummaryAlign=="right")}active{@/if}"><input name="summary_align" type="radio" {@if (FStyle.SummaryAlign=="right")}checked="checked"{@/if} data-tmpldata="summary_align" value="right" title="居右"><i class="glyphicon glyphicon-align-right"></i></label>',
            '          </div>',
            '      </div>',
            '  </div>',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">摘要文字颜色：</label>',
            '	    <div class="col-xs-9 controls">',
            '	        <input class="form-control input-mini" id="summary_color" readonly type="text" value="${FStyle.SummaryColor}" />',
            '	    </div>',
            '	</div>',
            '    </div>',
            '    <div class="edit-block-row">',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">右侧箭头：</label>',
            '	    <div class="col-xs-9 controls">',
            '	        <label><input class="ace" id="show_arrow" type="checkbox" {@if (FStyle.ShowArrow==1)}checked="checked"{@/if} data-tmpldata="show_arrow" value="1" /><span class="lbl">显示</span></label>',
            '	    </div>',
            '	</div>',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">右侧箭头大小：</label>',
            '	    <div class="col-xs-9 controls">',
            '	      <select class="form-control input-xsmall" id="arrow_size">',
            '	    	  <option value="12px">小</option>',
            '	          <option value="14px">中</option>',
            '	          <option value="16px">大</option>',
            '	      </select>',
            '	    </div>',
            '	</div>',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">箭头颜色：</label>',
            '	    <div class="col-xs-9 controls">',
            '	        <input class="form-control input-mini" id="arrow_color" readonly type="text" value="${FStyle.ArrowColor}" />',
            '	    </div>',
            '	</div>',
            '    </div>',
            '    <div class="block-row">',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">其他选项：</label>',
            '	    <div class="col-xs-9 controls">',
            '	        <label><input class="ace" id="showHtmlEditor" type="checkbox" {@if (FStyle.ShowHtmlEditor==1)}checked{@/if}  /><span class="lbl">显示高级扩展</span>(仅针对程序人员！)</label> ',
            '	    </div>',
            '	</div>',
            '	<div class="stylehtml {@if (FStyle.ShowHtmlEditor!="1")}hide{@/if}">',
            '	    <div class="red">请注意：如果在这里随意填写，将导致页面显示混乱！</div>',
            '	    <textarea id="txt_html" class="input-xxlarge" rows="15">{@if (FStyle.CssHtml=="")}/*section.wList.${FWidgetId} { }*/{@else}$${FStyle.CssHtml}{@/if}</textarea>',
            '	</div>',
            '    </div>',
            '</div>'].join("\n"),
        addWidgetTemplate: [
            '    <dl class="edit-block-row sortable">',
            '<input type="hidden" data-tmpldata="Icon" value="${Button.Icon}" />',
            '<input type="hidden" data-tmpldata="Title" value="${Button.Title}" />',
            '<input type="hidden" data-tmpldata="Summary" value="${Button.Summary}" />',
            '<input type="hidden" data-tmpldata="BgColor" value="${Button.BgColor}" />',
            '<input type="hidden" data-tmpldata="LinkDisplay" value="${Button.LinkDisplay}" />',
            '<input type="hidden" data-tmpldata="LinkSrc" value="${Button.LinkSrc}" />',
            '<input type="hidden" data-tmpldata="LinkUrl" value="${Button.LinkUrl}" />',
            '    </dl>'
        ].join("\n"),
        initWidgetShowNode: function ($showNode) {
        },
        // 做组件初始化事件绑定等
        initWidgetEditNode: function ($showNode, $editNode, data) {
            var $this = this;
            // 删除
            $editNode.find(".delete-btn").click(function () {
                $removeNode = $(this).parent('.edit-block-row');
                designer.confirm("删除后不能恢复，您确定删除此标题吗？", $this.removeBlock, { args: $removeNode });
            });

            $editNode.find(".add_Block").click(function () {
                List.addBlock();
            });
            //设置图片
            components.initIconBox(".icon-box", $showNode, $editNode, data);
            //设置链接
            components.initOutLink(".outlink", $showNode, $editNode);
            //区块背景色
            $editNode.find('input[data-tmpldata="BgColor"]').each(function (i, ele) {
            	components.colorInput($(ele));
            });
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
//            var limitSummary = [];
//            $.each(dom.getEditNode().find('input[data-tmpldata="Title"]'), function (i, ele) {
//                Summary = {};
//                Summary.limitEle = $(ele);
//                Summary.tipsEle = $(ele).closest('.form-group').find(".help-inline");
//                Summary.wordMax = 20;
//                limitObjs.push(Summary);
//            })
//
//            //剩余字数提示
//            WX_Utils.wordLimitTips({
//                limitObj: limitObjs
//            });
            List.refreshAddButton();
            //初始化控件状态
            var $stylePanel = dom.getStylePanel();
            //$stylePanel.find("#button_columns").wx_spinner({ min: 1, max: 2, step: 1 });
            components.addSpinner($stylePanel.find("#button_columns"), { min: 1, max: 2, step: 1 });
            $stylePanel.find("#button_box_shadow").val(data.FStyle.ButtonBoxShadow);
            $stylePanel.find("#button_border_radius").val(data.FStyle.ButtonBorderRadius);
            $stylePanel.find("#icon_border_radius").val(data.FStyle.IconBorderRadius);
            $stylePanel.find("#icon_position").val(data.FStyle.IconPosition);
            $stylePanel.find("#icon_size").val(data.FStyle.IconSize);
            $stylePanel.find("#text_size").val(data.FStyle.TextSize);
            $stylePanel.find("#summary_size").val(data.FStyle.SummarySize);
            $stylePanel.find("#arrow_size").val(data.FStyle.ArrowSize);
            $stylePanel.find("#text_lineheight").val(data.FStyle.TextLineHeight);
            $stylePanel.find("#summary_lineheight").val(data.FStyle.SummaryLineHeight);
            components.colorInput($stylePanel.find("#bgcolor"));
            components.colorInput($stylePanel.find("#button_bgcolor"));
            components.colorInput($stylePanel.find("#icon_color"));
            components.colorInput($stylePanel.find("#text_color"));
            components.colorInput($stylePanel.find("#summary_color"));
            components.colorInput($stylePanel.find("#arrow_color"));
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
            components.initPadding('#icon_padding', $showNode, $editNode, data.FStyle.IconPadding, { min: 0, max: 50, step: 1 });
            components.initPadding('#text_padding', $showNode, $editNode, data.FStyle.TextPadding, { min: 0, max: 50, step: 1 });
            components.initPadding('#summary_padding', $showNode, $editNode, data.FStyle.SummaryPadding, { min: 0, max: 50, step: 1 });
            $("#showHtmlEditor").change(function () {
                $(".stylehtml").toggleClass('hide');
            });
        },
        // 返回提交数据时 组件数据json
        returnWidgetEditData: function ($editNode) {
            // 第三个参数控制是否为数组,默认为false
            var inputData = designerUtils.modelData($editNode, 'Title Summary Icon BgColor LinkDisplay LinkSrc LinkUrl', true); // 通用格式获取数据
            var count = inputData.Title.length;
            var data = {
                FWidgetCode: 'List',
                FWidgetId: $editNode.find("#edit-block").data("widget-id"),
                FData: {
                    Buttons: []
                },
                count: count
            };
            for (var i = 0; i < count; i++) {
                var button = {
                    'Title': inputData.Title[i],
                    'Summary': inputData.Summary[i],
                    'Icon': inputData.Icon[i],
                    'BgColor': inputData.BgColor[i],
                    'LinkDisplay': inputData.LinkDisplay[i],
                    'LinkSrc': inputData.LinkSrc[i],
                    'LinkUrl': inputData.LinkUrl[i]
                };
                data.FData.Buttons[i] = button;
            }
            var $stylePanel = dom.getStylePanel();
            var styleData = designerUtils.modelData($stylePanel, 'iswaterfall icon_align text_align summary_align icontext_onerow', false);
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
                IconPosition: $("#icon_position").val(),
                IconSize: $("#icon_size").val(),
                IconPadding: designerUtils.getPadding('#icon_padding'),
                TextSize: $("#text_size").val(),
                TextPadding: designerUtils.getPadding('#text_padding'),
                TextAlign: styleData["text_align"],
                TextColor: $("#text_color").val(),
                TextBold: $("#text_bold").prop('checked') ? 1 : 0,
                SummarySize: $("#summary_size").val(),
                SummaryPadding: designerUtils.getPadding('#summary_padding'),
                SummaryAlign: styleData["summary_align"],
                SummaryColor: $("#summary_color").val(),
                ShowArrow: $("#show_arrow").prop('checked') ? 1 : 0,
                ArrowSize:$("#arrow_size").val(),
                ArrowColor: $("#arrow_color").val(),
                IconTextOneRow: styleData["icontext_onerow"],
                ShowHtmlEditor: $("#showHtmlEditor").prop('checked') ? 1 : 0,
                CssHtml: $("#txt_html").val()
            };
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
                    Summary: "这是描述",
                    Icon: "glyphicon glyphicon-question-sign",
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: ""
                }
            };
            dom.getEditNode().append(template.render(List.addWidgetTemplate, data));
            var $showNode = dom.getShowNode();
            $showNode.trigger('refresh');
            $showNode.trigger('refreshEdit', true);
            List.refreshAddButton();
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
            List.refreshAddButton();
        }
    };
    return List;
});




