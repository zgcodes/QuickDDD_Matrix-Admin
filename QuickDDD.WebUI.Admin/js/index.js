/**
 * 作者：yujinjin9@126.com 
 * 时间：2015-11-04 
 * 描述：首页信息
 */
$(function(){
	var cmsFrame = {
		views: {
			navlogo:$("nav.menu-head > div.navbar-container > div.navbar-header"),//顶部左边的 log
			navSidebarCollapseBar: $("nav.menu-head > div.navbar-container > div.sidebar-collapse"), //边框折叠
			navMenuBars: $("nav.menu-head > div.navbar-container > div.pull-left > ul.menu"),//菜单栏集合
			navRefreshButton: $("nav.menu-head > div.navbar-container > div.navbar-header > ul.menu > li.refresh"), //刷新按钮
			navTabButton: $("nav.menu-head > div.navbar-container > div.navbar-header > ul.menu > li.tabNav"), //显示TAB栏
			navLogoutButton: $("nav.menu-head > div.navbar-container > div.navbar-header > ul.menu > li.logout"), //退出按钮
			navUserMenu: $("ul.user-menu > li[role!='separator']"),//用户操作菜单
			sidebarLeft: $("div.sidebar-left"),//左边导航栏父容器
			contentTabs: $("div.content > div.content-tabs"),//内容标签栏
			contentTabsLeftButton: $("div.content > div.content-tabs > button.roll-left"), //内容标签栏左滑动按钮
			contentTabsPages:$("div.content > div.content-tabs > nav.page-tabs > div.page-tabs-content"), //内容标签栏内容栏
			contentTabsRightButton: $("div.content > div.content-tabs > button.roll-right"), //内容标签栏右滑动按钮
			contentTabsMenu: $("div.content > div.content-tabs > div.roll-close > ul.dropdown-menu > li[role!='separator']"), // 内容标签栏操作按钮
			contentIFrameContainer: $("div.content") //内容区域的内联页面容器
		}, //视图对象集合
		
		templates: {
			tabPage: function(id, name, type){
				return '<a href="javascript:void(0);" class="active " data-id="'+id+'"'+(type?('data-type="'+type+'"'):'')+'>'+name+'<i class="fa fa-times-circle"></i></a>';
			},//tab标签页内容
			headMenus: null,//顶部菜单栏
			sidebarLeftMenus: null,//左边菜单栏
			iframe: function(id, src){
				return '<iframe frameborder="0" data-id="'+id+'" class="contentFrame" src="'+src+'"></iframe>'
			}//内容iframe窗口
		},//模板内容集合
		
		menuScroll: null, //滚动IScroll对象
		defaultFramePath: null, // 默认iframe页面链接
		
		init: function(){
			//初始化页面信息
			this.defaultFramePath = this.views.contentIFrameContainer.find("iframe[data-id='defaultFrame']").attr("src");
			this.initIScroll();
			this.refreshMenuScroll();
			this.bindEvent();
			this.loadMenu();
			this.hiddenTabBar();
		},
		
		initIScroll: function(){
			//初始化IScroll
			if(this.isHiddenContentTabs()){
				return;
			}
			if(this.menuScroll == null){
				this.menuScroll = new IScroll($("div.content > div.content-tabs > nav.page-tabs")[0], 
					{eventPassthrough: true,
			        scrollX: true,
			        scrollY: false,
			        preventDefault: false});
			}
		},
		
		loadMenu: function(){
			//菜单数据加载
			var _this = this;
			site.ajax({
			    url: site.config.contextPath + "/Login/InitSidebarMenu",
			    type: "GET",
				success: function(data){
					_this.templates.headMenus = site.tempate.renderById("head-menu", data);
					_this.views.navMenuBars.html(site.tempate.renderById("head-menu", data));
					_this.templates.sidebarLeftMenus = $(site.tempate.renderById("left-menu", data));
				}
			});
		},
		
		bindEvent: function(){
			//页面绑定事件
			var _this = this;
			_this.windowWidthChangeEvent();
			_this.views.navSidebarCollapseBar.on("click", function(){
				_this.changeSidebarLeftState();
			});
			_this.leftMenutClickEvent();
			_this.headMenuClickEvent();
			_this.userMenuClickEvent();
			_this.contentTabsMenuClickEvent();
			_this.views.navTabButton.click(function (e) {
                if ($(this).attr("data-status") === "hide") {
                    $(this).find("span.menu-text").text("隐藏TAB栏");
                    _this.showTabBar();
                    $(this).attr("data-status", "open");
                } else {
                    $(this).find("span.menu-text").text("显示TAB栏");
                    _this.hiddenTabBar();
                    $(this).attr("data-status", "hide");
                }
            });
			_this.views.navRefreshButton.click(function(events){
				_this.views.contentIFrameContainer.find("iframe:visible")[0].contentWindow.location.reload(true);;
			});
		},
		
		isHiddenContentTabs: function(){
			// 内容标签栏是否是隐藏状态
			return this.views.contentTabs.is(":hidden");
		},
		
		refreshMenuScroll: function(el){
			//刷新IScroll
			if(this.isHiddenContentTabs()){
				return;
			}
			_this = this;
            if (_this.menuScroll) {
                var _width = 0;
                //contentTabsPages: $("div.content > div.content-tabs > nav.page-tabs > div.page-tabs-content"),
                _this.views.contentTabsPages.find("a").each(function (i, el) {
                    _width += ($(el).outerWidth(true));
                });
                if (_width <= $("div.content > div.content-tabs > nav.page-tabs").width()) {
                    _width = $("div.content > div.content-tabs > nav.page-tabs").width();
                    if (!_this.views.contentTabsLeftButton.hasClass("hidden")) {
                        _this.views.contentTabsLeftButton.addClass("hidden");
                        _this.views.contentTabsRightButton.addClass("hidden");
                    }
                } else {
                    _width += 80;
                    if (_this.views.contentTabsLeftButton.hasClass("hidden")) {
                        _this.views.contentTabsLeftButton.removeClass("hidden");
                        _this.views.contentTabsRightButton.removeClass("hidden");
                    }
                }
                _this.views.contentTabsPages.css("min-width", _width + "px");
                //				_this.menuScroll.refresh();
                setTimeout(function () {
                    _this.menuScroll.refresh();
                    //滑动到指定元素位置
                    if (_this.menuScroll && el) {
                        _this.menuScroll.scrollToElement(el, 1000, -100, 0);
                    }
                }, 500);
            } else {
                _this.views.contentTabsPages.css("min-width", $("div.content > div.content-tabs > nav.page-tabs").width());
            }
		},
		
		changeSidebarLeftState: function(){
			//隐藏左边导航栏
			if($("body").hasClass("crouching")){
				this.views.navSidebarCollapseBar.find("i").removeClass("glyphicon-hand-right").addClass("glyphicon-hand-left");
				$("body").removeClass("crouching");
			} else {
				$("body").addClass("crouching");
				this.views.navSidebarCollapseBar.find("i").removeClass("glyphicon-hand-left").addClass("glyphicon-hand-right");
			}
		},
		
		openIFrame: function(aElement){
			// 通过点击顶部或左边导航菜单 创建/显示 内连页面
			var id = aElement.attr("data-id");
			var href = aElement.attr("data-href");
			var name = aElement.children("span.menu-text").text();
			if(!id || !href || href==="#"){
				return false;
			}
			//tab栏操作
			var _this = this;
			if(_this.views.contentTabs.is(":hidden")){
				var _defalutFrame = _this.views.contentIFrameContainer.find("iframe[data-id='defaultFrame']");
				_defalutFrame.attr("src", href);
				if(_defalutFrame.is(":hidden")){
					_this.views.contentIFrameContainer.find("iframe:visible").hide();
					_defalutFrame.show();
				}
				return true;
			}
			var activeTab = _this.views.contentTabsPages.find("a.active");
			if(activeTab.attr("data-id") == id){
				return true;
			}
			activeTab.removeClass("active");
			if(activeTab.attr("data-type") === "dialog"){
				//当前页面是弹出框页面
				_this.hideDialog($("div[data-id='"+activeTab.attr("data-id")+"']"), activeTab.text());
			}
			_this.views.contentIFrameContainer.find("iframe:visible").hide();
			var tab = _this.views.contentTabsPages.find("a[data-id='"+id+"']");
			if(tab.length == 0){
				_this.views.contentTabsPages.append(_this.templates.tabPage(id, name));
				_this.views.contentIFrameContainer.append(_this.templates.iframe(id, href));
				tab = _this.views.contentTabsPages.find("a[data-id='"+id+"']");
				_this.refreshMenuScroll(tab[0]);
			} else {
				tab.addClass("active");
				_this.views.contentIFrameContainer.find("iframe[data-id='"+id+"']").show();
				_this.tabSlideToElement(tab[0]);
			}
			return true;
		},
		
		hideDialog: function(dialog, title, e){
			//隐藏弹出框
			if(!dialog){
				return;
			}
			var _this = cmsFrame;
			if(_this.views.contentTabs.is(":hidden")){
				dialog.find("button.close").trigger("click");
				return;
			}
			if(dialog.length == 0){
				return;
			}
			dialog.hide();
			dialog.next(".modal-backdrop").removeClass().addClass("modal-shade");
			dialog.css("position", "relative");
			var id = null;
			if(dialog.attr("data-id")){
				id = dialog.attr("data-id");
			} else {
				id = "dialog" + (new Date()).getTime();
				dialog.attr("data-id", id);
			}
			var tab = _this.views.contentTabsPages.find("a[data-id='"+id+"']");
			if(tab.length == 0){
				_this.views.contentTabsPages.append(_this.templates.tabPage(id, title, "dialog"));
				tab = _this.views.contentTabsPages.find("a[data-id='"+id+"']");
				tab.removeClass("active");
				_this.refreshMenuScroll(tab[0]);
				dialog.children().on("hidden", function(e){
					if(_this.views.contentIFrameContainer.find("iframe:visible").length > 0){
						var _frame_id = _this.views.contentIFrameContainer.find("iframe:visible").attr("data-id");
						_this.views.contentTabsPages.find("a[data-id='"+_frame_id+"']").addClass("active");
						tab.remove();
					} else {
						_this.closeTab(tab, true);
					}
				});
			} else if(tab.hasClass("active")){
				tab.removeClass("active");
				if(_this.views.contentIFrameContainer.find("iframe:visible").length > 0){
					var _frame_id = _this.views.contentIFrameContainer.find("iframe:visible").attr("data-id");
					_this.views.contentTabsPages.find("a[data-id='"+_frame_id+"']").addClass("active");
					_this.refreshMenuScroll(_this.views.contentTabsPages.find("a[data-id='"+_frame_id+"']")[0]);
				} else {
					_this.views.contentIFrameContainer.find("iframe[data-id='defaultFrame']").show();
				}
			}
		},
		
		showDialog: function(id){
			//显示弹出框
			var _dialog = $("div[data-id='"+id+"']");
			if(_dialog.lenght == 0){
				return;
			}
			_dialog.css("position", "fixed");
			_dialog.next(".modal-shade").removeClass().addClass("modal-backdrop fade in");
			_dialog.show();
		},
		
		tabLeftSlide: function(event){
			// 标签栏左滑动
			if(this.menuScroll){
				this.menuScroll.scrollTo(0, 0, 1000);
			}
		},
		
		tabRightSlide: function(){
			// 标签栏右滑动
			if(this.menuScroll){
				this.menuScroll.scrollTo($("div.content > div.content-tabs > nav.page-tabs").width()-this.views.contentTabsPages.width(), 0, 1000);
			}
		},
		
		tabSlideToElement: function(el){
			//滑动到指定元素位置
			if(this.menuScroll){
				this.menuScroll.scrollToElement(el, 1000, -100, 0);
			}
		},
		
		closeCurrentTab: function(){
			//关闭当前标签栏
			var _this = this;
			var activeTab = _this.views.contentTabsPages.find("a.active");
			if(activeTab.length > 0){
				_this.closeTab(activeTab);
			}
			this.refreshMenuScroll();
		},
		
		closeOtherTab: function(){
			//关闭其他标签栏
			var _this = this;
			_this.views.contentTabsPages.find("a:not(.active)").each(function(i, el){
				_this.closeTab($(el));
			});
			this.refreshMenuScroll();
		},
		
		closeAllTab: function(){
			//关闭所有
			var _this = this;
			_this.views.contentTabsPages.find("a").each(function(i, el){
				_this.closeTab($(el));
			});
			this.refreshMenuScroll();
		},
		
		hiddenTabBar: function(){
			//隐藏标签栏
			this.views.contentTabs.hide();
		},
		
		showTabBar: function(){
			//显示隐藏标签栏
			this.views.contentTabs.show();
		},
		
		showTab: function(tab){
			//显示隐藏标签
			var _this = this;
			var id = tab.attr("data-id");
			var activeTab = _this.views.contentTabsPages.find("a.active");
			if(activeTab.attr("data-id") == id){
				return;
			}
			activeTab.removeClass("active");
			if(activeTab.attr("data-type") === "dialog"){
				//当前页面是弹出框页面
				_this.hideDialog($("div[data-id='"+activeTab.attr("data-id")+"']"), activeTab.text());
			} else if(tab.attr("data-type") !== "dialog"){
				_this.views.contentIFrameContainer.find("iframe:visible").hide();
			}
			if(tab.attr("data-type") === "dialog"){
				_this.showDialog(id);
			} else {
				_this.views.contentIFrameContainer.find("iframe[data-id='"+id+"']").show();
			}
			tab.addClass("active");
			_this.tabSlideToElement(tab[0]);
		},
		
		closeTab: function(tab, isEvent){
			//显示隐藏标签
			var _this = this;
			var id = tab.attr("data-id");
			if(tab.attr("data-type") === "dialog" && isEvent !== true){
				$("div[data-id='"+tab.attr("data-id")+"']").find("button.close").trigger("click");
			} else {
				_this.views.contentIFrameContainer.find("iframe[data-id='"+id+"']").remove();
			}
			if(!tab.hasClass("active")){
				tab.remove();
				return;
			}
			var newTab = null;
			if(tab.next("a").length > 0){
				newTab = tab.next("a");
			} else if(tab.prev("a").length > 0){
				newTab = tab.prev("a");
			}
			if(newTab != null){
				newTab.addClass("active");
				if(newTab.attr("data-type") === "dialog"){
					_this.showDialog(newTab.attr("data-id"));
				} else {
					_this.views.contentIFrameContainer.find("iframe[data-id='"+newTab.attr("data-id")+"']").show();
				}
			} else {
				if(_this.views.contentIFrameContainer.find("iframe[data-id='defaultFrame']").attr("src") != _this.defaultFramePath){
					_this.views.contentIFrameContainer.find("iframe[data-id='defaultFrame']").attr("src", _this.defaultFramePath);
				}
				_this.views.contentIFrameContainer.find("iframe[data-id='defaultFrame']").show();
			}
			tab.remove();
			this.refreshMenuScroll();
		},
		
		windowWidthChangeEvent: function(){
			//窗口大小变化事件
			var _this = this;
			$(window).on("load resize", function () {
		        var _width = $(this).width();
		        if(_width <= 768){
		        	if(!$("body").hasClass("crouching")){
		        		$("body").addClass("crouching");
		        		_this.views.navSidebarCollapseBar.find("i").removeClass("glyphicon-hand-left").addClass("glyphicon-hand-right");
		        		_this.refreshMenuScroll();
		        		_this.views.navTabButton.hide();
                        var _$submenu = $(".crouching .page-sidebar > .sidebar-menu > li > .submenu:visible");
                        if (_$submenu.length > 0) {
                            _$submenu.parent("li").trigger("click");
                        }
		        	}
		        } else{
		        	if($("body").hasClass("crouching")){
		        		$("body").removeClass("crouching");
		        		_this.views.navSidebarCollapseBar.find("i").removeClass("glyphicon-hand-right").addClass("glyphicon-hand-left");
		        		_this.refreshMenuScroll();
		        		_this.views.navTabButton.show();
                        _this.views.navSidebarCollapseBar.find("i").removeClass("glyphicon-hand-right").addClass("glyphicon-hand-left");
                        _this.refreshMenuScroll();
        		        if (!_this.isHiddenContentTabs()) {
        		        	_this.views.navTabButton.find("span.menu-text").text("显示TAB栏");
        	            }
		        	}
		        }
		    });
		},
		
		leftMenutClickEvent: function(){
			//左边菜单点击事件
			var _this = this;
			_this.views.sidebarLeft.on("click", "ul.sidebar-menu > li", function(event){
				if($(this).find("ul.submenu").length > 0){
					if($(this).hasClass("open")){
						$(this).removeClass("open");
						$(this).find("ul.submenu").hide();
					} else {
						_this.views.sidebarLeft.find("ul.sidebar-menu > li.open > ul.submenu").hide();
						_this.views.sidebarLeft.find("ul.sidebar-menu > li.open").removeClass("open");
						$(this).addClass("open");
						$(this).find("ul.submenu").show();
					}
				} else {
					if(_this.openIFrame($(this).find("a"))){
						_this.views.sidebarLeft.find("ul.sidebar-menu > li.active").removeClass("active");
						_this.views.sidebarLeft.find("ul.sidebar-menu > li > ul.submenu > li.active").removeClass("active");
						$(this).addClass("active");
					}
				}
			});
			
			_this.views.sidebarLeft.on("click", "ul.sidebar-menu > li > ul.submenu > li", function(event){
				event.stopPropagation();
				var isOpen = _this.openIFrame($(this).find("a"));
				if($(this).hasClass("active")){
					return;
				}
				if(isOpen){
					_this.views.sidebarLeft.find("ul.sidebar-menu > li.active").removeClass("active");
					_this.views.sidebarLeft.find("ul.sidebar-menu > li > ul.submenu > li.active").removeClass("active");
					$(this).addClass("active");
				}
			});
		},
		
		headMenuClickEvent: function(){
			//顶部菜单点击事件
		    var _this = this;
		    _this.views.navMenuBars.on("click", "li", function (event) {
				var id = $(this).children("div.head-module").attr("data-id");
				if(!id){
					return;
				}
				if(_this.views.sidebarLeft.children("div.head[data-id='"+id+"']").length > 0){
					return;
				}
				if(_this.templates.sidebarLeftMenus.next("div[data-id='"+id+"']").length == 0){
					return;
				}
				if(_this.views.navTabButton.attr("data-status") === "open") {
                    _this.showTabBar();
                }
				if(_this.views.sidebarLeft.hasClass("hide")){
					_this.views.sidebarLeft.removeClass("hide");
				}
				var html = "";
				_this.views.sidebarLeft.html(_this.templates.sidebarLeftMenus.next("div[data-id='"+id+"']").html());
				_this.openIFrame(_this.views.sidebarLeft.find("li.active > a"));
			});
		},
		
		userMenuClickEvent: function(){
			//用户菜单点击事件
			var _this = this;
			_this.views.navUserMenu.on("click", function(event){
				_this.openIFrame($(this));
			});
		},
		
		contentTabsMenuClickEvent: function(){
			//标签栏菜单点击事件
			var _this = this;
			_this.views.contentTabsMenu.on("click", function(event){
				var code = $(this).attr("data-code");
				if(code == "closeCurrentTab"){
					_this.closeCurrentTab();
				} else if(code == "closeOtherTab"){
					_this.closeOtherTab();
				} else if(code == "closeAllTab"){
					_this.closeAllTab();
				} else if(code == "hiddenTabBar"){
					_this.hiddenTabBar();
				}
			});
			
			_this.views.contentTabsPages.on("click", "a", function(event){
				_this.showTab($(this));
			});
			
			_this.views.contentTabsPages.on("click", "a > i.fa-times-circle", function(event){
				event.stopPropagation();
				_this.closeTab($(this).parent("a"));
			});
			
			_this.views.contentTabsLeftButton.on("click", function(event){
				_this.tabLeftSlide();
			});
			
			_this.views.contentTabsRightButton.on("click", function(event){
				_this.tabRightSlide();
			});
		}
	}
	cmsFrame.init();
	var dialogFun = site.dialog;
	site.dialog = function(options){
		if (typeof (options.href) == "string" && options.href.length > 0) {
			if(options.minButton !== false){
				options.minButton = true;
				if(options.onMinimize && $.isFunction(options.onMinimize)){
					var _MinimizeFun = options.onMinimize;
					options.onMinimize = function(dialog, title, e){
						cmsFrame.hideDialog(dialog, title, e);
						_MinimizeFun(dialog, title, e);
					}
				} else {
					options.onMinimize = function(dialog, title, e){
						cmsFrame.hideDialog(dialog, title, e);
					}
				}
			}
		}
		if($.isFunction(dialogFun)){
			return dialogFun(options);
		}
	}
});
