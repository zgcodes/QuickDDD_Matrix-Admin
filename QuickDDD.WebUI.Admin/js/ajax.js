/*******************************************************************************
 * 描述：页面无刷新文件上传(HTML5，IE版本太低不支持) 
 * 作者：金鱼 
 * 时间：2015-12-22
 * 参数：
 * 		url： null, // 发送请求的地址
 * 		async: true, //是否异步
 * 		type： "POST", //请求类型
 * 		dataType： "json", //预期服务器返回的数据类型
 * 		data: null, //发送到服务器的数据
 * 		uploadProgress: null, // 上传正在处理进度的函数
 * 		complete: null, //当请求完成之后调用这个函数，无论成功或失败。
 * 		success: null, // 当请求成功回调函数
 *  	error: null, // 当请求失败回调函数
 *   	processFormData: null, // 表单数据处理函数
 ******************************************************************************/
function ajax(options) {
	//创建xhr
	function createXHR() {
		if (typeof XMLHttpRequest != "undefined") { // 非IE6浏览器
			return new XMLHttpRequest();
		} else if (typeof ActiveXObject != "undefined") { // IE6浏览器
			var version = [ "MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp", ];
			for (var i = 0; i < version.length; i++) {
				try {
					return new ActiveXObject(version[i]);
				} catch (e) {
					// 跳过
					log.info(e);
				}
			}
		} else {
			throw new Error("您的系统或浏览器不支持XHR对象！");
		}
	}
	//克隆 
	function clone(obj, deep){
		var o;
		switch(typeof obj){
		case 'undefined': break;
		case 'string'   : o = obj + '';break;
		case 'number'   : o = obj - 0;break;
		case 'boolean'  : o = obj;break;
		case 'object'   :
			if(obj === null){
				o = null;
			}else{
				if(obj instanceof Array){
					o = [];
					for(var i = 0, len = obj.length; i < len; i++){
						if(deep){
							o.push(clone(obj[i]));
						} else {
							o.push(obj[i]);
						}
						
					}
				} else if(obj instanceof Object){
					o = {};
					for(var k in obj){
						if(deep){
							o[k] = clone(obj[k]);
						} else {
							o[k] = obj[k];
						}
					}
				}
			}
			break;
		default:		
			o = obj;break;
		}
		return o;	
	}
	var initOptions = null;
	if(typeof(options)==="string"){
		initOptions = {};
		initOptions.url = options;
	} else if(typeof(options) === "object"){
		initOptions = clone(options, true);
	}
	initOptions.async = !(initOptions.async===false);
	initOptions.type = initOptions.type || "POST";
	initOptions.dataType = initOptions.type || "json";
	var formdata = new FormData();
	//表单数据
	if(initOptions.data){
		for(var key in initOptions.data){
			formdata.append(key, initOptions.data[key]);
		}
	}
	var pecent = 0 , loop = null;
	var xmlRequest = createXHR();
	xmlRequest.onload = function (e) {
		if (xmlRequest.readyState == 4) {
			if(xmlRequest.status == 200){
				var response = e.target.responseText;
				if(initOptions.complete && typeof(initOptions.complete) === "function"){
					initOptions.complete(e.status, xmlRequest, true);
				}
				if(initOptions.success && typeof(initOptions.success) === "function"){
					if(initOptions.dataType == 'json'){
						response = JSON.parse(responseText);
					}
					initOptions.success(response, e.status, xmlRequest);
				}
			} else {
				if(initOptions.complete && typeof(initOptions.complete) === "function"){
					initOptions.complete(e.status, xmlRequest, false);
				}
				if(initOptions.error && typeof(initOptions.error) === "function"){
					initOptions.error(xmlRequest, e.status);
				}
			}
		}
    };
    
    if(initOptions.uploadProgress && $.isFunction(initOptions.uploadProgress)){
    	xmlRequest.upload.addEventListener('progress', function (e) {
            initOptions.uploadProgress(~~(100 * e.loaded / e.total) / 2);
        }, false);
    	if(!initOptions.async){
    		//必须异步，监听事件无效
    		initOptions.async = true;
    	}
    }
    if(initOptions.processFormData && $.isFunction(initOptions.processFormData)){
    	initOptions.processFormData(formdata);
    }
    xmlRequest.open(initOptions.type, initOptions.url, initOptions.async);
    xmlRequest.send(formdata);
}