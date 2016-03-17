/**
 * 作者：yujinjin9@126.com 
 * 时间：2015-11-04 
 * 描述：提示加载信息spin插件。加载的提示页面中只会显示一个无需显示更多
 */
var site = site || {};
$(function() {
	site.preloader = {
		spinner: null,//spinner插件对象
		randomId: null, //随机ID
		defaultOptions: {
            lines: 8, // 花瓣数目
            length: 0, // 花瓣长度
            width: 10, // 花瓣宽度
            radius: 15, // 花瓣距中心半径
            corners: 1, // 花瓣圆滑度 (0-1)
            rotate: 0, // 花瓣旋转角度
            direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
            color: '#FFFFFF', // 花瓣颜色
            speed: 1, // 花瓣旋转速度
            trail: 40, // 花瓣旋转时的拖影(百分比)
            shadow: true, // 花瓣是否显示阴影
            hwaccel: false, //spinner 是否启用硬件加速及高速旋转            
            className: 'spinner', // spinner css 样式名称
            zIndex: 2e9 // spinner的z轴 (默认是2000000000)
            //top: '90', // 样式中的top的值（以像素为单位，写法同css）
    		//left: 'auto' // 样式中的left的值（以像素为单位，写法同css）
       },
		
       showPreloader: function(options){
			this.hidePreloader();
			this.randomId = (new Date()).getTime();
			if((typeof(options) != "object" && options !== false) || (typeof(options) === "object" && options.mask !== false)){
				this.showMask();
			}
			var $preloaderTemplate = $("<div></div>");
			$preloaderTemplate.attr("id", "spin_preloader_"+this.randomId);
			$("body").append($preloaderTemplate);
			var $preloaderContent = $("#spin_preloader_"+this.randomId);
			var _spinner = new Spinner($.extend({}, this.defaultOptions, options||{}));
			_spinner.spin($preloaderContent[0]);
			$preloaderContent.children().css("position", "fixed");
			this.disableScroll();
		},
		
		hidePreloader: function(){
			//关闭预加载框 
			if(site.preloader.spinner){
				site.preloader.spinner.spin();
			}
			if(site.preloader.randomId){
				$("#spin_modal_"+site.preloader.randomId).remove();
				$("#spin_preloader_"+site.preloader.randomId).remove();
			}
			site.preloader.spinner = null;
			site.preloader.randomId = null;
			this.enableScroll();
		},
		
		//显示遮罩层
		showMask: function(){
			var $modalOverlayTemplate = $("<div></div>");
			$modalOverlayTemplate.css({
				"display": "block",
				"background": "rgba(0, 0, 0, 0.4)",
			    "position": "fixed",
			    "z-index": "9999",
			    "left": "0px",
			    "top": "0px",
			    "width": "100%",
			    "height": "100%",
			    "opacity": "1",
			    "filter": "alpha(opacity=100)",
			    "transition-duration": "400ms"
			});
			$modalOverlayTemplate.attr("id", "spin_modal_"+this.randomId);
			$("body").append($modalOverlayTemplate);
		},
		
		//按键事件
		keydown: function (e) {
			// left: 37, up: 38, right: 39, down: 40,
			// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
			var keys = [37, 38, 39, 40];
			for (var i = keys.length; i--;) {
				if (e.keyCode === keys[i]) {
					e = e || window.event;
					if (e.preventDefault)
					      e.preventDefault();
					e.returnValue = false; 
			       return;
			    }
			}
		},

		//滚轮事件
		wheel: function (e) {
			e = e || window.event;
			if (e.preventDefault)
			      e.preventDefault();
			e.returnValue = false; 
		},

		//禁用滚轮、page事件
		disableScroll: function () {
			if (window.addEventListener) {
				window.addEventListener('DOMMouseScroll', this.wheel, false);
			}
			window.onmousewheel = document.onmousewheel = this.wheel;
			document.onkeydown = this.keydown;
		},

		//启用滚轮、page事件
		enableScroll: function () {
			if (window.removeEventListener) {
				window.removeEventListener('DOMMouseScroll', this.wheel, false);
			}
			window.onmousewheel = document.onmousewheel = document.onkeydown = null;  
		}
	}
});