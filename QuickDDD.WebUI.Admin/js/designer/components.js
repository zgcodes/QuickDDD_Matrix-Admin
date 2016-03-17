/**
 * 作者：yujinjin9@126.com
 * 时间：2015-10-25
 * 描述：设计器样式编辑栏所用到的组件
 */
define(["api", "designerUtils", "render", "template"], function (api, designerUtils, render, template) {
    var components = {}, info = render.info;
    
    //弹出背景设置窗口
    components.setBackgroundDialog = function (cls) {
        var bgbox = $(cls);
        var bgData = bgbox.find('.bgimg-data');
        var bgCssText = bgbox.find('.bgimg-csstext');
        if (bgData == null) {
        	designer.alert('没有找到“' + cls + '”下的“.bgimg-data”');
            return;
        }
        if (bgCssText == null) {
        	designer.alert('没有找到“' + cls + '”下的“.bgimg-csstext”');
            return;
        }
        var dialog = designer.dialog({
            width: "700px",
            height: "550px",
            title: "背景图设置",
            href: api.bgimageSetUrl,
            buttons: {
                ok: {
                    label: "确定",
                    className: "btn-primary",
                    callback: function () {
                        var ret = dialog.contentWindow.getReturn();
                        if (ret === false) return false;
                        bgData.val(ret.Data);
                        bgCssText.val(ret.CssText);
                        bgbox[0].style.cssText = designerUtils.changeBackgrounImage(ret.CssText);  //更新背景图设置框
                        bgbox.trigger("change");
                        components.setBgImageDelBtn(cls);
                    }
                },
                cancel: {
                    label: "取消",
                    className: "btn-default"
                }
            },
            args: [bgData.val()]
        })
    }

    components.initBgImage = function (cls, $showNode, $editNode) {
        var bgbox = $(cls);
        var bgData = bgbox.find('.bgimg-data');
        var bgCssText = bgbox.find('.bgimg-csstext');
        var bgdelbtn = bgbox.closest('.form-group').find('.bgimg-delbtn');
        var cssText = bgCssText.val();
        bgbox[0].style.cssText = designerUtils.changeBackgrounImage(cssText);

        bgbox.click(function () {
        	components.setBackgroundDialog(cls);
        });
        bgbox.on('change', function () {
            $showNode.trigger("refresh");
        });
        //删除按钮
        components.setBgImageDelBtn(cls);
        bgdelbtn.click(function () {
            bgData.val('');
            bgCssText.val('');
            bgbox[0].style.cssText = '';
            bgdelbtn.addClass('hide');
            bgbox.trigger("change");
            return false;
        });
    }

    components.setBgImageDelBtn = function (cls) {
        var bgbox = $(cls);
        var bgCssText = bgbox.find('.bgimg-csstext');
        var bgdelbtn = bgbox.closest('.form-group').find('.bgimg-delbtn');
        var cssText = bgCssText.val();
        if (cssText == "")
            bgdelbtn.addClass('hide');
        else
            bgdelbtn.removeClass('hide');
    }


    //根据id返回背景设置 //json字符串
    components.getBgImage = function (cls) {
        var bgImage = null;
        var ele = $(cls);
        var eleData = ele.find('.bgimg-data');
        var eleCssText = ele.find('.bgimg-csstext');
        var obj = { Data: eleData.val(), CssText: eleCssText.val() };
        return obj;
    }
    
    components.initSerachLink=function(cls, $showNode, $editNode){
    	$(cls).each(function (i, ele) {
            var panel = $(ele);
            var LinkDisplay = panel.find('input[data-tmpldata="LinkDisplay"]');
            var LinkSrc = panel.find('input[data-tmpldata="LinkSrc"]');
            var LinkUrl = panel.find('input[data-tmpldata="LinkUrl"]');
            var LinkParm = panel.find('input[data-tmpldata="LinkParm"]');
            LinkDisplay.css('cursor', 'pointer');

            var OutLinkCallback = function (args) {
                LinkDisplay.val(args.LinkDisplay);
                LinkSrc.val(args.LinkSrc);
                LinkUrl.val(args.LinkUrl);
                LinkParm.val(args.LinkParm);
                $showNode.trigger('refresh');
            };

            LinkDisplay.click(function () {
                var data = {
                    LinkDisplay: LinkDisplay.val(),
                    LinkSrc: LinkSrc.val(),
                    LinkUrl: LinkUrl.val(),
                    LinkParm:LinkParm.val()
                };
                //调用搜索连接设置
                //service.openSearchLink(OutLinkCallback, data);
            });
        });
    };

    //外链
    components.initOutLink = function (cls, $showNode, $editNode) {
        $(cls).each(function (i, ele) {
            var panel = $(ele);
            var LinkDisplay = panel.find('input[data-tmpldata="LinkDisplay"]');
            var LinkSrc = panel.find('input[data-tmpldata="LinkSrc"]');
            var LinkUrl = panel.find('input[data-tmpldata="LinkUrl"]');
            LinkDisplay.css('cursor', 'pointer');

            var OutLinkCallback = function (args) {
                LinkDisplay.val(args.LinkDisplay);
                LinkSrc.val(args.LinkSrc);
                LinkUrl.val(args.LinkUrl);
                $showNode.trigger('refresh');
            };

            LinkDisplay.click(function () {
                var data = {
                    LinkDisplay: LinkDisplay.val(),
                    LinkSrc: LinkSrc.val(),
                    LinkUrl: LinkUrl.val()
                };
                //调用余的外链功能
                //service.openOutLink(OutLinkCallback, data);
            });
        });
    };
    
    // 上传图片（可剪切） opts:百度上传的参数配置||callbackFun：成功之后的回调函数||回调函数需要传值的参数,以数组的方式
    components.uploadImage = function(opts, callbackFun, paramerts){
    	require([designer.config.contextPath + "/scripts/webuploader/webuploader.js", 
    	         designer.config.contextPath + "/scripts/jquery.Jcrop.js", 
    	         "css!" + designer.config.contextPath + "/content/webuploader.css",
    	         "css!" + designer.config.contextPath + "/content/jquery.Jcrop.css",
    	         "css!" + designer.config.contextPath + "/css/upload.css"], function(webuploader){
			if (!opts) {
	            opts = {};
	        }
			var _opts = $.extend({}, opts);
			var _defalut = {
				// 选完文件后，是否自动上传。
	            auto: false,
				 // 文件接收服务端。
	            server: (opts.server ? opts.server : (designer.config.uploadPath)),
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
			var uploader = new webuploader.Uploader(_defalut);
			// 当有文件添加进来的时候
			uploader.on("fileQueued", function (file) {
				// 创建缩略图
				uploader.makeThumb(file, function (error, src) {
	                if (error) {
	                	designer.alert('上传图片失败，浏览器版本太低。');
	                    return;
	                }
	                var imageFactSize = { width: file._info.width, height: file._info.height},
                	imageRequireSize  = {width: _opts.width, height: _opts.height},
                	imageMinSize = {width: _opts.minWidth, height: _opts.minHeight},
                	imageMaxSize = {width: _opts.maxWidth, height: _opts.maxHeight};
	                var errorMsg = designerUtils.validateImageSize(imageFactSize, imageRequireSize, imageMinSize, imageMaxSize, _opts.isCut !== false);
	                if(errorMsg){
	                	site.error(errorMsg);
	                	return;
	                }
	                if(_opts.isCut === false){
	                	uploader.upload(file);
	                	return;
	                }
	                var callUploadFun = function(data){
	                	uploader.options.formData = $.extend({}, uploader.options.formData, {width: _opts.width, height: _opts.height}, data);
	                	uploader.upload(file);
	                }
	                //启用客户端压缩
	                if (uploader.options.compress) {
	                	imageFactSize = designerUtils.getImgSize(uploader.options.compress.width, uploader.options.compress.height, file._info.width, file._info.height);
	                }
	                components.jcropImage({
	                	allowResize: (_opts.width || _opts.height)?false:true,
	                	imgSrc: src,
	                	thumbWidth: _opts.thumbWidth,
	                	thumbHeight: _opts.thumbHeight,
	                	saveCallbacFun: callUploadFun,
	                	width: imageFactSize.width,
	                	height: imageFactSize.height,
	                	selectWidth: _opts.width,
	                	selectHeight: _opts.height,
	                	maxSize: [_opts.width || _opts.maxWidth || 0, _opts.height || _opts.maxHeight || 0],
	                	minSize: [_opts.width || _opts.minWidth || 0, _opts.height || _opts.minHeight || 0]
	                });
	        	});
			});
	        // 文件上传成功
			uploader.on("uploadSuccess", function (file, data) {
				var _paramerts = [];
				if(paramerts instanceof Array){
					_paramerts = paramerts.slice(0);
            	} else if(paramerts){
            		_paramerts.push(paramerts);
            	}
				_paramerts.push(data);
            	if (callbackFun && $.isFunction(callbackFun)) {
            		callbackFun.apply(this, _paramerts)
                }
	        });

	        // 文件上传失败，显示上传出错。
			uploader.on("uploadError", function (file) {
	        	designer.error("图片上传失败！");
	        });

	        // 完成上传，成功或者失败，删除进度条，重置队列，以便让已选取过的文件可以再重新选。
	        uploader.on("uploadComplete", function (file) {
	        	uploader.reset();
	        });
    	});
    };
    
    //图片剪切
    components.jcropImage = function(options){
    	var _s = designerUtils.getImgSize(200, 200, options.thumbWidth, options.thumbHeight);
        var html = ['<div class="mb10">',
                    (options.allowResize?'	<label><input type="checkbox" name="isCut" checked="checked" class="ace"><span class="lbl padding-2 red">使用裁剪（动态gif图片时建议勾选）</span></label>':''),
    				'</div>',
    				'<img class="preview-image" src="' + options.imgSrc + '" >',
    				'<div class="cut-preview-panel" style="width:' + _s.width + 'px; height: ' + _s.height + 'px">',
    				'	<img src="' + options.imgSrc + '">',
        			'</div>'].join("\n");
        var _dialog = designer.dialog({
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
        var _$saveButton = _dialog.find("button[data-bb-handler='save']"),
			preview_image_size = {}, 
			img_panel_size = {w: _dialog.find("img.preview-image").width(), h: _dialog.find("img.preview-image").height()},
			ratioW = options.width/_dialog.find("img.preview-image").prop('width'), 
			ratioH = options.height/_dialog.find("img.preview-image").prop('height');
		preview_image_size.w = _dialog.find("div.cut-preview-panel").width();
		preview_image_size.h = _dialog.find("div.cut-preview-panel").height();
		var changePreview = function(previewImgSelector, coordinate, img_panel_size, preview_image_size){
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
		_dialog.find("img.preview-image").Jcrop({
			allowResize: options.allowResize,
			allowSelect: options.allowResize,
			maxSize: options.maxSize,
			minSize: options.minSize,
            onChange: function(coordinate){
            	changePreview(_dialog.find("div.cut-preview-panel > img"), coordinate, img_panel_size, preview_image_size);
            },
            onSelect: function(coordinate){
            	changePreview(_dialog.find("div.cut-preview-panel > img"), coordinate, img_panel_size, preview_image_size);
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
    			if(options.saveCallbacFun && $.isFunction(options.saveCallbacFun)){
    				options.saveCallbacFun({
    					isCut: _is_cut,
    					imageX: Math.round(_this.tellSelect().x * ratioW),
    	                imageY: Math.round(_this.tellSelect().y * ratioH),
    	                imageW: Math.round(_this.tellSelect().w * ratioW),
    	                imageH: Math.round(_this.tellSelect().h * ratioH)
    				});
    			}
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
        			var _cut = $(this);
        			if(_cut.prop("checked")){
        				_this.enable();
        				var data = _cut.data();
        				_this.animateTo(data.x, data.y, data.x2, data.y2);
        			} else {
        				var tellSelect = _this.tellSelect();
        				_cut.data("x", tellSelect.x);
        				_cut.data("y", tellSelect.y);
        				_cut.data("x2", tellSelect.x2);
        				_cut.data("y2", tellSelect.y2);
        				_this.release();
        				_this.disable();
        			}
        		});
        	}
        });
    };
    
    // 初始化页面背景图 options:百度上传图片的参数配置
    components.initImageBox = function (cls, $showNode, $editNode, options) {
        $editNode.find(cls).each(function (i, ele) {
            var panel = $(ele);
            var $picurl = panel.find('input[data-tmpldata="PicUrl"]');
            if($picurl.length == 0){
            	$picurl = panel.find('input[data-tmpldata="Bgimage"]');
            }
            var picurl = $picurl.val();
            if (picurl != ""){
            	if($.trim(picurl).indexOf("http://") != 0){
            		panel.css("backgroundImage", 'url("' + designer.config.resourecePath + picurl + '")');
            	} else {
            		panel.css("backgroundImage", 'url("' + picurl + '")');
            	}
            }
            var callbackFun = function(_panel, _$showNode, data){
            	if(data && data.success == true){
         			var _$picInput = _panel.find('input[data-tmpldata="PicUrl"]');
                    _panel.css("backgroundImage", 'url("' + designer.config.resourecePath + data.result[0].imageUrl + '")');
                    _$picInput.val(data.result[0].imageUrl);
         		} else {
         			designer.error(data.error || "图片上传失败,请重新上传!");
         		}
            	_$showNode.trigger('refresh');
            }
            components.uploadImage($.extend({}, {pickId:panel}, options||{}), callbackFun, [panel,$showNode]);
        })
    };
    
    //上传按钮
    components.openUploadImg = function (el, callback, options) {
    	 var callbackFun = function(_callback, data){
    		 if(data && data.success == true){
    			 if(_callback && $.isFunction(_callback)){
    				 _callback(data.result[0].imageUrl);
    			 }
      		} else {
      			designer.error("图片上传失败,请重新上传!");
      		}
    	 }
    	 components.uploadImage($.extend({}, {pickId:el}, options||{}), callbackFun, [callback]);
    };

    //当做工具方法来用
//    //根据id返回边距设置对象
//    components.getPadding = function (cls) {
//        var ret = "";
//        var $panel = $(cls);
//        var $padding = $panel.find(".padding_t");
//        var num = $padding.val();
//        if (num == "") num = 0;
//        var $padding_iseach = $panel.find(".padding_iseach");
//        var iseach = $padding_iseach.prop('checked');
//        if (!iseach)  //未分开设置，直接返回数字， 否则返回对象
//            return num;
//        var $padding_b = $panel.find(".padding_b");
//        var $padding_l = $panel.find(".padding_l");
//        var $padding_r = $panel.find(".padding_r");
//        var obj = {
//            iseach: iseach ? 1 : 0,
//            t: num,
//            b: iseach ? $padding_b.val() : num,
//            l: iseach ? $padding_l.val() : num,
//            r: iseach ? $padding_r.val() : num
//        };
//        return obj;
//    }

    //初始化编辑框中的边距设置控件
    components.initPadding = function (cls, $showNode, $editNode, data, options) {
        var str = [
        '<div class="row">',
        '    <label class="col-xs-1 control-label padding_eachset hide">上</label>',
        '    <div class="col-xs-4">',
        '        <input class="form-control spinner-input padding_t" type="text" value="${t}" />',
        '    </div>',
        '    <div class="col-xs-1"></div><div class="col-xs-5">',
        '        <label><input class="ace padding_iseach" type="checkbox" {@if (iseach==1)}checked{@/if}  /><span class="lbl">各边分开设置</span></label>',
        '    </div>',
        '</div>',
        '<div class="padding_eachset hide">',
        '    <div class="row">',
        '        <label class="col-xs-1 control-label">左</label>',
        '        <div class="col-xs-3">',
        '            <input class="form-control spinner-input padding_l" type="text" value="${l}" />',
        '        </div>',
        '    </div>',
        '    <div class="row">',
        '        <label class="col-xs-1 control-label">右</label>',
        '        <div class="col-xs-3">',
        '            <input class="form-control spinner-input padding_r" type="text" value="${r}" />',
        '        </div>',
        '    </div>',
        '    <div class="row">',
        '        <label class="col-xs-1 control-label">下</label>',
        '        <div class="col-xs-3">',
        '            <input class="form-control spinner-input padding_b" type="text" value="${b}" />',
        '        </div>',
        '    </div>',
        '</div>'].join('\r\n');

        if (data == null || data == "") data = 0;
        var n = parseInt(data);
        if (!isNaN(n)) {  //是数字，表示统一设置
            data = { iseach: 0, t: n, b: n, l: n, r: n };
        }
        var html = template.render(str, data);
        var $panel = $(cls);
        $panel.html(html);
        var $padding = $panel.find(".padding_t");
        var $padding_b = $panel.find(".padding_b");
        var $padding_l = $panel.find(".padding_l");
        var $padding_r = $panel.find(".padding_r");
        var $padding_iseach = $panel.find(".padding_iseach");
        var $padding_eachset = $panel.find(".padding_eachset");
        require(["edit/customer-spinner"], function(){
	        var spinner_padding = $padding.wx_spinner(options);
	        var spinner_padding_b = $padding_b.wx_spinner(options);
	        var spinner_padding_l = $padding_l.wx_spinner(options);
	        var spinner_padding_r = $padding_r.wx_spinner(options);
	        var toggleNavPaddingEach = function (iseach) {
	            if (iseach) {
	                $padding_eachset.removeClass("hide");
	            } else {
	                $padding_eachset.addClass("hide");
	            }
	            var padding = $padding.val() / 1;
	            $padding_b[0].spinner.spinner("value", padding);
	            $padding_l[0].spinner.spinner("value", padding);
	            $padding_r[0].spinner.spinner("value", padding);
	        }
	        $padding_iseach.on('change', function () {
	            //alert($("#padding_iseach").prop('checked'));
	            toggleNavPaddingEach($padding_iseach.prop('checked'));
	        });
	        if ($padding_iseach.prop('checked')) {
	            $padding_eachset.removeClass("hide");
	        }
        });
    }
    
    //添加表单数字增减效果插件
    components.addSpinner = function (selector, options, callbackFun) {
    	require(["edit/customer-spinner"], function(){
    		$(selector).wx_spinner(options);
    		if(callbackFun && $.isFunction(callbackFun)){
    			callbackFun();
    		}
    	});
    }

// 删除掉，这是导航栏的业务代码，不是组件
//    components.getPaddingFull = function (data) {
//        if (data == null || data == "") data = 0;
//        var n = parseInt(data);
//        if (!isNaN(n)) {  //是数字，表示统一设置
//            data = { iseach: 0, t: n, b: n, l: n, r: n };
//        }
//        return data;
//    }

    //初始化编辑框中的边距设置控件
    components.initIconBox = function (cls, $showNode, $editNode) {
        //选择图标
        $editNode.find(cls).click(function () {
            var box = $(this);
            designer.dialog({
                width: "750px",
                height: "500px",
                title: "请选择图标",
                href: api.miconSelectUrl,
                callback: function (icon) {
                	var html = "";
                    if(icon.length === 0 || icon.indexOf('fa ') === 0 || icon.indexOf('glyphicon ') === 0 || icon.indexOf('icon-') === 0){
                    	html = '<i class="' + icon + '"></i>';
                    } else {
                    	if($.trim(icon).indexOf("http://") == 0){
                    		html = '<img src="' + icon + '" />';
                    	} else {
                    		html = '<img src="' + designer.config.resourecePath + icon + '" />';
                    	}
                    }
                    box.parent('div').find('input[data-tmpldata="Icon"]').val(icon);
                    box.html(html);
                    $showNode.trigger('refresh');
                }
            });
        });
    }

//    WX_Components.initTimePicker = function ($container) {
//    	require(["edit/customer-spinner"], function(){
//    		$container.datetimepicker({
//                dateFormat: "yy-mm-dd",
//                timeFormat: 'HH:mm:ss',
//                dayNamesMin: [
//    				"日",
//    				"一",
//    				"二",
//    				"三",
//    				"四",
//    				"五",
//    				"六"],
//                monthNames: [
//    				"1月",
//    				"2月",
//    				"3月",
//    				"4月",
//    				"5月",
//    				"6月",
//    				"7月",
//    				"8月",
//    				"9月",
//    				"10月",
//    				"11月",
//    				"12月"],
//                showMonthAfterYear: true,
//                yearSuffix: "年",
//                timeText: '时间',
//                hourText: '时',
//                minuteText: '分',
//                secondText: '秒',
//                yearSuffix: "年",
//                closeText: '关闭',
//                currentText: '当前时间',
//                onClose: function (dateText, inst) {
//                },
//                onSelect: function (selectedDateTime) {
//                }
//            });
//    	});
//    };

//    components.initTimePeriod = function ($startDateTextBox, $endDateTextBox) {
//    	// TODO:重构
//        $startDateTextBox.add($endDateTextBox).datetimepicker({
//            dateFormat: "yy-mm-dd",
//            timeFormat: 'HH:mm:ss',
//            minDate: new Date().format("yyyy-MM-dd hh:mm:ss"),
//            dayNamesMin: [
//				"日",
//				"一",
//				"二",
//				"三",
//				"四",
//				"五",
//				"六"],
//            monthNames: [
//				"1月",
//				"2月",
//				"3月",
//				"4月",
//				"5月",
//				"6月",
//				"7月",
//				"8月",
//				"9月",
//				"10月",
//				"11月",
//				"12月"],
//            showMonthAfterYear: true,
//            yearSuffix: "年",
//            timeText: '时间',
//            hourText: '时',
//            minuteText: '分',
//            secondText: '秒',
//            yearSuffix: "年",
//            closeText: '关闭',
//            currentText: '当前时间',
//            onClose: function (dateText, inst) {
//                $endDateTextBox.add($startDateTextBox).trigger('change');
//            },
//            onSelect: function (selectedDateTime) {
//            }
//        });
//    }

//    components.getUEditor = function (containerId, opt) {
//    	// TODO:重构
//        var editor = new UE.ui.Editor(opt);
//        editor.render(containerId);
//        return editor;
//    }
//
//    components.initUEditorMini = function ($showNode, containerId, $valueContainer) {
//        var editorIns = components.getUEditor(containerId, {
//            //var editorIns = uedit.initEditor(containerId, {
//            toolbars: [
//                ['fullscreen', 'source', '|', 'undo', 'redo', '|',
//                'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', 'pasteplain', '|',
//                'forecolor', 'backcolor', '|',
//                'fontfamily', 'fontsize', '|',
//                'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', 'lineheight', '|',
//                'link', 'unlink']
//            ],
//            autoHeightEnabled: true,
//            elementPathEnabled: false
//        });
//        components.UeditorIDs.push(containerId);
//        editorIns.addListener('ready', function () {
//            var sync = function (isMarkChange) {
//                // For authing input
//                $valueContainer.val(editorIns.getContent());
//                $showNode.trigger('refresh', { markModified: isMarkChange });
//            };
//            editorIns.setContent($valueContainer.val());
//            editorIns.addListener('selectionchange', function () {
//                sync(false);
//            });
//            $($('iframe')[0].contentWindow.document).keyup(function (e) {
//                sync(true);
//            });
//
//            $('#' + containerId).unbind('mouseup').mouseup(function () {
//                setTimeout(function () {
//                    sync(true);
//                }, 0);
//                setTimeout(function () {
//                    $('#edui_fixedlayer').unbind('mouseup').mouseup(function () {
//                        setTimeout(function () {
//                            sync(true);
//                        }, 0);
//                    });
//                }, 0);
//            });
//        });
//    };
//
//    components.initUEditor = function ($showNode, containerId, $valueContainer) {
//    	// TODO:重构
//        var editorIns = UE.getEditor(containerId, {
//            elementPathEnabled: false
//        });
//        components.UeditorIDs.push(containerId);
//        editorIns.addListener('ready', function () {
//            var sync = function (isMarkChange) {
//                // For authing input
//                $valueContainer.val(editorIns.getContent());
//                $showNode.trigger('refresh', { markModified: isMarkChange });
//            };
//            editorIns.setContent($valueContainer.val());
//            editorIns.addListener('selectionchange', function () {
//                sync(false);
//            });
//            $($('iframe')[0].contentWindow.document).keyup(function (e) {
//                sync(true);
//            });
//            $('#' + containerId).unbind('mouseup').mouseup(function () {
//                setTimeout(function () {
//                    sync(true);
//                }, 0);
//                setTimeout(function () {
//                    $('#edui_fixedlayer').unbind('mouseup').mouseup(function () {
//                        setTimeout(function () {
//                            sync(true);
//                        }, 0);
//                    });
//                }, 0);
//            });
//        });
//    };
//
//    //属性编辑框内的Ueditor文本编辑器控件，在刷新编辑框前需要清除掉原有
//    components.UeditorIDs = [];
//
//    components.UeditorControlsDestroy = function () {
//    	// TODO:重构
//        $.each(components.UeditorIDs, function (i, id) {
//            UE.delEditor(id);
//        });
//        components.UeditorIDs = [];
//    }

    //属性编辑框内的颜色选择控件，在刷新编辑框前需要清除掉原有
    components.colorInputControls = [];

    //颜色选择器销毁
    components.colorInputControlsDestroy = function () {
    	// TODO:重构
        $.each(components.colorInputControls, function (i, $input) {
            $input.spectrum("destroy");
        });
        components.colorInputControls = [];
    }

    //颜色选择器组件
    components.colorInput = function ($input) {
    	require(["edit/spectrum", "css!edit/spectrum"], function(){
	        $input.spectrum({
	            color: $input.val(),
	            allowEmpty: true,
	            showInput: true,
	            containerClassName: "full-spectrum",
	            showInitial: true,
	            showPalette: true,
	            showSelectionPalette: true,
	            hideAfterPaletteSelect:true,
	            showAlpha: true,
	            maxPaletteSize: 10,
	            preferredFormat: "hex",
	            cancelText: "取消",
	            chooseText: "确定",
	            clearText: "清除颜色，设置为空值",
	            togglePaletteMoreText: "更多",
	            togglePaletteLessText: "少",
	            move: function (color) {
	                //updateBorders(color);
	            },
	            show: function () {
	
	            },
	            beforeShow: function () {
	
	            },
	            hide: function (color) {
	                //updateBorders(color);
	                $input.val(color);
	            },
	
	            palette: [
	                ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(153, 153, 153)","rgb(183, 183, 183)",
	                "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(239, 239, 239)", "rgb(243, 243, 243)", "rgb(255, 255, 255)"],
	                ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
	                "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
	                ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
	                "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)"],
	                ["rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
	                "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)"],
	                ["rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
	                "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)"],
	                ["rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
	                "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)"],
	                ["rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)", "rgb(56, 118, 29)",
	                "rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)", "rgb(53, 28, 117)", "rgb(116, 27, 71)"],
	                ["rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
	                "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
	            ]
	        });
	        components.colorInputControls.push($input);
    	});
    }
    
    //堆糖瀑布流插件
    
    return components;
});

