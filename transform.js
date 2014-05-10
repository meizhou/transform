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
        perspective:'px'
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
        run: function(properties, duration, easing, callback) {
            callback = (typeof(callback) === 'function') ? callback : (typeof(easing) === 'function' ? easing : (typeof(duration) === 'function' ? duration : function() {}))
            duration = (typeof(duration) == 'number') ? duration : this._default.duration;
            easing = (typeof(easing) != 'string') ? this._default.easing : easing;
            var $this = $(this.$el);
            var that = this;
            var _run = function(next) {
                $this.css('transition-duration', duration + 'ms').css('transition-timing-function', easing);
                that.setProperties(properties);
                /*$this.on('transitionEnd transitionend oTransitionEnd webkitTransitionEnd MSTransitionEnd',function(){
                });*/
                window.setTimeout(function() {
                    callback();
                    next();
                }, duration)
            }
            $this.queue(_run);
        },
        setProperties: function(properties) {
            var that = this;
            $.each(properties, function(key, val) {
                if (key == 'delay') {
                    $(that.$el).css('transition-delay', val);
                } else {
                    that.set(key, val);
                };
            });
            $(this.$el).css('transform', this.getTranCss());
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
            $.each(this.prop, function(key, propval) {
                tranProp.push(that.convertVal(key, propval));
            });
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
                if (key=='transformOrigin') {
                };
                $(this.$el).css(key, propval);
                return '';
            } else {
                if (typeof(propval) == 'string') {
                    propval = propval.match(/^[0-9]+/).toString();
                }
                return key + '(' + propval + propCss[newKey] + ')';
            };
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

            },
            rotate3d: function(x, y, z, angle) {

            },
            scale3d: function(x, y, z) {

            },
            perspective: function(px) {
                this.perspective=px;
            },
            origin: function(x,y) {
                if (!y) {
                    y=50+'%';
                };
                if (/^[0-9]+$/g.test(x)) {
                    x=x+'px';
                };
                if (/^[0-9]+$/g.test(y)) {
                    y=y+'px';
                };
                this.transformOrigin=x+''+y;
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
            transform.run(properties, duration, easing, callback);
        });
    }
})