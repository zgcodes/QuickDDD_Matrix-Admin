/**
 * 作者：yujinjin9@126.com 
 * 时间：2015-11-04 
 * 描述：百度文件上传
 */
var site = site || {};
$(function() {
	//百度上传对象
	site.BDWebUpload = {};
	//百度单图jcrop上传插件
	site.BDWebUpload.jcrop = {};
	
	//裁剪初始化 imgSrc/thumbWidth/thumbHeight/allowResize/width/height
	site.BDWebUpload.jcrop.init = function(options){
		var _dialog = site.BDWebUpload.jcrop.newWindow(options),
			_$saveButton = _dialog.find("button[data-bb-handler='save']"),
			preview_image_size = {}, 
			img_panel_size = {w: _dialog.find("img.preview-image").width(), h: _dialog.find("img.preview-image").height()},
			ratioW = options.width/_dialog.find("img.preview-image").prop('width'), 
			ratioH = options.height/_dialog.find("img.preview-image").prop('height');
		preview_image_size.w = _dialog.find("div.cut-preview-panel").width();
		preview_image_size.h = _dialog.find("div.cut-preview-panel").height();
		_dialog.find("img.preview-image").Jcrop({
			allowResize: options.allowResize,
			allowSelect: options.allowResize,
			maxSize: options.maxSize,
			minSize: options.minSize,
            onChange: function(coordinate){
            	site.BDWebUpload.jcrop.changePreview(_dialog.find("div.cut-preview-panel > img"), coordinate, img_panel_size, preview_image_size);
            },
            onSelect: function(coordinate){
            	site.BDWebUpload.jcrop.changePreview(_dialog.find("div.cut-preview-panel > img"), coordinate, img_panel_size, preview_image_size);
            }
        }, function(){
        	var _this = this;
        	if(!options.selectWidth){
        		options.selectWidth = img_panel_size.w/2;
        	}
        	if(!options.selectHeight){
        		options.selectHeight = img_panel_size.h/2;
        	}
        	_this.animateTo([0, 0, options.selectWidth, options.selectHeight]);
        	_$saveButton.on("click", function(events){
        		var _is_cut = true;
        		if(_dialog.find("input[name='isCut']").length > 0){
        			_is_cut = _dialog.find("input[name='isCut']").prop("checked");
        		}
    			site.BDWebUpload.jcrop.save(_this, _is_cut, ratioW, ratioH, options.saveCallbacFun);
    		});
        	if(_dialog.find("input[name='isCut']").length > 0){
        		var cutRadioElement = _dialog.find("input[name='isCut']");
        		setTimeout(function(){
            		var tellSelect = _this.tellSelect();
            		cutRadioElement.data("x", 0);
        			cutRadioElement.data("y", 0);
        			cutRadioElement.data("x2", tellSelect.x2);
        			cutRadioElement.data("y2", tellSelect.y2);
        		}, 500);
        		_dialog.find("input[name='isCut']").on("click", function(events){
        			site.BDWebUpload.jcrop.cutEvent(_this, $(this));
        		});
        	}
        });
	}
	
	//裁剪新窗口打开
	site.BDWebUpload.jcrop.newWindow = function(options){
		var _s = site.BDWebUpload.getImgSize(200, 200, options.thumbWidth, options.thumbHeight);
        var html = ['<div class="mb10">',
                    (options.allowResize?'	<label><input type="checkbox" name="isCut" checked="checked" class="ace"><span class="lbl padding-2 red">使用裁剪（动态gif图片时建议勾选）</span></label>':''),
    				'</div>',
    				'<img class="preview-image" src="' + options.imgSrc + '" >',
    				'<div class="cut-preview-panel" style="width:' + _s.width + 'px; height: ' + _s.height + 'px">',
    				'	<img src="' + options.imgSrc + '">',
        			'</div>'].join("\n");
        return site.dialog({
            width: "1100px",
            height: "700px",
            title: "图片裁剪",
            message: html,
            animate: false,
            buttons: {
                save: {
                    label: "上传",
                    className: "btn-primary"
                },
                cancel: {
                    label: "取消",
                    className: "btn-default"
                }
            }
        });
	}
	//剪切复选框事件绑定
	site.BDWebUpload.jcrop.cutEvent = function(jcrop_api, cutRadioElement){
		if($(cutRadioElement).prop("checked")){
			jcrop_api.enable();
			var data = $(cutRadioElement).data();
			jcrop_api.animateTo(data.x, data.y, data.x2, data.y2);
		} else {
			var tellSelect = jcrop_api.tellSelect();
			cutRadioElement.data("x", tellSelect.x);
			cutRadioElement.data("y", tellSelect.y);
			cutRadioElement.data("x2", tellSelect.x2);
			cutRadioElement.data("y2", tellSelect.y2);
			jcrop_api.release();
			jcrop_api.disable();
		}
	}
	//裁剪保存
	site.BDWebUpload.jcrop.save = function(jcrop_api, _is_cut, ratioW, ratioH, saveCallbacFun){
		//保存上传
		if($.isFunction(saveCallbacFun)){
			saveCallbacFun({
				isCut: _is_cut,
				imageX: Math.round(jcrop_api.tellSelect().x * ratioW),
                imageY: Math.round(jcrop_api.tellSelect().y * ratioH),
                imageW: Math.round(jcrop_api.tellSelect().w * ratioW),
                imageH: Math.round(jcrop_api.tellSelect().h * ratioH)
			});
		}
	}
	
	site.BDWebUpload.jcrop.changePreview = function(previewImgSelector, coordinate, img_panel_size, preview_image_size){
		//previewImgSelector
		if(parseInt(coordinate.w) > 0) {
        	previewImgSelector.css({
                width: Math.round(img_panel_size.w * preview_image_size.w / coordinate.w) + 'px',
                height: Math.round(img_panel_size.h * preview_image_size.h / coordinate.h) + 'px',
                marginLeft: '-' + Math.round(preview_image_size.w * coordinate.x / coordinate.w) + 'px',
                marginTop: '-' + Math.round(preview_image_size.h * coordinate.y / coordinate.h) + 'px'
            });
        }
	}
	
	//裁剪之后的图片尺寸
	site.BDWebUpload.getImgSize = function(maxWidth, maxHeight, imageOriginalWidth, imageOriginalHeight){
		var w = 0, h = 0;
        if (imageOriginalWidth < maxWidth && imageOriginalHeight < maxHeight) {
            w = imageOriginalWidth;
            h = imageOriginalHeight;
        } else if ((imageOriginalWidth / imageOriginalHeight) > (maxWidth / maxHeight)) {
            w = maxWidth;
            h = (w * imageOriginalHeight) / imageOriginalWidth;
        } else {
            h = maxHeight;
            w = (h * imageOriginalWidth) / imageOriginalHeight;
        }
        return { width: w, height: h };
	}
	
	site.BDWebUpload.validateImageSize = function(imageFactSize, imageRequireSize, imageMinSize, imageMaxSize, isCut){
		if(isCut){
			if((imageRequireSize.width && imageFactSize.width < imageRequireSize.width) || (imageRequireSize.height && imageFactSize.height < imageRequireSize.height)){
				return "图片尺寸太小!";
			}
			if((imageMinSize.width && imageFactSize.width < imageMinSize.width) || (imageMinSize.height && imageFactSize.height < imageMinSize.height)){
				return "图片尺寸太小!";
			}
		} else {
			if((imageMaxSize.width && imageMaxSize.width < imageFactSize.width) || (imageMaxSize.height && imageMaxSize.height < imageMaxSize.height)){
            	return '上传图片的尺寸太大。';
            }
            if((imageRequireSize.width && imageRequireSize.width > imageFactSize.width) || (imageRequireSize.height && imageRequireSize.height > imageFactSize.height)){
            	return '上传图片的尺寸太小。';
            }
            if((imageRequireSize.height && imageRequireSize.height != imageFactSize.height) || (imageRequireSize.width && imageRequireSize.width != imageFactSize.width)){
            	return ('上传图片的尺寸不正确，应该是：'+imageRequireSize.width+'*'+imageRequireSize.height);
            }
		}
		return null;
	}
	
	//百度单图上传文件 会去处理样式
	//imgSrc/thumbWidth/thumbHeight/allowResize/width/height/maxWidth/maxHeight/minWidth/minHeight
	site.BDWebUpload.imageService = function(opts){
		if (!opts) {
            opts = {};
        }
		var _opts = site.BDWebUpload.imageInitService(opts),
        	webUploader = site.BDWebUpload.image(_opts);
		webUploader.imageOptions = _opts;
        // 当有文件添加进来的时候
        webUploader.on("fileQueued", function (file) {
        	// 创建缩略图
        	webUploader.makeThumb(file, function (error, src) {
                if (error) {
                	site.alert('上传图片失败，浏览器版本太低。');
                    return;
                }
                _opts = webUploader.imageOptions;
                var $filePreviewArea = webUploader.imageOptions.$filePreviewArea,
            	$hidenInput = webUploader.imageOptions.$hidenInput,
            	resizePreviewImg = webUploader.imageOptions.resizePreviewImg;
                var imageFactSize = { width: file._info.width, height: file._info.height},
                	imageRequireSize  = {width: _opts.width, height: _opts.height},
                	imageMinSize = {width: _opts.minWidth, height: _opts.minHeight},
                	imageMaxSize = {width: _opts.maxWidth, height: _opts.maxHeight};
                var errorMsg = site.BDWebUpload.validateImageSize(imageFactSize, imageRequireSize, imageMinSize, imageMaxSize, _opts.isCut !== false);
                if(errorMsg){
                	site.error(errorMsg);
                	return;
                }
                $filePreviewArea.find('img').attr('src', src);
                resizePreviewImg(file._info.width, file._info.height);
                if(_opts.isCut === false){
                	webUploader.upload(file);
                	return;
                }
                var callbackFun = function(data){
                	webUploader.options.formData = $.extend({}, webUploader.options.formData, {width: _opts.width, height: _opts.height}, data);
                	webUploader.upload(file);
                }
                if (webUploader.options.compress) {   //启用客户端压缩
                	imageFactSize = site.BDWebUpload.getImgSize(webUploader.options.compress.width, webUploader.options.compress.height, file._info.width, file._info.height);
                }
                site.BDWebUpload.jcrop.init({
                	allowResize: (_opts.width || _opts.height)?false:true,
                	imgSrc: src,
                	thumbWidth: _opts.thumbWidth,
                	thumbHeight: _opts.thumbHeight,
                	saveCallbacFun: callbackFun,
                	width: imageFactSize.width,
                	height: imageFactSize.height,
                	selectWidth: _opts.width,
                	selectHeight: _opts.height,
                	maxSize: [_opts.width || _opts.maxWidth || 0, _opts.height || _opts.maxHeight || 0],
                	minSize: [_opts.width || _opts.minWidth || 0, _opts.height || _opts.minHeight || 0]
                });
            });
        });
        
        // 文件上传过程中创建进度条实时显示。
        webUploader.on("uploadProgress", function (file, percentage) {
        	_opts = webUploader.imageOptions;
            var $filePreviewArea = webUploader.imageOptions.$filePreviewArea;
        	$filePreviewArea.removeClass('hide');
            var $percent = $filePreviewArea.find('.progress span');
            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<p class="progress"><span></span></p>').appendTo($filePreviewArea).find('span');
            }
            $percent.css('width', percentage * 100 + '%');
        });
        
        // 文件上传成功
        webUploader.on("uploadSuccess", function (file, data) {
            if (data.success && data.result.length > 0) {
            	_opts = webUploader.imageOptions;
            	var thumbImgUrl = data.result[0].thumbImgUrl;
            	if(thumbImgUrl.indexOf("http://") != 0){
            		thumbImgUrl = site.config.resourecePath + thumbImgUrl;
            	}
            	var $filePreviewArea = webUploader.imageOptions.$filePreviewArea,
            	$hidenInput = webUploader.imageOptions.$hidenInput,
            	resizePreviewImg = webUploader.imageOptions.resizePreviewImg;
            	$filePreviewArea.removeClass('hide').find('img').attr('src', thumbImgUrl);
            	resizePreviewImg(webUploader.options.formData.ImageW, webUploader.options.formData.ImageH);
            	$hidenInput.val(data.result[0].imgUrl);
            	if (_opts.uploadSuccessCallback && $.isFunction(opts.uploadSuccessCallback)) {
            		_opts.uploadSuccessCallback(file, data);
                }
            } else {
            	site.error(data.error || "图片上传失败！");
            }
        });

        // 文件上传失败，显示上传出错。
        webUploader.on("uploadError", function (file) {
        	_opts = webUploader.imageOptions;
        	var $filePreviewArea = webUploader.imageOptions.$filePreviewArea;
            var $error = $filePreviewArea.find('div.error');
            // 避免重复创建
            if (!$error.length) {
                $error = $('<div class="error"></div>').appendTo($filePreviewArea);
            }
            $error.text('上传失败');
            if (_opts.uploadErrorCallback && $.isFunction(opts.uploadErrorCallback)) {
            	_opts.uploadErrorCallback(file, data);
            }
        });

        // 完成上传，成功或者失败，删除进度条，重置队列，以便让已选取过的文件可以再重新选。
        webUploader.on("uploadComplete", function (file) {
        	_opts = webUploader.imageOptions;
        	var $filePreviewArea = webUploader.imageOptions.$filePreviewArea;
            $filePreviewArea.find('.progress').remove();
            webUploader.reset();
        });
        return webUploader;
	}
	
	//初始化图片事务方法
	site.BDWebUpload.imageInitService = function(opts){
		var _opts = $.extend({}, opts);
		_opts.thumbWidth = _opts.thumbWidth || 160;
		_opts.thumbHeight = _opts.thumbHeight || 120;
		_opts.$filePreviewArea = $(_opts.filePreviewArea || "#img-preview");
		_opts.$hidenInput = _opts.$filePreviewArea.find("input[type=hidden]");
		_opts.resizePreviewImg = function(imageOriginalWidth, imageOriginalHeight){
			var _s = site.BDWebUpload.getImgSize(_opts.thumbWidth, _opts.thumbHeight, imageOriginalWidth, imageOriginalHeight);
			_opts.$filePreviewArea.find('img').css({"width":_s.width + "px","height":_s.height + "px"});
		}
		//生成页面模板
        var generateImgTemplage = ['<div class="s1" style="width:'+ _opts.thumbWidth +'px; height:'+_opts.thumbHeight+'px;position:relative;">',
            '   <img>',
            '   <div class="upload-delete-btn" title="删除"></div>',
            '</div>'].join("\n");
        _opts.$filePreviewArea.html(generateImgTemplage);
        if(!_opts.thumbImgUrl){
        	_opts.thumbImgUrl = _opts.$hidenInput.val();
        }
        if (typeof (_opts.thumbImgUrl) == 'string' && $.trim(_opts.thumbImgUrl) != '') {
        	_opts.$filePreviewArea.removeClass('hide').find('img').attr('src', _opts.thumbImgUrl.indexOf("http://") > 0 ? _opts.thumbImgUrl : site.config.resourecePath + _opts.thumbImgUrl);
        	var $previewImg =  _opts.$filePreviewArea.find('img');
        	_opts.resizePreviewImg(_opts.thumbWidth, _opts.thumbHeight, $previewImg.prop("width"), $previewImg.prop("height"))
        }
        _opts.$filePreviewArea.find('.upload-delete-btn').click(function () {
        	_opts.$filePreviewArea.addClass('hide').find('img').attr('src', '');
        	_opts.$hidenInput.val("");
            if (_opts.deleteCallback && $.isFunction(_opts.deleteCallback)) {  //删除图片时回调
                try {
                	_opts.deleteCallback();
                } catch (e) {
                    if (console) console.info("删除回掉方法出错:", e.message);
                }
            }
        });
        return _opts;
	}
	
	//百度单图上传文件
	site.BDWebUpload.image = function(opts){
		if (!opts) {
            opts = {};
        }
		var _defalut = {
			// 选完文件后，是否自动上传。
            auto: false,
			 // 文件接收服务端。
            server: (opts.server ? opts.server : (site.config.uploadPath)),
            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: true,
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: {
                id: (opts.pickId ? opts.pickId : "#img-upload-button"),
                multiple: false
            },
            formData: {
                imageThumbW: opts.thumbWidth ? opts.thumbWidth : 160,
                imageThumbH: opts.thumbHeight ? opts.thumbHeight : 120,
                fileType: "image"
            },
            // 只允许选择图片文件。
            accept: {
                title: 'images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },
            thumb: {
                width: 800,
                height: 600,
                // 图片质量，只有type为`image/jpeg`的时候才有效。
                quality: 100,
                // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                allowMagnify: false,
                // 是否允许裁剪。
                crop: false,
                // 为空的话则保留原有图片格式。
                // 否则强制转换成指定的类型。
                type: 'image/jpeg'
            },
            compress: {
                width: 1920,
                height: 1920,
                // 图片质量，只有type为`image/jpeg`的时候才有效。
                quality: 95,
                // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                allowMagnify: false,
                // 是否允许裁剪。
                crop: false,
                // 是否保留头部meta信息。
                preserveHeaders: true,
                // 如果发现压缩后文件大小比原来还大，则使用原来图片
                // 此属性可能会影响图片自动纠正功能
                noCompressIfLarger: true,
                // 单位字节，如果图片大小小于100K，不会采用压缩。
                compressSize: 100 * 1024
            }
        }
		return site.BDWebUpload.upload(_defalut);
	}
	
	//百度多图上传文件,主要是会处理业务上的功能
	site.BDWebUpload.multipleImageService = function(opts){
		// 多图上传业务处理初始化
		opts = site.BDWebUpload.multipleImageInitService(opts);
		var webUploader = site.BDWebUpload.multipleImage(opts);
		site.BDWebUpload.multipleImageEventsBind(opts, webUploader);
		webUploader.on("fileDequeued", function (file) {
            console.info("event:fileDequeued");
            var _img_container = $("div[data-id='" + file.id + "']");
            _img_container.remove();
            var id = file.id;
            var imgFile = null;
            for (var i = 0; i < imgFiles.length; i++) {
                if (id === imgFiles[i].id) {
                    imgFile = imgFiles[i];
                    imgFiles.splice(i, 1);
                    break;
                }
            }
            if (opts.changeFile && $.isFunction(opts.changeFile)) {
                opts.changeFile(imgFile, "delete", imgFiles);
            }
        });

        // 当有文件添加进来的时候
		webUploader.on("fileQueued", function(file) {
            console.info("event:fileQueued");
            file.isNew = true;
            var _img_container = $(opts.generateImgTemplage(file));
            opts.$filePreviewArea.append(_img_container);
            var $img = _img_container.find("img");
            // 创建缩略图
            webUploader.makeThumb(file, function (error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }
                $img.attr('src', src);
                if (opts.fileQueued && $.isFunction(opts.fileQueued)) {
                    file.src = src;
                    opts.fileQueued(file);
                }
            });
        });

        // 文件上传过程中创建进度条实时显示。
		webUploader.on("uploadProgress", function (file, percentage) {
            console.info("event:uploadProgress");
            var $li = $('div[data-id="' + file.id + '"]'),
                $percent = $li.find('.progress .progress-bar');
            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<div class="progress progress-striped active">' +
                  '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                  '</div>' +
                '</div>').appendTo($li).find('.progress-bar');
            }
            $li.find('div.info').text('上传中...');
            $percent.css('width', percentage * 100 + '%');
            if (opts.uploadProgress && $.isFunction(opts.uploadProgress)) {
                opts.uploadProgress(file, percentage);
            }
        });
        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
		webUploader.on("uploadSuccess", function (file, data) {
            console.info("event:uploadSuccess");
            var _img_container = $("div[data-id='" + file.id + "']");
            if (data.success) {
                _img_container.addClass('upload-state-done');
                _img_container.find("img").attr("src", data.result[0].thumbImgUrl.indexOf("http://") === 0 ? data.result[0].thumbImgUrl : (site.config.resourecePath + data.result[0].thumbImgUrl));
                _img_container.find(".info").attr("title", data.result[0].thumbImgUrl.substring(data.result[0].thumbImgUrl.lastIndexOf("/") + 1));
                _img_container.find(".info").html(data.result[0].thumbImgUrl.substring(data.result[0].thumbImgUrl.lastIndexOf("/") + 1));
                opts.imgFiles.push({
                    id: file.id,
                    name: data.result[0].imageUrl.substring(data.result[0].imageUrl.lastIndexOf("/") + 1, data.result[0].imageUrl.lastIndexOf(".")),
                    thumbImgName: data.result[0].thumbImgUrl.substring(data.result[0].thumbImgUrl.lastIndexOf("/") + 1, data.result[0].thumbImgUrl.lastIndexOf(".")),
                    isNew: true,
                    imgUrl: data.result[0].imageUrl,
                    thumbUrl: data.result[0].thumbImgUrl
                });
                if (opts.changeFile && $.isFunction(opts.changeFile)) {
                    opts.changeFile(opts.imgFiles[opts.imgFiles.length-1], "add", opts.imgFiles);
                }
            } else {
                var $error = _img_container.find('div.error');
                // 避免重复创建
                if (!$error.length) {
                    $error = $('<div class="error"></div>').appendTo(_img_container);
                }
                $error.css('z-index', '2');
                $error.text('上传失败');
                //alert(ret.error.message || "系统异常，请稍后再试");
            }
            if (opts.uploadSuccess && $.isFunction(opts.uploadSuccess)) {
                opts.uploadSuccess(file, data);
            }
        });

        // 文件上传失败，显示上传出错。
		webUploader.on("uploadError", function (file) {
            console.info("event:uploadError");
            var _img_container = $("div[data-id='" + file.id + "']"),
                $error = _img_container.find('div.error');
            // 避免重复创建
            if (!$error.length) {
                $error = $('<div class="error"></div>').appendTo(_img_container);
            }
            $error.text('上传失败');
            if (opts.uploadError && $.isFunction(opts.uploadError)) {
                opts.uploadError(file);
            }
        });
        // 完成上传完了，成功或者失败，先删除进度条。
		webUploader.on("uploadComplete", function (file) {
            console.info("event:uploadComplete");
            var _img_container = $("div[data-id='" + file.id + "']");
            _img_container.find('.progress').remove();
            if (opts.uploadComplete && $.isFunction(opts.uploadComplete)) {
                opts.uploadComplete(file);
            }
        });
        return webUploader;
	}
	
	// 多图上传业务处理
	site.BDWebUpload.multipleImageInitService = function(opts){
		if(!opts){
			opts = {};
		}
		var _opts = $.extend({}, opts);
		_opts.thumbWidth = _opts.thumbWidth || 200;
		_opts.thumbHeight = _opts.thumbHeight || 150;
		_opts.$filePreviewArea = $(_opts.filePreviewArea || "#multiple-img-preview");
        //生成页面模板
		_opts.generateImgTemplage = function (imgData) {
            return ['<div data-id="' + imgData.id + '" class="file-item thumbnail" data-is-new="'+(imgData.isNew?"true":"false")+'">',
            '   <div class="file-panel" style="height:0px;"><span class="cancel">删除</span></div>',
            '   <p class="imgWrap">',
            '       <img style="width:' + _opts.thumbWidth + 'px;height:' + _opts.thumbHeight + 'px;"' + (imgData.thumbUrl ? (' src="' + (imgData.thumbUrl.indexOf("http://") === 0 ? imgData.thumbUrl : (site.config.resourecePath + imgData.thumbUrl)) + '"') : '') + '>',
            '   </p>',
            '   <div class="info">' + (imgData.thumbImgName ? imgData.thumbImgName : imgData.name) + '</div>',
            '</div>'].join("\n");
        }
        var imgFiles = [];
        if (_opts.imgFiles && _opts.imgFiles.length > 0) {
            for (var i = 0; i < _opts.imgFiles.length; i++) {
                imgFiles.push({
                    id: _opts.imgFiles[i].substring(_opts.imgFiles[i].lastIndexOf("/") + 1, _opts.imgFiles[i].lastIndexOf("."))+"_"+i,
                    thumbImgName: _opts.imgFiles[i].substring(_opts.imgFiles[i].lastIndexOf("/") + 1),
                    name: _opts.imgFiles[i].substring(_opts.imgFiles[i].lastIndexOf("/") + 1).replace("_thum.", "."),
                    isNew: false,
                    imgUrl: _opts.imgFiles[i].substring(_opts.imgFiles[i].lastIndexOf(".") - 5, _opts.imgFiles[i].lastIndexOf(".")) === "_thum" ? _opts.imgFiles[i].substring(0, _opts.imgFiles[i].lastIndexOf(".") - 5) + _opts.imgFiles[i].substring(_opts.imgFiles[i].lastIndexOf(".")) : _opts.imgFiles[i],
                    thumbUrl: _opts.imgFiles[i]
                });
                console.info(imgFiles[i]);
                _opts.$filePreviewArea.append(_opts.generateImgTemplage(imgFiles[i]));
            }
        }
        _opts.imgFiles = imgFiles;
        return _opts;
	}
	
	// 多图上传业务处理
	site.BDWebUpload.multipleImageEventsBind = function(opts, webUploader){
		opts.$filePreviewArea.on('mouseenter', "div[data-id]", function () {
            $(this).find("div.file-panel").stop().animate({ height: 30 });
        });
		opts.$filePreviewArea.on('mouseleave', "div[data-id]", function () {
            $(this).find("div.file-panel").stop().animate({ height: 0 });
        });
        //移除文件
		opts.$filePreviewArea.on("click", "div[data-id] > div.file-panel > span.cancel", function (events) {
            var _img_container = $(this).parent().parent();
            var id = _img_container.attr("data-id");
            if (_img_container.attr("data-is-new") === "true") {
                var files = webUploader.getFiles();
                for (var i = 0; i < files.length; i++) {
                    if (id === files[i].id) {
                    	webUploader.removeFile(files[i]);
                        break;
                    }
                }
            } else {
                _img_container.remove();
                var imgFile = null;
                for (var i = 0; i < opts.imgFiles.length; i++) {
                    if (id === opts.imgFiles[i].id) {
                        imgFile = opts.imgFiles[i];
                        opts.imgFiles.splice(i, 1);
                        break;
                    }
                }
                if (opts.changeFile && $.isFunction(opts.changeFile)) {
                    opts.changeFile(imgFile, "delete", opts.imgFiles);
                }
            }
        });
	}
	
	//百度多图上传文件
	site.BDWebUpload.multipleImage = function(opts){
		if (!opts) {
            opts = {};
        }
        var _defalut = {
            // 文件接收服务端。
            server: (opts.server ? opts.server : (site.config.uploadPath)),
            // 选完文件后，是否自动上传。
            auto: true,
            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: true,
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: {
                id: (opts.pickId ? opts.pickId : "#multiple-img-upload-button"),
                multiple: true
            },
            formData: {
                imageThumbW: opts.thumbWidth ? opts.thumbWidth : 160,
                imageThumbH: opts.thumbHeight ? opts.thumbHeight : 120,
                fileType: "image",
                isCut: false
           },
            // 只允许选择图片文件。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },
            thumb: {
                width: opts.thumbWidth ? opts.thumbWidth : 200,
                height: opts.thumbHeight ? opts.thumbHeight : 150,
                // 图片质量，只有type为`image/jpeg`的时候才有效。
                quality: 100,
                // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                allowMagnify: false,
                // 是否允许裁剪。
                crop: false,
                // 为空的话则保留原有图片格式。
                // 否则强制转换成指定的类型。
                type: 'image/jpeg'
            },
            compress: {
                width: 1920,
                height: 1920,
                // 图片质量，只有type为`image/jpeg`的时候才有效。
                quality: 95,
                // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                allowMagnify: false,
                // 是否允许裁剪。
                crop: false,
                // 是否保留头部meta信息。
                preserveHeaders: true,
                // 如果发现压缩后文件大小比原来还大，则使用原来图片
                // 此属性可能会影响图片自动纠正功能
                noCompressIfLarger: true,
                // 单位字节，如果图片大小小于100K，不会采用压缩。
                compressSize: 100 * 1024
            }
        }
        return site.BDWebUpload.upload(_defalut);
	}
	
	//百度上传文件
	site.BDWebUpload.upload = function(options){
		//上传文件
		var _default = {
			// 选完文件后，是否自动上传。
            auto: true,
            // swf文件路径
			swf: site.config.contextPath + '/scripts/Uploader.swf',
			// 文件接收服务端。
			server: site.config.uploadPath,
            // 是否要分片处理大文件上传。
            chunked: true,
            // 如果要分片，分1M一片
            chunkSize: 1024 * 1024 * 10,
            // 验证文件总数量, 超出10个则不允许加入队列
            fileNumLimit: 10,
            // 验证单个文件大小是否超出50M限制, 超出则不允许加入队列。
            fileSingleSizeLimit: 1024 * 1024 * 50
		}
		return WebUploader.create($.extend({}, _default, options));
	}
});