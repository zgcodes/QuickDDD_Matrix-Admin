/**
 * 作者：yujinjin9@126.com
 * 时间：2015-10-25
 * 描述：设计器-require配置
 */
var designer = designer || {};
$(function(){
	designer.config = {};
	designer.config.contextPath = site.config.contextPath; //设计器的项目相对路径
	designer.config.projectPath = site.config.contextPath; //设计器的项目全路径
	designer.config.resourecePath = site.config.resourecePath; //设计器的图片资源全路径
	designer.config.version = site.config.version; //设计器的资源版本
	designer.config.uploadPath = site.config.uploadPath;//上传资源服务接口
	//ajax
	designer.ajax = site.ajax;
	//模板引擎
	designer.success = site.success;
	designer.info = site.info;
	designer.error = site.error;
	designer.alert = site.alert;
	designer.confirm = site.confirm;
	designer.prompt = site.prompt;
	designer.dialog = site.dialog;
	
	require.config({
	    baseUrl: site.config.contextPath + "/js/designer",
	    urlArgs: "v=" + site.config.version,//添加版本号
	    paths: {
	        "designerUtils": "designer-utils",
	        "template": "designer-template",
	        "designerController": "designer-controller",
	        "api": "designer-api",
	        "css": site.config.contextPath + "/scripts/require-css"
	    }
	});

	require(["designerController"], function (designerController) {
		designerController.init();
//		var _fun = function(i, radom, callbackFun){
//			require(["designerController"], function (designerController) {
//				callbackFun(i, radom);
//			});
//			console.info("------------");
//		}
//		for(var i=0;i<6;i++){
//			var a =  Math.random();
//			console.info(a);
//			_fun(i, a, function(c, d){
//				console.info(i, a, c, d);
//			});
//		}
	});
});