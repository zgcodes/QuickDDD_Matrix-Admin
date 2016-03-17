/**
 * 作者：yujinjin9@126.com
 * 时间：2015-10-25
 * 描述：设计器的加减按钮
 */
(function ($) {
    var old = $.fn.spinner;

    // SPINNER CONSTRUCTOR AND PROTOTYPE

    var Spinner = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.spinner.defaults, options);
        this.$input = this.$element.find('.spinner-input');
        if (this.$input.length == 0)
            this.$input = this.$element;
        this.$element.on('keyup', this.$input, $.proxy(this.change, this));
        this.$element.on('keydown', this.$input, $.proxy(this.keydown, this));

        if (this.options.hold) {
            this.$element.on('mousedown', '.spinner-up', $.proxy(function () { this.startSpin(true); }, this));
            this.$element.on('mouseup', '.spinner-up, .spinner-down', $.proxy(this.stopSpin, this));
            this.$element.on('mouseout', '.spinner-up, .spinner-down', $.proxy(this.stopSpin, this));
            this.$element.on('mousedown', '.spinner-down', $.proxy(function () { this.startSpin(false); }, this));
        } else {
            this.$element.on('click', '.spinner-up', $.proxy(function () { this.step(true); }, this));
            this.$element.on('click', '.spinner-down', $.proxy(function () { this.step(false); }, this));
        }

        this.$element.find('.spinner-up, .spinner-down').attr('tabIndex', -1);

        this.switches = {
            count: 1,
            enabled: true
        };

        if (this.options.speed === 'medium') {
            this.switches.speed = 300;
        } else if (this.options.speed === 'fast') {
            this.switches.speed = 100;
        } else {
            this.switches.speed = 500;
        }

        this.lastValue = null;

        this.render();

        if (this.options.disabled) {
            this.disable();
        }
    };

    Spinner.prototype = {
        constructor: Spinner,

        render: function () {
            var inputValue = this.$input.val();

            if (inputValue) {
                this.value(inputValue);
            } else {
                this.$input.val(this.options.value);
            }

            this.$input.attr('maxlength', (this.options.max + '').split('').length);
        },

        change: function () {
            var newVal = this.$input.val();

            if (newVal / 1) {
                this.options.value = newVal / 1;
            } else {
                newVal = newVal.replace(/[^0-9]/g, '') || '';
                this.$input.val(newVal);
                this.options.value = newVal / 1;
            }

            this.triggerChangedEvent();
        },

        stopSpin: function () {
            if (this.switches.timeout !== undefined) {
                clearTimeout(this.switches.timeout);
                this.switches.count = 1;
                this.triggerChangedEvent();
            }
        },

        triggerChangedEvent: function () {
            var currentValue = this.value();
            if (currentValue === this.lastValue) return;

            this.lastValue = currentValue;

            // Primary changed event
            this.$element.trigger('changed', currentValue);

            // Undocumented, kept for backward compatibility
            this.$element.trigger('change');
        },

        startSpin: function (type) {

            if (!this.options.disabled) {
                var divisor = this.switches.count;

                if (divisor === 1) {
                    this.step(type);
                    divisor = 1;
                } else if (divisor < 3) {
                    divisor = 1.5;
                } else if (divisor < 8) {
                    divisor = 2.5;
                } else {
                    divisor = 4;
                }

                this.switches.timeout = setTimeout($.proxy(function () { this.iterator(type); }, this), this.switches.speed / divisor);
                this.switches.count++;
            }
        },

        iterator: function (type) {
            this.step(type);
            this.startSpin(type);
        },

        step: function (dir) {
            var curValue = this.options.value;
            var limValue = dir ? this.options.max : this.options.min;
            var digits, multiple;

            if ((dir ? curValue < limValue : curValue > limValue)) {
                var newVal = curValue + (dir ? 1 : -1) * this.options.step;

                if (this.options.step % 1 !== 0) {
                    digits = (this.options.step + '').split('.')[1].length;
                    multiple = Math.pow(10, digits);
                    newVal = Math.round(newVal * multiple) / multiple;
                }

                if (dir ? newVal > limValue : newVal < limValue) {
                    this.value(limValue);
                } else {
                    this.value(newVal);
                }
            } else if (this.options.cycle) {
                var cycleVal = dir ? this.options.min : this.options.max;
                this.value(cycleVal);
            }
        },

        value: function (value) {
            if (!isNaN(parseFloat(value)) && isFinite(value)) {
                value = parseFloat(value);
                this.options.value = value;
                this.$input.val(value);
                return this;
            } else {
                return this.options.value;
            }
        },

        disable: function () {
            this.options.disabled = true;
            this.$input.attr('disabled', '');
            this.$element.find('button').addClass('disabled');
        },

        enable: function () {
            this.options.disabled = false;
            this.$input.removeAttr("disabled");
            this.$element.find('button').removeClass('disabled');
        },

        keydown: function (event) {
            var keyCode = event.keyCode;

            if (keyCode === 38) {
                this.step(true);
            } else if (keyCode === 40) {
                this.step(false);
            }
        }
    };


    // SPINNER PLUGIN DEFINITION

    $.fn.spinner = function (option) {
        var args = Array.prototype.slice.call(arguments, 1);
        var methodReturn;

        var $set = this.each(function () {
            var $this = $(this);
            var data = $this.data('spinner');
            var options = typeof option === 'object' && option;

            if (!data) $this.data('spinner', (data = new Spinner(this, options)));
            if (typeof option === 'string') methodReturn = data[option].apply(data, args);
        });

        return (methodReturn === undefined) ? $set : methodReturn;
    };

    $.fn.spinner.defaults = {
        value: 1,
        min: 1,
        max: 999,
        step: 1,
        hold: true,
        speed: 'medium',
        disabled: false
    };

    $.fn.spinner.Constructor = Spinner;

    $.fn.spinner.noConflict = function () {
        $.fn.spinner = old;
        return this;
    };


    // SPINNER DATA-API

    $(function () {
        $('body').on('mousedown.spinner.data-api', '.spinner', function () {
            var $this = $(this);
            if ($this.data('spinner')) return;
            $this.spinner($this.data());
        });
    });
})(window.jQuery);

(function ($) {
    $.fn.wx_spinner = function (c) {
        //alert($('#maxorderperday').prop("outerHTML"));
        this.each(function () {
            //var f = c.icon_up || "icon-chevron-up";
            //var j = c.icon_down || "icon-chevron-down";
            //c.touch_spinner = c.touch_spinner || false;
            c.touch_spinner = true;
            var h = c.on_sides || false;
            var f, j;
            if (h) {
                f = c.icon_up || "glyphicon glyphicon-plus";
                j = c.icon_down || "glyphicon glyphicon-minus";
            }
            else
            {
                f = c.icon_up || "glyphicon glyphicon-plus";
                j = c.icon_down || "glyphicon glyphicon-minus";
                //f = c.icon_up || "icon-chevron-up";
                //j = c.icon_down || "icon-chevron-down";
            }
            var e = c.btn_up_class || "btn-default";
            var g = c.btn_down_class || "btn-default";
            var d = c.max || 999;
            d = ("" + d).length;
            $(this).addClass("spinner-input form-control").wrap('<div class="wx-spinner">');
            var k = $(this).closest(".wx-spinner").spinner(c).wrapInner("<div class='input-group'></div>");
            if (h) {
                $(this).before('<div class="spinner-buttons input-group-btn"><button type="button" class="btn spinner-down ' + g + '" title="减少" data-toggle="tooltip"><i class="' + j + '"></i></button></div>').after('<div class="spinner-buttons input-group-btn"><button type="button" class="btn spinner-up ' + e + '" title="增加" data-toggle="tooltip"><i class="' + f + '"></i></button></div>');
                k.addClass("touch-spinner");
                k.css("width", (d * 20 + 40) + "px")
            } else {
                $(this).after('<div class="spinner-buttons input-group-btn"><button type="button" class="btn spinner-up ' + e + '" title="增加" data-toggle="tooltip"><i class="' + f + '"></i></button><button type="button" class="btn spinner-down ' + g + '" title="减少" data-toggle="tooltip"><i class="' + j + '"></i></button></div>');
                if ("ontouchend" in document || c.touch_spinner) {
                    k.addClass("touch-spinner");
                    k.css("width", (d * 20 + 40) + "px")
                } else {
                    $(this).next().addClass("btn-group-vertical");
                    k.css("width", (d * 20 + 10) + "px")
                }
            }
            $(this).on("mousewheel DOMMouseScroll", function (l) {
                var m = l.originalEvent.detail < 0 || l.originalEvent.wheelDelta > 0 ? 1 : -1;
                k.spinner("step", m > 0);
                k.spinner("triggerChangedEvent");
                return false
            });
            var i = $(this);
            k.on("changed", function () {
                i.trigger("change")
            });
            this.spinner = k;
        });
        return this
    }
})(window.jQuery);