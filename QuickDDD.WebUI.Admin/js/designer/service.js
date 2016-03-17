/**
 * 作者：yujinjin9@126.com
 * 时间：2015-10-25
 * 描述：设计器对象模型
 */
define(["api", "designerUtils", "render", "widget-control", "template", "validation", "components"], 
function (api, designerUtils, render, widgetControl, template, validation, components) {
	
	var service = {}, dom = render.dom, info = render.info;
	// 隐藏预览框中的提示"拖入组件"的样式
	service.hideShowPanelTips = function () {
        var $content = dom.getShowPanelContent();
        if ($content.find(".show-node").length > 1) {
            $content.addClass("not_empty");
        } else {
            $content.removeClass("not_empty");
        }
    };

    /**
	 * 根据showNode.widget_data 初始化showNode
	 */
    service.initShowNode = function (id, isNewWidget) { //第二个参数 表示是否为首次添加组件
        id = id || dom.getEditShowNodeId();
        isNewWidget = isNewWidget || false;
        var $showNode = dom.getShowNode(id);
        var widgetCode = $showNode.attr('data-widget-code');
        var widgetData = designerUtils.paramDecode($showNode.attr('data-widget-data'));
        var widget = widgetControl.getWidgetByCode(widgetCode);
        // 重组 showNode 数据
        if (widget && $.isFunction(widget.preRenderWidget)) {
            widgetData = widget.preRenderWidget(widgetData);
        }
        $showNode.empty();
        service.renderShowNode($showNode, widgetData, true);
        service.markWidgetModified();
        service.initShowNodeEvent(id, false, isNewWidget);
    };
    
    // 渲染单个组件节点数据 isAppend:用于区分$showNode是否是直接插入，因为$showNode节点有可能是最后插入到子页面中
    service.renderShowNode = function ($showNode, widgetData, isAppend) {
        var $showNodeBody = $('<div class="show-node-body"></div>');
        var $showNodeContent = null;
        var widget = widgetControl.getWidgetByCode(widgetData.FWidgetCode);
        if (widget && $.isFunction(widget.showWidgetTemplate)) {
            //////用组件的默认值补全对象的属性，解决当组件增加属性时旧页面数据出错的问题
            ////widgetData = $.extend(true, {}, WX_Widget[widgetData.FWidgetCode].defaultData, widgetData)  
            $showNodeContent = $(template.render(widget.showWidgetTemplate(widgetData), widgetData));
        } else {
            $showNodeContent = $('此组件数据出错');
            console.log(widgetData.FWidgetCode + '不存在');
        }
        $showNodeBody.append($showNodeContent);
        $showNode.append('<div class="delete-btn"></div>');
        if(isAppend){
        	dom.appendWidgetTemplate("#"+$showNode.attr("id"), $showNodeBody, true);
        } else {
        	$showNode.append($showNodeBody);
        }
    };

    //渲染页面中所有的组件节点数据
    service.renderShowNodes = function (widgetDatas, pageId) {
        var pageId = pageId || 0;
        var pageHtml = '';
        // 读取页面数据数据
        for (var i in widgetDatas) {
            var widgetData = widgetDatas[i];
            if (!widgetData) continue;
            widgetData.PageId = pageId;
            var id = widgetData['FWidgetId'] != null ? widgetData['FWidgetId'] : 'rand' + i + new Date().getTime();
            var widgetCode = widgetData['FWidgetCode'];
            var widgetName = widgetData['FWidgetName'];
            var type = widgetData['type'];
            var widget = widgetControl.getWidgetByCode(widgetCode);
            //底部导航栏是全局数据特殊处理
            if (widgetCode == 'NavBar' && info.navbarData != null) {
                widgetData.FData = info.navbarData.FData;
                widgetData.FStyle = info.navbarData.FStyle;
            }
            // 隐藏页面设置组件
            var showNodeClass = '';
            if (widgetCode == 'PageSetting') {
                showNodeClass = 'hide';
            }
            var showNodeContainer = '<div class="show-node ${show_node_class}" id="${id}" data-type="${type}" data-widget-name="${widgetName}"  data-widget-code="${widgetCode}" data-widget-data="${widgetData}"></div>';
            // 重组 showNode 数据
            if (widget != null && $.isFunction(widget.preRenderWidget)) {
                widgetData = widget.preRenderWidget(widgetData);
            }
            // 增加id
            widgetData['FWidgetId'] = id;
            var containerData = {
                'id': id,
                'show_node_class': showNodeClass,
                'type': type,
                'widgetName': widgetName,
                'widgetCode': widgetCode,
                'widgetData': designerUtils.paramEncode(widgetData, widgetCode)
            };
            var $showNode = $(template.render(showNodeContainer, containerData));
            service.renderShowNode($showNode, widgetData, false);
            pageHtml += designerUtils.toHtmlString($showNode);
        }
        return pageHtml;
    };
    
    //选中预览框中的节点
    service.selectShowNode = function (id) {
    	service.refreshEditNode(id);
    	service.showEditPanel();

        // 更改选中 showNode 样式
        dom.getShowNodes().each(function (i, ele) {
            $(ele).removeClass('show-node-selected');
        });
        dom.getShowNode(id).addClass('show-node-selected');
    };
    
    // 初始化 showNode事件
    service.initShowNodeEvent = function (id, initFromPage, isNewWidget) {
        initFromPage = initFromPage || false;
        isNewWidget = isNewWidget || false;
        var $showNode = dom.getShowNode(id);
        var widgetCode = $showNode.attr('data-widget-code');
        var widget = widgetControl.getWidgetByCode(widgetCode);
        var widgetName = $showNode.attr('data-widget-name');
        var type = $showNode.attr('data-type');
        // Drop in
        if (initFromPage == false) {
            // 更改选中 showNode 样式
            dom.getShowNodes().each(function (i, ele) {
                $(ele).removeClass('show-node-selected');
            });
            $showNode.addClass('show-node-selected');
            // 显示 EditPanel
            service.showEditPanel();
            // 刷新 EditNode
            service.refreshEditNode(id, isNewWidget);
        }
        // 绑定保存按钮事件
        $showNode.find('.delete-btn').click(function () {
            var name = widgetName;
            if (name && name.slice(-2) !== "组件") {
                name += '组件';
            }
            designer.confirm('确认删除此“' + widgetName + '”吗？删除后将无法恢复。', service.removeWidget, { args: $showNode });
        });
        // 初始化 ShowNode
        if ($.isFunction(widget.initWidgetShowNode)) {
        	widget.initWidgetShowNode($showNode);
        }
        // 绑定 showNode click 事件
        $showNode.click(function () {
            // 拖拽时保存已有数据
            var oldId = dom.getEditShowNodeId();
            var $oldShowNode = dom.getShowNode(oldId);

            if ($oldShowNode && $oldShowNode.attr('data-widget-code')) {
                $oldShowNode.trigger('refresh');
                service.authEditNode(oldId);
            }
            service.selectShowNode(id);
        });
        
        $showNode.on('refresh', function (event, options) {
        	service.refreshShowNode(id, options);
        });
        $showNode.on('refreshEdit', function (event, isNew) {
        	service.refreshEditNode(id, isNew);
        });
    };

    // 根据editNode数据刷新 showNode
    service.refreshShowNode = function (id, options) {
        id = id || dom.getEditShowNodeId();
        var $showNode = dom.getShowNode(id);
        var $editNode = dom.getEditNode();
        var type = $showNode.attr('data-type');
        var widgetCode = $showNode.attr('data-widget-code');
        var widgetName = $showNode.attr('data-widget-name');
        var widget = widgetControl.getWidgetByCode(widgetCode);
        var showNodeData = widget.returnWidgetEditData($editNode);
        showNodeData.type = type;
        showNodeData.FWidgetId = $editNode.find("#edit-block").data("widget-id");
        showNodeData.FWidgetCode = widgetCode;
        showNodeData.FWidgetName = widgetName;
        // 设置 showNodeData(data-widget-data)
        dom.setShowNodeData(id, showNodeData);
        // if (loadEditData) {
        if ($.isFunction(widget.preRenderWidget)) {
            showNodeData = widget.preRenderWidget(showNodeData);
        }
        ///LYM
        //////用组件的默认值补全对象的属性，解决当组件增加属性时旧页面数据出错的问题
        ////showNodeData = $.extend(true, {}, WX_Widget[widgetCode].defaultData, showNodeData)
        var showWidgetTemplate = widget.showWidgetTemplate(showNodeData);
        //$showNode.find("> .show-node-body").html(template.render(showWidgetTemplate, showNodeData));
        //采用函数插入预览模板数据
        dom.appendWidgetTemplate("#"+$showNode.attr("id") + " > .show-node-body", template.render(showWidgetTemplate, showNodeData), false);
        // 初始化 ShowNode
        if ($.isFunction(widget.initWidgetShowNode)) {
        	widget.initWidgetShowNode($showNode);
        }
        // 标识 showNode已编辑
        service.markWidgetModified();
    };

    // 校验editNode所有输入
    service.authEditNode = function (id, isNewWidget) {
        isNewWidget = isNewWidget || false;
        id = id || dom.getEditShowNodeId();
        var $showNode = dom.getShowNode(id);
        var $editNode = dom.getEditNode();
        var type = $showNode.attr('data-type');
        var widgetCode = $showNode.attr('data-widget-code');
        var widget = widgetControl.getWidgetByCode(widgetCode);
        var widgetName = $showNode.attr('data-widget-name');
        var showNodeData = dom.getShowNodeData(id);
        // Clear widget errors
        delete validation.Errors[id];
        // 第一次新添组件，校验错误但不标红
        if (widget && widget.validate) {
            for (var i in widget.validate) {
                if (i === 'length') {
                    result = widget.validate[i].attr(showNodeData);
                    authTips = widgetName + '：' + widget.validate.length.tips + '。';
                    validation.recordErrors(result, id, i, authTips, null);
                }
                else {
                    var $t = $editNode.find('[data-tmpldata="' + i + '"]');
                    $t.each(function (i, ele) {
                        var authOptions = {
                            element: $(ele),
                            id: id,
                            widgetCode: widgetCode,
                            isShowError: !isNewWidget,
                            isRecordError: true,
                            data: showNodeData
                        };
                        service.authInput(authOptions);
                    });
                }
            }
        }
    };

    // 刷新 editNode
    service.refreshEditNode = function (id, isNewWidget) {  //第二个参数标识  是否问第一次新添组件
        isNewWidget = isNewWidget || false;
        id = id || dom.getEditShowNodeId();
        var $showNode = dom.getShowNode(id);
        var $editNode = dom.getEditNode();
        var type = $showNode.attr('data-type');
        var widgetCode = $showNode.attr('data-widget-code');
        var widget = widgetControl.getWidgetByCode(widgetCode);
        var widgetName = $showNode.attr('data-widget-name');
        //在刷新编辑框前需要清除掉原有颜色选择控件
        components.colorInputControlsDestroy();
        //components.UeditorControlsDestroy();
        // 获取编辑
        var showNodeData = dom.getShowNodeData(id);
        // 重组 editNode 数据
        if (widget && $.isFunction(widget.preRenderWidget)) {
            showNodeData = widget.preRenderWidget(showNodeData);
        }
        // 显示组件名称
        dom.getEditPanelTitle().html(widgetName);
        var content = template.render(widget.editWidgetTemplate, showNodeData);
        $editNode.attr('data-widget-id', id);
        $editNode.attr('data-type', type);  //标识被编辑组件的功能类型，用于选择数据
        //$editNode.attr('data-widget-type', widgetCode);  //好像没有用到
        $editNode.html(content);
        //初始化样式编辑栏
        if (widget.styleWidgetTemplate) {
            dom.getEditPanelToolbar().removeClass("hide");
            var styleContent = template.render(widget.styleWidgetTemplate, showNodeData);
            dom.getStylePanel().html(styleContent);
        } else {  
        	//此控件没有样式设置，隐藏tab控件，切换到基本属性编辑
            dom.getEditPanelToolbar().addClass("hide");
            dom.getEditPanelToolbar().find('a[data-toggle="tab"]:first').tab('show');
        }
        // 初始化 editNode 渲染
        if ($.isFunction(widget.initWidgetEditNode) != null) {
        	widget.initWidgetEditNode($showNode, $editNode, showNodeData);
        }
        service.authEditNode(id, isNewWidget);
        // 公用组件
        $('.tip-button').tooltip({
            'html': true,
            container: 'body',
            animation: false
        });
        $editNode.find(".edit-block").on("keydown", function () {
        	service.markWidgetModified();
        });
        $editNode.find(".edit-block").on("change", "input, select, textarea", function () {
            var authOptions = {
                element: $(this),
                id: id, // show node id
                widgetCode: widgetCode,
                isShowError: true,
                isRecordError: false,
                data: dom.getShowNodeData(id) // query on call
            };
            $showNode.trigger('refresh');
            service.authInput(authOptions);
        });
        dom.getEditPanel().find(".style-block").on("change", "input, select, textarea", function () {
            $showNode.trigger('refresh');
            //setTimeout($showNode.trigger('refresh'), 500);  ///LYM  设置样式时，延迟处理刷新
        });

    };

    /**
	 * 添加一个新组建
	 */
    service.newWidget = function (type, widgetCode, widgetData) {
        $showPanel = dom.getShowPanelContent();
        $editNode = dom.getEditNode();
        //var widgetData;
        var id = 'rand' + new Date().getTime();
        if(widgetData){
        	widgetData = JSON.parse(widgetData);
        } else {
        	widgetData = widgetControl.getWidgetData(widgetCode, type);
        }
        if (widgetData == null) {
        	designer.error('数据出错，未找到组件标识：' + widgetCode);
            return null;
        }
        widgetCode = widgetData.FWidgetCode;
        var widgetName = widgetData.FWidgetName;
        if (widgetCode == 'NavBar' && info.navbarData != null) {
            if (info.navbarData.FData && info.navbarData.FData.Buttons && info.navbarData.FData.Buttons.length > 0) {
                widgetData.FData = info.navbarData.FData;
            }
            widgetData.FStyle = info.navbarData.FStyle;
        }
        var widget = widgetControl.getWidgetByCode(widgetCode);
        // 执行preRenderWidget处理数据
        if (widget && $.isFunction(widget.preRenderWidget)) {
            widgetData = widget.preRenderWidget(widgetData);
        }
        widgetData['FWidgetId'] = id;
        widgetData['type'] = type;
        var widgetData = {
            'id': id,
            'class': 'show-node show-node-selected',
            'data-type': type,
            'data-widget-code': widgetCode,
            'data-widget-name': widgetName,
            'data-widget-data': designerUtils.paramEncode(widgetData, widgetCode)
        };
        return widgetData;
    };
    
    // 删除组件
    service.removeWidget = function (result, $showNode) {
        if (!result) return;
        $editNode = dom.getEditNode();
        $showNode.remove();
        $editNode.empty();
        service.hideEditPanel();
        service.markWidgetModified();
        var id = dom.getEditShowNodeId();
        delete validation.Errors[id];
        service.hideShowPanelTips();
    };

    // 获取-页面设置组件
    service.getPageSettingShowNode = function () {
        var $showNode = null;
        dom.getShowNodes().each(function (i, el) {
            var $el = $(el);
            if ($el.data('widget-code') == 'PageSetting') {
                if ($showNode == null)
                    $showNode = $el;
                else  //只保留第一个，删除其他
                    $el.remove();
            }
        });
        return $showNode;
    };

    // 获取-底部导航组件
    service.getNavBarShowNode = function () {
        var $showNode = null;
        dom.getShowNodes().each(function (i, el) {
            var $el = $(el);
            if ($el.data('widget-code') == 'NavBar') {
                if ($showNode == null){
                	$showNode = $el;
                } else {
                	//只保留第一个，删除其他
                    $el.remove();
                } 
            }
        });
        return $showNode;
    };
    
    // 获取-场景组件
    service.getSceneShowNode = function () {
    	var $showNode = null;
        dom.getShowNodes().each(function (i, el) {
        	var $el = $(el);
            if ($el.data('widget-code') == 'Scene') {
            	$showNode = $el;
            	return;
            }
        });
        return $showNode;
    };
    
    // 获取-所有组件
    service.getAllShowNode = function () {
    	var $showNodeArray = new Array();
        dom.getShowNodes().each(function (i, el) {
            $showNodeArray.push($(el)) ;
        });
        return $showNodeArray;
    };

    //获取 当前编辑 showNodeId 删除掉 已经在dom里体现
//    service.getSelectedNodeId = function () {
//        var result = dom.getShowPanelContent().find(".show-node.show-node-selected").attr('id');
//        return result;
//    };

    // 显示 EditPanel
    service.showEditPanel = function () {
        dom.getEditPanel().show();
    };

    // 隐藏 EditPanel
    service.hideEditPanel = function () {
        dom.getEditPanel().hide();
    };

    // 标记页面组件已修改
    service.markWidgetModified = function () {
        dom.getEditPanel().data('modified', true);
    };
    // 取消标记页面组件已修改
    service.unmarkWidgetModified = function () {
        dom.getEditPanel().data('modified', false);
    };

    service.getWidgetModified = function () {
        var modified = dom.getEditPanel().data('modified');
        return modified == true || modified == "true";
    };

    service.getPageWidgetsInfo = function () {
    	validation.Errors = validation.Errors || {};
        // 触发当前组件校验
    	service.authEditNode(dom.getEditShowNodeId(), false);
        // 如WX_Validation.Errors中存在错误则提示，否则向服务端提交
        var errorNodeIds = [];
        for (var id in validation.Errors) {
            errorNodeIds.push(id);
        }
        var focusAndShowError = function () {
            //WX_Dom.getShowPanelContent().scrollTo(WX_Dom.getShowNode(i)); ///LYM 使用自定义滚动条插件，此处需要重写
            // execute click event
            setTimeout(function () {
            	service.showFirstError();
            }, 0);
        };

        // 如果出错组件非当前选中组件，则跳转到第一个出错的组件
        if (errorNodeIds && errorNodeIds.indexOf(dom.getEditShowNodeId()) >= 0) {
            focusAndShowError();
            return false;
        } else {
            for (var id in validation.Errors) {
                dom.getShowNode(id).click();
                focusAndShowError();
                return false;
            }
        }
        //读取页面上所有组件的数据
        var widgetData = [], widgetHtml = "";
        dom.getShowPanelContent().children().each(function (i, ele) {
            var data = designerUtils.paramDecode($(ele).attr('data-widget-data'));
            var html = $(ele).find('.show-node-body').html();
            //把页面内的快捷导航组件的数据保存在站点信息中，然后清空组件的数据和html再保存在页面中占位，浏览时从站点信息中读取数据动态生成
            if (data.FWidgetCode == 'NavBar') {
                info.navbarData = {
                    FData: $.extend({}, data.FData),  //复制一份
                    FStyle: data.FStyle
                };
                info.navbarHtml = html;
                data.FData.Buttons = [];
                data.count = 0;
                html = $(html).html('')[0].outerHTML;
            } else if (data.FWidgetCode == 'PageSetting') {  //页面设置组件
                var el = $(html);
                el.children('div').remove();
                html = el[0].outerHTML;
            } else if (data.FWidgetCode == 'Scene'){
            	var widget = widgetControl.getWidgetByCode(data.FWidgetCode); 
            	html = template.render(widget.showWidgetTemplate(data), data);
            }
            widgetHtml += html;
            widgetData.push(data);
        });
        return {
        	widgetData: JSON.stringify(widgetData),
            widgetHtml: widgetHtml
        };
    }

    //检查页面保存状态，并执行后续操作
    service.CheckPageModified = function (callback, args) {
        if (service.getWidgetModified()) {
        	designer.dialog({
                message: '当前页面已修改，是否要先保存？',
                title: "提示",
                buttons: {
                    yes: {
                        label: "是",
                        className: "btn-primary",
                        callback: function () {
                        	service.savePage(callback, args);
                        }
                    },
                    no: {
                        label: "否",
                        className: "btn-default",
                        callback: function () {
                            callback(args);
                        }
                    },
                    cancel: {
                        label: "取消",
                        className: "btn-default"
                    }
                }
            });
        }  else {
            callback(args);
        }
    }

    //新建一个页面
    service.newPage = function (siteId) {
    	designer.prompt("请输入新页面标题", function (result) {
            if (result == null) return;
            var title = result;
            var ajaxCallback = function (data) {
                if (data && data.success) {
                    dom.getPageList().trigger("add.pageList", [data.result.pageId, title, data.result.isFirst]);
                    service.renderPage(data.result.pageId);
                }
            };
            api.addPage(ajaxCallback, siteId, title);
        }, {
            value: ""
        });
    };

    // 保存页面
    service.savePage = function (callback, args) {
        var pageWidgetsInfo = service.getPageWidgetsInfo();
        if (pageWidgetsInfo === false) return;  //有验证错误
        var ajaxCallback = function (result) {
            if (false === result.success) {
            	designer.error('页面保存失败');
                return false;
            }
            service.unmarkWidgetModified();
            designer.success('页面保存成功', function () {
                if ($.isFunction(callback))
                    callback(args);
            });
        };
        api.savePage(ajaxCallback, info.siteId, info.pageId, pageWidgetsInfo.widgetData, pageWidgetsInfo.widgetHtml);
        //TODO: 页面初始化时底部导航栏数据赋值
        if (info.dbNavbarHtml != info.navbarHtml) {
            var callBackFunction = function (data) {
            	info.dbNavbarHtml = info.navbarHtml;
            	info.dbNavbarData = JSON.stringify(info.navbarData);
            }
            api.saveNavBar(callBackFunction, info.siteId, JSON.stringify(info.navbarData), info.navbarHtml);
        }
    };

    // Show first error info in the current edit node
    service.showFirstError = function () {
        setTimeout(function () {
            var editNodeError = validation.Errors[dom.getEditShowNodeId()];
            var $editNode = dom.getEditNode();
            var fieldNames = [];
            var i, item, index, fieldName, isShowed;
            if (!editNodeError) {
                return;
            }
            $editNode.find("[data-tmpldata]").each(function () {
                fieldNames.push($(this).attr("data-tmpldata"));
            });

            // Show the first error field in edit node
            for (index in fieldNames) {
                fieldName = fieldNames[index];
                for (item in editNodeError) {
                    // Deal with index
                    if (item.split('--')[0] === fieldName) {
                    	designer.alert(editNodeError[item]);
                        isShowed = true;
                        break;
                    }
                }

                if (isShowed) {
                    break;
                }
            }
            // Error is not in any field
            if (!isShowed) {
                for (i in editNodeError) {
                	designer.alert(editNodeError[i]);
                    isShowed = true;
                }
            }
        }, 0); // lmaozhang: execute click event
    };

    //验证input表单内容
    service.authInput = function (options) {
        ///LYM TODO:
        var widgetCode = options.widgetCode;
        var widget = widgetControl.getWidgetByCode(widgetCode);
        var widgetData = options.data;
        var $element = $(options.element);
        var $editNode = dom.getEditNode();
        var item = $element.attr('data-tmpldata')

        if (widget.validate && widget.validate[item]) {
            var valiKey = widget.validate[item];
            var $target = $element;
            //if (item == 'LinkUrl') {//指定其他字段
            //    $target = $target.closest('div').find('input[data-tmpldata="LinkDisplay"]');
            //}
            var authOptions = $.extend({}, options, {
                authType: valiKey.type,
                authAttr: valiKey.attr,
                errorTarget: $target,
                item: item,
                tips: widgetData.FWidgetName + '：' + valiKey.tips + '。',
                index: $editNode.find('*').index($element)
            });
            validation.authElement($element, authOptions)
        }
    };

    //页面设置
    service.setPageArr = function () {
        var $showNode = service.getPageSettingShowNode();
        if ($showNode != null) {
            $showNode.click();
        } else {
            //在页面中添加页面设置组件
            var widgetCode = 'PageSetting';
            var widget = widgetControl.getWidgetByCode(widgetCode);
            var type = widgetCode;
            var widgetData = widget.defaultData;
            var widgetName = widgetData.FWidgetName;
            var showNodeContainer = '<div class="show-node hide" id="${id}" data-funcId="${funcId}" data-widget-name="${widgetName}"  data-widget-code="${widgetCode}" data-widget-data="${widgetData}"></div>';
            // 重组 showNode 数据
            if (widget && $.isFunction(widget.preRenderWidget)) {
                widgetData = widget.preRenderWidget(widgetData);
            }
            // 增加id
            var id = 'prand' + new Date().getTime();
            widgetData['FWidgetId'] = id;
            var containerData = {
                'id': id,
                'type': type,
                'widgetName': widgetName,
                'widgetCode': widgetCode,
                'widgetData': designerUtils.paramEncode(widgetData, widgetCode)
            };
            $showNode = $(template.render(showNodeContainer, containerData));
            dom.getShowPanelContent().append($showNode);
            service.initShowNode(id, true);
        }
    };

    service.renderPage = function (pageId) {
    	if(!pageId){
    		designer.error("页面信息不能为空!");
    	}
        // 显示顶部name
        // 样式渲染
        dom.getPageList().trigger("render.pageList", [pageId]);
        // 数据渲染
        dom.getEditPanel().hide();
        dom.getEditPanel().find("#edit-block").empty();
        // 将callback传入
        var ajaxCallback = function (data) {
        	if(!data || !data.success){
        		designer.error(data.error.message || "未查询到页面信息");
        	}
            var widgetDatas;
            var widgetDataStr = (data.result && data.result.attribute) ? data.result.attribute : "[]";
            try {
                widgetDatas = JSON.parse(widgetDataStr);
            } catch (err) {
            	designer.error("页面数据格式错误，请联系客服。\r\n页面标识：" + pageId);
                return;
            }
            //dom.getShowPanelContent().html(service.renderShowNodes(widgetDatas, pageId));
            dom.appendWidgetTemplate("#"+dom.getShowPanelContent().attr("id"), service.renderShowNodes(widgetDatas, pageId), false);
            var selectedFlag = false;
            dom.getShowNodes().each(function (i, ele) {
                var $ele = $(ele), id = $ele.attr('id'), widgetCode = $ele.attr('data-widget-code');
                service.initShowNodeEvent(id, true);
                // 显示选中第一个非页面设置组件进行编辑
                if (!selectedFlag && widgetCode != 'PageSetting') {
                	service.selectShowNode(id);
                    selectedFlag = true;
                }
            });
            service.hideShowPanelTips();
            service.unmarkWidgetModified();
        };
        api.loadPageInfo(ajaxCallback, pageId);
    }
    
    service.openSearchLink = function(callbackFun, data){
    	//TODO: 打开搜索外链
    }
    
    service.openOutLink = function(callbackFun, data){
    	//TODO: 打开外部链接窗口
    }
    return service;
});
