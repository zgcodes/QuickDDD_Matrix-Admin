/* author：mien 614573519@qq.com*/
define(function () {
	var validation = {};
	
	validation.Errors = {};

	// 各字段共用的规则
	validation.regs = {
//		url : "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?" // ftp的user@
//				+ "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
//				+ "|" // 允许IP和DOMAIN（域名）
//				+ "([0-9a-zA-Z_!~*'()-]+\.)*" // 域名- www.
//				+ "([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z]\." // 二级域名
//				+ "[a-zA-Z]{2,6})" // first level domain- .com or .museum
//				+ "(:[0-9]{1,4})?" // 端口- :80
//				+ "((/?)|" + "(/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+/?)$",
		url : "((http|ftp|https)://)?[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&amp;:/~+#-]*[\\w@?^=%&amp;/~+#-])?",
//		phone : /^\d{3,4}[\-]?\d{2,11}$/,
//		phone : /^(1[3,5,8,7]{1}[\d]{9})$|^(((400)[\-]?(\d{3})[\-]?(\d{4}))|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{3,7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/,
		phone : /^[\d+][\d,-;.\/]{1,21}$/, // +号或数字开头，不超过22位，只允许数字+号和,号
		ip : /^[1-9]{1}\d{0,2}\.\d{1,3}.\d{1,3}.\d{1,3}$/,
		domain : /^[a-z]+[a-z\.\-\_0-9]+\.qq\.com$/,
		email : /^([a-zA-Z0-9]+[a-zA-Z0-9\_\-\.])+@([a-zA-Z0-9\_\-])+(.[a-zA-Z0-9\_\-])+/,
		wbid : /^[a-zA-Z]{1}[a-zA-Z0-9\_\-]{5,19}$/,
		sms : /^[1-9]{1}[0-9]{10}$/,
		qq : /^[1-9][0-9]{4,13}$/,
		siteName : /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
		pageName : /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
		date : /^(\d{4})\-(\d{2})\-(\d{2})$/,
		dateTime : /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
		radius : /^[1-9][0-9]{0,2}$/
	};
	
	// 判断是否为URL, isNullable - 是否可空， reg - 正则表达式
	validation.isUrl = function(input, isNullable, reg){
		var result,
	    input = input || '';
		isNullable = isNullable || false;
		reg = reg || new RegExp(validation.regs['url']);
		
		$.trim(input);
		
		if(isNullable && input.length == 0){
			result = true;
		}
		else{
			result = reg.test(input);
			if(input.indexOf('.') < 0 )
			{
				result = false;
			}
		}
		
		return result;
	};
	
	validation.auth = function(){
		
	};
	
	validation.getAuthResult = function(input, options){
		var result = true;
		
		var authType = options.authType;
		var authAttr = options.authAttr;
		var $element = $(options.element);
		
		var rule;
		
		try
		{
			rule = $.parseJSON(authAttr);
		}
		catch(err)
		{
			rule = null;
		}
		
		
		switch (authType) {
			// 校验文本长度方式
			case 'text':
				var len = input.length; // 不区分中英文，TODO注意历史数据问题
				var trimLength =  input.trim().length;
				if (trimLength < rule[0] || len > rule[1]) {
					result = false;
				}
				break;
			case 'richText':
				// Fix firefox 
				try
				{
					if($(input).length > 0){ 
						input = $(input).text(); // Remove HTML tags
					}
				}
				catch(err)
				{
					input = "";
				}
				
				var len = input.length; // 不区分中英文，TODO注意历史数据问题
				var trimLength =  input.trim().length;
				if (trimLength < rule[0] || len > rule[1]) {
					result = false;
				}
				break;
			// 校验数字大小方式
			case 'number':					
				var r = /^\+?[1-9][0-9]*$/;
				
				if (!r.test(input) || input < rule[0] || input > rule[1]) {
					result = false;
				}
				break;
			// 正则检验方式
			case 'reg':
				var reg = new RegExp(validation.regs[authAttr]);
				if (!reg.test(input)) {
					result = false;
				}
				
				if(authAttr === 'url'){
					result =  validation.isUrl(input, false);
				}
				else if(authAttr === 'nullableUrl'){
					result =  validation.isUrl(input, true);
				}
				
				break;
			// 自定义回调方式
			case 'callback':
				if(typeof authAttr === 'function'){
					result = authAttr(input, options);
				}
				break;
		}
		
		return result;
	};
	
	
	// Record auth errors
	// index is used for inputs with the same name
	// DOM should not change to maintain the index
	validation.recordErrors = function(result, id, item, tips, index){
		if(item && index >= 0){
			item = item + "--" + index;
		}
		if(result){
			if (validation.Errors[id] && validation.Errors[id][item]){
				delete validation.Errors[id][item];
				if ($.isEmptyObject(validation.Errors[id])){
					delete validation.Errors[id];
				}
			}
		}
		else{
			validation.Errors[id] = validation.Errors[id] || {};
			validation.Errors[id][item] = tips;
		}
	};
	
	validation.authElement = function(element, options){
		var result;
		var $element = $(element);
		
		var options = $.extend({}, options);
		options.authType = options.authType || $element.attr("authType");
		options.authAttr = options.authAttr || $element.attr("authAttr");
		options.errorTarget = options.errorTarget || $element;
		options.element = element;
		
		result = validation.getAuthResult($element.val(), options);
				
		// 新组建不标红
		if(options.isShowError){				
			if (result) {
				$(options.errorTarget).removeClass('error'); // 去除错误提示
			} else {
				setTimeout(function() {//同步会被重写，凭啥？
					$(options.errorTarget).addClass('error');
				}, 0);
			}
		}
		if(options.isRecordError){
			validation.recordErrors(result, options.id, options.item, options.tips, options.index);  
		}
	};
	
	return validation;
});
