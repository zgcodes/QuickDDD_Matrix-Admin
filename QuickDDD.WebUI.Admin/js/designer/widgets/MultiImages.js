/**
 * 作者：yujinjin9@126.com
 * 时间：2015-10-25
 * 描述：设计器的幻灯片组件
 */
define(["api", "designerUtils", "render", "components", "template"], function (api, designerUtils, render, components, template) {
    var info = render.info;
    var dom = render.dom;
    var MultiImages = {
        defaultData: {
            FWidgetCode: 'MultiImages',
            FWidgetName: "幻灯片组件",
            FData: {
                FImages: []
            },
            FStyle: {
                BgImage: "",
                BgColor: "",
                Margin: 0,
                BoxShadow: "",
                ShowHtmlEditor: "",
                CssHtml: ""
            }

        },
        validate: {
            Title: {
                type: "text",
                attr: "[0,20]",
                tips: "请输入0-20个字的标题"
            },
            length: {
                type: "length",
                attr: function (e) {
                    return e.FData.Images != null && e.FData.Images.length >= 1;
                },
                tips: "至少上传一张图片"
            }
        },
        showWidgetTemplate: function () {
            return ['<section class="wMultiImages ${FWidgetId}">',
            '<style>',
            'section.wMultiImages.${FWidgetId} {',
            '  padding: ${FStyle.Margin|padding};',
            '}',
            'section.wMultiImages.${FWidgetId} .wx-carousel-container {',
            '  {@if (FStyle.BoxShadow)}box-shadow: ${FStyle.BoxShadow};-webkit-box-shadow:${FStyle.BoxShadow};{@/if}',
            '}',
            '$${FStyle.CssHtml}',
            '</style>',
             '{@if count == 0}<div class="message">幻灯片组件：请添加图片。</div>{@else}',
             '<div class="wx-carousel-container"><div class="box_swipe"><ul>',
             "{@each FData.Images as Image, index}",
             '<li><a {@if (Image.LinkUrl != "")}href="${Image.LinkUrl}"{@/if}><img src="${Image.PicUrl|picurl}" style="width:100%" /></a><div class="title">&nbsp;$${Image.Title}</div></li>',
             "{@/each}",
             "</ul><ol>",
             "{@each FData.Images as Image, index}",
             '<li {@if index==0}class="on"{@/if}></li>',
             "{@/each}",
             "</ol></div></div>",
             "{@/if}",
             '<script type="text/javascript">',
             '	$(function(){',
             '		require(["preview/swipe"], function () {',
             '			new Swipe($(".${FWidgetId}").find(".box_swipe")[0], {',
             '				speed: 500,auto: 3000,continuous: true,',
             '				callback: function () {var lis = $(this.element).next("ol").children();lis.removeClass("on").eq(this.index).addClass("on");}',
             '			});',
             '		});',
             '	});',
             '</script>',
             "</section>"].join("\n")
        },
        editWidgetTemplate: ['<div id="edit-block" class="edit-block container" data-widget-id="${FWidgetId}" style="min-height:100px;">',
			        '     <label>单个列表组件最多可设置20个列表项</label>',
                    '     <div class="numhint help-block"></div>',
                    '    {@if count > 0}',
                    '    {@each FData.Images as Image}',
                    '    <dl class="edit-block-row sortable">',
                    '        <dt class="delete-btn" title="删除"></dt>',
                    '        <dd class="row">',
                    '            <div class="col-xs-3" style="width:105px">',
                    '                <div class="image-box" title="点击此处上传图片"><div style="width:90px;height:90px;"></div><input type="hidden" data-tmpldata="PicUrl" value="${Image.PicUrl}" /></div>',
                    '            </div>',
                    '            <div class="col-xs-8">',
                    '                <div class="form-group">',
                    '                    <label>图片标题：</label><span class="help-inline">（限20个字）</span>',
                    '                    <div class="controls">',
                    '                        <input class="form-control" type="text" maxlength="20" name="Title" data-tmpldata="Title" value="$${Image.Title}" placeholder="请输入标题">',
                    '                    </div>',
                    '                </div>',
                    '                <div class="form-group">',
                    '                    <label>图片链接：</label><span class="help-inline">（点击下框进行设置）</span>',
                    '                    <div class="controls outlink">',
                    '                        <input class="form-control link-src" type="text" readonly data-tmpldata="LinkDisplay" value="${Image.LinkDisplay}">',
                    '                        <input type="hidden" data-tmpldata="LinkSrc" value="${Image.LinkSrc}">',
                    '                        <input type="hidden" data-tmpldata="LinkUrl" value="${Image.LinkUrl}">',
                    '                    </div>',
                    '                </div>',
                    '            </div>',
                    '        </dd>',
                    '    </dl>',
                    '    {@/each}',
                    '    {@/if}',
                    '     <div style="margin-bottom:10px;">',
                    '     <div class="numhint help-block"></div>',
                    '     <div class="help-block">建议图片宽度为720像素，200K以下JPG、PNG格式</div>',
                    '     <div id="file_upload"><button class="file_upload_btn btn btn-default"><i class="icon-plus"></i>上传图片</button></div>',
                    '     </div>',
                    '</div>'].join("\n"),
        styleWidgetTemplate: [
            '<div id="style-block" class="form-horizontal container style-block">',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">外边距：</label>',
            '        <div class="col-xs-9" id="margin">',
            '        </div>',
            '    </div>',
            '    <div class="form-group">',
            '        <label class="col-xs-3 control-label">阴影：</label>',
            '        <div class="col-xs-4 controls">',
            '            <select class="form-control input-xsmall" id="box_shadow" data-selected="${FStyle.BoxShadow}">',
            '<option value="">无</option>',
            '<option value="1px 1px 4px #999">浅</option>',
            '<option value="1px 1px 5px #666">中</option>',
            '<option value="1px 1px 5px #333">深</option>',
            '            </select>',
            '        </div>',
            '        <div class="col-xs-5"><span class="help-block">（需设置外边距才有效果）</span></div>',
            '    </div>',
            '   <div class="edit-block-split"></div>',
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

        preRenderWidget: function (data) {
            data.count = data.FData.Images == null ? 0 : data.FData.Images.length;
            return data;
        },
        initWidgetShowNode: function (e) {
//        	require(["preview/swipe"], function () {
//	            new Swipe(e.find('.box_swipe')[0], {
//	                speed: 500,
//	                auto: 3000,
//	                callback: function () {
//	                    var lis = $(this.element).next("ol").children();
//	                    lis.removeClass("on").eq(this.index).addClass("on");
//	                }
//	            });
//        	});
            //e.find("section.wMultiImages > div").carousel()
        },
        // 做组件初始化事件绑定等
        initWidgetEditNode: function ($showNode, $editNode, data) {
            var $this = this;
            $editNode.find(".delete-btn").click(function () {
                $removeNode = $(this).parent(".edit-block-row"),
                designer.confirm("您确定删除此图片吗？", $this.removeImage, { args: $removeNode })
            }),
            $editNode.sortable({
                items: ".sortable",
                axis: "y",
                distance: 5,
                stop: function () {
                    var e = dom.getShowNode();
                    e.trigger("refresh")
                }
            });
            var limitObjs = [];
            $.each(dom.getEditNode().find('input[data-tmpldata="Title"]'), function (i, ele) {
                limitObj = {};
                limitObj.limitEle = $(ele);
                limitObj.tipsEle = $(ele).closest('.form-group').find(".help-inline");
                limitObj.wordMax = 20;
                limitObjs.push(limitObj);
            })

            //剩余字数提示
            designerUtils.wordLimitTips({
                limitObj: limitObjs
            });
            //设置链接
            components.initOutLink(".outlink", $showNode, $editNode);
            //设置图片框点击上传
            components.initImageBox(".image-box", $showNode, $editNode);
            //重置图片上传按钮的可用状态
            this.refreshUploadButton();
            //------------初始化样式设置控件状态-------------------------
            var $stylePanel = dom.getStylePanel();
            $stylePanel.find("#box_shadow").val(data.FStyle.BoxShadow);
            //外边距
            components.initPadding('#margin', $showNode, $editNode, data.FStyle.Margin, { min: 0, max: 300, step: 1 });
            $("#showHtmlEditor").change(function () {
                $(".stylehtml").toggleClass('hide');
            })
        },
        returnWidgetEditData: function ($editNode) {
            var tmp = designerUtils.modelData($editNode, "Title PicUrl LinkDisplay LinkSrc LinkUrl", true),
            n = tmp.Title.length,
            data = {
                FWidgetCode: 'MultiImages',
                FWidgetId: $editNode.find("#edit-block").data("widget-id"),
                FData: {
                    Images: []
                },
                FStyle: {}
            };
            for (var i = 0; i < n; i++) {
                var Img = {
                    Title: tmp.Title[i],
                    PicUrl: tmp.PicUrl[i],
                    LinkDisplay: tmp.LinkDisplay[i],
                    LinkSrc: tmp.LinkSrc[i],
                    LinkUrl: tmp.LinkUrl[i]
                };
                data.FData.Images.push(Img);
            }
            var $stylePanel = dom.getStylePanel();
            data.FStyle = {
                Margin: designerUtils.getPadding('#margin'),
                BoxShadow: $("#box_shadow").val(),
                ShowHtmlEditor: $("#showHtmlEditor").prop('checked') ? 1 : 0,
                CssHtml: $("#txt_html").val()
            };
            return data;
        },
        authNumFilter: function () {
            return $editNode = dom.getEditNode(),
            $editNode.find('input[data-tmpldata="Title"]').length > 4 ? false : true
        },
        refreshUploadButton: function () {
            var maxnum = 6;
            var currnum = dom.getEditNode().find('input[data-tmpldata="Title"]').length;
            var allownum = maxnum - currnum;
            var str = '<div style="font-size:14px;"><strong>最多可上传 ' + maxnum + ' 张图片，已上传 ' + currnum + ' 张，还可上传 ' + allownum + ' 张</strong></div>';
            dom.getEditNode().find('.numhint').html(str);
            if(allownum == 0){
            	$("#file_upload").hide();
            	//$(".file_upload_btn").attr('disabled', 'disabled');
            } else {
            	$("#file_upload").show();
            	components.openUploadImg("#file_upload", this.addImage);
            	//$(".file_upload_btn").removeAttr('disabled');
            }
            if (currnum < 3) dom.getEditNode().find('.numhint:last').hide();
        },
        addImage: function (imgurl) {
            $editNode = dom.getEditNode();
            t = ['<input type="hidden" data-tmpldata="Title" value="${Title}"/>', '<input type="hidden" data-tmpldata="PicUrl" value="${PicUrl}"/>', '<input type="hidden" data-tmpldata="LinkDisplay" value="${LinkDisplay}"/>', '<input type="hidden" data-tmpldata="LinkSrc" value="${LinkSrc}"/>', '<input type="hidden" data-tmpldata="LinkUrl" value="${LinkUrl}"/>'].join("\n"),
            n = {
                Title: "",
                PicUrl: imgurl,
                LinkDisplay: "",
                LinkSrc: "",
                LinkUrl: ""
            },
            r = template.render(t, n);
            $editNode.find("#edit-block").append(r);
            var e = dom.getShowNode();
            e.trigger("refresh");
            e.trigger("refreshEdit");
        },
        removeImage: function (result, e) {
            if (!result) return;
            var t = this;
            e.remove();
            var n = dom.getShowNode();
            n.trigger("refresh");
            //重置图片上传按钮的可用状态
            MultiImages.refreshUploadButton();
        },
        clearSelect: function (e) {
            $(e).prev().val(0)
        }
    }
    return MultiImages;
});