/**
 * 作者：yujinjin9@126.com
 * 时间：2015-10-25
 * 描述：组件控制器
 */
//define(["widgets/Article", "widgets/Button", "widgets/Call", "widgets/HtmlBlock", "widgets/Image", "widgets/Article", 
//        "widgets/Article", "widgets/Article", "widgets/Article", "widgets/Article", "widgets/Article", "widgets/Article"], 
//        function (Article, Button, Call, HtmlBlock, Image, Links, List, MultiButtons, MultiImages,
//        		NavBar, PageSetting, QQOnline, Scene, Search, ShareButton, Text) {
//	var widgets = {
//		Article: Article,
//		Button: Button,
//		Call: Call,
//		HtmlBlock: HtmlBlock,
//		Image: Image,
//		Links: Links,
//		List: List,
//		MultiButtons: MultiButtons,
//		MultiImages: MultiImages,
//		NavBar: NavBar,
//		PageSetting: PageSetting,
//		QQOnline: QQOnline,
//		Scene: Scene,
//		Search: Search,
//		ShareButton: ShareButton,
//		Text: Text
//	};
//	var widgetControl = {
//		//根据code获取组件对象
//		getWidgetByCode: function(code){
//			if(!code){
//				console.info("code为空");
//				return null;
//			}
//			if(!widgets[code]){
//				console.info("组件对象："+code+"不存在!");
//			}
//			return widgets[code];
//		},
//		
//		//获取组件初始化数据 type:组件的类型 比如：code是MultiButtons的分并排导航、色块导航2种类型
//		getWidgetData: function(code, type){
//			if(!code || !widgets[code]){
//				console.info("组件对象："+code+"不存在!");
//				return null;
//			}
//			if(widgets[code].returnDefaultData && $.isFunction(widgets[code].returnDefaultData)){
//				return widgets[code].returnDefaultData(type);
//			}
//			return widgets[code].defaultData;
//		}
//	}
//	return widgetControl;
//});

define(["widgets/MultiImages", "widgets/MultiButtons", "widgets/NavBar", "widgets/List", "widgets/Image", "widgets/PageSetting"], 
        function (MultiImages, MultiButtons, NavBar, List, Image, PageSetting) {
	var widgets = {
		MultiImages: MultiImages, // 幻灯片
		MultiButtons: MultiButtons, //导航栏
		NavBar: NavBar, //底部导航栏
		List: List, //图文列表
		Image: Image, //图片
		PageSetting: PageSetting //页面设置
	};
	var widgetControl = {
		//根据code获取组件对象
		getWidgetByCode: function(code){
			if(!code){
				console.info("code为空");
				return null;
			}
			if(!widgets[code]){
				console.info("组件对象："+code+"不存在!");
			}
			return widgets[code];
		},
		
		//获取组件初始化数据 type:组件的类型 比如：code是MultiButtons的分并排导航、色块导航2种类型
		getWidgetData: function(code, type){
			if(!code || !widgets[code]){
				console.info("组件对象："+code+"不存在!");
				return null;
			}
			if(widgets[code].returnDefaultData && $.isFunction(widgets[code].returnDefaultData)){
				return widgets[code].returnDefaultData(type);
			}
			return widgets[code].defaultData;
		}
	}
	return widgetControl;
});