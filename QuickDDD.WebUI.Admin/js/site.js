/**
 * 作者：yujinjin9@126.com 
 * 时间：2015-09-28 
 * 描述：站点页面初始化配置
 */
var site = site || {};
$(function () {
    //站点配置
    site.config = {};
    //项目相对路径
    site.config.contextPath = "";
    //项目全路径
    site.config.projectPath = "http://localhost:8080";
    //资源路径
    site.config.resourecePath = "http://192.168.0.100:92";
    //上传资源服务接口
    site.config.uploadPath = "http://192.168.0.100:92/Uploader"; 
    //项目版本
    site.config.version = "0.01";

    //页面初始化
    site.init = function () {
        site.initEvent();
    }

    // ajax请求
    site.ajax = function (options) {
        site.showPreloader();
        var _defalut = {
            type: "POST",
            dataType: "json",
            data: {},
            cache: false,
            contentType: false,
            processData: true,
            error: function (xhr, errorType, error) {
                console.info(xhr, errorType, error);
            },
            success: function (data, status, xhr) {
                console.info(data);
            },
            complete: function (xhr, status) {
                site.hidePreloader();
            },
        }
        $.extend(true, _defalut, options);
        if (_defalut.complete && $.isFunction(_defalut.complete)) {
            var _fun = _defalut.complete;
            _defalut.complete = function (xhr, status) {
                site.hidePreloader();
                _fun(xhr, status);
            }
        } else {
            defaults.complete = function (xhr, status) {
                site.hidePreloader();
            }
        }
        return $.ajax(options);
    }

    //显示提示加载框
    site.showPreloader = function (msg) {

    }

    //隐藏提示加载框
    site.hidePreloader = function () {

    }

    //初始化页面事件
    site.initEvent = function () {
        if ($.fn.tooltip) {
            $("body").tooltip({ selector: "[data-toggle='tooltip']", container: 'body', animation: false });
        }
    }

    //在弹出窗口中调用此方法关闭自身窗口，并调用回调方法返回参数值
    site.closeDialog = function (args) {
        if (window.modalDialog != null && window.modalDialog.options != null) {
            var dialog = window.modalDialog;
            if ($.isFunction(dialog.options.callback)) {
                dialog.options.callback(args);
            }
            window.modalDialog.close();
        }
    };



    site.init();

    /*表单页底部“取消”按钮 czg*/
    $(".wx-form-footer #btn-cancel").click(function () {
        if (window == top.frames["main"]) {
            //在主窗口中
            window.history.go(-1);
        }
        else {
            //在弹出窗口中关闭自己
            if (window.modalDialog != null) {
                window.modalDialog.close();
            }
        }
    });

});