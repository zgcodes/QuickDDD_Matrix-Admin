/**
 * 整个页面图片擦除功能JS ----------------------------- 
 * 作者：金鱼 时间：2015-01-12 
 * 描述：这是别人写的东西，我做了一些改动，基本上只是重复利用--努力努力 ^-^||
 */
define(function() {
	var erase = {
		id : null, // 图形容器ID
		imgsrc : null, // 图片路径
		canvasContext : null, // 图形容器内容
		set_timeout_id : null, // 定时执行程序ID
		pageX : null,
		pageY : null,
		hastouch : null, // 是否触摸
		_canvas : null, //图形容器节点
		start : function(imgsrc) {
			console.info(erase);
			//验证是否是预览状态
			// 开始页面擦除效果
			if (!imgsrc) {
				return;
			}
			erase.imgsrc = imgsrc;
			erase.createCanvasElement();
			try {
				erase.canvasContext = document.getElementById(erase.id).getContext("2d");
			} catch (err) {
				console.log('error', err);
				console.log('error_message', "html5 canvas is not supported");
				return;
			}
			var image = new Image();
			image.crossOrigin = "anonymous";
			image.src = erase.imgsrc;
			image.onload = function() {
				erase.canvasContext.drawImage(image, 0, 0, document.getElementById(erase.id).width, document.getElementById(erase.id).height);
				// 图形容器修剪(通过修改globalCompositeOperation来达到擦除的效果)
				erase.canvasContext.lineCap = "round"; // 指定了线段应该带有一个半圆形的线帽，半圆的直径等于线段的宽度，并且线段在端点之外扩展了线段宽度的一半。
				erase.canvasContext.lineJoin = "round";
				erase.canvasContext.lineWidth = 60;
				erase.canvasContext.globalCompositeOperation = "destination-out";
				erase.addElementEvent();
			}
		},

		createCanvasElement : function() {
			document.body.style.padding = "0";
			document.body.style.margin = "0";
			document.body.style.backfaceVisibility = "hidden";// 定义BODY元素在不面对屏幕时隐藏
			document.body.style.overflow = "hidden";
			//先判断页面是不是已经有了擦除图特效了
			if(erase.id){
				erase.destroy();
			}
			// 创建图形容器元素
			erase.id = new Date().getTime() + "CanvasErase";
			var _canvas = document.createElement("canvas");
			_canvas.id = erase.id;
			_canvas.style.width = "100%";
			_canvas.style.height = "100%";
			_canvas.style.position = "fixed";
			_canvas.style.top = "0";
			_canvas.style.left = "0";
			_canvas.style.margin = "0";
			_canvas.style.opacity = "1";
			_canvas.style.WebkitTransition = "opacity .5s";
			_canvas.style.MsTransition = "opacity .5s";
			_canvas.style.MozTransition = "opacity .5s";
			_canvas.style.zIndex = "9999";
			_canvas.setAttribute('data-type', 'CanvasErase');
			document.body.appendChild(_canvas);
			_canvas.width = document.documentElement.clientWidth;
			_canvas.height = document.documentElement.clientHeight;
			erase._canvas = _canvas;
		},

		addElementEvent : function() {
			// 添加事件
			erase.hastouch = "ontouchstart" in window ? true : false; // 是否触摸
			var movestart = erase.hastouch ? "touchstart" : "mousedown"; // 移动开始
			var moving = erase.hastouch ? "touchmove" : "mousemove"; // 移动中
			var moveend = erase.hastouch ? "touchend" : "mouseup"; // 移动结束
			document.getElementById(erase.id).addEventListener(movestart, function(e) {
				clearTimeout(erase.set_timeout_id);
				e.preventDefault();
				erase.moveStart(e);
				document.getElementById(erase.id).addEventListener(moving, erase.moveHandler);
				document.getElementById(erase.id).addEventListener(moveend, function(e) {
					document.getElementById(erase.id).removeEventListener(moving, erase.moveHandler);
					erase.moveEnd();
				});
			});
		},

		moveStart : function(e) {
			erase.pageX = erase.hastouch ? e.targetTouches[0].pageX : e.clientX - document.getElementById(erase.id).offsetLeft;
			erase.pageY = erase.hastouch ? e.targetTouches[0].pageY : e.clientY - document.getElementById(erase.id).offsetTop;
			erase.canvasContext.save();
			erase.canvasContext.beginPath()
			erase.canvasContext.arc(erase.pageX, erase.pageY, 1, 0, 2 * Math.PI);
			erase.canvasContext.fill();
			erase.canvasContext.restore();
		},

		moveHandler : function(e) {
			clearTimeout(erase.set_timeout_id);
			e.preventDefault();
			// 移除图形处理
			var x = erase.hastouch ? e.targetTouches[0].pageX : e.clientX - document.getElementById(erase.id).offsetLeft;
			var y = erase.hastouch ? e.targetTouches[0].pageY : e.clientY - document.getElementById(erase.id).offsetTop;
			erase.canvasContext.save();
			erase.canvasContext.moveTo(erase.pageX, erase.pageY);
			erase.canvasContext.lineTo(x, y);
			erase.canvasContext.stroke();
			erase.canvasContext.restore();
			erase.pageX = x;
			erase.pageY = y;
		},

		moveEnd : function() {
			// 移动结束
			erase.set_timeout_id = setTimeout(function() {
				if(!document.getElementById(erase.id)){
					return;
				}
				var imgData = null;
				try {
					imgData = erase.canvasContext.getImageData(0, 0, document.getElementById(erase.id).width, document.getElementById(erase.id).height);
				} catch (e) {
					console.info(erase.id, document.getElementById(erase.id));
					console.log('error', e);
					return;
				}
				var a = 0;
				var interval_time = 30;
				for ( var x = 0; x < imgData.width; x += interval_time) {
					for ( var y = 0; y < imgData.height; y += interval_time) {
						var i = (y * imgData.width + x) * 4;
						if (imgData.data[i + 3] > 0) {
							a++
						}
					}
				}
				if (a / (imgData.width * imgData.height / (interval_time * interval_time)) < 0.4) {
					if(erase._canvas){
						document.getElementById(erase.id).parentNode.removeChild(erase._canvas);
						erase._canvas = null;
					}
				}
			}, 100);
		},
		
		destroy: function(){
			// 销毁
			if(erase.id && document.getElementById(erase.id)){
				clearTimeout(erase.set_timeout_id);
				document.getElementById(erase.id).parentNode.removeChild(erase._canvas);
			}
		}
	};
	return erase;
});