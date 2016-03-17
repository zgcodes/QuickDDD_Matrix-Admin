/**
 * 作者：yujinjin9@126.com
 * 时间：2015-11-26
 * 描述：页面设置组件
 */
define(["api", "designerUtils", "render", "components", "template"], function (api, designerUtils, render, components, template) {
	var info = render.info, dom = render.dom;
    var PageSetting = {
        defaultData: {
            FWidgetCode: "PageSetting",
            FWidgetName: "页面设置",
            FData: {
            	FErase: {
            		IsOpen: false,
            		Image : ""
            	},
            	FDoor: {
            		IsOpen: false,
            		Image : ""
            	}
            },
            FStyle: {
                BgImage:"",
                BgColor: "",
                PagePadding: "0"
            }
        },
        validate: {
            //length: {
            //    type: "length",
            //    attr: function (data) {
            //        return data.BgImage == null || data.BgImage.FPicUrl == "" ? false : true;
            //    },
            //    tips: "请上传图片"
            //}
        },
        showWidgetTemplate: function () {
            return ['<section class="wPageSetting">',
                '<div class="message2">页面设置组件：用于设置页面属性，浏览时不会显示此行。</div>',
                '<style>',
                'body {',
                ' {@if (FStyle.BgImage.CssText)}$${FStyle.BgImage.CssText|csstext};{@/if}',  //输出CssText要用两个$$
                ' {@if (FStyle.BgColor)}background-color:${FStyle.BgColor};{@/if}',
                '}',
                '</style>',
                '{@if (FData && FData.FErase && FData.FErase.IsOpen == true && FData.FErase.Image)}<script>$(function(){require(["preview/erase"], function (erase) {erase.start("${FData.FErase.Image|picurl}?accessControl=mobile");});});</script>{@/if}',
                '{@if (FData && FData.FDoor && FData.FDoor.IsOpen == true && FData.FDoor.Image)}<script>$(function(){require(["preview/door"], function (door) {console.info(door);door({value:"${FData.FDoor.Image|picurl}"});});});</script>{@/if}',
                '</section>'].join("\n");
        },
        editWidgetTemplate: [
            '<div id="edit-block" class="edit-block container form-horizontal" style="min-height:100px;">',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">背景图：</label>',
            '        <div class="col-xs-4 controls">',
            '	        <div id="image-box" class="bgimg-box" title="点击此处设置背景图">',
            '	            <input class="bgimg-data" type="hidden" value="$${FStyle.BgImage.Data}" />',
            '	            <input class="bgimg-csstext" type="hidden" value="${FStyle.BgImage.CssText}" />',
            '            </div>',
            '	        <button class="bgimg-delbtn btn btn-default btn-sm hide">清除</button>',
            '        </div>',
            '        <div class="col-xs-5"><span class="help-block">点击前面框格设置背景图<br>建议图片尺寸为720*1280像素</span></div>',
            '    </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">背景颜色：</label>',
            '        <div class="col-xs-9 controls">',
            '	        <input class="form-control input-mini" id="bgcolor" readonly type="text" value="${FStyle.BgColor}" />',
            '        </div>',
            '    </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">擦除图：</label>',
            '        <div class="col-xs-4">',
            '	        <div class="imge-box-upload" title="点击此处设置擦除的背景图">',
            '	            <div style="width:90px;height:90px;"></div><input type="hidden" id="erase-image-input" data-tmpldata="PicUrl" value="{@if (FData && FData.FErase)}${FData.FErase.Image}{@/if}" />',
            '           </div>',
            '        </div>',
            '        <div class="col-xs-5"><label><input id="erase-is-open" class="ace padding_iseach" type="checkbox" {@if (FData && FData.FErase && FData.FErase.IsOpen == true)}checked{@/if}><span class="lbl">是否开启</span></label></div>',
            '    </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">帷幕拉开图：</label>',
            '        <div class="col-xs-4">',
            '	        <div class="imge-box-upload" title="点击此处设置帷幕拉开效果图">',
            '	            <div style="width:90px;height:90px;"></div><input type="hidden" id="door-image-input" data-tmpldata="PicUrl" value="{@if (FData && FData.FDoor)}${FData.FDoor.Image}{@/if}" />',
            '           </div>',
            '        </div>',
            '        <div class="col-xs-5"><label><input id="door-is-open" class="ace padding_iseach" type="checkbox" {@if (FData && FData.FDoor && FData.FDoor.IsOpen == true)}checked{@/if}><span class="lbl">是否开启</span></label></div>',
            '    </div>',
            '</div>'].join("\n"),

        returnWidgetEditData: function ($editNode) {
            data = {
                FWidgetCode: 'PageSetting',
                FWidgetId: $editNode.find("#edit-block").data("widget-id"),
                FData:{
                	FErase: {
                		IsOpen: $editNode.find("#erase-is-open").is(":checked"),
                		Image : $editNode.find("#erase-image-input").val()
                	},
                	FDoor: {
                		IsOpen: $editNode.find("#door-is-open").is(":checked"),
                		Image : $editNode.find("#door-image-input").val()
                	}
                },
                FStyle:{
                    BgImage: components.getBgImage('#image-box'),
                    BgColor: $('#bgcolor').val()
                    //PagePadding: $('#pagepadding').val(),
                }
            };
            return data;
        },
        // 做组件初始化事件绑定等
        initWidgetEditNode: function ($showNode, $editNode, data) {
            var $this = this;
            //设置背景图设置框的显示效果
            components.initBgImage('#image-box', $showNode, $editNode);
            components.colorInput($('#bgcolor'));
            //设置图片框点击上传
            components.initImageBox(".imge-box-upload", $showNode, $editNode);
            $editNode.find("#erase-is-open").on("click", function(events){
            	if(!$(this).prop("checked")){
            		$showNode.parents("body").find("canvas[data-type='CanvasErase']").remove();
            	}
            });
            $editNode.find("#door-is-open").on("click", function(events){
            	if(!$(this).prop("checked")){
            		$showNode.parents("body").find("#doorCss").remove();
            		$showNode.parents("body").find("#doorMask").remove();
            	}
            });
            //$('#pagepadding').wx_spinner({ min: 0, max: 100, step: 1, on_sides: false });
        }
    }
    return PageSetting;
});