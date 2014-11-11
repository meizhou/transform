$(function() {
    var Transform = function(el) {
        this.$el = el;
        this.prop = {};
    }
    var propCss = {
        translate: 'px',
        rotate: 'deg',
        scale: '',
        skew: 'deg',
        perspective: 'px'
    };

    function isXYZ(key) {
        var lastCode = key.charAt(key.length - 1);
        if (lastCode == 'X' || lastCode == 'Y' || lastCode == 'Z') {
            return true;
        } else {
            return false;
        }
    };
    Transform.prototype = {
        _default: {
            duration: 1000,
            easing: 'ease'
        },
        init: function() {
            if (typeof(arguments[0]) == 'string') {
                this[arguments[0]].apply(this, arguments);
            } else {
                this.run.apply(this, arguments);
            };
        },
        run: function(properties, duration, easing, callback) {
            callback = (typeof(callback) === 'function') ? callback : (typeof(easing) === 'function' ? easing : (typeof(duration) === 'function' ? duration : function() {}))
            duration = (typeof(duration) == 'number') ? duration : this._default.duration;
            easing = (typeof(easing) != 'string') ? this._default.easing : easing;
            var $el = $(this.$el);
            var that = this;
            var _run = function(next) {
                $el.css('transition-duration', duration + 'ms').css('transition-timing-function', easing);
                that.setProperties(properties);
                window.setTimeout(function() {
                    $el.css('transition-delay', 0 + 'ms');
                    callback();
                    next();
                }, duration + (properties['delay'] ? properties['delay'] : 0))
            }
            $el.queue(_run);
        },
        setProperties: function(properties) {
            var that = this;
            $.each(properties, function(key, val) {
                if (key == 'delay') {
                    $(that.$el).css('transition-delay', val + 'ms');
                } else {
                    that.set(key, val);
                };
            });
            $(that.$el).css('transform', this.getTranCss());
        },
        set: function(key, val) {
            var tempArray = Array();
            if (typeof(val) === 'string') {
                tempArray = val.split(',');
            } else if (typeof(val) == 'number') {
                tempArray.push(val);
            };
            if (!isXYZ(key) && this.setter[key]) {
                this.setter[key].apply(this.prop, tempArray);
            } else {
                this.prop[key] = tempArray;
            };
        },
        getTranCss: function() {
            var that = this;
            var tranProp = Array();
            $.each(that.prop, function(key, propval) {
                tranProp.push(that.convertVal(key, propval));
            });
            console.log('当前的css3', tranProp.join(' '));
            return tranProp.join(' ');
        },
        convertVal: function(key, propval) {
            var newKey;
            if (isXYZ(key)) {
                newKey = key.slice(0, key.length - 1);
            } else {
                newKey = key;
            };
            if (propCss[newKey] === undefined) {
                if (key == 'transformOrigin') {};
                $(this.$el).css(key, propval);
                return '';
            } else {
                if (typeof(propval) == 'string') {
                    propval = propval.match(/^[0-9]+/).toString();
                }
                return key + '(' + propval + propCss[newKey] + ')';
            };
        },
        start: function() {
            var $el = $(this.$el);
            if (this.nowQueue) {
                $el.queue(this.nowQueue);
                $el.dequeue();
            };
        },
        stop: function() {
            var $el = $(this.$el);
            this.nowQueue = $el.queue();
            $el.css('transition-duration', '0ms')
                .css('transform', $el.css('transform')).clearQueue();
        },
        clear: function() {
            var that = this;
            var _run = function(next) {
                that.prop = {};
                next();
            }
            $(this.$el).queue(_run);
        },
        setter: {
            x: function(x) {
                this.translateX = x
            },
            y: function(y) {
                this.translateY = y
            },
            z: function(z) {
                this.translateZ = z
            },
            translate: function(x, y) {
                this.translateX = x;
                if (y) {
                    this.translateY = y;
                };
            },
            rotate: function(angle) {
                this.rotate = angle
            },
            scale: function(x, y) {
                if (!y) {
                    y = x;
                };
                this.scaleX = x;
                this.scaleY = y;
            },
            skew: function(xangle, yangle) {
                this.skewX = x;
                if (y) {
                    this.skewY = y;
                };
            },
            translate3d: function(x, y, z) {
                this.translateX = x;
                this.translateY = y ? y : 0;
                this.translateZ = z ? z : 0;
            },
            rotate3d: function(x, y, z, angle) {
                this.rotateX = x * angle;
                this.rotateY = y * angle;
                this.rotateZ = z * angle;
            },
            scale3d: function(x, y, z) {
                this.scaleX = x;
                this.scaleY = y ? y : x;
                this.scaleZ = z ? z : x;
            },
            perspective: function(px) {
                this.perspective = px;
            },
            origin: function(x, y) {
                !y ? y = 50 + '%' : y;
                /^[0-9]+$/g.test(x) ? x = x + 'px' : x;
                /^[0-9]+$/g.test(y) ? y = y + 'px' : y;
                this.transformOrigin = x + '' + y;
            }
        }
    };
    $.fn.transform = function(properties, duration, easing, callback) {
        return this.each(function(index, val) {
            var transform = $(this).data('mz-transform');
            if (!transform) {
                $(this).data('mz-transform', new Transform(this));
                transform = $(this).data('mz-transform');
            }
            transform.init(properties, duration, easing, callback);
        });
    }
})