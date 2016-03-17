/**
 * 首页开门特效图
 * 作者：金鱼 时间：2015-01-12 
 * 描述：这是别人写的东西，我做了一些改动，基本上只是重复利用--努力努力 ^-^||
 */
define(function() {
	function Door(opts) {
		$.extend(true, Door.defaultSet, opts);
		this.init();
	}
	Door.prototype = {
		init: function() {
			var _this = this;
			if($('#doorCss').length > 0){
				$('#doorCss').remove();
				$('#doorMask').remove();
			}
			//通过页面数据获取相关参数 
			var picUrl = '';
			if (Door.defaultSet.value) {
				if (Door.defaultSet.value[0] == '#') { //颜色值
					var _color = Door.defaultSet.value;
					if (Door.defaultSet.type == 'w') {
						_this.createPicW('color', _color);
					} else {
						_this.createPicH('color', _color);
					}
				} else { //图片
					picUrl = Door.defaultSet.value;
					if (Door.defaultSet.type == 'w') {
						_this.createPicW('pic', picUrl);
					} else {
						_this.createPicH('pic', picUrl);
					}
					//_this.getImgSize(Door.defaultSet.type, picUrl);
				}
			} else {
				if ($('#wDoor').size()) {
					$('#wDoor').remove();
				}
				return false;
			}
		},
		createPicH: function(sty, page) {
			var _this = this;
			var winWidth = $(window).width(),
				winHeight = $(window).height();
			var cssStr = '<style id="doorCss">' +
				'#doorMask{width:100%; height:100%; overflow:hidden; position:fixed; z-index:999999999; left:0; top:0;}' +
				'.door{width:100%; height:100%; overflow:hidden; position:absolute; left:0; top:0;}' +
				'.doorLeft{width:100%; height:100%; overflow:hidden; position:absolute; left:-50%; top:0; -webkit-transform : rotateY(0deg); -webkit-transition : -webkit-transform 1s ease-in;}' +
				'.doorRight{width:100%; height:100%; overflow:hidden; position:absolute; left:50%; top:0; -webkit-transform : rotateY(0deg); -webkit-transition : -webkit-transform 1s ease-in;}' +
				'</style>';
			if (sty == 'color') {
				var strCon = '<div class="doorLeft" style="background:' + page + '; opacity:0.7;"></div><div class="doorRight" style=" background:' + page + '; opacity:0.7;"></div>';
			} else {
				var harfWidth = winWidth / 2;
				var strCon = '<div class="door"><img style="position:absolute; left:0; top:0;" src="' + page + '" width="100%" height="100%" /></div><div class="doorLeft"><img style="position:absolute; left:50%; top:0;" src="' + page + '" width="100%" height="100%" /></div><div class="doorRight"><img style="position:absolute; left:-50%; top:0;" src="' + page + '" width="100%" height="100%" /></div>';
			}
			var str = cssStr + '<div id="doorMask">' + strCon + '</div>';
			$('body').prepend(str);
			setTimeout(function() {
				if ($('#wDoor').size()) {
					$('#wDoor').remove();
				}
			}, 500);
			_this.openDoorH();
		},
		createPicW: function(sty, page) {
			var _this = this;
			var winWidth = $(window).width(),
				winHeight = $(window).height();
			var cssStr = '<style id="doorCss">' +
				'#doorMask{width:100%; height:100%; overflow:hidden; position:fixed; z-index:999999999; left:0; top:0;}' +
				'.door{width:100%; height:100%; overflow:hidden; position:absolute; left:0; top:0;}' +
				'.doorLeft{width:100%; height:100%; overflow:hidden; position:absolute; left:0; top:-50%; -webkit-transform : rotateX(0deg); -webkit-transition : -webkit-transform 1s ease-in;}' +
				'.doorRight{width:100%; height:100%; overflow:hidden; position:absolute; left:0; top:50%; -webkit-transform : rotateX(0deg); -webkit-transition : -webkit-transform 1s ease-in;}' +
				'</style>';
			if (sty == 'color') {
				var strCon = '<div class="doorLeft" style="background:' + page + '; opacity:0.7;"></div><div class="doorRight" style=" background:' + page + '; opacity:0.7;"></div>';
			} else {
				var harfHeight = winHeight / 2;
				var strCon = '<div class="door"><img style="position:absolute; left:0; top:0;" src="' + page + '" width="100%" height="100%" /></div><div class="doorLeft"><img style="position:absolute; left:0; top:50%;" src="' + page + '" width="100%" height="100%" /></div><div class="doorRight"><img style="position:absolute; left:0; top:-50%;" src="' + page + '" width="100%" height="100%" /></div>';
			}
			var str = cssStr + '<div id="doorMask">' + strCon + '</div>';
			$('body').prepend(str);
			setTimeout(function() {
				if ($('#wDoor').size()) {
					$('#wDoor').remove();
				}
			}, 500);
			_this.openDoorW();
		},
		openDoorH: function() {
			var _this = this;
			$('#doorMask').one('click', function() {
				$('#doorMask .door').remove();
				$('#doorMask .doorLeft').css({
					'webkitTransform': 'rotateY(-90deg)'
				});
				$('#doorMask .doorRight').css({
					'webkitTransform': 'rotateY(-90deg)'
				});
				_this.removeDom();
			});
		},
		openDoorW: function() {
			var _this = this;
			$('#doorMask').one('click', function() {
				$('#doorMask .door').remove();
				$('#doorMask .doorLeft').css({
					'webkitTransform': 'rotateX(-90deg)'
				});
				$('#doorMask .doorRight').css({
					'webkitTransform': 'rotateX(-90deg)'
				});
				_this.removeDom();
			});
		},
		removeDom: function() {
			setTimeout(function() {
				$('#doorCss').remove();
				$('#doorMask').remove();
			}, 1000);
		}
	};
	Door.defaultSet = {
		value: "/images/door.jpg"
	};
	var door = function(opts) {
		new Door(opts);
	};
	return door;
});