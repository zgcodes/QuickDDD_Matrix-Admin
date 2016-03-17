/* author：mien 614573519@qq.com*/
define('widgets/ShareButton', function (require, exports, module) {
    var WX_Utils = require('utils');
    var WX_Info = require('info');
    var WX_Dom = require('dom');
    var WX_Components = require('components');
    var WX_Validation = require('validation');

    var WX_Widget = {};

    WX_Widget.ShareButton = {
        defaultData: {
            FWidgetCode: 'ShareButton',
            FWidgetName: '分享按钮组件',
            FData: {
            }
        },
        // 必须存在的key
        // 手机内显示模板
        showWidgetTemplate: function () {
            return [
			'<section class="wShareButton ${FWidgetId}">',
            '<div class="clearfix">',
            '   <div class="sharediv-1"><button class="sharebutton" onclick="$(\'.sharemask\').css(\'display\',\'block\');"><i class="micon-share-square-o"></i><span>发送给朋友</span></button></div>',
            '   <div class="sharediv-2"><button class="sharebutton" onclick="$(\'.sharemask\').css(\'display\',\'block\');"><i class="micon-picassa"></i><span>分享到朋友圈</span></button></div>',
            '   <div class="sharemask" onclick="$(\'.sharemask\').css(\'display\',\'none\');"></div>',
            //'   <div class="sharediv-1"><button class="sharebutton" onclick="$(\'.sharemask\').css(\'display\',\'block\');"><img src="/images/icon_msg.png">&nbsp;发送给朋友</button></div>',
            //'   <div class="sharediv-2"><button class="sharebutton" onclick="$(\'.sharemask\').css(\'display\',\'block\');"><img src="/images/icon_timeline.png">&nbsp;分享到朋友圈</button></div>',
            //'   <div class="sharemask" onclick="$(\'.sharemask\').css(\'display\',\'none\');"><img src="/images/guide.png"></div>',
            '</div>',
            '</section>'
            ].join("\n");
        },
        // 属性框模板
        editWidgetTemplate: [
            '<div id="edit-block" class="edit-block container" data-widget-id="${FWidgetId}" style="min-height:100px;">',
            '</div>'].join("\n"),
        initWidgetShowNode: function ($showNode) {

        },
        // 做组件初始化事件绑定等
        initWidgetEditNode: function ($showNode, $editNode, data) {
            var $this = this;
        },
        // 返回提交数据时 组件数据json
        returnWidgetEditData: function ($editNode) {
            var data = {
                FData: {
                }
            };
            return data;
        }
    };

    module.exports = WX_Widget.ShareButton;
});




