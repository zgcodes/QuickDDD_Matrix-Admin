/**
 * 作者：yujinjin9@126.com 
 * 时间：2015-09-28 
 * 依赖：jquery
 * 描述：图片前端压缩
 * 
 * 处理流程（埋坑的地方）：
 * 1. 获取图片数据
 * 	先是获取图片数据，也就是监听input file的change事件，然后获取到上传的文件对象files，将类数组的files转成数组，然后进行forEach遍历。
 * 	接着判断文件类型，如果不是图片则不作处理。如果是图片就实例化一个filereader，以base64格式读取上传的文件数据，判断数据长度，
 * 	如果大于200KB的图片就调用compress方法进行压缩，否则调用upload方法进行上传。
 * 
 * 2.压缩图片
 * 	上面做完图片数据的获取后，就可以做compress压缩图片的方法了。而压缩图片也并不是直接把图片绘制到canvas再调用一下toDataURL就行的。
 * 	在IOS中，canvas绘制图片是有两个限制的：
 * 		首先是图片的大小，如果图片的大小超过两百万像素，图片也是无法绘制到canvas上的，调用drawImage的时候不会报错，但是你用toDataURL获取图片数据的时候获取到的是空的图片数据。
 * 		再者就是canvas的大小有限制，如果canvas的大小大于大概五百万像素（即宽高乘积）的时候，不仅图片画不出来，其他什么东西也都是画不出来的。
 * 	应对第一种限制，处理办法就是瓦片绘制了。瓦片绘制，也就是将图片分割成多块绘制到canvas上，我代码里的做法是把图片分割成100万像素一块的大小，再绘制到canvas上。
 * 	而应对第二种限制，我的处理办法是对图片的宽高进行适当压缩，我代码里为了保险起见，设的上限是四百万像素，如果图片大于四百万像素就压缩到小于四百万像素。四百万像素的图片应该够了，算起来宽高都有2000X2000了。
 * 如此一来就解决了IOS上的两种限制了。
 *	除了上面所述的限制，还有两个坑，一个就是canvas的toDataURL是只能压缩jpg的，当用户上传的图片是png的话，就需要转成 jpg，也就是统一用canvas.toDataURL("image/jpeg", 0.1) ， 类型统一设成jpeg，而压缩比就自己控制了。
 * 	另一个就是如果是png转jpg，绘制到canvas上的时候，canvas存在透明区域的话，当转成jpg的时候透明区域会变成黑色，因为 canvas的透明像素默认为rgba(0,0,0,0)，所以转成jpg就变成rgba(0,0,0,1)了，也就是透明背景会变成了黑色。解决办法就 是绘制之前在canvas上铺一层白色的底色。
 * 3.图片上传
 * 	完成图片压缩后，就可以塞进formdata里进行上传了，先将base64数据转成字符串，再实例化一个ArrayBuffer，然后将字符 串以8位整型的格式传入ArrayBuffer，再通过BlobBuilder或者Blob对象，将8位整型的ArrayBuffer转成二进制对象 blob，然后把blob对象append到formdata里，再通过ajax发送给后台即可。
 * 	XmlHttpRequest2中不仅可以发送大数据，还多出了比如获取发送进度的API，我代码里也进行了简单的实现。
 */
var site = site || {};
$(function() {
	site.imageCompress = {
		options: null,
		canvas: null, //用于压缩图片的canvas
		canvasContext: null,
		tileCanvas: null, // 瓦片canvas
		tileCanvasContext: null,
		
		init: function(opts){
			this.options = $.extend({
				fileSelector: "#imageFile",
				ajax: {
					type:'POST', // 请求方式
					data: null, // 发送到服务器的数据
			        url:null,  // 发送请求的地址
			        async: true, // 默认设置下，所有请求为异步请求
			        error: null, // 请求失败时将调用此方法
			        success: null, // 请求成功后回调函数
			        complete: null, // 请求完成后回调函数 (请求成功或失败时均调用)
			        uploadProgress: null, // 请求处理进度的函数
				},
				beforeUpload: null, // 加载之前函数
				compressComplete: null, //压缩完成函数调用
		        width:300, // 压缩到图片宽度
		        height:300, // 压缩到图片高度
		        quality: 1, //压缩质量，不压缩为1
		        maxSize: 100 // 大于该尺寸图片进行压缩（KB）
			}, opts);
			this.options.ajax.data = this.options.ajax.data || {};
			this.canvas = document.createElement("canvas");
			this.canvasContext = this.canvas.getContext('2d');
			this.tileCanvas = document.createElement("canvas");
			this.tileCanvasContext = this.tileCanvas.getContext('2d');
			this.changeEvent();
		},
		
		changeEvent: function(){
			//上传文件
			if(!this.options.fileSelector){
				return;
			}
			var _this = this;
			$(this.options.fileSelector).on("change", function(e){
				var files = Array.prototype.slice.call(this.files);
				for(var i=0, j = files.length; i < j; i++){
					_this.onload(files[i]);
				}
			});
		},
		
		onload: function(file){
			// 加载事件
			if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;
			if(this.options.beforeUpload && $.isFunction(this.options.beforeUpload)){
				this.options.beforeUpload(file);
			}
			var reader = new FileReader();
			var size = file.size;
			var _this = this, maxsize = this.options.maxSize || 100;
			reader.onload = function () {
                var result = this.result;
                var img = new Image();
                img.src = result;
                //如果图片大小小于100kb，则直接上传
                if (result.length <= maxsize * 1024) {
                    img = null;
                    _this.upload(result, file.type, file.name);
                    return;
                }
                // 图片加载完毕之后进行压缩，然后上传
                if (img.complete) {
                    callback();
                } else {
                    img.onload = callback;
                }
                function callback() {
                    var data = _this.compress(img);
                    _this.upload(data, file.type, file.name);
                    img = null;
                }
            }
			reader.readAsDataURL(file);
		},
		
		upload: function(basestr, type, fileName){
			// 图片上传，将base64的图片转成二进制对象，塞进formdata上传
			var text = window.atob(basestr.split(",")[1]);
	        var buffer = new Uint8Array(text.length);
	        var pecent = 0 , loop = null;
	        for (var i = 0; i < text.length; i++) {
	            buffer[i] = text.charCodeAt(i);
	        }
	        var blob = this.getBlob(buffer, type);
	        var name = $(this.options.fileSelector).attr("name") || "imagFile";
	        //this.options.ajax.data[name] = blob;
	        this.options.ajax.processFormData = function(formdata){
	        	console.info(fileName);
	        	formdata.append(name, blob, fileName||"_.jpg");
	        }
	        ajax(this.options.ajax);
		},
		
		compress: function(img){
			// 使用canvas对大图片进行压缩
			var initSize = img.src.length;
	        var width = img.width;
	        var height = img.height;
	        //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
	        var ratio;
	        if ((ratio = width * height / 4000000)>1) {
	            ratio = Math.sqrt(ratio);
	            width /= ratio;
	            height /= ratio;
	        }else {
	            ratio = 1;
	        }
	        this.canvas.width = width;
	        this.canvas.height = height;
	        // 铺底色
	        this.canvasContext.fillStyle = "#fff";
	        this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
	        //如果图片像素大于100万则使用瓦片绘制
	        var count;
	        if ((count = width * height / 1000000) > 1) {
	            count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片
	            // 计算每块瓦片的宽和高
	            var nw = ~~(width / count);
	            var nh = ~~(height / count);
	            this.tileCanvas.width = nw;
	            this.tileCanvas.height = nh;
	            for (var i = 0; i < count; i++) {
	                for (var j = 0; j < count; j++) {
	                    this.tileCanvasContext.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
	                    this.canvasContext.drawImage(this.tileCanvas, i * nw, j * nh, nw, nh);
	                }
	            }
	        } else {
	        	this.canvasContext.drawImage(img, 0, 0, width, height);
	        }
	        //进行最小压缩
	        var ndata = this.canvas.toDataURL('image/jpeg', this.getQuality(initSize));
	        console.info("压缩质量比例：" + this.getQuality(initSize))
	        console.log('压缩前：' + initSize);
	        console.log('压缩后：' + ndata.length);
	        console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
	        this.tileCanvas.width = this.tileCanvas.height = this.canvas.width = this.canvas.height = 0;
	        if(this.options.compressComplete && $.isFunction(this.options.compressComplete)){
				this.options.compressComplete(ndata);
			}
	        return ndata;
		},
		
		getQuality: function(realSize){
			var maxSize = this.options.maxSize;
			if(!maxSize){
				maxSize = 1024 * 100;
			} else {
				maxSize = 1024 * maxSize;
			}
			// 动态获取图片的质量，根据实际图片的大小和指定最大尺寸的比例
			if(maxSize > realSize){
				return 1;
			} else {
				return parseFloat((maxSize/realSize).toFixed(2));
			}
		},
		
		getBlob: function(buffer, format){
			// 获取blob对象的兼容性写法
			var Builder = window.WebKitBlobBuilder || window.MozBlobBuilder;
	        if(Builder){
	            var builder = new Builder;
	            builder.append(buffer);
	            return builder.getBlob(format);
	        } else {
	            return new window.Blob([ buffer ], {type: format});
	        }
		}
	}
});