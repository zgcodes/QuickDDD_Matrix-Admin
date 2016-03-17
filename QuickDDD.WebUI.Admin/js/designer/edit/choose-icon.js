/**
 * 作者：yujinjin9@126.com
 * 时间：2015-12-01
 * 描述：选择图标
 */
$(function(){
	$("#fonticon span").click(function() {
		var str = $(this).children("i").attr('class');
		site.closeIFrameDialog(str);
	});
	$("#pngicon span").click(function() {
		var str = $(this).children("img").attr('src');
		if(str && site.config.resourecePath && str.indexOf(site.config.resourecePath) === 0){
			str = str.substr(site.config.resourecePath.length);
		}
		site.closeIFrameDialog(str);
	});
	site.BDWebUpload.imageService({
		"pickId": "#img_upload",
		"uploadSuccessCallback": function(file, data){
			// 保存成功返回方法
			if(data.success === true){
				site.closeIFrameDialog(data.result[0].imageUrl);
			}
		},
		"uploadErrorCallback": function(){
			//保存失败返回方法
			console.info("uploadErrorCallback");
		}
	});
});