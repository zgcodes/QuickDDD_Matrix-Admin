/**
 * 作者：yujinjin9@126.com 
 * 时间：2015-08-04 
 * 描述：前端常用工具函数
 */
var site = site || {};
$(function() {
	site.utils = {};
	
	//获取字符串的长度(去除左右空格)
	site.utils.getLength = function(value){
		if(!value){
			return 0;
		}
		return value.replace(/(^\s*)|(\s*$)/g, "").length;
	}

	//验证value是否email格式
	site.utils.isEmail = function(value){
		return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
	}
	
	//验证value是否URL格式
	site.utils.isUrl = function(value){
		return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
	}
	
	//验证value是否date格式
	site.utils.isDate = function(value){
		return !/Invalid|NaN/.test(new Date(value).toString() );
	}
	
	//验证value是否DateISO格式
	site.utils.isDateISO = function(value){
		return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
	}
	
	//验证value是否number格式
	site.utils.isNumber = function(value){
		return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
	}
	
	//验证value是否digits格式
	site.utils.isDigits = function(value){
		return /^\d+$/.test( alue);
	}
	
	//验证value是否信用卡格式
	site.utils.isCreditcard = function(value){
		if ( /[^0-9 \-]+/.test( value ) ) {
			return false;
		}
		var nCheck = 0,
			nDigit = 0,
			bEven = false,
			n, cDigit;
		value = value.replace( /\D/g, "" );
		if ( value.length < 13 || value.length > 19 ) {
			return false;
		}
		for ( n = value.length - 1; n >= 0; n--) {
			cDigit = value.charAt( n );
			nDigit = parseInt( cDigit, 10 );
			if ( bEven ) {
				if ( ( nDigit *= 2 ) > 9 ) {
					nDigit -= 9;
				}
			}
			nCheck += nDigit;
			bEven = !bEven;
		}
		return ( nCheck % 10 ) === 0;
	}
	
	// 日期格式化
	site.utils.dateFormat = function(date, fmt) {
		// TODO: 没有经过测试
		if (!date || !date instanceof Date) {
			return "";
		}
		var o = {
			"M+" : date.getMonth() + 1, // 月份
			"d+" : date.getDate(), // 日
			"h+" : date.getHours(), // 小时
			"m+" : date.getMinutes(), // 分
			"s+" : date.getSeconds(), // 秒
			"q+" : Math.floor((date.getMonth() + 3) / 3), // 季度
			"S" : date.getMilliseconds()
		// 毫秒
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "")
					.substr(4 - RegExp.$1.length));
		for ( var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
						: (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	// 把URL的参数转换成JSON格式
	site.utils.parseUrlQuery = function(url) {
		var query = {}, i, params, param;
		if (url.indexOf('?') >= 0)
			url = url.split('?')[1];
		else
			return query;
		params = url.split('&');
		for (i = 0; i < params.length; i++) {
			param = params[i].split('=');
			query[param[0]] = param[1];
		}
		return query;
	}

	// 浏览器视口的高度
	site.utils.windowHeight = function() {
		var windowHeight = 0;
		if (document.compatMode == "CSS1Compat") {
			windowHeight = document.documentElement.clientHeight;
		} else {
			windowHeight = document.body.clientHeight;
		}
		return windowHeight;
	}

	// 浏览器视口的宽度
	site.utils.windowWidth = function() {
		var windowWidth = 0;
		if (document.compatMode == "CSS1Compat") {
			windowWidth = document.documentElement.clientWidth;
		} else {
			windowWidth = document.body.clientWidth;
		}
		return windowWidth;
	}

	// 滚动条在Y轴上的滚动距离
	site.utils.scrollTop = function() {
		var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
		if (document.body) {
			bodyScrollTop = document.body.scrollTop;
		}
		if (document.documentElement) {
			documentScrollTop = document.documentElement.scrollTop;
		}
		scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop
				: documentScrollTop;
		return scrollTop;
	}

	// 文档的总高度
	site.utils.scrollHeight = function() {
		var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
		if (document.body) {
			bodyScrollHeight = document.body.scrollHeight;
		}
		if (document.documentElement) {
			documentScrollHeight = document.documentElement.scrollHeight;
		}
		scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight
				: documentScrollHeight;
		return scrollHeight;
	}

	// 滚动刷新 {parametes：{}, callbackFun: fun, eventName: "", scrollBottomHeight:
	// 50, timeOut: 2000}
	site.utils.scrollLoad = function(options) {
		var _defalut = {
			eventName : null, // 滚动事件命名空间，特别重要：主要在注销事件时防止注销其他方法事件的注销
			callbackFun : null, // 回调函数
			parametes : null, // 回调函数传入的参数
			scrollBottomHeight : 100, // 滚动条距离指定底部的距离时执行回调函数
			timeOut : 2000
		// 延迟执行回调函数
		}
		$.extend(true, _defalut, options);
		if (!_defalut.callbackFun || !$.isFunction(_defalut.callbackFun)) {
			return;
		}
		var scrollBottomHeight = _defalut.scrollBottomHeight;
		var loading = false;
		var loadTimes = 0;
		var scrollFun = function(e) {
			// 如果正在加载，则退出
			if (loading)
				return;
			if (site.utils.scrollTop() + site.utils.windowHeight()
					+ scrollBottomHeight >= site.utils.scrollHeight()) {
				console.info("you are in the bottom!");
				loading = true;
				setTimeout(function() {
					options.callbackFun.call(null, loadTimes,
							_defalut.parametes, e);
					loading = false;
					++loadTimes;
				}, _defalut.timeOut);
			}
		}
		var eventName = _defalut.eventName;
		if (!eventName) {
			eventName = "scroll";
		} else if (eventName.indexOf("scroll.") != 0) {
			eventName = "scroll." + eventName;
		}
		$(window).off(eventName);
		$(window).on(eventName, scrollFun);
	}

	// 停止滚动刷新事件
	site.utils.stopScrollLoad = function(eventName) {
		if (!eventName) {
			eventName = "scroll";
		} else if (eventName.indexOf("scroll.") != 0) {
			eventName = "scroll." + eventName;
		}
		$(window).off(eventName);
	}

	// 根据字符串获取对象的属性 支持"." 例如：obj.func1.func2
	site.utils.getPropertyByName = function(parentObject, name) {
		var _parentObject = parentObject;
		if (!_parentObject || !name) {
			return;
		}
		var arrayNames = name.split('.');
		for (var i = 0; i < arrayNames.length; i++) {
			_parentObject = _parentObject[arrayNames[i]];
			if (!_parentObject) {
				return;
			}
		}
		return _parentObject;
	}

	// 下载文件
	site.utils.downloadFile = function(filename, header, data) {
		var ua = window.navigator.userAgent;
		if (ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident.*rv\:11\./)) {
			// Internet Explorer (<= 9) workaround by Darryl
			// (https://github.com/dawiong/tableExport.jquery.plugin)
			// based on sampopes answer on
			// http://stackoverflow.com/questions/22317951
			// ! Not working for json and pdf format !
			var frame = document.createElement("iframe");
			if (frame) {
				document.body.appendChild(frame);
				frame.setAttribute("style", "display:none");
				frame.contentDocument.open("txt/html", "replace");
				frame.contentDocument.write(data);
				frame.contentDocument.close();
				frame.focus();
				frame.contentDocument.execCommand("SaveAs", true, filename);
				document.body.removeChild(frame);
			}
		} else {
			var DownloadLink = document.createElement('a');
			if (DownloadLink) {
				DownloadLink.style.display = 'none';
				DownloadLink.download = filename;
				if (header.toLowerCase().indexOf("base64,") >= 0)
					DownloadLink.href = header + site.utils.base64encode(data);
				else
					DownloadLink.href = encodeURIComponent(header + data);
				document.body.appendChild(DownloadLink);
				if (document.createEvent) {
					if (DownloadEvt == null)
						DownloadEvt = document.createEvent('MouseEvents');
					DownloadEvt.initEvent('click', true, false);
					DownloadLink.dispatchEvent(DownloadEvt);
				} else if (document.createEventObject)
					DownloadLink.fireEvent('onclick');
				else if (typeof DownloadLink.onclick == 'function')
					DownloadLink.onclick();
				document.body.removeChild(DownloadLink);
			}
		}
	}

	//base64 编码
	site.utils.base64encode = function(input) {
		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = utf8Encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
		}
		return output;
	}
	
	//简单的数据模板替换
    site.utils.format = function (templ, params) {
        if (arguments.length == 1)
            return function () {
                var args = $.makeArray(arguments);
                args.unshift(templ);
                return site.utils.format.apply(this, args);
            };
        if (arguments.length > 2 && params.constructor != Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor != Array) {
            params = [params];
        }
        $.each(params, function (i, n) {
        	templ = templ.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        });
        return templ;
    };
    
    // 验证是否PC端
    site.utils.isPc = function(){
    	var userAgentInfo = navigator.userAgent, 
    		appVersion = navigator.appVersion,
    		language = (navigator.browserLanguage || navigator.language).toLowerCase();
    	//移动终端浏览器版本信息   
    	var versions = {
    			trident: u.indexOf('Trident') > -1, //IE内核  
    			presto: u.indexOf('Presto') > -1, //opera内核  
    			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核  
    			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核  
    			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端  
    			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端  
    			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器  
    			iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器  
    			iPad: u.indexOf('iPad') > -1, //是否iPad    
    			webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部  
        };
    	if(versions.mobile || versions.ios || versions.android || versions.iPhone || versions.iPad){	   
    		return false;
    	}
    	return true
    }
});