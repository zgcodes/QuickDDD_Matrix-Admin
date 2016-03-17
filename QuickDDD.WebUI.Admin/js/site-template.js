/**
 * 作者：yujinjin9@126.com 
 * 时间：2015-09-28 
 * 描述：站点模板管理工具类
 */
var site = site || {};
$(function () {
	site.tempate = {};
	//初始化
	site.tempate.init = function(){
		juicer.set({
		    'tag::operationOpen': '{$',
		    'tag::operationClose': '}',
		    'tag::interpolateOpen': '^{',
		    'tag::interpolateClose': '}',
		    'tag::noneencodeOpen': '^^{',
		    'tag::noneencodeClose': '}',
		    'tag::commentOpen': '{#',
		    'tag::commentClose': '}'
		});
	}
	
	//编译模板并根据所给的数据立即渲染出结果
	site.tempate.render = function (markup, renderData) {
        return juicer(markup, renderData);;
    },
	
    //根据ID，获取到编译模板的html,并根据所给的数据立即渲染出结果
	site.tempate.renderById = function (templateId, renderData) {
        var markup = $("#"+templateId).html();
        return site.tempate.render(markup, renderData);
    }
	
    site.tempate.init();
});