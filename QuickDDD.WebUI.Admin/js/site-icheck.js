/**
 * 作者：yujinjin9@126.com 
 * 时间：2015-09-28 
 * 依赖：jquery
 * 描述：初始化页面中的复选框、单选框样式
 */
$(function(){
	(function(){
		//增加复选框icheck样式
    	$("input[type=checkbox][data-icheck-class]").each(function(i, el){
    		$(el).iCheck({
    		    checkboxClass: $(el).attr("data-icheck-class"),
    		    increaseArea: '20%'
    		});
    	});
    	//增加复选框icheck样式
    	$("input[type=radio][data-icheck-class]").each(function(i, el){
    		$(el).iCheck({
    			radioClass: $(el).attr("data-icheck-class"),
    		    increaseArea: '20%'
    		});
    	});
	})();
});