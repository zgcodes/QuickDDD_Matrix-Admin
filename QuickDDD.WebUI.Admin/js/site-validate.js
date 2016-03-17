/**
 * 作者：yujinjin9@126.com 
 * 时间：2015-09-28
 * 依赖：jquery site-form 
 * 描述：站点页面表单验证框架工具类
 */
var site = site || {};
$(function() {
	site.validate = {};
	
	// 初始化
	site.validate.init = function(){
		$.extend($.validator.messages,site.validate.message);
	}
	
	//验证元素样式操作
	site.validate.elementStyle = {
		//元素错误样式
		error: function(element, message){
			this.change(element, {"formClass":"has-error", "fontStyle":"glyphicon-remove", "message":message});
		},
		
		//元素成功样式
		success: function(element, message){
			this.change(element, {"formClass":"has-success", "fontStyle":"glyphicon-ok", "message":message});
		},
		
		//元素警告样式
		warning: function(element, message){
			this.change(element, {"formClass":"has-warning", "fontStyle":"glyphicon-warning-sign", "message":message});
		},
		
		//改变表单的样式
		change: function(element, data){
			var item = $(element);
			if(item.closest(".form-group").length > 0){
				var _form_group = item.closest(".form-group");
				if(!_form_group.hasClass(data.formClass) && item.attr('type') !== 'hidden' && item.attr('data-flag') !== "false"){
					//如果是隐藏域或者表单注明不需要加入提示标志
					_form_group.addClass(data.formClass + ' has-feedback');
	    			item.after('<span class="glyphicon '+ data.fontStyle +' form-control-feedback" aria-hidden="true"></span>');
				}
			}
			if(item.attr('type') !== 'hidden'){
				item.attr("title", data.message);
	            item.tooltip({container: 'body', placement: 'top', animation: false });
			} else if(item.closest("[data-tooltip='true']").length > 0){
				//如果隐藏域的表单有父标签特别注明需要引入提示插件就去在提示显示提示插件的地方显示
				item = item.closest("[data-tooltip='true']");
				item.attr("title", data.message);
	            item.tooltip({ container: 'body', placement: 'top', animation: false });
			}
		},
		
		//执行方法
		execute: function(type, element, message){
			if(type === "success"){
				site.validate.elementStyle.success(element, message);
			} else if(type === "error"){
				site.validate.elementStyle.error(element, message);
			} else if(type === "warning"){
				site.validate.elementStyle.warning(element, message);
			} else if(type === "destroy"){
				site.validate.elementStyle.destroy(element);
			}
		},
		
		//删除元素提示信息样式
		destroy: function(element){
			var item = $(element);
			var _tip_class = null;
        	if(item.closest(".form-group").hasClass("has-error")){
        		_tip_class = "has-error";
        	} else if(item.closest(".form-group").hasClass("has-warning")){
        		_tip_class = "has-warning";
        	} else if(item.closest(".form-group").hasClass("has-success")){
        		_tip_class = "has-success";
        	}
        	if(_tip_class){
        		//树形下拉控件单独处理
        		if (item.prop('class') != null && item.prop('class').indexOf('combo-text') >= 0) item = item.closest(".input-group");
        		item.closest(".form-group").removeClass(_tip_class + ' has-feedback');
        		item.next(".form-control-feedback").remove();
        		item.removeAttr("title");
        		item.tooltip('destroy');
        	}
		}
	}
	
	//默认验证消息
	site.validate.message = {
		required : "此项是必须填写的",
		remote : "请修正该字段",
		email : "请输入正确格式的电子邮件",
		url : "请输入合法的网址",
		date : "请输入合法的日期",
		dateISO : "请输入合法的日期 (ISO).",
		number : "请输入合法的数字",
		digits : "只能输入整数",
		creditcard : "请输入合法的信用卡号",
		equalTo : "请再次输入相同的值",
		accept : "请输入拥有合法后缀名的字符串",
		extension: "请输入有效的后缀",
		maxlength : jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),
		minlength : jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
		rangelength : jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
		range : jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
		max : jQuery.validator.format("请输入一个最大为{0} 的值"),
		min : jQuery.validator.format("请输入一个最小为{0} 的值"),
		zip: "请输入有效的中国邮政编码"
	}
	
	//添加自定义方法
	site.validate.addMethod = function(method, callbackFun){
		$.validator.addMethod(method, callbackFun);
	}

	//添加系统常用方法
	site.validate.addCommonMethod = function(){
		// 邮政编码验证   
		jQuery.validator.addMethod("isZipCode", function(value, element) {   
		    var tel = /^[0-9]{6}$/;
		    return this.optional(element) || (tel.test(value));
		}, "请正确填写您的邮政编码");
	}
	
	// form表单验证,验证通过后直接提交表单数据  selector:选择器   ajaxFormOptions:ajax form表单提交的选项  jquery validate表单的选项
	site.validate.form = function(selector, ajaxFormOptions, validateOptions) {
		var _default_validate_options = {
			ignore: "",
            rules: {},
            messages: {},
            showErrors: function (errorMap, errorList) {
            	if (errorList && errorList.length > 0) {
            		//切换到当前tab页
            		try {
            			var el = $(this.findLastActive() || this.errorList.length && this.errorList[0].element || []);
            			$(".nav-tabs").find('a[href="#' + el.closest('.tab-pane[id]').attr('id') + '"]').tab('show');
            		} catch (e) { 
            			console.log("验证出错了:" + e); 
            		}
            	}
            	this.defaultShowErrors();
            },
            submitHandler: function (form) {
                try{
                	var _defalut_ajax_options = {};
                    if (typeof _default_validate_options.beforeSubmit === "function") {
                        var funResult = validOpt.beforeSubmit(setting);
                        if (!funResult) {
                            console.info("不提交了");
                            return;
                        }
                        if (typeof funResult === "object") {
                            $.extend(true, _defalut_ajax_options, funResult);
                        }
                    }
                    $.extend(true, _defalut_ajax_options, ajaxFormOptions);
                    site.form.ajax(selector, _defalut_ajax_options);
                    return false;
                } catch (e) {
                    console.error("自定义函数异常，不提交了",e);
                    return;
                }
            },
            errorPlacement: function (label, element) {
            	var _message = $(label).text();
            	if(!_message){
            		return;
            	}
            	var type = $(element).attr("data-validate-type");
            	if(!type){
            		type = "error";
            	}
            	site.validate.elementStyle.execute(type, element, $(label).text());
            },
            success: function(label, element) {
            	site.validate.elementStyle.execute("destroy", element);
            	if(_default_validate_options.successStyle === true || $(element).attr("data-validate-succes") === "true"){
            		site.validate.elementStyle.execute("success", element, $(label).text());
            	}
            	return;
			}
	    };
		$.extend(true, _default_validate_options, validateOptions);
		console.info(_default_validate_options);
		return $(selector).validate(_default_validate_options);
	}
	
	site.validate.init();
});