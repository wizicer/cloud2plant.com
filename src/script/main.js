function snippetPopup(e) {
    top.consoleRef = window.open("", "myconsole", "width=600,height=300,left=50,top=50,menubar=0,toolbar=0,location=0,status=0,scrollbars=1,resizable=1"), top.consoleRef.document.writeln("<html><head><title>Snippet :: Code View :: " + location.href + '</title></head><body bgcolor=white onLoad="self.focus()"><pre>' + e + "</pre></body></html>"), top.consoleRef.document.close()
}

function sh_isEmailAddress(e) {
    return /^mailto:/.test(e) ? !1 : -1 !== e.indexOf("@")
}

function sh_setHref(e, t, n) {
    var s = n.substring(e[t - 2].pos, e[t - 1].pos);
    s.length >= 2 && "<" === s.charAt(0) && ">" === s.charAt(s.length - 1) && (s = s.substr(1, s.length - 2)), sh_isEmailAddress(s) && (s = "mailto:" + s), e[t - 2].node.href = s
}

function sh_konquerorExec(e) {
    var t = [""];
    return t.index = e.length, t.input = e, t
}

function sh_highlightString(e, t) {
    if (/Konqueror/.test(navigator.userAgent) && !t.konquered) {
        for (var n = 0; n < t.length; n++)
            for (var s = 0; s < t[n].length; s++) {
                var r = t[n][s][0];
                "$" === r.source && (r.exec = sh_konquerorExec)
            }
        t.konquered = !0
    }
    var o = document.createElement("a"),
        i = document.createElement("span"),
        a = [],
        l = 0,
        c = [],
        h = 0,
        u = null,
        p = function(t, n) {
            var s = t.length;
            if (0 !== s) {
                if (!n) {
                    var r = c.length;
                    if (0 !== r) {
                        var p = c[r - 1];
                        p[3] || (n = p[1])
                    }
                }
                if (u !== n && (u && (a[l++] = {
                    pos: h
                }, "sh_url" === u && sh_setHref(a, l, e)), n)) {
                    var d;
                    d = "sh_url" === n ? o.cloneNode(!1) : i.cloneNode(!1), d.className = n, a[l++] = {
                        node: d,
                        pos: h
                    }
                }
                h += s, u = n
            }
        },
        d = /\r\n|\r|\n/g;
    d.lastIndex = 0;
    for (var f = e.length; f > h;) {
        var g = h,
            m, _, y = d.exec(e);
        null === y ? (m = f, _ = f) : (m = y.index, _ = d.lastIndex);
        for (var v = e.substring(g, m), b = [];;) {
            var x = h - g,
                w, A = c.length;
            w = 0 === A ? 0 : c[A - 1][2];
            var E = t[w],
                C = E.length,
                T = b[w];
            T || (T = b[w] = []);
            for (var k = null, z = -1, Z = 0; C > Z; Z++) {
                var N;
                if (Z < T.length && (null === T[Z] || x <= T[Z].index)) N = T[Z];
                else {
                    var D = E[Z][0];
                    D.lastIndex = x, N = D.exec(v), T[Z] = N
                }
                if (null !== N && (null === k || N.index < k.index) && (k = N, z = Z, N.index === x)) break
            }
            if (null === k) {
                p(v.substring(x), null);
                break
            }
            k.index > x && p(v.substring(x, k.index), null);
            var S = E[z],
                L = S[1],
                O;
            if (L instanceof Array)
                for (var F = 0; F < L.length; F++) O = k[F + 1], p(O, L[F]);
            else O = k[0], p(O, L);
            switch (S[2]) {
                case -1:
                    break;
                case -2:
                    c.pop();
                    break;
                case -3:
                    c.length = 0;
                    break;
                default:
                    c.push(S)
            }
        }
        u && (a[l++] = {
            pos: h
        }, "sh_url" === u && sh_setHref(a, l, e), u = null), h = _
    }
    return a
}

function sh_getClasses(e) {
    var t = [],
        n = e.className;
    if (n && n.length > 0)
        for (var s = n.split(" "), r = 0; r < s.length; r++) s[r].length > 0 && t.push(s[r]);
    return t
}

function sh_addClass(e, t) {
    for (var n = sh_getClasses(e), s = 0; s < n.length; s++)
        if (t.toLowerCase() === n[s].toLowerCase()) return;
    n.push(t), e.className = n.join(" ")
}

function sh_extractTagsFromNodeList(e, t) {
    for (var n = e.length, s = 0; n > s; s++) {
        var r = e.item(s);
        switch (r.nodeType) {
            case 1:
                if ("br" === r.nodeName.toLowerCase()) {
                    var o;
                    o = /MSIE/.test(navigator.userAgent) ? "\r" : "\n", t.text.push(o), t.pos++
                } else t.tags.push({
                    node: r.cloneNode(!1),
                    pos: t.pos
                }), sh_extractTagsFromNodeList(r.childNodes, t), t.tags.push({
                    pos: t.pos
                });
                break;
            case 3:
            case 4:
                t.text.push(r.data), t.pos += r.length
        }
    }
}

function sh_extractTags(e, t) {
    var n = {};
    return n.text = [], n.tags = t, n.pos = 0, sh_extractTagsFromNodeList(e.childNodes, n), n.text.join("")
}

function sh_mergeTags(e, t) {
    var n = e.length;
    if (0 === n) return t;
    var s = t.length;
    if (0 === s) return e;
    for (var r = [], o = 0, i = 0; n > o && s > i;) {
        var a = e[o],
            l = t[i];
        a.pos <= l.pos ? (r.push(a), o++) : (r.push(l), t[i + 1].pos <= a.pos ? (i++, r.push(t[i]), i++) : (r.push({
            pos: a.pos
        }), t[i] = {
            node: l.node.cloneNode(!1),
            pos: a.pos
        }))
    }
    for (; n > o;) r.push(e[o]), o++;
    for (; s > i;) r.push(t[i]), i++;
    return r
}

function sh_insertTags(e, t) {
    for (var n = document, s = document.createDocumentFragment(), r = 0, o = e.length, i = 0, a = t.length, l = s; a > i || o > r;) {
        var c, h;
        if (o > r ? (c = e[r], h = c.pos) : h = a, i >= h) {
            if (c.node) {
                var u = c.node;
                l.appendChild(u), l = u
            } else l = l.parentNode;
            r++
        } else l.appendChild(n.createTextNode(t.substring(i, h))), i = h
    }
    return s
}

function sh_highlightElement(e, t) {
    sh_addClass(e, "sh_sourceCode");
    for (var n = [], s = sh_extractTags(e, n), r = sh_highlightString(s, t), o = sh_mergeTags(n, r), i = sh_insertTags(o, s); e.hasChildNodes();) e.removeChild(e.firstChild);
    e.appendChild(i)
}

function sh_getXMLHttpRequest() {
    if (window.ActiveXObject) return new ActiveXObject("Msxml2.XMLHTTP");
    if (window.XMLHttpRequest) return new XMLHttpRequest;
    throw "No XMLHttpRequest implementation available"
}

function sh_load(language, element, prefix, suffix) {
    if (language in sh_requests) return void sh_requests[language].push(element);
    sh_requests[language] = [element];
    var request = sh_getXMLHttpRequest(),
        url = prefix + "sh_" + language + suffix;
    request.open("GET", url, !0), request.onreadystatechange = function() {
        if (4 === request.readyState) try {
            if (request.status && 200 !== request.status) throw "HTTP error: status " + request.status;
            eval(request.responseText);
            for (var elements = sh_requests[language], i = 0; i < elements.length; i++) sh_highlightElement(elements[i], sh_languages[language])
        } finally {
            request = null
        }
    }, request.send(null)
}

function sh_highlightDocument(e, t) {
    for (var n = document.getElementsByTagName("pre"), s = 0; s < n.length; s++) {
        var r = n.item(s),
            o = r.className.toLowerCase(),
            i = o.replace(/sh_sourcecode/g, "");
        if (-1 != i.indexOf("sh_") && (i = i.match(/(\bsh_)\w+\b/g)[0]), -1 == o.indexOf("sh_sourcecode") && "sh_" === i.substr(0, 3)) {
            var a = i.substring(3);
            if (a in sh_languages) sh_highlightElement(r, sh_languages[a]);
            else {
                if ("string" != typeof e || "string" != typeof t) {
                    console.log('Found <pre> element with class="' + i + '", but no such language exists');
                    continue
                }
                sh_load(a, r, e, t)
            }
            break
        }
    }
}

function snippetPopup(e) {
    top.consoleRef = window.open("", "myconsole", "width=600,height=300,left=50,top=50,menubar=0,toolbar=0,location=0,status=0,scrollbars=1,resizable=1"), top.consoleRef.document.writeln("<html><head><title>Snippet :: Code View :: " + location.href + '</title></head><body bgcolor=white onLoad="self.focus()"><pre>' + e + "</pre></body></html>"), top.consoleRef.document.close()
}

function sh_isEmailAddress(e) {
    return /^mailto:/.test(e) ? !1 : -1 !== e.indexOf("@")
}

function sh_setHref(e, t, n) {
    var s = n.substring(e[t - 2].pos, e[t - 1].pos);
    s.length >= 2 && "<" === s.charAt(0) && ">" === s.charAt(s.length - 1) && (s = s.substr(1, s.length - 2)), sh_isEmailAddress(s) && (s = "mailto:" + s), e[t - 2].node.href = s
}

function sh_konquerorExec(e) {
    var t = [""];
    return t.index = e.length, t.input = e, t
}

function sh_highlightString(e, t) {
    if (/Konqueror/.test(navigator.userAgent) && !t.konquered) {
        for (var n = 0; n < t.length; n++)
            for (var s = 0; s < t[n].length; s++) {
                var r = t[n][s][0];
                "$" === r.source && (r.exec = sh_konquerorExec)
            }
        t.konquered = !0
    }
    var o = document.createElement("a"),
        i = document.createElement("span"),
        a = [],
        l = 0,
        c = [],
        h = 0,
        u = null,
        p = function(t, n) {
            var s = t.length;
            if (0 !== s) {
                if (!n) {
                    var r = c.length;
                    if (0 !== r) {
                        var p = c[r - 1];
                        p[3] || (n = p[1])
                    }
                }
                if (u !== n && (u && (a[l++] = {
                    pos: h
                }, "sh_url" === u && sh_setHref(a, l, e)), n)) {
                    var d;
                    d = "sh_url" === n ? o.cloneNode(!1) : i.cloneNode(!1), d.className = n, a[l++] = {
                        node: d,
                        pos: h
                    }
                }
                h += s, u = n
            }
        },
        d = /\r\n|\r|\n/g;
    d.lastIndex = 0;
    for (var f = e.length; f > h;) {
        var g = h,
            m, _, y = d.exec(e);
        null === y ? (m = f, _ = f) : (m = y.index, _ = d.lastIndex);
        for (var v = e.substring(g, m), b = [];;) {
            var x = h - g,
                w, A = c.length;
            w = 0 === A ? 0 : c[A - 1][2];
            var E = t[w],
                C = E.length,
                T = b[w];
            T || (T = b[w] = []);
            for (var k = null, z = -1, Z = 0; C > Z; Z++) {
                var N;
                if (Z < T.length && (null === T[Z] || x <= T[Z].index)) N = T[Z];
                else {
                    var D = E[Z][0];
                    D.lastIndex = x, N = D.exec(v), T[Z] = N
                }
                if (null !== N && (null === k || N.index < k.index) && (k = N, z = Z, N.index === x)) break
            }
            if (null === k) {
                p(v.substring(x), null);
                break
            }
            k.index > x && p(v.substring(x, k.index), null);
            var S = E[z],
                L = S[1],
                O;
            if (L instanceof Array)
                for (var F = 0; F < L.length; F++) O = k[F + 1], p(O, L[F]);
            else O = k[0], p(O, L);
            switch (S[2]) {
                case -1:
                    break;
                case -2:
                    c.pop();
                    break;
                case -3:
                    c.length = 0;
                    break;
                default:
                    c.push(S)
            }
        }
        u && (a[l++] = {
            pos: h
        }, "sh_url" === u && sh_setHref(a, l, e), u = null), h = _
    }
    return a
}

function sh_getClasses(e) {
    var t = [],
        n = e.className;
    if (n && n.length > 0)
        for (var s = n.split(" "), r = 0; r < s.length; r++) s[r].length > 0 && t.push(s[r]);
    return t
}

function sh_addClass(e, t) {
    for (var n = sh_getClasses(e), s = 0; s < n.length; s++)
        if (t.toLowerCase() === n[s].toLowerCase()) return;
    n.push(t), e.className = n.join(" ")
}

function sh_extractTagsFromNodeList(e, t) {
    for (var n = e.length, s = 0; n > s; s++) {
        var r = e.item(s);
        switch (r.nodeType) {
            case 1:
                if ("br" === r.nodeName.toLowerCase()) {
                    var o;
                    o = /MSIE/.test(navigator.userAgent) ? "\r" : "\n", t.text.push(o), t.pos++
                } else t.tags.push({
                    node: r.cloneNode(!1),
                    pos: t.pos
                }), sh_extractTagsFromNodeList(r.childNodes, t), t.tags.push({
                    pos: t.pos
                });
                break;
            case 3:
            case 4:
                t.text.push(r.data), t.pos += r.length
        }
    }
}

function sh_extractTags(e, t) {
    var n = {};
    return n.text = [], n.tags = t, n.pos = 0, sh_extractTagsFromNodeList(e.childNodes, n), n.text.join("")
}

function sh_mergeTags(e, t) {
    var n = e.length;
    if (0 === n) return t;
    var s = t.length;
    if (0 === s) return e;
    for (var r = [], o = 0, i = 0; n > o && s > i;) {
        var a = e[o],
            l = t[i];
        a.pos <= l.pos ? (r.push(a), o++) : (r.push(l), t[i + 1].pos <= a.pos ? (i++, r.push(t[i]), i++) : (r.push({
            pos: a.pos
        }), t[i] = {
            node: l.node.cloneNode(!1),
            pos: a.pos
        }))
    }
    for (; n > o;) r.push(e[o]), o++;
    for (; s > i;) r.push(t[i]), i++;
    return r
}

function sh_insertTags(e, t) {
    for (var n = document, s = document.createDocumentFragment(), r = 0, o = e.length, i = 0, a = t.length, l = s; a > i || o > r;) {
        var c, h;
        if (o > r ? (c = e[r], h = c.pos) : h = a, i >= h) {
            if (c.node) {
                var u = c.node;
                l.appendChild(u), l = u
            } else l = l.parentNode;
            r++
        } else l.appendChild(n.createTextNode(t.substring(i, h))), i = h
    }
    return s
}

function sh_highlightElement(e, t) {
    sh_addClass(e, "sh_sourceCode");
    for (var n = [], s = sh_extractTags(e, n), r = sh_highlightString(s, t), o = sh_mergeTags(n, r), i = sh_insertTags(o, s); e.hasChildNodes();) e.removeChild(e.firstChild);
    e.appendChild(i)
}

function sh_getXMLHttpRequest() {
    if (window.ActiveXObject) return new ActiveXObject("Msxml2.XMLHTTP");
    if (window.XMLHttpRequest) return new XMLHttpRequest;
    throw "No XMLHttpRequest implementation available"
}

function sh_load(language, element, prefix, suffix) {
    if (language in sh_requests) return void sh_requests[language].push(element);
    sh_requests[language] = [element];
    var request = sh_getXMLHttpRequest(),
        url = prefix + "sh_" + language + suffix;
    request.open("GET", url, !0), request.onreadystatechange = function() {
        if (4 === request.readyState) try {
            if (request.status && 200 !== request.status) throw "HTTP error: status " + request.status;
            eval(request.responseText);
            for (var elements = sh_requests[language], i = 0; i < elements.length; i++) sh_highlightElement(elements[i], sh_languages[language])
        } finally {
            request = null
        }
    }, request.send(null)
}

function sh_highlightDocument(e, t) {
    for (var n = document.getElementsByTagName("pre"), s = 0; s < n.length; s++) {
        var r = n.item(s),
            o = r.className.toLowerCase(),
            i = o.replace(/sh_sourcecode/g, "");
        if (-1 != i.indexOf("sh_") && (i = i.match(/(\bsh_)\w+\b/g)[0]), -1 == o.indexOf("sh_sourcecode") && "sh_" === i.substr(0, 3)) {
            var a = i.substring(3);
            if (a in sh_languages) sh_highlightElement(r, sh_languages[a]);
            else {
                if ("string" != typeof e || "string" != typeof t) {
                    console.log('Found <pre> element with class="' + i + '", but no such language exists');
                    continue
                }
                sh_load(a, r, e, t)
            }
            break
        }
    }
}
if (! function(e, t) {
    function n(e, t) {
        var n = e.createElement("p"),
            s = e.getElementsByTagName("head")[0] || e.documentElement;
        return n.innerHTML = "x<style>" + t + "</style>", s.insertBefore(n.lastChild, s.firstChild)
    }

    function s() {
        var e = v.elements;
        return "string" == typeof e ? e.split(" ") : e
    }

    function r(e, t) {
        var n = v.elements;
        "string" != typeof n && (n = n.join(" ")), "string" != typeof e && (e = e.join(" ")), v.elements = n + " " + e, c(t)
    }

    function o(e) {
        var t = y[e[m]];
        return t || (t = {}, _++, e[m] = _, y[_] = t), t
    }

    function i(e, n, s) {
        if (n || (n = t), u) return n.createElement(e);
        s || (s = o(n));
        var r;
        return r = s.cache[e] ? s.cache[e].cloneNode() : g.test(e) ? (s.cache[e] = s.createElem(e)).cloneNode() : s.createElem(e), !r.canHaveChildren || f.test(e) || r.tagUrn ? r : s.frag.appendChild(r)
    }

    function a(e, n) {
        if (e || (e = t), u) return e.createDocumentFragment();
        n = n || o(e);
        for (var r = n.frag.cloneNode(), i = 0, a = s(), l = a.length; l > i; i++) r.createElement(a[i]);
        return r
    }

    function l(e, t) {
        t.cache || (t.cache = {}, t.createElem = e.createElement, t.createFrag = e.createDocumentFragment, t.frag = t.createFrag()), e.createElement = function(n) {
            return v.shivMethods ? i(n, e, t) : t.createElem(n)
        }, e.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + s().join().replace(/[\w\-:]+/g, function(e) {
            return t.createElem(e), t.frag.createElement(e), 'c("' + e + '")'
        }) + ");return n}")(v, t.frag)
    }

    function c(e) {
        e || (e = t);
        var s = o(e);
        return !v.shivCSS || h || s.hasCSS || (s.hasCSS = !!n(e, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), u || l(e, s), e
    }
    var h, u, p = "3.7.2",
        d = e.html5 || {},
        f = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
        g = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
        m = "_html5shiv",
        _ = 0,
        y = {};
    ! function() {
        try {
            var e = t.createElement("a");
            e.innerHTML = "<xyz></xyz>", h = "hidden" in e, u = 1 == e.childNodes.length || function() {
                t.createElement("a");
                var e = t.createDocumentFragment();
                return "undefined" == typeof e.cloneNode || "undefined" == typeof e.createDocumentFragment || "undefined" == typeof e.createElement
            }()
        } catch (n) {
            h = !0, u = !0
        }
    }();
    var v = {
        elements: d.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",
        version: p,
        shivCSS: d.shivCSS !== !1,
        supportsUnknownElements: u,
        shivMethods: d.shivMethods !== !1,
        type: "default",
        shivDocument: c,
        createElement: i,
        createDocumentFragment: a,
        addElements: r
    };
    e.html5 = v, c(t)
}(this, document), ! function(e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function(e, t) {
    function n(e) {
        var t = e.length,
            n = ot.type(e);
        return "function" === n || ot.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
    }

    function s(e, t, n) {
        if (ot.isFunction(t)) return ot.grep(e, function(e, s) {
            return !!t.call(e, s, e) !== n
        });
        if (t.nodeType) return ot.grep(e, function(e) {
            return e === t !== n
        });
        if ("string" == typeof t) {
            if (dt.test(t)) return ot.filter(t, e, n);
            t = ot.filter(t, e)
        }
        return ot.grep(e, function(e) {
            return ot.inArray(e, t) >= 0 !== n
        })
    }

    function r(e, t) {
        do e = e[t]; while (e && 1 !== e.nodeType);
        return e
    }

    function o(e) {
        var t = xt[e] = {};
        return ot.each(e.match(bt) || [], function(e, n) {
            t[n] = !0
        }), t
    }

    function i() {
        gt.addEventListener ? (gt.removeEventListener("DOMContentLoaded", a, !1), e.removeEventListener("load", a, !1)) : (gt.detachEvent("onreadystatechange", a), e.detachEvent("onload", a))
    }

    function a() {
        (gt.addEventListener || "load" === event.type || "complete" === gt.readyState) && (i(), ot.ready())
    }

    function l(e, t, n) {
        if (void 0 === n && 1 === e.nodeType) {
            var s = "data-" + t.replace(Tt, "-$1").toLowerCase();
            if (n = e.getAttribute(s), "string" == typeof n) {
                try {
                    n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : Ct.test(n) ? ot.parseJSON(n) : n
                } catch (r) {}
                ot.data(e, t, n)
            } else n = void 0
        }
        return n
    }

    function c(e) {
        var t;
        for (t in e)
            if (("data" !== t || !ot.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
        return !0
    }

    function h(e, t, n, s) {
        if (ot.acceptData(e)) {
            var r, o, i = ot.expando,
                a = e.nodeType,
                l = a ? ot.cache : e,
                c = a ? e[i] : e[i] && i;
            if (c && l[c] && (s || l[c].data) || void 0 !== n || "string" != typeof t) return c || (c = a ? e[i] = Y.pop() || ot.guid++ : i), l[c] || (l[c] = a ? {} : {
                toJSON: ot.noop
            }), ("object" == typeof t || "function" == typeof t) && (s ? l[c] = ot.extend(l[c], t) : l[c].data = ot.extend(l[c].data, t)), o = l[c], s || (o.data || (o.data = {}), o = o.data), void 0 !== n && (o[ot.camelCase(t)] = n), "string" == typeof t ? (r = o[t], null == r && (r = o[ot.camelCase(t)])) : r = o, r
        }
    }

    function u(e, t, n) {
        if (ot.acceptData(e)) {
            var s, r, o = e.nodeType,
                i = o ? ot.cache : e,
                a = o ? e[ot.expando] : ot.expando;
            if (i[a]) {
                if (t && (s = n ? i[a] : i[a].data)) {
                    ot.isArray(t) ? t = t.concat(ot.map(t, ot.camelCase)) : t in s ? t = [t] : (t = ot.camelCase(t), t = t in s ? [t] : t.split(" ")), r = t.length;
                    for (; r--;) delete s[t[r]];
                    if (n ? !c(s) : !ot.isEmptyObject(s)) return
                }(n || (delete i[a].data, c(i[a]))) && (o ? ot.cleanData([e], !0) : st.deleteExpando || i != i.window ? delete i[a] : i[a] = null)
            }
        }
    }

    function p() {
        return !0
    }

    function d() {
        return !1
    }

    function f() {
        try {
            return gt.activeElement
        } catch (e) {}
    }

    function g(e) {
        var t = Ft.split("|"),
            n = e.createDocumentFragment();
        if (n.createElement)
            for (; t.length;) n.createElement(t.pop());
        return n
    }

    function m(e, t) {
        var n, s, r = 0,
            o = typeof e.getElementsByTagName !== At ? e.getElementsByTagName(t || "*") : typeof e.querySelectorAll !== At ? e.querySelectorAll(t || "*") : void 0;
        if (!o)
            for (o = [], n = e.childNodes || e; null != (s = n[r]); r++) !t || ot.nodeName(s, t) ? o.push(s) : ot.merge(o, m(s, t));
        return void 0 === t || t && ot.nodeName(e, t) ? ot.merge([e], o) : o
    }

    function _(e) {
        $t.test(e.type) && (e.defaultChecked = e.checked)
    }

    function y(e, t) {
        return ot.nodeName(e, "table") && ot.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }

    function v(e) {
        return e.type = (null !== ot.find.attr(e, "type")) + "/" + e.type, e
    }

    function b(e) {
        var t = Xt.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function x(e, t) {
        for (var n, s = 0; null != (n = e[s]); s++) ot._data(n, "globalEval", !t || ot._data(t[s], "globalEval"))
    }

    function w(e, t) {
        if (1 === t.nodeType && ot.hasData(e)) {
            var n, s, r, o = ot._data(e),
                i = ot._data(t, o),
                a = o.events;
            if (a) {
                delete i.handle, i.events = {};
                for (n in a)
                    for (s = 0, r = a[n].length; r > s; s++) ot.event.add(t, n, a[n][s])
            }
            i.data && (i.data = ot.extend({}, i.data))
        }
    }

    function A(e, t) {
        var n, s, r;
        if (1 === t.nodeType) {
            if (n = t.nodeName.toLowerCase(), !st.noCloneEvent && t[ot.expando]) {
                r = ot._data(t);
                for (s in r.events) ot.removeEvent(t, s, r.handle);
                t.removeAttribute(ot.expando)
            }
            "script" === n && t.text !== e.text ? (v(t).text = e.text, b(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), st.html5Clone && e.innerHTML && !ot.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && $t.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
        }
    }

    function E(t, n) {
        var s, r = ot(n.createElement(t)).appendTo(n.body),
            o = e.getDefaultComputedStyle && (s = e.getDefaultComputedStyle(r[0])) ? s.display : ot.css(r[0], "display");
        return r.detach(), o
    }

    function C(e) {
        var t = gt,
            n = Jt[e];
        return n || (n = E(e, t), "none" !== n && n || (Kt = (Kt || ot("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement), t = (Kt[0].contentWindow || Kt[0].contentDocument).document, t.write(), t.close(), n = E(e, t), Kt.detach()), Jt[e] = n), n
    }

    function T(e, t) {
        return {
            get: function() {
                var n = e();
                return null != n ? n ? void delete this.get : (this.get = t).apply(this, arguments) : void 0
            }
        }
    }

    function k(e, t) {
        if (t in e) return t;
        for (var n = t.charAt(0).toUpperCase() + t.slice(1), s = t, r = dn.length; r--;)
            if (t = dn[r] + n, t in e) return t;
        return s
    }

    function z(e, t) {
        for (var n, s, r, o = [], i = 0, a = e.length; a > i; i++) s = e[i], s.style && (o[i] = ot._data(s, "olddisplay"), n = s.style.display, t ? (o[i] || "none" !== n || (s.style.display = ""), "" === s.style.display && Zt(s) && (o[i] = ot._data(s, "olddisplay", C(s.nodeName)))) : (r = Zt(s), (n && "none" !== n || !r) && ot._data(s, "olddisplay", r ? n : ot.css(s, "display"))));
        for (i = 0; a > i; i++) s = e[i], s.style && (t && "none" !== s.style.display && "" !== s.style.display || (s.style.display = t ? o[i] || "" : "none"));
        return e
    }

    function Z(e, t, n) {
        var s = cn.exec(t);
        return s ? Math.max(0, s[1] - (n || 0)) + (s[2] || "px") : t
    }

    function N(e, t, n, s, r) {
        for (var o = n === (s ? "border" : "content") ? 4 : "width" === t ? 1 : 0, i = 0; 4 > o; o += 2) "margin" === n && (i += ot.css(e, n + zt[o], !0, r)), s ? ("content" === n && (i -= ot.css(e, "padding" + zt[o], !0, r)), "margin" !== n && (i -= ot.css(e, "border" + zt[o] + "Width", !0, r))) : (i += ot.css(e, "padding" + zt[o], !0, r), "padding" !== n && (i += ot.css(e, "border" + zt[o] + "Width", !0, r)));
        return i
    }

    function D(e, t, n) {
        var s = !0,
            r = "width" === t ? e.offsetWidth : e.offsetHeight,
            o = nn(e),
            i = st.boxSizing && "border-box" === ot.css(e, "boxSizing", !1, o);
        if (0 >= r || null == r) {
            if (r = sn(e, t, o), (0 > r || null == r) && (r = e.style[t]), tn.test(r)) return r;
            s = i && (st.boxSizingReliable() || r === e.style[t]), r = parseFloat(r) || 0
        }
        return r + N(e, t, n || (i ? "border" : "content"), s, o) + "px"
    }

    function S(e, t, n, s, r) {
        return new S.prototype.init(e, t, n, s, r)
    }

    function L() {
        return setTimeout(function() {
            fn = void 0
        }), fn = ot.now()
    }

    function O(e, t) {
        var n, s = {
                height: e
            },
            r = 0;
        for (t = t ? 1 : 0; 4 > r; r += 2 - t) n = zt[r], s["margin" + n] = s["padding" + n] = e;
        return t && (s.opacity = s.width = e), s
    }

    function F(e, t, n) {
        for (var s, r = (bn[t] || []).concat(bn["*"]), o = 0, i = r.length; i > o; o++)
            if (s = r[o].call(n, t, e)) return s
    }

    function I(e, t, n) {
        var s, r, o, i, a, l, c, h, u = this,
            p = {},
            d = e.style,
            f = e.nodeType && Zt(e),
            g = ot._data(e, "fxshow");
        n.queue || (a = ot._queueHooks(e, "fx"), null == a.unqueued && (a.unqueued = 0, l = a.empty.fire, a.empty.fire = function() {
            a.unqueued || l()
        }), a.unqueued++, u.always(function() {
            u.always(function() {
                a.unqueued--, ot.queue(e, "fx").length || a.empty.fire()
            })
        })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [d.overflow, d.overflowX, d.overflowY], c = ot.css(e, "display"), h = "none" === c ? ot._data(e, "olddisplay") || C(e.nodeName) : c, "inline" === h && "none" === ot.css(e, "float") && (st.inlineBlockNeedsLayout && "inline" !== C(e.nodeName) ? d.zoom = 1 : d.display = "inline-block")), n.overflow && (d.overflow = "hidden", st.shrinkWrapBlocks() || u.always(function() {
            d.overflow = n.overflow[0], d.overflowX = n.overflow[1], d.overflowY = n.overflow[2]
        }));
        for (s in t)
            if (r = t[s], mn.exec(r)) {
                if (delete t[s], o = o || "toggle" === r, r === (f ? "hide" : "show")) {
                    if ("show" !== r || !g || void 0 === g[s]) continue;
                    f = !0
                }
                p[s] = g && g[s] || ot.style(e, s)
            } else c = void 0;
        if (ot.isEmptyObject(p)) "inline" === ("none" === c ? C(e.nodeName) : c) && (d.display = c);
        else {
            g ? "hidden" in g && (f = g.hidden) : g = ot._data(e, "fxshow", {}), o && (g.hidden = !f), f ? ot(e).show() : u.done(function() {
                ot(e).hide()
            }), u.done(function() {
                var t;
                ot._removeData(e, "fxshow");
                for (t in p) ot.style(e, t, p[t])
            });
            for (s in p) i = F(f ? g[s] : 0, s, u), s in g || (g[s] = i.start, f && (i.end = i.start, i.start = "width" === s || "height" === s ? 1 : 0))
        }
    }

    function j(e, t) {
        var n, s, r, o, i;
        for (n in e)
            if (s = ot.camelCase(n), r = t[s], o = e[n], ot.isArray(o) && (r = o[1], o = e[n] = o[0]), n !== s && (e[s] = o, delete e[n]), i = ot.cssHooks[s], i && "expand" in i) {
                o = i.expand(o), delete e[s];
                for (n in o) n in e || (e[n] = o[n], t[n] = r)
            } else t[s] = r
    }

    function M(e, t, n) {
        var s, r, o = 0,
            i = vn.length,
            a = ot.Deferred().always(function() {
                delete l.elem
            }),
            l = function() {
                if (r) return !1;
                for (var t = fn || L(), n = Math.max(0, c.startTime + c.duration - t), s = n / c.duration || 0, o = 1 - s, i = 0, l = c.tweens.length; l > i; i++) c.tweens[i].run(o);
                return a.notifyWith(e, [c, o, n]), 1 > o && l ? n : (a.resolveWith(e, [c]), !1)
            },
            c = a.promise({
                elem: e,
                props: ot.extend({}, t),
                opts: ot.extend(!0, {
                    specialEasing: {}
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: fn || L(),
                duration: n.duration,
                tweens: [],
                createTween: function(t, n) {
                    var s = ot.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
                    return c.tweens.push(s), s
                },
                stop: function(t) {
                    var n = 0,
                        s = t ? c.tweens.length : 0;
                    if (r) return this;
                    for (r = !0; s > n; n++) c.tweens[n].run(1);
                    return t ? a.resolveWith(e, [c, t]) : a.rejectWith(e, [c, t]), this
                }
            }),
            h = c.props;
        for (j(h, c.opts.specialEasing); i > o; o++)
            if (s = vn[o].call(c, e, h, c.opts)) return s;
        return ot.map(h, F, c), ot.isFunction(c.opts.start) && c.opts.start.call(e, c), ot.fx.timer(ot.extend(l, {
            elem: e,
            anim: c,
            queue: c.opts.queue
        })), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
    }

    function q(e) {
        return function(t, n) {
            "string" != typeof t && (n = t, t = "*");
            var s, r = 0,
                o = t.toLowerCase().match(bt) || [];
            if (ot.isFunction(n))
                for (; s = o[r++];) "+" === s.charAt(0) ? (s = s.slice(1) || "*", (e[s] = e[s] || []).unshift(n)) : (e[s] = e[s] || []).push(n)
        }
    }

    function H(e, t, n, s) {
        function r(a) {
            var l;
            return o[a] = !0, ot.each(e[a] || [], function(e, a) {
                var c = a(t, n, s);
                return "string" != typeof c || i || o[c] ? i ? !(l = c) : void 0 : (t.dataTypes.unshift(c), r(c), !1)
            }), l
        }
        var o = {},
            i = e === Pn;
        return r(t.dataTypes[0]) || !o["*"] && r("*")
    }

    function R(e, t) {
        var n, s, r = ot.ajaxSettings.flatOptions || {};
        for (s in t) void 0 !== t[s] && ((r[s] ? e : n || (n = {}))[s] = t[s]);
        return n && ot.extend(!0, e, n), e
    }

    function B(e, t, n) {
        for (var s, r, o, i, a = e.contents, l = e.dataTypes;
            "*" === l[0];) l.shift(), void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
        if (r)
            for (i in a)
                if (a[i] && a[i].test(r)) {
                    l.unshift(i);
                    break
                }
        if (l[0] in n) o = l[0];
        else {
            for (i in n) {
                if (!l[0] || e.converters[i + " " + l[0]]) {
                    o = i;
                    break
                }
                s || (s = i)
            }
            o = o || s
        }
        return o ? (o !== l[0] && l.unshift(o), n[o]) : void 0
    }

    function P(e, t, n, s) {
        var r, o, i, a, l, c = {},
            h = e.dataTypes.slice();
        if (h[1])
            for (i in e.converters) c[i.toLowerCase()] = e.converters[i];
        for (o = h.shift(); o;)
            if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && s && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = h.shift())
                if ("*" === o) o = l;
                else if ("*" !== l && l !== o) {
            if (i = c[l + " " + o] || c["* " + o], !i)
                for (r in c)
                    if (a = r.split(" "), a[1] === o && (i = c[l + " " + a[0]] || c["* " + a[0]])) {
                        i === !0 ? i = c[r] : c[r] !== !0 && (o = a[0], h.unshift(a[1]));
                        break
                    }
            if (i !== !0)
                if (i && e["throws"]) t = i(t);
                else try {
                    t = i(t)
                } catch (u) {
                    return {
                        state: "parsererror",
                        error: i ? u : "No conversion from " + l + " to " + o
                    }
                }
        }
        return {
            state: "success",
            data: t
        }
    }

    function U(e, t, n, s) {
        var r;
        if (ot.isArray(t)) ot.each(t, function(t, r) {
            n || Gn.test(e) ? s(e, r) : U(e + "[" + ("object" == typeof r ? t : "") + "]", r, n, s)
        });
        else if (n || "object" !== ot.type(t)) s(e, t);
        else
            for (r in t) U(e + "[" + r + "]", t[r], n, s)
    }

    function W() {
        try {
            return new e.XMLHttpRequest
        } catch (t) {}
    }

    function X() {
        try {
            return new e.ActiveXObject("Microsoft.XMLHTTP")
        } catch (t) {}
    }

    function G(e) {
        return ot.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1
    }
    var Y = [],
        Q = Y.slice,
        V = Y.concat,
        K = Y.push,
        J = Y.indexOf,
        et = {},
        tt = et.toString,
        nt = et.hasOwnProperty,
        st = {},
        rt = "1.11.1",
        ot = function(e, t) {
            return new ot.fn.init(e, t)
        },
        it = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        at = /^-ms-/,
        lt = /-([\da-z])/gi,
        ct = function(e, t) {
            return t.toUpperCase()
        };
    ot.fn = ot.prototype = {
        jquery: rt,
        constructor: ot,
        selector: "",
        length: 0,
        toArray: function() {
            return Q.call(this)
        },
        get: function(e) {
            return null != e ? 0 > e ? this[e + this.length] : this[e] : Q.call(this)
        },
        pushStack: function(e) {
            var t = ot.merge(this.constructor(), e);
            return t.prevObject = this, t.context = this.context, t
        },
        each: function(e, t) {
            return ot.each(this, e, t)
        },
        map: function(e) {
            return this.pushStack(ot.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function() {
            return this.pushStack(Q.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length,
                n = +e + (0 > e ? t : 0);
            return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: K,
        sort: Y.sort,
        splice: Y.splice
    }, ot.extend = ot.fn.extend = function() {
        var e, t, n, s, r, o, i = arguments[0] || {},
            a = 1,
            l = arguments.length,
            c = !1;
        for ("boolean" == typeof i && (c = i, i = arguments[a] || {}, a++), "object" == typeof i || ot.isFunction(i) || (i = {}), a === l && (i = this, a--); l > a; a++)
            if (null != (r = arguments[a]))
                for (s in r) e = i[s], n = r[s], i !== n && (c && n && (ot.isPlainObject(n) || (t = ot.isArray(n))) ? (t ? (t = !1, o = e && ot.isArray(e) ? e : []) : o = e && ot.isPlainObject(e) ? e : {}, i[s] = ot.extend(c, o, n)) : void 0 !== n && (i[s] = n));
        return i
    }, ot.extend({
        expando: "jQuery" + (rt + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isFunction: function(e) {
            return "function" === ot.type(e)
        },
        isArray: Array.isArray || function(e) {
            return "array" === ot.type(e)
        },
        isWindow: function(e) {
            return null != e && e == e.window
        },
        isNumeric: function(e) {
            return !ot.isArray(e) && e - parseFloat(e) >= 0
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        isPlainObject: function(e) {
            var t;
            if (!e || "object" !== ot.type(e) || e.nodeType || ot.isWindow(e)) return !1;
            try {
                if (e.constructor && !nt.call(e, "constructor") && !nt.call(e.constructor.prototype, "isPrototypeOf")) return !1
            } catch (n) {
                return !1
            }
            if (st.ownLast)
                for (t in e) return nt.call(e, t);
            for (t in e);
            return void 0 === t || nt.call(e, t)
        },
        type: function(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? et[tt.call(e)] || "object" : typeof e
        },
        globalEval: function(t) {
            t && ot.trim(t) && (e.execScript || function(t) {
                e.eval.call(e, t)
            })(t)
        },
        camelCase: function(e) {
            return e.replace(at, "ms-").replace(lt, ct)
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, t, s) {
            var r, o = 0,
                i = e.length,
                a = n(e);
            if (s) {
                if (a)
                    for (; i > o && (r = t.apply(e[o], s), r !== !1); o++);
                else
                    for (o in e)
                        if (r = t.apply(e[o], s), r === !1) break
            } else if (a)
                for (; i > o && (r = t.call(e[o], o, e[o]), r !== !1); o++);
            else
                for (o in e)
                    if (r = t.call(e[o], o, e[o]), r === !1) break; return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(it, "")
        },
        makeArray: function(e, t) {
            var s = t || [];
            return null != e && (n(Object(e)) ? ot.merge(s, "string" == typeof e ? [e] : e) : K.call(s, e)), s
        },
        inArray: function(e, t, n) {
            var s;
            if (t) {
                if (J) return J.call(t, e, n);
                for (s = t.length, n = n ? 0 > n ? Math.max(0, s + n) : n : 0; s > n; n++)
                    if (n in t && t[n] === e) return n
            }
            return -1
        },
        merge: function(e, t) {
            for (var n = +t.length, s = 0, r = e.length; n > s;) e[r++] = t[s++];
            if (n !== n)
                for (; void 0 !== t[s];) e[r++] = t[s++];
            return e.length = r, e
        },
        grep: function(e, t, n) {
            for (var s, r = [], o = 0, i = e.length, a = !n; i > o; o++) s = !t(e[o], o), s !== a && r.push(e[o]);
            return r
        },
        map: function(e, t, s) {
            var r, o = 0,
                i = e.length,
                a = n(e),
                l = [];
            if (a)
                for (; i > o; o++) r = t(e[o], o, s), null != r && l.push(r);
            else
                for (o in e) r = t(e[o], o, s), null != r && l.push(r);
            return V.apply([], l)
        },
        guid: 1,
        proxy: function(e, t) {
            var n, s, r;
            return "string" == typeof t && (r = e[t], t = e, e = r), ot.isFunction(e) ? (n = Q.call(arguments, 2), s = function() {
                return e.apply(t || this, n.concat(Q.call(arguments)))
            }, s.guid = e.guid = e.guid || ot.guid++, s) : void 0
        },
        now: function() {
            return +new Date
        },
        support: st
    }), ot.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
        et["[object " + t + "]"] = t.toLowerCase()
    });
    var ht = function(e) {
        function t(e, t, n, s) {
            var r, o, i, a, l, c, u, d, f, g;
            if ((t ? t.ownerDocument || t : H) !== S && D(t), t = t || S, n = n || [], !e || "string" != typeof e) return n;
            if (1 !== (a = t.nodeType) && 9 !== a) return [];
            if (O && !s) {
                if (r = yt.exec(e))
                    if (i = r[1]) {
                        if (9 === a) {
                            if (o = t.getElementById(i), !o || !o.parentNode) return n;
                            if (o.id === i) return n.push(o), n
                        } else if (t.ownerDocument && (o = t.ownerDocument.getElementById(i)) && M(t, o) && o.id === i) return n.push(o), n
                    } else {
                        if (r[2]) return et.apply(n, t.getElementsByTagName(e)), n;
                        if ((i = r[3]) && x.getElementsByClassName && t.getElementsByClassName) return et.apply(n, t.getElementsByClassName(i)), n
                    }
                if (x.qsa && (!F || !F.test(e))) {
                    if (d = u = q, f = t, g = 9 === a && e, 1 === a && "object" !== t.nodeName.toLowerCase()) {
                        for (c = C(e), (u = t.getAttribute("id")) ? d = u.replace(bt, "\\$&") : t.setAttribute("id", d), d = "[id='" + d + "'] ", l = c.length; l--;) c[l] = d + p(c[l]);
                        f = vt.test(e) && h(t.parentNode) || t, g = c.join(",")
                    }
                    if (g) try {
                        return et.apply(n, f.querySelectorAll(g)), n
                    } catch (m) {} finally {
                        u || t.removeAttribute("id")
                    }
                }
            }
            return k(e.replace(ct, "$1"), t, n, s)
        }

        function n() {
            function e(n, s) {
                return t.push(n + " ") > w.cacheLength && delete e[t.shift()], e[n + " "] = s
            }
            var t = [];
            return e
        }

        function s(e) {
            return e[q] = !0, e
        }

        function r(e) {
            var t = S.createElement("div");
            try {
                return !!e(t)
            } catch (n) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function o(e, t) {
            for (var n = e.split("|"), s = e.length; s--;) w.attrHandle[n[s]] = t
        }

        function i(e, t) {
            var n = t && e,
                s = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || Y) - (~e.sourceIndex || Y);
            if (s) return s;
            if (n)
                for (; n = n.nextSibling;)
                    if (n === t) return -1;
            return e ? 1 : -1
        }

        function a(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return "input" === n && t.type === e
            }
        }

        function l(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }

        function c(e) {
            return s(function(t) {
                return t = +t, s(function(n, s) {
                    for (var r, o = e([], n.length, t), i = o.length; i--;) n[r = o[i]] && (n[r] = !(s[r] = n[r]))
                })
            })
        }

        function h(e) {
            return e && typeof e.getElementsByTagName !== G && e
        }

        function u() {}

        function p(e) {
            for (var t = 0, n = e.length, s = ""; n > t; t++) s += e[t].value;
            return s
        }

        function d(e, t, n) {
            var s = t.dir,
                r = n && "parentNode" === s,
                o = B++;
            return t.first ? function(t, n, o) {
                for (; t = t[s];)
                    if (1 === t.nodeType || r) return e(t, n, o)
            } : function(t, n, i) {
                var a, l, c = [R, o];
                if (i) {
                    for (; t = t[s];)
                        if ((1 === t.nodeType || r) && e(t, n, i)) return !0
                } else
                    for (; t = t[s];)
                        if (1 === t.nodeType || r) {
                            if (l = t[q] || (t[q] = {}), (a = l[s]) && a[0] === R && a[1] === o) return c[2] = a[2];
                            if (l[s] = c, c[2] = e(t, n, i)) return !0
                        }
            }
        }

        function f(e) {
            return e.length > 1 ? function(t, n, s) {
                for (var r = e.length; r--;)
                    if (!e[r](t, n, s)) return !1;
                return !0
            } : e[0]
        }

        function g(e, n, s) {
            for (var r = 0, o = n.length; o > r; r++) t(e, n[r], s);
            return s
        }

        function m(e, t, n, s, r) {
            for (var o, i = [], a = 0, l = e.length, c = null != t; l > a; a++)(o = e[a]) && (!n || n(o, s, r)) && (i.push(o), c && t.push(a));
            return i
        }

        function _(e, t, n, r, o, i) {
            return r && !r[q] && (r = _(r)), o && !o[q] && (o = _(o, i)), s(function(s, i, a, l) {
                var c, h, u, p = [],
                    d = [],
                    f = i.length,
                    _ = s || g(t || "*", a.nodeType ? [a] : a, []),
                    y = !e || !s && t ? _ : m(_, p, e, a, l),
                    v = n ? o || (s ? e : f || r) ? [] : i : y;
                if (n && n(y, v, a, l), r)
                    for (c = m(v, d), r(c, [], a, l), h = c.length; h--;)(u = c[h]) && (v[d[h]] = !(y[d[h]] = u));
                if (s) {
                    if (o || e) {
                        if (o) {
                            for (c = [], h = v.length; h--;)(u = v[h]) && c.push(y[h] = u);
                            o(null, v = [], c, l)
                        }
                        for (h = v.length; h--;)(u = v[h]) && (c = o ? nt.call(s, u) : p[h]) > -1 && (s[c] = !(i[c] = u))
                    }
                } else v = m(v === i ? v.splice(f, v.length) : v), o ? o(null, i, v, l) : et.apply(i, v)
            })
        }

        function y(e) {
            for (var t, n, s, r = e.length, o = w.relative[e[0].type], i = o || w.relative[" "], a = o ? 1 : 0, l = d(function(e) {
                return e === t
            }, i, !0), c = d(function(e) {
                return nt.call(t, e) > -1
            }, i, !0), h = [function(e, n, s) {
                return !o && (s || n !== z) || ((t = n).nodeType ? l(e, n, s) : c(e, n, s))
            }]; r > a; a++)
                if (n = w.relative[e[a].type]) h = [d(f(h), n)];
                else {
                    if (n = w.filter[e[a].type].apply(null, e[a].matches), n[q]) {
                        for (s = ++a; r > s && !w.relative[e[s].type]; s++);
                        return _(a > 1 && f(h), a > 1 && p(e.slice(0, a - 1).concat({
                            value: " " === e[a - 2].type ? "*" : ""
                        })).replace(ct, "$1"), n, s > a && y(e.slice(a, s)), r > s && y(e = e.slice(s)), r > s && p(e))
                    }
                    h.push(n)
                }
            return f(h)
        }

        function v(e, n) {
            var r = n.length > 0,
                o = e.length > 0,
                i = function(s, i, a, l, c) {
                    var h, u, p, d = 0,
                        f = "0",
                        g = s && [],
                        _ = [],
                        y = z,
                        v = s || o && w.find.TAG("*", c),
                        b = R += null == y ? 1 : Math.random() || .1,
                        x = v.length;
                    for (c && (z = i !== S && i); f !== x && null != (h = v[f]); f++) {
                        if (o && h) {
                            for (u = 0; p = e[u++];)
                                if (p(h, i, a)) {
                                    l.push(h);
                                    break
                                }
                            c && (R = b)
                        }
                        r && ((h = !p && h) && d--, s && g.push(h))
                    }
                    if (d += f, r && f !== d) {
                        for (u = 0; p = n[u++];) p(g, _, i, a);
                        if (s) {
                            if (d > 0)
                                for (; f--;) g[f] || _[f] || (_[f] = K.call(l));
                            _ = m(_)
                        }
                        et.apply(l, _), c && !s && _.length > 0 && d + n.length > 1 && t.uniqueSort(l)
                    }
                    return c && (R = b, z = y), g
                };
            return r ? s(i) : i
        }
        var b, x, w, A, E, C, T, k, z, Z, N, D, S, L, O, F, I, j, M, q = "sizzle" + -new Date,
            H = e.document,
            R = 0,
            B = 0,
            P = n(),
            U = n(),
            W = n(),
            X = function(e, t) {
                return e === t && (N = !0), 0
            },
            G = "undefined",
            Y = 1 << 31,
            Q = {}.hasOwnProperty,
            V = [],
            K = V.pop,
            J = V.push,
            et = V.push,
            tt = V.slice,
            nt = V.indexOf || function(e) {
                for (var t = 0, n = this.length; n > t; t++)
                    if (this[t] === e) return t;
                return -1
            },
            st = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            rt = "[\\x20\\t\\r\\n\\f]",
            ot = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            it = ot.replace("w", "w#"),
            at = "\\[" + rt + "*(" + ot + ")(?:" + rt + "*([*^$|!~]?=)" + rt + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + it + "))|)" + rt + "*\\]",
            lt = ":(" + ot + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + at + ")*)|.*)\\)|)",
            ct = new RegExp("^" + rt + "+|((?:^|[^\\\\])(?:\\\\.)*)" + rt + "+$", "g"),
            ht = new RegExp("^" + rt + "*," + rt + "*"),
            ut = new RegExp("^" + rt + "*([>+~]|" + rt + ")" + rt + "*"),
            pt = new RegExp("=" + rt + "*([^\\]'\"]*?)" + rt + "*\\]", "g"),
            dt = new RegExp(lt),
            ft = new RegExp("^" + it + "$"),
            gt = {
                ID: new RegExp("^#(" + ot + ")"),
                CLASS: new RegExp("^\\.(" + ot + ")"),
                TAG: new RegExp("^(" + ot.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + at),
                PSEUDO: new RegExp("^" + lt),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + rt + "*(even|odd|(([+-]|)(\\d*)n|)" + rt + "*(?:([+-]|)" + rt + "*(\\d+)|))" + rt + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + st + ")$", "i"),
                needsContext: new RegExp("^" + rt + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + rt + "*((?:-\\d)?\\d*)" + rt + "*\\)|)(?=[^-]|$)", "i")
            },
            mt = /^(?:input|select|textarea|button)$/i,
            _t = /^h\d$/i,
            $ = /^[^{]+\{\s*\[native \w/,
            yt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            vt = /[+~]/,
            bt = /'|\\/g,
            xt = new RegExp("\\\\([\\da-f]{1,6}" + rt + "?|(" + rt + ")|.)", "ig"),
            wt = function(e, t, n) {
                var s = "0x" + t - 65536;
                return s !== s || n ? t : 0 > s ? String.fromCharCode(s + 65536) : String.fromCharCode(s >> 10 | 55296, 1023 & s | 56320)
            };
        try {
            et.apply(V = tt.call(H.childNodes), H.childNodes), V[H.childNodes.length].nodeType
        } catch (At) {
            et = {
                apply: V.length ? function(e, t) {
                    J.apply(e, tt.call(t))
                } : function(e, t) {
                    for (var n = e.length, s = 0; e[n++] = t[s++];);
                    e.length = n - 1
                }
            }
        }
        x = t.support = {}, E = t.isXML = function(e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return t ? "HTML" !== t.nodeName : !1
        }, D = t.setDocument = function(e) {
            var t, n = e ? e.ownerDocument || e : H,
                s = n.defaultView;
            return n !== S && 9 === n.nodeType && n.documentElement ? (S = n, L = n.documentElement, O = !E(n), s && s !== s.top && (s.addEventListener ? s.addEventListener("unload", function() {
                D()
            }, !1) : s.attachEvent && s.attachEvent("onunload", function() {
                D()
            })), x.attributes = r(function(e) {
                return e.className = "i", !e.getAttribute("className")
            }), x.getElementsByTagName = r(function(e) {
                return e.appendChild(n.createComment("")), !e.getElementsByTagName("*").length
            }), x.getElementsByClassName = $.test(n.getElementsByClassName) && r(function(e) {
                return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", 2 === e.getElementsByClassName("i").length
            }), x.getById = r(function(e) {
                return L.appendChild(e).id = q, !n.getElementsByName || !n.getElementsByName(q).length
            }), x.getById ? (w.find.ID = function(e, t) {
                if (typeof t.getElementById !== G && O) {
                    var n = t.getElementById(e);
                    return n && n.parentNode ? [n] : []
                }
            }, w.filter.ID = function(e) {
                var t = e.replace(xt, wt);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }) : (delete w.find.ID, w.filter.ID = function(e) {
                var t = e.replace(xt, wt);
                return function(e) {
                    var n = typeof e.getAttributeNode !== G && e.getAttributeNode("id");
                    return n && n.value === t
                }
            }), w.find.TAG = x.getElementsByTagName ? function(e, t) {
                return typeof t.getElementsByTagName !== G ? t.getElementsByTagName(e) : void 0
            } : function(e, t) {
                var n, s = [],
                    r = 0,
                    o = t.getElementsByTagName(e);
                if ("*" === e) {
                    for (; n = o[r++];) 1 === n.nodeType && s.push(n);
                    return s
                }
                return o
            }, w.find.CLASS = x.getElementsByClassName && function(e, t) {
                return typeof t.getElementsByClassName !== G && O ? t.getElementsByClassName(e) : void 0
            }, I = [], F = [], (x.qsa = $.test(n.querySelectorAll)) && (r(function(e) {
                e.innerHTML = "<select msallowclip=''><option selected=''></option></select>", e.querySelectorAll("[msallowclip^='']").length && F.push("[*^$]=" + rt + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || F.push("\\[" + rt + "*(?:value|" + st + ")"), e.querySelectorAll(":checked").length || F.push(":checked")
            }), r(function(e) {
                var t = n.createElement("input");
                t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && F.push("name" + rt + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || F.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), F.push(",.*:")
            })), (x.matchesSelector = $.test(j = L.matches || L.webkitMatchesSelector || L.mozMatchesSelector || L.oMatchesSelector || L.msMatchesSelector)) && r(function(e) {
                x.disconnectedMatch = j.call(e, "div"), j.call(e, "[s!='']:x"), I.push("!=", lt)
            }), F = F.length && new RegExp(F.join("|")), I = I.length && new RegExp(I.join("|")), t = $.test(L.compareDocumentPosition), M = t || $.test(L.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e,
                    s = t && t.parentNode;
                return e === s || !(!s || 1 !== s.nodeType || !(n.contains ? n.contains(s) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(s)))
            } : function(e, t) {
                if (t)
                    for (; t = t.parentNode;)
                        if (t === e) return !0;
                return !1
            }, X = t ? function(e, t) {
                if (e === t) return N = !0, 0;
                var s = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return s ? s : (s = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, 1 & s || !x.sortDetached && t.compareDocumentPosition(e) === s ? e === n || e.ownerDocument === H && M(H, e) ? -1 : t === n || t.ownerDocument === H && M(H, t) ? 1 : Z ? nt.call(Z, e) - nt.call(Z, t) : 0 : 4 & s ? -1 : 1)
            } : function(e, t) {
                if (e === t) return N = !0, 0;
                var s, r = 0,
                    o = e.parentNode,
                    a = t.parentNode,
                    l = [e],
                    c = [t];
                if (!o || !a) return e === n ? -1 : t === n ? 1 : o ? -1 : a ? 1 : Z ? nt.call(Z, e) - nt.call(Z, t) : 0;
                if (o === a) return i(e, t);
                for (s = e; s = s.parentNode;) l.unshift(s);
                for (s = t; s = s.parentNode;) c.unshift(s);
                for (; l[r] === c[r];) r++;
                return r ? i(l[r], c[r]) : l[r] === H ? -1 : c[r] === H ? 1 : 0
            }, n) : S
        }, t.matches = function(e, n) {
            return t(e, null, null, n)
        }, t.matchesSelector = function(e, n) {
            if ((e.ownerDocument || e) !== S && D(e), n = n.replace(pt, "='$1']"), !(!x.matchesSelector || !O || I && I.test(n) || F && F.test(n))) try {
                var s = j.call(e, n);
                if (s || x.disconnectedMatch || e.document && 11 !== e.document.nodeType) return s
            } catch (r) {}
            return t(n, S, null, [e]).length > 0
        }, t.contains = function(e, t) {
            return (e.ownerDocument || e) !== S && D(e), M(e, t)
        }, t.attr = function(e, t) {
            (e.ownerDocument || e) !== S && D(e);
            var n = w.attrHandle[t.toLowerCase()],
                s = n && Q.call(w.attrHandle, t.toLowerCase()) ? n(e, t, !O) : void 0;
            return void 0 !== s ? s : x.attributes || !O ? e.getAttribute(t) : (s = e.getAttributeNode(t)) && s.specified ? s.value : null
        }, t.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }, t.uniqueSort = function(e) {
            var t, n = [],
                s = 0,
                r = 0;
            if (N = !x.detectDuplicates, Z = !x.sortStable && e.slice(0), e.sort(X), N) {
                for (; t = e[r++];) t === e[r] && (s = n.push(r));
                for (; s--;) e.splice(n[s], 1)
            }
            return Z = null, e
        }, A = t.getText = function(e) {
            var t, n = "",
                s = 0,
                r = e.nodeType;
            if (r) {
                if (1 === r || 9 === r || 11 === r) {
                    if ("string" == typeof e.textContent) return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling) n += A(e)
                } else if (3 === r || 4 === r) return e.nodeValue
            } else
                for (; t = e[s++];) n += A(t);
            return n
        }, w = t.selectors = {
            cacheLength: 50,
            createPseudo: s,
            match: gt,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(xt, wt), e[3] = (e[3] || e[4] || e[5] || "").replace(xt, wt), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    return gt.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && dt.test(n) && (t = C(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(xt, wt).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    } : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = P[e + " "];
                    return t || (t = new RegExp("(^|" + rt + ")" + e + "(" + rt + "|$)")) && P(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== G && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(e, n, s) {
                    return function(r) {
                        var o = t.attr(r, e);
                        return null == o ? "!=" === n : n ? (o += "", "=" === n ? o === s : "!=" === n ? o !== s : "^=" === n ? s && 0 === o.indexOf(s) : "*=" === n ? s && o.indexOf(s) > -1 : "$=" === n ? s && o.slice(-s.length) === s : "~=" === n ? (" " + o + " ").indexOf(s) > -1 : "|=" === n ? o === s || o.slice(0, s.length + 1) === s + "-" : !1) : !0
                    }
                },
                CHILD: function(e, t, n, s, r) {
                    var o = "nth" !== e.slice(0, 3),
                        i = "last" !== e.slice(-4),
                        a = "of-type" === t;
                    return 1 === s && 0 === r ? function(e) {
                        return !!e.parentNode
                    } : function(t, n, l) {
                        var c, h, u, p, d, f, g = o !== i ? "nextSibling" : "previousSibling",
                            m = t.parentNode,
                            _ = a && t.nodeName.toLowerCase(),
                            y = !l && !a;
                        if (m) {
                            if (o) {
                                for (; g;) {
                                    for (u = t; u = u[g];)
                                        if (a ? u.nodeName.toLowerCase() === _ : 1 === u.nodeType) return !1;
                                    f = g = "only" === e && !f && "nextSibling"
                                }
                                return !0
                            }
                            if (f = [i ? m.firstChild : m.lastChild], i && y) {
                                for (h = m[q] || (m[q] = {}), c = h[e] || [], d = c[0] === R && c[1], p = c[0] === R && c[2], u = d && m.childNodes[d]; u = ++d && u && u[g] || (p = d = 0) || f.pop();)
                                    if (1 === u.nodeType && ++p && u === t) {
                                        h[e] = [R, d, p];
                                        break
                                    }
                            } else if (y && (c = (t[q] || (t[q] = {}))[e]) && c[0] === R) p = c[1];
                            else
                                for (;
                                    (u = ++d && u && u[g] || (p = d = 0) || f.pop()) && ((a ? u.nodeName.toLowerCase() !== _ : 1 !== u.nodeType) || !++p || (y && ((u[q] || (u[q] = {}))[e] = [R, p]), u !== t)););
                            return p -= r, p === s || p % s === 0 && p / s >= 0
                        }
                    }
                },
                PSEUDO: function(e, n) {
                    var r, o = w.pseudos[e] || w.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                    return o[q] ? o(n) : o.length > 1 ? (r = [e, e, "", n], w.setFilters.hasOwnProperty(e.toLowerCase()) ? s(function(e, t) {
                        for (var s, r = o(e, n), i = r.length; i--;) s = nt.call(e, r[i]), e[s] = !(t[s] = r[i])
                    }) : function(e) {
                        return o(e, 0, r)
                    }) : o
                }
            },
            pseudos: {
                not: s(function(e) {
                    var t = [],
                        n = [],
                        r = T(e.replace(ct, "$1"));
                    return r[q] ? s(function(e, t, n, s) {
                        for (var o, i = r(e, null, s, []), a = e.length; a--;)(o = i[a]) && (e[a] = !(t[a] = o))
                    }) : function(e, s, o) {
                        return t[0] = e, r(t, null, o, n), !n.pop()
                    }
                }),
                has: s(function(e) {
                    return function(n) {
                        return t(e, n).length > 0
                    }
                }),
                contains: s(function(e) {
                    return function(t) {
                        return (t.textContent || t.innerText || A(t)).indexOf(e) > -1
                    }
                }),
                lang: s(function(e) {
                    return ft.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(xt, wt).toLowerCase(),
                        function(t) {
                            var n;
                            do
                                if (n = O ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-");
                            while ((t = t.parentNode) && 1 === t.nodeType);
                            return !1
                        }
                }),
                target: function(t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                },
                root: function(e) {
                    return e === L
                },
                focus: function(e) {
                    return e === S.activeElement && (!S.hasFocus || S.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: function(e) {
                    return e.disabled === !1
                },
                disabled: function(e) {
                    return e.disabled === !0
                },
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6) return !1;
                    return !0
                },
                parent: function(e) {
                    return !w.pseudos.empty(e)
                },
                header: function(e) {
                    return _t.test(e.nodeName)
                },
                input: function(e) {
                    return mt.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: c(function() {
                    return [0]
                }),
                last: c(function(e, t) {
                    return [t - 1]
                }),
                eq: c(function(e, t, n) {
                    return [0 > n ? n + t : n]
                }),
                even: c(function(e, t) {
                    for (var n = 0; t > n; n += 2) e.push(n);
                    return e
                }),
                odd: c(function(e, t) {
                    for (var n = 1; t > n; n += 2) e.push(n);
                    return e
                }),
                lt: c(function(e, t, n) {
                    for (var s = 0 > n ? n + t : n; --s >= 0;) e.push(s);
                    return e
                }),
                gt: c(function(e, t, n) {
                    for (var s = 0 > n ? n + t : n; ++s < t;) e.push(s);
                    return e
                })
            }
        }, w.pseudos.nth = w.pseudos.eq;
        for (b in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) w.pseudos[b] = a(b);
        for (b in {
            submit: !0,
            reset: !0
        }) w.pseudos[b] = l(b);
        return u.prototype = w.filters = w.pseudos, w.setFilters = new u, C = t.tokenize = function(e, n) {
            var s, r, o, i, a, l, c, h = U[e + " "];
            if (h) return n ? 0 : h.slice(0);
            for (a = e, l = [], c = w.preFilter; a;) {
                (!s || (r = ht.exec(a))) && (r && (a = a.slice(r[0].length) || a), l.push(o = [])), s = !1, (r = ut.exec(a)) && (s = r.shift(), o.push({
                    value: s,
                    type: r[0].replace(ct, " ")
                }), a = a.slice(s.length));
                for (i in w.filter) !(r = gt[i].exec(a)) || c[i] && !(r = c[i](r)) || (s = r.shift(), o.push({
                    value: s,
                    type: i,
                    matches: r
                }), a = a.slice(s.length));
                if (!s) break
            }
            return n ? a.length : a ? t.error(e) : U(e, l).slice(0)
        }, T = t.compile = function(e, t) {
            var n, s = [],
                r = [],
                o = W[e + " "];
            if (!o) {
                for (t || (t = C(e)), n = t.length; n--;) o = y(t[n]), o[q] ? s.push(o) : r.push(o);
                o = W(e, v(r, s)), o.selector = e
            }
            return o
        }, k = t.select = function(e, t, n, s) {
            var r, o, i, a, l, c = "function" == typeof e && e,
                u = !s && C(e = c.selector || e);
            if (n = n || [], 1 === u.length) {
                if (o = u[0] = u[0].slice(0), o.length > 2 && "ID" === (i = o[0]).type && x.getById && 9 === t.nodeType && O && w.relative[o[1].type]) {
                    if (t = (w.find.ID(i.matches[0].replace(xt, wt), t) || [])[0], !t) return n;
                    c && (t = t.parentNode), e = e.slice(o.shift().value.length)
                }
                for (r = gt.needsContext.test(e) ? 0 : o.length; r-- && (i = o[r], !w.relative[a = i.type]);)
                    if ((l = w.find[a]) && (s = l(i.matches[0].replace(xt, wt), vt.test(o[0].type) && h(t.parentNode) || t))) {
                        if (o.splice(r, 1), e = s.length && p(o), !e) return et.apply(n, s), n;
                        break
                    }
            }
            return (c || T(e, u))(s, t, !O, n, vt.test(e) && h(t.parentNode) || t), n
        }, x.sortStable = q.split("").sort(X).join("") === q, x.detectDuplicates = !!N, D(), x.sortDetached = r(function(e) {
            return 1 & e.compareDocumentPosition(S.createElement("div"))
        }), r(function(e) {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || o("type|href|height|width", function(e, t, n) {
            return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), x.attributes && r(function(e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || o("value", function(e, t, n) {
            return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
        }), r(function(e) {
            return null == e.getAttribute("disabled")
        }) || o(st, function(e, t, n) {
            var s;
            return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (s = e.getAttributeNode(t)) && s.specified ? s.value : null
        }), t
    }(e);
    ot.find = ht, ot.expr = ht.selectors, ot.expr[":"] = ot.expr.pseudos, ot.unique = ht.uniqueSort, ot.text = ht.getText, ot.isXMLDoc = ht.isXML, ot.contains = ht.contains;
    var ut = ot.expr.match.needsContext,
        pt = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        dt = /^.[^:#\[\.,]*$/;
    ot.filter = function(e, t, n) {
        var s = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === s.nodeType ? ot.find.matchesSelector(s, e) ? [s] : [] : ot.find.matches(e, ot.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }, ot.fn.extend({
        find: function(e) {
            var t, n = [],
                s = this,
                r = s.length;
            if ("string" != typeof e) return this.pushStack(ot(e).filter(function() {
                for (t = 0; r > t; t++)
                    if (ot.contains(s[t], this)) return !0
            }));
            for (t = 0; r > t; t++) ot.find(e, s[t], n);
            return n = this.pushStack(r > 1 ? ot.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n
        },
        filter: function(e) {
            return this.pushStack(s(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(s(this, e || [], !0))
        },
        is: function(e) {
            return !!s(this, "string" == typeof e && ut.test(e) ? ot(e) : e || [], !1).length
        }
    });
    var ft, gt = e.document,
        mt = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        _t = ot.fn.init = function(e, t) {
            var n, s;
            if (!e) return this;
            if ("string" == typeof e) {
                if (n = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : mt.exec(e), !n || !n[1] && t) return !t || t.jquery ? (t || ft).find(e) : this.constructor(t).find(e);
                if (n[1]) {
                    if (t = t instanceof ot ? t[0] : t, ot.merge(this, ot.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : gt, !0)), pt.test(n[1]) && ot.isPlainObject(t))
                        for (n in t) ot.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                    return this
                }
                if (s = gt.getElementById(n[2]), s && s.parentNode) {
                    if (s.id !== n[2]) return ft.find(e);
                    this.length = 1, this[0] = s
                }
                return this.context = gt, this.selector = e, this
            }
            return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : ot.isFunction(e) ? "undefined" != typeof ft.ready ? ft.ready(e) : e(ot) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), ot.makeArray(e, this))
        };
    _t.prototype = ot.fn, ft = ot(gt);
    var yt = /^(?:parents|prev(?:Until|All))/,
        vt = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    ot.extend({
        dir: function(e, t, n) {
            for (var s = [], r = e[t]; r && 9 !== r.nodeType && (void 0 === n || 1 !== r.nodeType || !ot(r).is(n));) 1 === r.nodeType && s.push(r), r = r[t];
            return s
        },
        sibling: function(e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        }
    }), ot.fn.extend({
        has: function(e) {
            var t, n = ot(e, this),
                s = n.length;
            return this.filter(function() {
                for (t = 0; s > t; t++)
                    if (ot.contains(this, n[t])) return !0
            })
        },
        closest: function(e, t) {
            for (var n, s = 0, r = this.length, o = [], i = ut.test(e) || "string" != typeof e ? ot(e, t || this.context) : 0; r > s; s++)
                for (n = this[s]; n && n !== t; n = n.parentNode)
                    if (n.nodeType < 11 && (i ? i.index(n) > -1 : 1 === n.nodeType && ot.find.matchesSelector(n, e))) {
                        o.push(n);
                        break
                    }
            return this.pushStack(o.length > 1 ? ot.unique(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? ot.inArray(this[0], ot(e)) : ot.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(ot.unique(ot.merge(this.get(), ot(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), ot.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return ot.dir(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return ot.dir(e, "parentNode", n)
        },
        next: function(e) {
            return r(e, "nextSibling")
        },
        prev: function(e) {
            return r(e, "previousSibling")
        },
        nextAll: function(e) {
            return ot.dir(e, "nextSibling")
        },
        prevAll: function(e) {
            return ot.dir(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return ot.dir(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return ot.dir(e, "previousSibling", n)
        },
        siblings: function(e) {
            return ot.sibling((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return ot.sibling(e.firstChild)
        },
        contents: function(e) {
            return ot.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : ot.merge([], e.childNodes)
        }
    }, function(e, t) {
        ot.fn[e] = function(n, s) {
            var r = ot.map(this, t, n);
            return "Until" !== e.slice(-5) && (s = n), s && "string" == typeof s && (r = ot.filter(s, r)), this.length > 1 && (vt[e] || (r = ot.unique(r)), yt.test(e) && (r = r.reverse())), this.pushStack(r)
        }
    });
    var bt = /\S+/g,
        xt = {};
    ot.Callbacks = function(e) {
        e = "string" == typeof e ? xt[e] || o(e) : ot.extend({}, e);
        var t, n, s, r, i, a, l = [],
            c = !e.once && [],
            h = function(o) {
                for (n = e.memory && o, s = !0, i = a || 0, a = 0, r = l.length, t = !0; l && r > i; i++)
                    if (l[i].apply(o[0], o[1]) === !1 && e.stopOnFalse) {
                        n = !1;
                        break
                    }
                t = !1, l && (c ? c.length && h(c.shift()) : n ? l = [] : u.disable())
            },
            u = {
                add: function() {
                    if (l) {
                        var s = l.length;
                        ! function o(t) {
                            ot.each(t, function(t, n) {
                                var s = ot.type(n);
                                "function" === s ? e.unique && u.has(n) || l.push(n) : n && n.length && "string" !== s && o(n)
                            })
                        }(arguments), t ? r = l.length : n && (a = s, h(n))
                    }
                    return this
                },
                remove: function() {
                    return l && ot.each(arguments, function(e, n) {
                        for (var s;
                            (s = ot.inArray(n, l, s)) > -1;) l.splice(s, 1), t && (r >= s && r--, i >= s && i--)
                    }), this
                },
                has: function(e) {
                    return e ? ot.inArray(e, l) > -1 : !(!l || !l.length)
                },
                empty: function() {
                    return l = [], r = 0, this
                },
                disable: function() {
                    return l = c = n = void 0, this
                },
                disabled: function() {
                    return !l
                },
                lock: function() {
                    return c = void 0, n || u.disable(), this
                },
                locked: function() {
                    return !c
                },
                fireWith: function(e, n) {
                    return !l || s && !c || (n = n || [], n = [e, n.slice ? n.slice() : n], t ? c.push(n) : h(n)), this
                },
                fire: function() {
                    return u.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!s
                }
            };
        return u
    }, ot.extend({
        Deferred: function(e) {
            var t = [
                    ["resolve", "done", ot.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", ot.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", ot.Callbacks("memory")]
                ],
                n = "pending",
                s = {
                    state: function() {
                        return n
                    },
                    always: function() {
                        return r.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var e = arguments;
                        return ot.Deferred(function(n) {
                            ot.each(t, function(t, o) {
                                var i = ot.isFunction(e[t]) && e[t];
                                r[o[1]](function() {
                                    var e = i && i.apply(this, arguments);
                                    e && ot.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[o[0] + "With"](this === s ? n.promise() : this, i ? [e] : arguments)
                                })
                            }), e = null
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? ot.extend(e, s) : s
                    }
                },
                r = {};
            return s.pipe = s.then, ot.each(t, function(e, o) {
                var i = o[2],
                    a = o[3];
                s[o[1]] = i.add, a && i.add(function() {
                    n = a
                }, t[1 ^ e][2].disable, t[2][2].lock), r[o[0]] = function() {
                    return r[o[0] + "With"](this === r ? s : this, arguments), this
                }, r[o[0] + "With"] = i.fireWith
            }), s.promise(r), e && e.call(r, r), r
        },
        when: function(e) {
            var t = 0,
                n = Q.call(arguments),
                s = n.length,
                r = 1 !== s || e && ot.isFunction(e.promise) ? s : 0,
                o = 1 === r ? e : ot.Deferred(),
                i = function(e, t, n) {
                    return function(s) {
                        t[e] = this, n[e] = arguments.length > 1 ? Q.call(arguments) : s, n === a ? o.notifyWith(t, n) : --r || o.resolveWith(t, n)
                    }
                },
                a, l, c;
            if (s > 1)
                for (a = new Array(s), l = new Array(s), c = new Array(s); s > t; t++) n[t] && ot.isFunction(n[t].promise) ? n[t].promise().done(i(t, c, n)).fail(o.reject).progress(i(t, l, a)) : --r;
            return r || o.resolveWith(c, n), o.promise()
        }
    });
    var wt;
    ot.fn.ready = function(e) {
        return ot.ready.promise().done(e), this
    }, ot.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(e) {
            e ? ot.readyWait++ : ot.ready(!0)
        },
        ready: function(e) {
            if (e === !0 ? !--ot.readyWait : !ot.isReady) {
                if (!gt.body) return setTimeout(ot.ready);
                ot.isReady = !0, e !== !0 && --ot.readyWait > 0 || (wt.resolveWith(gt, [ot]), ot.fn.triggerHandler && (ot(gt).triggerHandler("ready"), ot(gt).off("ready")))
            }
        }
    }), ot.ready.promise = function(t) {
        if (!wt)
            if (wt = ot.Deferred(), "complete" === gt.readyState) setTimeout(ot.ready);
            else if (gt.addEventListener) gt.addEventListener("DOMContentLoaded", a, !1), e.addEventListener("load", a, !1);
        else {
            gt.attachEvent("onreadystatechange", a), e.attachEvent("onload", a);
            var n = !1;
            try {
                n = null == e.frameElement && gt.documentElement
            } catch (s) {}
            n && n.doScroll && ! function r() {
                if (!ot.isReady) {
                    try {
                        n.doScroll("left")
                    } catch (e) {
                        return setTimeout(r, 50)
                    }
                    i(), ot.ready()
                }
            }()
        }
        return wt.promise(t)
    };
    var At = "undefined",
        Et;
    for (Et in ot(st)) break;
    st.ownLast = "0" !== Et, st.inlineBlockNeedsLayout = !1, ot(function() {
            var e, t, n, s;
            n = gt.getElementsByTagName("body")[0], n && n.style && (t = gt.createElement("div"), s = gt.createElement("div"), s.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(s).appendChild(t), typeof t.style.zoom !== At && (t.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", st.inlineBlockNeedsLayout = e = 3 === t.offsetWidth, e && (n.style.zoom = 1)), n.removeChild(s))
        }),
        function() {
            var e = gt.createElement("div");
            if (null == st.deleteExpando) {
                st.deleteExpando = !0;
                try {
                    delete e.test
                } catch (t) {
                    st.deleteExpando = !1
                }
            }
            e = null
        }(), ot.acceptData = function(e) {
            var t = ot.noData[(e.nodeName + " ").toLowerCase()],
                n = +e.nodeType || 1;
            return 1 !== n && 9 !== n ? !1 : !t || t !== !0 && e.getAttribute("classid") === t
        };
    var Ct = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        Tt = /([A-Z])/g;
    ot.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(e) {
            return e = e.nodeType ? ot.cache[e[ot.expando]] : e[ot.expando], !!e && !c(e)
        },
        data: function(e, t, n) {
            return h(e, t, n)
        },
        removeData: function(e, t) {
            return u(e, t)
        },
        _data: function(e, t, n) {
            return h(e, t, n, !0)
        },
        _removeData: function(e, t) {
            return u(e, t, !0)
        }
    }), ot.fn.extend({
        data: function(e, t) {
            var n, s, r, o = this[0],
                i = o && o.attributes;
            if (void 0 === e) {
                if (this.length && (r = ot.data(o), 1 === o.nodeType && !ot._data(o, "parsedAttrs"))) {
                    for (n = i.length; n--;) i[n] && (s = i[n].name, 0 === s.indexOf("data-") && (s = ot.camelCase(s.slice(5)), l(o, s, r[s])));
                    ot._data(o, "parsedAttrs", !0)
                }
                return r
            }
            return "object" == typeof e ? this.each(function() {
                ot.data(this, e)
            }) : arguments.length > 1 ? this.each(function() {
                ot.data(this, e, t)
            }) : o ? l(o, e, ot.data(o, e)) : void 0
        },
        removeData: function(e) {
            return this.each(function() {
                ot.removeData(this, e)
            })
        }
    }), ot.extend({
        queue: function(e, t, n) {
            var s;
            return e ? (t = (t || "fx") + "queue", s = ot._data(e, t), n && (!s || ot.isArray(n) ? s = ot._data(e, t, ot.makeArray(n)) : s.push(n)), s || []) : void 0
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = ot.queue(e, t),
                s = n.length,
                r = n.shift(),
                o = ot._queueHooks(e, t),
                i = function() {
                    ot.dequeue(e, t)
                };
            "inprogress" === r && (r = n.shift(), s--), r && ("fx" === t && n.unshift("inprogress"), delete o.stop, r.call(e, i, o)), !s && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return ot._data(e, n) || ot._data(e, n, {
                empty: ot.Callbacks("once memory").add(function() {
                    ot._removeData(e, t + "queue"), ot._removeData(e, n)
                })
            })
        }
    }), ot.fn.extend({
        queue: function(e, t) {
            var n = 2;
            return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? ot.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                var n = ot.queue(this, e, t);
                ot._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && ot.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                ot.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, s = 1,
                r = ot.Deferred(),
                o = this,
                i = this.length,
                a = function() {
                    --s || r.resolveWith(o, [o])
                };
            for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; i--;) n = ot._data(o[i], e + "queueHooks"), n && n.empty && (s++, n.empty.add(a));
            return a(), r.promise(t)
        }
    });
    var kt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        zt = ["Top", "Right", "Bottom", "Left"],
        Zt = function(e, t) {
            return e = t || e, "none" === ot.css(e, "display") || !ot.contains(e.ownerDocument, e)
        },
        Nt = ot.access = function(e, t, n, s, r, o, i) {
            var a = 0,
                l = e.length,
                c = null == n;
            if ("object" === ot.type(n)) {
                r = !0;
                for (a in n) ot.access(e, t, a, n[a], !0, o, i)
            } else if (void 0 !== s && (r = !0, ot.isFunction(s) || (i = !0), c && (i ? (t.call(e, s), t = null) : (c = t, t = function(e, t, n) {
                return c.call(ot(e), n)
            })), t))
                for (; l > a; a++) t(e[a], n, i ? s : s.call(e[a], a, t(e[a], n)));
            return r ? e : c ? t.call(e) : l ? t(e[0], n) : o
        },
        $t = /^(?:checkbox|radio)$/i;
    ! function() {
        var e = gt.createElement("input"),
            t = gt.createElement("div"),
            n = gt.createDocumentFragment();
        if (t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", st.leadingWhitespace = 3 === t.firstChild.nodeType, st.tbody = !t.getElementsByTagName("tbody").length, st.htmlSerialize = !!t.getElementsByTagName("link").length, st.html5Clone = "<:nav></:nav>" !== gt.createElement("nav").cloneNode(!0).outerHTML, e.type = "checkbox", e.checked = !0, n.appendChild(e), st.appendChecked = e.checked, t.innerHTML = "<textarea>x</textarea>", st.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue, n.appendChild(t), t.innerHTML = "<input type='radio' checked='checked' name='t'/>", st.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, st.noCloneEvent = !0, t.attachEvent && (t.attachEvent("onclick", function() {
            st.noCloneEvent = !1
        }), t.cloneNode(!0).click()), null == st.deleteExpando) {
            st.deleteExpando = !0;
            try {
                delete t.test
            } catch (s) {
                st.deleteExpando = !1
            }
        }
    }(),
    function() {
        var t, n, s = gt.createElement("div");
        for (t in {
            submit: !0,
            change: !0,
            focusin: !0
        }) n = "on" + t, (st[t + "Bubbles"] = n in e) || (s.setAttribute(n, "t"), st[t + "Bubbles"] = s.attributes[n].expando === !1);
        s = null
    }();
    var Dt = /^(?:input|select|textarea)$/i,
        St = /^key/,
        Lt = /^(?:mouse|pointer|contextmenu)|click/,
        $ = /^(?:focusinfocus|focusoutblur)$/,
        Ot = /^([^.]*)(?:\.(.+)|)$/;
    ot.event = {
        global: {},
        add: function(e, t, n, s, r) {
            var o, i, a, l, c, h, u, p, d, f, g, m = ot._data(e);
            if (m) {
                for (n.handler && (l = n, n = l.handler, r = l.selector), n.guid || (n.guid = ot.guid++), (i = m.events) || (i = m.events = {}), (h = m.handle) || (h = m.handle = function(e) {
                    return typeof ot === At || e && ot.event.triggered === e.type ? void 0 : ot.event.dispatch.apply(h.elem, arguments)
                }, h.elem = e), t = (t || "").match(bt) || [""], a = t.length; a--;) o = Ot.exec(t[a]) || [], d = g = o[1], f = (o[2] || "").split(".").sort(), d && (c = ot.event.special[d] || {}, d = (r ? c.delegateType : c.bindType) || d, c = ot.event.special[d] || {}, u = ot.extend({
                    type: d,
                    origType: g,
                    data: s,
                    handler: n,
                    guid: n.guid,
                    selector: r,
                    needsContext: r && ot.expr.match.needsContext.test(r),
                    namespace: f.join(".")
                }, l), (p = i[d]) || (p = i[d] = [], p.delegateCount = 0, c.setup && c.setup.call(e, s, f, h) !== !1 || (e.addEventListener ? e.addEventListener(d, h, !1) : e.attachEvent && e.attachEvent("on" + d, h))), c.add && (c.add.call(e, u), u.handler.guid || (u.handler.guid = n.guid)), r ? p.splice(p.delegateCount++, 0, u) : p.push(u), ot.event.global[d] = !0);
                e = null
            }
        },
        remove: function(e, t, n, s, r) {
            var o, i, a, l, c, h, u, p, d, f, g, m = ot.hasData(e) && ot._data(e);
            if (m && (h = m.events)) {
                for (t = (t || "").match(bt) || [""], c = t.length; c--;)
                    if (a = Ot.exec(t[c]) || [], d = g = a[1], f = (a[2] || "").split(".").sort(), d) {
                        for (u = ot.event.special[d] || {}, d = (s ? u.delegateType : u.bindType) || d, p = h[d] || [], a = a[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = o = p.length; o--;) i = p[o], !r && g !== i.origType || n && n.guid !== i.guid || a && !a.test(i.namespace) || s && s !== i.selector && ("**" !== s || !i.selector) || (p.splice(o, 1), i.selector && p.delegateCount--, u.remove && u.remove.call(e, i));
                        l && !p.length && (u.teardown && u.teardown.call(e, f, m.handle) !== !1 || ot.removeEvent(e, d, m.handle), delete h[d])
                    } else
                        for (d in h) ot.event.remove(e, d + t[c], n, s, !0);
                ot.isEmptyObject(h) && (delete m.handle, ot._removeData(e, "events"))
            }
        },
        trigger: function(t, n, s, r) {
            var o, i, a, l, c, h, u, p = [s || gt],
                d = nt.call(t, "type") ? t.type : t,
                f = nt.call(t, "namespace") ? t.namespace.split(".") : [];
            if (a = h = s = s || gt, 3 !== s.nodeType && 8 !== s.nodeType && !$.test(d + ot.event.triggered) && (d.indexOf(".") >= 0 && (f = d.split("."), d = f.shift(), f.sort()), i = d.indexOf(":") < 0 && "on" + d, t = t[ot.expando] ? t : new ot.Event(d, "object" == typeof t && t), t.isTrigger = r ? 2 : 3, t.namespace = f.join("."), t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = s), n = null == n ? [t] : ot.makeArray(n, [t]), c = ot.event.special[d] || {}, r || !c.trigger || c.trigger.apply(s, n) !== !1)) {
                if (!r && !c.noBubble && !ot.isWindow(s)) {
                    for (l = c.delegateType || d, $.test(l + d) || (a = a.parentNode); a; a = a.parentNode) p.push(a), h = a;
                    h === (s.ownerDocument || gt) && p.push(h.defaultView || h.parentWindow || e)
                }
                for (u = 0;
                    (a = p[u++]) && !t.isPropagationStopped();) t.type = u > 1 ? l : c.bindType || d, o = (ot._data(a, "events") || {})[t.type] && ot._data(a, "handle"), o && o.apply(a, n), o = i && a[i], o && o.apply && ot.acceptData(a) && (t.result = o.apply(a, n), t.result === !1 && t.preventDefault());
                if (t.type = d, !r && !t.isDefaultPrevented() && (!c._default || c._default.apply(p.pop(), n) === !1) && ot.acceptData(s) && i && s[d] && !ot.isWindow(s)) {
                    h = s[i], h && (s[i] = null), ot.event.triggered = d;
                    try {
                        s[d]()
                    } catch (g) {}
                    ot.event.triggered = void 0, h && (s[i] = h)
                }
                return t.result
            }
        },
        dispatch: function(e) {
            e = ot.event.fix(e);
            var t, n, s, r, o, i = [],
                a = Q.call(arguments),
                l = (ot._data(this, "events") || {})[e.type] || [],
                c = ot.event.special[e.type] || {};
            if (a[0] = e, e.delegateTarget = this, !c.preDispatch || c.preDispatch.call(this, e) !== !1) {
                for (i = ot.event.handlers.call(this, e, l), t = 0;
                    (r = i[t++]) && !e.isPropagationStopped();)
                    for (e.currentTarget = r.elem, o = 0;
                        (s = r.handlers[o++]) && !e.isImmediatePropagationStopped();)(!e.namespace_re || e.namespace_re.test(s.namespace)) && (e.handleObj = s, e.data = s.data, n = ((ot.event.special[s.origType] || {}).handle || s.handler).apply(r.elem, a), void 0 !== n && (e.result = n) === !1 && (e.preventDefault(), e.stopPropagation()));
                return c.postDispatch && c.postDispatch.call(this, e), e.result
            }
        },
        handlers: function(e, t) {
            var n, s, r, o, i = [],
                a = t.delegateCount,
                l = e.target;
            if (a && l.nodeType && (!e.button || "click" !== e.type))
                for (; l != this; l = l.parentNode || this)
                    if (1 === l.nodeType && (l.disabled !== !0 || "click" !== e.type)) {
                        for (r = [], o = 0; a > o; o++) s = t[o], n = s.selector + " ", void 0 === r[n] && (r[n] = s.needsContext ? ot(n, this).index(l) >= 0 : ot.find(n, this, null, [l]).length), r[n] && r.push(s);
                        r.length && i.push({
                            elem: l,
                            handlers: r
                        })
                    }
            return a < t.length && i.push({
                elem: this,
                handlers: t.slice(a)
            }), i
        },
        fix: function(e) {
            if (e[ot.expando]) return e;
            var t, n, s, r = e.type,
                o = e,
                i = this.fixHooks[r];
            for (i || (this.fixHooks[r] = i = Lt.test(r) ? this.mouseHooks : St.test(r) ? this.keyHooks : {}), s = i.props ? this.props.concat(i.props) : this.props, e = new ot.Event(o), t = s.length; t--;) n = s[t], e[n] = o[n];
            return e.target || (e.target = o.srcElement || gt), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, i.filter ? i.filter(e, o) : e
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(e, t) {
                var n, s, r, o = t.button,
                    i = t.fromElement;
                return null == e.pageX && null != t.clientX && (s = e.target.ownerDocument || gt, r = s.documentElement, n = s.body, e.pageX = t.clientX + (r && r.scrollLeft || n && n.scrollLeft || 0) - (r && r.clientLeft || n && n.clientLeft || 0), e.pageY = t.clientY + (r && r.scrollTop || n && n.scrollTop || 0) - (r && r.clientTop || n && n.clientTop || 0)), !e.relatedTarget && i && (e.relatedTarget = i === e.target ? t.toElement : i), e.which || void 0 === o || (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0), e
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== f() && this.focus) try {
                        return this.focus(), !1
                    } catch (e) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === f() && this.blur ? (this.blur(), !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return ot.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                },
                _default: function(e) {
                    return ot.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function(e, t, n, s) {
            var r = ot.extend(new ot.Event, n, {
                type: e,
                isSimulated: !0,
                originalEvent: {}
            });
            s ? ot.event.trigger(r, null, t) : ot.event.dispatch.call(t, r), r.isDefaultPrevented() && n.preventDefault()
        }
    }, ot.removeEvent = gt.removeEventListener ? function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n, !1)
    } : function(e, t, n) {
        var s = "on" + t;
        e.detachEvent && (typeof e[s] === At && (e[s] = null), e.detachEvent(s, n))
    }, ot.Event = function(e, t) {
        return this instanceof ot.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? p : d) : this.type = e, t && ot.extend(this, t), this.timeStamp = e && e.timeStamp || ot.now(), void(this[ot.expando] = !0)) : new ot.Event(e, t)
    }, ot.Event.prototype = {
        isDefaultPrevented: d,
        isPropagationStopped: d,
        isImmediatePropagationStopped: d,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = p, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = p, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = p, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, ot.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, t) {
        ot.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n, s = this,
                    r = e.relatedTarget,
                    o = e.handleObj;
                return (!r || r !== s && !ot.contains(s, r)) && (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
            }
        }
    }), st.submitBubbles || (ot.event.special.submit = {
        setup: function() {
            return ot.nodeName(this, "form") ? !1 : void ot.event.add(this, "click._submit keypress._submit", function(e) {
                var t = e.target,
                    n = ot.nodeName(t, "input") || ot.nodeName(t, "button") ? t.form : void 0;
                n && !ot._data(n, "submitBubbles") && (ot.event.add(n, "submit._submit", function(e) {
                    e._submit_bubble = !0
                }), ot._data(n, "submitBubbles", !0))
            })
        },
        postDispatch: function(e) {
            e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && ot.event.simulate("submit", this.parentNode, e, !0))
        },
        teardown: function() {
            return ot.nodeName(this, "form") ? !1 : void ot.event.remove(this, "._submit")
        }
    }), st.changeBubbles || (ot.event.special.change = {
        setup: function() {
            return Dt.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (ot.event.add(this, "propertychange._change", function(e) {
                "checked" === e.originalEvent.propertyName && (this._just_changed = !0)
            }), ot.event.add(this, "click._change", function(e) {
                this._just_changed && !e.isTrigger && (this._just_changed = !1), ot.event.simulate("change", this, e, !0)
            })), !1) : void ot.event.add(this, "beforeactivate._change", function(e) {
                var t = e.target;
                Dt.test(t.nodeName) && !ot._data(t, "changeBubbles") && (ot.event.add(t, "change._change", function(e) {
                    !this.parentNode || e.isSimulated || e.isTrigger || ot.event.simulate("change", this.parentNode, e, !0)
                }), ot._data(t, "changeBubbles", !0))
            })
        },
        handle: function(e) {
            var t = e.target;
            return this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type ? e.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function() {
            return ot.event.remove(this, "._change"), !Dt.test(this.nodeName)
        }
    }), st.focusinBubbles || ot.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var n = function(e) {
            ot.event.simulate(t, e.target, ot.event.fix(e), !0)
        };
        ot.event.special[t] = {
            setup: function() {
                var s = this.ownerDocument || this,
                    r = ot._data(s, t);
                r || s.addEventListener(e, n, !0), ot._data(s, t, (r || 0) + 1)
            },
            teardown: function() {
                var s = this.ownerDocument || this,
                    r = ot._data(s, t) - 1;
                r ? ot._data(s, t, r) : (s.removeEventListener(e, n, !0), ot._removeData(s, t))
            }
        }
    }), ot.fn.extend({
        on: function(e, t, n, s, r) {
            var o, i;
            if ("object" == typeof e) {
                "string" != typeof t && (n = n || t, t = void 0);
                for (o in e) this.on(o, t, n, e[o], r);
                return this
            }
            if (null == n && null == s ? (s = t, n = t = void 0) : null == s && ("string" == typeof t ? (s = n, n = void 0) : (s = n, n = t, t = void 0)), s === !1) s = d;
            else if (!s) return this;
            return 1 === r && (i = s, s = function(e) {
                return ot().off(e), i.apply(this, arguments)
            }, s.guid = i.guid || (i.guid = ot.guid++)), this.each(function() {
                ot.event.add(this, e, s, n, t)
            })
        },
        one: function(e, t, n, s) {
            return this.on(e, t, n, s, 1)
        },
        off: function(e, t, n) {
            var s, r;
            if (e && e.preventDefault && e.handleObj) return s = e.handleObj, ot(e.delegateTarget).off(s.namespace ? s.origType + "." + s.namespace : s.origType, s.selector, s.handler), this;
            if ("object" == typeof e) {
                for (r in e) this.off(r, t, e[r]);
                return this
            }
            return (t === !1 || "function" == typeof t) && (n = t, t = void 0), n === !1 && (n = d), this.each(function() {
                ot.event.remove(this, e, n, t)
            })
        },
        trigger: function(e, t) {
            return this.each(function() {
                ot.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            return n ? ot.event.trigger(e, t, n, !0) : void 0
        }
    });
    var Ft = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        It = / jQuery\d+="(?:null|\d+)"/g,
        jt = new RegExp("<(?:" + Ft + ")[\\s/>]", "i"),
        Mt = /^\s+/,
        qt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        Ht = /<([\w:]+)/,
        Rt = /<tbody/i,
        Bt = /<|&#?\w+;/,
        Pt = /<(?:script|style|link)/i,
        Ut = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Wt = /^$|\/(?:java|ecma)script/i,
        Xt = /^true\/(.*)/,
        Gt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        Yt = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: st.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        },
        Qt = g(gt),
        Vt = Qt.appendChild(gt.createElement("div"));
    Yt.optgroup = Yt.option, Yt.tbody = Yt.tfoot = Yt.colgroup = Yt.caption = Yt.thead, Yt.th = Yt.td, ot.extend({
        clone: function(e, t, n) {
            var s, r, o, i, a, l = ot.contains(e.ownerDocument, e);
            if (st.html5Clone || ot.isXMLDoc(e) || !jt.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (Vt.innerHTML = e.outerHTML, Vt.removeChild(o = Vt.firstChild)), !(st.noCloneEvent && st.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || ot.isXMLDoc(e)))
                for (s = m(o), a = m(e), i = 0; null != (r = a[i]); ++i) s[i] && A(r, s[i]);
            if (t)
                if (n)
                    for (a = a || m(e), s = s || m(o), i = 0; null != (r = a[i]); i++) w(r, s[i]);
                else w(e, o);
            return s = m(o, "script"), s.length > 0 && x(s, !l && m(e, "script")), s = a = r = null, o
        },
        buildFragment: function(e, t, n, s) {
            for (var r, o, i, a, l, c, h, u = e.length, p = g(t), d = [], f = 0; u > f; f++)
                if (o = e[f], o || 0 === o)
                    if ("object" === ot.type(o)) ot.merge(d, o.nodeType ? [o] : o);
                    else if (Bt.test(o)) {
                for (a = a || p.appendChild(t.createElement("div")), l = (Ht.exec(o) || ["", ""])[1].toLowerCase(), h = Yt[l] || Yt._default, a.innerHTML = h[1] + o.replace(qt, "<$1></$2>") + h[2], r = h[0]; r--;) a = a.lastChild;
                if (!st.leadingWhitespace && Mt.test(o) && d.push(t.createTextNode(Mt.exec(o)[0])), !st.tbody)
                    for (o = "table" !== l || Rt.test(o) ? "<table>" !== h[1] || Rt.test(o) ? 0 : a : a.firstChild, r = o && o.childNodes.length; r--;) ot.nodeName(c = o.childNodes[r], "tbody") && !c.childNodes.length && o.removeChild(c);
                for (ot.merge(d, a.childNodes), a.textContent = ""; a.firstChild;) a.removeChild(a.firstChild);
                a = p.lastChild
            } else d.push(t.createTextNode(o));
            for (a && p.removeChild(a), st.appendChecked || ot.grep(m(d, "input"), _), f = 0; o = d[f++];)
                if ((!s || -1 === ot.inArray(o, s)) && (i = ot.contains(o.ownerDocument, o), a = m(p.appendChild(o), "script"), i && x(a), n))
                    for (r = 0; o = a[r++];) Wt.test(o.type || "") && n.push(o);
            return a = null, p
        },
        cleanData: function(e, t) {
            for (var n, s, r, o, i = 0, a = ot.expando, l = ot.cache, c = st.deleteExpando, h = ot.event.special; null != (n = e[i]); i++)
                if ((t || ot.acceptData(n)) && (r = n[a], o = r && l[r])) {
                    if (o.events)
                        for (s in o.events) h[s] ? ot.event.remove(n, s) : ot.removeEvent(n, s, o.handle);
                    l[r] && (delete l[r], c ? delete n[a] : typeof n.removeAttribute !== At ? n.removeAttribute(a) : n[a] = null, Y.push(r))
                }
        }
    }), ot.fn.extend({
        text: function(e) {
            return Nt(this, function(e) {
                return void 0 === e ? ot.text(this) : this.empty().append((this[0] && this[0].ownerDocument || gt).createTextNode(e))
            }, null, e, arguments.length)
        },
        append: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = y(this, e);
                    t.appendChild(e)
                }
            })
        },
        prepend: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = y(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        remove: function(e, t) {
            for (var n, s = e ? ot.filter(e, this) : this, r = 0; null != (n = s[r]); r++) t || 1 !== n.nodeType || ot.cleanData(m(n)), n.parentNode && (t && ot.contains(n.ownerDocument, n) && x(m(n, "script")), n.parentNode.removeChild(n));
            return this
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++) {
                for (1 === e.nodeType && ot.cleanData(m(e, !1)); e.firstChild;) e.removeChild(e.firstChild);
                e.options && ot.nodeName(e, "select") && (e.options.length = 0)
            }
            return this
        },
        clone: function(e, t) {
            return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function() {
                return ot.clone(this, e, t)
            })
        },
        html: function(e) {
            return Nt(this, function(e) {
                var t = this[0] || {},
                    n = 0,
                    s = this.length;
                if (void 0 === e) return 1 === t.nodeType ? t.innerHTML.replace(It, "") : void 0;
                if (!("string" != typeof e || Pt.test(e) || !st.htmlSerialize && jt.test(e) || !st.leadingWhitespace && Mt.test(e) || Yt[(Ht.exec(e) || ["", ""])[1].toLowerCase()])) {
                    e = e.replace(qt, "<$1></$2>");
                    try {
                        for (; s > n; n++) t = this[n] || {}, 1 === t.nodeType && (ot.cleanData(m(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (r) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var e = arguments[0];
            return this.domManip(arguments, function(t) {
                e = this.parentNode, ot.cleanData(m(this)), e && e.replaceChild(t, this)
            }), e && (e.length || e.nodeType) ? this : this.remove()
        },
        detach: function(e) {
            return this.remove(e, !0)
        },
        domManip: function(e, t) {
            e = V.apply([], e);
            var n, s, r, o, i, a, l = 0,
                c = this.length,
                h = this,
                u = c - 1,
                p = e[0],
                d = ot.isFunction(p);
            if (d || c > 1 && "string" == typeof p && !st.checkClone && Ut.test(p)) return this.each(function(n) {
                var s = h.eq(n);
                d && (e[0] = p.call(this, n, s.html())), s.domManip(e, t)
            });
            if (c && (a = ot.buildFragment(e, this[0].ownerDocument, !1, this), n = a.firstChild, 1 === a.childNodes.length && (a = n), n)) {
                for (o = ot.map(m(a, "script"), v), r = o.length; c > l; l++) s = a, l !== u && (s = ot.clone(s, !0, !0), r && ot.merge(o, m(s, "script"))), t.call(this[l], s, l);
                if (r)
                    for (i = o[o.length - 1].ownerDocument, ot.map(o, b), l = 0; r > l; l++) s = o[l], Wt.test(s.type || "") && !ot._data(s, "globalEval") && ot.contains(i, s) && (s.src ? ot._evalUrl && ot._evalUrl(s.src) : ot.globalEval((s.text || s.textContent || s.innerHTML || "").replace(Gt, "")));
                a = n = null
            }
            return this
        }
    }), ot.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        ot.fn[e] = function(e) {
            for (var n, s = 0, r = [], o = ot(e), i = o.length - 1; i >= s; s++) n = s === i ? this : this.clone(!0), ot(o[s])[t](n), K.apply(r, n.get());
            return this.pushStack(r)
        }
    });
    var Kt, Jt = {};
    ! function() {
        var e;
        st.shrinkWrapBlocks = function() {
            if (null != e) return e;
            e = !1;
            var t, n, s;
            return n = gt.getElementsByTagName("body")[0], n && n.style ? (t = gt.createElement("div"), s = gt.createElement("div"), s.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(s).appendChild(t), typeof t.style.zoom !== At && (t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", t.appendChild(gt.createElement("div")).style.width = "5px", e = 3 !== t.offsetWidth), n.removeChild(s), e) : void 0
        }
    }();
    var en = /^margin/,
        tn = new RegExp("^(" + kt + ")(?!px)[a-z%]+$", "i"),
        nn, sn, rn = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (nn = function(e) {
        return e.ownerDocument.defaultView.getComputedStyle(e, null)
    }, sn = function(e, t, n) {
        var s, r, o, i, a = e.style;
        return n = n || nn(e), i = n ? n.getPropertyValue(t) || n[t] : void 0, n && ("" !== i || ot.contains(e.ownerDocument, e) || (i = ot.style(e, t)), tn.test(i) && en.test(t) && (s = a.width, r = a.minWidth, o = a.maxWidth, a.minWidth = a.maxWidth = a.width = i, i = n.width, a.width = s, a.minWidth = r, a.maxWidth = o)), void 0 === i ? i : i + ""
    }) : gt.documentElement.currentStyle && (nn = function(e) {
        return e.currentStyle
    }, sn = function(e, t, n) {
        var s, r, o, i, a = e.style;
        return n = n || nn(e), i = n ? n[t] : void 0, null == i && a && a[t] && (i = a[t]), tn.test(i) && !rn.test(t) && (s = a.left, r = e.runtimeStyle, o = r && r.left, o && (r.left = e.currentStyle.left), a.left = "fontSize" === t ? "1em" : i, i = a.pixelLeft + "px", a.left = s, o && (r.left = o)), void 0 === i ? i : i + "" || "auto"
    }), ! function() {
        function t() {
            var t, n, s, r;
            n = gt.getElementsByTagName("body")[0], n && n.style && (t = gt.createElement("div"), s = gt.createElement("div"), s.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(s).appendChild(t), t.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", o = i = !1, l = !0, e.getComputedStyle && (o = "1%" !== (e.getComputedStyle(t, null) || {}).top, i = "4px" === (e.getComputedStyle(t, null) || {
                width: "4px"
            }).width, r = t.appendChild(gt.createElement("div")), r.style.cssText = t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", r.style.marginRight = r.style.width = "0", t.style.width = "1px", l = !parseFloat((e.getComputedStyle(r, null) || {}).marginRight)), t.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", r = t.getElementsByTagName("td"), r[0].style.cssText = "margin:0;border:0;padding:0;display:none", a = 0 === r[0].offsetHeight, a && (r[0].style.display = "", r[1].style.display = "none", a = 0 === r[0].offsetHeight), n.removeChild(s))
        }
        var n, s, r, o, i, a, l;
        n = gt.createElement("div"), n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", r = n.getElementsByTagName("a")[0], (s = r && r.style) && (s.cssText = "float:left;opacity:.5", st.opacity = "0.5" === s.opacity, st.cssFloat = !!s.cssFloat, n.style.backgroundClip = "content-box", n.cloneNode(!0).style.backgroundClip = "", st.clearCloneStyle = "content-box" === n.style.backgroundClip, st.boxSizing = "" === s.boxSizing || "" === s.MozBoxSizing || "" === s.WebkitBoxSizing, ot.extend(st, {
            reliableHiddenOffsets: function() {
                return null == a && t(), a
            },
            boxSizingReliable: function() {
                return null == i && t(), i
            },
            pixelPosition: function() {
                return null == o && t(), o
            },
            reliableMarginRight: function() {
                return null == l && t(), l
            }
        }))
    }(), ot.swap = function(e, t, n, s) {
        var r, o, i = {};
        for (o in t) i[o] = e.style[o], e.style[o] = t[o];
        r = n.apply(e, s || []);
        for (o in t) e.style[o] = i[o];
        return r
    };
    var on = /alpha\([^)]*\)/i,
        an = /opacity\s*=\s*([^)]*)/,
        ln = /^(none|table(?!-c[ea]).+)/,
        cn = new RegExp("^(" + kt + ")(.*)$", "i"),
        hn = new RegExp("^([+-])=(" + kt + ")", "i"),
        un = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        pn = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        dn = ["Webkit", "O", "Moz", "ms"];
    ot.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = sn(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": st.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(e, t, n, s) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var r, o, i, a = ot.camelCase(t),
                    l = e.style;
                if (t = ot.cssProps[a] || (ot.cssProps[a] = k(l, a)), i = ot.cssHooks[t] || ot.cssHooks[a], void 0 === n) return i && "get" in i && void 0 !== (r = i.get(e, !1, s)) ? r : l[t];
                if (o = typeof n, "string" === o && (r = hn.exec(n)) && (n = (r[1] + 1) * r[2] + parseFloat(ot.css(e, t)), o = "number"), null != n && n === n && ("number" !== o || ot.cssNumber[a] || (n += "px"), st.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), !(i && "set" in i && void 0 === (n = i.set(e, n, s))))) try {
                    l[t] = n
                } catch (c) {}
            }
        },
        css: function(e, t, n, s) {
            var r, o, i, a = ot.camelCase(t);
            return t = ot.cssProps[a] || (ot.cssProps[a] = k(e.style, a)), i = ot.cssHooks[t] || ot.cssHooks[a], i && "get" in i && (o = i.get(e, !0, n)), void 0 === o && (o = sn(e, t, s)), "normal" === o && t in pn && (o = pn[t]), "" === n || n ? (r = parseFloat(o), n === !0 || ot.isNumeric(r) ? r || 0 : o) : o
        }
    }), ot.each(["height", "width"], function(e, t) {
        ot.cssHooks[t] = {
            get: function(e, n, s) {
                return n ? ln.test(ot.css(e, "display")) && 0 === e.offsetWidth ? ot.swap(e, un, function() {
                    return D(e, t, s)
                }) : D(e, t, s) : void 0
            },
            set: function(e, n, s) {
                var r = s && nn(e);
                return Z(e, n, s ? N(e, t, s, st.boxSizing && "border-box" === ot.css(e, "boxSizing", !1, r), r) : 0)
            }
        }
    }), st.opacity || (ot.cssHooks.opacity = {
        get: function(e, t) {
            return an.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        },
        set: function(e, t) {
            var n = e.style,
                s = e.currentStyle,
                r = ot.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                o = s && s.filter || n.filter || "";
            n.zoom = 1, (t >= 1 || "" === t) && "" === ot.trim(o.replace(on, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || s && !s.filter) || (n.filter = on.test(o) ? o.replace(on, r) : o + " " + r)
        }
    }), ot.cssHooks.marginRight = T(st.reliableMarginRight, function(e, t) {
        return t ? ot.swap(e, {
            display: "inline-block"
        }, sn, [e, "marginRight"]) : void 0
    }), ot.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        ot.cssHooks[e + t] = {
            expand: function(n) {
                for (var s = 0, r = {}, o = "string" == typeof n ? n.split(" ") : [n]; 4 > s; s++) r[e + zt[s] + t] = o[s] || o[s - 2] || o[0];
                return r
            }
        }, en.test(e) || (ot.cssHooks[e + t].set = Z)
    }), ot.fn.extend({
        css: function(e, t) {
            return Nt(this, function(e, t, n) {
                var s, r, o = {},
                    i = 0;
                if (ot.isArray(t)) {
                    for (s = nn(e), r = t.length; r > i; i++) o[t[i]] = ot.css(e, t[i], !1, s);
                    return o
                }
                return void 0 !== n ? ot.style(e, t, n) : ot.css(e, t)
            }, e, t, arguments.length > 1)
        },
        show: function() {
            return z(this, !0)
        },
        hide: function() {
            return z(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                Zt(this) ? ot(this).show() : ot(this).hide()
            })
        }
    }), ot.Tween = S, S.prototype = {
        constructor: S,
        init: function(e, t, n, s, r, o) {
            this.elem = e, this.prop = n, this.easing = r || "swing", this.options = t, this.start = this.now = this.cur(), this.end = s, this.unit = o || (ot.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = S.propHooks[this.prop];
            return e && e.get ? e.get(this) : S.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = S.propHooks[this.prop];
            return this.pos = t = this.options.duration ? ot.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : S.propHooks._default.set(this), this
        }
    }, S.prototype.init.prototype = S.prototype, S.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = ot.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
            },
            set: function(e) {
                ot.fx.step[e.prop] ? ot.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[ot.cssProps[e.prop]] || ot.cssHooks[e.prop]) ? ot.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
            }
        }
    }, S.propHooks.scrollTop = S.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, ot.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        }
    }, ot.fx = S.prototype.init, ot.fx.step = {};
    var fn, gn, mn = /^(?:toggle|show|hide)$/,
        _n = new RegExp("^(?:([+-])=|)(" + kt + ")([a-z%]*)$", "i"),
        yn = /queueHooks$/,
        vn = [I],
        bn = {
            "*": [function(e, t) {
                var n = this.createTween(e, t),
                    s = n.cur(),
                    r = _n.exec(t),
                    o = r && r[3] || (ot.cssNumber[e] ? "" : "px"),
                    i = (ot.cssNumber[e] || "px" !== o && +s) && _n.exec(ot.css(n.elem, e)),
                    a = 1,
                    l = 20;
                if (i && i[3] !== o) {
                    o = o || i[3], r = r || [], i = +s || 1;
                    do a = a || ".5", i /= a, ot.style(n.elem, e, i + o); while (a !== (a = n.cur() / s) && 1 !== a && --l)
                }
                return r && (i = n.start = +i || +s || 0, n.unit = o, n.end = r[1] ? i + (r[1] + 1) * r[2] : +r[2]), n
            }]
        };
    ot.Animation = ot.extend(M, {
            tweener: function(e, t) {
                ot.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
                for (var n, s = 0, r = e.length; r > s; s++) n = e[s], bn[n] = bn[n] || [], bn[n].unshift(t)
            },
            prefilter: function(e, t) {
                t ? vn.unshift(e) : vn.push(e)
            }
        }), ot.speed = function(e, t, n) {
            var s = e && "object" == typeof e ? ot.extend({}, e) : {
                complete: n || !n && t || ot.isFunction(e) && e,
                duration: e,
                easing: n && t || t && !ot.isFunction(t) && t
            };
            return s.duration = ot.fx.off ? 0 : "number" == typeof s.duration ? s.duration : s.duration in ot.fx.speeds ? ot.fx.speeds[s.duration] : ot.fx.speeds._default, (null == s.queue || s.queue === !0) && (s.queue = "fx"), s.old = s.complete, s.complete = function() {
                ot.isFunction(s.old) && s.old.call(this), s.queue && ot.dequeue(this, s.queue)
            }, s
        }, ot.fn.extend({
            fadeTo: function(e, t, n, s) {
                return this.filter(Zt).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, n, s)
            },
            animate: function(e, t, n, s) {
                var r = ot.isEmptyObject(e),
                    o = ot.speed(t, n, s),
                    i = function() {
                        var t = M(this, ot.extend({}, e), o);
                        (r || ot._data(this, "finish")) && t.stop(!0)
                    };
                return i.finish = i, r || o.queue === !1 ? this.each(i) : this.queue(o.queue, i)
            },
            stop: function(e, t, n) {
                var s = function(e) {
                    var t = e.stop;
                    delete e.stop, t(n)
                };
                return "string" != typeof e && (n = t, t = e, e = void 0), t && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                    var t = !0,
                        r = null != e && e + "queueHooks",
                        o = ot.timers,
                        i = ot._data(this);
                    if (r) i[r] && i[r].stop && s(i[r]);
                    else
                        for (r in i) i[r] && i[r].stop && yn.test(r) && s(i[r]);
                    for (r = o.length; r--;) o[r].elem !== this || null != e && o[r].queue !== e || (o[r].anim.stop(n), t = !1, o.splice(r, 1));
                    (t || !n) && ot.dequeue(this, e)
                })
            },
            finish: function(e) {
                return e !== !1 && (e = e || "fx"), this.each(function() {
                    var t, n = ot._data(this),
                        s = n[e + "queue"],
                        r = n[e + "queueHooks"],
                        o = ot.timers,
                        i = s ? s.length : 0;
                    for (n.finish = !0, ot.queue(this, e, []), r && r.stop && r.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                    for (t = 0; i > t; t++) s[t] && s[t].finish && s[t].finish.call(this);
                    delete n.finish
                })
            }
        }), ot.each(["toggle", "show", "hide"], function(e, t) {
            var n = ot.fn[t];
            ot.fn[t] = function(e, s, r) {
                return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(O(t, !0), e, s, r)
            }
        }), ot.each({
            slideDown: O("show"),
            slideUp: O("hide"),
            slideToggle: O("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(e, t) {
            ot.fn[e] = function(e, n, s) {
                return this.animate(t, e, n, s)
            }
        }), ot.timers = [], ot.fx.tick = function() {
            var e, t = ot.timers,
                n = 0;
            for (fn = ot.now(); n < t.length; n++) e = t[n], e() || t[n] !== e || t.splice(n--, 1);
            t.length || ot.fx.stop(), fn = void 0
        }, ot.fx.timer = function(e) {
            ot.timers.push(e), e() ? ot.fx.start() : ot.timers.pop()
        }, ot.fx.interval = 13, ot.fx.start = function() {
            gn || (gn = setInterval(ot.fx.tick, ot.fx.interval))
        }, ot.fx.stop = function() {
            clearInterval(gn), gn = null
        }, ot.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, ot.fn.delay = function(e, t) {
            return e = ot.fx ? ot.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
                var s = setTimeout(t, e);
                n.stop = function() {
                    clearTimeout(s)
                }
            })
        },
        function() {
            var e, t, n, s, r;
            t = gt.createElement("div"), t.setAttribute("className", "t"), t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", s = t.getElementsByTagName("a")[0], n = gt.createElement("select"), r = n.appendChild(gt.createElement("option")), e = t.getElementsByTagName("input")[0], s.style.cssText = "top:1px", st.getSetAttribute = "t" !== t.className, st.style = /top/.test(s.getAttribute("style")), st.hrefNormalized = "/a" === s.getAttribute("href"), st.checkOn = !!e.value, st.optSelected = r.selected, st.enctype = !!gt.createElement("form").enctype, n.disabled = !0, st.optDisabled = !r.disabled, e = gt.createElement("input"), e.setAttribute("value", ""), st.input = "" === e.getAttribute("value"), e.value = "t", e.setAttribute("type", "radio"), st.radioValue = "t" === e.value
        }();
    var xn = /\r/g;
    ot.fn.extend({
        val: function(e) {
            var t, n, s, r = this[0];
            return arguments.length ? (s = ot.isFunction(e), this.each(function(n) {
                var r;
                1 === this.nodeType && (r = s ? e.call(this, n, ot(this).val()) : e, null == r ? r = "" : "number" == typeof r ? r += "" : ot.isArray(r) && (r = ot.map(r, function(e) {
                    return null == e ? "" : e + ""
                })), t = ot.valHooks[this.type] || ot.valHooks[this.nodeName.toLowerCase()], t && "set" in t && void 0 !== t.set(this, r, "value") || (this.value = r))
            })) : r ? (t = ot.valHooks[r.type] || ot.valHooks[r.nodeName.toLowerCase()], t && "get" in t && void 0 !== (n = t.get(r, "value")) ? n : (n = r.value, "string" == typeof n ? n.replace(xn, "") : null == n ? "" : n)) : void 0
        }
    }), ot.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = ot.find.attr(e, "value");
                    return null != t ? t : ot.trim(ot.text(e))
                }
            },
            select: {
                get: function(e) {
                    for (var t, n, s = e.options, r = e.selectedIndex, o = "select-one" === e.type || 0 > r, i = o ? null : [], a = o ? r + 1 : s.length, l = 0 > r ? a : o ? r : 0; a > l; l++)
                        if (n = s[l], !(!n.selected && l !== r || (st.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && ot.nodeName(n.parentNode, "optgroup"))) {
                            if (t = ot(n).val(), o) return t;
                            i.push(t)
                        }
                    return i
                },
                set: function(e, t) {
                    for (var n, s, r = e.options, o = ot.makeArray(t), i = r.length; i--;)
                        if (s = r[i], ot.inArray(ot.valHooks.option.get(s), o) >= 0) try {
                            s.selected = n = !0
                        } catch (a) {
                            s.scrollHeight
                        } else s.selected = !1;
                    return n || (e.selectedIndex = -1), r
                }
            }
        }
    }), ot.each(["radio", "checkbox"], function() {
        ot.valHooks[this] = {
            set: function(e, t) {
                return ot.isArray(t) ? e.checked = ot.inArray(ot(e).val(), t) >= 0 : void 0
            }
        }, st.checkOn || (ot.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    });
    var wn, An, En = ot.expr.attrHandle,
        Cn = /^(?:checked|selected)$/i,
        Tn = st.getSetAttribute,
        kn = st.input;
    ot.fn.extend({
        attr: function(e, t) {
            return Nt(this, ot.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                ot.removeAttr(this, e)
            })
        }
    }), ot.extend({
        attr: function(e, t, n) {
            var s, r, o = e.nodeType;
            return e && 3 !== o && 8 !== o && 2 !== o ? typeof e.getAttribute === At ? ot.prop(e, t, n) : (1 === o && ot.isXMLDoc(e) || (t = t.toLowerCase(), s = ot.attrHooks[t] || (ot.expr.match.bool.test(t) ? An : wn)), void 0 === n ? s && "get" in s && null !== (r = s.get(e, t)) ? r : (r = ot.find.attr(e, t), null == r ? void 0 : r) : null !== n ? s && "set" in s && void 0 !== (r = s.set(e, n, t)) ? r : (e.setAttribute(t, n + ""), n) : void ot.removeAttr(e, t)) : void 0
        },
        removeAttr: function(e, t) {
            var n, s, r = 0,
                o = t && t.match(bt);
            if (o && 1 === e.nodeType)
                for (; n = o[r++];) s = ot.propFix[n] || n, ot.expr.match.bool.test(n) ? kn && Tn || !Cn.test(n) ? e[s] = !1 : e[ot.camelCase("default-" + n)] = e[s] = !1 : ot.attr(e, n, ""), e.removeAttribute(Tn ? n : s)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!st.radioValue && "radio" === t && ot.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        }
    }), An = {
        set: function(e, t, n) {
            return t === !1 ? ot.removeAttr(e, n) : kn && Tn || !Cn.test(n) ? e.setAttribute(!Tn && ot.propFix[n] || n, n) : e[ot.camelCase("default-" + n)] = e[n] = !0, n
        }
    }, ot.each(ot.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var n = En[t] || ot.find.attr;
        En[t] = kn && Tn || !Cn.test(t) ? function(e, t, s) {
            var r, o;
            return s || (o = En[t], En[t] = r, r = null != n(e, t, s) ? t.toLowerCase() : null, En[t] = o), r
        } : function(e, t, n) {
            return n ? void 0 : e[ot.camelCase("default-" + t)] ? t.toLowerCase() : null
        }
    }), kn && Tn || (ot.attrHooks.value = {
        set: function(e, t, n) {
            return ot.nodeName(e, "input") ? void(e.defaultValue = t) : wn && wn.set(e, t, n)
        }
    }), Tn || (wn = {
        set: function(e, t, n) {
            var s = e.getAttributeNode(n);
            return s || e.setAttributeNode(s = e.ownerDocument.createAttribute(n)), s.value = t += "", "value" === n || t === e.getAttribute(n) ? t : void 0
        }
    }, En.id = En.name = En.coords = function(e, t, n) {
        var s;
        return n ? void 0 : (s = e.getAttributeNode(t)) && "" !== s.value ? s.value : null
    }, ot.valHooks.button = {
        get: function(e, t) {
            var n = e.getAttributeNode(t);
            return n && n.specified ? n.value : void 0
        },
        set: wn.set
    }, ot.attrHooks.contenteditable = {
        set: function(e, t, n) {
            wn.set(e, "" === t ? !1 : t, n)
        }
    }, ot.each(["width", "height"], function(e, t) {
        ot.attrHooks[t] = {
            set: function(e, n) {
                return "" === n ? (e.setAttribute(t, "auto"), n) : void 0
            }
        }
    })), st.style || (ot.attrHooks.style = {
        get: function(e) {
            return e.style.cssText || void 0
        },
        set: function(e, t) {
            return e.style.cssText = t + ""
        }
    });
    var zn = /^(?:input|select|textarea|button|object)$/i,
        Zn = /^(?:a|area)$/i;
    ot.fn.extend({
        prop: function(e, t) {
            return Nt(this, ot.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return e = ot.propFix[e] || e, this.each(function() {
                try {
                    this[e] = void 0, delete this[e]
                } catch (t) {}
            })
        }
    }), ot.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(e, t, n) {
            var s, r, o, i = e.nodeType;
            return e && 3 !== i && 8 !== i && 2 !== i ? (o = 1 !== i || !ot.isXMLDoc(e), o && (t = ot.propFix[t] || t, r = ot.propHooks[t]), void 0 !== n ? r && "set" in r && void 0 !== (s = r.set(e, n, t)) ? s : e[t] = n : r && "get" in r && null !== (s = r.get(e, t)) ? s : e[t]) : void 0
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = ot.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : zn.test(e.nodeName) || Zn.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        }
    }), st.hrefNormalized || ot.each(["href", "src"], function(e, t) {
        ot.propHooks[t] = {
            get: function(e) {
                return e.getAttribute(t, 4)
            }
        }
    }), st.optSelected || (ot.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
        }
    }), ot.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        ot.propFix[this.toLowerCase()] = this
    }), st.enctype || (ot.propFix.enctype = "encoding");
    var Nn = /[\t\r\n\f]/g;
    ot.fn.extend({
        addClass: function(e) {
            var t, n, s, r, o, i, a = 0,
                l = this.length,
                c = "string" == typeof e && e;
            if (ot.isFunction(e)) return this.each(function(t) {
                ot(this).addClass(e.call(this, t, this.className))
            });
            if (c)
                for (t = (e || "").match(bt) || []; l > a; a++)
                    if (n = this[a], s = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(Nn, " ") : " ")) {
                        for (o = 0; r = t[o++];) s.indexOf(" " + r + " ") < 0 && (s += r + " ");
                        i = ot.trim(s), n.className !== i && (n.className = i)
                    }
            return this
        },
        removeClass: function(e) {
            var t, n, s, r, o, i, a = 0,
                l = this.length,
                c = 0 === arguments.length || "string" == typeof e && e;
            if (ot.isFunction(e)) return this.each(function(t) {
                ot(this).removeClass(e.call(this, t, this.className))
            });
            if (c)
                for (t = (e || "").match(bt) || []; l > a; a++)
                    if (n = this[a], s = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(Nn, " ") : "")) {
                        for (o = 0; r = t[o++];)
                            for (; s.indexOf(" " + r + " ") >= 0;) s = s.replace(" " + r + " ", " ");
                        i = e ? ot.trim(s) : "", n.className !== i && (n.className = i)
                    }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e;
            return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : this.each(ot.isFunction(e) ? function(n) {
                ot(this).toggleClass(e.call(this, n, this.className, t), t)
            } : function() {
                if ("string" === n)
                    for (var t, s = 0, r = ot(this), o = e.match(bt) || []; t = o[s++];) r.hasClass(t) ? r.removeClass(t) : r.addClass(t);
                else(n === At || "boolean" === n) && (this.className && ot._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : ot._data(this, "__className__") || "")
            })
        },
        hasClass: function(e) {
            for (var t = " " + e + " ", n = 0, s = this.length; s > n; n++)
                if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(Nn, " ").indexOf(t) >= 0) return !0;
            return !1
        }
    }), ot.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
        ot.fn[t] = function(e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }), ot.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        },
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, s) {
            return this.on(t, e, n, s)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    });
    var $n = ot.now(),
        Dn = /\?/,
        Sn = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    ot.parseJSON = function(t) {
        if (e.JSON && e.JSON.parse) return e.JSON.parse(t + "");
        var n, s = null,
            r = ot.trim(t + "");
        return r && !ot.trim(r.replace(Sn, function(e, t, r, o) {
            return n && t && (s = 0), 0 === s ? e : (n = r || t, s += !o - !r, "")
        })) ? Function("return " + r)() : ot.error("Invalid JSON: " + t)
    }, ot.parseXML = function(t) {
        var n, s;
        if (!t || "string" != typeof t) return null;
        try {
            e.DOMParser ? (s = new DOMParser, n = s.parseFromString(t, "text/xml")) : (n = new ActiveXObject("Microsoft.XMLDOM"), n.async = "false", n.loadXML(t))
        } catch (r) {
            n = void 0
        }
        return n && n.documentElement && !n.getElementsByTagName("parsererror").length || ot.error("Invalid XML: " + t), n
    };
    var Ln, On, Fn = /#.*$/,
        In = /([?&])_=[^&]*/,
        jn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        Mn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        qn = /^(?:GET|HEAD)$/,
        Hn = /^\/\//,
        Rn = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        Bn = {},
        Pn = {},
        Un = "*/".concat("*");
    try {
        On = location.href
    } catch (Wn) {
        On = gt.createElement("a"), On.href = "", On = On.href
    }
    Ln = Rn.exec(On.toLowerCase()) || [], ot.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: On,
            type: "GET",
            isLocal: Mn.test(Ln[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Un,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": ot.parseJSON,
                "text xml": ot.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? R(R(e, ot.ajaxSettings), t) : R(ot.ajaxSettings, e)
        },
        ajaxPrefilter: q(Bn),
        ajaxTransport: q(Pn),
        ajax: function(e, t) {
            function n(e, t, n, s) {
                var r, h, _, y, b, w = t;
                2 !== v && (v = 2, a && clearTimeout(a), c = void 0, i = s || "", x.readyState = e > 0 ? 4 : 0, r = e >= 200 && 300 > e || 304 === e, n && (y = B(u, x, n)), y = P(u, y, x, r), r ? (u.ifModified && (b = x.getResponseHeader("Last-Modified"), b && (ot.lastModified[o] = b), b = x.getResponseHeader("etag"), b && (ot.etag[o] = b)), 204 === e || "HEAD" === u.type ? w = "nocontent" : 304 === e ? w = "notmodified" : (w = y.state, h = y.data, _ = y.error, r = !_)) : (_ = w, (e || !w) && (w = "error", 0 > e && (e = 0))), x.status = e, x.statusText = (t || w) + "", r ? f.resolveWith(p, [h, w, x]) : f.rejectWith(p, [x, w, _]), x.statusCode(m), m = void 0, l && d.trigger(r ? "ajaxSuccess" : "ajaxError", [x, u, r ? h : _]), g.fireWith(p, [x, w]), l && (d.trigger("ajaxComplete", [x, u]), --ot.active || ot.event.trigger("ajaxStop")))
            }
            "object" == typeof e && (t = e, e = void 0), t = t || {};
            var s, r, o, i, a, l, c, h, u = ot.ajaxSetup({}, t),
                p = u.context || u,
                d = u.context && (p.nodeType || p.jquery) ? ot(p) : ot.event,
                f = ot.Deferred(),
                g = ot.Callbacks("once memory"),
                m = u.statusCode || {},
                _ = {},
                y = {},
                v = 0,
                b = "canceled",
                x = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (2 === v) {
                            if (!h)
                                for (h = {}; t = jn.exec(i);) h[t[1].toLowerCase()] = t[2];
                            t = h[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function() {
                        return 2 === v ? i : null
                    },
                    setRequestHeader: function(e, t) {
                        var n = e.toLowerCase();
                        return v || (e = y[n] = y[n] || e, _[e] = t), this
                    },
                    overrideMimeType: function(e) {
                        return v || (u.mimeType = e), this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e)
                            if (2 > v)
                                for (t in e) m[t] = [m[t], e[t]];
                            else x.always(e[x.status]);
                        return this
                    },
                    abort: function(e) {
                        var t = e || b;
                        return c && c.abort(t), n(0, t), this
                    }
                };
            if (f.promise(x).complete = g.add, x.success = x.done, x.error = x.fail, u.url = ((e || u.url || On) + "").replace(Fn, "").replace(Hn, Ln[1] + "//"), u.type = t.method || t.type || u.method || u.type, u.dataTypes = ot.trim(u.dataType || "*").toLowerCase().match(bt) || [""], null == u.crossDomain && (s = Rn.exec(u.url.toLowerCase()), u.crossDomain = !(!s || s[1] === Ln[1] && s[2] === Ln[2] && (s[3] || ("http:" === s[1] ? "80" : "443")) === (Ln[3] || ("http:" === Ln[1] ? "80" : "443")))), u.data && u.processData && "string" != typeof u.data && (u.data = ot.param(u.data, u.traditional)), H(Bn, u, t, x), 2 === v) return x;
            l = u.global, l && 0 === ot.active++ && ot.event.trigger("ajaxStart"), u.type = u.type.toUpperCase(), u.hasContent = !qn.test(u.type), o = u.url, u.hasContent || (u.data && (o = u.url += (Dn.test(o) ? "&" : "?") + u.data, delete u.data), u.cache === !1 && (u.url = In.test(o) ? o.replace(In, "$1_=" + $n++) : o + (Dn.test(o) ? "&" : "?") + "_=" + $n++)), u.ifModified && (ot.lastModified[o] && x.setRequestHeader("If-Modified-Since", ot.lastModified[o]), ot.etag[o] && x.setRequestHeader("If-None-Match", ot.etag[o])), (u.data && u.hasContent && u.contentType !== !1 || t.contentType) && x.setRequestHeader("Content-Type", u.contentType), x.setRequestHeader("Accept", u.dataTypes[0] && u.accepts[u.dataTypes[0]] ? u.accepts[u.dataTypes[0]] + ("*" !== u.dataTypes[0] ? ", " + Un + "; q=0.01" : "") : u.accepts["*"]);
            for (r in u.headers) x.setRequestHeader(r, u.headers[r]);
            if (u.beforeSend && (u.beforeSend.call(p, x, u) === !1 || 2 === v)) return x.abort();
            b = "abort";
            for (r in {
                success: 1,
                error: 1,
                complete: 1
            }) x[r](u[r]);
            if (c = H(Pn, u, t, x)) {
                x.readyState = 1, l && d.trigger("ajaxSend", [x, u]), u.async && u.timeout > 0 && (a = setTimeout(function() {
                    x.abort("timeout")
                }, u.timeout));
                try {
                    v = 1, c.send(_, n)
                } catch (w) {
                    if (!(2 > v)) throw w;
                    n(-1, w)
                }
            } else n(-1, "No Transport");
            return x
        },
        getJSON: function(e, t, n) {
            return ot.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return ot.get(e, void 0, t, "script")
        }
    }), ot.each(["get", "post"], function(e, t) {
        ot[t] = function(e, n, s, r) {
            return ot.isFunction(n) && (r = r || s, s = n, n = void 0), ot.ajax({
                url: e,
                type: t,
                dataType: r,
                data: n,
                success: s
            })
        }
    }), ot.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        ot.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), ot._evalUrl = function(e) {
        return ot.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
        })
    }, ot.fn.extend({
        wrapAll: function(e) {
            if (ot.isFunction(e)) return this.each(function(t) {
                ot(this).wrapAll(e.call(this, t))
            });
            if (this[0]) {
                var t = ot(e, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                    for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
                    return e
                }).append(this)
            }
            return this
        },
        wrapInner: function(e) {
            return this.each(ot.isFunction(e) ? function(t) {
                ot(this).wrapInner(e.call(this, t))
            } : function() {
                var t = ot(this),
                    n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function(e) {
            var t = ot.isFunction(e);
            return this.each(function(n) {
                ot(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                ot.nodeName(this, "body") || ot(this).replaceWith(this.childNodes)
            }).end()
        }
    }), ot.expr.filters.hidden = function(e) {
        return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !st.reliableHiddenOffsets() && "none" === (e.style && e.style.display || ot.css(e, "display"))
    }, ot.expr.filters.visible = function(e) {
        return !ot.expr.filters.hidden(e)
    };
    var Xn = /%20/g,
        Gn = /\[\]$/,
        Yn = /\r?\n/g,
        Qn = /^(?:submit|button|image|reset|file)$/i,
        Vn = /^(?:input|select|textarea|keygen)/i;
    ot.param = function(e, t) {
        var n, s = [],
            r = function(e, t) {
                t = ot.isFunction(t) ? t() : null == t ? "" : t, s[s.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
            };
        if (void 0 === t && (t = ot.ajaxSettings && ot.ajaxSettings.traditional), ot.isArray(e) || e.jquery && !ot.isPlainObject(e)) ot.each(e, function() {
            r(this.name, this.value)
        });
        else
            for (n in e) U(n, e[n], t, r);
        return s.join("&").replace(Xn, "+")
    }, ot.fn.extend({
        serialize: function() {
            return ot.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = ot.prop(this, "elements");
                return e ? ot.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !ot(this).is(":disabled") && Vn.test(this.nodeName) && !Qn.test(e) && (this.checked || !$t.test(e))
            }).map(function(e, t) {
                var n = ot(this).val();
                return null == n ? null : ot.isArray(n) ? ot.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(Yn, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(Yn, "\r\n")
                }
            }).get()
        }
    }), ot.ajaxSettings.xhr = void 0 !== e.ActiveXObject ? function() {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && W() || X()
    } : W;
    var Kn = 0,
        Jn = {},
        es = ot.ajaxSettings.xhr();
    e.ActiveXObject && ot(e).on("unload", function() {
        for (var e in Jn) Jn[e](void 0, !0)
    }), st.cors = !!es && "withCredentials" in es, es = st.ajax = !!es, es && ot.ajaxTransport(function(e) {
        if (!e.crossDomain || st.cors) {
            var t;
            return {
                send: function(n, s) {
                    var r, o = e.xhr(),
                        i = ++Kn;
                    if (o.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
                        for (r in e.xhrFields) o[r] = e.xhrFields[r];
                    e.mimeType && o.overrideMimeType && o.overrideMimeType(e.mimeType), e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
                    for (r in n) void 0 !== n[r] && o.setRequestHeader(r, n[r] + "");
                    o.send(e.hasContent && e.data || null), t = function(n, r) {
                        var a, l, c;
                        if (t && (r || 4 === o.readyState))
                            if (delete Jn[i], t = void 0, o.onreadystatechange = ot.noop, r) 4 !== o.readyState && o.abort();
                            else {
                                c = {}, a = o.status, "string" == typeof o.responseText && (c.text = o.responseText);
                                try {
                                    l = o.statusText
                                } catch (h) {
                                    l = ""
                                }
                                a || !e.isLocal || e.crossDomain ? 1223 === a && (a = 204) : a = c.text ? 200 : 404
                            }
                        c && s(a, l, c, o.getAllResponseHeaders())
                    }, e.async ? 4 === o.readyState ? setTimeout(t) : o.onreadystatechange = Jn[i] = t : t()
                },
                abort: function() {
                    t && t(void 0, !0)
                }
            }
        }
    }), ot.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(e) {
                return ot.globalEval(e), e
            }
        }
    }), ot.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    }), ot.ajaxTransport("script", function(e) {
        if (e.crossDomain) {
            var t, n = gt.head || ot("head")[0] || gt.documentElement;
            return {
                send: function(s, r) {
                    t = gt.createElement("script"), t.async = !0, e.scriptCharset && (t.charset = e.scriptCharset), t.src = e.url, t.onload = t.onreadystatechange = function(e, n) {
                        (n || !t.readyState || /loaded|complete/.test(t.readyState)) && (t.onload = t.onreadystatechange = null, t.parentNode && t.parentNode.removeChild(t), t = null, n || r(200, "success"))
                    }, n.insertBefore(t, n.firstChild)
                },
                abort: function() {
                    t && t.onload(void 0, !0)
                }
            }
        }
    });
    var ts = [],
        ns = /(=)\?(?=&|$)|\?\?/;
    ot.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = ts.pop() || ot.expando + "_" + $n++;
            return this[e] = !0, e
        }
    }), ot.ajaxPrefilter("json jsonp", function(t, n, s) {
        var r, o, i, a = t.jsonp !== !1 && (ns.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && ns.test(t.data) && "data");
        return a || "jsonp" === t.dataTypes[0] ? (r = t.jsonpCallback = ot.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, a ? t[a] = t[a].replace(ns, "$1" + r) : t.jsonp !== !1 && (t.url += (Dn.test(t.url) ? "&" : "?") + t.jsonp + "=" + r), t.converters["script json"] = function() {
            return i || ot.error(r + " was not called"), i[0]
        }, t.dataTypes[0] = "json", o = e[r], e[r] = function() {
            i = arguments
        }, s.always(function() {
            e[r] = o, t[r] && (t.jsonpCallback = n.jsonpCallback, ts.push(r)), i && ot.isFunction(o) && o(i[0]), i = o = void 0
        }), "script") : void 0
    }), ot.parseHTML = function(e, t, n) {
        if (!e || "string" != typeof e) return null;
        "boolean" == typeof t && (n = t, t = !1), t = t || gt;
        var s = pt.exec(e),
            r = !n && [];
        return s ? [t.createElement(s[1])] : (s = ot.buildFragment([e], t, r), r && r.length && ot(r).remove(), ot.merge([], s.childNodes))
    };
    var ss = ot.fn.load;
    ot.fn.load = function(e, t, n) {
        if ("string" != typeof e && ss) return ss.apply(this, arguments);
        var s, r, o, i = this,
            a = e.indexOf(" ");
        return a >= 0 && (s = ot.trim(e.slice(a, e.length)), e = e.slice(0, a)), ot.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (o = "POST"), i.length > 0 && ot.ajax({
            url: e,
            type: o,
            dataType: "html",
            data: t
        }).done(function(e) {
            r = arguments, i.html(s ? ot("<div>").append(ot.parseHTML(e)).find(s) : e)
        }).complete(n && function(e, t) {
            i.each(n, r || [e.responseText, t, e])
        }), this
    }, ot.expr.filters.animated = function(e) {
        return ot.grep(ot.timers, function(t) {
            return e === t.elem
        }).length
    };
    var rs = e.document.documentElement;
    ot.offset = {
        setOffset: function(e, t, n) {
            var s, r, o, i, a, l, c, h = ot.css(e, "position"),
                u = ot(e),
                p = {};
            "static" === h && (e.style.position = "relative"), a = u.offset(), o = ot.css(e, "top"), l = ot.css(e, "left"), c = ("absolute" === h || "fixed" === h) && ot.inArray("auto", [o, l]) > -1, c ? (s = u.position(), i = s.top, r = s.left) : (i = parseFloat(o) || 0, r = parseFloat(l) || 0), ot.isFunction(t) && (t = t.call(e, n, a)), null != t.top && (p.top = t.top - a.top + i), null != t.left && (p.left = t.left - a.left + r), "using" in t ? t.using.call(e, p) : u.css(p)
        }
    }, ot.fn.extend({
        offset: function(e) {
            if (arguments.length) return void 0 === e ? this : this.each(function(t) {
                ot.offset.setOffset(this, e, t)
            });
            var t, n, s = {
                    top: 0,
                    left: 0
                },
                r = this[0],
                o = r && r.ownerDocument;
            return o ? (t = o.documentElement, ot.contains(t, r) ? (typeof r.getBoundingClientRect !== At && (s = r.getBoundingClientRect()), n = G(o), {
                top: s.top + (n.pageYOffset || t.scrollTop) - (t.clientTop || 0),
                left: s.left + (n.pageXOffset || t.scrollLeft) - (t.clientLeft || 0)
            }) : s) : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n = {
                        top: 0,
                        left: 0
                    },
                    s = this[0];
                return "fixed" === ot.css(s, "position") ? t = s.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), ot.nodeName(e[0], "html") || (n = e.offset()), n.top += ot.css(e[0], "borderTopWidth", !0), n.left += ot.css(e[0], "borderLeftWidth", !0)), {
                    top: t.top - n.top - ot.css(s, "marginTop", !0),
                    left: t.left - n.left - ot.css(s, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent || rs; e && !ot.nodeName(e, "html") && "static" === ot.css(e, "position");) e = e.offsetParent;
                return e || rs
            })
        }
    }), ot.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, t) {
        var n = /Y/.test(t);
        ot.fn[e] = function(s) {
            return Nt(this, function(e, s, r) {
                var o = G(e);
                return void 0 === r ? o ? t in o ? o[t] : o.document.documentElement[s] : e[s] : void(o ? o.scrollTo(n ? ot(o).scrollLeft() : r, n ? r : ot(o).scrollTop()) : e[s] = r)
            }, e, s, arguments.length, null)
        }
    }), ot.each(["top", "left"], function(e, t) {
        ot.cssHooks[t] = T(st.pixelPosition, function(e, n) {
            return n ? (n = sn(e, t), tn.test(n) ? ot(e).position()[t] + "px" : n) : void 0
        })
    }), ot.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        ot.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(n, s) {
            ot.fn[s] = function(s, r) {
                var o = arguments.length && (n || "boolean" != typeof s),
                    i = n || (s === !0 || r === !0 ? "margin" : "border");
                return Nt(this, function(t, n, s) {
                    var r;
                    return ot.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (r = t.documentElement, Math.max(t.body["scroll" + e], r["scroll" + e], t.body["offset" + e], r["offset" + e], r["client" + e])) : void 0 === s ? ot.css(t, n, i) : ot.style(t, n, s, i)
                }, t, o ? s : void 0, o, null)
            }
        })
    }), ot.fn.size = function() {
        return this.length
    }, ot.fn.andSelf = ot.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
        return ot
    });
    var os = e.jQuery,
        is = e.$;
    return ot.noConflict = function(t) {
        return e.$ === ot && (e.$ = is), t && e.jQuery === ot && (e.jQuery = os), ot
    }, typeof t === At && (e.jQuery = e.$ = ot), ot
}), function() {
    var e = {};
    $.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function(t, n) {
        e[n] = function(e) {
            return Math.pow(e, t + 2)
        }
    }), $.extend(e, {
        Sine: function(e) {
            return 1 - Math.cos(e * Math.PI / 2)
        },
        Circ: function(e) {
            return 1 - Math.sqrt(1 - e * e)
        },
        Elastic: function(e) {
            return 0 === e || 1 === e ? e : -Math.pow(2, 8 * (e - 1)) * Math.sin((80 * (e - 1) - 7.5) * Math.PI / 15)
        },
        Back: function(e) {
            return e * e * (3 * e - 2)
        },
        Bounce: function(e) {
            for (var t, n = 4; e < ((t = Math.pow(2, --n)) - 1) / 11;);
            return 1 / Math.pow(4, 3 - n) - 7.5625 * Math.pow((3 * t - 2) / 22 - e, 2)
        }
    }), $.each(e, function(e, t) {
        $.easing["easeIn" + e] = t, $.easing["easeOut" + e] = function(e) {
            return 1 - t(1 - e)
        }, $.easing["easeInOut" + e] = function(e) {
            return .5 > e ? t(2 * e) / 2 : 1 - t(-2 * e + 2) / 2
        }
    })
}(), "undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery"); + function(e) {
    "use strict";

    function t() {
        var e = document.createElement("bootstrap"),
            t = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd otransitionend",
                transition: "transitionend"
            };
        for (var n in t)
            if (void 0 !== e.style[n]) return {
                end: t[n]
            };
        return !1
    }
    e.fn.emulateTransitionEnd = function(t) {
        var n = !1,
            s = this;
        e(this).one(e.support.transition.end, function() {
            n = !0
        });
        var r = function() {
            n || e(s).trigger(e.support.transition.end)
        };
        return setTimeout(r, t), this
    }, e(function() {
        e.support.transition = t()
    })
}(jQuery), + function(e) {
    "use strict";
    var t = '[data-dismiss="alert"]',
        n = function(n) {
            e(n).on("click", t, this.close)
        };
    n.prototype.close = function(t) {
        function n() {
            o.trigger("closed.bs.alert").remove()
        }
        var s = e(this),
            r = s.attr("data-target");
        r || (r = s.attr("href"), r = r && r.replace(/.*(?=#[^\s]*$)/, ""));
        var o = e(r);
        t && t.preventDefault(), o.length || (o = s.hasClass("alert") ? s : s.parent()), o.trigger(t = e.Event("close.bs.alert")), t.isDefaultPrevented() || (o.removeClass("in"), e.support.transition && o.hasClass("fade") ? o.one(e.support.transition.end, n).emulateTransitionEnd(150) : n())
    };
    var s = e.fn.alert;
    e.fn.alert = function(t) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.alert");
            r || s.data("bs.alert", r = new n(this)), "string" == typeof t && r[t].call(s)
        })
    }, e.fn.alert.Constructor = n, e.fn.alert.noConflict = function() {
        return e.fn.alert = s, this
    }, e(document).on("click.bs.alert.data-api", t, n.prototype.close)
}(jQuery), + function(e) {
    "use strict";
    var t = function(n, s) {
        this.$element = e(n), this.options = e.extend({}, t.DEFAULTS, s), this.isLoading = !1
    };
    t.DEFAULTS = {
        loadingText: "loading..."
    }, t.prototype.setState = function(t) {
        var n = "disabled",
            s = this.$element,
            r = s.is("input") ? "val" : "html",
            o = s.data();
        t += "Text", o.resetText || s.data("resetText", s[r]()), s[r](o[t] || this.options[t]), setTimeout(e.proxy(function() {
            "loadingText" == t ? (this.isLoading = !0, s.addClass(n).attr(n, n)) : this.isLoading && (this.isLoading = !1, s.removeClass(n).removeAttr(n))
        }, this), 0)
    }, t.prototype.toggle = function() {
        var e = !0,
            t = this.$element.closest('[data-toggle="buttons"]');
        if (t.length) {
            var n = this.$element.find("input");
            "radio" == n.prop("type") && (n.prop("checked") && this.$element.hasClass("active") ? e = !1 : t.find(".active").removeClass("active")), e && n.prop("checked", !this.$element.hasClass("active")).trigger("change")
        }
        e && this.$element.toggleClass("active")
    };
    var n = e.fn.button;
    e.fn.button = function(n) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.button"),
                o = "object" == typeof n && n;
            r || s.data("bs.button", r = new t(this, o)), "toggle" == n ? r.toggle() : n && r.setState(n)
        })
    }, e.fn.button.Constructor = t, e.fn.button.noConflict = function() {
        return e.fn.button = n, this
    }, e(document).on("click.bs.button.data-api", "[data-toggle^=button]", function(t) {
        var n = e(t.target);
        n.hasClass("btn") || (n = n.closest(".btn")), n.button("toggle"), t.preventDefault()
    })
}(jQuery), + function(e) {
    "use strict";
    var t = function(t, n) {
        this.$element = e(t), this.$indicators = this.$element.find(".carousel-indicators"), this.options = n, this.paused = this.sliding = this.interval = this.$active = this.$items = null, "hover" == this.options.pause && this.$element.on("mouseenter", e.proxy(this.pause, this)).on("mouseleave", e.proxy(this.cycle, this))
    };
    t.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: !0
    }, t.prototype.cycle = function(t) {
        return t || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(e.proxy(this.next, this), this.options.interval)), this
    }, t.prototype.getActiveIndex = function() {
        return this.$active = this.$element.find(".item.active"), this.$items = this.$active.parent().children(), this.$items.index(this.$active)
    }, t.prototype.to = function(t) {
        var n = this,
            s = this.getActiveIndex();
        return t > this.$items.length - 1 || 0 > t ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel", function() {
            n.to(t)
        }) : s == t ? this.pause().cycle() : this.slide(t > s ? "next" : "prev", e(this.$items[t]))
    }, t.prototype.pause = function(t) {
        return t || (this.paused = !0), this.$element.find(".next, .prev").length && e.support.transition && (this.$element.trigger(e.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
    }, t.prototype.next = function() {
        return this.sliding ? void 0 : this.slide("next")
    }, t.prototype.prev = function() {
        return this.sliding ? void 0 : this.slide("prev")
    }, t.prototype.slide = function(t, n) {
        var s = this.$element.find(".item.active"),
            r = n || s[t](),
            o = this.interval,
            i = "next" == t ? "left" : "right",
            a = "next" == t ? "first" : "last",
            l = this;
        if (!r.length) {
            if (!this.options.wrap) return;
            r = this.$element.find(".item")[a]()
        }
        if (r.hasClass("active")) return this.sliding = !1;
        var c = e.Event("slide.bs.carousel", {
            relatedTarget: r[0],
            direction: i
        });
        return this.$element.trigger(c), c.isDefaultPrevented() ? void 0 : (this.sliding = !0, o && this.pause(), this.$indicators.length && (this.$indicators.find(".active").removeClass("active"), this.$element.one("slid.bs.carousel", function() {
            var t = e(l.$indicators.children()[l.getActiveIndex()]);
            t && t.addClass("active")
        })), e.support.transition && this.$element.hasClass("slide") ? (r.addClass(t), r[0].offsetWidth, s.addClass(i), r.addClass(i), s.one(e.support.transition.end, function() {
            r.removeClass([t, i].join(" ")).addClass("active"), s.removeClass(["active", i].join(" ")), l.sliding = !1, setTimeout(function() {
                l.$element.trigger("slid.bs.carousel")
            }, 0)
        }).emulateTransitionEnd(1e3 * s.css("transition-duration").slice(0, -1))) : (s.removeClass("active"), r.addClass("active"), this.sliding = !1, this.$element.trigger("slid.bs.carousel")), o && this.cycle(), this)
    };
    var n = e.fn.carousel;
    e.fn.carousel = function(n) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.carousel"),
                o = e.extend({}, t.DEFAULTS, s.data(), "object" == typeof n && n),
                i = "string" == typeof n ? n : o.slide;
            r || s.data("bs.carousel", r = new t(this, o)), "number" == typeof n ? r.to(n) : i ? r[i]() : o.interval && r.pause().cycle()
        })
    }, e.fn.carousel.Constructor = t, e.fn.carousel.noConflict = function() {
        return e.fn.carousel = n, this
    }, e(document).on("click.bs.carousel.data-api", "[data-slide], [data-slide-to]", function(t) {
        var n, s = e(this),
            r = e(s.attr("data-target") || (n = s.attr("href")) && n.replace(/.*(?=#[^\s]+$)/, "")),
            o = e.extend({}, r.data(), s.data()),
            i = s.attr("data-slide-to");
        i && (o.interval = !1), r.carousel(o), (i = s.attr("data-slide-to")) && r.data("bs.carousel").to(i), t.preventDefault()
    }), e(window).on("load", function() {
        e('[data-ride="carousel"]').each(function() {
            var t = e(this);
            t.carousel(t.data())
        })
    })
}(jQuery), + function(e) {
    "use strict";
    var t = function(n, s) {
        this.$element = e(n), this.options = e.extend({}, t.DEFAULTS, s), this.transitioning = null, this.options.parent && (this.$parent = e(this.options.parent)), this.options.toggle && this.toggle()
    };
    t.DEFAULTS = {
        toggle: !0
    }, t.prototype.dimension = function() {
        var e = this.$element.hasClass("width");
        return e ? "width" : "height"
    }, t.prototype.show = function() {
        if (!this.transitioning && !this.$element.hasClass("in")) {
            var t = e.Event("show.bs.collapse");
            if (this.$element.trigger(t), !t.isDefaultPrevented()) {
                var n = this.$parent && this.$parent.find("> .panel > .in");
                if (n && n.length) {
                    var s = n.data("bs.collapse");
                    if (s && s.transitioning) return;
                    n.collapse("hide"), s || n.data("bs.collapse", null)
                }
                var r = this.dimension();
                this.$element.removeClass("collapse").addClass("collapsing")[r](0), this.transitioning = 1;
                var o = function() {
                    this.$element.removeClass("collapsing").addClass("collapse in")[r]("auto"), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
                };
                if (!e.support.transition) return o.call(this);
                var i = e.camelCase(["scroll", r].join("-"));
                this.$element.one(e.support.transition.end, e.proxy(o, this)).emulateTransitionEnd(350)[r](this.$element[0][i])
            }
        }
    }, t.prototype.hide = function() {
        if (!this.transitioning && this.$element.hasClass("in")) {
            var t = e.Event("hide.bs.collapse");
            if (this.$element.trigger(t), !t.isDefaultPrevented()) {
                var n = this.dimension();
                this.$element[n](this.$element[n]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"), this.transitioning = 1;
                var s = function() {
                    this.transitioning = 0, this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")
                };
                return e.support.transition ? void this.$element[n](0).one(e.support.transition.end, e.proxy(s, this)).emulateTransitionEnd(350) : s.call(this)
            }
        }
    }, t.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    };
    var n = e.fn.collapse;
    e.fn.collapse = function(n) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.collapse"),
                o = e.extend({}, t.DEFAULTS, s.data(), "object" == typeof n && n);
            !r && o.toggle && "show" == n && (n = !n), r || s.data("bs.collapse", r = new t(this, o)), "string" == typeof n && r[n]()
        })
    }, e.fn.collapse.Constructor = t, e.fn.collapse.noConflict = function() {
        return e.fn.collapse = n, this
    }, e(document).on("click.bs.collapse.data-api", "[data-toggle=collapse]", function(t) {
        var n, s = e(this),
            r = s.attr("data-target") || t.preventDefault() || (n = s.attr("href")) && n.replace(/.*(?=#[^\s]+$)/, ""),
            o = e(r),
            i = o.data("bs.collapse"),
            a = i ? "toggle" : s.data(),
            l = s.attr("data-parent"),
            c = l && e(l);
        i && i.transitioning || (c && c.find('[data-toggle=collapse][data-parent="' + l + '"]').not(s).addClass("collapsed"), s[o.hasClass("in") ? "addClass" : "removeClass"]("collapsed")), o.collapse(a)
    })
}(jQuery), + function(e) {
    "use strict";

    function t(t) {
        e(s).remove(), e(r).each(function() {
            var s = n(e(this)),
                r = {
                    relatedTarget: this
                };
            s.hasClass("open") && (s.trigger(t = e.Event("hide.bs.dropdown", r)), t.isDefaultPrevented() || s.removeClass("open").trigger("hidden.bs.dropdown", r))
        })
    }

    function n(t) {
        var n = t.attr("data-target");
        n || (n = t.attr("href"), n = n && /#[A-Za-z]/.test(n) && n.replace(/.*(?=#[^\s]*$)/, ""));
        var s = n && e(n);
        return s && s.length ? s : t.parent()
    }
    var s = ".dropdown-backdrop",
        r = "[data-toggle=dropdown]",
        o = function(t) {
            e(t).on("click.bs.dropdown", this.toggle)
        };
    o.prototype.toggle = function(s) {
        var r = e(this);
        if (!r.is(".disabled, :disabled")) {
            var o = n(r),
                i = o.hasClass("open");
            if (t(), !i) {
                "ontouchstart" in document.documentElement && !o.closest(".navbar-nav").length && e('<div class="dropdown-backdrop"/>').insertAfter(e(this)).on("click", t);
                var a = {
                    relatedTarget: this
                };
                if (o.trigger(s = e.Event("show.bs.dropdown", a)), s.isDefaultPrevented()) return;
                o.toggleClass("open").trigger("shown.bs.dropdown", a), r.focus()
            }
            return !1
        }
    }, o.prototype.keydown = function(t) {
        if (/(38|40|27)/.test(t.keyCode)) {
            var s = e(this);
            if (t.preventDefault(), t.stopPropagation(), !s.is(".disabled, :disabled")) {
                var o = n(s),
                    i = o.hasClass("open");
                if (!i || i && 27 == t.keyCode) return 27 == t.which && o.find(r).focus(), s.click();
                var a = " li:not(.divider):visible a",
                    l = o.find("[role=menu]" + a + ", [role=listbox]" + a);
                if (l.length) {
                    var c = l.index(l.filter(":focus"));
                    38 == t.keyCode && c > 0 && c--, 40 == t.keyCode && c < l.length - 1 && c++, ~c || (c = 0), l.eq(c).focus()
                }
            }
        }
    };
    var i = e.fn.dropdown;
    e.fn.dropdown = function(t) {
        return this.each(function() {
            var n = e(this),
                s = n.data("bs.dropdown");
            s || n.data("bs.dropdown", s = new o(this)), "string" == typeof t && s[t].call(n)
        })
    }, e.fn.dropdown.Constructor = o, e.fn.dropdown.noConflict = function() {
        return e.fn.dropdown = i, this
    }, e(document).on("click.bs.dropdown.data-api", t).on("click.bs.dropdown.data-api", ".dropdown form", function(e) {
        e.stopPropagation()
    }).on("click.bs.dropdown.data-api", r, o.prototype.toggle).on("keydown.bs.dropdown.data-api", r + ", [role=menu], [role=listbox]", o.prototype.keydown)
}(jQuery), + function(e) {
    "use strict";
    var t = function(t, n) {
        this.options = n, this.$element = e(t), this.$backdrop = this.isShown = null, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, e.proxy(function() {
            this.$element.trigger("loaded.bs.modal")
        }, this))
    };
    t.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    }, t.prototype.toggle = function(e) {
        return this[this.isShown ? "hide" : "show"](e)
    }, t.prototype.show = function(t) {
        var n = this,
            s = e.Event("show.bs.modal", {
                relatedTarget: t
            });
        this.$element.trigger(s), this.isShown || s.isDefaultPrevented() || (this.isShown = !0, this.escape(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', e.proxy(this.hide, this)), this.backdrop(function() {
            var s = e.support.transition && n.$element.hasClass("fade");
            n.$element.parent().length || n.$element.appendTo(document.body), n.$element.show().scrollTop(0), s && n.$element[0].offsetWidth, n.$element.addClass("in").attr("aria-hidden", !1), n.enforceFocus();
            var r = e.Event("shown.bs.modal", {
                relatedTarget: t
            });
            s ? n.$element.find(".modal-dialog").one(e.support.transition.end, function() {
                n.$element.focus().trigger(r)
            }).emulateTransitionEnd(300) : n.$element.focus().trigger(r)
        }))
    }, t.prototype.hide = function(t) {
        t && t.preventDefault(), t = e.Event("hide.bs.modal"), this.$element.trigger(t), this.isShown && !t.isDefaultPrevented() && (this.isShown = !1, this.escape(), e(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.bs.modal"), e.support.transition && this.$element.hasClass("fade") ? this.$element.one(e.support.transition.end, e.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal())
    }, t.prototype.enforceFocus = function() {
        e(document).off("focusin.bs.modal").on("focusin.bs.modal", e.proxy(function(e) {
            this.$element[0] === e.target || this.$element.has(e.target).length || this.$element.focus()
        }, this))
    }, t.prototype.escape = function() {
        this.isShown && this.options.keyboard ? this.$element.on("keyup.dismiss.bs.modal", e.proxy(function(e) {
            27 == e.which && this.hide()
        }, this)) : this.isShown || this.$element.off("keyup.dismiss.bs.modal")
    }, t.prototype.hideModal = function() {
        var e = this;
        this.$element.hide(), this.backdrop(function() {
            e.removeBackdrop(), e.$element.trigger("hidden.bs.modal")
        })
    }, t.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
    }, t.prototype.backdrop = function(t) {
        var n = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var s = e.support.transition && n;
            if (this.$backdrop = e('<div class="modal-backdrop ' + n + '" />').appendTo(document.body), this.$element.on("click.dismiss.bs.modal", e.proxy(function(e) {
                e.target === e.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this))
            }, this)), s && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !t) return;
            s ? this.$backdrop.one(e.support.transition.end, t).emulateTransitionEnd(150) : t()
        } else !this.isShown && this.$backdrop ? (this.$backdrop.removeClass("in"), e.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one(e.support.transition.end, t).emulateTransitionEnd(150) : t()) : t && t()
    };
    var n = e.fn.modal;
    e.fn.modal = function(n, s) {
        return this.each(function() {
            var r = e(this),
                o = r.data("bs.modal"),
                i = e.extend({}, t.DEFAULTS, r.data(), "object" == typeof n && n);
            o || r.data("bs.modal", o = new t(this, i)), "string" == typeof n ? o[n](s) : i.show && o.show(s)
        })
    }, e.fn.modal.Constructor = t, e.fn.modal.noConflict = function() {
        return e.fn.modal = n, this
    }, e(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(t) {
        var n = e(this),
            s = n.attr("href"),
            r = e(n.attr("data-target") || s && s.replace(/.*(?=#[^\s]+$)/, "")),
            o = r.data("bs.modal") ? "toggle" : e.extend({
                remote: !/#/.test(s) && s
            }, r.data(), n.data());
        n.is("a") && t.preventDefault(), r.modal(o, this).one("hide", function() {
            n.is(":visible") && n.focus()
        })
    }), e(document).on("show.bs.modal", ".modal", function() {
        e(document.body).addClass("modal-open")
    }).on("hidden.bs.modal", ".modal", function() {
        e(document.body).removeClass("modal-open")
    })
}(jQuery), + function(e) {
    "use strict";
    var t = function(e, t) {
        this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null, this.init("tooltip", e, t)
    };
    t.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1
    }, t.prototype.init = function(t, n, s) {
        this.enabled = !0, this.type = t, this.$element = e(n), this.options = this.getOptions(s);
        for (var r = this.options.trigger.split(" "), o = r.length; o--;) {
            var i = r[o];
            if ("click" == i) this.$element.on("click." + this.type, this.options.selector, e.proxy(this.toggle, this));
            else if ("manual" != i) {
                var a = "hover" == i ? "mouseenter" : "focusin",
                    l = "hover" == i ? "mouseleave" : "focusout";
                this.$element.on(a + "." + this.type, this.options.selector, e.proxy(this.enter, this)), this.$element.on(l + "." + this.type, this.options.selector, e.proxy(this.leave, this))
            }
        }
        this.options.selector ? this._options = e.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle()
    }, t.prototype.getDefaults = function() {
        return t.DEFAULTS
    }, t.prototype.getOptions = function(t) {
        return t = e.extend({}, this.getDefaults(), this.$element.data(), t), t.delay && "number" == typeof t.delay && (t.delay = {
            show: t.delay,
            hide: t.delay
        }), t
    }, t.prototype.getDelegateOptions = function() {
        var t = {},
            n = this.getDefaults();
        return this._options && e.each(this._options, function(e, s) {
            n[e] != s && (t[e] = s)
        }), t
    }, t.prototype.enter = function(t) {
        var n = t instanceof this.constructor ? t : e(t.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type);
        return clearTimeout(n.timeout), n.hoverState = "in", n.options.delay && n.options.delay.show ? void(n.timeout = setTimeout(function() {
            "in" == n.hoverState && n.show()
        }, n.options.delay.show)) : n.show()
    }, t.prototype.leave = function(t) {
        var n = t instanceof this.constructor ? t : e(t.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type);
        return clearTimeout(n.timeout), n.hoverState = "out", n.options.delay && n.options.delay.hide ? void(n.timeout = setTimeout(function() {
            "out" == n.hoverState && n.hide()
        }, n.options.delay.hide)) : n.hide()
    }, t.prototype.show = function() {
        var t = e.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            if (this.$element.trigger(t), t.isDefaultPrevented()) return;
            var n = this,
                s = this.tip();
            this.setContent(), this.options.animation && s.addClass("fade");
            var r = "function" == typeof this.options.placement ? this.options.placement.call(this, s[0], this.$element[0]) : this.options.placement,
                o = /\s?auto?\s?/i,
                i = o.test(r);
            i && (r = r.replace(o, "") || "top"), s.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(r), this.options.container ? s.appendTo(this.options.container) : s.insertAfter(this.$element);
            var a = this.getPosition(),
                l = s[0].offsetWidth,
                c = s[0].offsetHeight;
            if (i) {
                var h = this.$element.parent(),
                    u = r,
                    p = document.documentElement.scrollTop || document.body.scrollTop,
                    d = "body" == this.options.container ? window.innerWidth : h.outerWidth(),
                    f = "body" == this.options.container ? window.innerHeight : h.outerHeight(),
                    g = "body" == this.options.container ? 0 : h.offset().left;
                r = "bottom" == r && a.top + a.height + c - p > f ? "top" : "top" == r && a.top - p - c < 0 ? "bottom" : "right" == r && a.right + l > d ? "left" : "left" == r && a.left - l < g ? "right" : r, s.removeClass(u).addClass(r)
            }
            var m = this.getCalculatedOffset(r, a, l, c);
            this.applyPlacement(m, r), this.hoverState = null;
            var _ = function() {
                n.$element.trigger("shown.bs." + n.type)
            };
            e.support.transition && this.$tip.hasClass("fade") ? s.one(e.support.transition.end, _).emulateTransitionEnd(150) : _()
        }
    }, t.prototype.applyPlacement = function(t, n) {
        var s, r = this.tip(),
            o = r[0].offsetWidth,
            i = r[0].offsetHeight,
            a = parseInt(r.css("margin-top"), 10),
            l = parseInt(r.css("margin-left"), 10);
        isNaN(a) && (a = 0), isNaN(l) && (l = 0), t.top = t.top + a, t.left = t.left + l, e.offset.setOffset(r[0], e.extend({
            using: function(e) {
                r.css({
                    top: Math.round(e.top),
                    left: Math.round(e.left)
                })
            }
        }, t), 0), r.addClass("in");
        var c = r[0].offsetWidth,
            h = r[0].offsetHeight;
        if ("top" == n && h != i && (s = !0, t.top = t.top + i - h), /bottom|top/.test(n)) {
            var u = 0;
            t.left < 0 && (u = -2 * t.left, t.left = 0, r.offset(t), c = r[0].offsetWidth, h = r[0].offsetHeight), this.replaceArrow(u - o + c, c, "left")
        } else this.replaceArrow(h - i, h, "top");
        s && r.offset(t)
    }, t.prototype.replaceArrow = function(e, t, n) {
        this.arrow().css(n, e ? 50 * (1 - e / t) + "%" : "")
    }, t.prototype.setContent = function() {
        var e = this.tip(),
            t = this.getTitle();
        e.find(".tooltip-inner")[this.options.html ? "html" : "text"](t), e.removeClass("fade in top bottom left right")
    }, t.prototype.hide = function() {
        function t() {
            "in" != n.hoverState && s.detach(), n.$element.trigger("hidden.bs." + n.type)
        }
        var n = this,
            s = this.tip(),
            r = e.Event("hide.bs." + this.type);
        return this.$element.trigger(r), r.isDefaultPrevented() ? void 0 : (s.removeClass("in"), e.support.transition && this.$tip.hasClass("fade") ? s.one(e.support.transition.end, t).emulateTransitionEnd(150) : t(), this.hoverState = null, this)
    }, t.prototype.fixTitle = function() {
        var e = this.$element;
        (e.attr("title") || "string" != typeof e.attr("data-original-title")) && e.attr("data-original-title", e.attr("title") || "").attr("title", "")
    }, t.prototype.hasContent = function() {
        return this.getTitle()
    }, t.prototype.getPosition = function() {
        var t = this.$element[0];
        return e.extend({}, "function" == typeof t.getBoundingClientRect ? t.getBoundingClientRect() : {
            width: t.offsetWidth,
            height: t.offsetHeight
        }, this.$element.offset())
    }, t.prototype.getCalculatedOffset = function(e, t, n, s) {
        return "bottom" == e ? {
            top: t.top + t.height,
            left: t.left + t.width / 2 - n / 2
        } : "top" == e ? {
            top: t.top - s,
            left: t.left + t.width / 2 - n / 2
        } : "left" == e ? {
            top: t.top + t.height / 2 - s / 2,
            left: t.left - n
        } : {
            top: t.top + t.height / 2 - s / 2,
            left: t.left + t.width
        }
    }, t.prototype.getTitle = function() {
        var e, t = this.$element,
            n = this.options;
        return e = t.attr("data-original-title") || ("function" == typeof n.title ? n.title.call(t[0]) : n.title)
    }, t.prototype.tip = function() {
        return this.$tip = this.$tip || e(this.options.template)
    }, t.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }, t.prototype.validate = function() {
        this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null)
    }, t.prototype.enable = function() {
        this.enabled = !0
    }, t.prototype.disable = function() {
        this.enabled = !1
    }, t.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    }, t.prototype.toggle = function(t) {
        var n = t ? e(t.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type) : this;
        n.tip().hasClass("in") ? n.leave(n) : n.enter(n)
    }, t.prototype.destroy = function() {
        clearTimeout(this.timeout), this.hide().$element.off("." + this.type).removeData("bs." + this.type)
    };
    var n = e.fn.tooltip;
    e.fn.tooltip = function(n) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.tooltip"),
                o = "object" == typeof n && n;
            (r || "destroy" != n) && (r || s.data("bs.tooltip", r = new t(this, o)), "string" == typeof n && r[n]())
        })
    }, e.fn.tooltip.Constructor = t, e.fn.tooltip.noConflict = function() {
        return e.fn.tooltip = n, this
    }
}(jQuery), + function(e) {
    "use strict";
    var t = function(e, t) {
        this.init("popover", e, t)
    };
    if (!e.fn.tooltip) throw new Error("Popover requires tooltip.js");
    t.DEFAULTS = e.extend({}, e.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }), t.prototype = e.extend({}, e.fn.tooltip.Constructor.prototype), t.prototype.constructor = t, t.prototype.getDefaults = function() {
        return t.DEFAULTS
    }, t.prototype.setContent = function() {
        var e = this.tip(),
            t = this.getTitle(),
            n = this.getContent();
        e.find(".popover-title")[this.options.html ? "html" : "text"](t), e.find(".popover-content")[this.options.html ? "string" == typeof n ? "html" : "append" : "text"](n), e.removeClass("fade top bottom left right in"), e.find(".popover-title").html() || e.find(".popover-title").hide()
    }, t.prototype.hasContent = function() {
        return this.getTitle() || this.getContent()
    }, t.prototype.getContent = function() {
        var e = this.$element,
            t = this.options;
        return e.attr("data-content") || ("function" == typeof t.content ? t.content.call(e[0]) : t.content)
    }, t.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    }, t.prototype.tip = function() {
        return this.$tip || (this.$tip = e(this.options.template)), this.$tip
    };
    var n = e.fn.popover;
    e.fn.popover = function(n) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.popover"),
                o = "object" == typeof n && n;
            (r || "destroy" != n) && (r || s.data("bs.popover", r = new t(this, o)), "string" == typeof n && r[n]())
        })
    }, e.fn.popover.Constructor = t, e.fn.popover.noConflict = function() {
        return e.fn.popover = n, this
    }
}(jQuery), + function(e) {
    "use strict";

    function t(n, s) {
        var r, o = e.proxy(this.process, this);
        this.$element = e(e(n).is("body") ? window : n), this.$body = e("body"), this.$scrollElement = this.$element.on("scroll.bs.scroll-spy.data-api", o), this.options = e.extend({}, t.DEFAULTS, s), this.selector = (this.options.target || (r = e(n).attr("href")) && r.replace(/.*(?=#[^\s]+$)/, "") || "") + " .nav li > a", this.offsets = e([]), this.targets = e([]), this.activeTarget = null, this.refresh(), this.process()
    }
    t.DEFAULTS = {
        offset: 10
    }, t.prototype.refresh = function() {
        var t = this.$element[0] == window ? "offset" : "position";
        this.offsets = e([]), this.targets = e([]);
        var n = this;
        this.$body.find(this.selector).map(function() {
            var s = e(this),
                r = s.data("target") || s.attr("href"),
                o = /^#./.test(r) && e(r);
            return o && o.length && o.is(":visible") && [
                [o[t]().top + (!e.isWindow(n.$scrollElement.get(0)) && n.$scrollElement.scrollTop()), r]
            ] || null
        }).sort(function(e, t) {
            return e[0] - t[0]
        }).each(function() {
            n.offsets.push(this[0]), n.targets.push(this[1])
        })
    }, t.prototype.process = function() {
        var e, t = this.$scrollElement.scrollTop() + this.options.offset,
            n = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight,
            s = n - this.$scrollElement.height(),
            r = this.offsets,
            o = this.targets,
            i = this.activeTarget;
        if (t >= s) return i != (e = o.last()[0]) && this.activate(e);
        if (i && t <= r[0]) return i != (e = o[0]) && this.activate(e);
        for (e = r.length; e--;) i != o[e] && t >= r[e] && (!r[e + 1] || t <= r[e + 1]) && this.activate(o[e])
    }, t.prototype.activate = function(t) {
        this.activeTarget = t, e(this.selector).parentsUntil(this.options.target, ".active").removeClass("active");
        var n = this.selector + '[data-target="' + t + '"],' + this.selector + '[href="' + t + '"]',
            s = e(n).parents("li").addClass("active");
        s.parent(".dropdown-menu").length && (s = s.closest("li.dropdown").addClass("active")), s.trigger("activate.bs.scrollspy")
    };
    var n = e.fn.scrollspy;
    e.fn.scrollspy = function(n) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.scrollspy"),
                o = "object" == typeof n && n;
            r || s.data("bs.scrollspy", r = new t(this, o)), "string" == typeof n && r[n]()
        })
    }, e.fn.scrollspy.Constructor = t, e.fn.scrollspy.noConflict = function() {
        return e.fn.scrollspy = n, this
    }, e(window).on("load", function() {
        e('[data-spy="scroll"]').each(function() {
            var t = e(this);
            t.scrollspy(t.data())
        })
    })
}(jQuery), + function(e) {
    "use strict";
    var t = function(t) {
        this.element = e(t)
    };
    t.prototype.show = function() {
        var t = this.element,
            n = t.closest("ul:not(.dropdown-menu)"),
            s = t.data("target");
        if (s || (s = t.attr("href"), s = s && s.replace(/.*(?=#[^\s]*$)/, "")), !t.parent("li").hasClass("active")) {
            var r = n.find(".active:last a")[0],
                o = e.Event("show.bs.tab", {
                    relatedTarget: r
                });
            if (t.trigger(o), !o.isDefaultPrevented()) {
                var i = e(s);
                this.activate(t.parent("li"), n), this.activate(i, i.parent(), function() {
                    t.trigger({
                        type: "shown.bs.tab",
                        relatedTarget: r
                    })
                })
            }
        }
    }, t.prototype.activate = function(t, n, s) {
        function r() {
            o.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"), t.addClass("active"), i ? (t[0].offsetWidth, t.addClass("in")) : t.removeClass("fade"), t.parent(".dropdown-menu") && t.closest("li.dropdown").addClass("active"), s && s()
        }
        var o = n.find("> .active"),
            i = s && e.support.transition && o.hasClass("fade");
        i ? o.one(e.support.transition.end, r).emulateTransitionEnd(150) : r(), o.removeClass("in")
    };
    var n = e.fn.tab;
    e.fn.tab = function(n) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.tab");
            r || s.data("bs.tab", r = new t(this)), "string" == typeof n && r[n]()
        })
    }, e.fn.tab.Constructor = t, e.fn.tab.noConflict = function() {
        return e.fn.tab = n, this
    }, e(document).on("click.bs.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]', function(t) {
        t.preventDefault(), e(this).tab("show")
    })
}(jQuery), + function(e) {
    "use strict";
    var t = function(n, s) {
        this.options = e.extend({}, t.DEFAULTS, s), this.$window = e(window).on("scroll.bs.affix.data-api", e.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", e.proxy(this.checkPositionWithEventLoop, this)), this.$element = e(n), this.affixed = this.unpin = this.pinnedOffset = null, this.checkPosition()
    };
    t.RESET = "affix affix-top affix-bottom", t.DEFAULTS = {
        offset: 0
    }, t.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(t.RESET).addClass("affix");
        var e = this.$window.scrollTop(),
            n = this.$element.offset();
        return this.pinnedOffset = n.top - e
    }, t.prototype.checkPositionWithEventLoop = function() {
        setTimeout(e.proxy(this.checkPosition, this), 1)
    }, t.prototype.checkPosition = function() {
        if (this.$element.is(":visible")) {
            var n = e(document).height(),
                s = this.$window.scrollTop(),
                r = this.$element.offset(),
                o = this.options.offset,
                i = o.top,
                a = o.bottom;
            "top" == this.affixed && (r.top += s), "object" != typeof o && (a = i = o), "function" == typeof i && (i = o.top(this.$element)), "function" == typeof a && (a = o.bottom(this.$element));
            var l = null != this.unpin && s + this.unpin <= r.top ? !1 : null != a && r.top + this.$element.height() >= n - a ? "bottom" : null != i && i >= s ? "top" : !1;
            if (this.affixed !== l) {
                this.unpin && this.$element.css("top", "");
                var c = "affix" + (l ? "-" + l : ""),
                    h = e.Event(c + ".bs.affix");
                this.$element.trigger(h), h.isDefaultPrevented() || (this.affixed = l, this.unpin = "bottom" == l ? this.getPinnedOffset() : null, this.$element.removeClass(t.RESET).addClass(c).trigger(e.Event(c.replace("affix", "affixed"))), "bottom" == l && this.$element.offset({
                    top: n - a - this.$element.height()
                }))
            }
        }
    };
    var n = e.fn.affix;
    e.fn.affix = function(n) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.affix"),
                o = "object" == typeof n && n;
            r || s.data("bs.affix", r = new t(this, o)), "string" == typeof n && r[n]()
        })
    }, e.fn.affix.Constructor = t, e.fn.affix.noConflict = function() {
        return e.fn.affix = n, this
    }, e(window).on("load", function() {
        e('[data-spy="affix"]').each(function() {
            var t = e(this),
                n = t.data();
            n.offset = n.offset || {}, n.offsetBottom && (n.offset.bottom = n.offsetBottom), n.offsetTop && (n.offset.top = n.offsetTop), t.affix(n)
        })
    })
}(jQuery),
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
function($) {
    window.log = function() {
        log.history = log.history || [], log.history.push(arguments), this.console && console.log(Array.prototype.slice.call(arguments))
    }, $.fn.snippet = function(e, t) {
        "object" == typeof e && (t = e), "string" == typeof e && (e = e.toLowerCase());
        var n = {
                style: "random",
                showNum: !0,
                transparent: !1,
                collapse: !1,
                menu: !0,
                showMsg: "Expand Code",
                hideMsg: "Collapse Code",
                clipboard: "",
                startCollapsed: !0,
                startText: !1,
                box: "",
                boxColor: "",
                boxFill: ""
            },
            s = ["acid", "berries-dark", "berries-light", "bipolar", "blacknblue", "bright", "contrast", "darkblue", "darkness", "desert", "dull", "easter", "emacs", "golden", "greenlcd", "ide-anjuta", "ide-codewarrior", "ide-devcpp", "ide-eclipse", "ide-kdev", "ide-msvcpp", "kwrite", "matlab", "navy", "nedit", "neon", "night", "pablo", "peachpuff", "print", "rand01", "the", "typical", "vampire", "vim", "vim-dark", "whatis", "whitengrey", "zellner"];
        return t && $.extend(n, t), this.each(function() {
            var t = n.style.toLowerCase();
            if ("random" == n.style) {
                var r = Math.floor(Math.random() * s.length);
                t = s[r]
            }
            var o = $(this),
                i = this.nodeName.toLowerCase();
            if ("pre" != i) {
                var a = "Snippet Error: Sorry, Snippet only formats '<pre>' elements. '<" + i + ">' elements are currently unsupported.";
                return console.log(a), !1
            }
            if (void 0 == o.data("orgHtml") || null == o.data("orgHtml")) {
                var l = o.html();
                o.data("orgHtml", l)
            }
            if (o.parent().hasClass("snippet-wrap")) {
                if (o.parent().attr("class", "sh_" + t + " snippet-wrap"), o.parents(".snippet-container").find(".snippet-reveal").attr("class", "sh_" + t + " snippet-wrap snippet-reveal"), o.find("li.box, li.box-top, li.box-mid, li.box-bot").removeAttr("style").removeAttr("class"), o.find("li .box-sp").remove(), n.transparent) {
                    var c = {
                        "background-color": "transparent",
                        "box-shadow": "none",
                        "-moz-box-shadow": "none",
                        "-webkit-box-shadow": "none"
                    };
                    o.css(c), o.next(".snippet-textonly").css(c), o.parents(".snippet-container").find(".snippet-hide pre").css(c)
                } else {
                    var c = {
                        "background-color": "",
                        "box-shadow": "",
                        "-moz-box-shadow": "",
                        "-webkit-box-shadow": ""
                    };
                    o.css(c), o.next(".snippet-textonly").css(c), o.parents(".snippet-container").find(".snippet-reveal pre").css(c)
                }
                if (n.showNum) {
                    var h = o.find("li").eq(0).parent();
                    if (h.hasClass("snippet-no-num")) {
                        h.wrap("<ol class='snippet-num'></ol>");
                        var u = o.find("li").eq(0);
                        u.unwrap()
                    }
                } else {
                    var h = o.find("li").eq(0).parent();
                    if (h.hasClass("snippet-num")) {
                        h.wrap("<ul class='snippet-no-num'></ul>");
                        var u = o.find("li").eq(0);
                        u.unwrap()
                    }
                }
                if ("" != n.box) {
                    for (var p = "<span class='box-sp'>&nbsp;</span>", d = n.box.split(","), f = 0; f < d.length; f++) {
                        var g = d[f];
                        if (-1 == g.indexOf("-")) g = parseFloat(g) - 1, o.find("li").eq(g).addClass("box").prepend(p);
                        else {
                            var m = parseFloat(g.split("-")[0]) - 1,
                                _ = parseFloat(g.split("-")[1]) - 1;
                            if (_ > m) {
                                o.find("li").eq(m).addClass("box box-top").prepend(p), o.find("li").eq(_).addClass("box box-bot").prepend(p);
                                for (var y = m + 1; _ > y; y++) o.find("li").eq(y).addClass("box box-mid").prepend(p)
                            } else m == _ && o.find("li").eq(m).addClass("box").prepend(p)
                        }
                    }
                    "" != n.boxColor && o.find("li.box").css("border-color", n.boxColor), "" != n.boxFill && o.find("li.box").addClass("box-bg").css("background-color", n.boxFill)
                }
                sh_highlightDocument(), n.menu ? o.prev(".snippet-menu").find("pre,.snippet-clipboard").show() : o.prev(".snippet-menu").find("pre,.snippet-clipboard").hide()
            } else {
                if ("string" != typeof e) {
                    if (o.attr("class").length > 0) var v = ' class="' + o.attr("class") + '"';
                    else var v = "";
                    if (o.attr("id").length > 0) var b = ' id="' + o.attr("id") + '"';
                    else var b = "";
                    var a = "Snippet Error: You must specify a language on inital usage of Snippet. Reference <pre" + v + b + ">";
                    return console.log(a), !1
                }
                if (o.addClass("sh_" + e).addClass("snippet-formatted").wrap("<div class='snippet-container' style='" + o.attr("style") + ";'><div class='sh_" + t + " snippet-wrap'></div></div>"), o.removeAttr("style"), sh_highlightDocument(), n.showNum) {
                    var x = o.html();
                    for (x = x.replace(/\n/g, "</li><li>"), x = "<ol class='snippet-num'><li>" + x + "</li></ol>"; - 1 != x.indexOf("<li></li></ol>");) x = x.replace("<li></li></ol>", "</ol>")
                } else {
                    var x = o.html();
                    for (x = x.replace(/\n/g, "</li><li>"), x = "<ul class='snippet-no-num'><li>" + x + "</li></ul>"; - 1 != x.indexOf("<li></li></ul>");) x = x.replace("<li></li></ul>", "</ul>")
                }
                for (x = x.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;"), o.html(x);
                    "" == o.find("li").eq(0).html();) o.find("li").eq(0).remove();
                o.find("li").each(function() {
                    if ($(this).html().length < 2) {
                        var e = $(this).html().replace(/\s/g, "");
                        "" == e && $(this).html("<span style='display:none;'>&nbsp;</span>")
                    }
                });
                var w = "<pre class='snippet-textonly sh_sourceCode' style='display:none;'>" + o.data("orgHtml") + "</pre>",
                    A = "<div class='snippet-menu sh_sourceCode' style='display:none;'><pre><a class='snippet-copy' href='#'>copy</a><a class='snippet-text' href='#'>text</a><a class='snippet-window' href='#'>pop-up</a></pre></div>";
                if (o.parent().append(w), o.parent().prepend(A), o.parent().hover(function() {
                    $(this).find(".snippet-menu").fadeIn("fast")
                }, function() {
                    $(this).find(".snippet-menu").fadeOut("fast")
                }), "" != n.clipboard && 0 != n.clipboard) {
                    var E = o.parent().find("a.snippet-copy");
                    E.show(), E.parents(".snippet-menu").show();
                    var C = o.parents(".snippet-wrap").find(".snippet-textonly").text();
                    ZeroClipboard.setMoviePath(n.clipboard);
                    var T = new ZeroClipboard.Client;
                    T.setText(C), T.glue(E[0], E.parents(".snippet-menu")[0]), T.addEventListener("complete", function(e, t) {
                        t.length > 500 && (t = t.substr(0, 500) + "...\n\n(" + (t.length - 500) + " characters not shown)"), alert("Copied text to clipboard:\n\n " + t)
                    }), E.parents(".snippet-menu").hide()
                } else o.parent().find("a.snippet-copy").hide();
                if (o.parent().find("a.snippet-text").click(function() {
                    var e = $(this).parents(".snippet-wrap").find(".snippet-formatted"),
                        t = $(this).parents(".snippet-wrap").find(".snippet-textonly");
                    return e.toggle(), t.toggle(), $(this).html(t.is(":visible") ? "html" : "text"), $(this).blur(), !1
                }), o.parent().find("a.snippet-window").click(function() {
                    var e = $(this).parents(".snippet-wrap").find(".snippet-textonly").html();
                    return snippetPopup(e), $(this).blur(), !1
                }), n.menu || o.prev(".snippet-menu").find("pre,.snippet-clipboard").hide(), n.collapse) {
                    var k = o.parent().attr("class"),
                        z = "<div class='snippet-reveal " + k + "'><pre class='sh_sourceCode'><a href='#' class='snippet-toggle'>" + n.showMsg + "</a></pre></div>",
                        Z = "<div class='sh_sourceCode snippet-hide'><pre><a href='#' class='snippet-revealed snippet-toggle'>" + n.hideMsg + "</a></pre></div>";
                    o.parents(".snippet-container").append(z), o.parent().append(Z);
                    var N = o.parents(".snippet-container");
                    n.startCollapsed ? (N.find(".snippet-reveal").show(), N.find(".snippet-wrap").eq(0).hide()) : (N.find(".snippet-reveal").hide(), N.find(".snippet-wrap").eq(0).show()), N.find("a.snippet-toggle").click(function() {
                        return N.find(".snippet-wrap").toggle(), !1
                    })
                }
                if (n.transparent) {
                    var c = {
                        "background-color": "transparent",
                        "box-shadow": "none",
                        "-moz-box-shadow": "none",
                        "-webkit-box-shadow": "none"
                    };
                    o.css(c), o.next(".snippet-textonly").css(c), o.parents(".snippet-container").find(".snippet-reveal pre").css(c)
                }
                if (n.startText && (o.hide(), o.next(".snippet-textonly").show(), o.parent().find(".snippet-text").html("html")), "" != n.box) {
                    for (var p = "<span class='box-sp'>&nbsp;</span>", d = n.box.split(","), f = 0; f < d.length; f++) {
                        var g = d[f];
                        if (-1 == g.indexOf("-")) g = parseFloat(g) - 1, o.find("li").eq(g).addClass("box").prepend(p);
                        else {
                            var m = parseFloat(g.split("-")[0]) - 1,
                                _ = parseFloat(g.split("-")[1]) - 1;
                            if (_ > m) {
                                o.find("li").eq(m).addClass("box box-top").prepend(p), o.find("li").eq(_).addClass("box box-bot").prepend(p);
                                for (var y = m + 1; _ > y; y++) o.find("li").eq(y).addClass("box box-mid").prepend(p)
                            } else m == _ && o.find("li").eq(m).addClass("box").prepend(p)
                        }
                    }
                    "" != n.boxColor && o.find("li.box").css("border-color", n.boxColor), "" != n.boxFill && o.find("li.box, li.box-top, li.box-mid, li.box-bot").addClass("box-bg").css("background-color", n.boxFill)
                }
                o.parents(".snippet-container").find("a").addClass("sh_url")
            }
        })
    }
}(jQuery);
var ZeroClipboard = {
    version: "1.0.7",
    clients: {},
    moviePath: "ZeroClipboard.swf",
    nextId: 1,
    $: function(e) {
        return "string" == typeof e && (e = document.getElementById(e)), e.addClass || (e.hide = function() {
            this.style.display = "none"
        }, e.show = function() {
            this.style.display = ""
        }, e.addClass = function(e) {
            this.removeClass(e), this.className += " " + e
        }, e.removeClass = function(e) {
            for (var t = this.className.split(/\s+/), n = -1, s = 0; s < t.length; s++) t[s] == e && (n = s, s = t.length);
            return n > -1 && (t.splice(n, 1), this.className = t.join(" ")), this
        }, e.hasClass = function(e) {
            return !!this.className.match(new RegExp("\\s*" + e + "\\s*"))
        }), e
    },
    setMoviePath: function(e) {
        this.moviePath = e
    },
    dispatch: function(e, t, n) {
        var s = this.clients[e];
        s && s.receiveEvent(t, n)
    },
    register: function(e, t) {
        this.clients[e] = t
    },
    getDOMObjectPosition: function(e, t) {
        for (var n = {
            left: 0,
            top: 0,
            width: e.width ? e.width : e.offsetWidth,
            height: e.height ? e.height : e.offsetHeight
        }; e && e != t;) n.left += e.offsetLeft, n.top += e.offsetTop, e = e.offsetParent;
        return n
    },
    Client: function(e) {
        this.handlers = {}, this.id = ZeroClipboard.nextId++, this.movieId = "ZeroClipboardMovie_" + this.id, ZeroClipboard.register(this.id, this), e && this.glue(e)
    }
};
ZeroClipboard.Client.prototype = {
    id: 0,
    ready: !1,
    movie: null,
    clipText: "",
    handCursorEnabled: !0,
    cssEffects: !0,
    handlers: null,
    glue: function(e, t, n) {
        this.domElement = ZeroClipboard.$(e);
        var s = 99;
        this.domElement.style.zIndex && (s = parseInt(this.domElement.style.zIndex, 10) + 1), "string" == typeof t ? t = ZeroClipboard.$(t) : "undefined" == typeof t && (t = document.getElementsByTagName("body")[0]);
        var r = ZeroClipboard.getDOMObjectPosition(this.domElement, t);
        this.div = document.createElement("div"), this.div.className = "snippet-clipboard";
        var o = this.div.style;
        if (o.position = "absolute", o.left = "" + r.left + "px", o.top = "" + r.top + "px", o.width = "" + r.width + "px", o.height = "" + r.height + "px", o.zIndex = s, "object" == typeof n)
            for (addedStyle in n) o[addedStyle] = n[addedStyle];
        t.appendChild(this.div), this.div.innerHTML = this.getHTML(r.width, r.height)
    },
    getHTML: function(e, t) {
        var n = "",
            s = "id=" + this.id + "&width=" + e + "&height=" + t;
        if (navigator.userAgent.match(/MSIE/)) {
            var r = location.href.match(/^https/i) ? "https://" : "http://";
            n += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + r + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + e + '" height="' + t + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + ZeroClipboard.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + s + '"/><param name="wmode" value="transparent"/></object>'
        } else n += '<embed id="' + this.movieId + '" src="' + ZeroClipboard.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + e + '" height="' + t + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + s + '" wmode="transparent" />';
        return n
    },
    hide: function() {
        this.div && (this.div.style.left = "-2000px")
    },
    show: function() {
        this.reposition()
    },
    destroy: function() {
        if (this.domElement && this.div) {
            this.hide(), this.div.innerHTML = "";
            var e = document.getElementsByTagName("body")[0];
            try {
                e.removeChild(this.div)
            } catch (t) {}
            this.domElement = null, this.div = null
        }
    },
    reposition: function(e) {
        if (e && (this.domElement = ZeroClipboard.$(e), this.domElement || this.hide()), this.domElement && this.div) {
            var t = ZeroClipboard.getDOMObjectPosition(this.domElement),
                n = this.div.style;
            n.left = "" + t.left + "px", n.top = "" + t.top + "px"
        }
    },
    setText: function(e) {
        this.clipText = e, this.ready && this.movie.setText(e)
    },
    addEventListener: function(e, t) {
        e = e.toString().toLowerCase().replace(/^on/, ""), this.handlers[e] || (this.handlers[e] = []), this.handlers[e].push(t)
    },
    setHandCursor: function(e) {
        this.handCursorEnabled = e, this.ready && this.movie.setHandCursor(e)
    },
    setCSSEffects: function(e) {
        this.cssEffects = !!e
    },
    receiveEvent: function(e, t) {
        switch (e = e.toString().toLowerCase().replace(/^on/, "")) {
            case "load":
                if (this.movie = document.getElementById(this.movieId), !this.movie) {
                    var n = this;
                    return void setTimeout(function() {
                        n.receiveEvent("load", null)
                    }, 1)
                }
                if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                    var n = this;
                    return setTimeout(function() {
                        n.receiveEvent("load", null)
                    }, 100), void(this.ready = !0)
                }
                this.ready = !0;
                try {
                    this.movie.setText(this.clipText)
                } catch (s) {}
                try {
                    this.movie.setHandCursor(this.handCursorEnabled)
                } catch (s) {}
                break;
            case "mouseover":
                this.domElement && this.cssEffects && (this.domElement.addClass("hover"), this.recoverActive && this.domElement.addClass("active"));
                break;
            case "mouseout":
                this.domElement && this.cssEffects && (this.recoverActive = !1, this.domElement.hasClass("active") && (this.domElement.removeClass("active"), this.recoverActive = !0), this.domElement.removeClass("hover"));
                break;
            case "mousedown":
                this.domElement && this.cssEffects && this.domElement.addClass("active");
                break;
            case "mouseup":
                this.domElement && this.cssEffects && (this.domElement.removeClass("active"), this.recoverActive = !1)
        }
        if (this.handlers[e])
            for (var r = 0, o = this.handlers[e].length; o > r; r++) {
                var i = this.handlers[e][r];
                "function" == typeof i ? i(this, t) : "object" == typeof i && 2 == i.length ? i[0][i[1]](this, t) : "string" == typeof i && window[i](this, t)
            }
    }
}, this.sh_languages || (this.sh_languages = {});
var sh_requests = {};
if (this.sh_languages || (this.sh_languages = {}), sh_languages.c = [
    [
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9],
        [/(\bstruct)([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/^[ \t]*#(?:[ \t]*include)/g, "sh_preproc", 10, 1],
        [/^[ \t]*#(?:[ \t]*[A-Za-z0-9_]*)/g, "sh_preproc", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 13],
        [/'/g, "sh_string", 14],
        [/\b(?:__asm|__cdecl|__declspec|__export|__far16|__fastcall|__fortran|__import|__pascal|__rtti|__stdcall|_asm|_cdecl|__except|_export|_far16|_fastcall|__finally|_fortran|_import|_pascal|_stdcall|__thread|__try|asm|auto|break|case|catch|cdecl|const|continue|default|do|else|enum|extern|for|goto|if|pascal|register|return|sizeof|static|struct|switch|typedef|union|volatile|while)\b/g, "sh_keyword", -1],
        [/\b(?:bool|char|double|float|int|long|short|signed|unsigned|void|wchar_t)\b/g, "sh_type", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1],
        [/([A-Za-z](?:[^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]|[_])*)((?:<.*>)?)(\s+(?=[*&]*[A-Za-z][^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]*\s*[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\[\]]+))/g, ["sh_usertype", "sh_usertype", "sh_normal"], -1]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 5]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/$/g, null, -2],
        [/</g, "sh_string", 11],
        [/"/g, "sh_string", 12],
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9]
    ],
    [
        [/$/g, null, -2],
        [/>/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/"/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/'/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.cpp = [
    [
        [/(\b(?:class|struct|typename))([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/\b(?:class|const_cast|delete|dynamic_cast|explicit|false|friend|inline|mutable|namespace|new|operator|private|protected|public|reinterpret_cast|static_cast|template|this|throw|true|try|typeid|typename|using|virtual)\b/g, "sh_keyword", -1],
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9],
        [/(\bstruct)([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/^[ \t]*#(?:[ \t]*include)/g, "sh_preproc", 10, 1],
        [/^[ \t]*#(?:[ \t]*[A-Za-z0-9_]*)/g, "sh_preproc", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 13],
        [/'/g, "sh_string", 14],
        [/\b(?:__asm|__cdecl|__declspec|__export|__far16|__fastcall|__fortran|__import|__pascal|__rtti|__stdcall|_asm|_cdecl|__except|_export|_far16|_fastcall|__finally|_fortran|_import|_pascal|_stdcall|__thread|__try|asm|auto|break|case|catch|cdecl|const|continue|default|do|else|enum|extern|for|goto|if|pascal|register|return|sizeof|static|struct|switch|typedef|union|volatile|while)\b/g, "sh_keyword", -1],
        [/\b(?:bool|char|double|float|int|long|short|signed|unsigned|void|wchar_t)\b/g, "sh_type", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1],
        [/([A-Za-z](?:[^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]|[_])*)((?:<.*>)?)(\s+(?=[*&]*[A-Za-z][^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]*\s*[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\[\]]+))/g, ["sh_usertype", "sh_usertype", "sh_normal"], -1]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 5]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/$/g, null, -2],
        [/</g, "sh_string", 11],
        [/"/g, "sh_string", 12],
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9]
    ],
    [
        [/$/g, null, -2],
        [/>/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/"/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/'/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.csharp = [
    [
        [/\b(?:using)\b/g, "sh_preproc", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))(?:[FfDdMmUulL]+)?\b/g, "sh_number", -1],
        [/(\b(?:class|struct|typename))([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/\b(?:abstract|event|new|struct|as|explicit|null|switch|base|extern|this|false|operator|throw|break|finally|out|true|fixed|override|try|case|params|typeof|catch|for|private|foreach|protected|checked|goto|public|unchecked|class|if|readonly|unsafe|const|implicit|ref|continue|in|return|virtual|default|interface|sealed|volatile|delegate|internal|do|is|sizeof|while|lock|stackalloc|else|static|enum|namespace|get|partial|set|value|where|yield)\b/g, "sh_keyword", -1],
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9],
        [/(\bstruct)([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/^[ \t]*#(?:[ \t]*include)/g, "sh_preproc", 10, 1],
        [/^[ \t]*#(?:[ \t]*[A-Za-z0-9_]*)/g, "sh_preproc", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 13],
        [/'/g, "sh_string", 14],
        [/\b(?:bool|byte|sbyte|char|decimal|double|float|int|uint|long|ulong|object|short|ushort|string|void)\b/g, "sh_type", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1],
        [/([A-Za-z](?:[^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]|[_])*)((?:<.*>)?)(\s+(?=[*&]*[A-Za-z][^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]*\s*[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\[\]]+))/g, ["sh_usertype", "sh_usertype", "sh_normal"], -1]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 5]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/$/g, null, -2],
        [/</g, "sh_string", 11],
        [/"/g, "sh_string", 12],
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9]
    ],
    [
        [/$/g, null, -2],
        [/>/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/"/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/'/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.css = [
    [
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9],
        [/(?:\.|#)[A-Za-z0-9_]+/g, "sh_selector", -1],
        [/\{/g, "sh_cbracket", 10, 1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 5]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\}/g, "sh_cbracket", -2],
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9],
        [/[A-Za-z0-9_-]+[ \t]*:/g, "sh_property", -1],
        [/[.%A-Za-z0-9_-]+/g, "sh_value", -1],
        [/#(?:[A-Za-z0-9_]+)/g, "sh_string", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.flex = [
    [
        [/^%\{/g, "sh_preproc", 1, 1],
        [/^%[sx]/g, "sh_preproc", 16, 1],
        [/^%option/g, "sh_preproc", 17, 1],
        [/^%(?:array|pointer|[aceknopr])/g, "sh_preproc", -1],
        [/[A-Za-z_][A-Za-z0-9_-]*/g, "sh_preproc", 19, 1],
        [/^%%/g, "sh_preproc", 20, 1]
    ],
    [
        [/^%\}/g, "sh_preproc", -2],
        [/(\b(?:class|struct|typename))([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/\b(?:class|const_cast|delete|dynamic_cast|explicit|false|friend|inline|mutable|namespace|new|operator|private|protected|public|reinterpret_cast|static_cast|template|this|throw|true|try|typeid|typename|using|virtual)\b/g, "sh_keyword", -1],
        [/\/\/\//g, "sh_comment", 2],
        [/\/\//g, "sh_comment", 8],
        [/\/\*\*/g, "sh_comment", 9],
        [/\/\*/g, "sh_comment", 10],
        [/(\bstruct)([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/^[ \t]*#(?:[ \t]*include)/g, "sh_preproc", 11, 1],
        [/^[ \t]*#(?:[ \t]*[A-Za-z0-9_]*)/g, "sh_preproc", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 14],
        [/'/g, "sh_string", 15],
        [/\b(?:__asm|__cdecl|__declspec|__export|__far16|__fastcall|__fortran|__import|__pascal|__rtti|__stdcall|_asm|_cdecl|__except|_export|_far16|_fastcall|__finally|_fortran|_import|_pascal|_stdcall|__thread|__try|asm|auto|break|case|catch|cdecl|const|continue|default|do|else|enum|extern|for|goto|if|pascal|register|return|sizeof|static|struct|switch|typedef|union|volatile|while)\b/g, "sh_keyword", -1],
        [/\b(?:bool|char|double|float|int|long|short|signed|unsigned|void|wchar_t)\b/g, "sh_type", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1],
        [/([A-Za-z](?:[^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]|[_])*)((?:<.*>)?)(\s+(?=[*&]*[A-Za-z][^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]*\s*[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\[\]]+))/g, ["sh_usertype", "sh_usertype", "sh_normal"], -1]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 3, 1],
        [/<!DOCTYPE/g, "sh_preproc", 5, 1],
        [/<!--/g, "sh_comment", 6],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 7, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 7, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 4]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 4]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 6]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 4]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 3, 1],
        [/<!DOCTYPE/g, "sh_preproc", 5, 1],
        [/<!--/g, "sh_comment", 6],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 7, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 7, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/$/g, null, -2],
        [/</g, "sh_string", 12],
        [/"/g, "sh_string", 13],
        [/\/\/\//g, "sh_comment", 2],
        [/\/\//g, "sh_comment", 8],
        [/\/\*\*/g, "sh_comment", 9],
        [/\/\*/g, "sh_comment", 10]
    ],
    [
        [/$/g, null, -2],
        [/>/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/"/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/'/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/$/g, null, -2],
        [/[A-Za-z_][A-Za-z0-9_-]*/g, "sh_function", -1]
    ],
    [
        [/$/g, null, -2],
        [/[A-Za-z_][A-Za-z0-9_-]*/g, "sh_keyword", -1],
        [/"/g, "sh_string", 18],
        [/=/g, "sh_symbol", -1]
    ],
    [
        [/$/g, null, -2],
        [/"/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\{[A-Za-z_][A-Za-z0-9_-]*\}/g, "sh_type", -1],
        [/"/g, "sh_string", 13],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1]
    ],
    [
        [/^%%/g, "sh_preproc", 21, 1],
        [/<[A-Za-z_][A-Za-z0-9_-]*>/g, "sh_function", -1],
        [/"/g, "sh_string", 13],
        [/\\./g, "sh_preproc", -1],
        [/\{[A-Za-z_][A-Za-z0-9_-]*\}/g, "sh_type", -1],
        [/\/\*/g, "sh_comment", 22],
        [/\{/g, "sh_cbracket", 23, 1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1]
    ],
    [
        [/(\b(?:class|struct|typename))([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/\b(?:class|const_cast|delete|dynamic_cast|explicit|false|friend|inline|mutable|namespace|new|operator|private|protected|public|reinterpret_cast|static_cast|template|this|throw|true|try|typeid|typename|using|virtual)\b/g, "sh_keyword", -1],
        [/\/\/\//g, "sh_comment", 2],
        [/\/\//g, "sh_comment", 8],
        [/\/\*\*/g, "sh_comment", 9],
        [/\/\*/g, "sh_comment", 10],
        [/(\bstruct)([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/^[ \t]*#(?:[ \t]*include)/g, "sh_preproc", 11, 1],
        [/^[ \t]*#(?:[ \t]*[A-Za-z0-9_]*)/g, "sh_preproc", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 14],
        [/'/g, "sh_string", 15],
        [/\b(?:__asm|__cdecl|__declspec|__export|__far16|__fastcall|__fortran|__import|__pascal|__rtti|__stdcall|_asm|_cdecl|__except|_export|_far16|_fastcall|__finally|_fortran|_import|_pascal|_stdcall|__thread|__try|asm|auto|break|case|catch|cdecl|const|continue|default|do|else|enum|extern|for|goto|if|pascal|register|return|sizeof|static|struct|switch|typedef|union|volatile|while)\b/g, "sh_keyword", -1],
        [/\b(?:bool|char|double|float|int|long|short|signed|unsigned|void|wchar_t)\b/g, "sh_type", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1],
        [/([A-Za-z](?:[^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]|[_])*)((?:<.*>)?)(\s+(?=[*&]*[A-Za-z][^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]*\s*[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\[\]]+))/g, ["sh_usertype", "sh_usertype", "sh_normal"], -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/\/\*/g, "sh_comment", 22]
    ],
    [
        [/\}/g, "sh_cbracket", -2],
        [/\{/g, "sh_cbracket", 23, 1],
        [/\$./g, "sh_variable", -1],
        [/(\b(?:class|struct|typename))([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/\b(?:class|const_cast|delete|dynamic_cast|explicit|false|friend|inline|mutable|namespace|new|operator|private|protected|public|reinterpret_cast|static_cast|template|this|throw|true|try|typeid|typename|using|virtual)\b/g, "sh_keyword", -1],
        [/\/\/\//g, "sh_comment", 2],
        [/\/\//g, "sh_comment", 8],
        [/\/\*\*/g, "sh_comment", 9],
        [/\/\*/g, "sh_comment", 10],
        [/(\bstruct)([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/^[ \t]*#(?:[ \t]*include)/g, "sh_preproc", 11, 1],
        [/^[ \t]*#(?:[ \t]*[A-Za-z0-9_]*)/g, "sh_preproc", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 14],
        [/'/g, "sh_string", 15],
        [/\b(?:__asm|__cdecl|__declspec|__export|__far16|__fastcall|__fortran|__import|__pascal|__rtti|__stdcall|_asm|_cdecl|__except|_export|_far16|_fastcall|__finally|_fortran|_import|_pascal|_stdcall|__thread|__try|asm|auto|break|case|catch|cdecl|const|continue|default|do|else|enum|extern|for|goto|if|pascal|register|return|sizeof|static|struct|switch|typedef|union|volatile|while)\b/g, "sh_keyword", -1],
        [/\b(?:bool|char|double|float|int|long|short|signed|unsigned|void|wchar_t)\b/g, "sh_type", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1],
        [/([A-Za-z](?:[^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]|[_])*)((?:<.*>)?)(\s+(?=[*&]*[A-Za-z][^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]*\s*[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\[\]]+))/g, ["sh_usertype", "sh_usertype", "sh_normal"], -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.html = [
    [
        [/<\?xml/g, "sh_preproc", 1, 1],
        [/<!DOCTYPE/g, "sh_preproc", 3, 1],
        [/<!--/g, "sh_comment", 4],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 5, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 5, 1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 4]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.java = [
    [
        [/\b(?:import|package)\b/g, "sh_preproc", -1],
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 10],
        [/'/g, "sh_string", 11],
        [/(\b(?:class|interface))([ \t]+)([$A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/\b(?:abstract|assert|break|case|catch|class|const|continue|default|do|else|extends|false|final|finally|for|goto|if|implements|instanceof|interface|native|new|null|private|protected|public|return|static|strictfp|super|switch|synchronized|throw|throws|true|this|transient|try|volatile|while)\b/g, "sh_keyword", -1],
        [/\b(?:int|byte|boolean|char|long|float|double|short|void)\b/g, "sh_type", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1],
        [/([A-Za-z](?:[^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]|[_])*)((?:<.*>)?)(\s+(?=[*&]*[A-Za-z][^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]*\s*[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\[\]]+))/g, ["sh_usertype", "sh_usertype", "sh_normal"], -1]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 5]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/"/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/'/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.javascript = [
    [
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9],
        [/\b(?:abstract|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|final|finally|for|function|goto|if|implements|in|instanceof|interface|native|new|null|private|protected|prototype|public|return|static|super|switch|synchronized|throw|throws|this|transient|true|try|typeof|var|volatile|while|with)\b/g, "sh_keyword", -1],
        [/(\+\+|--|\)|\])(\s*)(\/=?(?![*\/]))/g, ["sh_symbol", "sh_normal", "sh_symbol"], -1],
        [/(0x[A-Fa-f0-9]+|(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?)(\s*)(\/(?![*\/]))/g, ["sh_number", "sh_normal", "sh_symbol"], -1],
        [/([A-Za-z$_][A-Za-z0-9$_]*\s*)(\/=?(?![*\/]))/g, ["sh_normal", "sh_symbol"], -1],
        [/\/(?:\\.|[^*\\\/])(?:\\.|[^\\\/])*\/[gim]*/g, "sh_regexp", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 10],
        [/'/g, "sh_string", 11],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/\b(?:Math|Infinity|NaN|undefined|arguments)\b/g, "sh_predef_var", -1],
        [/\b(?:Array|Boolean|Date|Error|EvalError|Function|Number|Object|RangeError|ReferenceError|RegExp|String|SyntaxError|TypeError|URIError|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|isNaN|parseFloat|parseInt)\b/g, "sh_predef_func", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 5]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/"/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/'/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.javascript_dom = [
    [
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9],
        [/\b(?:abstract|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|final|finally|for|function|goto|if|implements|in|instanceof|interface|native|new|null|private|protected|prototype|public|return|static|super|switch|synchronized|throw|throws|this|transient|true|try|typeof|var|volatile|while|with)\b/g, "sh_keyword", -1],
        [/(\+\+|--|\)|\])(\s*)(\/=?(?![*\/]))/g, ["sh_symbol", "sh_normal", "sh_symbol"], -1],
        [/(0x[A-Fa-f0-9]+|(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?)(\s*)(\/(?![*\/]))/g, ["sh_number", "sh_normal", "sh_symbol"], -1],
        [/([A-Za-z$_][A-Za-z0-9$_]*\s*)(\/=?(?![*\/]))/g, ["sh_normal", "sh_symbol"], -1],
        [/\/(?:\\.|[^*\\\/])(?:\\.|[^\\\/])*\/[gim]*/g, "sh_regexp", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 10],
        [/'/g, "sh_string", 11],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/\b(?:Math|Infinity|NaN|undefined|arguments)\b/g, "sh_predef_var", -1],
        [/\b(?:Array|Boolean|Date|Error|EvalError|Function|Number|Object|RangeError|ReferenceError|RegExp|String|SyntaxError|TypeError|URIError|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|isNaN|parseFloat|parseInt)\b/g, "sh_predef_func", -1],
        [/\b(?:applicationCache|closed|Components|content|controllers|crypto|defaultStatus|dialogArguments|directories|document|frameElement|frames|fullScreen|globalStorage|history|innerHeight|innerWidth|length|location|locationbar|menubar|name|navigator|opener|outerHeight|outerWidth|pageXOffset|pageYOffset|parent|personalbar|pkcs11|returnValue|screen|availTop|availLeft|availHeight|availWidth|colorDepth|height|left|pixelDepth|top|width|screenX|screenY|scrollbars|scrollMaxX|scrollMaxY|scrollX|scrollY|self|sessionStorage|sidebar|status|statusbar|toolbar|top|window)\b/g, "sh_predef_var", -1],
        [/\b(?:alert|addEventListener|atob|back|blur|btoa|captureEvents|clearInterval|clearTimeout|close|confirm|dump|escape|find|focus|forward|getAttention|getComputedStyle|getSelection|home|moveBy|moveTo|open|openDialog|postMessage|print|prompt|releaseEvents|removeEventListener|resizeBy|resizeTo|scroll|scrollBy|scrollByLines|scrollByPages|scrollTo|setInterval|setTimeout|showModalDialog|sizeToContent|stop|unescape|updateCommands|onabort|onbeforeunload|onblur|onchange|onclick|onclose|oncontextmenu|ondragdrop|onerror|onfocus|onkeydown|onkeypress|onkeyup|onload|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onpaint|onreset|onresize|onscroll|onselect|onsubmit|onunload)\b/g, "sh_predef_func", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 5]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/"/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/'/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.perl = [
    [
        [/\b(?:import)\b/g, "sh_preproc", -1],
        [/(s)(\{(?:\\\}|[^}])*\}\{(?:\\\}|[^}])*\})([ixsmogce]*)/g, ["sh_keyword", "sh_regexp", "sh_keyword"], -1],
        [/(s)(\((?:\\\)|[^)])*\)\((?:\\\)|[^)])*\))([ixsmogce]*)/g, ["sh_keyword", "sh_regexp", "sh_keyword"], -1],
        [/(s)(\[(?:\\\]|[^\]])*\]\[(?:\\\]|[^\]])*\])([ixsmogce]*)/g, ["sh_keyword", "sh_regexp", "sh_keyword"], -1],
        [/(s)(<.*><.*>)([ixsmogce]*)/g, ["sh_keyword", "sh_regexp", "sh_keyword"], -1],
        [/(q(?:q?))(\{(?:\\\}|[^}])*\})/g, ["sh_keyword", "sh_string"], -1],
        [/(q(?:q?))(\((?:\\\)|[^)])*\))/g, ["sh_keyword", "sh_string"], -1],
        [/(q(?:q?))(\[(?:\\\]|[^\]])*\])/g, ["sh_keyword", "sh_string"], -1],
        [/(q(?:q?))(<.*>)/g, ["sh_keyword", "sh_string"], -1],
        [/(q(?:q?))([^A-Za-z0-9 \t])(.*\2)/g, ["sh_keyword", "sh_string", "sh_string"], -1],
        [/(s)([^A-Za-z0-9 \t])(.*\2.*\2)([ixsmogce]*(?=[ \t]*(?:\)|;)))/g, ["sh_keyword", "sh_regexp", "sh_regexp", "sh_keyword"], -1],
        [/(s)([^A-Za-z0-9 \t])(.*\2[ \t]*)([^A-Za-z0-9 \t])(.*\4)([ixsmogce]*(?=[ \t]*(?:\)|;)))/g, ["sh_keyword", "sh_regexp", "sh_regexp", "sh_regexp", "sh_regexp", "sh_keyword"], -1],
        [/#/g, "sh_comment", 1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/(?:m|qr)(?=\{)/g, "sh_keyword", 2],
        [/(?:m|qr)(?=#)/g, "sh_keyword", 4],
        [/(?:m|qr)(?=\|)/g, "sh_keyword", 6],
        [/(?:m|qr)(?=@)/g, "sh_keyword", 8],
        [/(?:m|qr)(?=<)/g, "sh_keyword", 10],
        [/(?:m|qr)(?=\[)/g, "sh_keyword", 12],
        [/(?:m|qr)(?=\\)/g, "sh_keyword", 14],
        [/(?:m|qr)(?=\/)/g, "sh_keyword", 16],
        [/"/g, "sh_string", 18],
        [/'/g, "sh_string", 19],
        [/</g, "sh_string", 20],
        [/\/[^\n]*\//g, "sh_string", -1],
        [/\b(?:chomp|chop|chr|crypt|hex|i|index|lc|lcfirst|length|oct|ord|pack|q|qq|reverse|rindex|sprintf|substr|tr|uc|ucfirst|m|s|g|qw|abs|atan2|cos|exp|hex|int|log|oct|rand|sin|sqrt|srand|my|local|our|delete|each|exists|keys|values|pack|read|syscall|sysread|syswrite|unpack|vec|undef|unless|return|length|grep|sort|caller|continue|dump|eval|exit|goto|last|next|redo|sub|wantarray|pop|push|shift|splice|unshift|split|switch|join|defined|foreach|last|chop|chomp|bless|dbmclose|dbmopen|ref|tie|tied|untie|while|next|map|eq|die|cmp|lc|uc|and|do|if|else|elsif|for|use|require|package|import|chdir|chmod|chown|chroot|fcntl|glob|ioctl|link|lstat|mkdir|open|opendir|readlink|rename|rmdir|stat|symlink|umask|unlink|utime|binmode|close|closedir|dbmclose|dbmopen|die|eof|fileno|flock|format|getc|print|printf|read|readdir|rewinddir|seek|seekdir|select|syscall|sysread|sysseek|syswrite|tell|telldir|truncate|warn|write|alarm|exec|fork|getpgrp|getppid|getpriority|kill|pipe|qx|setpgrp|setpriority|sleep|system|times|x|wait|waitpid)\b/g, "sh_keyword", -1],
        [/^\=(?:head1|head2|item)/g, "sh_comment", 21],
        [/(?:\$[#]?|@|%)[\/A-Za-z0-9_]+/g, "sh_variable", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\{/g, "sh_regexp", 3]
    ],
    [
        [/[ \t]+#.*/g, "sh_comment", -1],
        [/\$(?:[A-Za-z0-9_]+|\{[A-Za-z0-9_]+\})/g, "sh_variable", -1],
        [/\\\{|\\\}|\}/g, "sh_regexp", -3]
    ],
    [
        [/#/g, "sh_regexp", 5]
    ],
    [
        [/[ \t]+#.*/g, "sh_comment", -1],
        [/\$(?:[A-Za-z0-9_]+|\{[A-Za-z0-9_]+\})/g, "sh_variable", -1],
        [/\\#|#/g, "sh_regexp", -3]
    ],
    [
        [/\|/g, "sh_regexp", 7]
    ],
    [
        [/[ \t]+#.*/g, "sh_comment", -1],
        [/\$(?:[A-Za-z0-9_]+|\{[A-Za-z0-9_]+\})/g, "sh_variable", -1],
        [/\\\||\|/g, "sh_regexp", -3]
    ],
    [
        [/@/g, "sh_regexp", 9]
    ],
    [
        [/[ \t]+#.*/g, "sh_comment", -1],
        [/\$(?:[A-Za-z0-9_]+|\{[A-Za-z0-9_]+\})/g, "sh_variable", -1],
        [/\\@|@/g, "sh_regexp", -3]
    ],
    [
        [/</g, "sh_regexp", 11]
    ],
    [
        [/[ \t]+#.*/g, "sh_comment", -1],
        [/\$(?:[A-Za-z0-9_]+|\{[A-Za-z0-9_]+\})/g, "sh_variable", -1],
        [/\\<|\\>|>/g, "sh_regexp", -3]
    ],
    [
        [/\[/g, "sh_regexp", 13]
    ],
    [
        [/[ \t]+#.*/g, "sh_comment", -1],
        [/\$(?:[A-Za-z0-9_]+|\{[A-Za-z0-9_]+\})/g, "sh_variable", -1],
        [/\\]|\]/g, "sh_regexp", -3]
    ],
    [
        [/\\/g, "sh_regexp", 15]
    ],
    [
        [/[ \t]+#.*/g, "sh_comment", -1],
        [/\$(?:[A-Za-z0-9_]+|\{[A-Za-z0-9_]+\})/g, "sh_variable", -1],
        [/\\\\|\\/g, "sh_regexp", -3]
    ],
    [
        [/\//g, "sh_regexp", 17]
    ],
    [
        [/[ \t]+#.*/g, "sh_comment", -1],
        [/\$(?:[A-Za-z0-9_]+|\{[A-Za-z0-9_]+\})/g, "sh_variable", -1],
        [/\\\/|\//g, "sh_regexp", -3]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|')/g, null, -1],
        [/'/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/>/g, "sh_string", -2]
    ],
    [
        [/\=cut/g, "sh_comment", -2]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.php = [
    [
        [/\b(?:include|include_once|require|require_once)\b/g, "sh_preproc", -1],
        [/\/\//g, "sh_comment", 1],
        [/#/g, "sh_comment", 1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 2],
        [/'/g, "sh_string", 3],
        [/\b(?:and|or|xor|__FILE__|exception|php_user_filter|__LINE__|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|each|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|for|foreach|function|global|if|isset|list|new|old_function|print|return|static|switch|unset|use|var|while|__FUNCTION__|__CLASS__|__METHOD__)\b/g, "sh_keyword", -1],
        [/\/\/\//g, "sh_comment", 4],
        [/\/\//g, "sh_comment", 1],
        [/\/\*\*/g, "sh_comment", 9],
        [/\/\*/g, "sh_comment", 10],
        [/(?:\$[#]?|@|%)[A-Za-z0-9_]+/g, "sh_variable", -1],
        [/<\?php|~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/\\(?:\\|')/g, null, -1],
        [/'/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 5, 1],
        [/<!DOCTYPE/g, "sh_preproc", 6, 1],
        [/<!--/g, "sh_comment", 7],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 8, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 8, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 7]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 5, 1],
        [/<!DOCTYPE/g, "sh_preproc", 6, 1],
        [/<!--/g, "sh_comment", 7],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 8, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 8, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.python = [
    [
        [/\b(?:import|from)\b/g, "sh_preproc", -1],
        [/#/g, "sh_comment", 1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/\b(?:and|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|global|if|in|is|lambda|not|or|pass|print|raise|return|try|while)\b/g, "sh_keyword", -1],
        [/^(?:[\s]*'{3})/g, "sh_comment", 2],
        [/^(?:[\s]*\"{3})/g, "sh_comment", 3],
        [/^(?:[\s]*'(?:[^\\']|\\.)*'[\s]*|[\s]*\"(?:[^\\\"]|\\.)*\"[\s]*)$/g, "sh_comment", -1],
        [/(?:[\s]*'{3})/g, "sh_string", 4],
        [/(?:[\s]*\"{3})/g, "sh_string", 5],
        [/"/g, "sh_string", 6],
        [/'/g, "sh_string", 7],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\||\{|\}/g, "sh_symbol", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/(?:'{3})/g, "sh_comment", -2]
    ],
    [
        [/(?:\"{3})/g, "sh_comment", -2]
    ],
    [
        [/(?:'{3})/g, "sh_string", -2]
    ],
    [
        [/(?:\"{3})/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|')/g, null, -1],
        [/'/g, "sh_string", -2]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.ruby = [
    [
        [/\b(?:require)\b/g, "sh_preproc", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 1],
        [/'/g, "sh_string", 2],
        [/</g, "sh_string", 3],
        [/\/[^\n]*\//g, "sh_regexp", -1],
        [/(%r)(\{(?:\\\}|#\{[A-Za-z0-9]+\}|[^}])*\})/g, ["sh_symbol", "sh_regexp"], -1],
        [/\b(?:alias|begin|BEGIN|break|case|defined|do|else|elsif|end|END|ensure|for|if|in|include|loop|next|raise|redo|rescue|retry|return|super|then|undef|unless|until|when|while|yield|false|nil|self|true|__FILE__|__LINE__|and|not|or|def|class|module|catch|fail|load|throw)\b/g, "sh_keyword", -1],
        [/(?:^\=begin)/g, "sh_comment", 4],
        [/(?:\$[#]?|@@|@)(?:[A-Za-z0-9_]+|'|\"|\/)/g, "sh_type", -1],
        [/[A-Za-z0-9]+(?:\?|!)/g, "sh_normal", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/(#)(\{)/g, ["sh_symbol", "sh_cbracket"], -1],
        [/#/g, "sh_comment", 5],
        [/\{|\}/g, "sh_cbracket", -1]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|')/g, null, -1],
        [/'/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/>/g, "sh_string", -2]
    ],
    [
        [/^(?:\=end)/g, "sh_comment", -2]
    ],
    [
        [/$/g, null, -2]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.sql = [
    [
        [/\b(?:VARCHAR|TINYINT|TEXT|DATE|SMALLINT|MEDIUMINT|INT|BIGINT|FLOAT|DOUBLE|DECIMAL|DATETIME|TIMESTAMP|TIME|YEAR|UNSIGNED|CHAR|TINYBLOB|TINYTEXT|BLOB|MEDIUMBLOB|MEDIUMTEXT|LONGBLOB|LONGTEXT|ENUM|BOOL|BINARY|VARBINARY)\b/gi, "sh_type", -1],
        [/\b(?:ALL|ASC|AS|ALTER|AND|ADD|AUTO_INCREMENT|BETWEEN|BINARY|BOTH|BY|BOOLEAN|CHANGE|CHECK|COLUMNS|COLUMN|CROSS|CREATE|DATABASES|DATABASE|DATA|DELAYED|DESCRIBE|DESC|DISTINCT|DELETE|DROP|DEFAULT|ENCLOSED|ESCAPED|EXISTS|EXPLAIN|FIELDS|FIELD|FLUSH|FOR|FOREIGN|FUNCTION|FROM|GROUP|GRANT|HAVING|IGNORE|INDEX|INFILE|INSERT|INNER|INTO|IDENTIFIED|IN|IS|IF|JOIN|KEYS|KILL|KEY|LEADING|LIKE|LIMIT|LINES|LOAD|LOCAL|LOCK|LOW_PRIORITY|LEFT|LANGUAGE|MODIFY|NATURAL|NOT|NULL|NEXTVAL|OPTIMIZE|OPTION|OPTIONALLY|ORDER|OUTFILE|OR|OUTER|ON|PROCEDURE|PROCEDURAL|PRIMARY|READ|REFERENCES|REGEXP|RENAME|REPLACE|RETURN|REVOKE|RLIKE|RIGHT|SHOW|SONAME|STATUS|STRAIGHT_JOIN|SELECT|SETVAL|SET|TABLES|TERMINATED|TO|TRAILING|TRUNCATE|TABLE|TEMPORARY|TRIGGER|TRUSTED|UNIQUE|UNLOCK|USE|USING|UPDATE|VALUES|VARIABLES|VIEW|WITH|WRITE|WHERE|ZEROFILL|TYPE|XOR)\b/gi, "sh_keyword", -1],
        [/"/g, "sh_string", 1],
        [/'/g, "sh_string", 2],
        [/`/g, "sh_string", 3],
        [/#/g, "sh_comment", 4],
        [/\/\/\//g, "sh_comment", 5],
        [/\/\//g, "sh_comment", 4],
        [/\/\*\*/g, "sh_comment", 11],
        [/\/\*/g, "sh_comment", 12],
        [/--/g, "sh_comment", 4],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1]
    ],
    [
        [/"/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/'/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/`/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 6, 1],
        [/<!DOCTYPE/g, "sh_preproc", 8, 1],
        [/<!--/g, "sh_comment", 9],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 10, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 10, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 7]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 7]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 9]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 7]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 6, 1],
        [/<!DOCTYPE/g, "sh_preproc", 8, 1],
        [/<!--/g, "sh_comment", 9],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 10, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 10, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.url = [
    [{
        regex: /(?:<?)[A-Za-z0-9_\.\/\-_]+@[A-Za-z0-9_\.\/\-_]+(?:>?)/g,
        style: "sh_url"
    }, {
        regex: /(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_]+(?:>?)/g,
        style: "sh_url"
    }]
], this.sh_languages || (this.sh_languages = {}), sh_languages.xml = [
    [
        [/<\?xml/g, "sh_preproc", 1, 1],
        [/<!DOCTYPE/g, "sh_preproc", 3, 1],
        [/<!--/g, "sh_comment", 4],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 5, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 4]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ]
], ! function(e, t) {
    function n(e, t) {
        var n = e.createElement("p"),
            s = e.getElementsByTagName("head")[0] || e.documentElement;
        return n.innerHTML = "x<style>" + t + "</style>", s.insertBefore(n.lastChild, s.firstChild)
    }

    function s() {
        var e = v.elements;
        return "string" == typeof e ? e.split(" ") : e
    }

    function r(e, t) {
        var n = v.elements;
        "string" != typeof n && (n = n.join(" ")), "string" != typeof e && (e = e.join(" ")), v.elements = n + " " + e, c(t)
    }

    function o(e) {
        var t = y[e[m]];
        return t || (t = {}, _++, e[m] = _, y[_] = t), t
    }

    function i(e, n, s) {
        if (n || (n = t), u) return n.createElement(e);
        s || (s = o(n));
        var r;
        return r = s.cache[e] ? s.cache[e].cloneNode() : g.test(e) ? (s.cache[e] = s.createElem(e)).cloneNode() : s.createElem(e), !r.canHaveChildren || f.test(e) || r.tagUrn ? r : s.frag.appendChild(r)
    }

    function a(e, n) {
        if (e || (e = t), u) return e.createDocumentFragment();
        n = n || o(e);
        for (var r = n.frag.cloneNode(), i = 0, a = s(), l = a.length; l > i; i++) r.createElement(a[i]);
        return r
    }

    function l(e, t) {
        t.cache || (t.cache = {}, t.createElem = e.createElement, t.createFrag = e.createDocumentFragment, t.frag = t.createFrag()), e.createElement = function(n) {
            return v.shivMethods ? i(n, e, t) : t.createElem(n)
        }, e.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + s().join().replace(/[\w\-:]+/g, function(e) {
            return t.createElem(e), t.frag.createElement(e), 'c("' + e + '")'
        }) + ");return n}")(v, t.frag)
    }

    function c(e) {
        e || (e = t);
        var s = o(e);
        return !v.shivCSS || h || s.hasCSS || (s.hasCSS = !!n(e, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), u || l(e, s), e
    }
    var h, u, p = "3.7.2",
        d = e.html5 || {},
        f = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
        g = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
        m = "_html5shiv",
        _ = 0,
        y = {};
    ! function() {
        try {
            var e = t.createElement("a");
            e.innerHTML = "<xyz></xyz>", h = "hidden" in e, u = 1 == e.childNodes.length || function() {
                t.createElement("a");
                var e = t.createDocumentFragment();
                return "undefined" == typeof e.cloneNode || "undefined" == typeof e.createDocumentFragment || "undefined" == typeof e.createElement
            }()
        } catch (n) {
            h = !0, u = !0
        }
    }();
    var v = {
        elements: d.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video",
        version: p,
        shivCSS: d.shivCSS !== !1,
        supportsUnknownElements: u,
        shivMethods: d.shivMethods !== !1,
        type: "default",
        shivDocument: c,
        createElement: i,
        createDocumentFragment: a,
        addElements: r
    };
    e.html5 = v, c(t)
}(this, document), ! function(e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function(e, t) {
    function n(e) {
        var t = e.length,
            n = ot.type(e);
        return "function" === n || ot.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
    }

    function s(e, t, n) {
        if (ot.isFunction(t)) return ot.grep(e, function(e, s) {
            return !!t.call(e, s, e) !== n
        });
        if (t.nodeType) return ot.grep(e, function(e) {
            return e === t !== n
        });
        if ("string" == typeof t) {
            if (dt.test(t)) return ot.filter(t, e, n);
            t = ot.filter(t, e)
        }
        return ot.grep(e, function(e) {
            return ot.inArray(e, t) >= 0 !== n
        })
    }

    function r(e, t) {
        do e = e[t]; while (e && 1 !== e.nodeType);
        return e
    }

    function o(e) {
        var t = xt[e] = {};
        return ot.each(e.match(bt) || [], function(e, n) {
            t[n] = !0
        }), t
    }

    function i() {
        gt.addEventListener ? (gt.removeEventListener("DOMContentLoaded", a, !1), e.removeEventListener("load", a, !1)) : (gt.detachEvent("onreadystatechange", a), e.detachEvent("onload", a))
    }

    function a() {
        (gt.addEventListener || "load" === event.type || "complete" === gt.readyState) && (i(), ot.ready())
    }

    function l(e, t, n) {
        if (void 0 === n && 1 === e.nodeType) {
            var s = "data-" + t.replace(Tt, "-$1").toLowerCase();
            if (n = e.getAttribute(s), "string" == typeof n) {
                try {
                    n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : Ct.test(n) ? ot.parseJSON(n) : n
                } catch (r) {}
                ot.data(e, t, n)
            } else n = void 0
        }
        return n
    }

    function c(e) {
        var t;
        for (t in e)
            if (("data" !== t || !ot.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
        return !0
    }

    function h(e, t, n, s) {
        if (ot.acceptData(e)) {
            var r, o, i = ot.expando,
                a = e.nodeType,
                l = a ? ot.cache : e,
                c = a ? e[i] : e[i] && i;
            if (c && l[c] && (s || l[c].data) || void 0 !== n || "string" != typeof t) return c || (c = a ? e[i] = Y.pop() || ot.guid++ : i), l[c] || (l[c] = a ? {} : {
                toJSON: ot.noop
            }), ("object" == typeof t || "function" == typeof t) && (s ? l[c] = ot.extend(l[c], t) : l[c].data = ot.extend(l[c].data, t)), o = l[c], s || (o.data || (o.data = {}), o = o.data), void 0 !== n && (o[ot.camelCase(t)] = n), "string" == typeof t ? (r = o[t], null == r && (r = o[ot.camelCase(t)])) : r = o, r
        }
    }

    function u(e, t, n) {
        if (ot.acceptData(e)) {
            var s, r, o = e.nodeType,
                i = o ? ot.cache : e,
                a = o ? e[ot.expando] : ot.expando;
            if (i[a]) {
                if (t && (s = n ? i[a] : i[a].data)) {
                    ot.isArray(t) ? t = t.concat(ot.map(t, ot.camelCase)) : t in s ? t = [t] : (t = ot.camelCase(t), t = t in s ? [t] : t.split(" ")), r = t.length;
                    for (; r--;) delete s[t[r]];
                    if (n ? !c(s) : !ot.isEmptyObject(s)) return
                }(n || (delete i[a].data, c(i[a]))) && (o ? ot.cleanData([e], !0) : st.deleteExpando || i != i.window ? delete i[a] : i[a] = null)
            }
        }
    }

    function p() {
        return !0
    }

    function d() {
        return !1
    }

    function f() {
        try {
            return gt.activeElement
        } catch (e) {}
    }

    function g(e) {
        var t = Ft.split("|"),
            n = e.createDocumentFragment();
        if (n.createElement)
            for (; t.length;) n.createElement(t.pop());
        return n
    }

    function m(e, t) {
        var n, s, r = 0,
            o = typeof e.getElementsByTagName !== At ? e.getElementsByTagName(t || "*") : typeof e.querySelectorAll !== At ? e.querySelectorAll(t || "*") : void 0;
        if (!o)
            for (o = [], n = e.childNodes || e; null != (s = n[r]); r++) !t || ot.nodeName(s, t) ? o.push(s) : ot.merge(o, m(s, t));
        return void 0 === t || t && ot.nodeName(e, t) ? ot.merge([e], o) : o
    }

    function _(e) {
        $t.test(e.type) && (e.defaultChecked = e.checked)
    }

    function y(e, t) {
        return ot.nodeName(e, "table") && ot.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }

    function v(e) {
        return e.type = (null !== ot.find.attr(e, "type")) + "/" + e.type, e
    }

    function b(e) {
        var t = Xt.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function x(e, t) {
        for (var n, s = 0; null != (n = e[s]); s++) ot._data(n, "globalEval", !t || ot._data(t[s], "globalEval"))
    }

    function w(e, t) {
        if (1 === t.nodeType && ot.hasData(e)) {
            var n, s, r, o = ot._data(e),
                i = ot._data(t, o),
                a = o.events;
            if (a) {
                delete i.handle, i.events = {};
                for (n in a)
                    for (s = 0, r = a[n].length; r > s; s++) ot.event.add(t, n, a[n][s])
            }
            i.data && (i.data = ot.extend({}, i.data))
        }
    }

    function A(e, t) {
        var n, s, r;
        if (1 === t.nodeType) {
            if (n = t.nodeName.toLowerCase(), !st.noCloneEvent && t[ot.expando]) {
                r = ot._data(t);
                for (s in r.events) ot.removeEvent(t, s, r.handle);
                t.removeAttribute(ot.expando)
            }
            "script" === n && t.text !== e.text ? (v(t).text = e.text, b(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), st.html5Clone && e.innerHTML && !ot.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && $t.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
        }
    }

    function E(t, n) {
        var s, r = ot(n.createElement(t)).appendTo(n.body),
            o = e.getDefaultComputedStyle && (s = e.getDefaultComputedStyle(r[0])) ? s.display : ot.css(r[0], "display");
        return r.detach(), o
    }

    function C(e) {
        var t = gt,
            n = Jt[e];
        return n || (n = E(e, t), "none" !== n && n || (Kt = (Kt || ot("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement), t = (Kt[0].contentWindow || Kt[0].contentDocument).document, t.write(), t.close(), n = E(e, t), Kt.detach()), Jt[e] = n), n
    }

    function T(e, t) {
        return {
            get: function() {
                var n = e();
                return null != n ? n ? void delete this.get : (this.get = t).apply(this, arguments) : void 0
            }
        }
    }

    function k(e, t) {
        if (t in e) return t;
        for (var n = t.charAt(0).toUpperCase() + t.slice(1), s = t, r = dn.length; r--;)
            if (t = dn[r] + n, t in e) return t;
        return s
    }

    function z(e, t) {
        for (var n, s, r, o = [], i = 0, a = e.length; a > i; i++) s = e[i], s.style && (o[i] = ot._data(s, "olddisplay"), n = s.style.display, t ? (o[i] || "none" !== n || (s.style.display = ""), "" === s.style.display && Zt(s) && (o[i] = ot._data(s, "olddisplay", C(s.nodeName)))) : (r = Zt(s), (n && "none" !== n || !r) && ot._data(s, "olddisplay", r ? n : ot.css(s, "display"))));
        for (i = 0; a > i; i++) s = e[i], s.style && (t && "none" !== s.style.display && "" !== s.style.display || (s.style.display = t ? o[i] || "" : "none"));
        return e
    }

    function Z(e, t, n) {
        var s = cn.exec(t);
        return s ? Math.max(0, s[1] - (n || 0)) + (s[2] || "px") : t
    }

    function N(e, t, n, s, r) {
        for (var o = n === (s ? "border" : "content") ? 4 : "width" === t ? 1 : 0, i = 0; 4 > o; o += 2) "margin" === n && (i += ot.css(e, n + zt[o], !0, r)), s ? ("content" === n && (i -= ot.css(e, "padding" + zt[o], !0, r)), "margin" !== n && (i -= ot.css(e, "border" + zt[o] + "Width", !0, r))) : (i += ot.css(e, "padding" + zt[o], !0, r), "padding" !== n && (i += ot.css(e, "border" + zt[o] + "Width", !0, r)));
        return i
    }

    function D(e, t, n) {
        var s = !0,
            r = "width" === t ? e.offsetWidth : e.offsetHeight,
            o = nn(e),
            i = st.boxSizing && "border-box" === ot.css(e, "boxSizing", !1, o);
        if (0 >= r || null == r) {
            if (r = sn(e, t, o), (0 > r || null == r) && (r = e.style[t]), tn.test(r)) return r;
            s = i && (st.boxSizingReliable() || r === e.style[t]), r = parseFloat(r) || 0
        }
        return r + N(e, t, n || (i ? "border" : "content"), s, o) + "px"
    }

    function S(e, t, n, s, r) {
        return new S.prototype.init(e, t, n, s, r)
    }

    function L() {
        return setTimeout(function() {
            fn = void 0
        }), fn = ot.now()
    }

    function O(e, t) {
        var n, s = {
                height: e
            },
            r = 0;
        for (t = t ? 1 : 0; 4 > r; r += 2 - t) n = zt[r], s["margin" + n] = s["padding" + n] = e;
        return t && (s.opacity = s.width = e), s
    }

    function F(e, t, n) {
        for (var s, r = (bn[t] || []).concat(bn["*"]), o = 0, i = r.length; i > o; o++)
            if (s = r[o].call(n, t, e)) return s
    }

    function I(e, t, n) {
        var s, r, o, i, a, l, c, h, u = this,
            p = {},
            d = e.style,
            f = e.nodeType && Zt(e),
            g = ot._data(e, "fxshow");
        n.queue || (a = ot._queueHooks(e, "fx"), null == a.unqueued && (a.unqueued = 0, l = a.empty.fire, a.empty.fire = function() {
            a.unqueued || l()
        }), a.unqueued++, u.always(function() {
            u.always(function() {
                a.unqueued--, ot.queue(e, "fx").length || a.empty.fire()
            })
        })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [d.overflow, d.overflowX, d.overflowY], c = ot.css(e, "display"), h = "none" === c ? ot._data(e, "olddisplay") || C(e.nodeName) : c, "inline" === h && "none" === ot.css(e, "float") && (st.inlineBlockNeedsLayout && "inline" !== C(e.nodeName) ? d.zoom = 1 : d.display = "inline-block")), n.overflow && (d.overflow = "hidden", st.shrinkWrapBlocks() || u.always(function() {
            d.overflow = n.overflow[0], d.overflowX = n.overflow[1], d.overflowY = n.overflow[2]
        }));
        for (s in t)
            if (r = t[s], mn.exec(r)) {
                if (delete t[s], o = o || "toggle" === r, r === (f ? "hide" : "show")) {
                    if ("show" !== r || !g || void 0 === g[s]) continue;
                    f = !0
                }
                p[s] = g && g[s] || ot.style(e, s)
            } else c = void 0;
        if (ot.isEmptyObject(p)) "inline" === ("none" === c ? C(e.nodeName) : c) && (d.display = c);
        else {
            g ? "hidden" in g && (f = g.hidden) : g = ot._data(e, "fxshow", {}), o && (g.hidden = !f), f ? ot(e).show() : u.done(function() {
                ot(e).hide()
            }), u.done(function() {
                var t;
                ot._removeData(e, "fxshow");
                for (t in p) ot.style(e, t, p[t])
            });
            for (s in p) i = F(f ? g[s] : 0, s, u), s in g || (g[s] = i.start, f && (i.end = i.start, i.start = "width" === s || "height" === s ? 1 : 0))
        }
    }

    function j(e, t) {
        var n, s, r, o, i;
        for (n in e)
            if (s = ot.camelCase(n), r = t[s], o = e[n], ot.isArray(o) && (r = o[1], o = e[n] = o[0]), n !== s && (e[s] = o, delete e[n]), i = ot.cssHooks[s], i && "expand" in i) {
                o = i.expand(o), delete e[s];
                for (n in o) n in e || (e[n] = o[n], t[n] = r)
            } else t[s] = r
    }

    function M(e, t, n) {
        var s, r, o = 0,
            i = vn.length,
            a = ot.Deferred().always(function() {
                delete l.elem
            }),
            l = function() {
                if (r) return !1;
                for (var t = fn || L(), n = Math.max(0, c.startTime + c.duration - t), s = n / c.duration || 0, o = 1 - s, i = 0, l = c.tweens.length; l > i; i++) c.tweens[i].run(o);
                return a.notifyWith(e, [c, o, n]), 1 > o && l ? n : (a.resolveWith(e, [c]), !1)
            },
            c = a.promise({
                elem: e,
                props: ot.extend({}, t),
                opts: ot.extend(!0, {
                    specialEasing: {}
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: fn || L(),
                duration: n.duration,
                tweens: [],
                createTween: function(t, n) {
                    var s = ot.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
                    return c.tweens.push(s), s
                },
                stop: function(t) {
                    var n = 0,
                        s = t ? c.tweens.length : 0;
                    if (r) return this;
                    for (r = !0; s > n; n++) c.tweens[n].run(1);
                    return t ? a.resolveWith(e, [c, t]) : a.rejectWith(e, [c, t]), this
                }
            }),
            h = c.props;
        for (j(h, c.opts.specialEasing); i > o; o++)
            if (s = vn[o].call(c, e, h, c.opts)) return s;
        return ot.map(h, F, c), ot.isFunction(c.opts.start) && c.opts.start.call(e, c), ot.fx.timer(ot.extend(l, {
            elem: e,
            anim: c,
            queue: c.opts.queue
        })), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
    }

    function q(e) {
        return function(t, n) {
            "string" != typeof t && (n = t, t = "*");
            var s, r = 0,
                o = t.toLowerCase().match(bt) || [];
            if (ot.isFunction(n))
                for (; s = o[r++];) "+" === s.charAt(0) ? (s = s.slice(1) || "*", (e[s] = e[s] || []).unshift(n)) : (e[s] = e[s] || []).push(n)
        }
    }

    function H(e, t, n, s) {
        function r(a) {
            var l;
            return o[a] = !0, ot.each(e[a] || [], function(e, a) {
                var c = a(t, n, s);
                return "string" != typeof c || i || o[c] ? i ? !(l = c) : void 0 : (t.dataTypes.unshift(c), r(c), !1)
            }), l
        }
        var o = {},
            i = e === Pn;
        return r(t.dataTypes[0]) || !o["*"] && r("*")
    }

    function R(e, t) {
        var n, s, r = ot.ajaxSettings.flatOptions || {};
        for (s in t) void 0 !== t[s] && ((r[s] ? e : n || (n = {}))[s] = t[s]);
        return n && ot.extend(!0, e, n), e
    }

    function B(e, t, n) {
        for (var s, r, o, i, a = e.contents, l = e.dataTypes;
            "*" === l[0];) l.shift(), void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
        if (r)
            for (i in a)
                if (a[i] && a[i].test(r)) {
                    l.unshift(i);
                    break
                }
        if (l[0] in n) o = l[0];
        else {
            for (i in n) {
                if (!l[0] || e.converters[i + " " + l[0]]) {
                    o = i;
                    break
                }
                s || (s = i)
            }
            o = o || s
        }
        return o ? (o !== l[0] && l.unshift(o), n[o]) : void 0
    }

    function P(e, t, n, s) {
        var r, o, i, a, l, c = {},
            h = e.dataTypes.slice();
        if (h[1])
            for (i in e.converters) c[i.toLowerCase()] = e.converters[i];
        for (o = h.shift(); o;)
            if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && s && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = h.shift())
                if ("*" === o) o = l;
                else if ("*" !== l && l !== o) {
            if (i = c[l + " " + o] || c["* " + o], !i)
                for (r in c)
                    if (a = r.split(" "), a[1] === o && (i = c[l + " " + a[0]] || c["* " + a[0]])) {
                        i === !0 ? i = c[r] : c[r] !== !0 && (o = a[0], h.unshift(a[1]));
                        break
                    }
            if (i !== !0)
                if (i && e["throws"]) t = i(t);
                else try {
                    t = i(t)
                } catch (u) {
                    return {
                        state: "parsererror",
                        error: i ? u : "No conversion from " + l + " to " + o
                    }
                }
        }
        return {
            state: "success",
            data: t
        }
    }

    function U(e, t, n, s) {
        var r;
        if (ot.isArray(t)) ot.each(t, function(t, r) {
            n || Gn.test(e) ? s(e, r) : U(e + "[" + ("object" == typeof r ? t : "") + "]", r, n, s)
        });
        else if (n || "object" !== ot.type(t)) s(e, t);
        else
            for (r in t) U(e + "[" + r + "]", t[r], n, s)
    }

    function W() {
        try {
            return new e.XMLHttpRequest
        } catch (t) {}
    }

    function X() {
        try {
            return new e.ActiveXObject("Microsoft.XMLHTTP")
        } catch (t) {}
    }

    function G(e) {
        return ot.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1
    }
    var Y = [],
        Q = Y.slice,
        V = Y.concat,
        K = Y.push,
        J = Y.indexOf,
        et = {},
        tt = et.toString,
        nt = et.hasOwnProperty,
        st = {},
        rt = "1.11.1",
        ot = function(e, t) {
            return new ot.fn.init(e, t)
        },
        it = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        at = /^-ms-/,
        lt = /-([\da-z])/gi,
        ct = function(e, t) {
            return t.toUpperCase()
        };
    ot.fn = ot.prototype = {
        jquery: rt,
        constructor: ot,
        selector: "",
        length: 0,
        toArray: function() {
            return Q.call(this)
        },
        get: function(e) {
            return null != e ? 0 > e ? this[e + this.length] : this[e] : Q.call(this)
        },
        pushStack: function(e) {
            var t = ot.merge(this.constructor(), e);
            return t.prevObject = this, t.context = this.context, t
        },
        each: function(e, t) {
            return ot.each(this, e, t)
        },
        map: function(e) {
            return this.pushStack(ot.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function() {
            return this.pushStack(Q.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length,
                n = +e + (0 > e ? t : 0);
            return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: K,
        sort: Y.sort,
        splice: Y.splice
    }, ot.extend = ot.fn.extend = function() {
        var e, t, n, s, r, o, i = arguments[0] || {},
            a = 1,
            l = arguments.length,
            c = !1;
        for ("boolean" == typeof i && (c = i, i = arguments[a] || {}, a++), "object" == typeof i || ot.isFunction(i) || (i = {}), a === l && (i = this, a--); l > a; a++)
            if (null != (r = arguments[a]))
                for (s in r) e = i[s], n = r[s], i !== n && (c && n && (ot.isPlainObject(n) || (t = ot.isArray(n))) ? (t ? (t = !1, o = e && ot.isArray(e) ? e : []) : o = e && ot.isPlainObject(e) ? e : {}, i[s] = ot.extend(c, o, n)) : void 0 !== n && (i[s] = n));
        return i
    }, ot.extend({
        expando: "jQuery" + (rt + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isFunction: function(e) {
            return "function" === ot.type(e)
        },
        isArray: Array.isArray || function(e) {
            return "array" === ot.type(e)
        },
        isWindow: function(e) {
            return null != e && e == e.window
        },
        isNumeric: function(e) {
            return !ot.isArray(e) && e - parseFloat(e) >= 0
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        isPlainObject: function(e) {
            var t;
            if (!e || "object" !== ot.type(e) || e.nodeType || ot.isWindow(e)) return !1;
            try {
                if (e.constructor && !nt.call(e, "constructor") && !nt.call(e.constructor.prototype, "isPrototypeOf")) return !1
            } catch (n) {
                return !1
            }
            if (st.ownLast)
                for (t in e) return nt.call(e, t);
            for (t in e);
            return void 0 === t || nt.call(e, t)
        },
        type: function(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? et[tt.call(e)] || "object" : typeof e
        },
        globalEval: function(t) {
            t && ot.trim(t) && (e.execScript || function(t) {
                e.eval.call(e, t)
            })(t)
        },
        camelCase: function(e) {
            return e.replace(at, "ms-").replace(lt, ct)
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, t, s) {
            var r, o = 0,
                i = e.length,
                a = n(e);
            if (s) {
                if (a)
                    for (; i > o && (r = t.apply(e[o], s), r !== !1); o++);
                else
                    for (o in e)
                        if (r = t.apply(e[o], s), r === !1) break
            } else if (a)
                for (; i > o && (r = t.call(e[o], o, e[o]), r !== !1); o++);
            else
                for (o in e)
                    if (r = t.call(e[o], o, e[o]), r === !1) break; return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(it, "")
        },
        makeArray: function(e, t) {
            var s = t || [];
            return null != e && (n(Object(e)) ? ot.merge(s, "string" == typeof e ? [e] : e) : K.call(s, e)), s
        },
        inArray: function(e, t, n) {
            var s;
            if (t) {
                if (J) return J.call(t, e, n);
                for (s = t.length, n = n ? 0 > n ? Math.max(0, s + n) : n : 0; s > n; n++)
                    if (n in t && t[n] === e) return n
            }
            return -1
        },
        merge: function(e, t) {
            for (var n = +t.length, s = 0, r = e.length; n > s;) e[r++] = t[s++];
            if (n !== n)
                for (; void 0 !== t[s];) e[r++] = t[s++];
            return e.length = r, e
        },
        grep: function(e, t, n) {
            for (var s, r = [], o = 0, i = e.length, a = !n; i > o; o++) s = !t(e[o], o), s !== a && r.push(e[o]);
            return r
        },
        map: function(e, t, s) {
            var r, o = 0,
                i = e.length,
                a = n(e),
                l = [];
            if (a)
                for (; i > o; o++) r = t(e[o], o, s), null != r && l.push(r);
            else
                for (o in e) r = t(e[o], o, s), null != r && l.push(r);
            return V.apply([], l)
        },
        guid: 1,
        proxy: function(e, t) {
            var n, s, r;
            return "string" == typeof t && (r = e[t], t = e, e = r), ot.isFunction(e) ? (n = Q.call(arguments, 2), s = function() {
                return e.apply(t || this, n.concat(Q.call(arguments)))
            }, s.guid = e.guid = e.guid || ot.guid++, s) : void 0
        },
        now: function() {
            return +new Date
        },
        support: st
    }), ot.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
        et["[object " + t + "]"] = t.toLowerCase()
    });
    var ht = function(e) {
        function t(e, t, n, s) {
            var r, o, i, a, l, c, u, d, f, g;
            if ((t ? t.ownerDocument || t : H) !== S && D(t), t = t || S, n = n || [], !e || "string" != typeof e) return n;
            if (1 !== (a = t.nodeType) && 9 !== a) return [];
            if (O && !s) {
                if (r = yt.exec(e))
                    if (i = r[1]) {
                        if (9 === a) {
                            if (o = t.getElementById(i), !o || !o.parentNode) return n;
                            if (o.id === i) return n.push(o), n
                        } else if (t.ownerDocument && (o = t.ownerDocument.getElementById(i)) && M(t, o) && o.id === i) return n.push(o), n
                    } else {
                        if (r[2]) return et.apply(n, t.getElementsByTagName(e)), n;
                        if ((i = r[3]) && x.getElementsByClassName && t.getElementsByClassName) return et.apply(n, t.getElementsByClassName(i)), n
                    }
                if (x.qsa && (!F || !F.test(e))) {
                    if (d = u = q, f = t, g = 9 === a && e, 1 === a && "object" !== t.nodeName.toLowerCase()) {
                        for (c = C(e), (u = t.getAttribute("id")) ? d = u.replace(bt, "\\$&") : t.setAttribute("id", d), d = "[id='" + d + "'] ", l = c.length; l--;) c[l] = d + p(c[l]);
                        f = vt.test(e) && h(t.parentNode) || t, g = c.join(",")
                    }
                    if (g) try {
                        return et.apply(n, f.querySelectorAll(g)), n
                    } catch (m) {} finally {
                        u || t.removeAttribute("id")
                    }
                }
            }
            return k(e.replace(ct, "$1"), t, n, s)
        }

        function n() {
            function e(n, s) {
                return t.push(n + " ") > w.cacheLength && delete e[t.shift()], e[n + " "] = s
            }
            var t = [];
            return e
        }

        function s(e) {
            return e[q] = !0, e
        }

        function r(e) {
            var t = S.createElement("div");
            try {
                return !!e(t)
            } catch (n) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function o(e, t) {
            for (var n = e.split("|"), s = e.length; s--;) w.attrHandle[n[s]] = t
        }

        function i(e, t) {
            var n = t && e,
                s = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || Y) - (~e.sourceIndex || Y);
            if (s) return s;
            if (n)
                for (; n = n.nextSibling;)
                    if (n === t) return -1;
            return e ? 1 : -1
        }

        function a(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return "input" === n && t.type === e
            }
        }

        function l(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }

        function c(e) {
            return s(function(t) {
                return t = +t, s(function(n, s) {
                    for (var r, o = e([], n.length, t), i = o.length; i--;) n[r = o[i]] && (n[r] = !(s[r] = n[r]))
                })
            })
        }

        function h(e) {
            return e && typeof e.getElementsByTagName !== G && e
        }

        function u() {}

        function p(e) {
            for (var t = 0, n = e.length, s = ""; n > t; t++) s += e[t].value;
            return s
        }

        function d(e, t, n) {
            var s = t.dir,
                r = n && "parentNode" === s,
                o = B++;
            return t.first ? function(t, n, o) {
                for (; t = t[s];)
                    if (1 === t.nodeType || r) return e(t, n, o)
            } : function(t, n, i) {
                var a, l, c = [R, o];
                if (i) {
                    for (; t = t[s];)
                        if ((1 === t.nodeType || r) && e(t, n, i)) return !0
                } else
                    for (; t = t[s];)
                        if (1 === t.nodeType || r) {
                            if (l = t[q] || (t[q] = {}), (a = l[s]) && a[0] === R && a[1] === o) return c[2] = a[2];
                            if (l[s] = c, c[2] = e(t, n, i)) return !0
                        }
            }
        }

        function f(e) {
            return e.length > 1 ? function(t, n, s) {
                for (var r = e.length; r--;)
                    if (!e[r](t, n, s)) return !1;
                return !0
            } : e[0]
        }

        function g(e, n, s) {
            for (var r = 0, o = n.length; o > r; r++) t(e, n[r], s);
            return s
        }

        function m(e, t, n, s, r) {
            for (var o, i = [], a = 0, l = e.length, c = null != t; l > a; a++)(o = e[a]) && (!n || n(o, s, r)) && (i.push(o), c && t.push(a));
            return i
        }

        function _(e, t, n, r, o, i) {
            return r && !r[q] && (r = _(r)), o && !o[q] && (o = _(o, i)), s(function(s, i, a, l) {
                var c, h, u, p = [],
                    d = [],
                    f = i.length,
                    _ = s || g(t || "*", a.nodeType ? [a] : a, []),
                    y = !e || !s && t ? _ : m(_, p, e, a, l),
                    v = n ? o || (s ? e : f || r) ? [] : i : y;
                if (n && n(y, v, a, l), r)
                    for (c = m(v, d), r(c, [], a, l), h = c.length; h--;)(u = c[h]) && (v[d[h]] = !(y[d[h]] = u));
                if (s) {
                    if (o || e) {
                        if (o) {
                            for (c = [], h = v.length; h--;)(u = v[h]) && c.push(y[h] = u);
                            o(null, v = [], c, l)
                        }
                        for (h = v.length; h--;)(u = v[h]) && (c = o ? nt.call(s, u) : p[h]) > -1 && (s[c] = !(i[c] = u))
                    }
                } else v = m(v === i ? v.splice(f, v.length) : v), o ? o(null, i, v, l) : et.apply(i, v)
            })
        }

        function y(e) {
            for (var t, n, s, r = e.length, o = w.relative[e[0].type], i = o || w.relative[" "], a = o ? 1 : 0, l = d(function(e) {
                return e === t
            }, i, !0), c = d(function(e) {
                return nt.call(t, e) > -1
            }, i, !0), h = [function(e, n, s) {
                return !o && (s || n !== z) || ((t = n).nodeType ? l(e, n, s) : c(e, n, s))
            }]; r > a; a++)
                if (n = w.relative[e[a].type]) h = [d(f(h), n)];
                else {
                    if (n = w.filter[e[a].type].apply(null, e[a].matches), n[q]) {
                        for (s = ++a; r > s && !w.relative[e[s].type]; s++);
                        return _(a > 1 && f(h), a > 1 && p(e.slice(0, a - 1).concat({
                            value: " " === e[a - 2].type ? "*" : ""
                        })).replace(ct, "$1"), n, s > a && y(e.slice(a, s)), r > s && y(e = e.slice(s)), r > s && p(e))
                    }
                    h.push(n)
                }
            return f(h)
        }

        function v(e, n) {
            var r = n.length > 0,
                o = e.length > 0,
                i = function(s, i, a, l, c) {
                    var h, u, p, d = 0,
                        f = "0",
                        g = s && [],
                        _ = [],
                        y = z,
                        v = s || o && w.find.TAG("*", c),
                        b = R += null == y ? 1 : Math.random() || .1,
                        x = v.length;
                    for (c && (z = i !== S && i); f !== x && null != (h = v[f]); f++) {
                        if (o && h) {
                            for (u = 0; p = e[u++];)
                                if (p(h, i, a)) {
                                    l.push(h);
                                    break
                                }
                            c && (R = b)
                        }
                        r && ((h = !p && h) && d--, s && g.push(h))
                    }
                    if (d += f, r && f !== d) {
                        for (u = 0; p = n[u++];) p(g, _, i, a);
                        if (s) {
                            if (d > 0)
                                for (; f--;) g[f] || _[f] || (_[f] = K.call(l));
                            _ = m(_)
                        }
                        et.apply(l, _), c && !s && _.length > 0 && d + n.length > 1 && t.uniqueSort(l)
                    }
                    return c && (R = b, z = y), g
                };
            return r ? s(i) : i
        }
        var b, x, w, A, E, C, T, k, z, Z, N, D, S, L, O, F, I, j, M, q = "sizzle" + -new Date,
            H = e.document,
            R = 0,
            B = 0,
            P = n(),
            U = n(),
            W = n(),
            X = function(e, t) {
                return e === t && (N = !0), 0
            },
            G = "undefined",
            Y = 1 << 31,
            Q = {}.hasOwnProperty,
            V = [],
            K = V.pop,
            J = V.push,
            et = V.push,
            tt = V.slice,
            nt = V.indexOf || function(e) {
                for (var t = 0, n = this.length; n > t; t++)
                    if (this[t] === e) return t;
                return -1
            },
            st = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            rt = "[\\x20\\t\\r\\n\\f]",
            ot = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            it = ot.replace("w", "w#"),
            at = "\\[" + rt + "*(" + ot + ")(?:" + rt + "*([*^$|!~]?=)" + rt + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + it + "))|)" + rt + "*\\]",
            lt = ":(" + ot + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + at + ")*)|.*)\\)|)",
            ct = new RegExp("^" + rt + "+|((?:^|[^\\\\])(?:\\\\.)*)" + rt + "+$", "g"),
            ht = new RegExp("^" + rt + "*," + rt + "*"),
            ut = new RegExp("^" + rt + "*([>+~]|" + rt + ")" + rt + "*"),
            pt = new RegExp("=" + rt + "*([^\\]'\"]*?)" + rt + "*\\]", "g"),
            dt = new RegExp(lt),
            ft = new RegExp("^" + it + "$"),
            gt = {
                ID: new RegExp("^#(" + ot + ")"),
                CLASS: new RegExp("^\\.(" + ot + ")"),
                TAG: new RegExp("^(" + ot.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + at),
                PSEUDO: new RegExp("^" + lt),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + rt + "*(even|odd|(([+-]|)(\\d*)n|)" + rt + "*(?:([+-]|)" + rt + "*(\\d+)|))" + rt + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + st + ")$", "i"),
                needsContext: new RegExp("^" + rt + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + rt + "*((?:-\\d)?\\d*)" + rt + "*\\)|)(?=[^-]|$)", "i")
            },
            mt = /^(?:input|select|textarea|button)$/i,
            _t = /^h\d$/i,
            $ = /^[^{]+\{\s*\[native \w/,
            yt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            vt = /[+~]/,
            bt = /'|\\/g,
            xt = new RegExp("\\\\([\\da-f]{1,6}" + rt + "?|(" + rt + ")|.)", "ig"),
            wt = function(e, t, n) {
                var s = "0x" + t - 65536;
                return s !== s || n ? t : 0 > s ? String.fromCharCode(s + 65536) : String.fromCharCode(s >> 10 | 55296, 1023 & s | 56320)
            };
        try {
            et.apply(V = tt.call(H.childNodes), H.childNodes), V[H.childNodes.length].nodeType
        } catch (At) {
            et = {
                apply: V.length ? function(e, t) {
                    J.apply(e, tt.call(t))
                } : function(e, t) {
                    for (var n = e.length, s = 0; e[n++] = t[s++];);
                    e.length = n - 1
                }
            }
        }
        x = t.support = {}, E = t.isXML = function(e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return t ? "HTML" !== t.nodeName : !1
        }, D = t.setDocument = function(e) {
            var t, n = e ? e.ownerDocument || e : H,
                s = n.defaultView;
            return n !== S && 9 === n.nodeType && n.documentElement ? (S = n, L = n.documentElement, O = !E(n), s && s !== s.top && (s.addEventListener ? s.addEventListener("unload", function() {
                D()
            }, !1) : s.attachEvent && s.attachEvent("onunload", function() {
                D()
            })), x.attributes = r(function(e) {
                return e.className = "i", !e.getAttribute("className")
            }), x.getElementsByTagName = r(function(e) {
                return e.appendChild(n.createComment("")), !e.getElementsByTagName("*").length
            }), x.getElementsByClassName = $.test(n.getElementsByClassName) && r(function(e) {
                return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", 2 === e.getElementsByClassName("i").length
            }), x.getById = r(function(e) {
                return L.appendChild(e).id = q, !n.getElementsByName || !n.getElementsByName(q).length
            }), x.getById ? (w.find.ID = function(e, t) {
                if (typeof t.getElementById !== G && O) {
                    var n = t.getElementById(e);
                    return n && n.parentNode ? [n] : []
                }
            }, w.filter.ID = function(e) {
                var t = e.replace(xt, wt);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }) : (delete w.find.ID, w.filter.ID = function(e) {
                var t = e.replace(xt, wt);
                return function(e) {
                    var n = typeof e.getAttributeNode !== G && e.getAttributeNode("id");
                    return n && n.value === t
                }
            }), w.find.TAG = x.getElementsByTagName ? function(e, t) {
                return typeof t.getElementsByTagName !== G ? t.getElementsByTagName(e) : void 0
            } : function(e, t) {
                var n, s = [],
                    r = 0,
                    o = t.getElementsByTagName(e);
                if ("*" === e) {
                    for (; n = o[r++];) 1 === n.nodeType && s.push(n);
                    return s
                }
                return o
            }, w.find.CLASS = x.getElementsByClassName && function(e, t) {
                return typeof t.getElementsByClassName !== G && O ? t.getElementsByClassName(e) : void 0
            }, I = [], F = [], (x.qsa = $.test(n.querySelectorAll)) && (r(function(e) {
                e.innerHTML = "<select msallowclip=''><option selected=''></option></select>", e.querySelectorAll("[msallowclip^='']").length && F.push("[*^$]=" + rt + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || F.push("\\[" + rt + "*(?:value|" + st + ")"), e.querySelectorAll(":checked").length || F.push(":checked")
            }), r(function(e) {
                var t = n.createElement("input");
                t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && F.push("name" + rt + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || F.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), F.push(",.*:")
            })), (x.matchesSelector = $.test(j = L.matches || L.webkitMatchesSelector || L.mozMatchesSelector || L.oMatchesSelector || L.msMatchesSelector)) && r(function(e) {
                x.disconnectedMatch = j.call(e, "div"), j.call(e, "[s!='']:x"), I.push("!=", lt)
            }), F = F.length && new RegExp(F.join("|")), I = I.length && new RegExp(I.join("|")), t = $.test(L.compareDocumentPosition), M = t || $.test(L.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e,
                    s = t && t.parentNode;
                return e === s || !(!s || 1 !== s.nodeType || !(n.contains ? n.contains(s) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(s)))
            } : function(e, t) {
                if (t)
                    for (; t = t.parentNode;)
                        if (t === e) return !0;
                return !1
            }, X = t ? function(e, t) {
                if (e === t) return N = !0, 0;
                var s = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return s ? s : (s = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, 1 & s || !x.sortDetached && t.compareDocumentPosition(e) === s ? e === n || e.ownerDocument === H && M(H, e) ? -1 : t === n || t.ownerDocument === H && M(H, t) ? 1 : Z ? nt.call(Z, e) - nt.call(Z, t) : 0 : 4 & s ? -1 : 1)
            } : function(e, t) {
                if (e === t) return N = !0, 0;
                var s, r = 0,
                    o = e.parentNode,
                    a = t.parentNode,
                    l = [e],
                    c = [t];
                if (!o || !a) return e === n ? -1 : t === n ? 1 : o ? -1 : a ? 1 : Z ? nt.call(Z, e) - nt.call(Z, t) : 0;
                if (o === a) return i(e, t);
                for (s = e; s = s.parentNode;) l.unshift(s);
                for (s = t; s = s.parentNode;) c.unshift(s);
                for (; l[r] === c[r];) r++;
                return r ? i(l[r], c[r]) : l[r] === H ? -1 : c[r] === H ? 1 : 0
            }, n) : S
        }, t.matches = function(e, n) {
            return t(e, null, null, n)
        }, t.matchesSelector = function(e, n) {
            if ((e.ownerDocument || e) !== S && D(e), n = n.replace(pt, "='$1']"), !(!x.matchesSelector || !O || I && I.test(n) || F && F.test(n))) try {
                var s = j.call(e, n);
                if (s || x.disconnectedMatch || e.document && 11 !== e.document.nodeType) return s
            } catch (r) {}
            return t(n, S, null, [e]).length > 0
        }, t.contains = function(e, t) {
            return (e.ownerDocument || e) !== S && D(e), M(e, t)
        }, t.attr = function(e, t) {
            (e.ownerDocument || e) !== S && D(e);
            var n = w.attrHandle[t.toLowerCase()],
                s = n && Q.call(w.attrHandle, t.toLowerCase()) ? n(e, t, !O) : void 0;
            return void 0 !== s ? s : x.attributes || !O ? e.getAttribute(t) : (s = e.getAttributeNode(t)) && s.specified ? s.value : null
        }, t.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }, t.uniqueSort = function(e) {
            var t, n = [],
                s = 0,
                r = 0;
            if (N = !x.detectDuplicates, Z = !x.sortStable && e.slice(0), e.sort(X), N) {
                for (; t = e[r++];) t === e[r] && (s = n.push(r));
                for (; s--;) e.splice(n[s], 1)
            }
            return Z = null, e
        }, A = t.getText = function(e) {
            var t, n = "",
                s = 0,
                r = e.nodeType;
            if (r) {
                if (1 === r || 9 === r || 11 === r) {
                    if ("string" == typeof e.textContent) return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling) n += A(e)
                } else if (3 === r || 4 === r) return e.nodeValue
            } else
                for (; t = e[s++];) n += A(t);
            return n
        }, w = t.selectors = {
            cacheLength: 50,
            createPseudo: s,
            match: gt,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(xt, wt), e[3] = (e[3] || e[4] || e[5] || "").replace(xt, wt), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    return gt.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && dt.test(n) && (t = C(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(xt, wt).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    } : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = P[e + " "];
                    return t || (t = new RegExp("(^|" + rt + ")" + e + "(" + rt + "|$)")) && P(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== G && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(e, n, s) {
                    return function(r) {
                        var o = t.attr(r, e);
                        return null == o ? "!=" === n : n ? (o += "", "=" === n ? o === s : "!=" === n ? o !== s : "^=" === n ? s && 0 === o.indexOf(s) : "*=" === n ? s && o.indexOf(s) > -1 : "$=" === n ? s && o.slice(-s.length) === s : "~=" === n ? (" " + o + " ").indexOf(s) > -1 : "|=" === n ? o === s || o.slice(0, s.length + 1) === s + "-" : !1) : !0
                    }
                },
                CHILD: function(e, t, n, s, r) {
                    var o = "nth" !== e.slice(0, 3),
                        i = "last" !== e.slice(-4),
                        a = "of-type" === t;
                    return 1 === s && 0 === r ? function(e) {
                        return !!e.parentNode
                    } : function(t, n, l) {
                        var c, h, u, p, d, f, g = o !== i ? "nextSibling" : "previousSibling",
                            m = t.parentNode,
                            _ = a && t.nodeName.toLowerCase(),
                            y = !l && !a;
                        if (m) {
                            if (o) {
                                for (; g;) {
                                    for (u = t; u = u[g];)
                                        if (a ? u.nodeName.toLowerCase() === _ : 1 === u.nodeType) return !1;
                                    f = g = "only" === e && !f && "nextSibling"
                                }
                                return !0
                            }
                            if (f = [i ? m.firstChild : m.lastChild], i && y) {
                                for (h = m[q] || (m[q] = {}), c = h[e] || [], d = c[0] === R && c[1], p = c[0] === R && c[2], u = d && m.childNodes[d]; u = ++d && u && u[g] || (p = d = 0) || f.pop();)
                                    if (1 === u.nodeType && ++p && u === t) {
                                        h[e] = [R, d, p];
                                        break
                                    }
                            } else if (y && (c = (t[q] || (t[q] = {}))[e]) && c[0] === R) p = c[1];
                            else
                                for (;
                                    (u = ++d && u && u[g] || (p = d = 0) || f.pop()) && ((a ? u.nodeName.toLowerCase() !== _ : 1 !== u.nodeType) || !++p || (y && ((u[q] || (u[q] = {}))[e] = [R, p]), u !== t)););
                            return p -= r, p === s || p % s === 0 && p / s >= 0
                        }
                    }
                },
                PSEUDO: function(e, n) {
                    var r, o = w.pseudos[e] || w.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                    return o[q] ? o(n) : o.length > 1 ? (r = [e, e, "", n], w.setFilters.hasOwnProperty(e.toLowerCase()) ? s(function(e, t) {
                        for (var s, r = o(e, n), i = r.length; i--;) s = nt.call(e, r[i]), e[s] = !(t[s] = r[i])
                    }) : function(e) {
                        return o(e, 0, r)
                    }) : o
                }
            },
            pseudos: {
                not: s(function(e) {
                    var t = [],
                        n = [],
                        r = T(e.replace(ct, "$1"));
                    return r[q] ? s(function(e, t, n, s) {
                        for (var o, i = r(e, null, s, []), a = e.length; a--;)(o = i[a]) && (e[a] = !(t[a] = o))
                    }) : function(e, s, o) {
                        return t[0] = e, r(t, null, o, n), !n.pop()
                    }
                }),
                has: s(function(e) {
                    return function(n) {
                        return t(e, n).length > 0
                    }
                }),
                contains: s(function(e) {
                    return function(t) {
                        return (t.textContent || t.innerText || A(t)).indexOf(e) > -1
                    }
                }),
                lang: s(function(e) {
                    return ft.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(xt, wt).toLowerCase(),
                        function(t) {
                            var n;
                            do
                                if (n = O ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-");
                            while ((t = t.parentNode) && 1 === t.nodeType);
                            return !1
                        }
                }),
                target: function(t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                },
                root: function(e) {
                    return e === L
                },
                focus: function(e) {
                    return e === S.activeElement && (!S.hasFocus || S.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: function(e) {
                    return e.disabled === !1
                },
                disabled: function(e) {
                    return e.disabled === !0
                },
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6) return !1;
                    return !0
                },
                parent: function(e) {
                    return !w.pseudos.empty(e)
                },
                header: function(e) {
                    return _t.test(e.nodeName)
                },
                input: function(e) {
                    return mt.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: c(function() {
                    return [0]
                }),
                last: c(function(e, t) {
                    return [t - 1]
                }),
                eq: c(function(e, t, n) {
                    return [0 > n ? n + t : n]
                }),
                even: c(function(e, t) {
                    for (var n = 0; t > n; n += 2) e.push(n);
                    return e
                }),
                odd: c(function(e, t) {
                    for (var n = 1; t > n; n += 2) e.push(n);
                    return e
                }),
                lt: c(function(e, t, n) {
                    for (var s = 0 > n ? n + t : n; --s >= 0;) e.push(s);
                    return e
                }),
                gt: c(function(e, t, n) {
                    for (var s = 0 > n ? n + t : n; ++s < t;) e.push(s);
                    return e
                })
            }
        }, w.pseudos.nth = w.pseudos.eq;
        for (b in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) w.pseudos[b] = a(b);
        for (b in {
            submit: !0,
            reset: !0
        }) w.pseudos[b] = l(b);
        return u.prototype = w.filters = w.pseudos, w.setFilters = new u, C = t.tokenize = function(e, n) {
            var s, r, o, i, a, l, c, h = U[e + " "];
            if (h) return n ? 0 : h.slice(0);
            for (a = e, l = [], c = w.preFilter; a;) {
                (!s || (r = ht.exec(a))) && (r && (a = a.slice(r[0].length) || a), l.push(o = [])), s = !1, (r = ut.exec(a)) && (s = r.shift(), o.push({
                    value: s,
                    type: r[0].replace(ct, " ")
                }), a = a.slice(s.length));
                for (i in w.filter) !(r = gt[i].exec(a)) || c[i] && !(r = c[i](r)) || (s = r.shift(), o.push({
                    value: s,
                    type: i,
                    matches: r
                }), a = a.slice(s.length));
                if (!s) break
            }
            return n ? a.length : a ? t.error(e) : U(e, l).slice(0)
        }, T = t.compile = function(e, t) {
            var n, s = [],
                r = [],
                o = W[e + " "];
            if (!o) {
                for (t || (t = C(e)), n = t.length; n--;) o = y(t[n]), o[q] ? s.push(o) : r.push(o);
                o = W(e, v(r, s)), o.selector = e
            }
            return o
        }, k = t.select = function(e, t, n, s) {
            var r, o, i, a, l, c = "function" == typeof e && e,
                u = !s && C(e = c.selector || e);
            if (n = n || [], 1 === u.length) {
                if (o = u[0] = u[0].slice(0), o.length > 2 && "ID" === (i = o[0]).type && x.getById && 9 === t.nodeType && O && w.relative[o[1].type]) {
                    if (t = (w.find.ID(i.matches[0].replace(xt, wt), t) || [])[0], !t) return n;
                    c && (t = t.parentNode), e = e.slice(o.shift().value.length)
                }
                for (r = gt.needsContext.test(e) ? 0 : o.length; r-- && (i = o[r], !w.relative[a = i.type]);)
                    if ((l = w.find[a]) && (s = l(i.matches[0].replace(xt, wt), vt.test(o[0].type) && h(t.parentNode) || t))) {
                        if (o.splice(r, 1), e = s.length && p(o), !e) return et.apply(n, s), n;
                        break
                    }
            }
            return (c || T(e, u))(s, t, !O, n, vt.test(e) && h(t.parentNode) || t), n
        }, x.sortStable = q.split("").sort(X).join("") === q, x.detectDuplicates = !!N, D(), x.sortDetached = r(function(e) {
            return 1 & e.compareDocumentPosition(S.createElement("div"))
        }), r(function(e) {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || o("type|href|height|width", function(e, t, n) {
            return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), x.attributes && r(function(e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || o("value", function(e, t, n) {
            return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
        }), r(function(e) {
            return null == e.getAttribute("disabled")
        }) || o(st, function(e, t, n) {
            var s;
            return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (s = e.getAttributeNode(t)) && s.specified ? s.value : null
        }), t
    }(e);
    ot.find = ht, ot.expr = ht.selectors, ot.expr[":"] = ot.expr.pseudos, ot.unique = ht.uniqueSort, ot.text = ht.getText, ot.isXMLDoc = ht.isXML, ot.contains = ht.contains;
    var ut = ot.expr.match.needsContext,
        pt = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        dt = /^.[^:#\[\.,]*$/;
    ot.filter = function(e, t, n) {
        var s = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === s.nodeType ? ot.find.matchesSelector(s, e) ? [s] : [] : ot.find.matches(e, ot.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }, ot.fn.extend({
        find: function(e) {
            var t, n = [],
                s = this,
                r = s.length;
            if ("string" != typeof e) return this.pushStack(ot(e).filter(function() {
                for (t = 0; r > t; t++)
                    if (ot.contains(s[t], this)) return !0
            }));
            for (t = 0; r > t; t++) ot.find(e, s[t], n);
            return n = this.pushStack(r > 1 ? ot.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n
        },
        filter: function(e) {
            return this.pushStack(s(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(s(this, e || [], !0))
        },
        is: function(e) {
            return !!s(this, "string" == typeof e && ut.test(e) ? ot(e) : e || [], !1).length
        }
    });
    var ft, gt = e.document,
        mt = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        _t = ot.fn.init = function(e, t) {
            var n, s;
            if (!e) return this;
            if ("string" == typeof e) {
                if (n = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : mt.exec(e), !n || !n[1] && t) return !t || t.jquery ? (t || ft).find(e) : this.constructor(t).find(e);
                if (n[1]) {
                    if (t = t instanceof ot ? t[0] : t, ot.merge(this, ot.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : gt, !0)), pt.test(n[1]) && ot.isPlainObject(t))
                        for (n in t) ot.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                    return this
                }
                if (s = gt.getElementById(n[2]), s && s.parentNode) {
                    if (s.id !== n[2]) return ft.find(e);
                    this.length = 1, this[0] = s
                }
                return this.context = gt, this.selector = e, this
            }
            return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : ot.isFunction(e) ? "undefined" != typeof ft.ready ? ft.ready(e) : e(ot) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), ot.makeArray(e, this))
        };
    _t.prototype = ot.fn, ft = ot(gt);
    var yt = /^(?:parents|prev(?:Until|All))/,
        vt = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    ot.extend({
        dir: function(e, t, n) {
            for (var s = [], r = e[t]; r && 9 !== r.nodeType && (void 0 === n || 1 !== r.nodeType || !ot(r).is(n));) 1 === r.nodeType && s.push(r), r = r[t];
            return s
        },
        sibling: function(e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        }
    }), ot.fn.extend({
        has: function(e) {
            var t, n = ot(e, this),
                s = n.length;
            return this.filter(function() {
                for (t = 0; s > t; t++)
                    if (ot.contains(this, n[t])) return !0
            })
        },
        closest: function(e, t) {
            for (var n, s = 0, r = this.length, o = [], i = ut.test(e) || "string" != typeof e ? ot(e, t || this.context) : 0; r > s; s++)
                for (n = this[s]; n && n !== t; n = n.parentNode)
                    if (n.nodeType < 11 && (i ? i.index(n) > -1 : 1 === n.nodeType && ot.find.matchesSelector(n, e))) {
                        o.push(n);
                        break
                    }
            return this.pushStack(o.length > 1 ? ot.unique(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? ot.inArray(this[0], ot(e)) : ot.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(ot.unique(ot.merge(this.get(), ot(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), ot.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return ot.dir(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return ot.dir(e, "parentNode", n)
        },
        next: function(e) {
            return r(e, "nextSibling")
        },
        prev: function(e) {
            return r(e, "previousSibling")
        },
        nextAll: function(e) {
            return ot.dir(e, "nextSibling")
        },
        prevAll: function(e) {
            return ot.dir(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return ot.dir(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return ot.dir(e, "previousSibling", n)
        },
        siblings: function(e) {
            return ot.sibling((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return ot.sibling(e.firstChild)
        },
        contents: function(e) {
            return ot.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : ot.merge([], e.childNodes)
        }
    }, function(e, t) {
        ot.fn[e] = function(n, s) {
            var r = ot.map(this, t, n);
            return "Until" !== e.slice(-5) && (s = n), s && "string" == typeof s && (r = ot.filter(s, r)), this.length > 1 && (vt[e] || (r = ot.unique(r)), yt.test(e) && (r = r.reverse())), this.pushStack(r)
        }
    });
    var bt = /\S+/g,
        xt = {};
    ot.Callbacks = function(e) {
        e = "string" == typeof e ? xt[e] || o(e) : ot.extend({}, e);
        var t, n, s, r, i, a, l = [],
            c = !e.once && [],
            h = function(o) {
                for (n = e.memory && o, s = !0, i = a || 0, a = 0, r = l.length, t = !0; l && r > i; i++)
                    if (l[i].apply(o[0], o[1]) === !1 && e.stopOnFalse) {
                        n = !1;
                        break
                    }
                t = !1, l && (c ? c.length && h(c.shift()) : n ? l = [] : u.disable())
            },
            u = {
                add: function() {
                    if (l) {
                        var s = l.length;
                        ! function o(t) {
                            ot.each(t, function(t, n) {
                                var s = ot.type(n);
                                "function" === s ? e.unique && u.has(n) || l.push(n) : n && n.length && "string" !== s && o(n)
                            })
                        }(arguments), t ? r = l.length : n && (a = s, h(n))
                    }
                    return this
                },
                remove: function() {
                    return l && ot.each(arguments, function(e, n) {
                        for (var s;
                            (s = ot.inArray(n, l, s)) > -1;) l.splice(s, 1), t && (r >= s && r--, i >= s && i--)
                    }), this
                },
                has: function(e) {
                    return e ? ot.inArray(e, l) > -1 : !(!l || !l.length)
                },
                empty: function() {
                    return l = [], r = 0, this
                },
                disable: function() {
                    return l = c = n = void 0, this
                },
                disabled: function() {
                    return !l
                },
                lock: function() {
                    return c = void 0, n || u.disable(), this
                },
                locked: function() {
                    return !c
                },
                fireWith: function(e, n) {
                    return !l || s && !c || (n = n || [], n = [e, n.slice ? n.slice() : n], t ? c.push(n) : h(n)), this
                },
                fire: function() {
                    return u.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!s
                }
            };
        return u
    }, ot.extend({
        Deferred: function(e) {
            var t = [
                    ["resolve", "done", ot.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", ot.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", ot.Callbacks("memory")]
                ],
                n = "pending",
                s = {
                    state: function() {
                        return n
                    },
                    always: function() {
                        return r.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var e = arguments;
                        return ot.Deferred(function(n) {
                            ot.each(t, function(t, o) {
                                var i = ot.isFunction(e[t]) && e[t];
                                r[o[1]](function() {
                                    var e = i && i.apply(this, arguments);
                                    e && ot.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[o[0] + "With"](this === s ? n.promise() : this, i ? [e] : arguments)
                                })
                            }), e = null
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? ot.extend(e, s) : s
                    }
                },
                r = {};
            return s.pipe = s.then, ot.each(t, function(e, o) {
                var i = o[2],
                    a = o[3];
                s[o[1]] = i.add, a && i.add(function() {
                    n = a
                }, t[1 ^ e][2].disable, t[2][2].lock), r[o[0]] = function() {
                    return r[o[0] + "With"](this === r ? s : this, arguments), this
                }, r[o[0] + "With"] = i.fireWith
            }), s.promise(r), e && e.call(r, r), r
        },
        when: function(e) {
            var t = 0,
                n = Q.call(arguments),
                s = n.length,
                r = 1 !== s || e && ot.isFunction(e.promise) ? s : 0,
                o = 1 === r ? e : ot.Deferred(),
                i = function(e, t, n) {
                    return function(s) {
                        t[e] = this, n[e] = arguments.length > 1 ? Q.call(arguments) : s, n === a ? o.notifyWith(t, n) : --r || o.resolveWith(t, n)
                    }
                },
                a, l, c;
            if (s > 1)
                for (a = new Array(s), l = new Array(s), c = new Array(s); s > t; t++) n[t] && ot.isFunction(n[t].promise) ? n[t].promise().done(i(t, c, n)).fail(o.reject).progress(i(t, l, a)) : --r;
            return r || o.resolveWith(c, n), o.promise()
        }
    });
    var wt;
    ot.fn.ready = function(e) {
        return ot.ready.promise().done(e), this
    }, ot.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(e) {
            e ? ot.readyWait++ : ot.ready(!0)
        },
        ready: function(e) {
            if (e === !0 ? !--ot.readyWait : !ot.isReady) {
                if (!gt.body) return setTimeout(ot.ready);
                ot.isReady = !0, e !== !0 && --ot.readyWait > 0 || (wt.resolveWith(gt, [ot]), ot.fn.triggerHandler && (ot(gt).triggerHandler("ready"), ot(gt).off("ready")))
            }
        }
    }), ot.ready.promise = function(t) {
        if (!wt)
            if (wt = ot.Deferred(), "complete" === gt.readyState) setTimeout(ot.ready);
            else if (gt.addEventListener) gt.addEventListener("DOMContentLoaded", a, !1), e.addEventListener("load", a, !1);
        else {
            gt.attachEvent("onreadystatechange", a), e.attachEvent("onload", a);
            var n = !1;
            try {
                n = null == e.frameElement && gt.documentElement
            } catch (s) {}
            n && n.doScroll && ! function r() {
                if (!ot.isReady) {
                    try {
                        n.doScroll("left")
                    } catch (e) {
                        return setTimeout(r, 50)
                    }
                    i(), ot.ready()
                }
            }()
        }
        return wt.promise(t)
    };
    var At = "undefined",
        Et;
    for (Et in ot(st)) break;
    st.ownLast = "0" !== Et, st.inlineBlockNeedsLayout = !1, ot(function() {
            var e, t, n, s;
            n = gt.getElementsByTagName("body")[0], n && n.style && (t = gt.createElement("div"), s = gt.createElement("div"), s.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(s).appendChild(t), typeof t.style.zoom !== At && (t.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", st.inlineBlockNeedsLayout = e = 3 === t.offsetWidth, e && (n.style.zoom = 1)), n.removeChild(s))
        }),
        function() {
            var e = gt.createElement("div");
            if (null == st.deleteExpando) {
                st.deleteExpando = !0;
                try {
                    delete e.test
                } catch (t) {
                    st.deleteExpando = !1
                }
            }
            e = null
        }(), ot.acceptData = function(e) {
            var t = ot.noData[(e.nodeName + " ").toLowerCase()],
                n = +e.nodeType || 1;
            return 1 !== n && 9 !== n ? !1 : !t || t !== !0 && e.getAttribute("classid") === t
        };
    var Ct = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        Tt = /([A-Z])/g;
    ot.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(e) {
            return e = e.nodeType ? ot.cache[e[ot.expando]] : e[ot.expando], !!e && !c(e)
        },
        data: function(e, t, n) {
            return h(e, t, n)
        },
        removeData: function(e, t) {
            return u(e, t)
        },
        _data: function(e, t, n) {
            return h(e, t, n, !0)
        },
        _removeData: function(e, t) {
            return u(e, t, !0)
        }
    }), ot.fn.extend({
        data: function(e, t) {
            var n, s, r, o = this[0],
                i = o && o.attributes;
            if (void 0 === e) {
                if (this.length && (r = ot.data(o), 1 === o.nodeType && !ot._data(o, "parsedAttrs"))) {
                    for (n = i.length; n--;) i[n] && (s = i[n].name, 0 === s.indexOf("data-") && (s = ot.camelCase(s.slice(5)), l(o, s, r[s])));
                    ot._data(o, "parsedAttrs", !0)
                }
                return r
            }
            return "object" == typeof e ? this.each(function() {
                ot.data(this, e)
            }) : arguments.length > 1 ? this.each(function() {
                ot.data(this, e, t)
            }) : o ? l(o, e, ot.data(o, e)) : void 0
        },
        removeData: function(e) {
            return this.each(function() {
                ot.removeData(this, e)
            })
        }
    }), ot.extend({
        queue: function(e, t, n) {
            var s;
            return e ? (t = (t || "fx") + "queue", s = ot._data(e, t), n && (!s || ot.isArray(n) ? s = ot._data(e, t, ot.makeArray(n)) : s.push(n)), s || []) : void 0
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = ot.queue(e, t),
                s = n.length,
                r = n.shift(),
                o = ot._queueHooks(e, t),
                i = function() {
                    ot.dequeue(e, t)
                };
            "inprogress" === r && (r = n.shift(), s--), r && ("fx" === t && n.unshift("inprogress"), delete o.stop, r.call(e, i, o)), !s && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return ot._data(e, n) || ot._data(e, n, {
                empty: ot.Callbacks("once memory").add(function() {
                    ot._removeData(e, t + "queue"), ot._removeData(e, n)
                })
            })
        }
    }), ot.fn.extend({
        queue: function(e, t) {
            var n = 2;
            return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? ot.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                var n = ot.queue(this, e, t);
                ot._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && ot.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                ot.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, s = 1,
                r = ot.Deferred(),
                o = this,
                i = this.length,
                a = function() {
                    --s || r.resolveWith(o, [o])
                };
            for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; i--;) n = ot._data(o[i], e + "queueHooks"), n && n.empty && (s++, n.empty.add(a));
            return a(), r.promise(t)
        }
    });
    var kt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        zt = ["Top", "Right", "Bottom", "Left"],
        Zt = function(e, t) {
            return e = t || e, "none" === ot.css(e, "display") || !ot.contains(e.ownerDocument, e)
        },
        Nt = ot.access = function(e, t, n, s, r, o, i) {
            var a = 0,
                l = e.length,
                c = null == n;
            if ("object" === ot.type(n)) {
                r = !0;
                for (a in n) ot.access(e, t, a, n[a], !0, o, i)
            } else if (void 0 !== s && (r = !0, ot.isFunction(s) || (i = !0), c && (i ? (t.call(e, s), t = null) : (c = t, t = function(e, t, n) {
                return c.call(ot(e), n)
            })), t))
                for (; l > a; a++) t(e[a], n, i ? s : s.call(e[a], a, t(e[a], n)));
            return r ? e : c ? t.call(e) : l ? t(e[0], n) : o
        },
        $t = /^(?:checkbox|radio)$/i;
    ! function() {
        var e = gt.createElement("input"),
            t = gt.createElement("div"),
            n = gt.createDocumentFragment();
        if (t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", st.leadingWhitespace = 3 === t.firstChild.nodeType, st.tbody = !t.getElementsByTagName("tbody").length, st.htmlSerialize = !!t.getElementsByTagName("link").length, st.html5Clone = "<:nav></:nav>" !== gt.createElement("nav").cloneNode(!0).outerHTML, e.type = "checkbox", e.checked = !0, n.appendChild(e), st.appendChecked = e.checked, t.innerHTML = "<textarea>x</textarea>", st.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue, n.appendChild(t), t.innerHTML = "<input type='radio' checked='checked' name='t'/>", st.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, st.noCloneEvent = !0, t.attachEvent && (t.attachEvent("onclick", function() {
            st.noCloneEvent = !1
        }), t.cloneNode(!0).click()), null == st.deleteExpando) {
            st.deleteExpando = !0;
            try {
                delete t.test
            } catch (s) {
                st.deleteExpando = !1
            }
        }
    }(),
    function() {
        var t, n, s = gt.createElement("div");
        for (t in {
            submit: !0,
            change: !0,
            focusin: !0
        }) n = "on" + t, (st[t + "Bubbles"] = n in e) || (s.setAttribute(n, "t"), st[t + "Bubbles"] = s.attributes[n].expando === !1);
        s = null
    }();
    var Dt = /^(?:input|select|textarea)$/i,
        St = /^key/,
        Lt = /^(?:mouse|pointer|contextmenu)|click/,
        $ = /^(?:focusinfocus|focusoutblur)$/,
        Ot = /^([^.]*)(?:\.(.+)|)$/;
    ot.event = {
        global: {},
        add: function(e, t, n, s, r) {
            var o, i, a, l, c, h, u, p, d, f, g, m = ot._data(e);
            if (m) {
                for (n.handler && (l = n, n = l.handler, r = l.selector), n.guid || (n.guid = ot.guid++), (i = m.events) || (i = m.events = {}), (h = m.handle) || (h = m.handle = function(e) {
                    return typeof ot === At || e && ot.event.triggered === e.type ? void 0 : ot.event.dispatch.apply(h.elem, arguments)
                }, h.elem = e), t = (t || "").match(bt) || [""], a = t.length; a--;) o = Ot.exec(t[a]) || [], d = g = o[1], f = (o[2] || "").split(".").sort(), d && (c = ot.event.special[d] || {}, d = (r ? c.delegateType : c.bindType) || d, c = ot.event.special[d] || {}, u = ot.extend({
                    type: d,
                    origType: g,
                    data: s,
                    handler: n,
                    guid: n.guid,
                    selector: r,
                    needsContext: r && ot.expr.match.needsContext.test(r),
                    namespace: f.join(".")
                }, l), (p = i[d]) || (p = i[d] = [], p.delegateCount = 0, c.setup && c.setup.call(e, s, f, h) !== !1 || (e.addEventListener ? e.addEventListener(d, h, !1) : e.attachEvent && e.attachEvent("on" + d, h))), c.add && (c.add.call(e, u), u.handler.guid || (u.handler.guid = n.guid)), r ? p.splice(p.delegateCount++, 0, u) : p.push(u), ot.event.global[d] = !0);
                e = null
            }
        },
        remove: function(e, t, n, s, r) {
            var o, i, a, l, c, h, u, p, d, f, g, m = ot.hasData(e) && ot._data(e);
            if (m && (h = m.events)) {
                for (t = (t || "").match(bt) || [""], c = t.length; c--;)
                    if (a = Ot.exec(t[c]) || [], d = g = a[1], f = (a[2] || "").split(".").sort(), d) {
                        for (u = ot.event.special[d] || {}, d = (s ? u.delegateType : u.bindType) || d, p = h[d] || [], a = a[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = o = p.length; o--;) i = p[o], !r && g !== i.origType || n && n.guid !== i.guid || a && !a.test(i.namespace) || s && s !== i.selector && ("**" !== s || !i.selector) || (p.splice(o, 1), i.selector && p.delegateCount--, u.remove && u.remove.call(e, i));
                        l && !p.length && (u.teardown && u.teardown.call(e, f, m.handle) !== !1 || ot.removeEvent(e, d, m.handle), delete h[d])
                    } else
                        for (d in h) ot.event.remove(e, d + t[c], n, s, !0);
                ot.isEmptyObject(h) && (delete m.handle, ot._removeData(e, "events"))
            }
        },
        trigger: function(t, n, s, r) {
            var o, i, a, l, c, h, u, p = [s || gt],
                d = nt.call(t, "type") ? t.type : t,
                f = nt.call(t, "namespace") ? t.namespace.split(".") : [];
            if (a = h = s = s || gt, 3 !== s.nodeType && 8 !== s.nodeType && !$.test(d + ot.event.triggered) && (d.indexOf(".") >= 0 && (f = d.split("."), d = f.shift(), f.sort()), i = d.indexOf(":") < 0 && "on" + d, t = t[ot.expando] ? t : new ot.Event(d, "object" == typeof t && t), t.isTrigger = r ? 2 : 3, t.namespace = f.join("."), t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = s), n = null == n ? [t] : ot.makeArray(n, [t]), c = ot.event.special[d] || {}, r || !c.trigger || c.trigger.apply(s, n) !== !1)) {
                if (!r && !c.noBubble && !ot.isWindow(s)) {
                    for (l = c.delegateType || d, $.test(l + d) || (a = a.parentNode); a; a = a.parentNode) p.push(a), h = a;
                    h === (s.ownerDocument || gt) && p.push(h.defaultView || h.parentWindow || e)
                }
                for (u = 0;
                    (a = p[u++]) && !t.isPropagationStopped();) t.type = u > 1 ? l : c.bindType || d, o = (ot._data(a, "events") || {})[t.type] && ot._data(a, "handle"), o && o.apply(a, n), o = i && a[i], o && o.apply && ot.acceptData(a) && (t.result = o.apply(a, n), t.result === !1 && t.preventDefault());
                if (t.type = d, !r && !t.isDefaultPrevented() && (!c._default || c._default.apply(p.pop(), n) === !1) && ot.acceptData(s) && i && s[d] && !ot.isWindow(s)) {
                    h = s[i], h && (s[i] = null), ot.event.triggered = d;
                    try {
                        s[d]()
                    } catch (g) {}
                    ot.event.triggered = void 0, h && (s[i] = h)
                }
                return t.result
            }
        },
        dispatch: function(e) {
            e = ot.event.fix(e);
            var t, n, s, r, o, i = [],
                a = Q.call(arguments),
                l = (ot._data(this, "events") || {})[e.type] || [],
                c = ot.event.special[e.type] || {};
            if (a[0] = e, e.delegateTarget = this, !c.preDispatch || c.preDispatch.call(this, e) !== !1) {
                for (i = ot.event.handlers.call(this, e, l), t = 0;
                    (r = i[t++]) && !e.isPropagationStopped();)
                    for (e.currentTarget = r.elem, o = 0;
                        (s = r.handlers[o++]) && !e.isImmediatePropagationStopped();)(!e.namespace_re || e.namespace_re.test(s.namespace)) && (e.handleObj = s, e.data = s.data, n = ((ot.event.special[s.origType] || {}).handle || s.handler).apply(r.elem, a), void 0 !== n && (e.result = n) === !1 && (e.preventDefault(), e.stopPropagation()));
                return c.postDispatch && c.postDispatch.call(this, e), e.result
            }
        },
        handlers: function(e, t) {
            var n, s, r, o, i = [],
                a = t.delegateCount,
                l = e.target;
            if (a && l.nodeType && (!e.button || "click" !== e.type))
                for (; l != this; l = l.parentNode || this)
                    if (1 === l.nodeType && (l.disabled !== !0 || "click" !== e.type)) {
                        for (r = [], o = 0; a > o; o++) s = t[o], n = s.selector + " ", void 0 === r[n] && (r[n] = s.needsContext ? ot(n, this).index(l) >= 0 : ot.find(n, this, null, [l]).length), r[n] && r.push(s);
                        r.length && i.push({
                            elem: l,
                            handlers: r
                        })
                    }
            return a < t.length && i.push({
                elem: this,
                handlers: t.slice(a)
            }), i
        },
        fix: function(e) {
            if (e[ot.expando]) return e;
            var t, n, s, r = e.type,
                o = e,
                i = this.fixHooks[r];
            for (i || (this.fixHooks[r] = i = Lt.test(r) ? this.mouseHooks : St.test(r) ? this.keyHooks : {}), s = i.props ? this.props.concat(i.props) : this.props, e = new ot.Event(o), t = s.length; t--;) n = s[t], e[n] = o[n];
            return e.target || (e.target = o.srcElement || gt), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, i.filter ? i.filter(e, o) : e
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(e, t) {
                var n, s, r, o = t.button,
                    i = t.fromElement;
                return null == e.pageX && null != t.clientX && (s = e.target.ownerDocument || gt, r = s.documentElement, n = s.body, e.pageX = t.clientX + (r && r.scrollLeft || n && n.scrollLeft || 0) - (r && r.clientLeft || n && n.clientLeft || 0), e.pageY = t.clientY + (r && r.scrollTop || n && n.scrollTop || 0) - (r && r.clientTop || n && n.clientTop || 0)), !e.relatedTarget && i && (e.relatedTarget = i === e.target ? t.toElement : i), e.which || void 0 === o || (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0), e
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== f() && this.focus) try {
                        return this.focus(), !1
                    } catch (e) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === f() && this.blur ? (this.blur(), !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return ot.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                },
                _default: function(e) {
                    return ot.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function(e, t, n, s) {
            var r = ot.extend(new ot.Event, n, {
                type: e,
                isSimulated: !0,
                originalEvent: {}
            });
            s ? ot.event.trigger(r, null, t) : ot.event.dispatch.call(t, r), r.isDefaultPrevented() && n.preventDefault()
        }
    }, ot.removeEvent = gt.removeEventListener ? function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n, !1)
    } : function(e, t, n) {
        var s = "on" + t;
        e.detachEvent && (typeof e[s] === At && (e[s] = null), e.detachEvent(s, n))
    }, ot.Event = function(e, t) {
        return this instanceof ot.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? p : d) : this.type = e, t && ot.extend(this, t), this.timeStamp = e && e.timeStamp || ot.now(), void(this[ot.expando] = !0)) : new ot.Event(e, t)
    }, ot.Event.prototype = {
        isDefaultPrevented: d,
        isPropagationStopped: d,
        isImmediatePropagationStopped: d,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = p, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = p, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = p, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, ot.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, t) {
        ot.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n, s = this,
                    r = e.relatedTarget,
                    o = e.handleObj;
                return (!r || r !== s && !ot.contains(s, r)) && (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
            }
        }
    }), st.submitBubbles || (ot.event.special.submit = {
        setup: function() {
            return ot.nodeName(this, "form") ? !1 : void ot.event.add(this, "click._submit keypress._submit", function(e) {
                var t = e.target,
                    n = ot.nodeName(t, "input") || ot.nodeName(t, "button") ? t.form : void 0;
                n && !ot._data(n, "submitBubbles") && (ot.event.add(n, "submit._submit", function(e) {
                    e._submit_bubble = !0
                }), ot._data(n, "submitBubbles", !0))
            })
        },
        postDispatch: function(e) {
            e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && ot.event.simulate("submit", this.parentNode, e, !0))
        },
        teardown: function() {
            return ot.nodeName(this, "form") ? !1 : void ot.event.remove(this, "._submit")
        }
    }), st.changeBubbles || (ot.event.special.change = {
        setup: function() {
            return Dt.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (ot.event.add(this, "propertychange._change", function(e) {
                "checked" === e.originalEvent.propertyName && (this._just_changed = !0)
            }), ot.event.add(this, "click._change", function(e) {
                this._just_changed && !e.isTrigger && (this._just_changed = !1), ot.event.simulate("change", this, e, !0)
            })), !1) : void ot.event.add(this, "beforeactivate._change", function(e) {
                var t = e.target;
                Dt.test(t.nodeName) && !ot._data(t, "changeBubbles") && (ot.event.add(t, "change._change", function(e) {
                    !this.parentNode || e.isSimulated || e.isTrigger || ot.event.simulate("change", this.parentNode, e, !0)
                }), ot._data(t, "changeBubbles", !0))
            })
        },
        handle: function(e) {
            var t = e.target;
            return this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type ? e.handleObj.handler.apply(this, arguments) : void 0
        },
        teardown: function() {
            return ot.event.remove(this, "._change"), !Dt.test(this.nodeName)
        }
    }), st.focusinBubbles || ot.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var n = function(e) {
            ot.event.simulate(t, e.target, ot.event.fix(e), !0)
        };
        ot.event.special[t] = {
            setup: function() {
                var s = this.ownerDocument || this,
                    r = ot._data(s, t);
                r || s.addEventListener(e, n, !0), ot._data(s, t, (r || 0) + 1)
            },
            teardown: function() {
                var s = this.ownerDocument || this,
                    r = ot._data(s, t) - 1;
                r ? ot._data(s, t, r) : (s.removeEventListener(e, n, !0), ot._removeData(s, t))
            }
        }
    }), ot.fn.extend({
        on: function(e, t, n, s, r) {
            var o, i;
            if ("object" == typeof e) {
                "string" != typeof t && (n = n || t, t = void 0);
                for (o in e) this.on(o, t, n, e[o], r);
                return this
            }
            if (null == n && null == s ? (s = t, n = t = void 0) : null == s && ("string" == typeof t ? (s = n, n = void 0) : (s = n, n = t, t = void 0)), s === !1) s = d;
            else if (!s) return this;
            return 1 === r && (i = s, s = function(e) {
                return ot().off(e), i.apply(this, arguments)
            }, s.guid = i.guid || (i.guid = ot.guid++)), this.each(function() {
                ot.event.add(this, e, s, n, t)
            })
        },
        one: function(e, t, n, s) {
            return this.on(e, t, n, s, 1)
        },
        off: function(e, t, n) {
            var s, r;
            if (e && e.preventDefault && e.handleObj) return s = e.handleObj, ot(e.delegateTarget).off(s.namespace ? s.origType + "." + s.namespace : s.origType, s.selector, s.handler), this;
            if ("object" == typeof e) {
                for (r in e) this.off(r, t, e[r]);
                return this
            }
            return (t === !1 || "function" == typeof t) && (n = t, t = void 0), n === !1 && (n = d), this.each(function() {
                ot.event.remove(this, e, n, t)
            })
        },
        trigger: function(e, t) {
            return this.each(function() {
                ot.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            return n ? ot.event.trigger(e, t, n, !0) : void 0
        }
    });
    var Ft = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        It = / jQuery\d+="(?:null|\d+)"/g,
        jt = new RegExp("<(?:" + Ft + ")[\\s/>]", "i"),
        Mt = /^\s+/,
        qt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        Ht = /<([\w:]+)/,
        Rt = /<tbody/i,
        Bt = /<|&#?\w+;/,
        Pt = /<(?:script|style|link)/i,
        Ut = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Wt = /^$|\/(?:java|ecma)script/i,
        Xt = /^true\/(.*)/,
        Gt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        Yt = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: st.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        },
        Qt = g(gt),
        Vt = Qt.appendChild(gt.createElement("div"));
    Yt.optgroup = Yt.option, Yt.tbody = Yt.tfoot = Yt.colgroup = Yt.caption = Yt.thead, Yt.th = Yt.td, ot.extend({
        clone: function(e, t, n) {
            var s, r, o, i, a, l = ot.contains(e.ownerDocument, e);
            if (st.html5Clone || ot.isXMLDoc(e) || !jt.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (Vt.innerHTML = e.outerHTML, Vt.removeChild(o = Vt.firstChild)), !(st.noCloneEvent && st.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || ot.isXMLDoc(e)))
                for (s = m(o), a = m(e), i = 0; null != (r = a[i]); ++i) s[i] && A(r, s[i]);
            if (t)
                if (n)
                    for (a = a || m(e), s = s || m(o), i = 0; null != (r = a[i]); i++) w(r, s[i]);
                else w(e, o);
            return s = m(o, "script"), s.length > 0 && x(s, !l && m(e, "script")), s = a = r = null, o
        },
        buildFragment: function(e, t, n, s) {
            for (var r, o, i, a, l, c, h, u = e.length, p = g(t), d = [], f = 0; u > f; f++)
                if (o = e[f], o || 0 === o)
                    if ("object" === ot.type(o)) ot.merge(d, o.nodeType ? [o] : o);
                    else if (Bt.test(o)) {
                for (a = a || p.appendChild(t.createElement("div")), l = (Ht.exec(o) || ["", ""])[1].toLowerCase(), h = Yt[l] || Yt._default, a.innerHTML = h[1] + o.replace(qt, "<$1></$2>") + h[2], r = h[0]; r--;) a = a.lastChild;
                if (!st.leadingWhitespace && Mt.test(o) && d.push(t.createTextNode(Mt.exec(o)[0])), !st.tbody)
                    for (o = "table" !== l || Rt.test(o) ? "<table>" !== h[1] || Rt.test(o) ? 0 : a : a.firstChild, r = o && o.childNodes.length; r--;) ot.nodeName(c = o.childNodes[r], "tbody") && !c.childNodes.length && o.removeChild(c);
                for (ot.merge(d, a.childNodes), a.textContent = ""; a.firstChild;) a.removeChild(a.firstChild);
                a = p.lastChild
            } else d.push(t.createTextNode(o));
            for (a && p.removeChild(a), st.appendChecked || ot.grep(m(d, "input"), _), f = 0; o = d[f++];)
                if ((!s || -1 === ot.inArray(o, s)) && (i = ot.contains(o.ownerDocument, o), a = m(p.appendChild(o), "script"), i && x(a), n))
                    for (r = 0; o = a[r++];) Wt.test(o.type || "") && n.push(o);
            return a = null, p
        },
        cleanData: function(e, t) {
            for (var n, s, r, o, i = 0, a = ot.expando, l = ot.cache, c = st.deleteExpando, h = ot.event.special; null != (n = e[i]); i++)
                if ((t || ot.acceptData(n)) && (r = n[a], o = r && l[r])) {
                    if (o.events)
                        for (s in o.events) h[s] ? ot.event.remove(n, s) : ot.removeEvent(n, s, o.handle);
                    l[r] && (delete l[r], c ? delete n[a] : typeof n.removeAttribute !== At ? n.removeAttribute(a) : n[a] = null, Y.push(r))
                }
        }
    }), ot.fn.extend({
        text: function(e) {
            return Nt(this, function(e) {
                return void 0 === e ? ot.text(this) : this.empty().append((this[0] && this[0].ownerDocument || gt).createTextNode(e))
            }, null, e, arguments.length)
        },
        append: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = y(this, e);
                    t.appendChild(e)
                }
            })
        },
        prepend: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = y(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        remove: function(e, t) {
            for (var n, s = e ? ot.filter(e, this) : this, r = 0; null != (n = s[r]); r++) t || 1 !== n.nodeType || ot.cleanData(m(n)), n.parentNode && (t && ot.contains(n.ownerDocument, n) && x(m(n, "script")), n.parentNode.removeChild(n));
            return this
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++) {
                for (1 === e.nodeType && ot.cleanData(m(e, !1)); e.firstChild;) e.removeChild(e.firstChild);
                e.options && ot.nodeName(e, "select") && (e.options.length = 0)
            }
            return this
        },
        clone: function(e, t) {
            return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function() {
                return ot.clone(this, e, t)
            })
        },
        html: function(e) {
            return Nt(this, function(e) {
                var t = this[0] || {},
                    n = 0,
                    s = this.length;
                if (void 0 === e) return 1 === t.nodeType ? t.innerHTML.replace(It, "") : void 0;
                if (!("string" != typeof e || Pt.test(e) || !st.htmlSerialize && jt.test(e) || !st.leadingWhitespace && Mt.test(e) || Yt[(Ht.exec(e) || ["", ""])[1].toLowerCase()])) {
                    e = e.replace(qt, "<$1></$2>");
                    try {
                        for (; s > n; n++) t = this[n] || {}, 1 === t.nodeType && (ot.cleanData(m(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (r) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var e = arguments[0];
            return this.domManip(arguments, function(t) {
                e = this.parentNode, ot.cleanData(m(this)), e && e.replaceChild(t, this)
            }), e && (e.length || e.nodeType) ? this : this.remove()
        },
        detach: function(e) {
            return this.remove(e, !0)
        },
        domManip: function(e, t) {
            e = V.apply([], e);
            var n, s, r, o, i, a, l = 0,
                c = this.length,
                h = this,
                u = c - 1,
                p = e[0],
                d = ot.isFunction(p);
            if (d || c > 1 && "string" == typeof p && !st.checkClone && Ut.test(p)) return this.each(function(n) {
                var s = h.eq(n);
                d && (e[0] = p.call(this, n, s.html())), s.domManip(e, t)
            });
            if (c && (a = ot.buildFragment(e, this[0].ownerDocument, !1, this), n = a.firstChild, 1 === a.childNodes.length && (a = n), n)) {
                for (o = ot.map(m(a, "script"), v), r = o.length; c > l; l++) s = a, l !== u && (s = ot.clone(s, !0, !0), r && ot.merge(o, m(s, "script"))), t.call(this[l], s, l);
                if (r)
                    for (i = o[o.length - 1].ownerDocument, ot.map(o, b), l = 0; r > l; l++) s = o[l], Wt.test(s.type || "") && !ot._data(s, "globalEval") && ot.contains(i, s) && (s.src ? ot._evalUrl && ot._evalUrl(s.src) : ot.globalEval((s.text || s.textContent || s.innerHTML || "").replace(Gt, "")));
                a = n = null
            }
            return this
        }
    }), ot.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        ot.fn[e] = function(e) {
            for (var n, s = 0, r = [], o = ot(e), i = o.length - 1; i >= s; s++) n = s === i ? this : this.clone(!0), ot(o[s])[t](n), K.apply(r, n.get());
            return this.pushStack(r)
        }
    });
    var Kt, Jt = {};
    ! function() {
        var e;
        st.shrinkWrapBlocks = function() {
            if (null != e) return e;
            e = !1;
            var t, n, s;
            return n = gt.getElementsByTagName("body")[0], n && n.style ? (t = gt.createElement("div"), s = gt.createElement("div"), s.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(s).appendChild(t), typeof t.style.zoom !== At && (t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", t.appendChild(gt.createElement("div")).style.width = "5px", e = 3 !== t.offsetWidth), n.removeChild(s), e) : void 0
        }
    }();
    var en = /^margin/,
        tn = new RegExp("^(" + kt + ")(?!px)[a-z%]+$", "i"),
        nn, sn, rn = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (nn = function(e) {
        return e.ownerDocument.defaultView.getComputedStyle(e, null)
    }, sn = function(e, t, n) {
        var s, r, o, i, a = e.style;
        return n = n || nn(e), i = n ? n.getPropertyValue(t) || n[t] : void 0, n && ("" !== i || ot.contains(e.ownerDocument, e) || (i = ot.style(e, t)), tn.test(i) && en.test(t) && (s = a.width, r = a.minWidth, o = a.maxWidth, a.minWidth = a.maxWidth = a.width = i, i = n.width, a.width = s, a.minWidth = r, a.maxWidth = o)), void 0 === i ? i : i + ""
    }) : gt.documentElement.currentStyle && (nn = function(e) {
        return e.currentStyle
    }, sn = function(e, t, n) {
        var s, r, o, i, a = e.style;
        return n = n || nn(e), i = n ? n[t] : void 0, null == i && a && a[t] && (i = a[t]), tn.test(i) && !rn.test(t) && (s = a.left, r = e.runtimeStyle, o = r && r.left, o && (r.left = e.currentStyle.left), a.left = "fontSize" === t ? "1em" : i, i = a.pixelLeft + "px", a.left = s, o && (r.left = o)), void 0 === i ? i : i + "" || "auto"
    }), ! function() {
        function t() {
            var t, n, s, r;
            n = gt.getElementsByTagName("body")[0], n && n.style && (t = gt.createElement("div"), s = gt.createElement("div"), s.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(s).appendChild(t), t.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", o = i = !1, l = !0, e.getComputedStyle && (o = "1%" !== (e.getComputedStyle(t, null) || {}).top, i = "4px" === (e.getComputedStyle(t, null) || {
                width: "4px"
            }).width, r = t.appendChild(gt.createElement("div")), r.style.cssText = t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", r.style.marginRight = r.style.width = "0", t.style.width = "1px", l = !parseFloat((e.getComputedStyle(r, null) || {}).marginRight)), t.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", r = t.getElementsByTagName("td"), r[0].style.cssText = "margin:0;border:0;padding:0;display:none", a = 0 === r[0].offsetHeight, a && (r[0].style.display = "", r[1].style.display = "none", a = 0 === r[0].offsetHeight), n.removeChild(s))
        }
        var n, s, r, o, i, a, l;
        n = gt.createElement("div"), n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", r = n.getElementsByTagName("a")[0], (s = r && r.style) && (s.cssText = "float:left;opacity:.5", st.opacity = "0.5" === s.opacity, st.cssFloat = !!s.cssFloat, n.style.backgroundClip = "content-box", n.cloneNode(!0).style.backgroundClip = "", st.clearCloneStyle = "content-box" === n.style.backgroundClip, st.boxSizing = "" === s.boxSizing || "" === s.MozBoxSizing || "" === s.WebkitBoxSizing, ot.extend(st, {
            reliableHiddenOffsets: function() {
                return null == a && t(), a
            },
            boxSizingReliable: function() {
                return null == i && t(), i
            },
            pixelPosition: function() {
                return null == o && t(), o
            },
            reliableMarginRight: function() {
                return null == l && t(), l
            }
        }))
    }(), ot.swap = function(e, t, n, s) {
        var r, o, i = {};
        for (o in t) i[o] = e.style[o], e.style[o] = t[o];
        r = n.apply(e, s || []);
        for (o in t) e.style[o] = i[o];
        return r
    };
    var on = /alpha\([^)]*\)/i,
        an = /opacity\s*=\s*([^)]*)/,
        ln = /^(none|table(?!-c[ea]).+)/,
        cn = new RegExp("^(" + kt + ")(.*)$", "i"),
        hn = new RegExp("^([+-])=(" + kt + ")", "i"),
        un = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        pn = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        dn = ["Webkit", "O", "Moz", "ms"];
    ot.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = sn(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": st.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(e, t, n, s) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var r, o, i, a = ot.camelCase(t),
                    l = e.style;
                if (t = ot.cssProps[a] || (ot.cssProps[a] = k(l, a)), i = ot.cssHooks[t] || ot.cssHooks[a], void 0 === n) return i && "get" in i && void 0 !== (r = i.get(e, !1, s)) ? r : l[t];
                if (o = typeof n, "string" === o && (r = hn.exec(n)) && (n = (r[1] + 1) * r[2] + parseFloat(ot.css(e, t)), o = "number"), null != n && n === n && ("number" !== o || ot.cssNumber[a] || (n += "px"), st.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), !(i && "set" in i && void 0 === (n = i.set(e, n, s))))) try {
                    l[t] = n
                } catch (c) {}
            }
        },
        css: function(e, t, n, s) {
            var r, o, i, a = ot.camelCase(t);
            return t = ot.cssProps[a] || (ot.cssProps[a] = k(e.style, a)), i = ot.cssHooks[t] || ot.cssHooks[a], i && "get" in i && (o = i.get(e, !0, n)), void 0 === o && (o = sn(e, t, s)), "normal" === o && t in pn && (o = pn[t]), "" === n || n ? (r = parseFloat(o), n === !0 || ot.isNumeric(r) ? r || 0 : o) : o
        }
    }), ot.each(["height", "width"], function(e, t) {
        ot.cssHooks[t] = {
            get: function(e, n, s) {
                return n ? ln.test(ot.css(e, "display")) && 0 === e.offsetWidth ? ot.swap(e, un, function() {
                    return D(e, t, s)
                }) : D(e, t, s) : void 0
            },
            set: function(e, n, s) {
                var r = s && nn(e);
                return Z(e, n, s ? N(e, t, s, st.boxSizing && "border-box" === ot.css(e, "boxSizing", !1, r), r) : 0)
            }
        }
    }), st.opacity || (ot.cssHooks.opacity = {
        get: function(e, t) {
            return an.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        },
        set: function(e, t) {
            var n = e.style,
                s = e.currentStyle,
                r = ot.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                o = s && s.filter || n.filter || "";
            n.zoom = 1, (t >= 1 || "" === t) && "" === ot.trim(o.replace(on, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || s && !s.filter) || (n.filter = on.test(o) ? o.replace(on, r) : o + " " + r)
        }
    }), ot.cssHooks.marginRight = T(st.reliableMarginRight, function(e, t) {
        return t ? ot.swap(e, {
            display: "inline-block"
        }, sn, [e, "marginRight"]) : void 0
    }), ot.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        ot.cssHooks[e + t] = {
            expand: function(n) {
                for (var s = 0, r = {}, o = "string" == typeof n ? n.split(" ") : [n]; 4 > s; s++) r[e + zt[s] + t] = o[s] || o[s - 2] || o[0];
                return r
            }
        }, en.test(e) || (ot.cssHooks[e + t].set = Z)
    }), ot.fn.extend({
        css: function(e, t) {
            return Nt(this, function(e, t, n) {
                var s, r, o = {},
                    i = 0;
                if (ot.isArray(t)) {
                    for (s = nn(e), r = t.length; r > i; i++) o[t[i]] = ot.css(e, t[i], !1, s);
                    return o
                }
                return void 0 !== n ? ot.style(e, t, n) : ot.css(e, t)
            }, e, t, arguments.length > 1)
        },
        show: function() {
            return z(this, !0)
        },
        hide: function() {
            return z(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                Zt(this) ? ot(this).show() : ot(this).hide()
            })
        }
    }), ot.Tween = S, S.prototype = {
        constructor: S,
        init: function(e, t, n, s, r, o) {
            this.elem = e, this.prop = n, this.easing = r || "swing", this.options = t, this.start = this.now = this.cur(), this.end = s, this.unit = o || (ot.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = S.propHooks[this.prop];
            return e && e.get ? e.get(this) : S.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = S.propHooks[this.prop];
            return this.pos = t = this.options.duration ? ot.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : S.propHooks._default.set(this), this
        }
    }, S.prototype.init.prototype = S.prototype, S.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = ot.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
            },
            set: function(e) {
                ot.fx.step[e.prop] ? ot.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[ot.cssProps[e.prop]] || ot.cssHooks[e.prop]) ? ot.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
            }
        }
    }, S.propHooks.scrollTop = S.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, ot.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        }
    }, ot.fx = S.prototype.init, ot.fx.step = {};
    var fn, gn, mn = /^(?:toggle|show|hide)$/,
        _n = new RegExp("^(?:([+-])=|)(" + kt + ")([a-z%]*)$", "i"),
        yn = /queueHooks$/,
        vn = [I],
        bn = {
            "*": [function(e, t) {
                var n = this.createTween(e, t),
                    s = n.cur(),
                    r = _n.exec(t),
                    o = r && r[3] || (ot.cssNumber[e] ? "" : "px"),
                    i = (ot.cssNumber[e] || "px" !== o && +s) && _n.exec(ot.css(n.elem, e)),
                    a = 1,
                    l = 20;
                if (i && i[3] !== o) {
                    o = o || i[3], r = r || [], i = +s || 1;
                    do a = a || ".5", i /= a, ot.style(n.elem, e, i + o); while (a !== (a = n.cur() / s) && 1 !== a && --l)
                }
                return r && (i = n.start = +i || +s || 0, n.unit = o, n.end = r[1] ? i + (r[1] + 1) * r[2] : +r[2]), n
            }]
        };
    ot.Animation = ot.extend(M, {
            tweener: function(e, t) {
                ot.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
                for (var n, s = 0, r = e.length; r > s; s++) n = e[s], bn[n] = bn[n] || [], bn[n].unshift(t)
            },
            prefilter: function(e, t) {
                t ? vn.unshift(e) : vn.push(e)
            }
        }), ot.speed = function(e, t, n) {
            var s = e && "object" == typeof e ? ot.extend({}, e) : {
                complete: n || !n && t || ot.isFunction(e) && e,
                duration: e,
                easing: n && t || t && !ot.isFunction(t) && t
            };
            return s.duration = ot.fx.off ? 0 : "number" == typeof s.duration ? s.duration : s.duration in ot.fx.speeds ? ot.fx.speeds[s.duration] : ot.fx.speeds._default, (null == s.queue || s.queue === !0) && (s.queue = "fx"), s.old = s.complete, s.complete = function() {
                ot.isFunction(s.old) && s.old.call(this), s.queue && ot.dequeue(this, s.queue)
            }, s
        }, ot.fn.extend({
            fadeTo: function(e, t, n, s) {
                return this.filter(Zt).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, n, s)
            },
            animate: function(e, t, n, s) {
                var r = ot.isEmptyObject(e),
                    o = ot.speed(t, n, s),
                    i = function() {
                        var t = M(this, ot.extend({}, e), o);
                        (r || ot._data(this, "finish")) && t.stop(!0)
                    };
                return i.finish = i, r || o.queue === !1 ? this.each(i) : this.queue(o.queue, i)
            },
            stop: function(e, t, n) {
                var s = function(e) {
                    var t = e.stop;
                    delete e.stop, t(n)
                };
                return "string" != typeof e && (n = t, t = e, e = void 0), t && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                    var t = !0,
                        r = null != e && e + "queueHooks",
                        o = ot.timers,
                        i = ot._data(this);
                    if (r) i[r] && i[r].stop && s(i[r]);
                    else
                        for (r in i) i[r] && i[r].stop && yn.test(r) && s(i[r]);
                    for (r = o.length; r--;) o[r].elem !== this || null != e && o[r].queue !== e || (o[r].anim.stop(n), t = !1, o.splice(r, 1));
                    (t || !n) && ot.dequeue(this, e)
                })
            },
            finish: function(e) {
                return e !== !1 && (e = e || "fx"), this.each(function() {
                    var t, n = ot._data(this),
                        s = n[e + "queue"],
                        r = n[e + "queueHooks"],
                        o = ot.timers,
                        i = s ? s.length : 0;
                    for (n.finish = !0, ot.queue(this, e, []), r && r.stop && r.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                    for (t = 0; i > t; t++) s[t] && s[t].finish && s[t].finish.call(this);
                    delete n.finish
                })
            }
        }), ot.each(["toggle", "show", "hide"], function(e, t) {
            var n = ot.fn[t];
            ot.fn[t] = function(e, s, r) {
                return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(O(t, !0), e, s, r)
            }
        }), ot.each({
            slideDown: O("show"),
            slideUp: O("hide"),
            slideToggle: O("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(e, t) {
            ot.fn[e] = function(e, n, s) {
                return this.animate(t, e, n, s)
            }
        }), ot.timers = [], ot.fx.tick = function() {
            var e, t = ot.timers,
                n = 0;
            for (fn = ot.now(); n < t.length; n++) e = t[n], e() || t[n] !== e || t.splice(n--, 1);
            t.length || ot.fx.stop(), fn = void 0
        }, ot.fx.timer = function(e) {
            ot.timers.push(e), e() ? ot.fx.start() : ot.timers.pop()
        }, ot.fx.interval = 13, ot.fx.start = function() {
            gn || (gn = setInterval(ot.fx.tick, ot.fx.interval))
        }, ot.fx.stop = function() {
            clearInterval(gn), gn = null
        }, ot.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, ot.fn.delay = function(e, t) {
            return e = ot.fx ? ot.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
                var s = setTimeout(t, e);
                n.stop = function() {
                    clearTimeout(s)
                }
            })
        },
        function() {
            var e, t, n, s, r;
            t = gt.createElement("div"), t.setAttribute("className", "t"), t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", s = t.getElementsByTagName("a")[0], n = gt.createElement("select"), r = n.appendChild(gt.createElement("option")), e = t.getElementsByTagName("input")[0], s.style.cssText = "top:1px", st.getSetAttribute = "t" !== t.className, st.style = /top/.test(s.getAttribute("style")), st.hrefNormalized = "/a" === s.getAttribute("href"), st.checkOn = !!e.value, st.optSelected = r.selected, st.enctype = !!gt.createElement("form").enctype, n.disabled = !0, st.optDisabled = !r.disabled, e = gt.createElement("input"), e.setAttribute("value", ""), st.input = "" === e.getAttribute("value"), e.value = "t", e.setAttribute("type", "radio"), st.radioValue = "t" === e.value
        }();
    var xn = /\r/g;
    ot.fn.extend({
        val: function(e) {
            var t, n, s, r = this[0];
            return arguments.length ? (s = ot.isFunction(e), this.each(function(n) {
                var r;
                1 === this.nodeType && (r = s ? e.call(this, n, ot(this).val()) : e, null == r ? r = "" : "number" == typeof r ? r += "" : ot.isArray(r) && (r = ot.map(r, function(e) {
                    return null == e ? "" : e + ""
                })), t = ot.valHooks[this.type] || ot.valHooks[this.nodeName.toLowerCase()], t && "set" in t && void 0 !== t.set(this, r, "value") || (this.value = r))
            })) : r ? (t = ot.valHooks[r.type] || ot.valHooks[r.nodeName.toLowerCase()], t && "get" in t && void 0 !== (n = t.get(r, "value")) ? n : (n = r.value, "string" == typeof n ? n.replace(xn, "") : null == n ? "" : n)) : void 0
        }
    }), ot.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = ot.find.attr(e, "value");
                    return null != t ? t : ot.trim(ot.text(e))
                }
            },
            select: {
                get: function(e) {
                    for (var t, n, s = e.options, r = e.selectedIndex, o = "select-one" === e.type || 0 > r, i = o ? null : [], a = o ? r + 1 : s.length, l = 0 > r ? a : o ? r : 0; a > l; l++)
                        if (n = s[l], !(!n.selected && l !== r || (st.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && ot.nodeName(n.parentNode, "optgroup"))) {
                            if (t = ot(n).val(), o) return t;
                            i.push(t)
                        }
                    return i
                },
                set: function(e, t) {
                    for (var n, s, r = e.options, o = ot.makeArray(t), i = r.length; i--;)
                        if (s = r[i], ot.inArray(ot.valHooks.option.get(s), o) >= 0) try {
                            s.selected = n = !0
                        } catch (a) {
                            s.scrollHeight
                        } else s.selected = !1;
                    return n || (e.selectedIndex = -1), r
                }
            }
        }
    }), ot.each(["radio", "checkbox"], function() {
        ot.valHooks[this] = {
            set: function(e, t) {
                return ot.isArray(t) ? e.checked = ot.inArray(ot(e).val(), t) >= 0 : void 0
            }
        }, st.checkOn || (ot.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    });
    var wn, An, En = ot.expr.attrHandle,
        Cn = /^(?:checked|selected)$/i,
        Tn = st.getSetAttribute,
        kn = st.input;
    ot.fn.extend({
        attr: function(e, t) {
            return Nt(this, ot.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                ot.removeAttr(this, e)
            })
        }
    }), ot.extend({
        attr: function(e, t, n) {
            var s, r, o = e.nodeType;
            return e && 3 !== o && 8 !== o && 2 !== o ? typeof e.getAttribute === At ? ot.prop(e, t, n) : (1 === o && ot.isXMLDoc(e) || (t = t.toLowerCase(), s = ot.attrHooks[t] || (ot.expr.match.bool.test(t) ? An : wn)), void 0 === n ? s && "get" in s && null !== (r = s.get(e, t)) ? r : (r = ot.find.attr(e, t), null == r ? void 0 : r) : null !== n ? s && "set" in s && void 0 !== (r = s.set(e, n, t)) ? r : (e.setAttribute(t, n + ""), n) : void ot.removeAttr(e, t)) : void 0
        },
        removeAttr: function(e, t) {
            var n, s, r = 0,
                o = t && t.match(bt);
            if (o && 1 === e.nodeType)
                for (; n = o[r++];) s = ot.propFix[n] || n, ot.expr.match.bool.test(n) ? kn && Tn || !Cn.test(n) ? e[s] = !1 : e[ot.camelCase("default-" + n)] = e[s] = !1 : ot.attr(e, n, ""), e.removeAttribute(Tn ? n : s)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!st.radioValue && "radio" === t && ot.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        }
    }), An = {
        set: function(e, t, n) {
            return t === !1 ? ot.removeAttr(e, n) : kn && Tn || !Cn.test(n) ? e.setAttribute(!Tn && ot.propFix[n] || n, n) : e[ot.camelCase("default-" + n)] = e[n] = !0, n
        }
    }, ot.each(ot.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var n = En[t] || ot.find.attr;
        En[t] = kn && Tn || !Cn.test(t) ? function(e, t, s) {
            var r, o;
            return s || (o = En[t], En[t] = r, r = null != n(e, t, s) ? t.toLowerCase() : null, En[t] = o), r
        } : function(e, t, n) {
            return n ? void 0 : e[ot.camelCase("default-" + t)] ? t.toLowerCase() : null
        }
    }), kn && Tn || (ot.attrHooks.value = {
        set: function(e, t, n) {
            return ot.nodeName(e, "input") ? void(e.defaultValue = t) : wn && wn.set(e, t, n)
        }
    }), Tn || (wn = {
        set: function(e, t, n) {
            var s = e.getAttributeNode(n);
            return s || e.setAttributeNode(s = e.ownerDocument.createAttribute(n)), s.value = t += "", "value" === n || t === e.getAttribute(n) ? t : void 0
        }
    }, En.id = En.name = En.coords = function(e, t, n) {
        var s;
        return n ? void 0 : (s = e.getAttributeNode(t)) && "" !== s.value ? s.value : null
    }, ot.valHooks.button = {
        get: function(e, t) {
            var n = e.getAttributeNode(t);
            return n && n.specified ? n.value : void 0
        },
        set: wn.set
    }, ot.attrHooks.contenteditable = {
        set: function(e, t, n) {
            wn.set(e, "" === t ? !1 : t, n)
        }
    }, ot.each(["width", "height"], function(e, t) {
        ot.attrHooks[t] = {
            set: function(e, n) {
                return "" === n ? (e.setAttribute(t, "auto"), n) : void 0
            }
        }
    })), st.style || (ot.attrHooks.style = {
        get: function(e) {
            return e.style.cssText || void 0
        },
        set: function(e, t) {
            return e.style.cssText = t + ""
        }
    });
    var zn = /^(?:input|select|textarea|button|object)$/i,
        Zn = /^(?:a|area)$/i;
    ot.fn.extend({
        prop: function(e, t) {
            return Nt(this, ot.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return e = ot.propFix[e] || e, this.each(function() {
                try {
                    this[e] = void 0, delete this[e]
                } catch (t) {}
            })
        }
    }), ot.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(e, t, n) {
            var s, r, o, i = e.nodeType;
            return e && 3 !== i && 8 !== i && 2 !== i ? (o = 1 !== i || !ot.isXMLDoc(e), o && (t = ot.propFix[t] || t, r = ot.propHooks[t]), void 0 !== n ? r && "set" in r && void 0 !== (s = r.set(e, n, t)) ? s : e[t] = n : r && "get" in r && null !== (s = r.get(e, t)) ? s : e[t]) : void 0
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = ot.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : zn.test(e.nodeName) || Zn.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        }
    }), st.hrefNormalized || ot.each(["href", "src"], function(e, t) {
        ot.propHooks[t] = {
            get: function(e) {
                return e.getAttribute(t, 4)
            }
        }
    }), st.optSelected || (ot.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
        }
    }), ot.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        ot.propFix[this.toLowerCase()] = this
    }), st.enctype || (ot.propFix.enctype = "encoding");
    var Nn = /[\t\r\n\f]/g;
    ot.fn.extend({
        addClass: function(e) {
            var t, n, s, r, o, i, a = 0,
                l = this.length,
                c = "string" == typeof e && e;
            if (ot.isFunction(e)) return this.each(function(t) {
                ot(this).addClass(e.call(this, t, this.className))
            });
            if (c)
                for (t = (e || "").match(bt) || []; l > a; a++)
                    if (n = this[a], s = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(Nn, " ") : " ")) {
                        for (o = 0; r = t[o++];) s.indexOf(" " + r + " ") < 0 && (s += r + " ");
                        i = ot.trim(s), n.className !== i && (n.className = i)
                    }
            return this
        },
        removeClass: function(e) {
            var t, n, s, r, o, i, a = 0,
                l = this.length,
                c = 0 === arguments.length || "string" == typeof e && e;
            if (ot.isFunction(e)) return this.each(function(t) {
                ot(this).removeClass(e.call(this, t, this.className))
            });
            if (c)
                for (t = (e || "").match(bt) || []; l > a; a++)
                    if (n = this[a], s = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(Nn, " ") : "")) {
                        for (o = 0; r = t[o++];)
                            for (; s.indexOf(" " + r + " ") >= 0;) s = s.replace(" " + r + " ", " ");
                        i = e ? ot.trim(s) : "", n.className !== i && (n.className = i)
                    }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e;
            return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : this.each(ot.isFunction(e) ? function(n) {
                ot(this).toggleClass(e.call(this, n, this.className, t), t)
            } : function() {
                if ("string" === n)
                    for (var t, s = 0, r = ot(this), o = e.match(bt) || []; t = o[s++];) r.hasClass(t) ? r.removeClass(t) : r.addClass(t);
                else(n === At || "boolean" === n) && (this.className && ot._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : ot._data(this, "__className__") || "")
            })
        },
        hasClass: function(e) {
            for (var t = " " + e + " ", n = 0, s = this.length; s > n; n++)
                if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(Nn, " ").indexOf(t) >= 0) return !0;
            return !1
        }
    }), ot.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
        ot.fn[t] = function(e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }), ot.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        },
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, s) {
            return this.on(t, e, n, s)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    });
    var $n = ot.now(),
        Dn = /\?/,
        Sn = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    ot.parseJSON = function(t) {
        if (e.JSON && e.JSON.parse) return e.JSON.parse(t + "");
        var n, s = null,
            r = ot.trim(t + "");
        return r && !ot.trim(r.replace(Sn, function(e, t, r, o) {
            return n && t && (s = 0), 0 === s ? e : (n = r || t, s += !o - !r, "")
        })) ? Function("return " + r)() : ot.error("Invalid JSON: " + t)
    }, ot.parseXML = function(t) {
        var n, s;
        if (!t || "string" != typeof t) return null;
        try {
            e.DOMParser ? (s = new DOMParser, n = s.parseFromString(t, "text/xml")) : (n = new ActiveXObject("Microsoft.XMLDOM"), n.async = "false", n.loadXML(t))
        } catch (r) {
            n = void 0
        }
        return n && n.documentElement && !n.getElementsByTagName("parsererror").length || ot.error("Invalid XML: " + t), n
    };
    var Ln, On, Fn = /#.*$/,
        In = /([?&])_=[^&]*/,
        jn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        Mn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        qn = /^(?:GET|HEAD)$/,
        Hn = /^\/\//,
        Rn = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        Bn = {},
        Pn = {},
        Un = "*/".concat("*");
    try {
        On = location.href
    } catch (Wn) {
        On = gt.createElement("a"), On.href = "", On = On.href
    }
    Ln = Rn.exec(On.toLowerCase()) || [], ot.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: On,
            type: "GET",
            isLocal: Mn.test(Ln[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Un,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": ot.parseJSON,
                "text xml": ot.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? R(R(e, ot.ajaxSettings), t) : R(ot.ajaxSettings, e)
        },
        ajaxPrefilter: q(Bn),
        ajaxTransport: q(Pn),
        ajax: function(e, t) {
            function n(e, t, n, s) {
                var r, h, _, y, b, w = t;
                2 !== v && (v = 2, a && clearTimeout(a), c = void 0, i = s || "", x.readyState = e > 0 ? 4 : 0, r = e >= 200 && 300 > e || 304 === e, n && (y = B(u, x, n)), y = P(u, y, x, r), r ? (u.ifModified && (b = x.getResponseHeader("Last-Modified"), b && (ot.lastModified[o] = b), b = x.getResponseHeader("etag"), b && (ot.etag[o] = b)), 204 === e || "HEAD" === u.type ? w = "nocontent" : 304 === e ? w = "notmodified" : (w = y.state, h = y.data, _ = y.error, r = !_)) : (_ = w, (e || !w) && (w = "error", 0 > e && (e = 0))), x.status = e, x.statusText = (t || w) + "", r ? f.resolveWith(p, [h, w, x]) : f.rejectWith(p, [x, w, _]), x.statusCode(m), m = void 0, l && d.trigger(r ? "ajaxSuccess" : "ajaxError", [x, u, r ? h : _]), g.fireWith(p, [x, w]), l && (d.trigger("ajaxComplete", [x, u]), --ot.active || ot.event.trigger("ajaxStop")))
            }
            "object" == typeof e && (t = e, e = void 0), t = t || {};
            var s, r, o, i, a, l, c, h, u = ot.ajaxSetup({}, t),
                p = u.context || u,
                d = u.context && (p.nodeType || p.jquery) ? ot(p) : ot.event,
                f = ot.Deferred(),
                g = ot.Callbacks("once memory"),
                m = u.statusCode || {},
                _ = {},
                y = {},
                v = 0,
                b = "canceled",
                x = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (2 === v) {
                            if (!h)
                                for (h = {}; t = jn.exec(i);) h[t[1].toLowerCase()] = t[2];
                            t = h[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function() {
                        return 2 === v ? i : null
                    },
                    setRequestHeader: function(e, t) {
                        var n = e.toLowerCase();
                        return v || (e = y[n] = y[n] || e, _[e] = t), this
                    },
                    overrideMimeType: function(e) {
                        return v || (u.mimeType = e), this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e)
                            if (2 > v)
                                for (t in e) m[t] = [m[t], e[t]];
                            else x.always(e[x.status]);
                        return this
                    },
                    abort: function(e) {
                        var t = e || b;
                        return c && c.abort(t), n(0, t), this
                    }
                };
            if (f.promise(x).complete = g.add, x.success = x.done, x.error = x.fail, u.url = ((e || u.url || On) + "").replace(Fn, "").replace(Hn, Ln[1] + "//"), u.type = t.method || t.type || u.method || u.type, u.dataTypes = ot.trim(u.dataType || "*").toLowerCase().match(bt) || [""], null == u.crossDomain && (s = Rn.exec(u.url.toLowerCase()), u.crossDomain = !(!s || s[1] === Ln[1] && s[2] === Ln[2] && (s[3] || ("http:" === s[1] ? "80" : "443")) === (Ln[3] || ("http:" === Ln[1] ? "80" : "443")))), u.data && u.processData && "string" != typeof u.data && (u.data = ot.param(u.data, u.traditional)), H(Bn, u, t, x), 2 === v) return x;
            l = u.global, l && 0 === ot.active++ && ot.event.trigger("ajaxStart"), u.type = u.type.toUpperCase(), u.hasContent = !qn.test(u.type), o = u.url, u.hasContent || (u.data && (o = u.url += (Dn.test(o) ? "&" : "?") + u.data, delete u.data), u.cache === !1 && (u.url = In.test(o) ? o.replace(In, "$1_=" + $n++) : o + (Dn.test(o) ? "&" : "?") + "_=" + $n++)), u.ifModified && (ot.lastModified[o] && x.setRequestHeader("If-Modified-Since", ot.lastModified[o]), ot.etag[o] && x.setRequestHeader("If-None-Match", ot.etag[o])), (u.data && u.hasContent && u.contentType !== !1 || t.contentType) && x.setRequestHeader("Content-Type", u.contentType), x.setRequestHeader("Accept", u.dataTypes[0] && u.accepts[u.dataTypes[0]] ? u.accepts[u.dataTypes[0]] + ("*" !== u.dataTypes[0] ? ", " + Un + "; q=0.01" : "") : u.accepts["*"]);
            for (r in u.headers) x.setRequestHeader(r, u.headers[r]);
            if (u.beforeSend && (u.beforeSend.call(p, x, u) === !1 || 2 === v)) return x.abort();
            b = "abort";
            for (r in {
                success: 1,
                error: 1,
                complete: 1
            }) x[r](u[r]);
            if (c = H(Pn, u, t, x)) {
                x.readyState = 1, l && d.trigger("ajaxSend", [x, u]), u.async && u.timeout > 0 && (a = setTimeout(function() {
                    x.abort("timeout")
                }, u.timeout));
                try {
                    v = 1, c.send(_, n)
                } catch (w) {
                    if (!(2 > v)) throw w;
                    n(-1, w)
                }
            } else n(-1, "No Transport");
            return x
        },
        getJSON: function(e, t, n) {
            return ot.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return ot.get(e, void 0, t, "script")
        }
    }), ot.each(["get", "post"], function(e, t) {
        ot[t] = function(e, n, s, r) {
            return ot.isFunction(n) && (r = r || s, s = n, n = void 0), ot.ajax({
                url: e,
                type: t,
                dataType: r,
                data: n,
                success: s
            })
        }
    }), ot.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        ot.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), ot._evalUrl = function(e) {
        return ot.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
        })
    }, ot.fn.extend({
        wrapAll: function(e) {
            if (ot.isFunction(e)) return this.each(function(t) {
                ot(this).wrapAll(e.call(this, t))
            });
            if (this[0]) {
                var t = ot(e, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                    for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
                    return e
                }).append(this)
            }
            return this
        },
        wrapInner: function(e) {
            return this.each(ot.isFunction(e) ? function(t) {
                ot(this).wrapInner(e.call(this, t))
            } : function() {
                var t = ot(this),
                    n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function(e) {
            var t = ot.isFunction(e);
            return this.each(function(n) {
                ot(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                ot.nodeName(this, "body") || ot(this).replaceWith(this.childNodes)
            }).end()
        }
    }), ot.expr.filters.hidden = function(e) {
        return e.offsetWidth <= 0 && e.offsetHeight <= 0 || !st.reliableHiddenOffsets() && "none" === (e.style && e.style.display || ot.css(e, "display"))
    }, ot.expr.filters.visible = function(e) {
        return !ot.expr.filters.hidden(e)
    };
    var Xn = /%20/g,
        Gn = /\[\]$/,
        Yn = /\r?\n/g,
        Qn = /^(?:submit|button|image|reset|file)$/i,
        Vn = /^(?:input|select|textarea|keygen)/i;
    ot.param = function(e, t) {
        var n, s = [],
            r = function(e, t) {
                t = ot.isFunction(t) ? t() : null == t ? "" : t, s[s.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
            };
        if (void 0 === t && (t = ot.ajaxSettings && ot.ajaxSettings.traditional), ot.isArray(e) || e.jquery && !ot.isPlainObject(e)) ot.each(e, function() {
            r(this.name, this.value)
        });
        else
            for (n in e) U(n, e[n], t, r);
        return s.join("&").replace(Xn, "+")
    }, ot.fn.extend({
        serialize: function() {
            return ot.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = ot.prop(this, "elements");
                return e ? ot.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !ot(this).is(":disabled") && Vn.test(this.nodeName) && !Qn.test(e) && (this.checked || !$t.test(e))
            }).map(function(e, t) {
                var n = ot(this).val();
                return null == n ? null : ot.isArray(n) ? ot.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(Yn, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(Yn, "\r\n")
                }
            }).get()
        }
    }), ot.ajaxSettings.xhr = void 0 !== e.ActiveXObject ? function() {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && W() || X()
    } : W;
    var Kn = 0,
        Jn = {},
        es = ot.ajaxSettings.xhr();
    e.ActiveXObject && ot(e).on("unload", function() {
        for (var e in Jn) Jn[e](void 0, !0)
    }), st.cors = !!es && "withCredentials" in es, es = st.ajax = !!es, es && ot.ajaxTransport(function(e) {
        if (!e.crossDomain || st.cors) {
            var t;
            return {
                send: function(n, s) {
                    var r, o = e.xhr(),
                        i = ++Kn;
                    if (o.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
                        for (r in e.xhrFields) o[r] = e.xhrFields[r];
                    e.mimeType && o.overrideMimeType && o.overrideMimeType(e.mimeType), e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
                    for (r in n) void 0 !== n[r] && o.setRequestHeader(r, n[r] + "");
                    o.send(e.hasContent && e.data || null), t = function(n, r) {
                        var a, l, c;
                        if (t && (r || 4 === o.readyState))
                            if (delete Jn[i], t = void 0, o.onreadystatechange = ot.noop, r) 4 !== o.readyState && o.abort();
                            else {
                                c = {}, a = o.status, "string" == typeof o.responseText && (c.text = o.responseText);
                                try {
                                    l = o.statusText
                                } catch (h) {
                                    l = ""
                                }
                                a || !e.isLocal || e.crossDomain ? 1223 === a && (a = 204) : a = c.text ? 200 : 404
                            }
                        c && s(a, l, c, o.getAllResponseHeaders())
                    }, e.async ? 4 === o.readyState ? setTimeout(t) : o.onreadystatechange = Jn[i] = t : t()
                },
                abort: function() {
                    t && t(void 0, !0)
                }
            }
        }
    }), ot.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(e) {
                return ot.globalEval(e), e
            }
        }
    }), ot.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    }), ot.ajaxTransport("script", function(e) {
        if (e.crossDomain) {
            var t, n = gt.head || ot("head")[0] || gt.documentElement;
            return {
                send: function(s, r) {
                    t = gt.createElement("script"), t.async = !0, e.scriptCharset && (t.charset = e.scriptCharset), t.src = e.url, t.onload = t.onreadystatechange = function(e, n) {
                        (n || !t.readyState || /loaded|complete/.test(t.readyState)) && (t.onload = t.onreadystatechange = null, t.parentNode && t.parentNode.removeChild(t), t = null, n || r(200, "success"))
                    }, n.insertBefore(t, n.firstChild)
                },
                abort: function() {
                    t && t.onload(void 0, !0)
                }
            }
        }
    });
    var ts = [],
        ns = /(=)\?(?=&|$)|\?\?/;
    ot.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = ts.pop() || ot.expando + "_" + $n++;
            return this[e] = !0, e
        }
    }), ot.ajaxPrefilter("json jsonp", function(t, n, s) {
        var r, o, i, a = t.jsonp !== !1 && (ns.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && ns.test(t.data) && "data");
        return a || "jsonp" === t.dataTypes[0] ? (r = t.jsonpCallback = ot.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, a ? t[a] = t[a].replace(ns, "$1" + r) : t.jsonp !== !1 && (t.url += (Dn.test(t.url) ? "&" : "?") + t.jsonp + "=" + r), t.converters["script json"] = function() {
            return i || ot.error(r + " was not called"), i[0]
        }, t.dataTypes[0] = "json", o = e[r], e[r] = function() {
            i = arguments
        }, s.always(function() {
            e[r] = o, t[r] && (t.jsonpCallback = n.jsonpCallback, ts.push(r)), i && ot.isFunction(o) && o(i[0]), i = o = void 0
        }), "script") : void 0
    }), ot.parseHTML = function(e, t, n) {
        if (!e || "string" != typeof e) return null;
        "boolean" == typeof t && (n = t, t = !1), t = t || gt;
        var s = pt.exec(e),
            r = !n && [];
        return s ? [t.createElement(s[1])] : (s = ot.buildFragment([e], t, r), r && r.length && ot(r).remove(), ot.merge([], s.childNodes))
    };
    var ss = ot.fn.load;
    ot.fn.load = function(e, t, n) {
        if ("string" != typeof e && ss) return ss.apply(this, arguments);
        var s, r, o, i = this,
            a = e.indexOf(" ");
        return a >= 0 && (s = ot.trim(e.slice(a, e.length)), e = e.slice(0, a)), ot.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (o = "POST"), i.length > 0 && ot.ajax({
            url: e,
            type: o,
            dataType: "html",
            data: t
        }).done(function(e) {
            r = arguments, i.html(s ? ot("<div>").append(ot.parseHTML(e)).find(s) : e)
        }).complete(n && function(e, t) {
            i.each(n, r || [e.responseText, t, e])
        }), this
    }, ot.expr.filters.animated = function(e) {
        return ot.grep(ot.timers, function(t) {
            return e === t.elem
        }).length
    };
    var rs = e.document.documentElement;
    ot.offset = {
        setOffset: function(e, t, n) {
            var s, r, o, i, a, l, c, h = ot.css(e, "position"),
                u = ot(e),
                p = {};
            "static" === h && (e.style.position = "relative"), a = u.offset(), o = ot.css(e, "top"), l = ot.css(e, "left"), c = ("absolute" === h || "fixed" === h) && ot.inArray("auto", [o, l]) > -1, c ? (s = u.position(), i = s.top, r = s.left) : (i = parseFloat(o) || 0, r = parseFloat(l) || 0), ot.isFunction(t) && (t = t.call(e, n, a)), null != t.top && (p.top = t.top - a.top + i), null != t.left && (p.left = t.left - a.left + r), "using" in t ? t.using.call(e, p) : u.css(p)
        }
    }, ot.fn.extend({
        offset: function(e) {
            if (arguments.length) return void 0 === e ? this : this.each(function(t) {
                ot.offset.setOffset(this, e, t)
            });
            var t, n, s = {
                    top: 0,
                    left: 0
                },
                r = this[0],
                o = r && r.ownerDocument;
            return o ? (t = o.documentElement, ot.contains(t, r) ? (typeof r.getBoundingClientRect !== At && (s = r.getBoundingClientRect()), n = G(o), {
                top: s.top + (n.pageYOffset || t.scrollTop) - (t.clientTop || 0),
                left: s.left + (n.pageXOffset || t.scrollLeft) - (t.clientLeft || 0)
            }) : s) : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n = {
                        top: 0,
                        left: 0
                    },
                    s = this[0];
                return "fixed" === ot.css(s, "position") ? t = s.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), ot.nodeName(e[0], "html") || (n = e.offset()), n.top += ot.css(e[0], "borderTopWidth", !0), n.left += ot.css(e[0], "borderLeftWidth", !0)), {
                    top: t.top - n.top - ot.css(s, "marginTop", !0),
                    left: t.left - n.left - ot.css(s, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent || rs; e && !ot.nodeName(e, "html") && "static" === ot.css(e, "position");) e = e.offsetParent;
                return e || rs
            })
        }
    }), ot.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, t) {
        var n = /Y/.test(t);
        ot.fn[e] = function(s) {
            return Nt(this, function(e, s, r) {
                var o = G(e);
                return void 0 === r ? o ? t in o ? o[t] : o.document.documentElement[s] : e[s] : void(o ? o.scrollTo(n ? ot(o).scrollLeft() : r, n ? r : ot(o).scrollTop()) : e[s] = r)
            }, e, s, arguments.length, null)
        }
    }), ot.each(["top", "left"], function(e, t) {
        ot.cssHooks[t] = T(st.pixelPosition, function(e, n) {
            return n ? (n = sn(e, t), tn.test(n) ? ot(e).position()[t] + "px" : n) : void 0
        })
    }), ot.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        ot.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(n, s) {
            ot.fn[s] = function(s, r) {
                var o = arguments.length && (n || "boolean" != typeof s),
                    i = n || (s === !0 || r === !0 ? "margin" : "border");
                return Nt(this, function(t, n, s) {
                    var r;
                    return ot.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (r = t.documentElement, Math.max(t.body["scroll" + e], r["scroll" + e], t.body["offset" + e], r["offset" + e], r["client" + e])) : void 0 === s ? ot.css(t, n, i) : ot.style(t, n, s, i)
                }, t, o ? s : void 0, o, null)
            }
        })
    }), ot.fn.size = function() {
        return this.length
    }, ot.fn.andSelf = ot.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
        return ot
    });
    var os = e.jQuery,
        is = e.$;
    return ot.noConflict = function(t) {
        return e.$ === ot && (e.$ = is), t && e.jQuery === ot && (e.jQuery = os), ot
    }, typeof t === At && (e.jQuery = e.$ = ot), ot
}), function() {
    var e = {};
    $.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function(t, n) {
        e[n] = function(e) {
            return Math.pow(e, t + 2)
        }
    }), $.extend(e, {
        Sine: function(e) {
            return 1 - Math.cos(e * Math.PI / 2)
        },
        Circ: function(e) {
            return 1 - Math.sqrt(1 - e * e)
        },
        Elastic: function(e) {
            return 0 === e || 1 === e ? e : -Math.pow(2, 8 * (e - 1)) * Math.sin((80 * (e - 1) - 7.5) * Math.PI / 15)
        },
        Back: function(e) {
            return e * e * (3 * e - 2)
        },
        Bounce: function(e) {
            for (var t, n = 4; e < ((t = Math.pow(2, --n)) - 1) / 11;);
            return 1 / Math.pow(4, 3 - n) - 7.5625 * Math.pow((3 * t - 2) / 22 - e, 2)
        }
    }), $.each(e, function(e, t) {
        $.easing["easeIn" + e] = t, $.easing["easeOut" + e] = function(e) {
            return 1 - t(1 - e)
        }, $.easing["easeInOut" + e] = function(e) {
            return .5 > e ? t(2 * e) / 2 : 1 - t(-2 * e + 2) / 2
        }
    })
}(), "undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery"); + function(e) {
    "use strict";

    function t() {
        var e = document.createElement("bootstrap"),
            t = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd otransitionend",
                transition: "transitionend"
            };
        for (var n in t)
            if (void 0 !== e.style[n]) return {
                end: t[n]
            };
        return !1
    }
    e.fn.emulateTransitionEnd = function(t) {
        var n = !1,
            s = this;
        e(this).one(e.support.transition.end, function() {
            n = !0
        });
        var r = function() {
            n || e(s).trigger(e.support.transition.end)
        };
        return setTimeout(r, t), this
    }, e(function() {
        e.support.transition = t()
    })
}(jQuery), + function(e) {
    "use strict";
    var t = '[data-dismiss="alert"]',
        n = function(n) {
            e(n).on("click", t, this.close)
        };
    n.prototype.close = function(t) {
        function n() {
            o.trigger("closed.bs.alert").remove()
        }
        var s = e(this),
            r = s.attr("data-target");
        r || (r = s.attr("href"), r = r && r.replace(/.*(?=#[^\s]*$)/, ""));
        var o = e(r);
        t && t.preventDefault(), o.length || (o = s.hasClass("alert") ? s : s.parent()), o.trigger(t = e.Event("close.bs.alert")), t.isDefaultPrevented() || (o.removeClass("in"), e.support.transition && o.hasClass("fade") ? o.one(e.support.transition.end, n).emulateTransitionEnd(150) : n())
    };
    var s = e.fn.alert;
    e.fn.alert = function(t) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.alert");
            r || s.data("bs.alert", r = new n(this)), "string" == typeof t && r[t].call(s)
        })
    }, e.fn.alert.Constructor = n, e.fn.alert.noConflict = function() {
        return e.fn.alert = s, this
    }, e(document).on("click.bs.alert.data-api", t, n.prototype.close)
}(jQuery), + function(e) {
    "use strict";
    var t = function(n, s) {
        this.$element = e(n), this.options = e.extend({}, t.DEFAULTS, s), this.isLoading = !1
    };
    t.DEFAULTS = {
        loadingText: "loading..."
    }, t.prototype.setState = function(t) {
        var n = "disabled",
            s = this.$element,
            r = s.is("input") ? "val" : "html",
            o = s.data();
        t += "Text", o.resetText || s.data("resetText", s[r]()), s[r](o[t] || this.options[t]), setTimeout(e.proxy(function() {
            "loadingText" == t ? (this.isLoading = !0, s.addClass(n).attr(n, n)) : this.isLoading && (this.isLoading = !1, s.removeClass(n).removeAttr(n))
        }, this), 0)
    }, t.prototype.toggle = function() {
        var e = !0,
            t = this.$element.closest('[data-toggle="buttons"]');
        if (t.length) {
            var n = this.$element.find("input");
            "radio" == n.prop("type") && (n.prop("checked") && this.$element.hasClass("active") ? e = !1 : t.find(".active").removeClass("active")), e && n.prop("checked", !this.$element.hasClass("active")).trigger("change")
        }
        e && this.$element.toggleClass("active")
    };
    var n = e.fn.button;
    e.fn.button = function(n) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.button"),
                o = "object" == typeof n && n;
            r || s.data("bs.button", r = new t(this, o)), "toggle" == n ? r.toggle() : n && r.setState(n)
        })
    }, e.fn.button.Constructor = t, e.fn.button.noConflict = function() {
        return e.fn.button = n, this
    }, e(document).on("click.bs.button.data-api", "[data-toggle^=button]", function(t) {
        var n = e(t.target);
        n.hasClass("btn") || (n = n.closest(".btn")), n.button("toggle"), t.preventDefault()
    })
}(jQuery), + function(e) {
    "use strict";
    var t = function(t, n) {
        this.$element = e(t), this.$indicators = this.$element.find(".carousel-indicators"), this.options = n, this.paused = this.sliding = this.interval = this.$active = this.$items = null, "hover" == this.options.pause && this.$element.on("mouseenter", e.proxy(this.pause, this)).on("mouseleave", e.proxy(this.cycle, this))
    };
    t.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: !0
    }, t.prototype.cycle = function(t) {
        return t || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(e.proxy(this.next, this), this.options.interval)), this
    }, t.prototype.getActiveIndex = function() {
        return this.$active = this.$element.find(".item.active"), this.$items = this.$active.parent().children(), this.$items.index(this.$active)
    }, t.prototype.to = function(t) {
        var n = this,
            s = this.getActiveIndex();
        return t > this.$items.length - 1 || 0 > t ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel", function() {
            n.to(t)
        }) : s == t ? this.pause().cycle() : this.slide(t > s ? "next" : "prev", e(this.$items[t]))
    }, t.prototype.pause = function(t) {
        return t || (this.paused = !0), this.$element.find(".next, .prev").length && e.support.transition && (this.$element.trigger(e.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
    }, t.prototype.next = function() {
        return this.sliding ? void 0 : this.slide("next")
    }, t.prototype.prev = function() {
        return this.sliding ? void 0 : this.slide("prev")
    }, t.prototype.slide = function(t, n) {
        var s = this.$element.find(".item.active"),
            r = n || s[t](),
            o = this.interval,
            i = "next" == t ? "left" : "right",
            a = "next" == t ? "first" : "last",
            l = this;
        if (!r.length) {
            if (!this.options.wrap) return;
            r = this.$element.find(".item")[a]()
        }
        if (r.hasClass("active")) return this.sliding = !1;
        var c = e.Event("slide.bs.carousel", {
            relatedTarget: r[0],
            direction: i
        });
        return this.$element.trigger(c), c.isDefaultPrevented() ? void 0 : (this.sliding = !0, o && this.pause(), this.$indicators.length && (this.$indicators.find(".active").removeClass("active"), this.$element.one("slid.bs.carousel", function() {
            var t = e(l.$indicators.children()[l.getActiveIndex()]);
            t && t.addClass("active")
        })), e.support.transition && this.$element.hasClass("slide") ? (r.addClass(t), r[0].offsetWidth, s.addClass(i), r.addClass(i), s.one(e.support.transition.end, function() {
            r.removeClass([t, i].join(" ")).addClass("active"), s.removeClass(["active", i].join(" ")), l.sliding = !1, setTimeout(function() {
                l.$element.trigger("slid.bs.carousel")
            }, 0)
        }).emulateTransitionEnd(1e3 * s.css("transition-duration").slice(0, -1))) : (s.removeClass("active"), r.addClass("active"), this.sliding = !1, this.$element.trigger("slid.bs.carousel")), o && this.cycle(), this)
    };
    var n = e.fn.carousel;
    e.fn.carousel = function(n) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.carousel"),
                o = e.extend({}, t.DEFAULTS, s.data(), "object" == typeof n && n),
                i = "string" == typeof n ? n : o.slide;
            r || s.data("bs.carousel", r = new t(this, o)), "number" == typeof n ? r.to(n) : i ? r[i]() : o.interval && r.pause().cycle()
        })
    }, e.fn.carousel.Constructor = t, e.fn.carousel.noConflict = function() {
        return e.fn.carousel = n, this
    }, e(document).on("click.bs.carousel.data-api", "[data-slide], [data-slide-to]", function(t) {
        var n, s = e(this),
            r = e(s.attr("data-target") || (n = s.attr("href")) && n.replace(/.*(?=#[^\s]+$)/, "")),
            o = e.extend({}, r.data(), s.data()),
            i = s.attr("data-slide-to");
        i && (o.interval = !1), r.carousel(o), (i = s.attr("data-slide-to")) && r.data("bs.carousel").to(i), t.preventDefault()
    }), e(window).on("load", function() {
        e('[data-ride="carousel"]').each(function() {
            var t = e(this);
            t.carousel(t.data())
        })
    })
}(jQuery), + function(e) {
    "use strict";
    var t = function(n, s) {
        this.$element = e(n), this.options = e.extend({}, t.DEFAULTS, s), this.transitioning = null, this.options.parent && (this.$parent = e(this.options.parent)), this.options.toggle && this.toggle()
    };
    t.DEFAULTS = {
        toggle: !0
    }, t.prototype.dimension = function() {
        var e = this.$element.hasClass("width");
        return e ? "width" : "height"
    }, t.prototype.show = function() {
        if (!this.transitioning && !this.$element.hasClass("in")) {
            var t = e.Event("show.bs.collapse");
            if (this.$element.trigger(t), !t.isDefaultPrevented()) {
                var n = this.$parent && this.$parent.find("> .panel > .in");
                if (n && n.length) {
                    var s = n.data("bs.collapse");
                    if (s && s.transitioning) return;
                    n.collapse("hide"), s || n.data("bs.collapse", null)
                }
                var r = this.dimension();
                this.$element.removeClass("collapse").addClass("collapsing")[r](0), this.transitioning = 1;
                var o = function() {
                    this.$element.removeClass("collapsing").addClass("collapse in")[r]("auto"), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
                };
                if (!e.support.transition) return o.call(this);
                var i = e.camelCase(["scroll", r].join("-"));
                this.$element.one(e.support.transition.end, e.proxy(o, this)).emulateTransitionEnd(350)[r](this.$element[0][i])
            }
        }
    }, t.prototype.hide = function() {
        if (!this.transitioning && this.$element.hasClass("in")) {
            var t = e.Event("hide.bs.collapse");
            if (this.$element.trigger(t), !t.isDefaultPrevented()) {
                var n = this.dimension();
                this.$element[n](this.$element[n]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"), this.transitioning = 1;
                var s = function() {
                    this.transitioning = 0, this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")
                };
                return e.support.transition ? void this.$element[n](0).one(e.support.transition.end, e.proxy(s, this)).emulateTransitionEnd(350) : s.call(this)
            }
        }
    }, t.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    };
    var n = e.fn.collapse;
    e.fn.collapse = function(n) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.collapse"),
                o = e.extend({}, t.DEFAULTS, s.data(), "object" == typeof n && n);
            !r && o.toggle && "show" == n && (n = !n), r || s.data("bs.collapse", r = new t(this, o)), "string" == typeof n && r[n]()
        })
    }, e.fn.collapse.Constructor = t, e.fn.collapse.noConflict = function() {
        return e.fn.collapse = n, this
    }, e(document).on("click.bs.collapse.data-api", "[data-toggle=collapse]", function(t) {
        var n, s = e(this),
            r = s.attr("data-target") || t.preventDefault() || (n = s.attr("href")) && n.replace(/.*(?=#[^\s]+$)/, ""),
            o = e(r),
            i = o.data("bs.collapse"),
            a = i ? "toggle" : s.data(),
            l = s.attr("data-parent"),
            c = l && e(l);
        i && i.transitioning || (c && c.find('[data-toggle=collapse][data-parent="' + l + '"]').not(s).addClass("collapsed"), s[o.hasClass("in") ? "addClass" : "removeClass"]("collapsed")), o.collapse(a)
    })
}(jQuery), + function(e) {
    "use strict";

    function t(t) {
        e(s).remove(), e(r).each(function() {
            var s = n(e(this)),
                r = {
                    relatedTarget: this
                };
            s.hasClass("open") && (s.trigger(t = e.Event("hide.bs.dropdown", r)), t.isDefaultPrevented() || s.removeClass("open").trigger("hidden.bs.dropdown", r))
        })
    }

    function n(t) {
        var n = t.attr("data-target");
        n || (n = t.attr("href"), n = n && /#[A-Za-z]/.test(n) && n.replace(/.*(?=#[^\s]*$)/, ""));
        var s = n && e(n);
        return s && s.length ? s : t.parent()
    }
    var s = ".dropdown-backdrop",
        r = "[data-toggle=dropdown]",
        o = function(t) {
            e(t).on("click.bs.dropdown", this.toggle)
        };
    o.prototype.toggle = function(s) {
        var r = e(this);
        if (!r.is(".disabled, :disabled")) {
            var o = n(r),
                i = o.hasClass("open");
            if (t(), !i) {
                "ontouchstart" in document.documentElement && !o.closest(".navbar-nav").length && e('<div class="dropdown-backdrop"/>').insertAfter(e(this)).on("click", t);
                var a = {
                    relatedTarget: this
                };
                if (o.trigger(s = e.Event("show.bs.dropdown", a)), s.isDefaultPrevented()) return;
                o.toggleClass("open").trigger("shown.bs.dropdown", a), r.focus()
            }
            return !1
        }
    }, o.prototype.keydown = function(t) {
        if (/(38|40|27)/.test(t.keyCode)) {
            var s = e(this);
            if (t.preventDefault(), t.stopPropagation(), !s.is(".disabled, :disabled")) {
                var o = n(s),
                    i = o.hasClass("open");
                if (!i || i && 27 == t.keyCode) return 27 == t.which && o.find(r).focus(), s.click();
                var a = " li:not(.divider):visible a",
                    l = o.find("[role=menu]" + a + ", [role=listbox]" + a);
                if (l.length) {
                    var c = l.index(l.filter(":focus"));
                    38 == t.keyCode && c > 0 && c--, 40 == t.keyCode && c < l.length - 1 && c++, ~c || (c = 0), l.eq(c).focus()
                }
            }
        }
    };
    var i = e.fn.dropdown;
    e.fn.dropdown = function(t) {
        return this.each(function() {
            var n = e(this),
                s = n.data("bs.dropdown");
            s || n.data("bs.dropdown", s = new o(this)), "string" == typeof t && s[t].call(n)
        })
    }, e.fn.dropdown.Constructor = o, e.fn.dropdown.noConflict = function() {
        return e.fn.dropdown = i, this
    }, e(document).on("click.bs.dropdown.data-api", t).on("click.bs.dropdown.data-api", ".dropdown form", function(e) {
        e.stopPropagation()
    }).on("click.bs.dropdown.data-api", r, o.prototype.toggle).on("keydown.bs.dropdown.data-api", r + ", [role=menu], [role=listbox]", o.prototype.keydown)
}(jQuery), + function(e) {
    "use strict";
    var t = function(t, n) {
        this.options = n, this.$element = e(t), this.$backdrop = this.isShown = null, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, e.proxy(function() {
            this.$element.trigger("loaded.bs.modal")
        }, this))
    };
    t.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    }, t.prototype.toggle = function(e) {
        return this[this.isShown ? "hide" : "show"](e)
    }, t.prototype.show = function(t) {
        var n = this,
            s = e.Event("show.bs.modal", {
                relatedTarget: t
            });
        this.$element.trigger(s), this.isShown || s.isDefaultPrevented() || (this.isShown = !0, this.escape(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', e.proxy(this.hide, this)), this.backdrop(function() {
            var s = e.support.transition && n.$element.hasClass("fade");
            n.$element.parent().length || n.$element.appendTo(document.body), n.$element.show().scrollTop(0), s && n.$element[0].offsetWidth, n.$element.addClass("in").attr("aria-hidden", !1), n.enforceFocus();
            var r = e.Event("shown.bs.modal", {
                relatedTarget: t
            });
            s ? n.$element.find(".modal-dialog").one(e.support.transition.end, function() {
                n.$element.focus().trigger(r)
            }).emulateTransitionEnd(300) : n.$element.focus().trigger(r)
        }))
    }, t.prototype.hide = function(t) {
        t && t.preventDefault(), t = e.Event("hide.bs.modal"), this.$element.trigger(t), this.isShown && !t.isDefaultPrevented() && (this.isShown = !1, this.escape(), e(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.bs.modal"), e.support.transition && this.$element.hasClass("fade") ? this.$element.one(e.support.transition.end, e.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal())
    }, t.prototype.enforceFocus = function() {
        e(document).off("focusin.bs.modal").on("focusin.bs.modal", e.proxy(function(e) {
            this.$element[0] === e.target || this.$element.has(e.target).length || this.$element.focus()
        }, this))
    }, t.prototype.escape = function() {
        this.isShown && this.options.keyboard ? this.$element.on("keyup.dismiss.bs.modal", e.proxy(function(e) {
            27 == e.which && this.hide()
        }, this)) : this.isShown || this.$element.off("keyup.dismiss.bs.modal")
    }, t.prototype.hideModal = function() {
        var e = this;
        this.$element.hide(), this.backdrop(function() {
            e.removeBackdrop(), e.$element.trigger("hidden.bs.modal")
        })
    }, t.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
    }, t.prototype.backdrop = function(t) {
        var n = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var s = e.support.transition && n;
            if (this.$backdrop = e('<div class="modal-backdrop ' + n + '" />').appendTo(document.body), this.$element.on("click.dismiss.bs.modal", e.proxy(function(e) {
                e.target === e.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this))
            }, this)), s && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !t) return;
            s ? this.$backdrop.one(e.support.transition.end, t).emulateTransitionEnd(150) : t()
        } else !this.isShown && this.$backdrop ? (this.$backdrop.removeClass("in"), e.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one(e.support.transition.end, t).emulateTransitionEnd(150) : t()) : t && t()
    };
    var n = e.fn.modal;
    e.fn.modal = function(n, s) {
        return this.each(function() {
            var r = e(this),
                o = r.data("bs.modal"),
                i = e.extend({}, t.DEFAULTS, r.data(), "object" == typeof n && n);
            o || r.data("bs.modal", o = new t(this, i)), "string" == typeof n ? o[n](s) : i.show && o.show(s)
        })
    }, e.fn.modal.Constructor = t, e.fn.modal.noConflict = function() {
        return e.fn.modal = n, this
    }, e(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(t) {
        var n = e(this),
            s = n.attr("href"),
            r = e(n.attr("data-target") || s && s.replace(/.*(?=#[^\s]+$)/, "")),
            o = r.data("bs.modal") ? "toggle" : e.extend({
                remote: !/#/.test(s) && s
            }, r.data(), n.data());
        n.is("a") && t.preventDefault(), r.modal(o, this).one("hide", function() {
            n.is(":visible") && n.focus()
        })
    }), e(document).on("show.bs.modal", ".modal", function() {
        e(document.body).addClass("modal-open")
    }).on("hidden.bs.modal", ".modal", function() {
        e(document.body).removeClass("modal-open")
    })
}(jQuery), + function(e) {
    "use strict";
    var t = function(e, t) {
        this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null, this.init("tooltip", e, t)
    };
    t.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1
    }, t.prototype.init = function(t, n, s) {
        this.enabled = !0, this.type = t, this.$element = e(n), this.options = this.getOptions(s);
        for (var r = this.options.trigger.split(" "), o = r.length; o--;) {
            var i = r[o];
            if ("click" == i) this.$element.on("click." + this.type, this.options.selector, e.proxy(this.toggle, this));
            else if ("manual" != i) {
                var a = "hover" == i ? "mouseenter" : "focusin",
                    l = "hover" == i ? "mouseleave" : "focusout";
                this.$element.on(a + "." + this.type, this.options.selector, e.proxy(this.enter, this)), this.$element.on(l + "." + this.type, this.options.selector, e.proxy(this.leave, this))
            }
        }
        this.options.selector ? this._options = e.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle()
    }, t.prototype.getDefaults = function() {
        return t.DEFAULTS
    }, t.prototype.getOptions = function(t) {
        return t = e.extend({}, this.getDefaults(), this.$element.data(), t), t.delay && "number" == typeof t.delay && (t.delay = {
            show: t.delay,
            hide: t.delay
        }), t
    }, t.prototype.getDelegateOptions = function() {
        var t = {},
            n = this.getDefaults();
        return this._options && e.each(this._options, function(e, s) {
            n[e] != s && (t[e] = s)
        }), t
    }, t.prototype.enter = function(t) {
        var n = t instanceof this.constructor ? t : e(t.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type);
        return clearTimeout(n.timeout), n.hoverState = "in", n.options.delay && n.options.delay.show ? void(n.timeout = setTimeout(function() {
            "in" == n.hoverState && n.show()
        }, n.options.delay.show)) : n.show()
    }, t.prototype.leave = function(t) {
        var n = t instanceof this.constructor ? t : e(t.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type);
        return clearTimeout(n.timeout), n.hoverState = "out", n.options.delay && n.options.delay.hide ? void(n.timeout = setTimeout(function() {
            "out" == n.hoverState && n.hide()
        }, n.options.delay.hide)) : n.hide()
    }, t.prototype.show = function() {
        var t = e.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            if (this.$element.trigger(t), t.isDefaultPrevented()) return;
            var n = this,
                s = this.tip();
            this.setContent(), this.options.animation && s.addClass("fade");
            var r = "function" == typeof this.options.placement ? this.options.placement.call(this, s[0], this.$element[0]) : this.options.placement,
                o = /\s?auto?\s?/i,
                i = o.test(r);
            i && (r = r.replace(o, "") || "top"), s.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(r), this.options.container ? s.appendTo(this.options.container) : s.insertAfter(this.$element);
            var a = this.getPosition(),
                l = s[0].offsetWidth,
                c = s[0].offsetHeight;
            if (i) {
                var h = this.$element.parent(),
                    u = r,
                    p = document.documentElement.scrollTop || document.body.scrollTop,
                    d = "body" == this.options.container ? window.innerWidth : h.outerWidth(),
                    f = "body" == this.options.container ? window.innerHeight : h.outerHeight(),
                    g = "body" == this.options.container ? 0 : h.offset().left;
                r = "bottom" == r && a.top + a.height + c - p > f ? "top" : "top" == r && a.top - p - c < 0 ? "bottom" : "right" == r && a.right + l > d ? "left" : "left" == r && a.left - l < g ? "right" : r, s.removeClass(u).addClass(r)
            }
            var m = this.getCalculatedOffset(r, a, l, c);
            this.applyPlacement(m, r), this.hoverState = null;
            var _ = function() {
                n.$element.trigger("shown.bs." + n.type)
            };
            e.support.transition && this.$tip.hasClass("fade") ? s.one(e.support.transition.end, _).emulateTransitionEnd(150) : _()
        }
    }, t.prototype.applyPlacement = function(t, n) {
        var s, r = this.tip(),
            o = r[0].offsetWidth,
            i = r[0].offsetHeight,
            a = parseInt(r.css("margin-top"), 10),
            l = parseInt(r.css("margin-left"), 10);
        isNaN(a) && (a = 0), isNaN(l) && (l = 0), t.top = t.top + a, t.left = t.left + l, e.offset.setOffset(r[0], e.extend({
            using: function(e) {
                r.css({
                    top: Math.round(e.top),
                    left: Math.round(e.left)
                })
            }
        }, t), 0), r.addClass("in");
        var c = r[0].offsetWidth,
            h = r[0].offsetHeight;
        if ("top" == n && h != i && (s = !0, t.top = t.top + i - h), /bottom|top/.test(n)) {
            var u = 0;
            t.left < 0 && (u = -2 * t.left, t.left = 0, r.offset(t), c = r[0].offsetWidth, h = r[0].offsetHeight), this.replaceArrow(u - o + c, c, "left")
        } else this.replaceArrow(h - i, h, "top");
        s && r.offset(t)
    }, t.prototype.replaceArrow = function(e, t, n) {
        this.arrow().css(n, e ? 50 * (1 - e / t) + "%" : "")
    }, t.prototype.setContent = function() {
        var e = this.tip(),
            t = this.getTitle();
        e.find(".tooltip-inner")[this.options.html ? "html" : "text"](t), e.removeClass("fade in top bottom left right")
    }, t.prototype.hide = function() {
        function t() {
            "in" != n.hoverState && s.detach(), n.$element.trigger("hidden.bs." + n.type)
        }
        var n = this,
            s = this.tip(),
            r = e.Event("hide.bs." + this.type);
        return this.$element.trigger(r), r.isDefaultPrevented() ? void 0 : (s.removeClass("in"), e.support.transition && this.$tip.hasClass("fade") ? s.one(e.support.transition.end, t).emulateTransitionEnd(150) : t(), this.hoverState = null, this)
    }, t.prototype.fixTitle = function() {
        var e = this.$element;
        (e.attr("title") || "string" != typeof e.attr("data-original-title")) && e.attr("data-original-title", e.attr("title") || "").attr("title", "")
    }, t.prototype.hasContent = function() {
        return this.getTitle()
    }, t.prototype.getPosition = function() {
        var t = this.$element[0];
        return e.extend({}, "function" == typeof t.getBoundingClientRect ? t.getBoundingClientRect() : {
            width: t.offsetWidth,
            height: t.offsetHeight
        }, this.$element.offset())
    }, t.prototype.getCalculatedOffset = function(e, t, n, s) {
        return "bottom" == e ? {
            top: t.top + t.height,
            left: t.left + t.width / 2 - n / 2
        } : "top" == e ? {
            top: t.top - s,
            left: t.left + t.width / 2 - n / 2
        } : "left" == e ? {
            top: t.top + t.height / 2 - s / 2,
            left: t.left - n
        } : {
            top: t.top + t.height / 2 - s / 2,
            left: t.left + t.width
        }
    }, t.prototype.getTitle = function() {
        var e, t = this.$element,
            n = this.options;
        return e = t.attr("data-original-title") || ("function" == typeof n.title ? n.title.call(t[0]) : n.title)
    }, t.prototype.tip = function() {
        return this.$tip = this.$tip || e(this.options.template)
    }, t.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }, t.prototype.validate = function() {
        this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null)
    }, t.prototype.enable = function() {
        this.enabled = !0
    }, t.prototype.disable = function() {
        this.enabled = !1
    }, t.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    }, t.prototype.toggle = function(t) {
        var n = t ? e(t.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type) : this;
        n.tip().hasClass("in") ? n.leave(n) : n.enter(n)
    }, t.prototype.destroy = function() {
        clearTimeout(this.timeout), this.hide().$element.off("." + this.type).removeData("bs." + this.type)
    };
    var n = e.fn.tooltip;
    e.fn.tooltip = function(n) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.tooltip"),
                o = "object" == typeof n && n;
            (r || "destroy" != n) && (r || s.data("bs.tooltip", r = new t(this, o)), "string" == typeof n && r[n]())
        })
    }, e.fn.tooltip.Constructor = t, e.fn.tooltip.noConflict = function() {
        return e.fn.tooltip = n, this
    }
}(jQuery), + function(e) {
    "use strict";
    var t = function(e, t) {
        this.init("popover", e, t)
    };
    if (!e.fn.tooltip) throw new Error("Popover requires tooltip.js");
    t.DEFAULTS = e.extend({}, e.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }), t.prototype = e.extend({}, e.fn.tooltip.Constructor.prototype), t.prototype.constructor = t, t.prototype.getDefaults = function() {
        return t.DEFAULTS
    }, t.prototype.setContent = function() {
        var e = this.tip(),
            t = this.getTitle(),
            n = this.getContent();
        e.find(".popover-title")[this.options.html ? "html" : "text"](t), e.find(".popover-content")[this.options.html ? "string" == typeof n ? "html" : "append" : "text"](n), e.removeClass("fade top bottom left right in"), e.find(".popover-title").html() || e.find(".popover-title").hide()
    }, t.prototype.hasContent = function() {
        return this.getTitle() || this.getContent()
    }, t.prototype.getContent = function() {
        var e = this.$element,
            t = this.options;
        return e.attr("data-content") || ("function" == typeof t.content ? t.content.call(e[0]) : t.content)
    }, t.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    }, t.prototype.tip = function() {
        return this.$tip || (this.$tip = e(this.options.template)), this.$tip
    };
    var n = e.fn.popover;
    e.fn.popover = function(n) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.popover"),
                o = "object" == typeof n && n;
            (r || "destroy" != n) && (r || s.data("bs.popover", r = new t(this, o)), "string" == typeof n && r[n]())
        })
    }, e.fn.popover.Constructor = t, e.fn.popover.noConflict = function() {
        return e.fn.popover = n, this
    }
}(jQuery), + function(e) {
    "use strict";

    function t(n, s) {
        var r, o = e.proxy(this.process, this);
        this.$element = e(e(n).is("body") ? window : n), this.$body = e("body"), this.$scrollElement = this.$element.on("scroll.bs.scroll-spy.data-api", o), this.options = e.extend({}, t.DEFAULTS, s), this.selector = (this.options.target || (r = e(n).attr("href")) && r.replace(/.*(?=#[^\s]+$)/, "") || "") + " .nav li > a", this.offsets = e([]), this.targets = e([]), this.activeTarget = null, this.refresh(), this.process()
    }
    t.DEFAULTS = {
        offset: 10
    }, t.prototype.refresh = function() {
        var t = this.$element[0] == window ? "offset" : "position";
        this.offsets = e([]), this.targets = e([]);
        var n = this;
        this.$body.find(this.selector).map(function() {
            var s = e(this),
                r = s.data("target") || s.attr("href"),
                o = /^#./.test(r) && e(r);
            return o && o.length && o.is(":visible") && [
                [o[t]().top + (!e.isWindow(n.$scrollElement.get(0)) && n.$scrollElement.scrollTop()), r]
            ] || null
        }).sort(function(e, t) {
            return e[0] - t[0]
        }).each(function() {
            n.offsets.push(this[0]), n.targets.push(this[1])
        })
    }, t.prototype.process = function() {
        var e, t = this.$scrollElement.scrollTop() + this.options.offset,
            n = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight,
            s = n - this.$scrollElement.height(),
            r = this.offsets,
            o = this.targets,
            i = this.activeTarget;
        if (t >= s) return i != (e = o.last()[0]) && this.activate(e);
        if (i && t <= r[0]) return i != (e = o[0]) && this.activate(e);
        for (e = r.length; e--;) i != o[e] && t >= r[e] && (!r[e + 1] || t <= r[e + 1]) && this.activate(o[e])
    }, t.prototype.activate = function(t) {
        this.activeTarget = t, e(this.selector).parentsUntil(this.options.target, ".active").removeClass("active");
        var n = this.selector + '[data-target="' + t + '"],' + this.selector + '[href="' + t + '"]',
            s = e(n).parents("li").addClass("active");
        s.parent(".dropdown-menu").length && (s = s.closest("li.dropdown").addClass("active")), s.trigger("activate.bs.scrollspy")
    };
    var n = e.fn.scrollspy;
    e.fn.scrollspy = function(n) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.scrollspy"),
                o = "object" == typeof n && n;
            r || s.data("bs.scrollspy", r = new t(this, o)), "string" == typeof n && r[n]()
        })
    }, e.fn.scrollspy.Constructor = t, e.fn.scrollspy.noConflict = function() {
        return e.fn.scrollspy = n, this
    }, e(window).on("load", function() {
        e('[data-spy="scroll"]').each(function() {
            var t = e(this);
            t.scrollspy(t.data())
        })
    })
}(jQuery), + function(e) {
    "use strict";
    var t = function(t) {
        this.element = e(t)
    };
    t.prototype.show = function() {
        var t = this.element,
            n = t.closest("ul:not(.dropdown-menu)"),
            s = t.data("target");
        if (s || (s = t.attr("href"), s = s && s.replace(/.*(?=#[^\s]*$)/, "")), !t.parent("li").hasClass("active")) {
            var r = n.find(".active:last a")[0],
                o = e.Event("show.bs.tab", {
                    relatedTarget: r
                });
            if (t.trigger(o), !o.isDefaultPrevented()) {
                var i = e(s);
                this.activate(t.parent("li"), n), this.activate(i, i.parent(), function() {
                    t.trigger({
                        type: "shown.bs.tab",
                        relatedTarget: r
                    })
                })
            }
        }
    }, t.prototype.activate = function(t, n, s) {
        function r() {
            o.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"), t.addClass("active"), i ? (t[0].offsetWidth, t.addClass("in")) : t.removeClass("fade"), t.parent(".dropdown-menu") && t.closest("li.dropdown").addClass("active"), s && s()
        }
        var o = n.find("> .active"),
            i = s && e.support.transition && o.hasClass("fade");
        i ? o.one(e.support.transition.end, r).emulateTransitionEnd(150) : r(), o.removeClass("in")
    };
    var n = e.fn.tab;
    e.fn.tab = function(n) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.tab");
            r || s.data("bs.tab", r = new t(this)), "string" == typeof n && r[n]()
        })
    }, e.fn.tab.Constructor = t, e.fn.tab.noConflict = function() {
        return e.fn.tab = n, this
    }, e(document).on("click.bs.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]', function(t) {
        t.preventDefault(), e(this).tab("show")
    })
}(jQuery), + function(e) {
    "use strict";
    var t = function(n, s) {
        this.options = e.extend({}, t.DEFAULTS, s), this.$window = e(window).on("scroll.bs.affix.data-api", e.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", e.proxy(this.checkPositionWithEventLoop, this)), this.$element = e(n), this.affixed = this.unpin = this.pinnedOffset = null, this.checkPosition()
    };
    t.RESET = "affix affix-top affix-bottom", t.DEFAULTS = {
        offset: 0
    }, t.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(t.RESET).addClass("affix");
        var e = this.$window.scrollTop(),
            n = this.$element.offset();
        return this.pinnedOffset = n.top - e
    }, t.prototype.checkPositionWithEventLoop = function() {
        setTimeout(e.proxy(this.checkPosition, this), 1)
    }, t.prototype.checkPosition = function() {
        if (this.$element.is(":visible")) {
            var n = e(document).height(),
                s = this.$window.scrollTop(),
                r = this.$element.offset(),
                o = this.options.offset,
                i = o.top,
                a = o.bottom;
            "top" == this.affixed && (r.top += s), "object" != typeof o && (a = i = o), "function" == typeof i && (i = o.top(this.$element)), "function" == typeof a && (a = o.bottom(this.$element));
            var l = null != this.unpin && s + this.unpin <= r.top ? !1 : null != a && r.top + this.$element.height() >= n - a ? "bottom" : null != i && i >= s ? "top" : !1;
            if (this.affixed !== l) {
                this.unpin && this.$element.css("top", "");
                var c = "affix" + (l ? "-" + l : ""),
                    h = e.Event(c + ".bs.affix");
                this.$element.trigger(h), h.isDefaultPrevented() || (this.affixed = l, this.unpin = "bottom" == l ? this.getPinnedOffset() : null, this.$element.removeClass(t.RESET).addClass(c).trigger(e.Event(c.replace("affix", "affixed"))), "bottom" == l && this.$element.offset({
                    top: n - a - this.$element.height()
                }))
            }
        }
    };
    var n = e.fn.affix;
    e.fn.affix = function(n) {
        return this.each(function() {
            var s = e(this),
                r = s.data("bs.affix"),
                o = "object" == typeof n && n;
            r || s.data("bs.affix", r = new t(this, o)), "string" == typeof n && r[n]()
        })
    }, e.fn.affix.Constructor = t, e.fn.affix.noConflict = function() {
        return e.fn.affix = n, this
    }, e(window).on("load", function() {
        e('[data-spy="affix"]').each(function() {
            var t = e(this),
                n = t.data();
            n.offset = n.offset || {}, n.offsetBottom && (n.offset.bottom = n.offsetBottom), n.offsetTop && (n.offset.top = n.offsetTop), t.affix(n)
        })
    })
}(jQuery),
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
function($) {
    window.log = function() {
        log.history = log.history || [], log.history.push(arguments), this.console && console.log(Array.prototype.slice.call(arguments))
    }, $.fn.snippet = function(e, t) {
        "object" == typeof e && (t = e), "string" == typeof e && (e = e.toLowerCase());
        var n = {
                style: "random",
                showNum: !0,
                transparent: !1,
                collapse: !1,
                menu: !0,
                showMsg: "Expand Code",
                hideMsg: "Collapse Code",
                clipboard: "",
                startCollapsed: !0,
                startText: !1,
                box: "",
                boxColor: "",
                boxFill: ""
            },
            s = ["acid", "berries-dark", "berries-light", "bipolar", "blacknblue", "bright", "contrast", "darkblue", "darkness", "desert", "dull", "easter", "emacs", "golden", "greenlcd", "ide-anjuta", "ide-codewarrior", "ide-devcpp", "ide-eclipse", "ide-kdev", "ide-msvcpp", "kwrite", "matlab", "navy", "nedit", "neon", "night", "pablo", "peachpuff", "print", "rand01", "the", "typical", "vampire", "vim", "vim-dark", "whatis", "whitengrey", "zellner"];
        return t && $.extend(n, t), this.each(function() {
            var t = n.style.toLowerCase();
            if ("random" == n.style) {
                var r = Math.floor(Math.random() * s.length);
                t = s[r]
            }
            var o = $(this),
                i = this.nodeName.toLowerCase();
            if ("pre" != i) {
                var a = "Snippet Error: Sorry, Snippet only formats '<pre>' elements. '<" + i + ">' elements are currently unsupported.";
                return console.log(a), !1
            }
            if (void 0 == o.data("orgHtml") || null == o.data("orgHtml")) {
                var l = o.html();
                o.data("orgHtml", l)
            }
            if (o.parent().hasClass("snippet-wrap")) {
                if (o.parent().attr("class", "sh_" + t + " snippet-wrap"), o.parents(".snippet-container").find(".snippet-reveal").attr("class", "sh_" + t + " snippet-wrap snippet-reveal"), o.find("li.box, li.box-top, li.box-mid, li.box-bot").removeAttr("style").removeAttr("class"), o.find("li .box-sp").remove(), n.transparent) {
                    var c = {
                        "background-color": "transparent",
                        "box-shadow": "none",
                        "-moz-box-shadow": "none",
                        "-webkit-box-shadow": "none"
                    };
                    o.css(c), o.next(".snippet-textonly").css(c), o.parents(".snippet-container").find(".snippet-hide pre").css(c)
                } else {
                    var c = {
                        "background-color": "",
                        "box-shadow": "",
                        "-moz-box-shadow": "",
                        "-webkit-box-shadow": ""
                    };
                    o.css(c), o.next(".snippet-textonly").css(c), o.parents(".snippet-container").find(".snippet-reveal pre").css(c)
                }
                if (n.showNum) {
                    var h = o.find("li").eq(0).parent();
                    if (h.hasClass("snippet-no-num")) {
                        h.wrap("<ol class='snippet-num'></ol>");
                        var u = o.find("li").eq(0);
                        u.unwrap()
                    }
                } else {
                    var h = o.find("li").eq(0).parent();
                    if (h.hasClass("snippet-num")) {
                        h.wrap("<ul class='snippet-no-num'></ul>");
                        var u = o.find("li").eq(0);
                        u.unwrap()
                    }
                }
                if ("" != n.box) {
                    for (var p = "<span class='box-sp'>&nbsp;</span>", d = n.box.split(","), f = 0; f < d.length; f++) {
                        var g = d[f];
                        if (-1 == g.indexOf("-")) g = parseFloat(g) - 1, o.find("li").eq(g).addClass("box").prepend(p);
                        else {
                            var m = parseFloat(g.split("-")[0]) - 1,
                                _ = parseFloat(g.split("-")[1]) - 1;
                            if (_ > m) {
                                o.find("li").eq(m).addClass("box box-top").prepend(p), o.find("li").eq(_).addClass("box box-bot").prepend(p);
                                for (var y = m + 1; _ > y; y++) o.find("li").eq(y).addClass("box box-mid").prepend(p)
                            } else m == _ && o.find("li").eq(m).addClass("box").prepend(p)
                        }
                    }
                    "" != n.boxColor && o.find("li.box").css("border-color", n.boxColor), "" != n.boxFill && o.find("li.box").addClass("box-bg").css("background-color", n.boxFill)
                }
                sh_highlightDocument(), n.menu ? o.prev(".snippet-menu").find("pre,.snippet-clipboard").show() : o.prev(".snippet-menu").find("pre,.snippet-clipboard").hide()
            } else {
                if ("string" != typeof e) {
                    if (o.attr("class").length > 0) var v = ' class="' + o.attr("class") + '"';
                    else var v = "";
                    if (o.attr("id").length > 0) var b = ' id="' + o.attr("id") + '"';
                    else var b = "";
                    var a = "Snippet Error: You must specify a language on inital usage of Snippet. Reference <pre" + v + b + ">";
                    return console.log(a), !1
                }
                if (o.addClass("sh_" + e).addClass("snippet-formatted").wrap("<div class='snippet-container' style='" + o.attr("style") + ";'><div class='sh_" + t + " snippet-wrap'></div></div>"), o.removeAttr("style"), sh_highlightDocument(), n.showNum) {
                    var x = o.html();
                    for (x = x.replace(/\n/g, "</li><li>"), x = "<ol class='snippet-num'><li>" + x + "</li></ol>"; - 1 != x.indexOf("<li></li></ol>");) x = x.replace("<li></li></ol>", "</ol>")
                } else {
                    var x = o.html();
                    for (x = x.replace(/\n/g, "</li><li>"), x = "<ul class='snippet-no-num'><li>" + x + "</li></ul>"; - 1 != x.indexOf("<li></li></ul>");) x = x.replace("<li></li></ul>", "</ul>")
                }
                for (x = x.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;"), o.html(x);
                    "" == o.find("li").eq(0).html();) o.find("li").eq(0).remove();
                o.find("li").each(function() {
                    if ($(this).html().length < 2) {
                        var e = $(this).html().replace(/\s/g, "");
                        "" == e && $(this).html("<span style='display:none;'>&nbsp;</span>")
                    }
                });
                var w = "<pre class='snippet-textonly sh_sourceCode' style='display:none;'>" + o.data("orgHtml") + "</pre>",
                    A = "<div class='snippet-menu sh_sourceCode' style='display:none;'><pre><a class='snippet-copy' href='#'>copy</a><a class='snippet-text' href='#'>text</a><a class='snippet-window' href='#'>pop-up</a></pre></div>";
                if (o.parent().append(w), o.parent().prepend(A), o.parent().hover(function() {
                    $(this).find(".snippet-menu").fadeIn("fast")
                }, function() {
                    $(this).find(".snippet-menu").fadeOut("fast")
                }), "" != n.clipboard && 0 != n.clipboard) {
                    var E = o.parent().find("a.snippet-copy");
                    E.show(), E.parents(".snippet-menu").show();
                    var C = o.parents(".snippet-wrap").find(".snippet-textonly").text();
                    ZeroClipboard.setMoviePath(n.clipboard);
                    var T = new ZeroClipboard.Client;
                    T.setText(C), T.glue(E[0], E.parents(".snippet-menu")[0]), T.addEventListener("complete", function(e, t) {
                        t.length > 500 && (t = t.substr(0, 500) + "...\n\n(" + (t.length - 500) + " characters not shown)"), alert("Copied text to clipboard:\n\n " + t)
                    }), E.parents(".snippet-menu").hide()
                } else o.parent().find("a.snippet-copy").hide();
                if (o.parent().find("a.snippet-text").click(function() {
                    var e = $(this).parents(".snippet-wrap").find(".snippet-formatted"),
                        t = $(this).parents(".snippet-wrap").find(".snippet-textonly");
                    return e.toggle(), t.toggle(), $(this).html(t.is(":visible") ? "html" : "text"), $(this).blur(), !1
                }), o.parent().find("a.snippet-window").click(function() {
                    var e = $(this).parents(".snippet-wrap").find(".snippet-textonly").html();
                    return snippetPopup(e), $(this).blur(), !1
                }), n.menu || o.prev(".snippet-menu").find("pre,.snippet-clipboard").hide(), n.collapse) {
                    var k = o.parent().attr("class"),
                        z = "<div class='snippet-reveal " + k + "'><pre class='sh_sourceCode'><a href='#' class='snippet-toggle'>" + n.showMsg + "</a></pre></div>",
                        Z = "<div class='sh_sourceCode snippet-hide'><pre><a href='#' class='snippet-revealed snippet-toggle'>" + n.hideMsg + "</a></pre></div>";
                    o.parents(".snippet-container").append(z), o.parent().append(Z);
                    var N = o.parents(".snippet-container");
                    n.startCollapsed ? (N.find(".snippet-reveal").show(), N.find(".snippet-wrap").eq(0).hide()) : (N.find(".snippet-reveal").hide(), N.find(".snippet-wrap").eq(0).show()), N.find("a.snippet-toggle").click(function() {
                        return N.find(".snippet-wrap").toggle(), !1
                    })
                }
                if (n.transparent) {
                    var c = {
                        "background-color": "transparent",
                        "box-shadow": "none",
                        "-moz-box-shadow": "none",
                        "-webkit-box-shadow": "none"
                    };
                    o.css(c), o.next(".snippet-textonly").css(c), o.parents(".snippet-container").find(".snippet-reveal pre").css(c)
                }
                if (n.startText && (o.hide(), o.next(".snippet-textonly").show(), o.parent().find(".snippet-text").html("html")), "" != n.box) {
                    for (var p = "<span class='box-sp'>&nbsp;</span>", d = n.box.split(","), f = 0; f < d.length; f++) {
                        var g = d[f];
                        if (-1 == g.indexOf("-")) g = parseFloat(g) - 1, o.find("li").eq(g).addClass("box").prepend(p);
                        else {
                            var m = parseFloat(g.split("-")[0]) - 1,
                                _ = parseFloat(g.split("-")[1]) - 1;
                            if (_ > m) {
                                o.find("li").eq(m).addClass("box box-top").prepend(p), o.find("li").eq(_).addClass("box box-bot").prepend(p);
                                for (var y = m + 1; _ > y; y++) o.find("li").eq(y).addClass("box box-mid").prepend(p)
                            } else m == _ && o.find("li").eq(m).addClass("box").prepend(p)
                        }
                    }
                    "" != n.boxColor && o.find("li.box").css("border-color", n.boxColor), "" != n.boxFill && o.find("li.box, li.box-top, li.box-mid, li.box-bot").addClass("box-bg").css("background-color", n.boxFill)
                }
                o.parents(".snippet-container").find("a").addClass("sh_url")
            }
        })
    }
}(jQuery);
var ZeroClipboard = {
    version: "1.0.7",
    clients: {},
    moviePath: "ZeroClipboard.swf",
    nextId: 1,
    $: function(e) {
        return "string" == typeof e && (e = document.getElementById(e)), e.addClass || (e.hide = function() {
            this.style.display = "none"
        }, e.show = function() {
            this.style.display = ""
        }, e.addClass = function(e) {
            this.removeClass(e), this.className += " " + e
        }, e.removeClass = function(e) {
            for (var t = this.className.split(/\s+/), n = -1, s = 0; s < t.length; s++) t[s] == e && (n = s, s = t.length);
            return n > -1 && (t.splice(n, 1), this.className = t.join(" ")), this
        }, e.hasClass = function(e) {
            return !!this.className.match(new RegExp("\\s*" + e + "\\s*"))
        }), e
    },
    setMoviePath: function(e) {
        this.moviePath = e
    },
    dispatch: function(e, t, n) {
        var s = this.clients[e];
        s && s.receiveEvent(t, n)
    },
    register: function(e, t) {
        this.clients[e] = t
    },
    getDOMObjectPosition: function(e, t) {
        for (var n = {
            left: 0,
            top: 0,
            width: e.width ? e.width : e.offsetWidth,
            height: e.height ? e.height : e.offsetHeight
        }; e && e != t;) n.left += e.offsetLeft, n.top += e.offsetTop, e = e.offsetParent;
        return n
    },
    Client: function(e) {
        this.handlers = {}, this.id = ZeroClipboard.nextId++, this.movieId = "ZeroClipboardMovie_" + this.id, ZeroClipboard.register(this.id, this), e && this.glue(e)
    }
};
ZeroClipboard.Client.prototype = {
    id: 0,
    ready: !1,
    movie: null,
    clipText: "",
    handCursorEnabled: !0,
    cssEffects: !0,
    handlers: null,
    glue: function(e, t, n) {
        this.domElement = ZeroClipboard.$(e);
        var s = 99;
        this.domElement.style.zIndex && (s = parseInt(this.domElement.style.zIndex, 10) + 1), "string" == typeof t ? t = ZeroClipboard.$(t) : "undefined" == typeof t && (t = document.getElementsByTagName("body")[0]);
        var r = ZeroClipboard.getDOMObjectPosition(this.domElement, t);
        this.div = document.createElement("div"), this.div.className = "snippet-clipboard";
        var o = this.div.style;
        if (o.position = "absolute", o.left = "" + r.left + "px", o.top = "" + r.top + "px", o.width = "" + r.width + "px", o.height = "" + r.height + "px", o.zIndex = s, "object" == typeof n)
            for (addedStyle in n) o[addedStyle] = n[addedStyle];
        t.appendChild(this.div), this.div.innerHTML = this.getHTML(r.width, r.height)
    },
    getHTML: function(e, t) {
        var n = "",
            s = "id=" + this.id + "&width=" + e + "&height=" + t;
        if (navigator.userAgent.match(/MSIE/)) {
            var r = location.href.match(/^https/i) ? "https://" : "http://";
            n += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + r + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + e + '" height="' + t + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + ZeroClipboard.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + s + '"/><param name="wmode" value="transparent"/></object>'
        } else n += '<embed id="' + this.movieId + '" src="' + ZeroClipboard.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + e + '" height="' + t + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + s + '" wmode="transparent" />';
        return n
    },
    hide: function() {
        this.div && (this.div.style.left = "-2000px")
    },
    show: function() {
        this.reposition()
    },
    destroy: function() {
        if (this.domElement && this.div) {
            this.hide(), this.div.innerHTML = "";
            var e = document.getElementsByTagName("body")[0];
            try {
                e.removeChild(this.div)
            } catch (t) {}
            this.domElement = null, this.div = null
        }
    },
    reposition: function(e) {
        if (e && (this.domElement = ZeroClipboard.$(e), this.domElement || this.hide()), this.domElement && this.div) {
            var t = ZeroClipboard.getDOMObjectPosition(this.domElement),
                n = this.div.style;
            n.left = "" + t.left + "px", n.top = "" + t.top + "px"
        }
    },
    setText: function(e) {
        this.clipText = e, this.ready && this.movie.setText(e)
    },
    addEventListener: function(e, t) {
        e = e.toString().toLowerCase().replace(/^on/, ""), this.handlers[e] || (this.handlers[e] = []), this.handlers[e].push(t)
    },
    setHandCursor: function(e) {
        this.handCursorEnabled = e, this.ready && this.movie.setHandCursor(e)
    },
    setCSSEffects: function(e) {
        this.cssEffects = !!e
    },
    receiveEvent: function(e, t) {
        switch (e = e.toString().toLowerCase().replace(/^on/, "")) {
            case "load":
                if (this.movie = document.getElementById(this.movieId), !this.movie) {
                    var n = this;
                    return void setTimeout(function() {
                        n.receiveEvent("load", null)
                    }, 1)
                }
                if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                    var n = this;
                    return setTimeout(function() {
                        n.receiveEvent("load", null)
                    }, 100), void(this.ready = !0)
                }
                this.ready = !0;
                try {
                    this.movie.setText(this.clipText)
                } catch (s) {}
                try {
                    this.movie.setHandCursor(this.handCursorEnabled)
                } catch (s) {}
                break;
            case "mouseover":
                this.domElement && this.cssEffects && (this.domElement.addClass("hover"), this.recoverActive && this.domElement.addClass("active"));
                break;
            case "mouseout":
                this.domElement && this.cssEffects && (this.recoverActive = !1, this.domElement.hasClass("active") && (this.domElement.removeClass("active"), this.recoverActive = !0), this.domElement.removeClass("hover"));
                break;
            case "mousedown":
                this.domElement && this.cssEffects && this.domElement.addClass("active");
                break;
            case "mouseup":
                this.domElement && this.cssEffects && (this.domElement.removeClass("active"), this.recoverActive = !1)
        }
        if (this.handlers[e])
            for (var r = 0, o = this.handlers[e].length; o > r; r++) {
                var i = this.handlers[e][r];
                "function" == typeof i ? i(this, t) : "object" == typeof i && 2 == i.length ? i[0][i[1]](this, t) : "string" == typeof i && window[i](this, t)
            }
    }
}, this.sh_languages || (this.sh_languages = {});
var sh_requests = {};
this.sh_languages || (this.sh_languages = {}), sh_languages.c = [
    [
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9],
        [/(\bstruct)([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/^[ \t]*#(?:[ \t]*include)/g, "sh_preproc", 10, 1],
        [/^[ \t]*#(?:[ \t]*[A-Za-z0-9_]*)/g, "sh_preproc", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 13],
        [/'/g, "sh_string", 14],
        [/\b(?:__asm|__cdecl|__declspec|__export|__far16|__fastcall|__fortran|__import|__pascal|__rtti|__stdcall|_asm|_cdecl|__except|_export|_far16|_fastcall|__finally|_fortran|_import|_pascal|_stdcall|__thread|__try|asm|auto|break|case|catch|cdecl|const|continue|default|do|else|enum|extern|for|goto|if|pascal|register|return|sizeof|static|struct|switch|typedef|union|volatile|while)\b/g, "sh_keyword", -1],
        [/\b(?:bool|char|double|float|int|long|short|signed|unsigned|void|wchar_t)\b/g, "sh_type", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1],
        [/([A-Za-z](?:[^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]|[_])*)((?:<.*>)?)(\s+(?=[*&]*[A-Za-z][^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]*\s*[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\[\]]+))/g, ["sh_usertype", "sh_usertype", "sh_normal"], -1]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 5]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/$/g, null, -2],
        [/</g, "sh_string", 11],
        [/"/g, "sh_string", 12],
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9]
    ],
    [
        [/$/g, null, -2],
        [/>/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/"/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/'/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.cpp = [
    [
        [/(\b(?:class|struct|typename))([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/\b(?:class|const_cast|delete|dynamic_cast|explicit|false|friend|inline|mutable|namespace|new|operator|private|protected|public|reinterpret_cast|static_cast|template|this|throw|true|try|typeid|typename|using|virtual)\b/g, "sh_keyword", -1],
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9],
        [/(\bstruct)([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/^[ \t]*#(?:[ \t]*include)/g, "sh_preproc", 10, 1],
        [/^[ \t]*#(?:[ \t]*[A-Za-z0-9_]*)/g, "sh_preproc", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 13],
        [/'/g, "sh_string", 14],
        [/\b(?:__asm|__cdecl|__declspec|__export|__far16|__fastcall|__fortran|__import|__pascal|__rtti|__stdcall|_asm|_cdecl|__except|_export|_far16|_fastcall|__finally|_fortran|_import|_pascal|_stdcall|__thread|__try|asm|auto|break|case|catch|cdecl|const|continue|default|do|else|enum|extern|for|goto|if|pascal|register|return|sizeof|static|struct|switch|typedef|union|volatile|while)\b/g, "sh_keyword", -1],
        [/\b(?:bool|char|double|float|int|long|short|signed|unsigned|void|wchar_t)\b/g, "sh_type", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1],
        [/([A-Za-z](?:[^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]|[_])*)((?:<.*>)?)(\s+(?=[*&]*[A-Za-z][^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]*\s*[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\[\]]+))/g, ["sh_usertype", "sh_usertype", "sh_normal"], -1]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 5]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/$/g, null, -2],
        [/</g, "sh_string", 11],
        [/"/g, "sh_string", 12],
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9]
    ],
    [
        [/$/g, null, -2],
        [/>/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/"/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/'/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.csharp = [
    [
        [/\b(?:using)\b/g, "sh_preproc", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))(?:[FfDdMmUulL]+)?\b/g, "sh_number", -1],
        [/(\b(?:class|struct|typename))([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/\b(?:abstract|event|new|struct|as|explicit|null|switch|base|extern|this|false|operator|throw|break|finally|out|true|fixed|override|try|case|params|typeof|catch|for|private|foreach|protected|checked|goto|public|unchecked|class|if|readonly|unsafe|const|implicit|ref|continue|in|return|virtual|default|interface|sealed|volatile|delegate|internal|do|is|sizeof|while|lock|stackalloc|else|static|enum|namespace|get|partial|set|value|where|yield)\b/g, "sh_keyword", -1],
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9],
        [/(\bstruct)([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/^[ \t]*#(?:[ \t]*include)/g, "sh_preproc", 10, 1],
        [/^[ \t]*#(?:[ \t]*[A-Za-z0-9_]*)/g, "sh_preproc", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 13],
        [/'/g, "sh_string", 14],
        [/\b(?:bool|byte|sbyte|char|decimal|double|float|int|uint|long|ulong|object|short|ushort|string|void)\b/g, "sh_type", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1],
        [/([A-Za-z](?:[^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]|[_])*)((?:<.*>)?)(\s+(?=[*&]*[A-Za-z][^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]*\s*[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\[\]]+))/g, ["sh_usertype", "sh_usertype", "sh_normal"], -1]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 5]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/$/g, null, -2],
        [/</g, "sh_string", 11],
        [/"/g, "sh_string", 12],
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9]
    ],
    [
        [/$/g, null, -2],
        [/>/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/"/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/'/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.css = [
    [
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9],
        [/(?:\.|#)[A-Za-z0-9_]+/g, "sh_selector", -1],
        [/\{/g, "sh_cbracket", 10, 1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 5]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\}/g, "sh_cbracket", -2],
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9],
        [/[A-Za-z0-9_-]+[ \t]*:/g, "sh_property", -1],
        [/[.%A-Za-z0-9_-]+/g, "sh_value", -1],
        [/#(?:[A-Za-z0-9_]+)/g, "sh_string", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.flex = [
    [
        [/^%\{/g, "sh_preproc", 1, 1],
        [/^%[sx]/g, "sh_preproc", 16, 1],
        [/^%option/g, "sh_preproc", 17, 1],
        [/^%(?:array|pointer|[aceknopr])/g, "sh_preproc", -1],
        [/[A-Za-z_][A-Za-z0-9_-]*/g, "sh_preproc", 19, 1],
        [/^%%/g, "sh_preproc", 20, 1]
    ],
    [
        [/^%\}/g, "sh_preproc", -2],
        [/(\b(?:class|struct|typename))([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/\b(?:class|const_cast|delete|dynamic_cast|explicit|false|friend|inline|mutable|namespace|new|operator|private|protected|public|reinterpret_cast|static_cast|template|this|throw|true|try|typeid|typename|using|virtual)\b/g, "sh_keyword", -1],
        [/\/\/\//g, "sh_comment", 2],
        [/\/\//g, "sh_comment", 8],
        [/\/\*\*/g, "sh_comment", 9],
        [/\/\*/g, "sh_comment", 10],
        [/(\bstruct)([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/^[ \t]*#(?:[ \t]*include)/g, "sh_preproc", 11, 1],
        [/^[ \t]*#(?:[ \t]*[A-Za-z0-9_]*)/g, "sh_preproc", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 14],
        [/'/g, "sh_string", 15],
        [/\b(?:__asm|__cdecl|__declspec|__export|__far16|__fastcall|__fortran|__import|__pascal|__rtti|__stdcall|_asm|_cdecl|__except|_export|_far16|_fastcall|__finally|_fortran|_import|_pascal|_stdcall|__thread|__try|asm|auto|break|case|catch|cdecl|const|continue|default|do|else|enum|extern|for|goto|if|pascal|register|return|sizeof|static|struct|switch|typedef|union|volatile|while)\b/g, "sh_keyword", -1],
        [/\b(?:bool|char|double|float|int|long|short|signed|unsigned|void|wchar_t)\b/g, "sh_type", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1],
        [/([A-Za-z](?:[^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]|[_])*)((?:<.*>)?)(\s+(?=[*&]*[A-Za-z][^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]*\s*[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\[\]]+))/g, ["sh_usertype", "sh_usertype", "sh_normal"], -1]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 3, 1],
        [/<!DOCTYPE/g, "sh_preproc", 5, 1],
        [/<!--/g, "sh_comment", 6],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 7, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 7, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 4]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 4]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 6]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 4]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 3, 1],
        [/<!DOCTYPE/g, "sh_preproc", 5, 1],
        [/<!--/g, "sh_comment", 6],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 7, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 7, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/$/g, null, -2],
        [/</g, "sh_string", 12],
        [/"/g, "sh_string", 13],
        [/\/\/\//g, "sh_comment", 2],
        [/\/\//g, "sh_comment", 8],
        [/\/\*\*/g, "sh_comment", 9],
        [/\/\*/g, "sh_comment", 10]
    ],
    [
        [/$/g, null, -2],
        [/>/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/"/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/'/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/$/g, null, -2],
        [/[A-Za-z_][A-Za-z0-9_-]*/g, "sh_function", -1]
    ],
    [
        [/$/g, null, -2],
        [/[A-Za-z_][A-Za-z0-9_-]*/g, "sh_keyword", -1],
        [/"/g, "sh_string", 18],
        [/=/g, "sh_symbol", -1]
    ],
    [
        [/$/g, null, -2],
        [/"/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\{[A-Za-z_][A-Za-z0-9_-]*\}/g, "sh_type", -1],
        [/"/g, "sh_string", 13],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1]
    ],
    [
        [/^%%/g, "sh_preproc", 21, 1],
        [/<[A-Za-z_][A-Za-z0-9_-]*>/g, "sh_function", -1],
        [/"/g, "sh_string", 13],
        [/\\./g, "sh_preproc", -1],
        [/\{[A-Za-z_][A-Za-z0-9_-]*\}/g, "sh_type", -1],
        [/\/\*/g, "sh_comment", 22],
        [/\{/g, "sh_cbracket", 23, 1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1]
    ],
    [
        [/(\b(?:class|struct|typename))([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/\b(?:class|const_cast|delete|dynamic_cast|explicit|false|friend|inline|mutable|namespace|new|operator|private|protected|public|reinterpret_cast|static_cast|template|this|throw|true|try|typeid|typename|using|virtual)\b/g, "sh_keyword", -1],
        [/\/\/\//g, "sh_comment", 2],
        [/\/\//g, "sh_comment", 8],
        [/\/\*\*/g, "sh_comment", 9],
        [/\/\*/g, "sh_comment", 10],
        [/(\bstruct)([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/^[ \t]*#(?:[ \t]*include)/g, "sh_preproc", 11, 1],
        [/^[ \t]*#(?:[ \t]*[A-Za-z0-9_]*)/g, "sh_preproc", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 14],
        [/'/g, "sh_string", 15],
        [/\b(?:__asm|__cdecl|__declspec|__export|__far16|__fastcall|__fortran|__import|__pascal|__rtti|__stdcall|_asm|_cdecl|__except|_export|_far16|_fastcall|__finally|_fortran|_import|_pascal|_stdcall|__thread|__try|asm|auto|break|case|catch|cdecl|const|continue|default|do|else|enum|extern|for|goto|if|pascal|register|return|sizeof|static|struct|switch|typedef|union|volatile|while)\b/g, "sh_keyword", -1],
        [/\b(?:bool|char|double|float|int|long|short|signed|unsigned|void|wchar_t)\b/g, "sh_type", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1],
        [/([A-Za-z](?:[^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]|[_])*)((?:<.*>)?)(\s+(?=[*&]*[A-Za-z][^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]*\s*[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\[\]]+))/g, ["sh_usertype", "sh_usertype", "sh_normal"], -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/\/\*/g, "sh_comment", 22]
    ],
    [
        [/\}/g, "sh_cbracket", -2],
        [/\{/g, "sh_cbracket", 23, 1],
        [/\$./g, "sh_variable", -1],
        [/(\b(?:class|struct|typename))([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/\b(?:class|const_cast|delete|dynamic_cast|explicit|false|friend|inline|mutable|namespace|new|operator|private|protected|public|reinterpret_cast|static_cast|template|this|throw|true|try|typeid|typename|using|virtual)\b/g, "sh_keyword", -1],
        [/\/\/\//g, "sh_comment", 2],
        [/\/\//g, "sh_comment", 8],
        [/\/\*\*/g, "sh_comment", 9],
        [/\/\*/g, "sh_comment", 10],
        [/(\bstruct)([ \t]+)([A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/^[ \t]*#(?:[ \t]*include)/g, "sh_preproc", 11, 1],
        [/^[ \t]*#(?:[ \t]*[A-Za-z0-9_]*)/g, "sh_preproc", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 14],
        [/'/g, "sh_string", 15],
        [/\b(?:__asm|__cdecl|__declspec|__export|__far16|__fastcall|__fortran|__import|__pascal|__rtti|__stdcall|_asm|_cdecl|__except|_export|_far16|_fastcall|__finally|_fortran|_import|_pascal|_stdcall|__thread|__try|asm|auto|break|case|catch|cdecl|const|continue|default|do|else|enum|extern|for|goto|if|pascal|register|return|sizeof|static|struct|switch|typedef|union|volatile|while)\b/g, "sh_keyword", -1],
        [/\b(?:bool|char|double|float|int|long|short|signed|unsigned|void|wchar_t)\b/g, "sh_type", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1],
        [/([A-Za-z](?:[^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]|[_])*)((?:<.*>)?)(\s+(?=[*&]*[A-Za-z][^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]*\s*[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\[\]]+))/g, ["sh_usertype", "sh_usertype", "sh_normal"], -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.html = [
    [
        [/<\?xml/g, "sh_preproc", 1, 1],
        [/<!DOCTYPE/g, "sh_preproc", 3, 1],
        [/<!--/g, "sh_comment", 4],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 5, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 5, 1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 4]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.java = [
    [
        [/\b(?:import|package)\b/g, "sh_preproc", -1],
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 10],
        [/'/g, "sh_string", 11],
        [/(\b(?:class|interface))([ \t]+)([$A-Za-z0-9_]+)/g, ["sh_keyword", "sh_normal", "sh_classname"], -1],
        [/\b(?:abstract|assert|break|case|catch|class|const|continue|default|do|else|extends|false|final|finally|for|goto|if|implements|instanceof|interface|native|new|null|private|protected|public|return|static|strictfp|super|switch|synchronized|throw|throws|true|this|transient|try|volatile|while)\b/g, "sh_keyword", -1],
        [/\b(?:int|byte|boolean|char|long|float|double|short|void)\b/g, "sh_type", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1],
        [/([A-Za-z](?:[^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]|[_])*)((?:<.*>)?)(\s+(?=[*&]*[A-Za-z][^`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\s]*\s*[`~!@#$%&*()_=+{}|;:",<.>\/?'\\[\]\^\-\[\]]+))/g, ["sh_usertype", "sh_usertype", "sh_normal"], -1]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 5]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/"/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/'/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.javascript = [
    [
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9],
        [/\b(?:abstract|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|final|finally|for|function|goto|if|implements|in|instanceof|interface|native|new|null|private|protected|prototype|public|return|static|super|switch|synchronized|throw|throws|this|transient|true|try|typeof|var|volatile|while|with)\b/g, "sh_keyword", -1],
        [/(\+\+|--|\)|\])(\s*)(\/=?(?![*\/]))/g, ["sh_symbol", "sh_normal", "sh_symbol"], -1],
        [/(0x[A-Fa-f0-9]+|(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?)(\s*)(\/(?![*\/]))/g, ["sh_number", "sh_normal", "sh_symbol"], -1],
        [/([A-Za-z$_][A-Za-z0-9$_]*\s*)(\/=?(?![*\/]))/g, ["sh_normal", "sh_symbol"], -1],
        [/\/(?:\\.|[^*\\\/])(?:\\.|[^\\\/])*\/[gim]*/g, "sh_regexp", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 10],
        [/'/g, "sh_string", 11],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/\b(?:Math|Infinity|NaN|undefined|arguments)\b/g, "sh_predef_var", -1],
        [/\b(?:Array|Boolean|Date|Error|EvalError|Function|Number|Object|RangeError|ReferenceError|RegExp|String|SyntaxError|TypeError|URIError|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|isNaN|parseFloat|parseInt)\b/g, "sh_predef_func", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 5]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/"/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/'/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.javascript_dom = [
    [
        [/\/\/\//g, "sh_comment", 1],
        [/\/\//g, "sh_comment", 7],
        [/\/\*\*/g, "sh_comment", 8],
        [/\/\*/g, "sh_comment", 9],
        [/\b(?:abstract|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|final|finally|for|function|goto|if|implements|in|instanceof|interface|native|new|null|private|protected|prototype|public|return|static|super|switch|synchronized|throw|throws|this|transient|true|try|typeof|var|volatile|while|with)\b/g, "sh_keyword", -1],
        [/(\+\+|--|\)|\])(\s*)(\/=?(?![*\/]))/g, ["sh_symbol", "sh_normal", "sh_symbol"], -1],
        [/(0x[A-Fa-f0-9]+|(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?)(\s*)(\/(?![*\/]))/g, ["sh_number", "sh_normal", "sh_symbol"], -1],
        [/([A-Za-z$_][A-Za-z0-9$_]*\s*)(\/=?(?![*\/]))/g, ["sh_normal", "sh_symbol"], -1],
        [/\/(?:\\.|[^*\\\/])(?:\\.|[^\\\/])*\/[gim]*/g, "sh_regexp", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 10],
        [/'/g, "sh_string", 11],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/\b(?:Math|Infinity|NaN|undefined|arguments)\b/g, "sh_predef_var", -1],
        [/\b(?:Array|Boolean|Date|Error|EvalError|Function|Number|Object|RangeError|ReferenceError|RegExp|String|SyntaxError|TypeError|URIError|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|isNaN|parseFloat|parseInt)\b/g, "sh_predef_func", -1],
        [/\b(?:applicationCache|closed|Components|content|controllers|crypto|defaultStatus|dialogArguments|directories|document|frameElement|frames|fullScreen|globalStorage|history|innerHeight|innerWidth|length|location|locationbar|menubar|name|navigator|opener|outerHeight|outerWidth|pageXOffset|pageYOffset|parent|personalbar|pkcs11|returnValue|screen|availTop|availLeft|availHeight|availWidth|colorDepth|height|left|pixelDepth|top|width|screenX|screenY|scrollbars|scrollMaxX|scrollMaxY|scrollX|scrollY|self|sessionStorage|sidebar|status|statusbar|toolbar|top|window)\b/g, "sh_predef_var", -1],
        [/\b(?:alert|addEventListener|atob|back|blur|btoa|captureEvents|clearInterval|clearTimeout|close|confirm|dump|escape|find|focus|forward|getAttention|getComputedStyle|getSelection|home|moveBy|moveTo|open|openDialog|postMessage|print|prompt|releaseEvents|removeEventListener|resizeBy|resizeTo|scroll|scrollBy|scrollByLines|scrollByPages|scrollTo|setInterval|setTimeout|showModalDialog|sizeToContent|stop|unescape|updateCommands|onabort|onbeforeunload|onblur|onchange|onclick|onclose|oncontextmenu|ondragdrop|onerror|onfocus|onkeydown|onkeypress|onkeyup|onload|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onpaint|onreset|onresize|onscroll|onselect|onsubmit|onunload)\b/g, "sh_predef_func", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 5]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 3]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 2, 1],
        [/<!DOCTYPE/g, "sh_preproc", 4, 1],
        [/<!--/g, "sh_comment", 5],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 6, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 6, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/"/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/'/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.perl = [
    [
        [/\b(?:import)\b/g, "sh_preproc", -1],
        [/(s)(\{(?:\\\}|[^}])*\}\{(?:\\\}|[^}])*\})([ixsmogce]*)/g, ["sh_keyword", "sh_regexp", "sh_keyword"], -1],
        [/(s)(\((?:\\\)|[^)])*\)\((?:\\\)|[^)])*\))([ixsmogce]*)/g, ["sh_keyword", "sh_regexp", "sh_keyword"], -1],
        [/(s)(\[(?:\\\]|[^\]])*\]\[(?:\\\]|[^\]])*\])([ixsmogce]*)/g, ["sh_keyword", "sh_regexp", "sh_keyword"], -1],
        [/(s)(<.*><.*>)([ixsmogce]*)/g, ["sh_keyword", "sh_regexp", "sh_keyword"], -1],
        [/(q(?:q?))(\{(?:\\\}|[^}])*\})/g, ["sh_keyword", "sh_string"], -1],
        [/(q(?:q?))(\((?:\\\)|[^)])*\))/g, ["sh_keyword", "sh_string"], -1],
        [/(q(?:q?))(\[(?:\\\]|[^\]])*\])/g, ["sh_keyword", "sh_string"], -1],
        [/(q(?:q?))(<.*>)/g, ["sh_keyword", "sh_string"], -1],
        [/(q(?:q?))([^A-Za-z0-9 \t])(.*\2)/g, ["sh_keyword", "sh_string", "sh_string"], -1],
        [/(s)([^A-Za-z0-9 \t])(.*\2.*\2)([ixsmogce]*(?=[ \t]*(?:\)|;)))/g, ["sh_keyword", "sh_regexp", "sh_regexp", "sh_keyword"], -1],
        [/(s)([^A-Za-z0-9 \t])(.*\2[ \t]*)([^A-Za-z0-9 \t])(.*\4)([ixsmogce]*(?=[ \t]*(?:\)|;)))/g, ["sh_keyword", "sh_regexp", "sh_regexp", "sh_regexp", "sh_regexp", "sh_keyword"], -1],
        [/#/g, "sh_comment", 1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/(?:m|qr)(?=\{)/g, "sh_keyword", 2],
        [/(?:m|qr)(?=#)/g, "sh_keyword", 4],
        [/(?:m|qr)(?=\|)/g, "sh_keyword", 6],
        [/(?:m|qr)(?=@)/g, "sh_keyword", 8],
        [/(?:m|qr)(?=<)/g, "sh_keyword", 10],
        [/(?:m|qr)(?=\[)/g, "sh_keyword", 12],
        [/(?:m|qr)(?=\\)/g, "sh_keyword", 14],
        [/(?:m|qr)(?=\/)/g, "sh_keyword", 16],
        [/"/g, "sh_string", 18],
        [/'/g, "sh_string", 19],
        [/</g, "sh_string", 20],
        [/\/[^\n]*\//g, "sh_string", -1],
        [/\b(?:chomp|chop|chr|crypt|hex|i|index|lc|lcfirst|length|oct|ord|pack|q|qq|reverse|rindex|sprintf|substr|tr|uc|ucfirst|m|s|g|qw|abs|atan2|cos|exp|hex|int|log|oct|rand|sin|sqrt|srand|my|local|our|delete|each|exists|keys|values|pack|read|syscall|sysread|syswrite|unpack|vec|undef|unless|return|length|grep|sort|caller|continue|dump|eval|exit|goto|last|next|redo|sub|wantarray|pop|push|shift|splice|unshift|split|switch|join|defined|foreach|last|chop|chomp|bless|dbmclose|dbmopen|ref|tie|tied|untie|while|next|map|eq|die|cmp|lc|uc|and|do|if|else|elsif|for|use|require|package|import|chdir|chmod|chown|chroot|fcntl|glob|ioctl|link|lstat|mkdir|open|opendir|readlink|rename|rmdir|stat|symlink|umask|unlink|utime|binmode|close|closedir|dbmclose|dbmopen|die|eof|fileno|flock|format|getc|print|printf|read|readdir|rewinddir|seek|seekdir|select|syscall|sysread|sysseek|syswrite|tell|telldir|truncate|warn|write|alarm|exec|fork|getpgrp|getppid|getpriority|kill|pipe|qx|setpgrp|setpriority|sleep|system|times|x|wait|waitpid)\b/g, "sh_keyword", -1],
        [/^\=(?:head1|head2|item)/g, "sh_comment", 21],
        [/(?:\$[#]?|@|%)[\/A-Za-z0-9_]+/g, "sh_variable", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\{/g, "sh_regexp", 3]
    ],
    [
        [/[ \t]+#.*/g, "sh_comment", -1],
        [/\$(?:[A-Za-z0-9_]+|\{[A-Za-z0-9_]+\})/g, "sh_variable", -1],
        [/\\\{|\\\}|\}/g, "sh_regexp", -3]
    ],
    [
        [/#/g, "sh_regexp", 5]
    ],
    [
        [/[ \t]+#.*/g, "sh_comment", -1],
        [/\$(?:[A-Za-z0-9_]+|\{[A-Za-z0-9_]+\})/g, "sh_variable", -1],
        [/\\#|#/g, "sh_regexp", -3]
    ],
    [
        [/\|/g, "sh_regexp", 7]
    ],
    [
        [/[ \t]+#.*/g, "sh_comment", -1],
        [/\$(?:[A-Za-z0-9_]+|\{[A-Za-z0-9_]+\})/g, "sh_variable", -1],
        [/\\\||\|/g, "sh_regexp", -3]
    ],
    [
        [/@/g, "sh_regexp", 9]
    ],
    [
        [/[ \t]+#.*/g, "sh_comment", -1],
        [/\$(?:[A-Za-z0-9_]+|\{[A-Za-z0-9_]+\})/g, "sh_variable", -1],
        [/\\@|@/g, "sh_regexp", -3]
    ],
    [
        [/</g, "sh_regexp", 11]
    ],
    [
        [/[ \t]+#.*/g, "sh_comment", -1],
        [/\$(?:[A-Za-z0-9_]+|\{[A-Za-z0-9_]+\})/g, "sh_variable", -1],
        [/\\<|\\>|>/g, "sh_regexp", -3]
    ],
    [
        [/\[/g, "sh_regexp", 13]
    ],
    [
        [/[ \t]+#.*/g, "sh_comment", -1],
        [/\$(?:[A-Za-z0-9_]+|\{[A-Za-z0-9_]+\})/g, "sh_variable", -1],
        [/\\]|\]/g, "sh_regexp", -3]
    ],
    [
        [/\\/g, "sh_regexp", 15]
    ],
    [
        [/[ \t]+#.*/g, "sh_comment", -1],
        [/\$(?:[A-Za-z0-9_]+|\{[A-Za-z0-9_]+\})/g, "sh_variable", -1],
        [/\\\\|\\/g, "sh_regexp", -3]
    ],
    [
        [/\//g, "sh_regexp", 17]
    ],
    [
        [/[ \t]+#.*/g, "sh_comment", -1],
        [/\$(?:[A-Za-z0-9_]+|\{[A-Za-z0-9_]+\})/g, "sh_variable", -1],
        [/\\\/|\//g, "sh_regexp", -3]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|')/g, null, -1],
        [/'/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/>/g, "sh_string", -2]
    ],
    [
        [/\=cut/g, "sh_comment", -2]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.php = [
    [
        [/\b(?:include|include_once|require|require_once)\b/g, "sh_preproc", -1],
        [/\/\//g, "sh_comment", 1],
        [/#/g, "sh_comment", 1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 2],
        [/'/g, "sh_string", 3],
        [/\b(?:and|or|xor|__FILE__|exception|php_user_filter|__LINE__|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|each|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|for|foreach|function|global|if|isset|list|new|old_function|print|return|static|switch|unset|use|var|while|__FUNCTION__|__CLASS__|__METHOD__)\b/g, "sh_keyword", -1],
        [/\/\/\//g, "sh_comment", 4],
        [/\/\//g, "sh_comment", 1],
        [/\/\*\*/g, "sh_comment", 9],
        [/\/\*/g, "sh_comment", 10],
        [/(?:\$[#]?|@|%)[A-Za-z0-9_]+/g, "sh_variable", -1],
        [/<\?php|~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\{|\}/g, "sh_cbracket", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/\\(?:\\|')/g, null, -1],
        [/'/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 5, 1],
        [/<!DOCTYPE/g, "sh_preproc", 6, 1],
        [/<!--/g, "sh_comment", 7],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 8, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 8, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 7]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 5, 1],
        [/<!DOCTYPE/g, "sh_preproc", 6, 1],
        [/<!--/g, "sh_comment", 7],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 8, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 8, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.python = [
    [
        [/\b(?:import|from)\b/g, "sh_preproc", -1],
        [/#/g, "sh_comment", 1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/\b(?:and|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|global|if|in|is|lambda|not|or|pass|print|raise|return|try|while)\b/g, "sh_keyword", -1],
        [/^(?:[\s]*'{3})/g, "sh_comment", 2],
        [/^(?:[\s]*\"{3})/g, "sh_comment", 3],
        [/^(?:[\s]*'(?:[^\\']|\\.)*'[\s]*|[\s]*\"(?:[^\\\"]|\\.)*\"[\s]*)$/g, "sh_comment", -1],
        [/(?:[\s]*'{3})/g, "sh_string", 4],
        [/(?:[\s]*\"{3})/g, "sh_string", 5],
        [/"/g, "sh_string", 6],
        [/'/g, "sh_string", 7],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\||\{|\}/g, "sh_symbol", -1],
        [/(?:[A-Za-z]|_)[A-Za-z0-9_]*(?=[ \t]*\()/g, "sh_function", -1]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/(?:'{3})/g, "sh_comment", -2]
    ],
    [
        [/(?:\"{3})/g, "sh_comment", -2]
    ],
    [
        [/(?:'{3})/g, "sh_string", -2]
    ],
    [
        [/(?:\"{3})/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|')/g, null, -1],
        [/'/g, "sh_string", -2]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.ruby = [
    [
        [/\b(?:require)\b/g, "sh_preproc", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1],
        [/"/g, "sh_string", 1],
        [/'/g, "sh_string", 2],
        [/</g, "sh_string", 3],
        [/\/[^\n]*\//g, "sh_regexp", -1],
        [/(%r)(\{(?:\\\}|#\{[A-Za-z0-9]+\}|[^}])*\})/g, ["sh_symbol", "sh_regexp"], -1],
        [/\b(?:alias|begin|BEGIN|break|case|defined|do|else|elsif|end|END|ensure|for|if|in|include|loop|next|raise|redo|rescue|retry|return|super|then|undef|unless|until|when|while|yield|false|nil|self|true|__FILE__|__LINE__|and|not|or|def|class|module|catch|fail|load|throw)\b/g, "sh_keyword", -1],
        [/(?:^\=begin)/g, "sh_comment", 4],
        [/(?:\$[#]?|@@|@)(?:[A-Za-z0-9_]+|'|\"|\/)/g, "sh_type", -1],
        [/[A-Za-z0-9]+(?:\?|!)/g, "sh_normal", -1],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/(#)(\{)/g, ["sh_symbol", "sh_cbracket"], -1],
        [/#/g, "sh_comment", 5],
        [/\{|\}/g, "sh_cbracket", -1]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/\\(?:\\|')/g, null, -1],
        [/'/g, "sh_string", -2]
    ],
    [
        [/$/g, null, -2],
        [/>/g, "sh_string", -2]
    ],
    [
        [/^(?:\=end)/g, "sh_comment", -2]
    ],
    [
        [/$/g, null, -2]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.sql = [
    [
        [/\b(?:VARCHAR|TINYINT|TEXT|DATE|SMALLINT|MEDIUMINT|INT|BIGINT|FLOAT|DOUBLE|DECIMAL|DATETIME|TIMESTAMP|TIME|YEAR|UNSIGNED|CHAR|TINYBLOB|TINYTEXT|BLOB|MEDIUMBLOB|MEDIUMTEXT|LONGBLOB|LONGTEXT|ENUM|BOOL|BINARY|VARBINARY)\b/gi, "sh_type", -1],
        [/\b(?:ALL|ASC|AS|ALTER|AND|ADD|AUTO_INCREMENT|BETWEEN|BINARY|BOTH|BY|BOOLEAN|CHANGE|CHECK|COLUMNS|COLUMN|CROSS|CREATE|DATABASES|DATABASE|DATA|DELAYED|DESCRIBE|DESC|DISTINCT|DELETE|DROP|DEFAULT|ENCLOSED|ESCAPED|EXISTS|EXPLAIN|FIELDS|FIELD|FLUSH|FOR|FOREIGN|FUNCTION|FROM|GROUP|GRANT|HAVING|IGNORE|INDEX|INFILE|INSERT|INNER|INTO|IDENTIFIED|IN|IS|IF|JOIN|KEYS|KILL|KEY|LEADING|LIKE|LIMIT|LINES|LOAD|LOCAL|LOCK|LOW_PRIORITY|LEFT|LANGUAGE|MODIFY|NATURAL|NOT|NULL|NEXTVAL|OPTIMIZE|OPTION|OPTIONALLY|ORDER|OUTFILE|OR|OUTER|ON|PROCEDURE|PROCEDURAL|PRIMARY|READ|REFERENCES|REGEXP|RENAME|REPLACE|RETURN|REVOKE|RLIKE|RIGHT|SHOW|SONAME|STATUS|STRAIGHT_JOIN|SELECT|SETVAL|SET|TABLES|TERMINATED|TO|TRAILING|TRUNCATE|TABLE|TEMPORARY|TRIGGER|TRUSTED|UNIQUE|UNLOCK|USE|USING|UPDATE|VALUES|VARIABLES|VIEW|WITH|WRITE|WHERE|ZEROFILL|TYPE|XOR)\b/gi, "sh_keyword", -1],
        [/"/g, "sh_string", 1],
        [/'/g, "sh_string", 2],
        [/`/g, "sh_string", 3],
        [/#/g, "sh_comment", 4],
        [/\/\/\//g, "sh_comment", 5],
        [/\/\//g, "sh_comment", 4],
        [/\/\*\*/g, "sh_comment", 11],
        [/\/\*/g, "sh_comment", 12],
        [/--/g, "sh_comment", 4],
        [/~|!|%|\^|\*|\(|\)|-|\+|=|\[|\]|\\|:|;|,|\.|\/|\?|&|<|>|\|/g, "sh_symbol", -1],
        [/\b[+-]?(?:(?:0x[A-Fa-f0-9]+)|(?:(?:[\d]*\.)?[\d]+(?:[eE][+-]?[\d]+)?))u?(?:(?:int(?:8|16|32|64))|L)?\b/g, "sh_number", -1]
    ],
    [
        [/"/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/'/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/`/g, "sh_string", -2],
        [/\\./g, "sh_specialchar", -1]
    ],
    [
        [/$/g, null, -2]
    ],
    [
        [/$/g, null, -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 6, 1],
        [/<!DOCTYPE/g, "sh_preproc", 8, 1],
        [/<!--/g, "sh_comment", 9],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 10, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 10, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 7]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 7]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 9]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 7]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/<\?xml/g, "sh_preproc", 6, 1],
        [/<!DOCTYPE/g, "sh_preproc", 8, 1],
        [/<!--/g, "sh_comment", 9],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 10, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z][A-Za-z0-9]*/g, "sh_keyword", 10, 1],
        [/@[A-Za-z]+/g, "sh_type", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ],
    [
        [/\*\//g, "sh_comment", -2],
        [/(?:<?)[A-Za-z0-9_\.\/\-_~]+@[A-Za-z0-9_\.\/\-_~]+(?:>?)|(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_~]+(?:>?)/g, "sh_url", -1],
        [/(?:TODO|FIXME|BUG)(?:[:]?)/g, "sh_todo", -1]
    ]
], this.sh_languages || (this.sh_languages = {}), sh_languages.url = [
    [{
        regex: /(?:<?)[A-Za-z0-9_\.\/\-_]+@[A-Za-z0-9_\.\/\-_]+(?:>?)/g,
        style: "sh_url"
    }, {
        regex: /(?:<?)[A-Za-z0-9_]+:\/\/[A-Za-z0-9_\.\/\-_]+(?:>?)/g,
        style: "sh_url"
    }]
], this.sh_languages || (this.sh_languages = {}), sh_languages.xml = [
    [
        [/<\?xml/g, "sh_preproc", 1, 1],
        [/<!DOCTYPE/g, "sh_preproc", 3, 1],
        [/<!--/g, "sh_comment", 4],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)(?:\/)?>/g, "sh_keyword", -1],
        [/<(?:\/)?[A-Za-z](?:[A-Za-z0-9_:.-]*)/g, "sh_keyword", 5, 1],
        [/&(?:[A-Za-z0-9]+);/g, "sh_preproc", -1]
    ],
    [
        [/\?>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ],
    [
        [/\\(?:\\|")/g, null, -1],
        [/"/g, "sh_string", -2]
    ],
    [
        [/>/g, "sh_preproc", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ],
    [
        [/-->/g, "sh_comment", -2],
        [/<!--/g, "sh_comment", 4]
    ],
    [
        [/(?:\/)?>/g, "sh_keyword", -2],
        [/([^=" \t>]+)([ \t]*)(=?)/g, ["sh_type", "sh_normal", "sh_symbol"], -1],
        [/"/g, "sh_string", 2]
    ]
], $(document).ready(function() {
    var e = 1e3,
        t = "easeInOutCubic",
        n = {
            menu: !1,
            showNum: !1,
            style: "vim"
        };
    $(":input").placeholder(), $(".mobile-menu-toggle").on("click", function(e) {
        e.preventDefault(), $("header > nav").toggleClass("mobile-menu-open")
    }), $("header > nav .signup").on("click", function() {
        $("header > nav").removeClass("mobile-menu-open")
    }), $(".docs-nav").find('a[href$="' + location.pathname + '"]').parent().addClass("current-page"), $('a[href^="#"]').not("[data-toggle]").on("click", function(n) {
        var s = $($(this).attr("href")),
            r = $("header").outerHeight();
        s.length && (n.preventDefault(), $("html, body").animate({
            scrollTop: s.offset().top - 1.4 * r
        }, e, t))
    }), window.isCMS || ($("pre.css").snippet("css", n), $("pre.html").snippet("html", n), $("pre.javascript").snippet("javascript", n), $("pre.php").snippet("php", n), $("pre.xml").snippet("xml", n)), $('a[href="/signup"]').on("click", function(n) {
        var s = $("#signup-form"),
            r = $("header").outerHeight();
        s.length && (n.preventDefault(), $("html, body").animate({
            scrollTop: s.offset().top - 1.4 * r
        }, e, t, function() {
            s.find(":input:first").focus()
        }))
    }), $("#signup-form").on("submit", function(e) {
        var t = $(this);
        e.preventDefault(), t.hasClass("form-busy") || (t.addClass("form-busy", !0).find(".signup-feedback").addClass("hidden"), $.ajax({
            url: t.attr("data-jsonp"),
            data: t.serialize(),
            dataType: "jsonp",
            jsonp: "signupResponse"
        }))
    }), signupResponse = function(e) {
        var t = $("#signup-form"),
            n = t.find('input[name="name"]'),
            s = t.find('input[name="email"]'),
            r = t.find('input[name="password"]');
        return t.removeClass("form-busy"), "success" === e.status ? void(location.href = "/signup-complete") : (n.parent().toggleClass("has-error", $.inArray("name", e.invalid) > -1), s.parent().toggleClass("has-error", $.inArray("email", e.invalid) > -1), r.parent().toggleClass("has-error", $.inArray("password", e.invalid) > -1), t.find(".signup-feedback").text(e.feedback).removeClass("hidden").end().find(".has-error .form-control:first").focus(), void 0)
    }, $("#contact-form").on("submit", function(e) {
        var t = $("#contact-form"),
            n = t.find(".feedback"),
            s = t.find('input[name="name"]'),
            r = t.find('input[name="email"]'),
            o = t.find('textarea[name="message"]');
        e.preventDefault(), t.hasClass("form-busy") || (t.addClass("form-busy", !0).find(".contact-feedback").addClass("hidden"), $.post("/src/ajax/surreal.ajax.php", t.serialize(), function(e) {
            t.removeClass("form-busy"), "success" === e.status ? (t.find(":input").prop("disabled", !0), n.removeClass("alert-danger hidden").addClass("alert-success").text(e.feedback)) : (s.parent().toggleClass("has-error", $.inArray("name", e.invalid) > -1), r.parent().toggleClass("has-error", $.inArray("email", e.invalid) > -1), o.parent().toggleClass("has-error", $.inArray("message", e.invalid) > -1), t.find(".has-error .form-control:first").focus(), n.text(e.feedback).removeClass("alert-success hidden").addClass("alert-danger"))
        }, "json"))
    })
});

