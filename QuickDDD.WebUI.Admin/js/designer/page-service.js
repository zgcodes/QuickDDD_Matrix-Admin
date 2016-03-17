/**
 * 作者：yujinjin9@126.com
 * 时间：2015-10-25
 * 描述：站点页面数据业务处理
 */
define(["render", "designerUtils", "service", "template", "validation", "api"], function (render, designerUtils, service, template, validation, api) {
    // 框架基础，暂时只做namespace使用
    var dom = render.dom;
    var info = render.info;
    var $pageListContainer = dom.getPageList();
    var tpl = ['<li class="page-li{@if Page.isFirst} active{@/if}" data-is-first="{@if Page.isFirst}1{@else}0{@/if}" data-id="${Page.pageId}" data-title="${Page.pageName}">',
	           '	<i class="glyphicon glyphicon-book page-ico"></i>',
	           '	<a class="page-name" href="javascript:void(0);">${Page.pageName}</a>',
               '	<span class="button-group">',
               '		{@if Page.isFirst===false}<a href="javascript:void(0);" data-type="delete" title="删除"><i class="glyphicon glyphicon-trash"></i></a>{@/if}',
               '		<a href="javascript:void(0);" data-type="edit" title="修改标题"><i class="glyphicon glyphicon-pencil"></i></a>',
               '		<a href="javascript:void(0);" data-type="export" title="导出"><i class="glyphicon glyphicon-cloud-download"></i></a>',
               '		{@if Page.isFirst===false}<a href="javascript:void(0);" data-type="setFirst" title="设为本站点首页（进入微官网看到的第一个页面）" class="page-home-btn"><i class="icon-home"></i></a>{@/if}',
               '	</span>',
	           '</li>'].join('\n');

    // 页面列表
    // 行业编辑中仍然使用此列表
    var pageService = {
        init: function (pageListJson) {
            $pageListContainer = dom.getPageList();
            if(pageListJson && pageListJson.length > 0){
            	var _html = "";
            	for(var i=0;i<pageListJson.length;i++){
            		_html = _html + template.render(tpl, {Page:pageListJson[i]});
            		if(pageListJson[i].isFirst){
                		info.pageId = pageListJson[i].pageId;
                	}
            	}
            	$pageListContainer.html(_html);
            }
            pageService.initEvent();
        },
        // 渲染样式
        render: function (pageId) {
        	if(!pageId){
        		pageId = $pageListContainer.find("li[data-is-first='1']").attr("data-id");
        	}
        	if(!pageId){
        		pageId = $pageListContainer.find("li[data-id]:eq(0)");
        	}
        	if($pageListContainer.find("li.active").attr("data-id") === pageId){
        		return;
        	}
            $pageListContainer.find("li").removeClass("active");
            $pageItem = $pageListContainer.find("li[data-id='" + pageId + "']");
            $pageItem.addClass('active');
        },
        // 绑定选取页面事件
        initEvent: function () {
            $pageListContainer.on('click', 'a.page-name', function () {
                var pageId = $(this).parent().attr("data-id");
                $pageListContainer.find("li.active").removeClass("active");
                $(this).parent().addClass("active");
                var changePage = function (pageid) {
                	render.info.pageId = pageid;
                	service.renderPage(pageid);
                }
                service.CheckPageModified(changePage, pageId);
                return false;
            });
            // 绑定修改页面名称事件
            $pageListContainer.on('click', "span.button-group > a[data-type='edit']", function () {
                var pageId = $(this).parent().parent().attr("data-id");
                var pageTitle = $(this).parent().parent().attr("data-title");
                pageService.editPageTitle(pageId, pageTitle);
            });
            // 绑定删除页面
            $pageListContainer.on('click', "span.button-group > a[data-type='delete']", function () {
            	var pageId = $(this).parent().parent().attr("data-id");
                var pageTitle = $(this).parent().parent().attr("data-title");
                pageService.deletePage(pageId, pageTitle);
            });
            
            // 站点页面数据导出功能
            $pageListContainer.on('click', "span.button-group > a[data-type='export']", function () {
            	var pageId = $(this).parent().parent().attr("data-id");
            	pageService.sitePageExport(pageId);
            });
            
            // 默认地址页面
            $pageListContainer.on('click', "span.button-group > a[data-type='setFirst']", function () {
            	var pageId = $(this).parent().parent().attr("data-id");
                var pageTitle = $(this).parent().parent().attr("data-title");
            	pageService.setIndexPage(pageId, pageTitle);
            });

            $pageListContainer.on('edit.pageList', function (event, id, title) {
            	pageService.editPageTitle(id, title);
            });

            $pageListContainer.on('render.pageList', function (event, id) {
                pageService.render(id);
            });

            $pageListContainer.on('add.pageList', function (event, id, title) {
                pageService.addPageItem(id, title);
            });
        },
        // 添加 actPageItem
        addPageItem: function (pageId, title, isFirst) {
            var tplData = {
                Page: {
                    pageId: pageId,
                    pageName: title,
                    isFirst: (isFirst?true:false)
                }
            };
            $pageListContainer.append(template.render(tpl, tplData));
        },
        // 删除 actPageItem
        removeActPageItem: function (removeActPageId) {
        	var $pageItem = $pageListContainer.find("li[data-id='" + removeActPageId + "']");
        	var pageId = null;
        	if($pageItem.next().length === 0){
        		pageId = $pageItem.prev().attr("data-id");
        	} else {
        		pageId = $pageItem.next().attr("data-id");
        	}
        	$pageItem.remove();
            pageService.render(pageId);
        },
        // 设置首页
        setIndexPage: function (pageId, pageTitle) {
        	var content = '您确认要设置页面 "' + pageTitle + '"为站点首页吗？';
            var doSetIndex = function (result) {
            	if (!result) return;  //取消删除
	            var ajaxCallback = function ($result) {
	                if (false === $result) {
	                	designer.alert('设置默认地址失败');
	                } else {
	                	designer.success('设置默认地址成功');
	                	var $firstPageItem = $pageListContainer.find('a[data-is-first="1"]');
	                	$pageListContainer.attr("data-is-first", "0");
	                	$firstPageItem.find("span.button-group").prepend('<a href="javascript:void(0);" data-type="delete" title="删除"><i class="glyphicon glyphicon-trash"></i></a>');
	                	$firstPageItem.find("span.button-group").append('<a href="javascript:void(0);" data-type="setFirst" title="设为本站点首页（进入微官网看到的第一个页面）" class="page-home-btn"><i class="icon-home"></i></a>');
	                	$pageListContainer.find('a[data-id="'+pageId+'"]').attr("data-is-first", "1");
	                	var aElementArr = $pageListContainer.find('a[data-id="'+pageId+'"]').find("span.button-group");
	                	if(aElementArr.length == 4){
                			$(aElementArr[0]).remove();
                			$(aElementArr[3]).remove();
                		}
	                }
	            };
	            service.setIndexPage(ajaxCallback, pageId);
            }
            designer.confirm(content, doSetIndex);
        },
        
        //站点页面数据导出
        sitePageExport: function(id){
        	if(id){
        		var url = api.sitePageExportUrl+"?id=" + id;
        		var downloadFrame = $("iframe[name='downloadFrame']");
        		if (downloadFrame.length == 0){
        			$("body").append("<iframe frameborder=\"0\" scrolling=\"no\" name=\"downloadFrame\" style=\"display:none\"></iframe>")
        			downloadFrame = $("iframe[name='downloadFrame']");
        		}
        		downloadFrame.attr("src",url);
        	} else {
        		designer.error("参数信息不正确！");
        	}
        },
        
        // 删除 actPage
        deletePage: function (deletePageId, pageTitle) {
            var content = '您确认要删除页面 "' + pageTitle + '"吗？';
            var doDelete = function (result) {
                if (!result) return;  //取消删除
                var ajaxCallback = function (result) {
                    if (false === result) {
                    	designer.error('删除页面错误');
                        return false;
                    }
                    designer.success('删除页面成功 ');
                    // 删除页面后，清楚页面修改标记
                    service.unmarkWidgetModified();
                    window.location.reload();
                };
                api.deletePage(ajaxCallback, deletePageId);
            }
            if ($pageListContainer.find("li[data-id]").length == 1) {
            	designer.error('该页面为此站点唯一页面，不能被删除！');
                return;
            }
            if($pageListContainer.find("li[data-id='"+deletePageId+"']").attr("data-is-first")==="1"){
            	designer.error('默认站点页面，不能删除！');
                return;
            }
            designer.confirm(content, doDelete);
        },
        // 页面改名
        editPageTitle: function (pageId, title) {
        	designer.prompt("请输入新的页面标题", function (result) {
        		if (result === null) return;
        		var newTitle = result;
        		if (!validation.getAuthResult(newTitle, { authType: 'text', authAttr: '[1,12]' })) {
        			designer.error('请输入1-12个字的页面名称');
        			return false;
        		}
        		// 校验站点名称
        		if (!validation.getAuthResult(newTitle, { authType: 'reg', authAttr: 'pageTitle' })) {
        			designer.error('页面名称只能是汉字、英文或数字字符');
        			return false;
        		}
        		
        		var ajaxCallback = function (result) {
        			if (result === false) {
        				designer.error('修改页面名称时出现错误');
        				return false;
        			}
        			designer.success('页面名称修改成功');
        			$pageListContainer.find("[data-id='" + pageId + "'] > a.page-name").text(newTitle);
        		};
        		api.savePageTitle(ajaxCallback, pageId, newTitle);
        	}, { value: title, maxlength: 12 });
        }
    };

    return pageService;
});
