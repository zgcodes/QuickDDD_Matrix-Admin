/**
 * 作者：yujinjin9@126.com 
 * 时间：2015-09-28 
 * 依赖：jquery
 * 描述：站点页面表单工具类
 */
var site = site || {};
$(function () {
    site.form = {};

    //ajax form提交
    site.form.ajax = function (selector, options) {
        options = options || {};
        var _default = {
            method: 'POST'
        };
        $.extend(true, _default, options);

        var model = site.form.serializeObject(selector);
        _default.data = $.extend({}, options.data || {}, model);
        var submitButton = $(selector).find(":submit");
        submitButton.prop("disabled", true);
        return site.ajax(_default);
    };

    //序列化form里的表单
    site.form.serializeObject = function (form) {
        var _form = $(form);
        if (_form.length < 1) {
            return false;
        }
        var data = {};
        var lookup = data; //current reference of data
        var selector = ':input[type!="checkbox"][type!="radio"], input:checked';
        var parse = function () {
            if (this.disabled) {
                return;
            }
            var named = this.name.replace(/\[([^\]]+)?\]/g, ',$1').split(',');
            var cap = named.length - 1;
            var $el = $(this);
            if (named[0]) {
                for (var i = 0; i < cap; i++) {
                    lookup = lookup[named[i]] = lookup[named[i]] ||
                      ((named[i + 1] === "" || named[i + 1] === '0') ? [] : {});
                }
                if (lookup.length !== undefined) {
                    lookup.push($el.val());
                } else {
                    lookup[named[cap]] = $el.val();
                }
                lookup = data;
            }
        };
        _form.filter(selector).each(parse);
        _form.find(selector).each(parse);
        return data;
    };

});