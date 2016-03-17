/**
 * 作者：yujinjin9@126.com 
 * 时间：2015-11-04 
 * 描述：提示信息toastr插件
 */
var site = site || {};
$(function() {
	site.toastr = site.toastr || {};
	site.toastr.defaultOptions = {
		"closeButton" : true, // 是否显示关闭图标
		"debug" : true, // 是否使用debug模式
		"newestOnTop" : false, //最新出现的消息是否是显示在顶部
		"tapToDismiss" : true, //点击提示框是否隐藏
		"progressBar": true, //是否显示进度条
		"onclick": null, //点击插件回调函数
		"positionClass" : "toast-top-full-width",// 弹出窗的位置
		"preventDuplicates": true,//防止消息重复,如果当前显示的信息有重复就不再去显示
		"showDuration" : "300",// 显示的动画时间
		"hideDuration" : "1000",// 消失的动画时间
		"timeOut" : "5000", // 展现时间
		"extendedTimeOut" : "1000",// 加长展示时间
		"showEasing" : "swing",// 显示时的动画缓冲方式
		"hideEasing" : "linear",// 消失时的动画缓冲方式
		"showMethod" : "fadeIn",// 显示时的动画方式
		"hideMethod" : "fadeOut" // 消失时的动画方式
	};
		
	site.toastr.execute = function(toastrType, msg, title, options) {
		if(options && typeof(options) === "object"){
			toastr.options = $.extend({}, site.toastr.defaultOptions, options);
		}
		toastr[toastrType](msg, title);
	};

	// 成功提示绑定
	site.toastr.success = function(msg, title, options) {
		if(!msg){
			msg = "成功了！";
		}
		site.toastr.execute("success", msg, title, options);
	}

	// 信息提示绑定
	site.toastr.info = function(msg, title, options) {
		if(!msg){
			msg = "提示信息！";
		}
		site.toastr.execute("info", msg, title, options);
	}

	// 敬告提示绑定
	site.toastr.warning = function(msg, title, options) {
		if(!msg){
			msg = "警告！";
		}
		site.toastr.execute("warning", msg, title, options);
	}

	// 错语提示绑定
	site.toastr.error = function(msg, title, options) {
		if(!msg){
			msg = "出错了！";
		}
		site.toastr.execute("error", msg, title, options);
	}

	// 清除窗口绑定
	site.toastr.clear = function() {
		toastr.clear();
	}

	//site.toastr.init();
});