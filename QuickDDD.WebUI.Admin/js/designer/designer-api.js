/**
 * 作者：yujinjin9@126.com
 * 时间：2015-10-25
 * 描述：设计器API接口交互
 */
define(["render"], function (render) {
	var api = {
		// 背景图片设置URL
		bgimageSetUrl: designer.config.contextPath + "/jsp/designer/bgimage-set.jsp",
		
		// 图标选中URL
		miconSelectUrl: designer.config.contextPath + "/jsp/designer/choose-icon.jsp",
		
		//站点页面信息导出URL
		sitePageExportUrl: designer.config.contextPath + "",
		
		loadWidgetList: function(callback){
			//查询组件列表信息
			designer.ajax({
				url: designer.config.contextPath + "/js/designer/data/widgetBarList.json",
				success: callback
			});
		},
			
		loadPageInfo: function (callback, pageid) {
			//加载页面信息
			var data = {
                "pageId": pageid
            };
			designer.ajax({
				url: designer.config.contextPath + "/designer/queryPageInfo",
				data: data,
				success: callback
			});
		},
		
		//新增页面信息
		addPage: function(callback, siteId, title){
			var data = {
            	'siteId': siteId,
                'pageName': title,
            };
            designer.ajax({
				url: designer.config.contextPath + "/designer/addPage",
				data: data,
				success: callback
			});
		},
		
        savePage: function (callback, siteId, pageId, widgetData, widgetHtml) {
        	//保存页面数据
        	if(widgetHtml && designer.config.resourecePath){
        		widgetHtml = widgetHtml.replace(new RegExp(designer.config.resourecePath,"gm"), "");
        	}
            var data = {
            	'siteId': siteId,
                'pageId': pageId,
                'attribute': widgetData,
                'htmlData': widgetHtml
            };
            designer.ajax({
				url: designer.config.contextPath + "/designer/updatePageInfo",
				data: data,
				success: callback
			});
        },
        
        saveNavBar: function (callBackFunction, siteId, navbarData, navbarHtml) {
        	//保存站点快捷导航
        	if(navbarHtml){
        		navbarHtml = navbarHtml.replace(new RegExp(designer.config.resourecePath,"gm"), "");
        	}
            var data = {
            	'siteId': siteId,
                'globalComponentAttribute': navbarData,
                'globalComponentHtml': navbarHtml
            };
            designer.ajax({
				url: designer.config.contextPath + "/designer/saveSiteGlobalData",
				data: data,
				success: callBackFunction
			});
        },
        
        queryNavBar: function(callbackFun, siteId){
        	// 查询站点导航数据
        	designer.ajax({
        		url: designer.config.contextPath + "/designer/querySiteGlobalData",
 				data: {siteId: siteId},
 				success: callbackFun
 			});
        },
        
        savePageTitle: function (callback, pageId, title) {
        	//保存页面名称标题
        	var data = {
    			'pageId': pageId,
    			'siteId': render.info.siteId,
    			'pageName': title
        	};
        	designer.ajax({
				url: designer.config.contextPath + "/designer/updatePageName",
				data: data,
				success: callback
			});
        },
        
        deletePage: function (callback, pageId) {
        	//删除页面
            var data = {
        		'pageId': pageId,
        		'siteId': render.info.siteId
            };
            designer.ajax({
				url: designer.config.contextPath + "/designer/deletePage",
				data: data,
				success: callback
			});
        },
        
        setIndexPage: function (callback, pageId) {
        	//设置为首页
            var data = {
            	'siteId': render.info.siteId,
            	'pageId': pageId
            };
            designer.ajax({
				url: designer.config.contextPath + "/designer/setFirstPage",
				data: data,
				success: callback
			});
        },
        
        loadPageList: function (callback) {
        	//加载站点页面列表
            var data = {
            	'siteId': render.info.siteId
            };
            designer.ajax({
				url: designer.config.contextPath + "/designer/queryPageList",
				data: data,
				success: callback
			});
        }
	}
	return api;
});