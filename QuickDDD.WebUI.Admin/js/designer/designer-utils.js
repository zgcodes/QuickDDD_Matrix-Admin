/**
 * 作者：yujinjin9@126.com
 * 时间：2015-10-25
 * 描述：设计器工具类
 */
define(function () {
	var utils = {};
	utils.paramEncode = function (data) {
        return typeof data == 'undefined' || data == '' || $.isEmptyObject(data) ? '{}' : JSON.stringify(data, function (k, v) {
            var re;
            if (typeof (v) == 'string') {
                re = k == 'FHtml' || k == 'CssText' || k == 'HtmlBody' ? encodeURIComponent(v) : encodeURIComponent(utils.filterXss(v));
            } else {
                re = v;
            }
            return re;
        });
    };
	
	// xss过滤
	utils.filterXss = function (cont) {
        if (typeof cont === "string" && cont != '') {
            // cont = cont.replace(/&/g, '&amp;'); 暂不过滤&
            cont = cont.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            cont = cont.replace(/\'/g, '&#39;').replace(/\"/g, '&quot;');
        }
        return cont;
    };
    
    // 文本组件editor内容单独处理,留意对其他组件FBody是否有影响
    utils.paramDecode = function (json, widget) {
        widget = typeof widget == 'undefined' ? '' : widget;
        return typeof json == 'undefined' || json == '' || json == 'null' || json == null || $.isEmptyObject(json) ? {} : JSON.parse(json, function (k, v) {
            // 文本组件 不需单独解析
            return typeof v == 'string' ? decodeURIComponent(v.replace(/\+/g, ' ')) : v;
            /*
			 * var re; if (typeof v == 'string') { re = widget == 'Text' && k ==
			 * 'FBody' ? decodeURIComponent(v.replace(/\+/g, ' ')) : WX_Utils
			 * .htmlspecialchars_decode(decodeURIComponent(v.replace(/\+/g, ' '))); }
			 * else { re = v; } return re;
			 */
        });
    };
    
    utils.toHtmlString = function ($element) {
        return $('<div></div>').html($element.clone()).html();
    };
    
    //修改CSS的中background-image的相对图片路径
    utils.changeBackgrounImage = function (str) {
    	if (str == null) str = "";
        var html = "";
        if(str.length > 0){
        	var start = str.indexOf("background-image");
        	var end = -1;
        	if(start>-1){
        		end = str.indexOf(";", start);
        		if(end>-1){
        			html = str.substring(start, end);
        		}
        	}
        	if(html.indexOf("url")>-1){
        		var newStart = -1;
        		var newEnd = -1;
        		if(html.indexOf("\"")>-1){
        			newStart = html.indexOf("\"") + 1;
        			newEnd = html.indexOf("\"", newStart);
            	} else if(html.indexOf("'")>-1){
            		newStart = html.indexOf("\'") + 1;
            		newEnd = html.indexOf("\'", newStart);
            	} else if(html.indexOf("(")>-1 && html.indexOf(")")>-1){
            		newStart = html.indexOf("(") + 1;
            		newEnd = html.indexOf(")");
            	}
        		if(newStart>-1 && newEnd>newStart){
        			html = $.trim(html.substring(newStart, newEnd));
        			if(html && html.indexOf("http://")!=0){
        				html = designer.config.resourecePath + html;
        			}
        			end = start + newEnd;
        			start = newStart + start;
        		}
        	}
        	if(end >-1){
        		html = str.substring(0, start)+html+str.substring(end, str.lenght);
        	} else {
        		html = str;
        	}
        }
        return html;
    }
    
    //验证上传的图片尺寸
    utils.validateImageSize = function(imageFactSize, imageRequireSize, imageMinSize, imageMaxSize, isCut){
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
    
    //裁剪之后的图片尺寸
    utils.getImgSize = function(maxWidth, maxHeight, imageOriginalWidth, imageOriginalHeight){
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
	
    //剩余字数提示
    utils.wordLimitTips = function (option) {
        $.each(['focus', 'keydown', 'keypress', 'keyup'], function (i, e) {
            $.each(option.limitObj, function (_i, _e) {
                _e.limitEle.on(e, function () {
                    var remainNum = parseInt(_e.wordMax - $(this).val().length) > 0 ? parseInt(_e.wordMax - $(this).val().length) : 0;
                    if (_e.haveBracket === false) {
                        _e.tipsEle.html('还可输入<font color="red">' + remainNum + '</font>字');
                    } else {
                        _e.tipsEle.html('（还可输入<font color="red">' + remainNum + '</font>字）');
                    }
                }).on('blur', function () {//默认文字
                    if ($(this).val() == '') {
                        _e.tipsEle.html('（限' + _e.wordMax + '个字）');
                    }
                });
            });
        });
    };
    
    //获取属性个数
    utils.getPropertyCount = function (target) {
        var result = 0;
        var i;
        if (Object.prototype.toString.call(target) !== '[object Object]') {
            result = 0;
        }
        else {
            for (i in target) {
                if (target.hasOwnProperty(i)) {
                    result++;
                }
            }
        }
        return result;
    }
    
    // modelData
    utils.modelData = function ($node, str, isArray) {
        var isArray = isArray || false;
        var data = {};
        str.replace(/\S+/g, function (k) {
            var $val = $node.find('[data-tmpldata="' + k + '"]');
            // 如为单一值，则返回value，如为多个值，则返回array
            if (isArray) {
                data[k] = [];
                $val.each(function (i, v) {
                    if ($(v).is("input[type='text'], input[type='hidden'], select")) {
                        val = $(v).val();
                    } else if ($(v).is("input[type='radio']")) {
                        $val.each(function (i, v) {
                            'checked' == $(v).attr('checked') ? val = $(v).val() : '';
                        });
                    } else if ($(v).is("input[type='checkbox']")) {
                        val = 'checked' == $(v).attr('checked') ? 1 : 0;
                    } else if ($(v).is("textarea")) {
                        val = $(v).val();
                    }
                    data[k].push(utils.filterXss($.trim(val)));
                });
            } else {
                var val;
                if ($val.is("input[type='text'], input[type='hidden'], select")) {
                    val = $val.val();
                } else if ($val.is("input[type='radio']")) {
                    $val.each(function (i, v) {
                        //$(v).prop('checked') == true || $val.attr('checked') == 'checked' ? val = $(v).val() : '';
                        $(v).prop('checked') == true ? val = $(v).val() : '';
                    });
                } else if ($val.is("input[type='checkbox']")) {
                    //val = $val.prop('checked') == true || $val.attr('checked') == 'checked' ? 1 : 0;
                    val = $val.prop('checked') == true ? 1 : 0;
                } else if ($val.is("textarea")) {
                    val = $val.val();
                }

                data[k] = utils.filterXss($.trim(val));
            }
        });
        return data;
    };
    
    //根据id返回边距设置对象
    utils.getPadding = function (cls) {
        var ret = "";
        var $panel = $(cls);
        var $padding = $panel.find(".padding_t");
        var num = $padding.val();
        if (num == "") num = 0;
        var $padding_iseach = $panel.find(".padding_iseach");
        var iseach = $padding_iseach.prop('checked');
        if (!iseach)  //未分开设置，直接返回数字， 否则返回对象
            return num;
        var $padding_b = $panel.find(".padding_b");
        var $padding_l = $panel.find(".padding_l");
        var $padding_r = $panel.find(".padding_r");
        var obj = {
            iseach: iseach ? 1 : 0,
            t: num,
            b: iseach ? $padding_b.val() : num,
            l: iseach ? $padding_l.val() : num,
            r: iseach ? $padding_r.val() : num
        };
        return obj;
    }
    
	return utils
});