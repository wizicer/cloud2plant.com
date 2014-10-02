function(e, t, $) {
    function n(e) {
        var t = {},
            n = /^jQuery\d+$/;
        return $.each(e.attributes, function(e, s) {
            s.specified && !n.test(s.name) && (t[s.name] = s.value)
        }), t
    }

    function s(e, t) {
        var n = this,
            s = $(n);
        if (n.value == s.attr("placeholder") && s.hasClass("placeholder"))
            if (s.data("placeholder-password")) {
                if (s = s.hide().next().show().attr("id", s.removeAttr("id").data("placeholder-id")), e === !0) return s[0].value = t;
                s.focus()
            } else n.value = "", s.removeClass("placeholder"), n == o() && n.select()
    }

    function r() {
        var e, t = this,
            r = $(t),
            o = this.id;
        if ("" == t.value) {
            if ("password" == t.type) {
                if (!r.data("placeholder-textinput")) {
                    try {
                        e = r.clone().attr({
                            type: "text"
                        })
                    } catch (i) {
                        e = $("<input>").attr($.extend(n(this), {
                            type: "text"
                        }))
                    }
                    e.removeAttr("name").data({
                        "placeholder-password": r,
                        "placeholder-id": o
                    }).bind("focus.placeholder", s), r.data({
                        "placeholder-textinput": e,
                        "placeholder-id": o
                    }).before(e)
                }
                r = r.removeAttr("id").hide().prev().attr("id", o).show()
            }
            r.addClass("placeholder"), r[0].value = r.attr("placeholder")
        } else r.removeClass("placeholder")
    }

    function o() {
        try {
            return t.activeElement
        } catch (e) {}
    }
    var i = "[object OperaMini]" == Object.prototype.toString.call(e.operamini),
        a = "placeholder" in t.createElement("input") && !i,
        l = "placeholder" in t.createElement("textarea") && !i,
        c = $.fn,
        h = $.valHooks,
        u = $.propHooks,
        p, d;
    a && l ? (d = c.placeholder = function() {
        return this
    }, d.input = d.textarea = !0) : (d = c.placeholder = function() {
        var e = this;
        return e.filter((a ? "textarea" : ":input") + "[placeholder]").not(".placeholder").bind({
            "focus.placeholder": s,
            "blur.placeholder": r
        }).data("placeholder-enabled", !0).trigger("blur.placeholder"), e
    }, d.input = a, d.textarea = l, p = {
        get: function(e) {
            var t = $(e),
                n = t.data("placeholder-password");
            return n ? n[0].value : t.data("placeholder-enabled") && t.hasClass("placeholder") ? "" : e.value
        },
        set: function(e, t) {
            var n = $(e),
                i = n.data("placeholder-password");
            return i ? i[0].value = t : n.data("placeholder-enabled") ? ("" == t ? (e.value = t, e != o() && r.call(e)) : n.hasClass("placeholder") ? s.call(e, !0, t) || (e.value = t) : e.value = t, n) : e.value = t
        }
    }, a || (h.input = p, u.value = p), l || (h.textarea = p, u.value = p), $(function() {
        $(t).delegate("form", "submit.placeholder", function() {
            var e = $(".placeholder", this).each(s);
            setTimeout(function() {
                e.each(r)
            }, 10)
        })
    }), $(e).bind("beforeunload.placeholder", function() {
        $(".placeholder").each(function() {
            this.value = ""
        })
    }))
}(this, document, jQuery),

