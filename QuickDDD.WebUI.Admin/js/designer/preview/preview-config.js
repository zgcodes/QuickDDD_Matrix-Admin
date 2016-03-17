/**
 * 作者：yujinjin9@126.com
 * 时间：2015-10-25
 * 描述：设计器预览信息列表-require配置
 */
$(function(){
	require.config({
	    baseUrl: site.config.contextPath + "/js/designer",
	    urlArgs: "v=" + site.config.version //添加版本号
	});
	//瀑布流导航栏 由于时间有限暂时不在组件里做模块化加载，在这里统一做
});