$(document).ready(function() {
    var e = 1e3,
        t = "easeInOutCubic",
        n = {
            menu: !1,
            showNum: !1,
            style: "vim"
        };
    $(":input").placeholder();
    $(".mobile-menu-toggle").on("click", function(e) {
        e.preventDefault();
        $("header > nav").toggleClass("mobile-menu-open");
    });
    $("header > nav .signup").on("click", function() {
        $("header > nav").removeClass("mobile-menu-open");
    });
    $(".docs-nav").find('a[href$="' + location.pathname + '"]').parent().addClass("current-page");
    $('a[href^="#"]').not("[data-toggle]").on("click", function(n) {
        var s = $($(this).attr("href")),
            r = $("header").outerHeight();
        s.length && n.preventDefault();
        $("html, body").animate({
            scrollTop: s.offset().top - 1.4 * r
        }, e, t)
    });
    $('a[href="/signup"]').on("click", function(n) {
        var s = $("#signup-form"),
            r = $("header").outerHeight();
        s.length && (n.preventDefault(), $("html, body").animate({
            scrollTop: s.offset().top - 1.4 * r
        }, e, t, function() {
            s.find(":input:first").focus()
        }))
    });
    $("#signup-form").on("submit", function(e) {
        var t = $(this);
        e.preventDefault(), t.hasClass("form-busy") || (t.addClass("form-busy", !0).find(".signup-feedback").addClass("hidden"), $.ajax({
            url: t.attr("data-jsonp"),
            data: t.serialize(),
            dataType: "jsonp",
            jsonp: "signupResponse"
        }))
    });
    signupResponse = function(e) {
        var t = $("#signup-form"),
            n = t.find('input[name="name"]'),
            s = t.find('input[name="email"]'),
            r = t.find('input[name="password"]');
        t.removeClass("form-busy");
        if ("success" === e.status){
          location.href = "/signup-complete";
        } else {
          n.parent().toggleClass("has-error", $.inArray("name", e.invalid) > -1);
          s.parent().toggleClass("has-error", $.inArray("email", e.invalid) > -1);
          r.parent().toggleClass("has-error", $.inArray("password", e.invalid) > -1);
          t.find(".signup-feedback").text(e.feedback).removeClass("hidden").end().find(".has-error .form-control:first").focus();
        }
    };
    $("#contact-form").on("submit", function(e) {
        var t = $("#contact-form"),
            n = t.find(".feedback"),
            s = t.find('input[name="name"]'),
            r = t.find('input[name="email"]'),
            o = t.find('textarea[name="message"]');
        e.preventDefault();
        t.hasClass("form-busy") || t.addClass("form-busy", !0).find(".contact-feedback").addClass("hidden");
        $.post("/src/ajax/c2p.ajax.php", t.serialize(), function(e) {
            t.removeClass("form-busy");
            if ("success" === e.status){
              t.find(":input").prop("disabled", !0);
              n.removeClass("alert-danger hidden").addClass("alert-success").text(e.feedback);
            } else {
              s.parent().toggleClass("has-error", $.inArray("name", e.invalid) > -1);
              r.parent().toggleClass("has-error", $.inArray("email", e.invalid) > -1);
              o.parent().toggleClass("has-error", $.inArray("message", e.invalid) > -1);
              t.find(".has-error .form-control:first").focus();
              n.text(e.feedback).removeClass("alert-success hidden").addClass("alert-danger");
            }
        }, "json");
    })
});

