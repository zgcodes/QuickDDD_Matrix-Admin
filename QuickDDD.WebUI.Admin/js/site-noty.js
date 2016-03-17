/**
 * 作者：yujinjin9@126.com 
 * 时间：2015-11-04 
 * 描述：提示信息noty插件
 */
var site = site || {};
$(function() {
	var defaultOptions = {
		layout: 'top', //消息显示的位置
        theme: 'defaultTheme', // 默认主题
        type: 'alert', //消息的类型
        text: '', //消息的内容
        dismissQueue: true, // 是否添加到队列
        template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>', // 消息默认模板
        animation: { // 默认的显示及关闭动画
            open: {height:'toggle'},
            close: {height:'toggle'},
            easing: 'swing',
            speed: 500
        },
        timeout: false, // 自动关闭时间，默认不会自动关闭
        force: false, // 添加到队列开始处
        modal: false, // 是否显示遮罩层
        maxVisible: 10, // 一个队列的消息最大可见数量，即一个队列中同一时间最多显示的数量
		killer: false, // 显示时移除其他正在显示的noty插件
        closeWith:['click'], // ['button', 'click', 'hover'],关闭的事件，默认点击消息关闭
        callback:{ // 回调函数
            onShow: function () {
            	// 显示之前
            },
            afterShow: function () {
            	// 显示之后
            },
            onClose: function () {
            	//关闭之前
            },
            afterClose: function () {
            	//关闭之后
            },
            onCloseClick: function () {
            	//点击关闭按钮
            }
        },
        buttons:false
        /** buttons: [{
	    	addClass: 'btn btn-primary', 
	    	text: 'Ok', 
	    	onClick: function ($noty) {
               $noty.close();
               noty({dismissQueue: true, force: true, layout: layout, theme: 'defaultTheme', text: 'You clicked "Ok" button', type: 'success'});
           }
        },{
        	addClass: 'btn btn-danger', 
        	text: 'Cancel', 
        	onClick: function ($noty) {
        		$noty.close();
        		noty({dismissQueue: true, force: true, layout: layout, theme: 'defaultTheme', text: 'You clicked "Cancel" button', type: 'error'});
        	}
       }] **/
    };
	$.noty.defaults = defaultOptions;
});