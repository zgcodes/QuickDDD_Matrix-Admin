/**
 * 页面左右滑动场景 ----------------------------- 作者：金鱼 时间：2015-01-15
 */
define("widgets/Scene", function(require, exports, module) {
	var WX_Utils = require('utils');
	var WX_Info = require('info');
	var WX_Dom = require('dom');
	var WX_Components = require('components');
	var WX_Validation = require('validation');

	var Scene = {
		defaultData : {
			FWidgetCode : "Scene",
			FWidgetName : "场景组件",
			FData : {
				FImages: [
//				{
//                	Bgimage:"",
//                	Contents:[{
//                		Text: "",//内容
//                        PicUrl: "",//图片
//                        LinkDisplay: "",
//                        LinkSrc: "",
//                        LinkUrl: ""
//                     }]
//                }
				]
			},
			FStyle: {
//				FImagesStyle:[{
//					ContentsStyle:[{
//						//动画特效
//                		Animation: "",
//                		//动画特效时间
//                		AnimationTime: "3s",
//                		Top: "0",
//                		Left: "0",
//                		Height: "0",
//                		Width: "0",
//                		Padding: "10",
//                		TextAlign: "center"
//					}]
//				}],
                CssHtml: ""
            }
		},

		validate : {
			Title: {
                type: "text",
                attr: "[0,20]",
                tips: "请输入0-20个字的标题"
            },
            length: {
                type: "length",
                attr: function (e) {
                    return e.FData.FImages != null && e.FData.FImages.length >= 1 && e.FData.FImages[e.FData.FImages.length-1].Bgimage;
                },
                tips: "请上传场景图片"
            }
		},
		// 显示组件信息
		showWidgetTemplate : function() {
			return [ '<section class="wScene ${FWidgetId}" style="min-height: 520px;">',
			'{@if count == 0}<div class="message">场景组件：请添加图片。</div>{@else}',
			'	<div class="u-arrow">',
			'		<p class="css_sprite01"></p>',
			'	</div>',       
			'	<div class="p-ct">',       
			'		<div class="translate-back f-hide">',
			'    	{@each FData.FImages as Image, index}',
			'		{@if (index == 0)}',
			'			<div class="m-page m-fengye active" data-page-type="info_pic3" data-statics="info_pic3">',
			'				<div class="page-con lazy-img" data-src="${Image.Bgimage}"></div>',
			'			</div>',
			'		{@else}',
			'			<div class="m-page m-fengye f-hide" data-page-type="info_pic3" data-statics="info_pic3">',
			'				<div class="page-con lazy-img" data-src="${Image.Bgimage}"></div>',
			'			</div>',
			'		{@/if}',
			'    	{@/each}',
			'		</div>',       
			'	</div>',       
			'	<script>$(function(){seajs.use("up-down-slide", function (up_down_slide) {up_down_slide.start();});});</script>',
            '{@/if}',
			'</section>' ].join("\n")
		},

		// 显示组件编辑栏
		editWidgetTemplate : [ 
		'<div id="edit-block" class="edit-block container" data-widget-id="${FWidgetId}" style="min-height:100px;">',
		'     <div class="numhint help-block"></div>',
		'    {@if count > 0}',
        '    {@each FData.FImages as Image}',
        '    <dl class="edit-block-row sortable">',
        '        <dt class="delete-btn" title="删除"></dt>',
        '        <dd class="row">',
        '            <div class="col-xs-3" style="width:105px">',
        '                <div class="image-box" title="点击此处上传图片"><div style="width:90px;height:90px;"></div><input type="hidden" data-tmpldata="Bgimage" value="${Image.Bgimage}" /></div>',
        '            </div>',
        '        </dd>',
        '    </dl>',
        '    {@/each}',
        '    {@/if}',
        '    <div style="margin-bottom:10px;">',
        '    <div class="numhint help-block"></div>',
        '    <div class="help-block">建议图片宽高比为3:5,如果比例严重会影响显示效果，200K以下JPG、PNG格式。<a style="color:red;">中间场景设计上下滑动效果会失真，请以预览为准。</a></div>',
        '    <div id="file_upload"><button class="file_upload_btn btn btn-default"><i class="icon-plus"></i>上传图片</button></div>',
		'</div>' ].join("\n"),

		// 显示组件样式栏
		styleWidgetTemplate : [ 
		'<div id="style-block" class="form-horizontal container style-block">',
		'	<div class="form-group">',
        '	    <label class="col-xs-3 control-label">其他选项：</label>',
        '	    <div class="col-xs-9 controls">',
        '	        <label><input id="showHtmlEditor" class="ace" type="checkbox" {@if (FStyle.ShowHtmlEditor=="1")}checked{@/if}  /><span class="lbl">显示高级扩展</span></label> (仅针对程序人员！)',
        '	    </div>',
        '	</div>',
        '	<div class="form-group stylehtml {@if (FStyle.ShowHtmlEditor!="1")}hide{@/if}">',
        '	    <div class="controls">',
        '	    <div class="red">请注意：如果在这里随意填写，将导致页面显示混乱！</div>',
        '	        <textarea id="txt_html" class="input-xxlarge" rows="15">{@if (FStyle.CssHtml=="")}/*section.wMultiImages.${FWidgetId} { }*/{@else}$${FStyle.CssHtml}{@/if}</textarea>',
        '	    </div>',
        '	</div>',
        '</div>'].join("\n"),

		preRenderWidget : function(data) {
			data.count = 'undefined' == typeof data.FData.FImages ? 0 : data.FData.FImages.length;
			return data;
		},
		
		// 返回组件的编辑数据
		returnWidgetEditData : function($editNode) {
			var tmp = WX_Utils.modelData($editNode, "Bgimage", true);
			var length = tmp.Bgimage.length;
			var data = {
				FWidgetCode : "Scene",
				FWidgetName : "场景组件",
				FData : {
					FImages: []
				},
				FStyle: {
					CssHtml: ""
				}
			};
			for(var i=0;i<length;i++){
				data.FData.FImages[i] = {
					Bgimage : tmp.Bgimage[i]
				}
			}
            data.FStyle = {
                CssHtml: $("#txt_html").val()
            };
			return data;
		},
		
		//初始化组件展示节点
		initWidgetShowNode: function (e) {
			
		},
		
		// 做组件初始化事件绑定等
		initWidgetEditNode : function($showNode, $editNode, data) {
			var $this = this;
			$this.refreshUploadButton();
			//重置图片上传按钮的可用状态
			WX_Components.openUploadImg("#file_upload", $this.addSceneImage);
			//设置图片框点击上传
            WX_Components.initImageBox(".image-box", $showNode, $editNode);
            
			$editNode.find(".delete-btn").click(function () {
                $removeNode = $(this).parent(".edit-block-row"),
                WX_Utils.confirm("您确定删除此场景图片吗？", $this.removeSceneImage, { args: $removeNode })
            });
            $editNode.sortable({
                items: ".sortable",
                axis: "y",
                distance: 5,
                stop: function () {
                    var e = WX_Dom.getShowNode();
                    e.trigger("refresh");
                }
            });
            
            $("#showHtmlEditor").change(function () {
                $(".stylehtml").toggleClass('hide');
            });
		},
		
		// 增加场景图片
		addSceneImage : function(imgurl){
			$editNode = WX_Dom.getEditNode();
            var t = ['<input type="hidden" data-tmpldata="Bgimage" value="${Bgimage}"/>'].join("\n");
            var n = {
            	Bgimage: imgurl
            }
            var r = WX_Utils.tmpl(t, n);
            //setTimeout(function () {
            $editNode.find("#edit-block").append(r);
            var e = WX_Dom.getShowNode();
            e.trigger("refresh");
            e.trigger("refreshEdit");
		},
		
		//删除场景图片
		removeSceneImage: function (result, e) {
            if (!result) return;
            var t = this;
            e.remove();
            var n = WX_Dom.getShowNode();
            n.trigger("refresh");
            //重置图片上传按钮的可用状态
            Scene.refreshUploadButton();
        },
        
        refreshUploadButton: function () {
            var maxnum = 15;
            var currnum = WX_Dom.getEditNode().find('input[data-tmpldata="Bgimage"]').length;
            var allownum = maxnum - currnum;
            var str = '<div style="font-size:14px;"><strong>最多可上传 ' + maxnum + ' 张图片，已上传 ' + currnum + ' 张，还可上传 ' + allownum + ' 张</strong></div>';
            WX_Dom.getEditNode().find('.numhint').html(str);
            if(allownum == 0){
            	$("#file_upload").hide();
            	//$(".file_upload_btn").attr('disabled', 'disabled');
            } else {
            	$("#file_upload").show();
            	WX_Components.openUploadImg("#file_upload", this.addImage);
            	//$(".file_upload_btn").removeAttr('disabled');
            }
            if (currnum < 3) WX_Dom.getEditNode().find('.numhint:last').hide();
        }
	};
	module.exports = Scene;
});
