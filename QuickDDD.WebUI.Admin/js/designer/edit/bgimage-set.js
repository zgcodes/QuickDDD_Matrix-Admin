/**
 * 作者：yujinjin9@126.com
 * 时间：2015-12-01
 * 描述：背景图设置
 */
var colorInputControls = []; // 属性编辑框内的颜色选择控件，在刷新编辑框前需要清除掉原有

colorInputControlsDestroy = function () {
    $.each(colorInputControls, function (i, $input) {
        $input.spectrum("destroy");
    });
    colorInputControls = [];
}

// 需要引用Spectrum.js
var colorInput = function ($input) {
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
    colorInputControls.push($input);
}

// 弹出框的初始化方法，由弹窗方法中自动调用
function modalDialogInit(args) {
	var img = null;
	try {
		img = JSON.parse(args);
	} catch (err) {
	}
	if (img == null || img == "")
		img = {
			type : 'pic'
		};
	if (img.pic == null)
		img.pic = {
			url : '',
			size : '填充',
			position : 'center'
		};
	if (img.gradient == null)
		img.gradient = {
			deg : '270',
			isUseStopColor : 0,
			fromColor : '#cfe2f3',
			stopColor : '#4a86e8',
			toColor : '#3d85c6',
			stopColorPercent : 50
		};
	if (img.gradient.stopColorPercent == null)
		img.gradient.stopColorPercent = 50;
	$("#bgPicUrl").val(img.pic.url);
	$('#selbgsizerepeat').selectpicker('val', img.pic.size);
	$('#selbgposition').val(img.pic.position);
	$('#seldeg').val(img.gradient.deg);
	$('#fromColor').val(img.gradient.fromColor);
	$('#stopColor').val(img.gradient.stopColor);
	$('#toColor').val(img.gradient.toColor);
	$('#stopColorPercent').val(img.gradient.stopColorPercent);
	colorInput($('#fromColor'));
	colorInput($('#stopColor'));
	colorInput($('#toColor'));
	$("#input-slider").slider({
		value : parseInt($('#stopColorPercent').val()),
		range : "min",
		min : 1,
		max : 99,
		step : 1,
		slide : function(event, ui) {
			var per = parseInt(ui.value);
			$('#stopColorPercent').val(per);
			changed();
		}
	});
	if (img.gradient.isUseStopColor == 1) {
		$('#chkUseStopColor').prop('checked', true);
		$('.stopColorPanel').removeClass('hide');
	}
	if (img.type != 'gradient') {
		$('#panelPic').removeClass('hide');
		$('#panelGradient').addClass('hide');
		$('input[value="pic"]').prop('checked', true);
	} else {
		$('#panelPic').addClass('hide');
		$('#panelGradient').removeClass('hide');
		$('input[value="gradient"]').prop('checked', true);
	}
	$('input').change(function() {
		changed();
	})
	$('select').change(function() {
		changed();
	})
	changed();
}

var changeImage = function(imgurl) {
	$("#bgPicUrl").val(imgurl);
	changed();
}

function changed() {
	var obj = {};
	obj.type = $('input[value="pic"]').prop('checked') ? 'pic' : 'gradient';
	obj.pic = getPicObj();
	obj.gradient = getGradientObj();
	var str = getBackground(obj);
	$('.image-box').data('data', JSON.stringify(obj));
	$('.image-box').data('cssText', str.replace(new RegExp(site.config.resourecePath,"gm"), ""));
	$('.image-box')[0].style.cssText = str;
}

function getPicObj() {
	pic = {
		url : $('#bgPicUrl').val(),
		size : $('#selbgsizerepeat').val(),
		position : $('#selbgposition').val(),
	}
	if (pic.url == "")
		pic = null;
	return pic;
}

function getGradientObj() {
	var gradient = {
        deg: $('#seldeg').val(),
        isUseStopColor: isUseStopColor() ? 1 : 0,
        fromColor: $("#fromColor").val(),
        stopColor: $("#stopColor").val(),
        toColor: $('#toColor').val(),
        stopColorPercent:$('#stopColorPercent').val()
    }
	return gradient;
}

function getBackground(obj) {
	var bg = ''; // -webkit-linear-gradient(270deg, #eee, #373A43 80%, #313540)
	if (obj == null)
		return bg;
	if (obj.type == 'pic' && obj.pic != null) {
		var pic = obj.pic;
		if (pic.url == null || pic.url == '') {
			return bg;
		}
		bg += 'background-image: url("' + site.config.resourecePath + pic.url + '");';
		if (pic.size != null && pic.size != '') {
			bg += getBackgroundSize(pic.size);
		}

		if (pic.position != null && pic.position != '') {
			bg += 'background-position:' + pic.position + ';';
		}
	} else if (obj.type == 'gradient' && obj.gradient != null) {
		var g = obj.gradient;
		bg = 'background-image: -webkit-linear-gradient(' + g.deg + 'deg,' + g.fromColor + ',' + getColorStopStr(g.stopColor) + g.toColor + ')';
	}
	return bg;
}

function getBackgroundSize(picsize) {
	var ret = '';
	switch (picsize) {
	case '原始':
		ret = 'background-size: auto; background-repeat: no-repeat;';
		break;
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
}

function getColorStopStr(stopColor) {
	if (stopColor == null || stopColor == "" || isUseStopColor() == 0)
		return "";
	var ret = stopColor + ' ' + $('#stopColorPercent').val() + '%,';
	return ret;
}

// 是否使用过渡色
function isUseStopColor() {
	return $('#chkUseStopColor').prop('checked');
}

function getReturn() {
	var data = $('.image-box').data('data');
	var cssText = $('.image-box').data('cssText');
	// if (data.type == 'pic' && obj.pic.url == "") {
	// top.bootbox.alert('请先上传背景图片。');
	// return false;
	// }
	var ret = {
		Data : data,
		CssText : cssText,
	};
	return ret;
}

$(function() {
	$('input[type="radio"]').change(function() {
		if ($('input[value="pic"]').prop('checked')) {
			$('#panelPic').removeClass('hide');
			$('#panelGradient').addClass('hide');
		} else {
			$('#panelPic').addClass('hide');
			$('#panelGradient').removeClass('hide');
		}
	});

	$('#chkUseStopColor').on('change', function() {
		if ($(this).prop('checked')) {
			$('.stopColorPanel').removeClass('hide');
		} else {
			$('.stopColorPanel').addClass('hide');
		}
		changed();
	});

	$('.selectpicker').selectpicker();
	site.BDWebUpload.imageService({
		"pickId": "#file_upload",
		"uploadSuccessCallback": function(file, data){
			// 保存成功返回方法
			if(data.success === true){
				changeImage(data.result[0].imageUrl);
			}
		},
		"uploadErrorCallback": function(){
			//保存失败返回方法
			console.info("uploadErrorCallback");
		}
	});
});
