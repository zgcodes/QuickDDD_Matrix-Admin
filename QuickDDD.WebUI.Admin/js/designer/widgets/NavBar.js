/**
 * 作者：yujinjin9@126.com
 * 时间：2015-10-25
 * 描述：设计器的底部导航栏
 */
define(["api", "designerUtils", "render", "components", "template"], function (api, designerUtils, render, components, template) {
	var info = render.info, dom = render.dom;
    var NavBar = {
        defaultData: {
            FWidgetCode: 'NavBar',
            FWidgetName: '全局导航组件',
            FType: "navbar",
            FData: {
                Buttons: [{
                    Title: "网站首页",
                    Icon: "glyphicon glyphicon-home",
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: ""
                }, {
                    Title: "在线客服",
                    Icon: "glyphicon glyphicon-headphones",
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: ""
                }, {
                    Title: "一键拨号",
                    Icon: "glyphicon glyphicon-earphone",
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: ""
                }, {
                    Title: "地址导航",
                    Icon: "glyphicon glyphicon-map-marker",
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: ""
                }, {
                    Title: "个人中心",
                    Icon: "glyphicon glyphicon-user",
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: ""
                }]
            },
            FStyle: {
                BgImage: {
                    "Data":"{&quot;type&quot;:&quot;gradient&quot;,&quot;pic&quot;:null,&quot;gradient&quot;:{&quot;deg&quot;:&quot;270&quot;,&quot;isUseStopColor&quot;:0,&quot;fromColor&quot;:&quot;#4a4a4a&quot;,&quot;stopColor&quot;:&quot;#4a86e8&quot;,&quot;toColor&quot;:&quot;#292929&quot;,&quot;stopColorPercent&quot;:&quot;50&quot;}}",
                    "CssText":"background-image: -webkit-linear-gradient(270deg,#4a4a4a,#292929)"
                },
                BgColor: "#454955",
                TopBorderColor: "",
                ButtonMargin: "0",
                ButtonPadding: "2",
                ButtonBgImage: "",
                ButtonBgColor: "",
                ButtonSplitColor: "#666A73",
                IconTextOneRow: 0,
                IconColor: "#fff",
                TextSize: "14px",
                TextColor: "#fff",
                TextBold: "",
                ShowHtmlEditor: "",
                CssHtml: ""
            },
            count: 5
        },
        // 字段校验规则
        validate: {
            'Title': {
                type: 'text',
                attr: '[1, 6]',
                tips: '请输入1-6个字的按钮名称'
            },
            // 校验按钮个数
            'length': {
                type: 'length',
                attr: function (data) {
                    var result = false;
                    if (data.FData && data.FData.Buttons && data.FData.Buttons.length >= 2 && data.FData.Buttons.length <= 5) {
                        result = true;
                    }
                    return result
                },
                tips: '请设置2-5个快捷按钮'
            }
        },
        // 必须存在的key
        // 手机内显示模板
        showWidgetTemplate: function () {
            return [
			    '<section class="wNavBar ${FWidgetId}">',
                    '<style>',
                    'section.wNavBar {',
                    '  {@if (FStyle.BgImage.CssText)}$${FStyle.BgImage.CssText|csstext};{@/if}',
                    '  {@if (FStyle.BgColor)}background-color: ${FStyle.BgColor};{@/if}',
                    '  {@if (FStyle.TopBorderColor)}border-top: 1px solid ${FStyle.TopBorderColor};{@/if}',
                    '}',
                    'section.wNavBar ul li {',
                    '  width: ${count|buttonColumns};',
                    '  padding: ${FStyle.ButtonMargin|padding};',
                    '  {@if (FStyle.ButtonSplitColor)}border-left: 1px solid ${FStyle.ButtonSplitColor};{@/if}',
                    '}',
                    'section.wNavBar ul li a {',
                    '  {@if (FStyle.ButtonBgImage.CssText)}$${FStyle.ButtonBgImage.CssText|csstext};{@/if}',
                    '  {@if (FStyle.ButtonBgColor)}background-color: ${FStyle.ButtonBgColor};{@/if}',
                    '  {@if (FStyle.ButtonPadding>0)}padding: ${FStyle.ButtonPadding|padding};{@/if}',
                    '  {@if (FStyle.IconTextOneRow==1)}text-align: ${FStyle.TextAlign};{@/if}',
                    '}',
                    'section.wNavBar ul li a .divicon {',
                    '  {@if (FStyle.IconColor)}color: ${FStyle.IconColor};{@/if}',
                    '  {@if (FStyle.IconTextOneRow==1)}display: inline-block!important;vertical-align: middle;{@/if}',
                    '}',
                    'section.wNavBar ul li a .divtext {',
                    '    font-size: ${FStyle.TextSize};',
                    '  {@if (FStyle.TextColor)}color:  ${FStyle.TextColor};{@/if}',
                    '  {@if (FStyle.TextBold==1)}font-weight:bold;{@/if}',
                    '  {@if (FStyle.IconTextOneRow==1)}display: inline-block;vertical-align: middle;position:relative;{@/if}',
                    '}',
                    '$${FStyle.CssHtml}',
                    '</style>',
			        '{@if count == 0}<div class="message">快捷导航栏：请添加快捷按钮。</div>{@else}',
			        '<ul>',
			        '{@each FData.Buttons as Button}',
			        '<li style="width:${count|buttonColumns};">',
                    '    <a {@if (Button.LinkUrl != "")}href="${Button.LinkUrl}"{@/if} style="{@if (Button.BgColor)}background-color: ${Button.BgColor};{@/if}">',
                    '        <div class="divicon">$${Button.Icon|icon}</div>',
                    '        <div class="divtext">${Button.Title}</div>',
                    '    </a></li>',
                    '</li>',
			        '{@/each}',
			        '</ul>',
			        '{@/if}',
			        '<script type="text/javascript">',
 		           	'	$(function(){',
 		           	'		$(".${FWidgetId}.wNavBar").attr("data-padding-bottom", $(".${FWidgetId}.wNavBar").outerHeight());',
 		           	'		var _bootom_height = 0;',
 		           	'		$(".${FWidgetId}.wNavBar[data-padding-bottom]").each(function(index, el){',
 		           	'			_bootom_height += parseInt($(el).attr("data-padding-bottom"),10);',
 		           	'		});',
 		           	'		$("#show_panel_content").css("padding-bottom", _bootom_height+"px");',
 		           	'	});',
 		           	'</script>',
			     '</section>'
            ].join("\n");
        },
        // 属性框模板
        editWidgetTemplate: [
            '<div id="edit-block" class="edit-block container" data-widget-id="${FWidgetId}" style="min-height:100px;">',
			'     <label><b>快捷导航设置</b> <span class="help-inline">（限2-5个快捷按钮）</span></label>',
            '    {@each FData.Buttons as Button, index}',
            '    <dl class="edit-block-row sortable">',
            '        <dt class="delete-btn" title="删除"></dt>',
            '        <dd class="row">',
            '            <div class="col-xs-2" style="width:80px">',
            '<label>按钮图标<span class="asterisk invisible">*</span></label>',
            '<div class="icon-box" title="点击选择图标">$${Button.Icon|icon}</div>',
            '<input type="hidden" data-tmpldata="Icon" value="${Button.Icon}" />',
            '            </div>',
            '            <div class="col-xs-8">',
            '<div class="form-group">',
            '    <label>按钮名称<span class="asterisk">*</span></label><span class="help-inline">（限6个字）</span>',
            '    <div class="controls">',
            '        <input class="form-control" type="text" maxlength="6" data-tmpldata="Title" value="$${Button.Title}" placeholder="请输入按钮名称">',
            '    </div>',
            '</div>',
            '<div class="form-group">',
            '    <label>链接地址</label><span class="help-inline">（点击下框进行设置）</span>',
            '    <div class="controls outlink">',
            '        <input class="form-control link-src" type="text" readonly data-tmpldata="LinkDisplay" value="${Button.LinkDisplay}">',
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
            '        <div><button class="add_Block btn btn-lg btn-primary"><i class="icon-plus"></i>添加快捷按钮</button></div>',
            '    </div>',
            '</div>'].join("\n"),
        styleWidgetTemplate: [
            '<div id="style-block" class="edit-block style-block container form-horizontal">',
            '    <div class="edit-block-row">',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">导航栏背景图：</label>',
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
            '        <label class="col-xs-3 control-label">导航栏背景色：</label>',
            '        <div class="col-xs-4 controls">',
            '	        <input class="form-control input-mini" id="nav_bgcolor" readonly type="text" value="${FStyle.BgColor}" />',
            '        </div>',
            '        <div class="col-xs-5"><span class="help-block">（可以设置为透明）</span></div>',
            '    </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">顶部线颜色：</label>',
            '        <div class="col-xs-4 controls">',
            '	        <input class="form-control input-mini" id="nav_tbcolor" readonly type="text" value="${FStyle.TopBorderColor}" />',
            '        </div>',
            '        <div class="col-xs-5"><span class="help-block">（可以设置为透明）</span></div>',
            '    </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">分隔线颜色：</label>',
            '        <div class="col-xs-4 controls">',
            '	        <input class="form-control input-mini" id="split_color" readonly type="text" value="${FStyle.ButtonSplitColor}" />',
            '        </div>',
            '        <div class="col-xs-5"><span class="help-block">（可以设置为透明）</span></div>',
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
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">图标颜色：</label>',
            '	    <div class="col-xs-9 controls">',
            '	        <input class="form-control input-mini" id="icon_color" readonly type="text" value="${FStyle.IconColor}" />',
            '	    </div>',
            '	</div>',
            '  </div>',
            '  <div class="edit-block-row">',
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
            '  </div>',
            '  <div class="edit-block-row">',
            '	<div class="form-group">',
            '	    <label class="col-xs-3 control-label">其他选项：</label>',
            '	    <div class="col-xs-9 controls">',
            '	        <label><input class="ace" id="icontext_onerow" type="checkbox" {@if (FStyle.IconTextOneRow==1)}checked="checked"{@/if} data-tmpldata="icontext_onerow" value="1" /><span class="lbl">图标文字在同一行</span></label>',
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
            '	    <textarea id="txt_html" class="input-xxlarge" rows="15">{@if (FStyle.CssHtml=="")}/*section.wNavBar{ }*/{@else}$${FStyle.CssHtml}{@/if}</textarea>',
            '	</div>',
            '    </div>',
            '</div>'].join("\n"),
        addWidgetTemplate: [
            '    <dl class="edit-block-row sortable">',
            '        <dt class="delete-btn" title="删除"></dt>',
            '        <dd class="row">',
            '            <div class="col-xs-2" style="width:90px">',
            '<label>按钮图标：<span class="asterisk invisible">*</span></label>',
            '<div class="icon-box" title="点击选择图标"><i class="${Button.Icon}"></i></div>',
            '<input type="hidden" data-tmpldata="Icon" value="${Button.Icon}" />',
            '            </div>',
            '            <div class="col-xs-8">',
            '<div class="form-group">',
            '    <label>按钮名称：<span class="asterisk">*</span></label><span class="help-inline">（限6个字）</span>',
            '    <div class="controls">',
            '        <input class="form-control" type="text" maxlength="6" data-tmpldata="Title" value="$${Button.Title}" placeholder="请输入按钮名称">',
            '    </div>',
            '</div>',
            '<div class="form-group">',
            '    <label>链接地址：</label><span class="help-inline">（点击下框进行设置）</span>',
            '    <div class="controls outlink">',
            '        <input class="form-control link-src" type="text" readonly data-tmpldata="LinkDisplay" value="${Button.LinkDisplay}">',
            '        <input type="hidden" data-tmpldata="LinkSrc" value="${Button.LinkSrc}">',
            '        <input type="hidden" data-tmpldata="LinkUrl" value="${Button.LinkUrl}">',
            '    </div>',
            '</div>',
            '            </div>',
            '        </dd>',
            '    </dl>'
        ].join("\n"),
        initWidgetShowNode: function ($showNode) {
        	$showNode.css({
        		"bottom": "0px",
        		"width": "100%",
        		"opacity": 1,
        		"z-index": 110,
        	    "position": "fixed"
        	});
//            var $footerHeight;
//            var $panel = $showNode.closest(".show_panel_content");
//            var con = $showNode.closest(".mCSB_container");  //在使用jquery.mCustomScrollbar替代浏览器滚动条时才有效
//            $footer = $showNode;
//
//            $panel.css({
//                'padding-bottom': $footer.height() > 100 ? 49 : $footer.height()
//            });
//            if ($footer.size() > 0) {
//                var setTop = function () {
//                    var cls = $showNode.attr("class");
//                    //console.log(cls);
//                    if (cls.indexOf('ui-sortable-helper') > 0) return;  //正在拖动中
//                    var fixBorder = 0; // fix: width of border
//
//                    var sTop = -parseInt(con.css("top"));
//                    $footer.css('top', (520 + sTop + fixBorder - $footer.height()));
//                    //var bodyPading = parseInt($('.wx-body').css('padding-top')) + parseInt($('.wx-body').css('padding-bottom'));
//                    //$footer.css('top', (520 + sTop + fixBorder - $footer.height()) - bodyPading);
//                };
//                setTop();
//                $panel.on('scroll', function () {
//                    setTop();
//                });
//                $panel.on('resize', function () {
//                    setTop();
//                });
//            }
        },
        // 做组件初始化事件绑定等
        initWidgetEditNode: function ($showNode, $editNode, data) {
            var $this = this;
            // 删除
            $editNode.find(".delete-btn").click(function () {
                $removeNode = $(this).parent('.edit-block-row');
                designer.confirm("您确定删除此快捷按钮吗？", $this.removeBlock, { args: $removeNode });

            });

            $editNode.find(".add_Block").click(function () {
                NavBar.addBlock();
            });
            //设置图标
            components.initIconBox(".icon-box", $showNode, $editNode, data);
            //设置链接
            components.initOutLink(".outlink", $showNode, $editNode);
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
                limitObj.wordMax = 6;
                limitObjs.push(limitObj);
            })

            //剩余字数提示
            designerUtils.wordLimitTips({
                limitObj: limitObjs
            });
            NavBar.refreshAddButton();
            //初始化控件状态
            var $stylePanel = dom.getStylePanel();
            components.colorInput($stylePanel.find("#nav_bgcolor"));
            components.colorInput($stylePanel.find("#nav_tbcolor"));
            components.colorInput($stylePanel.find("#button_bgcolor"));
            components.colorInput($stylePanel.find("#split_color"));
            components.colorInput($stylePanel.find("#icon_color"));
            components.colorInput($stylePanel.find("#text_color"));
            //导航栏背景图
            components.initBgImage('#bgbox', $showNode, $editNode);
            //按钮背景图
            components.initBgImage('#bgbox-btn', $showNode, $editNode);
            //按钮间距
            components.initPadding('#button-margin', $showNode, $editNode, data.FStyle.ButtonMargin, { min: 0, max: 20, step: 1 });
            //按钮内边距
            components.initPadding('#button-padding', $showNode, $editNode, data.FStyle.ButtonPadding, { min: 0, max: 20, step: 1 });

            $("#showHtmlEditor").change(function () {
                $(".stylehtml").toggleClass('hide');
            })

        },
        // 返回提交数据时 组件数据json
        returnWidgetEditData: function ($editNode) {
            // 第三个参数控制是否为数组,默认为false
            var inputData = designerUtils.modelData($editNode, 'Title Icon BgColor LinkDisplay LinkSrc LinkUrl', true); // 通用格式获取数据
            var count = inputData.Title.length;
            var data = {
                FWidgetCode: 'NavBar',
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
                    'BgColor': inputData.BgColor[i],
                    'LinkDisplay': inputData.LinkDisplay[i],
                    'LinkSrc': inputData.LinkSrc[i],
                    'LinkUrl': inputData.LinkUrl[i]
                };

                data.FData.Buttons[i] = button;
            }

            var $stylePanel = dom.getStylePanel();
            var styleData = designerUtils.modelData($stylePanel, 'icontext_onerow', false);
            data.FStyle = {
                BgImage: components.getBgImage('#bgbox'),
                BgColor: $("#nav_bgcolor").val(),
                TopBorderColor: $("#nav_tbcolor").val(),
                ButtonBgImage: components.getBgImage('#bgbox-btn'),
                ButtonBgColor: $("#button_bgcolor").val(),
                ButtonSplitColor: $("#split_color").val(),
                ButtonMargin: designerUtils.getPadding('#button-margin'),
                ButtonPadding: designerUtils.getPadding('#button-padding'),
                IconColor: $("#icon_color").val(),
                TextSize: $("#text_size").val(),
                TextColor: $("#text_color").val(),
                TextBold: $("#text_bold").prop('checked') ? 1 : 0,
                IconTextOneRow: styleData["icontext_onerow"],
                ShowHtmlEditor: $("#showHtmlEditor").prop('checked') ? 1 : 0,
                CssHtml: $("#txt_html").val()
            };

            return data;
        },
        // 可选
        preRenderWidget: function (data) {
            //如果站点信息中有快捷导航的数据，以整站的导航数据为准
            //if (WX_Info.navbarData != null) {
            //    data.FData.Buttons = WX_Info.navbarData.FData.Buttons;
            //}

            data.count = data.FData && data.FData.Buttons ? data.FData.Buttons.length : 0;
            return data;
        },
        addBlock: function () {
            var blockNum = dom.getEditNode().find('input[data-tmpldata="Title"]').length;
            var data = {
                Button: {
                    Title: "标题",
                    Icon: "micon-home",
                    LinkDisplay: "",
                    LinkSrc: "",
                    LinkUrl: ""
                }
            };
            dom.getEditNode().append(template.render(NavBar.addWidgetTemplate, data));
            var $showNode = dom.getShowNode();
            $showNode.trigger('refresh');
            $showNode.trigger('refreshEdit', true);
            NavBar.refreshAddButton();
        },
        refreshAddButton: function () {
            var blockNum = dom.getEditNode().find('input[data-tmpldata="Title"]').length;
            if (blockNum >= 5) {
                dom.getEditNode().find(".add_Block").hide();
            } else {
                dom.getEditNode().find(".add_Block").show();
            }
        },
        removeBlock: function (result, $removeNode) {
            if (!result) return;
            $removeNode.remove();
            var $showNode = dom.getShowNode();
            $showNode.trigger('refresh');

            NavBar.refreshAddButton();
        }
    };
    return NavBar;
});




