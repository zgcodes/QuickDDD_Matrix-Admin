/*******************************************************************************
 * 描述：自定义弹出框，优点：是灵活性高，只依赖于bootstrap.js。缺点是：成熟度不高只是一个简易版需要再深度的优化。BUG:重复弹出框没有做处理
 * 作者：金鱼 
 * 时间：2016-01-19
 ******************************************************************************/
var site = site || {};
$(function(){
	site.modal = function (options) {
        var modal_templ = ['<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">',
            '   <div class="modal-dialog">',
            '       <div class="modal-content">',
            '           <div class="modal-header">',
            '               <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
            '               <h4 class="modal-title">{0}</h4>',
            '           </div>',
            '           <div class="modal-body">{1}</div>',
            '       </div>',
            '   </div>',
            '</div>'].join("\n");
        var defaults = {
            title: "信息提示",
            message: null,
            button: [{ label: "确定", class: "btn-primary", callbackFun: function () { } },
                { label: "取消", class: "btn-default", callbackFun: function (dialog) { dialog.modal("hide"); } },
            ],
            showFunction: null
        }
        if (typeof (options) === "string") {
            defaults.message = options;
        } else if(typeof (options) === "object"){
            defaults = $.extend({}, defaults, options);
        }
        modal_templ = site.utils.format(modal_templ, defaults.title, defaults.message)
        var $templ = $(modal_templ);
        if (defaults.width) {
            $templ.children().css("width", defaults.width);
        }
        if (defaults.height) {
            $templ.children().css("height", defaults.height);
        }
        if (defaults.button) {
            var button_html = '<div class="modal-footer">';
            for (var i = 0, j = defaults.button.length; i < j; i++) {
                button_html += '<button data-index="' + i + '" type="button" class="btn ' + defaults.button[i].class + '">' + defaults.button[i].label + '</button>';
            }
            button_html += '</div>';
            $templ.children().children().append(button_html);
        }
        var $modal = $templ.modal({
            backdrop: true,
            keyboard: true,
            show: false
        });
        $modal.on('shown.layout', function () {
            var top = ($(window).height() - $modal.children().outerHeight()) / 2;
            if(top < 0){
                top = 0;
            }
            $modal.children().animate({"margin-top": top + "px"}, 300);
        });
        $modal.find(".modal-footer").find("button").on("click", function (event) {
            var index = $(this).attr("data-index");
            if (defaults.button[index].callbackFun && $.isFunction(defaults.button[index].callbackFun)) {
                defaults.button[index].callbackFun($modal);
            } else {
                $modal.modal('hide')
            }
        });
        $modal.on('show.bs.modal', function (events) {
            if (defaults.showFunction && $.isFunction(defaults.showFunction)) {
                defaults.showFunction($modal);
            }
            $modal.trigger('show.layout');
        });
        $modal.on('shown.bs.modal', function (events) {
            $modal.trigger('shown.layout');
        });
        $modal.modal("show");
        return $modal;
    }

    site.error = function (message, callbackFun) {
        var modal_templ = ['<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" style="z-index: 10000">',
            '   <div class="modal-dialog">',
            '       <div class="modal-content alert alert-danger">',
            '           <div class="modal-body"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><div><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' + message + '</div></div>',
            '       </div>',
            '   </div>',
            '</div>'].join("\n");
        var $templ = $(modal_templ);
        $templ.children().css({
            "width": "400px"
        });
        $templ.children().children().css({
            "minHeight": "120px",
            "padding": "0px"
        });
        var $modal = $templ.modal({
            backdrop: true,
            keyboard: true,
            show: false
        });
        $modal.on('shown.layout', function () {
            var top = ($(window).height() - $modal.children().outerHeight()) / 2;
            if (top < 0) {
                top = 0;
            }
            $modal.children().animate({ "margin-top": top + "px" }, 300);
        });
        $modal.on('shown.bs.modal', function (events) {
            $modal.trigger('shown.layout');
        });
        $modal.on('hidden.bs.modal', function (events) {
            if (callbackFun && $.isFunction(callbackFun)) {
                callbackFun($modal);
            }
        });
        $modal.modal("show");
        return $modal;
    }

    site.success = function (message, callbackFun) {
        var modal_templ = ['<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" style="z-index: 10000">',
            '   <div class="modal-dialog">',
            '       <div class="modal-content alert alert-success">',
            '           <div class="modal-body">',
            '               <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
            '               <div>',
            '                   <span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>' + message,
            '               </div>',
            '               <div class="text-right">1秒后自动关闭</div>',
            '           </div>',
            '       </div>',
            '   </div>',
            '</div>'].join("\n");
        var $templ = $(modal_templ);
        $templ.children().css({
            "width": "400px"
        });
        $templ.children().children().css({
            "minHeight": "120px",
            "padding": "0px"
        });
        var $modal = $templ.modal({
            backdrop: true,
            keyboard: true,
            show: false
        });
        $modal.on('shown.layout', function () {
            var top = ($(window).height() - $modal.children().outerHeight()) / 2;
            if (top < 0) {
                top = 0;
            }
            $modal.children().animate({ "margin-top": top + "px" }, 300);
        });
        $modal.on('shown.bs.modal', function (events) {
            $modal.trigger('shown.layout');
            setTimeout(function () {
                $modal.modal("hide");
            }, 1000);
        });
        $modal.on('hidden.bs.modal', function (events) {
            if (callbackFun && $.isFunction(callbackFun)) {
                callbackFun($modal);
            }
        });
        $modal.modal("show");
        return $modal;
    }
});