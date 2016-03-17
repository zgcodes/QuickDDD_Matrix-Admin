/**
 * 作者：yujinjin9@126.com
 * 时间：2015-10-08
 * 描述：设计器初始化功能
 */
define(["api", "designerUtils", "service", "page-service", "template", "render"], function (api, designerUtils, service, pageService, template, render) {
	var designerController = {
		
		//初始化设计器页面
		init: function(){
			render.info.siteId = "0000000-000";
			designerController.initEvent();
			designerController.queryData();
		},
		
		//绑定设计器页面
		initEvent: function(){
			designerController.windowEvent();
			designerController.pageEvent();
		},
		
		//数据查询
		queryData: function(){
			designerController.queryWidgetsList();
			designerController.queryNavBarData();
		},
		
		//查询组件列表
		queryWidgetsList: function(){
			var callbackFun = function(data){
				if(!data.success){
					designer.error(data.error || data.error.message || "组件加载出错!");
					return;
				}
				var templ = ['{@each _ as widgets}',
				            '<div class="item-container">',
				            '	<div class="widget_item" data-type="${widgets.type}" data-widget-code="${widgets.code}">',
				            '		$${widgets.icon|icon}<span class="title">${widgets.name}</span>',
				            '	</div>',
				            '</div>',
				            '{@/each}'].join("\n");
				var html = template.render(templ, data.result);
				$('#panel-widgets').html(template.render(templ, data.result));
				designerController.toolbarWidgetsEvent();
				designerController.showPanelSortableEvent();
			}
			api.loadWidgetList(callbackFun);
		},

		// 查询导航栏数据
		queryNavBarData: function(){
			var callbackFun = function(data){
				if(data && data.success){
					try{
						render.info.dbNavbarData = JSON.parse(data.result.globalComponentAttribute);
						render.info.navbarData = JSON.parse(data.result.globalComponentAttribute);
					} catch(e){
						console.info(e);
					}
					render.info.navbarHtml = render.info.dbNavbarHtml = data.result.globalComponentHtml;
				}
				designerController.queryPageList();
			}
			api.queryNavBar(callbackFun, render.info.siteId);
		},
		
		//查询页面列表信息
		queryPageList: function(){
			var callbackFun = function(data){
				if(!data.success){
					designer.error(data.error || data.error.message || "组件加载出错!");
					return;
				}
				pageService.init(data.result);
				var $pageListContainer = render.dom.getPageList();
				var pageId = $pageListContainer.find("li[data-is-first='1']").attr("data-id");
				if(pageId){
					service.renderPage(pageId);
				}
			}
			api.loadPageList(callbackFun);
		},
		
		//窗口事件绑定
		windowEvent: function(){
			window.onbeforeunload = function () {
	            if (service.getWidgetModified()){
	            	return "页面已经修改尚未保存，离开后您先前未保存的操作将会丢失。";
	            }
	        }
		},
		
		//工具栏组件事件绑定(拖拽)
		toolbarWidgetsEvent: function(){
			$(".widget-selectable .widget_item").draggable({
				//允许draggable被拖拽到指定的sortables中。如果使用了该选项，被拖动的元素可以被放置于一个应用了排序组件的元素列表中并成为该列表的一部分。
				//注意: 为了完美的使用该特性，helper选项必须被设置为"clone"。
				connectToSortable: render.dom.getShowPanelContent(),
				appendTo: "#preivewFrame",
				//如果值设置为"clone", 那么该元素将会被复制，并且被复制的元素将被拖动。
				helper: "clone",
				cursor: "move",
				axis : "y",
				addClasses: false,
				//在iframe里拖动
				iframeFix: true,
				//当拖动停止时，元素是否要被重置到它的初始位置。如果设置为"invalid", 重置仅当拖动没有被放置于一个可放置的对象时才会发生。
				revert: "invalid",
				start: function(t, n) {
//					var showNodeId = render.dom.getEditShowNodeId();
//					if (showNodeId && render.dom.getShowNode(showNodeId).attr("data-widget-code") != null)
//						service.refreshShowNode(showNodeId);
				},
				stop: function(t, n) {}
			});

			render.dom.getShowPanelContent().droppable({
				accept : ".widget_item",
				addClasses: false,
				axis : "y",
				drop : function(e, ui) {
					var type = ui.draggable.data('type'), widget = null;
					if (type) {
						var widgetCode = ui.draggable.data('widget-code');
						widget = service.newWidget(type, widgetCode);
					}
					if(!widget){
						ui.draggable.removeClass();
						ui.draggable.remove();
						return;
					}
					//TODO:不知道jQuery.ui为什么会自动加样式，暂时查不出来是在哪里添加的。
					ui.draggable.removeAttr("style");
					ui.draggable.attr(widget);
					service.initShowNode(widget.id, true);
					service.hideShowPanelTips();
				}
			});
		},
		
		//预览框里的组件列表排序
		showPanelSortableEvent: function(){
			render.dom.getShowPanelContent().sortable({
				items : "> .show-node",
				axis : "y",
				distance : 1,
				cancel : ".t-node",
				opacity : .8,
				stop : function(e, ui) {
					//导航栏的样式特殊处理，本来是想写在导航栏的组件里的发现拖拽组件会把此样式给覆盖掉
					if($(ui.item).data('widget-code') == 'NavBar'){
						ui.item.css({
							"z-index": "110",
							"position": "fixed"
						});
					}
					service.markWidgetModified()
				}
			});
		},
		
		//页面组件的事件绑定
		pageEvent: function(){
			//隐藏编辑栏
			$("#edit-panel-close-btn").click(function(e) {
				e.preventDefault();
				service.hideEditPanel()
			});
			// 新建页面
			$("#btnNew").click(function(events) {
				events.preventDefault();
				service.CheckPageModified(service.newPage, render.info.siteId);
			});
			// 保存页面
			$("#btnSave").click(function(events) {
				events.preventDefault();
				service.savePage()
			});
			// 页面设置
			$("#btnPageArr").click(function(events) {
				events.preventDefault();
				service.setPageArr()
			});
			// 页面设置
			$("#btnPreview").click(function(events) {
				events.preventDefault();
				designerController.QRPeview()
			});
		},
		
		//二维码预览
		QRPeview: function(){
			var url = site.config.projectPath + "/designer/view?pageId=" + render.info.pageId;
			var _html = ['<div style="-webkit-box-sizing: content-box; box-sizing: content-box; float:left; overflow: hidden; width: 320px; height: 510px; border: 10px solid #666; box-sizing: content-box; border-radius: 10px; margin: auto; position: relative;">', 
			           '	<iframe style="width: 340px; height: 510px;" frameborder="0" src="' + url + '"></iframe>', 
			           '</div>', 
			           '<div class="qrcode-frame" style="float: left; margin-left: 20px; margin-top: 100px; width: 230px;">',
			           '	<div class="qrcode-s" style="border: 1px solid #ccc; padding: 10px; width: 220px; height: 220px; margin-bottom: 10px;"></div>',
			           '	<span>为了更精确的预览效果，请用手机微信扫描此二维码进行预览。</span>',
			           '</div>'].join('\n');
			var _dialog = designer.dialog({
				width : "640px",
				height : "615px",
	            title: "二维码预览",
	            message: _html,
	            animate: false
	        });
			var kaelPic = new KaelQrcode();
			kaelPic.init(_dialog.find(".qrcode-s")[0], {
		        text : url,
		        size: 200,
		        img: {
		            src : site.config.projectPath + "/images/head.jpg",
		            border: "#fff"
		        }
		    });
			//为了隐藏iframe中的滚动条，特别设置宽度超过20像素，但没有滚动条的时候就会超出，所以判断一下
			_dialog.find("iframe").load(function(events){
				var doc = this.contentWindow.document;
				var html = doc.documentElement, body = doc.body;
				var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight); 
				if(height <= $(this).height()){
					$(this).width(320);
				}
			});
		}
	}
	
	return designerController;
});

