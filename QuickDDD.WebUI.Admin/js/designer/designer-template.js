/**
 * 作者：yujinjin9@126.com
 * 时间：2015-10-25
 * 描述：设计器模板引擎管理工具类
 */
define(["designerUtils"], function (designerUtils) {
	var tempate = {};
	//初始化
	(function(){
//		juicer.set({
//		    'tag::operationOpen': '{@',
//		    'tag::operationClose': '}',
//		    'tag::interpolateOpen': '^{',
//		    'tag::interpolateClose': '}',
//		    'tag::noneencodeOpen': '^^{',
//		    'tag::noneencodeClose': '}',
//		    'tag::commentOpen': '{#',
//		    'tag::commentClose': '}'
//		});
		
		juicer.register('buttonColumns', function (num) {
	        var r = (100 / num) + '%';
	        return r;
	    });
		juicer.register('half', function (num) {
	        if (num.indexOf('px') > 0) num = num.slice(0, -2);
	        var r = (~~num / 2);
	        return r;
	    });
		juicer.register('half2', function (num) {
	        if (num.indexOf('px') > 0) num = num.slice(0, -2);
	        var r = (~~num / 4);
	        return r;
	    });
		juicer.register('double', function (num) {
	        if (num == null || num == "") return 0;
	        if (num.indexOf('px') > 0) num = num.slice(0, -2);
	        var r = (~~num * 2);
	        return r;
	    });
		juicer.register('padding', function (obj) {
	        var ret = '';
	        if (obj == null || obj == "") return "";
	        var num = parseInt(obj);
	        if (!isNaN(num)) {  //数字
	            ret = num + 'px';
	        }
	        else if (obj.t != null) {  //对象
	            ret = obj.t + 'px ' + obj.r + 'px ' + obj.b + 'px ' + obj.l + 'px'
	        }
	        return ret;
	    });
		juicer.register('background', function (value) {
	        console.log(value);
	        var bg = '';

	    });
		juicer.register('JsonToString', function (value) {
	    	return JSON.stringify(value);
	    });
		juicer.register('backgroundsize', function (value) {
	        var ret = '';
	        switch (value) {
	            case '填充':
	                ret = 'background-size:cover;background-repeat: no-repeat;';
	                break;
	            case '适应':
	                ret = 'background-size:contain;background-repeat: no-repeat;';
	                break;
	            case '拉伸':
	                ret = 'background-size:100% 100%;background-repeat: no-repeat;';
	                break;
	            case '平铺':
	                ret = 'background-size: inherit; background-repeat: repeat;';
	                break;
	            case '横向平铺':
	                ret = 'background-size: inherit; background-repeat: repeat-x;';
	                break;
	            case '竖向平铺':
	                ret = 'background-size: inherit; background-repeat: repeat-y;';
	                break;
	        }
	        return ret;
	    });
		juicer.register('picurl', function (url) {
	        if (url && url.length > 0) {
	        	if($.trim(url).indexOf("http://")==0){
	        		return url;
	        	} else {
	        		return designer.config.resourecePath + url;
	        	}
	        }
	        return designer.config.resourecePath + "/images/no_image.png";
	    });
	    
		juicer.register('imgurl', function (url) {
	    	if (url == null) url = "";
	    	if (url && url.length > 0) {
	    		if($.trim(url).indexOf("http://")==0){
	    			return url;
	    		} else {
	    			return designer.config.resourecePath+url;
	    		}
	    	}
	    	return designer.config.resourecePath + "/images/no_image.png";
	    });
	    
	    //图标
		juicer.register('icon', function (str) {
	        if (str == null) str = "";
	        var html = "";
	        if(str.length === 0 || str.indexOf('fa ') === 0 || str.indexOf("glyphicon ") === 0 || str.indexOf('icon-') === 0){
	        	html = '<i class="' + str + '"></i>';
	        } else {
	        	if($.trim(str).indexOf("http://") == 0){
	        		html = '<img src="' + str + '" />';
	        	} else {
	        		html = '<img src="' + designer.config.resourecePath + str + '" />';
	        	}
	        }
	        return html;
	    });

	    //背景图
		juicer.register('csstext', function (str) {
			return designerUtils.changeBackgrounImage(str);
	    });
	})();
	
	//编译模板并根据所给的数据立即渲染出结果
	tempate.render = function (markup, renderData) {
        return juicer(markup, renderData);;
    },
	
    //根据ID，获取到编译模板的html,并根据所给的数据立即渲染出结果
	tempate.renderById = function (templateId, renderData) {
        var markup = $("#"+templateId).html();
        return tempate.render(markup, renderData);
    }
    
    return tempate;
});