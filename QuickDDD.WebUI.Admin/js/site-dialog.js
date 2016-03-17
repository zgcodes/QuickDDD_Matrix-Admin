/************************
 * 描述：页面弹出框，使用PC端使用，依赖于bootstrap.js、bootstrap-modal.js、bootstrap-modalmanager.js、bootstrap-bootbox.js
 * 作者：金鱼
 * 时间：2015-05-06
 ************************/
var site = site || {};
(function(){
	//site.success("内容","callbakfun",{delay:1000});第一个参数是内容，第二个是回调函数（可选），第三个参数是自定义的属性。比如：delay表示延迟毫秒关闭窗口
	site.success = top.site.success || (top.bootbox ? top.bootbox.success : null) || bootbox.success;
	//同上
	site.info = top.site.info || (top.bootbox ? top.bootbox.info : null) || bootbox.info;
	//同上
	site.error = top.site.error || (top.bootbox ? top.bootbox.error : null) || bootbox.error;
	//同上
	site.alert = top.site.alert || (top.bootbox ? top.bootbox.alert : null) || bootbox.alert;
	//同上，但回调函数会传入用户点击的确定(ture)、取消(false)按钮的boolean值参数.callbakfun(isConfirm)
	site.confirm = top.site.confirm || (top.bootbox ? top.bootbox.confirm : null) || bootbox.confirm;
	//同上，但回调函数会传入用户输入的内容参数.callbakfun(content).默认输入框是text内型，
	//如果指定其他表单方式属性值为：inputType：text、textarea、email、select、date、time、number、password、checkbox
	//如果是inputType是select类型需要指定inputOptions属性,现在必须是数组，以后可以改造成json TODO:修改成JSON方式用key、value方式
	//如果是inputType是checkbox类型需要指定inputOptions属性,数据类型是json的数组，必须要有value、text属性.
	//可以指定placeholder(boolean)、pattern、maxlength属性
	site.prompt = top.site.prompt || (top.bootbox ? top.bootbox.prompt : null) || bootbox.prompt;
	//一般用于带有页面的对话框  
	//例如：bootbox.dialog({width: "400px",height: "400px",title: "ceshi",href: "http://www.baidu.com"});
	//例如：bootbox.dialog({width: "400px",height: "400px",title: "ceshi","message": html,});
	//例如：bootbox.dialog({className: "bootbox-confirm",title: "提示", backdrop: true, message: "您确定要上架吗？",buttons:{"ok":{"label":"上架","className":"btn-primary","callback": function(){ alert("ok");}},"no":{"label":"强制上架","className":"","callback": function(){ alert("no");}},"cancel":{"label":"取消","className":"","callback": function(){ alert("cancel");}}}});
	site.dialog = top.site.dialog || (top.bootbox ? top.bootbox.dialog : null) || bootbox.dialog;
	
})();

