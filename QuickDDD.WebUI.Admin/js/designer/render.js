/**
 * 作者：yujinjin9@126.com
 * 时间：2015-10-08
 * 描述：设计器dom对象、常量对象
 */
define(["designerUtils"], function (designerUtils) {
	var render = {
		//设计器的常量信息
		info: {
			siteId: null, //站点ID
			pageId: null, // 页面ID
			navbarData: null,//底部导航栏JSON
			navbarHtml: null, //底部导航栏HTML
			dbNavbarData: null, //数据库保存的导航栏JSON
			dbNavbarHtml: null //数据库保存底部导航栏HTML
		},
		
		//设计器的dom对象
		dom: {
			getShowPanelContent: function () {
				//设计器预览内容
		        return $(".show_panel_content", window.frames["preivewFrame"].document);
		    },
		    
		    getShowNodes: function () {
		    	//设计器预览内容内的组件节点列表
		        return $(".show_panel_content > .show-node", window.frames["preivewFrame"].document);
		    },
		    
		    getShowNode: function (id) {
		    	//根据ID获取当前预览内容内的组件，如果ID没有传值就获取到默认选中的组件
		    	if(id){
		    		return $(".show_panel_content", window.frames["preivewFrame"].document).find("#" + id);
		    	} else {
		    		return $(".show_panel_content  > .show-node.show-node-selected", window.frames["preivewFrame"].document);
		    	}
		    },
		    
		    getEditPanel: function () {
		    	//获取组件的样式设置编辑 栏
		        return $("#edit_panel");
		    },
		    
		    getEditPanelToolbar: function () {
		    	//获取组件的样式设置编辑 栏中的工具栏
		        return $("#edit_panel .widget-toolbar");
		    },
		    
		    getEditPanelTitle: function () {
		    	//获取组件的样式设置编辑 栏中的标题DOM
		        return $("#edit_panel_title");
		    },
		    
		    getEditNode: function () {
		    	//获取组件的基本设置容器
		        return $("#edit_panel_content");
		    },
		    
		    getStylePanel: function () {
		    	//获取组件的样式设置容器
		        return $("#style_panel_content")
		    },
		    
		    getEditShowNodeId: function () {
		    	//获取到默认选中的组件的ID
		        return $("#edit_panel_content").attr("data-widget-id");
		    },
		    
		    getPageList: function () {
		    	//获取页面列表的父容器
		        return $("#pageList");
		    },
		    
		    setShowNodeData: function (id, showNodeData) {
		    	//设置预览内容中的组件（根据ID）的数据
		    	render.dom.getShowNode(id).attr("data-widget-data", designerUtils.paramEncode(showNodeData))
		    },
		    
		    getShowNodeData: function (id) {
		    	//根据ID获取组件的数据，如果ID未传值就获取默认选中组件的数据
		        id = id || render.dom.getEditShowNodeId();
		        var widgetData = designerUtils.paramDecode(render.dom.getShowPanelContent().find("#" + id).attr("data-widget-data"));
		        return widgetData;
		    },
		    
		    appendWidgetTemplate: function(id, widgetTemplateHtml, isAppend){
		    	window.frames["preivewFrame"].nodeAppendHtml(id, widgetTemplateHtml, isAppend);
		    }
		}
	}
	return render;
});