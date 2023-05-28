var bn =
    typeof globalThis != "undefined"
      ? globalThis
      : typeof window != "undefined"
      ? window
      : typeof global != "undefined"
      ? global
      : typeof self != "undefined"
      ? self
      : {},
  cn = { exports: {} };
/*!
 * headroom.js v0.12.0 - Give your page some headroom. Hide your header until you need it
 * Copyright (c) 2020 Nick Williams - http://wicky.nillia.ms/headroom.js
 * License: MIT
 */ (function (t, e) {
  (function (n, i) {
    t.exports = i();
  })(bn, function () {
    function n() {
      return typeof window != "undefined";
    }
    function i() {
      var f = !1;
      try {
        var h = {
          get passive() {
            f = !0;
          },
        };
        window.addEventListener("test", h, h),
          window.removeEventListener("test", h, h);
      } catch (y) {
        f = !1;
      }
      return f;
    }
    function r() {
      return !!(
        n() &&
        function () {}.bind &&
        "classList" in document.documentElement &&
        Object.assign &&
        Object.keys &&
        requestAnimationFrame
      );
    }
    function s(f) {
      return f.nodeType === 9;
    }
    function a(f) {
      return f && f.document && s(f.document);
    }
    function d(f) {
      var h = f.document,
        y = h.body,
        m = h.documentElement;
      return {
        scrollHeight: function () {
          return Math.max(
            y.scrollHeight,
            m.scrollHeight,
            y.offsetHeight,
            m.offsetHeight,
            y.clientHeight,
            m.clientHeight
          );
        },
        height: function () {
          return f.innerHeight || m.clientHeight || y.clientHeight;
        },
        scrollY: function () {
          return f.pageYOffset !== void 0
            ? f.pageYOffset
            : (m || y.parentNode || y).scrollTop;
        },
      };
    }
    function c(f) {
      return {
        scrollHeight: function () {
          return Math.max(f.scrollHeight, f.offsetHeight, f.clientHeight);
        },
        height: function () {
          return Math.max(f.offsetHeight, f.clientHeight);
        },
        scrollY: function () {
          return f.scrollTop;
        },
      };
    }
    function o(f) {
      return a(f) ? d(f) : c(f);
    }
    function l(f, h, y) {
      var m = i(),
        g,
        b = !1,
        w = o(f),
        C = w.scrollY(),
        M = {};
      function D() {
        var $ = Math.round(w.scrollY()),
          E = w.height(),
          x = w.scrollHeight();
        (M.scrollY = $),
          (M.lastScrollY = C),
          (M.direction = $ > C ? "down" : "up"),
          (M.distance = Math.abs($ - C)),
          (M.isOutOfBounds = $ < 0 || $ + E > x),
          (M.top = $ <= h.offset[M.direction]),
          (M.bottom = $ + E >= x),
          (M.toleranceExceeded = M.distance > h.tolerance[M.direction]),
          y(M),
          (C = $),
          (b = !1);
      }
      function P() {
        b || ((b = !0), (g = requestAnimationFrame(D)));
      }
      var v = m ? { passive: !0, capture: !1 } : !1;
      return (
        f.addEventListener("scroll", P, v),
        D(),
        {
          destroy: function () {
            cancelAnimationFrame(g), f.removeEventListener("scroll", P, v);
          },
        }
      );
    }
    function u(f) {
      return f === Object(f) ? f : { down: f, up: f };
    }
    function p(f, h) {
      (h = h || {}),
        Object.assign(this, p.options, h),
        (this.classes = Object.assign({}, p.options.classes, h.classes)),
        (this.elem = f),
        (this.tolerance = u(this.tolerance)),
        (this.offset = u(this.offset)),
        (this.initialised = !1),
        (this.frozen = !1);
    }
    return (
      (p.prototype = {
        constructor: p,
        init: function () {
          return (
            p.cutsTheMustard &&
              !this.initialised &&
              (this.addClass("initial"),
              (this.initialised = !0),
              setTimeout(
                function (f) {
                  f.scrollTracker = l(
                    f.scroller,
                    { offset: f.offset, tolerance: f.tolerance },
                    f.update.bind(f)
                  );
                },
                100,
                this
              )),
            this
          );
        },
        destroy: function () {
          (this.initialised = !1),
            Object.keys(this.classes).forEach(this.removeClass, this),
            this.scrollTracker.destroy();
        },
        unpin: function () {
          (this.hasClass("pinned") || !this.hasClass("unpinned")) &&
            (this.addClass("unpinned"),
            this.removeClass("pinned"),
            this.onUnpin && this.onUnpin.call(this));
        },
        pin: function () {
          this.hasClass("unpinned") &&
            (this.addClass("pinned"),
            this.removeClass("unpinned"),
            this.onPin && this.onPin.call(this));
        },
        freeze: function () {
          (this.frozen = !0), this.addClass("frozen");
        },
        unfreeze: function () {
          (this.frozen = !1), this.removeClass("frozen");
        },
        top: function () {
          this.hasClass("top") ||
            (this.addClass("top"),
            this.removeClass("notTop"),
            this.onTop && this.onTop.call(this));
        },
        notTop: function () {
          this.hasClass("notTop") ||
            (this.addClass("notTop"),
            this.removeClass("top"),
            this.onNotTop && this.onNotTop.call(this));
        },
        bottom: function () {
          this.hasClass("bottom") ||
            (this.addClass("bottom"),
            this.removeClass("notBottom"),
            this.onBottom && this.onBottom.call(this));
        },
        notBottom: function () {
          this.hasClass("notBottom") ||
            (this.addClass("notBottom"),
            this.removeClass("bottom"),
            this.onNotBottom && this.onNotBottom.call(this));
        },
        shouldUnpin: function (f) {
          var h = f.direction === "down";
          return h && !f.top && f.toleranceExceeded;
        },
        shouldPin: function (f) {
          var h = f.direction === "up";
          return (h && f.toleranceExceeded) || f.top;
        },
        addClass: function (f) {
          this.elem.classList.add.apply(
            this.elem.classList,
            this.classes[f].split(" ")
          );
        },
        removeClass: function (f) {
          this.elem.classList.remove.apply(
            this.elem.classList,
            this.classes[f].split(" ")
          );
        },
        hasClass: function (f) {
          return this.classes[f].split(" ").every(function (h) {
            return this.classList.contains(h);
          }, this.elem);
        },
        update: function (f) {
          f.isOutOfBounds ||
            (this.frozen !== !0 &&
              (f.top ? this.top() : this.notTop(),
              f.bottom ? this.bottom() : this.notBottom(),
              this.shouldUnpin(f)
                ? this.unpin()
                : this.shouldPin(f) && this.pin()));
        },
      }),
      (p.options = {
        tolerance: { up: 0, down: 0 },
        offset: 0,
        scroller: n() ? window : null,
        classes: {
          frozen: "headroom--frozen",
          pinned: "headroom--pinned",
          unpinned: "headroom--unpinned",
          top: "headroom--top",
          notTop: "headroom--not-top",
          bottom: "headroom--bottom",
          notBottom: "headroom--not-bottom",
          initial: "headroom",
        },
      }),
      (p.cutsTheMustard = r()),
      p
    );
  });
})(cn);
var Sn = cn.exports;
const qe = document.querySelector(".main-header"),
  xt = document.body,
  En = qe.offsetHeight,
  Cn = document.querySelector(".btn-menu"),
  Tn = document.querySelectorAll(".header-nav__items a[href^='#']");
Cn.addEventListener("click", function () {
  xt.classList.toggle("menu--active"),
    xt.classList.contains("menu--active")
      ? qe.classList.add("main-header--pinned")
      : qe.classList.remove("main-header--pinned");
});
Tn.forEach((t) => {
  t.addEventListener("click", function (e) {
    e.preventDefault(),
      kt.freeze(),
      window.matchMedia("(min-width: 992px)").matches
        ? setTimeout(i, 0)
        : setTimeout(i, 500);
    let n = t.getAttribute("href");
    xt.classList.remove("menu--active");
    function i() {
      let r = document.querySelector(n).offsetTop - En;
      window.scroll({ top: r, behavior: "smooth" });
    }
  });
});
document.addEventListener("wheel", function () {
  kt.unfreeze();
});
window.location.hash && qe.classList.add("main-header--unpinned");
let kt = new Sn(qe, {
  tolerance: { down: 0, up: 0 },
  offset: 0,
  classes: {
    initial: "main-header",
    pinned: "main-header--pinned",
    unpinned: "main-header--unpinned",
  },
});
kt.init();
const xn = document.querySelectorAll(".date-day");
document.querySelectorAll(".date-day--en");
const we = document.querySelector(".date-month");
document.querySelector(".date-month--en");
const Ot = document.querySelector(".date-year");
document.querySelector(".date-year--en");
const Ln = 24 * 60 * 60 * 1e3;
let dt = new Date(),
  kn = dt.getTime(),
  xe = dt.getDate(),
  ae = dt.getMonth(),
  ft = dt.getFullYear();
const Le = [
  "\u044F\u043D\u0432\u0430\u0440\u044F",
  "\u0444\u0435\u0432\u0440\u0430\u043B\u044F",
  "\u043C\u0430\u0440\u0442\u0430",
  "\u0430\u043F\u0440\u0435\u043B\u044F",
  "\u043C\u0430\u044F",
  "\u0438\u044E\u043D\u044F",
  "\u0438\u044E\u043B\u044F",
  "\u0430\u0432\u0433\u0443\u0441\u0442\u0430",
  "\u0441\u0435\u043D\u0442\u044F\u0431\u0440\u044F",
  "\u043E\u043A\u0442\u044F\u0431\u0440\u044F",
  "\u043D\u043E\u044F\u0431\u0440\u044F",
  "\u0434\u0435\u043A\u0430\u0431\u0440\u044F",
];
function Pn() {
  for (let i = 0; i < 7; i++) {
    let r = new Date(kn + Ln * i);
    i === 6 && (xn[i].textContent = t(r));
  }
  function t(i) {
    return i.getDate();
  }
  let n = new Date(ft, ae + 1, 0).getDate();
  (n == 28 && xe >= 23) ||
  (n == 29 && xe >= 24) ||
  (n == 30 && xe >= 25) ||
  (n == 31 && xe >= 26)
    ? (we.textContent = Le[ae + 1])
    : (we.textContent = Le[ae]),
    xe >= 25 && ae == 11 ? (Ot.textContent = ft + 1) : (Ot.textContent = ft);
}
we != null && Pn();
/*! medium-zoom 1.0.6 | MIT License | https://github.com/francoischalifour/medium-zoom */ var ue =
    Object.assign ||
    function (t) {
      for (var e = 1; e < arguments.length; e++) {
        var n = arguments[e];
        for (var i in n)
          Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
      }
      return t;
    },
  He = function (e) {
    return e.tagName === "IMG";
  },
  Mn = function (e) {
    return NodeList.prototype.isPrototypeOf(e);
  },
  lt = function (e) {
    return e && e.nodeType === 1;
  },
  Dt = function (e) {
    var n = e.currentSrc || e.src;
    return n.substr(-4).toLowerCase() === ".svg";
  },
  zt = function (e) {
    try {
      return Array.isArray(e)
        ? e.filter(He)
        : Mn(e)
        ? [].slice.call(e).filter(He)
        : lt(e)
        ? [e].filter(He)
        : typeof e == "string"
        ? [].slice.call(document.querySelectorAll(e)).filter(He)
        : [];
    } catch (n) {
      throw new TypeError(`The provided selector is invalid.
Expects a CSS selector, a Node element, a NodeList or an array.
See: https://github.com/francoischalifour/medium-zoom`);
    }
  },
  On = function (e) {
    var n = document.createElement("div");
    return n.classList.add("medium-zoom-overlay"), (n.style.background = e), n;
  },
  Dn = function (e) {
    var n = e.getBoundingClientRect(),
      i = n.top,
      r = n.left,
      s = n.width,
      a = n.height,
      d = e.cloneNode(),
      c =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0,
      o =
        window.pageXOffset ||
        document.documentElement.scrollLeft ||
        document.body.scrollLeft ||
        0;
    return (
      d.removeAttribute("id"),
      (d.style.position = "absolute"),
      (d.style.top = i + c + "px"),
      (d.style.left = r + o + "px"),
      (d.style.width = s + "px"),
      (d.style.height = a + "px"),
      (d.style.transform = ""),
      d
    );
  },
  ge = function (e, n) {
    var i = ue({ bubbles: !1, cancelable: !1, detail: void 0 }, n);
    if (typeof window.CustomEvent == "function") return new CustomEvent(e, i);
    var r = document.createEvent("CustomEvent");
    return r.initCustomEvent(e, i.bubbles, i.cancelable, i.detail), r;
  },
  zn = function t(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
      i =
        window.Promise ||
        function (S) {
          function k() {}
          S(k, k);
        },
      r = function (S) {
        var k = S.target;
        if (k === $) {
          h();
          return;
        }
        w.indexOf(k) !== -1 && y({ target: k });
      },
      s = function () {
        if (!(M || !v.original)) {
          var S =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;
          Math.abs(D - S) > P.scrollOffset && setTimeout(h, 150);
        }
      },
      a = function (S) {
        var k = S.key || S.keyCode;
        (k === "Escape" || k === "Esc" || k === 27) && h();
      },
      d = function () {
        var S =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
          k = S;
        if (
          (S.background && ($.style.background = S.background),
          S.container &&
            S.container instanceof Object &&
            (k.container = ue({}, P.container, S.container)),
          S.template)
        ) {
          var O = lt(S.template)
            ? S.template
            : document.querySelector(S.template);
          k.template = O;
        }
        return (
          (P = ue({}, P, k)),
          w.forEach(function (I) {
            I.dispatchEvent(ge("medium-zoom:update", { detail: { zoom: E } }));
          }),
          E
        );
      },
      c = function () {
        var S =
          arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        return t(ue({}, P, S));
      },
      o = function () {
        for (var S = arguments.length, k = Array(S), O = 0; O < S; O++)
          k[O] = arguments[O];
        var I = k.reduce(function (L, q) {
          return [].concat(L, zt(q));
        }, []);
        return (
          I.filter(function (L) {
            return w.indexOf(L) === -1;
          }).forEach(function (L) {
            w.push(L), L.classList.add("medium-zoom-image");
          }),
          C.forEach(function (L) {
            var q = L.type,
              _ = L.listener,
              N = L.options;
            I.forEach(function (B) {
              B.addEventListener(q, _, N);
            });
          }),
          E
        );
      },
      l = function () {
        for (var S = arguments.length, k = Array(S), O = 0; O < S; O++)
          k[O] = arguments[O];
        v.zoomed && h();
        var I =
          k.length > 0
            ? k.reduce(function (L, q) {
                return [].concat(L, zt(q));
              }, [])
            : w;
        return (
          I.forEach(function (L) {
            L.classList.remove("medium-zoom-image"),
              L.dispatchEvent(
                ge("medium-zoom:detach", { detail: { zoom: E } })
              );
          }),
          (w = w.filter(function (L) {
            return I.indexOf(L) === -1;
          })),
          E
        );
      },
      u = function (S, k) {
        var O =
          arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        return (
          w.forEach(function (I) {
            I.addEventListener("medium-zoom:" + S, k, O);
          }),
          C.push({ type: "medium-zoom:" + S, listener: k, options: O }),
          E
        );
      },
      p = function (S, k) {
        var O =
          arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        return (
          w.forEach(function (I) {
            I.removeEventListener("medium-zoom:" + S, k, O);
          }),
          (C = C.filter(function (I) {
            return !(
              I.type === "medium-zoom:" + S &&
              I.listener.toString() === k.toString()
            );
          })),
          E
        );
      },
      f = function () {
        var S =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
          k = S.target,
          O = function () {
            var L = {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
              },
              q = void 0,
              _ = void 0;
            if (P.container)
              if (P.container instanceof Object)
                (L = ue({}, L, P.container)),
                  (q = L.width - L.left - L.right - P.margin * 2),
                  (_ = L.height - L.top - L.bottom - P.margin * 2);
              else {
                var N = lt(P.container)
                    ? P.container
                    : document.querySelector(P.container),
                  B = N.getBoundingClientRect(),
                  V = B.width,
                  ie = B.height,
                  be = B.left,
                  pe = B.top;
                L = ue({}, L, { width: V, height: ie, left: be, top: pe });
              }
            (q = q || L.width - P.margin * 2),
              (_ = _ || L.height - P.margin * 2);
            var G = v.zoomedHd || v.original,
              Se = Dt(G) ? q : G.naturalWidth || q,
              Ee = Dt(G) ? _ : G.naturalHeight || _,
              Y = G.getBoundingClientRect(),
              Ce = Y.top,
              se = Y.left,
              me = Y.width,
              re = Y.height,
              U = Math.min(Se, q) / me,
              Te = Math.min(Ee, _) / re,
              he = Math.min(U, Te),
              z = (-se + (q - me) / 2 + P.margin + L.left) / he,
              wn = (-Ce + (_ - re) / 2 + P.margin + L.top) / he,
              Mt =
                "scale(" + he + ") translate3d(" + z + "px, " + wn + "px, 0)";
            (v.zoomed.style.transform = Mt),
              v.zoomedHd && (v.zoomedHd.style.transform = Mt);
          };
        return new i(function (I) {
          if (k && w.indexOf(k) === -1) {
            I(E);
            return;
          }
          var L = function V() {
            (M = !1),
              v.zoomed.removeEventListener("transitionend", V),
              v.original.dispatchEvent(
                ge("medium-zoom:opened", { detail: { zoom: E } })
              ),
              I(E);
          };
          if (v.zoomed) {
            I(E);
            return;
          }
          if (k) v.original = k;
          else if (w.length > 0) {
            var q = w;
            v.original = q[0];
          } else {
            I(E);
            return;
          }
          if (
            (v.original.dispatchEvent(
              ge("medium-zoom:open", { detail: { zoom: E } })
            ),
            (D =
              window.pageYOffset ||
              document.documentElement.scrollTop ||
              document.body.scrollTop ||
              0),
            (M = !0),
            (v.zoomed = Dn(v.original)),
            document.body.appendChild($),
            P.template)
          ) {
            var _ = lt(P.template)
              ? P.template
              : document.querySelector(P.template);
            (v.template = document.createElement("div")),
              v.template.appendChild(_.content.cloneNode(!0)),
              document.body.appendChild(v.template);
          }
          if (
            (document.body.appendChild(v.zoomed),
            window.requestAnimationFrame(function () {
              document.body.classList.add("medium-zoom--opened");
            }),
            v.original.classList.add("medium-zoom-image--hidden"),
            v.zoomed.classList.add("medium-zoom-image--opened"),
            v.zoomed.addEventListener("click", h),
            v.zoomed.addEventListener("transitionend", L),
            v.original.getAttribute("data-zoom-src"))
          ) {
            (v.zoomedHd = v.zoomed.cloneNode()),
              v.zoomedHd.removeAttribute("srcset"),
              v.zoomedHd.removeAttribute("sizes"),
              (v.zoomedHd.src = v.zoomed.getAttribute("data-zoom-src")),
              (v.zoomedHd.onerror = function () {
                clearInterval(N),
                  console.warn(
                    "Unable to reach the zoom image target " + v.zoomedHd.src
                  ),
                  (v.zoomedHd = null),
                  O();
              });
            var N = setInterval(function () {
              v.zoomedHd.complete &&
                (clearInterval(N),
                v.zoomedHd.classList.add("medium-zoom-image--opened"),
                v.zoomedHd.addEventListener("click", h),
                document.body.appendChild(v.zoomedHd),
                O());
            }, 10);
          } else if (v.original.hasAttribute("srcset")) {
            (v.zoomedHd = v.zoomed.cloneNode()),
              v.zoomedHd.removeAttribute("sizes"),
              v.zoomedHd.removeAttribute("loading");
            var B = v.zoomedHd.addEventListener("load", function () {
              v.zoomedHd.removeEventListener("load", B),
                v.zoomedHd.classList.add("medium-zoom-image--opened"),
                v.zoomedHd.addEventListener("click", h),
                document.body.appendChild(v.zoomedHd),
                O();
            });
          } else O();
        });
      },
      h = function () {
        return new i(function (S) {
          if (M || !v.original) {
            S(E);
            return;
          }
          var k = function O() {
            v.original.classList.remove("medium-zoom-image--hidden"),
              document.body.removeChild(v.zoomed),
              v.zoomedHd && document.body.removeChild(v.zoomedHd),
              document.body.removeChild($),
              v.zoomed.classList.remove("medium-zoom-image--opened"),
              v.template && document.body.removeChild(v.template),
              (M = !1),
              v.zoomed.removeEventListener("transitionend", O),
              v.original.dispatchEvent(
                ge("medium-zoom:closed", { detail: { zoom: E } })
              ),
              (v.original = null),
              (v.zoomed = null),
              (v.zoomedHd = null),
              (v.template = null),
              S(E);
          };
          (M = !0),
            document.body.classList.remove("medium-zoom--opened"),
            (v.zoomed.style.transform = ""),
            v.zoomedHd && (v.zoomedHd.style.transform = ""),
            v.template &&
              ((v.template.style.transition = "opacity 150ms"),
              (v.template.style.opacity = 0)),
            v.original.dispatchEvent(
              ge("medium-zoom:close", { detail: { zoom: E } })
            ),
            v.zoomed.addEventListener("transitionend", k);
        });
      },
      y = function () {
        var S =
            arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
          k = S.target;
        return v.original ? h() : f({ target: k });
      },
      m = function () {
        return P;
      },
      g = function () {
        return w;
      },
      b = function () {
        return v.original;
      },
      w = [],
      C = [],
      M = !1,
      D = 0,
      P = n,
      v = { original: null, zoomed: null, zoomedHd: null, template: null };
    Object.prototype.toString.call(e) === "[object Object]"
      ? (P = e)
      : (e || typeof e == "string") && o(e),
      (P = ue(
        {
          margin: 0,
          background: "#fff",
          scrollOffset: 40,
          container: null,
          template: null,
        },
        P
      ));
    var $ = On(P.background);
    document.addEventListener("click", r),
      document.addEventListener("keyup", a),
      document.addEventListener("scroll", s),
      window.addEventListener("resize", h);
    var E = {
      open: f,
      close: h,
      toggle: y,
      update: d,
      clone: c,
      attach: o,
      detach: l,
      on: u,
      off: p,
      getOptions: m,
      getImages: g,
      getZoomedImage: b,
    };
    return E;
  };
function In(t, e) {
  e === void 0 && (e = {});
  var n = e.insertAt;
  if (!(!t || typeof document == "undefined")) {
    var i = document.head || document.getElementsByTagName("head")[0],
      r = document.createElement("style");
    (r.type = "text/css"),
      n === "top" && i.firstChild
        ? i.insertBefore(r, i.firstChild)
        : i.appendChild(r),
      r.styleSheet
        ? (r.styleSheet.cssText = t)
        : r.appendChild(document.createTextNode(t));
  }
}
var $n =
  ".medium-zoom-overlay{position:fixed;top:0;right:0;bottom:0;left:0;opacity:0;transition:opacity .3s;will-change:opacity}.medium-zoom--opened .medium-zoom-overlay{cursor:pointer;cursor:zoom-out;opacity:1}.medium-zoom-image{cursor:pointer;cursor:zoom-in;transition:transform .3s cubic-bezier(.2,0,.2,1)!important}.medium-zoom-image--hidden{visibility:hidden}.medium-zoom-image--opened{position:relative;cursor:pointer;cursor:zoom-out;will-change:transform}";
In($n);
var qn = zn;
let _n = document.querySelectorAll(".about-slider__video");
_n.forEach(function (t) {
  const e = t.querySelector("video"),
    n = t.querySelector(".play-pause"),
    i = t.querySelector(".play-icon"),
    r = t.querySelector(".fullscreen-button");
  e.removeAttribute("controls"), n.addEventListener("click", s);
  function s() {
    e.paused || e.ended
      ? (e.play(), (i.style.opacity = 0), (i.style.visibility = "hidden"))
      : (e.pause(), (i.style.opacity = 1), (i.style.visibility = "visible"));
  }
  function a() {
    document.fullscreenElement
      ? document.exitFullscreen()
      : document.webkitFullscreenElement
      ? document.webkitExitFullscreen()
      : t.webkitRequestFullscreen
      ? t.webkitRequestFullscreen()
      : t.requestFullscreen();
  }
  r.addEventListener("click", a);
});
const An = (t) => t.classList.add("active"),
  Hn = (t) => t.classList.remove("active"),
  Fn = (t) => t.classList.add("show"),
  Bn = (t) => t.classList.remove("show");
document.querySelectorAll("[data-activate-id]").forEach((t, e, n) => {
  const i = document.querySelectorAll("[data-id]");
  t.onclick = (r) => {
    const s = t.getAttribute("data-activate-id"),
      a = document.querySelector(`[data-id='${s}']`);
    n.forEach(Hn), i.forEach(Bn), An(t), Fn(a);
  };
});
qn("[data-zoomable]", { margin: 25, background: "#00082F", scrollOffset: 0 });
function It(t) {
  return (
    t !== null &&
    typeof t == "object" &&
    "constructor" in t &&
    t.constructor === Object
  );
}
function Pt(t = {}, e = {}) {
  Object.keys(e).forEach((n) => {
    typeof t[n] == "undefined"
      ? (t[n] = e[n])
      : It(e[n]) && It(t[n]) && Object.keys(e[n]).length > 0 && Pt(t[n], e[n]);
  });
}
const dn = {
  body: {},
  addEventListener() {},
  removeEventListener() {},
  activeElement: { blur() {}, nodeName: "" },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
  getElementById() {
    return null;
  },
  createEvent() {
    return { initEvent() {} };
  },
  createElement() {
    return {
      children: [],
      childNodes: [],
      style: {},
      setAttribute() {},
      getElementsByTagName() {
        return [];
      },
    };
  },
  createElementNS() {
    return {};
  },
  importNode() {
    return null;
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: "",
  },
};
function F() {
  const t = typeof document != "undefined" ? document : {};
  return Pt(t, dn), t;
}
const Nn = {
  document: dn,
  navigator: { userAgent: "" },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: "",
  },
  history: { replaceState() {}, pushState() {}, go() {}, back() {} },
  CustomEvent: function () {
    return this;
  },
  addEventListener() {},
  removeEventListener() {},
  getComputedStyle() {
    return {
      getPropertyValue() {
        return "";
      },
    };
  },
  Image() {},
  Date() {},
  screen: {},
  setTimeout() {},
  clearTimeout() {},
  matchMedia() {
    return {};
  },
  requestAnimationFrame(t) {
    return typeof setTimeout == "undefined" ? (t(), null) : setTimeout(t, 0);
  },
  cancelAnimationFrame(t) {
    typeof setTimeout != "undefined" && clearTimeout(t);
  },
};
function H() {
  const t = typeof window != "undefined" ? window : {};
  return Pt(t, Nn), t;
}
function Rn(t) {
  const e = t.__proto__;
  Object.defineProperty(t, "__proto__", {
    get() {
      return e;
    },
    set(n) {
      e.__proto__ = n;
    },
  });
}
class ee extends Array {
  constructor(e) {
    typeof e == "number" ? super(e) : (super(...(e || [])), Rn(this));
  }
}
function Ae(t = []) {
  const e = [];
  return (
    t.forEach((n) => {
      Array.isArray(n) ? e.push(...Ae(n)) : e.push(n);
    }),
    e
  );
}
function un(t, e) {
  return Array.prototype.filter.call(t, e);
}
function Vn(t) {
  const e = [];
  for (let n = 0; n < t.length; n += 1) e.indexOf(t[n]) === -1 && e.push(t[n]);
  return e;
}
function jn(t, e) {
  if (typeof t != "string") return [t];
  const n = [],
    i = e.querySelectorAll(t);
  for (let r = 0; r < i.length; r += 1) n.push(i[r]);
  return n;
}
function T(t, e) {
  const n = H(),
    i = F();
  let r = [];
  if (!e && t instanceof ee) return t;
  if (!t) return new ee(r);
  if (typeof t == "string") {
    const s = t.trim();
    if (s.indexOf("<") >= 0 && s.indexOf(">") >= 0) {
      let a = "div";
      s.indexOf("<li") === 0 && (a = "ul"),
        s.indexOf("<tr") === 0 && (a = "tbody"),
        (s.indexOf("<td") === 0 || s.indexOf("<th") === 0) && (a = "tr"),
        s.indexOf("<tbody") === 0 && (a = "table"),
        s.indexOf("<option") === 0 && (a = "select");
      const d = i.createElement(a);
      d.innerHTML = s;
      for (let c = 0; c < d.childNodes.length; c += 1) r.push(d.childNodes[c]);
    } else r = jn(t.trim(), e || i);
  } else if (t.nodeType || t === n || t === i) r.push(t);
  else if (Array.isArray(t)) {
    if (t instanceof ee) return t;
    r = t;
  }
  return new ee(Vn(r));
}
T.fn = ee.prototype;
function Gn(...t) {
  const e = Ae(t.map((n) => n.split(" ")));
  return (
    this.forEach((n) => {
      n.classList.add(...e);
    }),
    this
  );
}
function Wn(...t) {
  const e = Ae(t.map((n) => n.split(" ")));
  return (
    this.forEach((n) => {
      n.classList.remove(...e);
    }),
    this
  );
}
function Un(...t) {
  const e = Ae(t.map((n) => n.split(" ")));
  this.forEach((n) => {
    e.forEach((i) => {
      n.classList.toggle(i);
    });
  });
}
function Yn(...t) {
  const e = Ae(t.map((n) => n.split(" ")));
  return (
    un(this, (n) => e.filter((i) => n.classList.contains(i)).length > 0)
      .length > 0
  );
}
function Xn(t, e) {
  if (arguments.length === 1 && typeof t == "string")
    return this[0] ? this[0].getAttribute(t) : void 0;
  for (let n = 0; n < this.length; n += 1)
    if (arguments.length === 2) this[n].setAttribute(t, e);
    else for (const i in t) (this[n][i] = t[i]), this[n].setAttribute(i, t[i]);
  return this;
}
function Kn(t) {
  for (let e = 0; e < this.length; e += 1) this[e].removeAttribute(t);
  return this;
}
function Qn(t) {
  for (let e = 0; e < this.length; e += 1) this[e].style.transform = t;
  return this;
}
function Zn(t) {
  for (let e = 0; e < this.length; e += 1)
    this[e].style.transitionDuration = typeof t != "string" ? `${t}ms` : t;
  return this;
}
function Jn(...t) {
  let [e, n, i, r] = t;
  typeof t[1] == "function" && (([e, i, r] = t), (n = void 0)), r || (r = !1);
  function s(o) {
    const l = o.target;
    if (!l) return;
    const u = o.target.dom7EventData || [];
    if ((u.indexOf(o) < 0 && u.unshift(o), T(l).is(n))) i.apply(l, u);
    else {
      const p = T(l).parents();
      for (let f = 0; f < p.length; f += 1) T(p[f]).is(n) && i.apply(p[f], u);
    }
  }
  function a(o) {
    const l = o && o.target ? o.target.dom7EventData || [] : [];
    l.indexOf(o) < 0 && l.unshift(o), i.apply(this, l);
  }
  const d = e.split(" ");
  let c;
  for (let o = 0; o < this.length; o += 1) {
    const l = this[o];
    if (n)
      for (c = 0; c < d.length; c += 1) {
        const u = d[c];
        l.dom7LiveListeners || (l.dom7LiveListeners = {}),
          l.dom7LiveListeners[u] || (l.dom7LiveListeners[u] = []),
          l.dom7LiveListeners[u].push({ listener: i, proxyListener: s }),
          l.addEventListener(u, s, r);
      }
    else
      for (c = 0; c < d.length; c += 1) {
        const u = d[c];
        l.dom7Listeners || (l.dom7Listeners = {}),
          l.dom7Listeners[u] || (l.dom7Listeners[u] = []),
          l.dom7Listeners[u].push({ listener: i, proxyListener: a }),
          l.addEventListener(u, a, r);
      }
  }
  return this;
}
function ei(...t) {
  let [e, n, i, r] = t;
  typeof t[1] == "function" && (([e, i, r] = t), (n = void 0)), r || (r = !1);
  const s = e.split(" ");
  for (let a = 0; a < s.length; a += 1) {
    const d = s[a];
    for (let c = 0; c < this.length; c += 1) {
      const o = this[c];
      let l;
      if (
        (!n && o.dom7Listeners
          ? (l = o.dom7Listeners[d])
          : n && o.dom7LiveListeners && (l = o.dom7LiveListeners[d]),
        l && l.length)
      )
        for (let u = l.length - 1; u >= 0; u -= 1) {
          const p = l[u];
          (i && p.listener === i) ||
          (i &&
            p.listener &&
            p.listener.dom7proxy &&
            p.listener.dom7proxy === i)
            ? (o.removeEventListener(d, p.proxyListener, r), l.splice(u, 1))
            : i ||
              (o.removeEventListener(d, p.proxyListener, r), l.splice(u, 1));
        }
    }
  }
  return this;
}
function ti(...t) {
  const e = H(),
    n = t[0].split(" "),
    i = t[1];
  for (let r = 0; r < n.length; r += 1) {
    const s = n[r];
    for (let a = 0; a < this.length; a += 1) {
      const d = this[a];
      if (e.CustomEvent) {
        const c = new e.CustomEvent(s, {
          detail: i,
          bubbles: !0,
          cancelable: !0,
        });
        (d.dom7EventData = t.filter((o, l) => l > 0)),
          d.dispatchEvent(c),
          (d.dom7EventData = []),
          delete d.dom7EventData;
      }
    }
  }
  return this;
}
function ni(t) {
  const e = this;
  function n(i) {
    i.target === this && (t.call(this, i), e.off("transitionend", n));
  }
  return t && e.on("transitionend", n), this;
}
function ii(t) {
  if (this.length > 0) {
    if (t) {
      const e = this.styles();
      return (
        this[0].offsetWidth +
        parseFloat(e.getPropertyValue("margin-right")) +
        parseFloat(e.getPropertyValue("margin-left"))
      );
    }
    return this[0].offsetWidth;
  }
  return null;
}
function si(t) {
  if (this.length > 0) {
    if (t) {
      const e = this.styles();
      return (
        this[0].offsetHeight +
        parseFloat(e.getPropertyValue("margin-top")) +
        parseFloat(e.getPropertyValue("margin-bottom"))
      );
    }
    return this[0].offsetHeight;
  }
  return null;
}
function ri() {
  if (this.length > 0) {
    const t = H(),
      e = F(),
      n = this[0],
      i = n.getBoundingClientRect(),
      r = e.body,
      s = n.clientTop || r.clientTop || 0,
      a = n.clientLeft || r.clientLeft || 0,
      d = n === t ? t.scrollY : n.scrollTop,
      c = n === t ? t.scrollX : n.scrollLeft;
    return { top: i.top + d - s, left: i.left + c - a };
  }
  return null;
}
function ai() {
  const t = H();
  return this[0] ? t.getComputedStyle(this[0], null) : {};
}
function oi(t, e) {
  const n = H();
  let i;
  if (arguments.length === 1)
    if (typeof t == "string") {
      if (this[0]) return n.getComputedStyle(this[0], null).getPropertyValue(t);
    } else {
      for (i = 0; i < this.length; i += 1)
        for (const r in t) this[i].style[r] = t[r];
      return this;
    }
  if (arguments.length === 2 && typeof t == "string") {
    for (i = 0; i < this.length; i += 1) this[i].style[t] = e;
    return this;
  }
  return this;
}
function li(t) {
  return t
    ? (this.forEach((e, n) => {
        t.apply(e, [e, n]);
      }),
      this)
    : this;
}
function ci(t) {
  const e = un(this, t);
  return T(e);
}
function di(t) {
  if (typeof t == "undefined") return this[0] ? this[0].innerHTML : null;
  for (let e = 0; e < this.length; e += 1) this[e].innerHTML = t;
  return this;
}
function ui(t) {
  if (typeof t == "undefined")
    return this[0] ? this[0].textContent.trim() : null;
  for (let e = 0; e < this.length; e += 1) this[e].textContent = t;
  return this;
}
function fi(t) {
  const e = H(),
    n = F(),
    i = this[0];
  let r, s;
  if (!i || typeof t == "undefined") return !1;
  if (typeof t == "string") {
    if (i.matches) return i.matches(t);
    if (i.webkitMatchesSelector) return i.webkitMatchesSelector(t);
    if (i.msMatchesSelector) return i.msMatchesSelector(t);
    for (r = T(t), s = 0; s < r.length; s += 1) if (r[s] === i) return !0;
    return !1;
  }
  if (t === n) return i === n;
  if (t === e) return i === e;
  if (t.nodeType || t instanceof ee) {
    for (r = t.nodeType ? [t] : t, s = 0; s < r.length; s += 1)
      if (r[s] === i) return !0;
    return !1;
  }
  return !1;
}
function pi() {
  let t = this[0],
    e;
  if (t) {
    for (e = 0; (t = t.previousSibling) !== null; )
      t.nodeType === 1 && (e += 1);
    return e;
  }
}
function mi(t) {
  if (typeof t == "undefined") return this;
  const e = this.length;
  if (t > e - 1) return T([]);
  if (t < 0) {
    const n = e + t;
    return n < 0 ? T([]) : T([this[n]]);
  }
  return T([this[t]]);
}
function hi(...t) {
  let e;
  const n = F();
  for (let i = 0; i < t.length; i += 1) {
    e = t[i];
    for (let r = 0; r < this.length; r += 1)
      if (typeof e == "string") {
        const s = n.createElement("div");
        for (s.innerHTML = e; s.firstChild; ) this[r].appendChild(s.firstChild);
      } else if (e instanceof ee)
        for (let s = 0; s < e.length; s += 1) this[r].appendChild(e[s]);
      else this[r].appendChild(e);
  }
  return this;
}
function gi(t) {
  const e = F();
  let n, i;
  for (n = 0; n < this.length; n += 1)
    if (typeof t == "string") {
      const r = e.createElement("div");
      for (r.innerHTML = t, i = r.childNodes.length - 1; i >= 0; i -= 1)
        this[n].insertBefore(r.childNodes[i], this[n].childNodes[0]);
    } else if (t instanceof ee)
      for (i = 0; i < t.length; i += 1)
        this[n].insertBefore(t[i], this[n].childNodes[0]);
    else this[n].insertBefore(t, this[n].childNodes[0]);
  return this;
}
function vi(t) {
  return this.length > 0
    ? t
      ? this[0].nextElementSibling && T(this[0].nextElementSibling).is(t)
        ? T([this[0].nextElementSibling])
        : T([])
      : this[0].nextElementSibling
      ? T([this[0].nextElementSibling])
      : T([])
    : T([]);
}
function yi(t) {
  const e = [];
  let n = this[0];
  if (!n) return T([]);
  for (; n.nextElementSibling; ) {
    const i = n.nextElementSibling;
    t ? T(i).is(t) && e.push(i) : e.push(i), (n = i);
  }
  return T(e);
}
function wi(t) {
  if (this.length > 0) {
    const e = this[0];
    return t
      ? e.previousElementSibling && T(e.previousElementSibling).is(t)
        ? T([e.previousElementSibling])
        : T([])
      : e.previousElementSibling
      ? T([e.previousElementSibling])
      : T([]);
  }
  return T([]);
}
function bi(t) {
  const e = [];
  let n = this[0];
  if (!n) return T([]);
  for (; n.previousElementSibling; ) {
    const i = n.previousElementSibling;
    t ? T(i).is(t) && e.push(i) : e.push(i), (n = i);
  }
  return T(e);
}
function Si(t) {
  const e = [];
  for (let n = 0; n < this.length; n += 1)
    this[n].parentNode !== null &&
      (t
        ? T(this[n].parentNode).is(t) && e.push(this[n].parentNode)
        : e.push(this[n].parentNode));
  return T(e);
}
function Ei(t) {
  const e = [];
  for (let n = 0; n < this.length; n += 1) {
    let i = this[n].parentNode;
    for (; i; ) t ? T(i).is(t) && e.push(i) : e.push(i), (i = i.parentNode);
  }
  return T(e);
}
function Ci(t) {
  let e = this;
  return typeof t == "undefined"
    ? T([])
    : (e.is(t) || (e = e.parents(t).eq(0)), e);
}
function Ti(t) {
  const e = [];
  for (let n = 0; n < this.length; n += 1) {
    const i = this[n].querySelectorAll(t);
    for (let r = 0; r < i.length; r += 1) e.push(i[r]);
  }
  return T(e);
}
function xi(t) {
  const e = [];
  for (let n = 0; n < this.length; n += 1) {
    const i = this[n].children;
    for (let r = 0; r < i.length; r += 1) (!t || T(i[r]).is(t)) && e.push(i[r]);
  }
  return T(e);
}
function Li() {
  for (let t = 0; t < this.length; t += 1)
    this[t].parentNode && this[t].parentNode.removeChild(this[t]);
  return this;
}
const $t = {
  addClass: Gn,
  removeClass: Wn,
  hasClass: Yn,
  toggleClass: Un,
  attr: Xn,
  removeAttr: Kn,
  transform: Qn,
  transition: Zn,
  on: Jn,
  off: ei,
  trigger: ti,
  transitionEnd: ni,
  outerWidth: ii,
  outerHeight: si,
  styles: ai,
  offset: ri,
  css: oi,
  each: li,
  html: di,
  text: ui,
  is: fi,
  index: pi,
  eq: mi,
  append: hi,
  prepend: gi,
  next: vi,
  nextAll: yi,
  prev: wi,
  prevAll: bi,
  parent: Si,
  parents: Ei,
  closest: Ci,
  find: Ti,
  children: xi,
  filter: ci,
  remove: Li,
};
Object.keys($t).forEach((t) => {
  Object.defineProperty(T.fn, t, { value: $t[t], writable: !0 });
});
function ki(t) {
  const e = t;
  Object.keys(e).forEach((n) => {
    try {
      e[n] = null;
    } catch (i) {}
    try {
      delete e[n];
    } catch (i) {}
  });
}
function ct(t, e) {
  return e === void 0 && (e = 0), setTimeout(t, e);
}
function _e() {
  return Date.now();
}
function Pi(t) {
  const e = H();
  let n;
  return (
    e.getComputedStyle && (n = e.getComputedStyle(t, null)),
    !n && t.currentStyle && (n = t.currentStyle),
    n || (n = t.style),
    n
  );
}
function Mi(t, e) {
  e === void 0 && (e = "x");
  const n = H();
  let i, r, s;
  const a = Pi(t);
  return (
    n.WebKitCSSMatrix
      ? ((r = a.transform || a.webkitTransform),
        r.split(",").length > 6 &&
          (r = r
            .split(", ")
            .map((d) => d.replace(",", "."))
            .join(", ")),
        (s = new n.WebKitCSSMatrix(r === "none" ? "" : r)))
      : ((s =
          a.MozTransform ||
          a.OTransform ||
          a.MsTransform ||
          a.msTransform ||
          a.transform ||
          a
            .getPropertyValue("transform")
            .replace("translate(", "matrix(1, 0, 0, 1,")),
        (i = s.toString().split(","))),
    e === "x" &&
      (n.WebKitCSSMatrix
        ? (r = s.m41)
        : i.length === 16
        ? (r = parseFloat(i[12]))
        : (r = parseFloat(i[4]))),
    e === "y" &&
      (n.WebKitCSSMatrix
        ? (r = s.m42)
        : i.length === 16
        ? (r = parseFloat(i[13]))
        : (r = parseFloat(i[5]))),
    r || 0
  );
}
function Fe(t) {
  return (
    typeof t == "object" &&
    t !== null &&
    t.constructor &&
    Object.prototype.toString.call(t).slice(8, -1) === "Object"
  );
}
function Oi(t) {
  return typeof window != "undefined" &&
    typeof window.HTMLElement != "undefined"
    ? t instanceof HTMLElement
    : t && (t.nodeType === 1 || t.nodeType === 11);
}
function R() {
  const t = Object(arguments.length <= 0 ? void 0 : arguments[0]),
    e = ["__proto__", "constructor", "prototype"];
  for (let n = 1; n < arguments.length; n += 1) {
    const i = n < 0 || arguments.length <= n ? void 0 : arguments[n];
    if (i != null && !Oi(i)) {
      const r = Object.keys(Object(i)).filter((s) => e.indexOf(s) < 0);
      for (let s = 0, a = r.length; s < a; s += 1) {
        const d = r[s],
          c = Object.getOwnPropertyDescriptor(i, d);
        c !== void 0 &&
          c.enumerable &&
          (Fe(t[d]) && Fe(i[d])
            ? i[d].__swiper__
              ? (t[d] = i[d])
              : R(t[d], i[d])
            : !Fe(t[d]) && Fe(i[d])
            ? ((t[d] = {}), i[d].__swiper__ ? (t[d] = i[d]) : R(t[d], i[d]))
            : (t[d] = i[d]));
      }
    }
  }
  return t;
}
function Be(t, e, n) {
  t.style.setProperty(e, n);
}
function fn(t) {
  let { swiper: e, targetPosition: n, side: i } = t;
  const r = H(),
    s = -e.translate;
  let a = null,
    d;
  const c = e.params.speed;
  (e.wrapperEl.style.scrollSnapType = "none"),
    r.cancelAnimationFrame(e.cssModeFrameID);
  const o = n > s ? "next" : "prev",
    l = (p, f) => (o === "next" && p >= f) || (o === "prev" && p <= f),
    u = () => {
      (d = new Date().getTime()), a === null && (a = d);
      const p = Math.max(Math.min((d - a) / c, 1), 0),
        f = 0.5 - Math.cos(p * Math.PI) / 2;
      let h = s + f * (n - s);
      if ((l(h, n) && (h = n), e.wrapperEl.scrollTo({ [i]: h }), l(h, n))) {
        (e.wrapperEl.style.overflow = "hidden"),
          (e.wrapperEl.style.scrollSnapType = ""),
          setTimeout(() => {
            (e.wrapperEl.style.overflow = ""), e.wrapperEl.scrollTo({ [i]: h });
          }),
          r.cancelAnimationFrame(e.cssModeFrameID);
        return;
      }
      e.cssModeFrameID = r.requestAnimationFrame(u);
    };
  u();
}
let pt;
function Di() {
  const t = H(),
    e = F();
  return {
    smoothScroll:
      e.documentElement && "scrollBehavior" in e.documentElement.style,
    touch: !!(
      "ontouchstart" in t ||
      (t.DocumentTouch && e instanceof t.DocumentTouch)
    ),
    passiveListener: (function () {
      let i = !1;
      try {
        const r = Object.defineProperty({}, "passive", {
          get() {
            i = !0;
          },
        });
        t.addEventListener("testPassiveListener", null, r);
      } catch (r) {}
      return i;
    })(),
    gestures: (function () {
      return "ongesturestart" in t;
    })(),
  };
}
function pn() {
  return pt || (pt = Di()), pt;
}
let mt;
function zi(t) {
  let { userAgent: e } = t === void 0 ? {} : t;
  const n = pn(),
    i = H(),
    r = i.navigator.platform,
    s = e || i.navigator.userAgent,
    a = { ios: !1, android: !1 },
    d = i.screen.width,
    c = i.screen.height,
    o = s.match(/(Android);?[\s\/]+([\d.]+)?/);
  let l = s.match(/(iPad).*OS\s([\d_]+)/);
  const u = s.match(/(iPod)(.*OS\s([\d_]+))?/),
    p = !l && s.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
    f = r === "Win32";
  let h = r === "MacIntel";
  const y = [
    "1024x1366",
    "1366x1024",
    "834x1194",
    "1194x834",
    "834x1112",
    "1112x834",
    "768x1024",
    "1024x768",
    "820x1180",
    "1180x820",
    "810x1080",
    "1080x810",
  ];
  return (
    !l &&
      h &&
      n.touch &&
      y.indexOf(`${d}x${c}`) >= 0 &&
      ((l = s.match(/(Version)\/([\d.]+)/)),
      l || (l = [0, 1, "13_0_0"]),
      (h = !1)),
    o && !f && ((a.os = "android"), (a.android = !0)),
    (l || p || u) && ((a.os = "ios"), (a.ios = !0)),
    a
  );
}
function Ii(t) {
  return t === void 0 && (t = {}), mt || (mt = zi(t)), mt;
}
let ht;
function $i() {
  const t = H();
  function e() {
    const n = t.navigator.userAgent.toLowerCase();
    return (
      n.indexOf("safari") >= 0 &&
      n.indexOf("chrome") < 0 &&
      n.indexOf("android") < 0
    );
  }
  return {
    isSafari: e(),
    isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
      t.navigator.userAgent
    ),
  };
}
function qi() {
  return ht || (ht = $i()), ht;
}
function _i(t) {
  let { swiper: e, on: n, emit: i } = t;
  const r = H();
  let s = null,
    a = null;
  const d = () => {
      !e || e.destroyed || !e.initialized || (i("beforeResize"), i("resize"));
    },
    c = () => {
      !e ||
        e.destroyed ||
        !e.initialized ||
        ((s = new ResizeObserver((u) => {
          a = r.requestAnimationFrame(() => {
            const { width: p, height: f } = e;
            let h = p,
              y = f;
            u.forEach((m) => {
              let { contentBoxSize: g, contentRect: b, target: w } = m;
              (w && w !== e.el) ||
                ((h = b ? b.width : (g[0] || g).inlineSize),
                (y = b ? b.height : (g[0] || g).blockSize));
            }),
              (h !== p || y !== f) && d();
          });
        })),
        s.observe(e.el));
    },
    o = () => {
      a && r.cancelAnimationFrame(a),
        s && s.unobserve && e.el && (s.unobserve(e.el), (s = null));
    },
    l = () => {
      !e || e.destroyed || !e.initialized || i("orientationchange");
    };
  n("init", () => {
    if (e.params.resizeObserver && typeof r.ResizeObserver != "undefined") {
      c();
      return;
    }
    r.addEventListener("resize", d), r.addEventListener("orientationchange", l);
  }),
    n("destroy", () => {
      o(),
        r.removeEventListener("resize", d),
        r.removeEventListener("orientationchange", l);
    });
}
function Ai(t) {
  let { swiper: e, extendParams: n, on: i, emit: r } = t;
  const s = [],
    a = H(),
    d = function (l, u) {
      u === void 0 && (u = {});
      const p = a.MutationObserver || a.WebkitMutationObserver,
        f = new p((h) => {
          if (h.length === 1) {
            r("observerUpdate", h[0]);
            return;
          }
          const y = function () {
            r("observerUpdate", h[0]);
          };
          a.requestAnimationFrame
            ? a.requestAnimationFrame(y)
            : a.setTimeout(y, 0);
        });
      f.observe(l, {
        attributes: typeof u.attributes == "undefined" ? !0 : u.attributes,
        childList: typeof u.childList == "undefined" ? !0 : u.childList,
        characterData:
          typeof u.characterData == "undefined" ? !0 : u.characterData,
      }),
        s.push(f);
    },
    c = () => {
      if (!!e.params.observer) {
        if (e.params.observeParents) {
          const l = e.$el.parents();
          for (let u = 0; u < l.length; u += 1) d(l[u]);
        }
        d(e.$el[0], { childList: e.params.observeSlideChildren }),
          d(e.$wrapperEl[0], { attributes: !1 });
      }
    },
    o = () => {
      s.forEach((l) => {
        l.disconnect();
      }),
        s.splice(0, s.length);
    };
  n({ observer: !1, observeParents: !1, observeSlideChildren: !1 }),
    i("init", c),
    i("destroy", o);
}
var Hi = {
  on(t, e, n) {
    const i = this;
    if (!i.eventsListeners || i.destroyed || typeof e != "function") return i;
    const r = n ? "unshift" : "push";
    return (
      t.split(" ").forEach((s) => {
        i.eventsListeners[s] || (i.eventsListeners[s] = []),
          i.eventsListeners[s][r](e);
      }),
      i
    );
  },
  once(t, e, n) {
    const i = this;
    if (!i.eventsListeners || i.destroyed || typeof e != "function") return i;
    function r() {
      i.off(t, r), r.__emitterProxy && delete r.__emitterProxy;
      for (var s = arguments.length, a = new Array(s), d = 0; d < s; d++)
        a[d] = arguments[d];
      e.apply(i, a);
    }
    return (r.__emitterProxy = e), i.on(t, r, n);
  },
  onAny(t, e) {
    const n = this;
    if (!n.eventsListeners || n.destroyed || typeof t != "function") return n;
    const i = e ? "unshift" : "push";
    return n.eventsAnyListeners.indexOf(t) < 0 && n.eventsAnyListeners[i](t), n;
  },
  offAny(t) {
    const e = this;
    if (!e.eventsListeners || e.destroyed || !e.eventsAnyListeners) return e;
    const n = e.eventsAnyListeners.indexOf(t);
    return n >= 0 && e.eventsAnyListeners.splice(n, 1), e;
  },
  off(t, e) {
    const n = this;
    return (
      !n.eventsListeners ||
        n.destroyed ||
        !n.eventsListeners ||
        t.split(" ").forEach((i) => {
          typeof e == "undefined"
            ? (n.eventsListeners[i] = [])
            : n.eventsListeners[i] &&
              n.eventsListeners[i].forEach((r, s) => {
                (r === e || (r.__emitterProxy && r.__emitterProxy === e)) &&
                  n.eventsListeners[i].splice(s, 1);
              });
        }),
      n
    );
  },
  emit() {
    const t = this;
    if (!t.eventsListeners || t.destroyed || !t.eventsListeners) return t;
    let e, n, i;
    for (var r = arguments.length, s = new Array(r), a = 0; a < r; a++)
      s[a] = arguments[a];
    return (
      typeof s[0] == "string" || Array.isArray(s[0])
        ? ((e = s[0]), (n = s.slice(1, s.length)), (i = t))
        : ((e = s[0].events), (n = s[0].data), (i = s[0].context || t)),
      n.unshift(i),
      (Array.isArray(e) ? e : e.split(" ")).forEach((c) => {
        t.eventsAnyListeners &&
          t.eventsAnyListeners.length &&
          t.eventsAnyListeners.forEach((o) => {
            o.apply(i, [c, ...n]);
          }),
          t.eventsListeners &&
            t.eventsListeners[c] &&
            t.eventsListeners[c].forEach((o) => {
              o.apply(i, n);
            });
      }),
      t
    );
  },
};
function Fi() {
  const t = this;
  let e, n;
  const i = t.$el;
  typeof t.params.width != "undefined" && t.params.width !== null
    ? (e = t.params.width)
    : (e = i[0].clientWidth),
    typeof t.params.height != "undefined" && t.params.height !== null
      ? (n = t.params.height)
      : (n = i[0].clientHeight),
    !((e === 0 && t.isHorizontal()) || (n === 0 && t.isVertical())) &&
      ((e =
        e -
        parseInt(i.css("padding-left") || 0, 10) -
        parseInt(i.css("padding-right") || 0, 10)),
      (n =
        n -
        parseInt(i.css("padding-top") || 0, 10) -
        parseInt(i.css("padding-bottom") || 0, 10)),
      Number.isNaN(e) && (e = 0),
      Number.isNaN(n) && (n = 0),
      Object.assign(t, {
        width: e,
        height: n,
        size: t.isHorizontal() ? e : n,
      }));
}
function Bi() {
  const t = this;
  function e(E) {
    return t.isHorizontal()
      ? E
      : {
          width: "height",
          "margin-top": "margin-left",
          "margin-bottom ": "margin-right",
          "margin-left": "margin-top",
          "margin-right": "margin-bottom",
          "padding-left": "padding-top",
          "padding-right": "padding-bottom",
          marginRight: "marginBottom",
        }[E];
  }
  function n(E, x) {
    return parseFloat(E.getPropertyValue(e(x)) || 0);
  }
  const i = t.params,
    { $wrapperEl: r, size: s, rtlTranslate: a, wrongRTL: d } = t,
    c = t.virtual && i.virtual.enabled,
    o = c ? t.virtual.slides.length : t.slides.length,
    l = r.children(`.${t.params.slideClass}`),
    u = c ? t.virtual.slides.length : l.length;
  let p = [];
  const f = [],
    h = [];
  let y = i.slidesOffsetBefore;
  typeof y == "function" && (y = i.slidesOffsetBefore.call(t));
  let m = i.slidesOffsetAfter;
  typeof m == "function" && (m = i.slidesOffsetAfter.call(t));
  const g = t.snapGrid.length,
    b = t.slidesGrid.length;
  let w = i.spaceBetween,
    C = -y,
    M = 0,
    D = 0;
  if (typeof s == "undefined") return;
  typeof w == "string" &&
    w.indexOf("%") >= 0 &&
    (w = (parseFloat(w.replace("%", "")) / 100) * s),
    (t.virtualSize = -w),
    a
      ? l.css({ marginLeft: "", marginBottom: "", marginTop: "" })
      : l.css({ marginRight: "", marginBottom: "", marginTop: "" }),
    i.centeredSlides &&
      i.cssMode &&
      (Be(t.wrapperEl, "--swiper-centered-offset-before", ""),
      Be(t.wrapperEl, "--swiper-centered-offset-after", ""));
  const P = i.grid && i.grid.rows > 1 && t.grid;
  P && t.grid.initSlides(u);
  let v;
  const $ =
    i.slidesPerView === "auto" &&
    i.breakpoints &&
    Object.keys(i.breakpoints).filter(
      (E) => typeof i.breakpoints[E].slidesPerView != "undefined"
    ).length > 0;
  for (let E = 0; E < u; E += 1) {
    v = 0;
    const x = l.eq(E);
    if ((P && t.grid.updateSlide(E, x, u, e), x.css("display") !== "none")) {
      if (i.slidesPerView === "auto") {
        $ && (l[E].style[e("width")] = "");
        const S = getComputedStyle(x[0]),
          k = x[0].style.transform,
          O = x[0].style.webkitTransform;
        if (
          (k && (x[0].style.transform = "none"),
          O && (x[0].style.webkitTransform = "none"),
          i.roundLengths)
        )
          v = t.isHorizontal() ? x.outerWidth(!0) : x.outerHeight(!0);
        else {
          const I = n(S, "width"),
            L = n(S, "padding-left"),
            q = n(S, "padding-right"),
            _ = n(S, "margin-left"),
            N = n(S, "margin-right"),
            B = S.getPropertyValue("box-sizing");
          if (B && B === "border-box") v = I + _ + N;
          else {
            const { clientWidth: V, offsetWidth: ie } = x[0];
            v = I + L + q + _ + N + (ie - V);
          }
        }
        k && (x[0].style.transform = k),
          O && (x[0].style.webkitTransform = O),
          i.roundLengths && (v = Math.floor(v));
      } else
        (v = (s - (i.slidesPerView - 1) * w) / i.slidesPerView),
          i.roundLengths && (v = Math.floor(v)),
          l[E] && (l[E].style[e("width")] = `${v}px`);
      l[E] && (l[E].swiperSlideSize = v),
        h.push(v),
        i.centeredSlides
          ? ((C = C + v / 2 + M / 2 + w),
            M === 0 && E !== 0 && (C = C - s / 2 - w),
            E === 0 && (C = C - s / 2 - w),
            Math.abs(C) < 1 / 1e3 && (C = 0),
            i.roundLengths && (C = Math.floor(C)),
            D % i.slidesPerGroup === 0 && p.push(C),
            f.push(C))
          : (i.roundLengths && (C = Math.floor(C)),
            (D - Math.min(t.params.slidesPerGroupSkip, D)) %
              t.params.slidesPerGroup ===
              0 && p.push(C),
            f.push(C),
            (C = C + v + w)),
        (t.virtualSize += v + w),
        (M = v),
        (D += 1);
    }
  }
  if (
    ((t.virtualSize = Math.max(t.virtualSize, s) + m),
    a &&
      d &&
      (i.effect === "slide" || i.effect === "coverflow") &&
      r.css({ width: `${t.virtualSize + i.spaceBetween}px` }),
    i.setWrapperSize &&
      r.css({ [e("width")]: `${t.virtualSize + i.spaceBetween}px` }),
    P && t.grid.updateWrapperSize(v, p, e),
    !i.centeredSlides)
  ) {
    const E = [];
    for (let x = 0; x < p.length; x += 1) {
      let S = p[x];
      i.roundLengths && (S = Math.floor(S)),
        p[x] <= t.virtualSize - s && E.push(S);
    }
    (p = E),
      Math.floor(t.virtualSize - s) - Math.floor(p[p.length - 1]) > 1 &&
        p.push(t.virtualSize - s);
  }
  if ((p.length === 0 && (p = [0]), i.spaceBetween !== 0)) {
    const E = t.isHorizontal() && a ? "marginLeft" : e("marginRight");
    l.filter((x, S) => (i.cssMode ? S !== l.length - 1 : !0)).css({
      [E]: `${w}px`,
    });
  }
  if (i.centeredSlides && i.centeredSlidesBounds) {
    let E = 0;
    h.forEach((S) => {
      E += S + (i.spaceBetween ? i.spaceBetween : 0);
    }),
      (E -= i.spaceBetween);
    const x = E - s;
    p = p.map((S) => (S < 0 ? -y : S > x ? x + m : S));
  }
  if (i.centerInsufficientSlides) {
    let E = 0;
    if (
      (h.forEach((x) => {
        E += x + (i.spaceBetween ? i.spaceBetween : 0);
      }),
      (E -= i.spaceBetween),
      E < s)
    ) {
      const x = (s - E) / 2;
      p.forEach((S, k) => {
        p[k] = S - x;
      }),
        f.forEach((S, k) => {
          f[k] = S + x;
        });
    }
  }
  if (
    (Object.assign(t, {
      slides: l,
      snapGrid: p,
      slidesGrid: f,
      slidesSizesGrid: h,
    }),
    i.centeredSlides && i.cssMode && !i.centeredSlidesBounds)
  ) {
    Be(t.wrapperEl, "--swiper-centered-offset-before", `${-p[0]}px`),
      Be(
        t.wrapperEl,
        "--swiper-centered-offset-after",
        `${t.size / 2 - h[h.length - 1] / 2}px`
      );
    const E = -t.snapGrid[0],
      x = -t.slidesGrid[0];
    (t.snapGrid = t.snapGrid.map((S) => S + E)),
      (t.slidesGrid = t.slidesGrid.map((S) => S + x));
  }
  if (
    (u !== o && t.emit("slidesLengthChange"),
    p.length !== g &&
      (t.params.watchOverflow && t.checkOverflow(),
      t.emit("snapGridLengthChange")),
    f.length !== b && t.emit("slidesGridLengthChange"),
    i.watchSlidesProgress && t.updateSlidesOffset(),
    !c && !i.cssMode && (i.effect === "slide" || i.effect === "fade"))
  ) {
    const E = `${i.containerModifierClass}backface-hidden`,
      x = t.$el.hasClass(E);
    u <= i.maxBackfaceHiddenSlides
      ? x || t.$el.addClass(E)
      : x && t.$el.removeClass(E);
  }
}
function Ni(t) {
  const e = this,
    n = [],
    i = e.virtual && e.params.virtual.enabled;
  let r = 0,
    s;
  typeof t == "number"
    ? e.setTransition(t)
    : t === !0 && e.setTransition(e.params.speed);
  const a = (d) =>
    i
      ? e.slides.filter(
          (c) => parseInt(c.getAttribute("data-swiper-slide-index"), 10) === d
        )[0]
      : e.slides.eq(d)[0];
  if (e.params.slidesPerView !== "auto" && e.params.slidesPerView > 1)
    if (e.params.centeredSlides)
      (e.visibleSlides || T([])).each((d) => {
        n.push(d);
      });
    else
      for (s = 0; s < Math.ceil(e.params.slidesPerView); s += 1) {
        const d = e.activeIndex + s;
        if (d > e.slides.length && !i) break;
        n.push(a(d));
      }
  else n.push(a(e.activeIndex));
  for (s = 0; s < n.length; s += 1)
    if (typeof n[s] != "undefined") {
      const d = n[s].offsetHeight;
      r = d > r ? d : r;
    }
  (r || r === 0) && e.$wrapperEl.css("height", `${r}px`);
}
function Ri() {
  const t = this,
    e = t.slides;
  for (let n = 0; n < e.length; n += 1)
    e[n].swiperSlideOffset = t.isHorizontal()
      ? e[n].offsetLeft
      : e[n].offsetTop;
}
function Vi(t) {
  t === void 0 && (t = (this && this.translate) || 0);
  const e = this,
    n = e.params,
    { slides: i, rtlTranslate: r, snapGrid: s } = e;
  if (i.length === 0) return;
  typeof i[0].swiperSlideOffset == "undefined" && e.updateSlidesOffset();
  let a = -t;
  r && (a = t),
    i.removeClass(n.slideVisibleClass),
    (e.visibleSlidesIndexes = []),
    (e.visibleSlides = []);
  for (let d = 0; d < i.length; d += 1) {
    const c = i[d];
    let o = c.swiperSlideOffset;
    n.cssMode && n.centeredSlides && (o -= i[0].swiperSlideOffset);
    const l =
        (a + (n.centeredSlides ? e.minTranslate() : 0) - o) /
        (c.swiperSlideSize + n.spaceBetween),
      u =
        (a - s[0] + (n.centeredSlides ? e.minTranslate() : 0) - o) /
        (c.swiperSlideSize + n.spaceBetween),
      p = -(a - o),
      f = p + e.slidesSizesGrid[d];
    ((p >= 0 && p < e.size - 1) ||
      (f > 1 && f <= e.size) ||
      (p <= 0 && f >= e.size)) &&
      (e.visibleSlides.push(c),
      e.visibleSlidesIndexes.push(d),
      i.eq(d).addClass(n.slideVisibleClass)),
      (c.progress = r ? -l : l),
      (c.originalProgress = r ? -u : u);
  }
  e.visibleSlides = T(e.visibleSlides);
}
function ji(t) {
  const e = this;
  if (typeof t == "undefined") {
    const o = e.rtlTranslate ? -1 : 1;
    t = (e && e.translate && e.translate * o) || 0;
  }
  const n = e.params,
    i = e.maxTranslate() - e.minTranslate();
  let { progress: r, isBeginning: s, isEnd: a } = e;
  const d = s,
    c = a;
  i === 0
    ? ((r = 0), (s = !0), (a = !0))
    : ((r = (t - e.minTranslate()) / i), (s = r <= 0), (a = r >= 1)),
    Object.assign(e, { progress: r, isBeginning: s, isEnd: a }),
    (n.watchSlidesProgress || (n.centeredSlides && n.autoHeight)) &&
      e.updateSlidesProgress(t),
    s && !d && e.emit("reachBeginning toEdge"),
    a && !c && e.emit("reachEnd toEdge"),
    ((d && !s) || (c && !a)) && e.emit("fromEdge"),
    e.emit("progress", r);
}
function Gi() {
  const t = this,
    { slides: e, params: n, $wrapperEl: i, activeIndex: r, realIndex: s } = t,
    a = t.virtual && n.virtual.enabled;
  e.removeClass(
    `${n.slideActiveClass} ${n.slideNextClass} ${n.slidePrevClass} ${n.slideDuplicateActiveClass} ${n.slideDuplicateNextClass} ${n.slideDuplicatePrevClass}`
  );
  let d;
  a
    ? (d = t.$wrapperEl.find(
        `.${n.slideClass}[data-swiper-slide-index="${r}"]`
      ))
    : (d = e.eq(r)),
    d.addClass(n.slideActiveClass),
    n.loop &&
      (d.hasClass(n.slideDuplicateClass)
        ? i
            .children(
              `.${n.slideClass}:not(.${n.slideDuplicateClass})[data-swiper-slide-index="${s}"]`
            )
            .addClass(n.slideDuplicateActiveClass)
        : i
            .children(
              `.${n.slideClass}.${n.slideDuplicateClass}[data-swiper-slide-index="${s}"]`
            )
            .addClass(n.slideDuplicateActiveClass));
  let c = d.nextAll(`.${n.slideClass}`).eq(0).addClass(n.slideNextClass);
  n.loop && c.length === 0 && ((c = e.eq(0)), c.addClass(n.slideNextClass));
  let o = d.prevAll(`.${n.slideClass}`).eq(0).addClass(n.slidePrevClass);
  n.loop && o.length === 0 && ((o = e.eq(-1)), o.addClass(n.slidePrevClass)),
    n.loop &&
      (c.hasClass(n.slideDuplicateClass)
        ? i
            .children(
              `.${n.slideClass}:not(.${
                n.slideDuplicateClass
              })[data-swiper-slide-index="${c.attr(
                "data-swiper-slide-index"
              )}"]`
            )
            .addClass(n.slideDuplicateNextClass)
        : i
            .children(
              `.${n.slideClass}.${
                n.slideDuplicateClass
              }[data-swiper-slide-index="${c.attr("data-swiper-slide-index")}"]`
            )
            .addClass(n.slideDuplicateNextClass),
      o.hasClass(n.slideDuplicateClass)
        ? i
            .children(
              `.${n.slideClass}:not(.${
                n.slideDuplicateClass
              })[data-swiper-slide-index="${o.attr(
                "data-swiper-slide-index"
              )}"]`
            )
            .addClass(n.slideDuplicatePrevClass)
        : i
            .children(
              `.${n.slideClass}.${
                n.slideDuplicateClass
              }[data-swiper-slide-index="${o.attr("data-swiper-slide-index")}"]`
            )
            .addClass(n.slideDuplicatePrevClass)),
    t.emitSlidesClasses();
}
function Wi(t) {
  const e = this,
    n = e.rtlTranslate ? e.translate : -e.translate,
    {
      slidesGrid: i,
      snapGrid: r,
      params: s,
      activeIndex: a,
      realIndex: d,
      snapIndex: c,
    } = e;
  let o = t,
    l;
  if (typeof o == "undefined") {
    for (let p = 0; p < i.length; p += 1)
      typeof i[p + 1] != "undefined"
        ? n >= i[p] && n < i[p + 1] - (i[p + 1] - i[p]) / 2
          ? (o = p)
          : n >= i[p] && n < i[p + 1] && (o = p + 1)
        : n >= i[p] && (o = p);
    s.normalizeSlideIndex && (o < 0 || typeof o == "undefined") && (o = 0);
  }
  if (r.indexOf(n) >= 0) l = r.indexOf(n);
  else {
    const p = Math.min(s.slidesPerGroupSkip, o);
    l = p + Math.floor((o - p) / s.slidesPerGroup);
  }
  if ((l >= r.length && (l = r.length - 1), o === a)) {
    l !== c && ((e.snapIndex = l), e.emit("snapIndexChange"));
    return;
  }
  const u = parseInt(e.slides.eq(o).attr("data-swiper-slide-index") || o, 10);
  Object.assign(e, {
    snapIndex: l,
    realIndex: u,
    previousIndex: a,
    activeIndex: o,
  }),
    e.emit("activeIndexChange"),
    e.emit("snapIndexChange"),
    d !== u && e.emit("realIndexChange"),
    (e.initialized || e.params.runCallbacksOnInit) && e.emit("slideChange");
}
function Ui(t) {
  const e = this,
    n = e.params,
    i = T(t).closest(`.${n.slideClass}`)[0];
  let r = !1,
    s;
  if (i) {
    for (let a = 0; a < e.slides.length; a += 1)
      if (e.slides[a] === i) {
        (r = !0), (s = a);
        break;
      }
  }
  if (i && r)
    (e.clickedSlide = i),
      e.virtual && e.params.virtual.enabled
        ? (e.clickedIndex = parseInt(T(i).attr("data-swiper-slide-index"), 10))
        : (e.clickedIndex = s);
  else {
    (e.clickedSlide = void 0), (e.clickedIndex = void 0);
    return;
  }
  n.slideToClickedSlide &&
    e.clickedIndex !== void 0 &&
    e.clickedIndex !== e.activeIndex &&
    e.slideToClickedSlide();
}
var Yi = {
  updateSize: Fi,
  updateSlides: Bi,
  updateAutoHeight: Ni,
  updateSlidesOffset: Ri,
  updateSlidesProgress: Vi,
  updateProgress: ji,
  updateSlidesClasses: Gi,
  updateActiveIndex: Wi,
  updateClickedSlide: Ui,
};
function Xi(t) {
  t === void 0 && (t = this.isHorizontal() ? "x" : "y");
  const e = this,
    { params: n, rtlTranslate: i, translate: r, $wrapperEl: s } = e;
  if (n.virtualTranslate) return i ? -r : r;
  if (n.cssMode) return r;
  let a = Mi(s[0], t);
  return i && (a = -a), a || 0;
}
function Ki(t, e) {
  const n = this,
    {
      rtlTranslate: i,
      params: r,
      $wrapperEl: s,
      wrapperEl: a,
      progress: d,
    } = n;
  let c = 0,
    o = 0;
  const l = 0;
  n.isHorizontal() ? (c = i ? -t : t) : (o = t),
    r.roundLengths && ((c = Math.floor(c)), (o = Math.floor(o))),
    r.cssMode
      ? (a[n.isHorizontal() ? "scrollLeft" : "scrollTop"] = n.isHorizontal()
          ? -c
          : -o)
      : r.virtualTranslate ||
        s.transform(`translate3d(${c}px, ${o}px, ${l}px)`),
    (n.previousTranslate = n.translate),
    (n.translate = n.isHorizontal() ? c : o);
  let u;
  const p = n.maxTranslate() - n.minTranslate();
  p === 0 ? (u = 0) : (u = (t - n.minTranslate()) / p),
    u !== d && n.updateProgress(t),
    n.emit("setTranslate", n.translate, e);
}
function Qi() {
  return -this.snapGrid[0];
}
function Zi() {
  return -this.snapGrid[this.snapGrid.length - 1];
}
function Ji(t, e, n, i, r) {
  t === void 0 && (t = 0),
    e === void 0 && (e = this.params.speed),
    n === void 0 && (n = !0),
    i === void 0 && (i = !0);
  const s = this,
    { params: a, wrapperEl: d } = s;
  if (s.animating && a.preventInteractionOnTransition) return !1;
  const c = s.minTranslate(),
    o = s.maxTranslate();
  let l;
  if (
    (i && t > c ? (l = c) : i && t < o ? (l = o) : (l = t),
    s.updateProgress(l),
    a.cssMode)
  ) {
    const u = s.isHorizontal();
    if (e === 0) d[u ? "scrollLeft" : "scrollTop"] = -l;
    else {
      if (!s.support.smoothScroll)
        return (
          fn({ swiper: s, targetPosition: -l, side: u ? "left" : "top" }), !0
        );
      d.scrollTo({ [u ? "left" : "top"]: -l, behavior: "smooth" });
    }
    return !0;
  }
  return (
    e === 0
      ? (s.setTransition(0),
        s.setTranslate(l),
        n && (s.emit("beforeTransitionStart", e, r), s.emit("transitionEnd")))
      : (s.setTransition(e),
        s.setTranslate(l),
        n && (s.emit("beforeTransitionStart", e, r), s.emit("transitionStart")),
        s.animating ||
          ((s.animating = !0),
          s.onTranslateToWrapperTransitionEnd ||
            (s.onTranslateToWrapperTransitionEnd = function (p) {
              !s ||
                s.destroyed ||
                (p.target === this &&
                  (s.$wrapperEl[0].removeEventListener(
                    "transitionend",
                    s.onTranslateToWrapperTransitionEnd
                  ),
                  s.$wrapperEl[0].removeEventListener(
                    "webkitTransitionEnd",
                    s.onTranslateToWrapperTransitionEnd
                  ),
                  (s.onTranslateToWrapperTransitionEnd = null),
                  delete s.onTranslateToWrapperTransitionEnd,
                  n && s.emit("transitionEnd")));
            }),
          s.$wrapperEl[0].addEventListener(
            "transitionend",
            s.onTranslateToWrapperTransitionEnd
          ),
          s.$wrapperEl[0].addEventListener(
            "webkitTransitionEnd",
            s.onTranslateToWrapperTransitionEnd
          ))),
    !0
  );
}
var es = {
  getTranslate: Xi,
  setTranslate: Ki,
  minTranslate: Qi,
  maxTranslate: Zi,
  translateTo: Ji,
};
function ts(t, e) {
  const n = this;
  n.params.cssMode || n.$wrapperEl.transition(t), n.emit("setTransition", t, e);
}
function mn(t) {
  let { swiper: e, runCallbacks: n, direction: i, step: r } = t;
  const { activeIndex: s, previousIndex: a } = e;
  let d = i;
  if (
    (d || (s > a ? (d = "next") : s < a ? (d = "prev") : (d = "reset")),
    e.emit(`transition${r}`),
    n && s !== a)
  ) {
    if (d === "reset") {
      e.emit(`slideResetTransition${r}`);
      return;
    }
    e.emit(`slideChangeTransition${r}`),
      d === "next"
        ? e.emit(`slideNextTransition${r}`)
        : e.emit(`slidePrevTransition${r}`);
  }
}
function ns(t, e) {
  t === void 0 && (t = !0);
  const n = this,
    { params: i } = n;
  i.cssMode ||
    (i.autoHeight && n.updateAutoHeight(),
    mn({ swiper: n, runCallbacks: t, direction: e, step: "Start" }));
}
function is(t, e) {
  t === void 0 && (t = !0);
  const n = this,
    { params: i } = n;
  (n.animating = !1),
    !i.cssMode &&
      (n.setTransition(0),
      mn({ swiper: n, runCallbacks: t, direction: e, step: "End" }));
}
var ss = { setTransition: ts, transitionStart: ns, transitionEnd: is };
function rs(t, e, n, i, r) {
  if (
    (t === void 0 && (t = 0),
    e === void 0 && (e = this.params.speed),
    n === void 0 && (n = !0),
    typeof t != "number" && typeof t != "string")
  )
    throw new Error(
      `The 'index' argument cannot have type other than 'number' or 'string'. [${typeof t}] given.`
    );
  if (typeof t == "string") {
    const w = parseInt(t, 10);
    if (!isFinite(w))
      throw new Error(
        `The passed-in 'index' (string) couldn't be converted to 'number'. [${t}] given.`
      );
    t = w;
  }
  const s = this;
  let a = t;
  a < 0 && (a = 0);
  const {
    params: d,
    snapGrid: c,
    slidesGrid: o,
    previousIndex: l,
    activeIndex: u,
    rtlTranslate: p,
    wrapperEl: f,
    enabled: h,
  } = s;
  if ((s.animating && d.preventInteractionOnTransition) || (!h && !i && !r))
    return !1;
  const y = Math.min(s.params.slidesPerGroupSkip, a);
  let m = y + Math.floor((a - y) / s.params.slidesPerGroup);
  m >= c.length && (m = c.length - 1),
    (u || d.initialSlide || 0) === (l || 0) &&
      n &&
      s.emit("beforeSlideChangeStart");
  const g = -c[m];
  if ((s.updateProgress(g), d.normalizeSlideIndex))
    for (let w = 0; w < o.length; w += 1) {
      const C = -Math.floor(g * 100),
        M = Math.floor(o[w] * 100),
        D = Math.floor(o[w + 1] * 100);
      typeof o[w + 1] != "undefined"
        ? C >= M && C < D - (D - M) / 2
          ? (a = w)
          : C >= M && C < D && (a = w + 1)
        : C >= M && (a = w);
    }
  if (
    s.initialized &&
    a !== u &&
    ((!s.allowSlideNext && g < s.translate && g < s.minTranslate()) ||
      (!s.allowSlidePrev &&
        g > s.translate &&
        g > s.maxTranslate() &&
        (u || 0) !== a))
  )
    return !1;
  let b;
  if (
    (a > u ? (b = "next") : a < u ? (b = "prev") : (b = "reset"),
    (p && -g === s.translate) || (!p && g === s.translate))
  )
    return (
      s.updateActiveIndex(a),
      d.autoHeight && s.updateAutoHeight(),
      s.updateSlidesClasses(),
      d.effect !== "slide" && s.setTranslate(g),
      b !== "reset" && (s.transitionStart(n, b), s.transitionEnd(n, b)),
      !1
    );
  if (d.cssMode) {
    const w = s.isHorizontal(),
      C = p ? g : -g;
    if (e === 0) {
      const M = s.virtual && s.params.virtual.enabled;
      M &&
        ((s.wrapperEl.style.scrollSnapType = "none"),
        (s._immediateVirtual = !0)),
        (f[w ? "scrollLeft" : "scrollTop"] = C),
        M &&
          requestAnimationFrame(() => {
            (s.wrapperEl.style.scrollSnapType = ""),
              (s._swiperImmediateVirtual = !1);
          });
    } else {
      if (!s.support.smoothScroll)
        return (
          fn({ swiper: s, targetPosition: C, side: w ? "left" : "top" }), !0
        );
      f.scrollTo({ [w ? "left" : "top"]: C, behavior: "smooth" });
    }
    return !0;
  }
  return (
    s.setTransition(e),
    s.setTranslate(g),
    s.updateActiveIndex(a),
    s.updateSlidesClasses(),
    s.emit("beforeTransitionStart", e, i),
    s.transitionStart(n, b),
    e === 0
      ? s.transitionEnd(n, b)
      : s.animating ||
        ((s.animating = !0),
        s.onSlideToWrapperTransitionEnd ||
          (s.onSlideToWrapperTransitionEnd = function (C) {
            !s ||
              s.destroyed ||
              (C.target === this &&
                (s.$wrapperEl[0].removeEventListener(
                  "transitionend",
                  s.onSlideToWrapperTransitionEnd
                ),
                s.$wrapperEl[0].removeEventListener(
                  "webkitTransitionEnd",
                  s.onSlideToWrapperTransitionEnd
                ),
                (s.onSlideToWrapperTransitionEnd = null),
                delete s.onSlideToWrapperTransitionEnd,
                s.transitionEnd(n, b)));
          }),
        s.$wrapperEl[0].addEventListener(
          "transitionend",
          s.onSlideToWrapperTransitionEnd
        ),
        s.$wrapperEl[0].addEventListener(
          "webkitTransitionEnd",
          s.onSlideToWrapperTransitionEnd
        )),
    !0
  );
}
function as(t, e, n, i) {
  if (
    (t === void 0 && (t = 0),
    e === void 0 && (e = this.params.speed),
    n === void 0 && (n = !0),
    typeof t == "string")
  ) {
    const a = parseInt(t, 10);
    if (!isFinite(a))
      throw new Error(
        `The passed-in 'index' (string) couldn't be converted to 'number'. [${t}] given.`
      );
    t = a;
  }
  const r = this;
  let s = t;
  return r.params.loop && (s += r.loopedSlides), r.slideTo(s, e, n, i);
}
function os(t, e, n) {
  t === void 0 && (t = this.params.speed), e === void 0 && (e = !0);
  const i = this,
    { animating: r, enabled: s, params: a } = i;
  if (!s) return i;
  let d = a.slidesPerGroup;
  a.slidesPerView === "auto" &&
    a.slidesPerGroup === 1 &&
    a.slidesPerGroupAuto &&
    (d = Math.max(i.slidesPerViewDynamic("current", !0), 1));
  const c = i.activeIndex < a.slidesPerGroupSkip ? 1 : d;
  if (a.loop) {
    if (r && a.loopPreventsSlide) return !1;
    i.loopFix(), (i._clientLeft = i.$wrapperEl[0].clientLeft);
  }
  return a.rewind && i.isEnd
    ? i.slideTo(0, t, e, n)
    : i.slideTo(i.activeIndex + c, t, e, n);
}
function ls(t, e, n) {
  t === void 0 && (t = this.params.speed), e === void 0 && (e = !0);
  const i = this,
    {
      params: r,
      animating: s,
      snapGrid: a,
      slidesGrid: d,
      rtlTranslate: c,
      enabled: o,
    } = i;
  if (!o) return i;
  if (r.loop) {
    if (s && r.loopPreventsSlide) return !1;
    i.loopFix(), (i._clientLeft = i.$wrapperEl[0].clientLeft);
  }
  const l = c ? i.translate : -i.translate;
  function u(m) {
    return m < 0 ? -Math.floor(Math.abs(m)) : Math.floor(m);
  }
  const p = u(l),
    f = a.map((m) => u(m));
  let h = a[f.indexOf(p) - 1];
  if (typeof h == "undefined" && r.cssMode) {
    let m;
    a.forEach((g, b) => {
      p >= g && (m = b);
    }),
      typeof m != "undefined" && (h = a[m > 0 ? m - 1 : m]);
  }
  let y = 0;
  if (
    (typeof h != "undefined" &&
      ((y = d.indexOf(h)),
      y < 0 && (y = i.activeIndex - 1),
      r.slidesPerView === "auto" &&
        r.slidesPerGroup === 1 &&
        r.slidesPerGroupAuto &&
        ((y = y - i.slidesPerViewDynamic("previous", !0) + 1),
        (y = Math.max(y, 0)))),
    r.rewind && i.isBeginning)
  ) {
    const m =
      i.params.virtual && i.params.virtual.enabled && i.virtual
        ? i.virtual.slides.length - 1
        : i.slides.length - 1;
    return i.slideTo(m, t, e, n);
  }
  return i.slideTo(y, t, e, n);
}
function cs(t, e, n) {
  t === void 0 && (t = this.params.speed), e === void 0 && (e = !0);
  const i = this;
  return i.slideTo(i.activeIndex, t, e, n);
}
function ds(t, e, n, i) {
  t === void 0 && (t = this.params.speed),
    e === void 0 && (e = !0),
    i === void 0 && (i = 0.5);
  const r = this;
  let s = r.activeIndex;
  const a = Math.min(r.params.slidesPerGroupSkip, s),
    d = a + Math.floor((s - a) / r.params.slidesPerGroup),
    c = r.rtlTranslate ? r.translate : -r.translate;
  if (c >= r.snapGrid[d]) {
    const o = r.snapGrid[d],
      l = r.snapGrid[d + 1];
    c - o > (l - o) * i && (s += r.params.slidesPerGroup);
  } else {
    const o = r.snapGrid[d - 1],
      l = r.snapGrid[d];
    c - o <= (l - o) * i && (s -= r.params.slidesPerGroup);
  }
  return (
    (s = Math.max(s, 0)),
    (s = Math.min(s, r.slidesGrid.length - 1)),
    r.slideTo(s, t, e, n)
  );
}
function us() {
  const t = this,
    { params: e, $wrapperEl: n } = t,
    i = e.slidesPerView === "auto" ? t.slidesPerViewDynamic() : e.slidesPerView;
  let r = t.clickedIndex,
    s;
  if (e.loop) {
    if (t.animating) return;
    (s = parseInt(T(t.clickedSlide).attr("data-swiper-slide-index"), 10)),
      e.centeredSlides
        ? r < t.loopedSlides - i / 2 ||
          r > t.slides.length - t.loopedSlides + i / 2
          ? (t.loopFix(),
            (r = n
              .children(
                `.${e.slideClass}[data-swiper-slide-index="${s}"]:not(.${e.slideDuplicateClass})`
              )
              .eq(0)
              .index()),
            ct(() => {
              t.slideTo(r);
            }))
          : t.slideTo(r)
        : r > t.slides.length - i
        ? (t.loopFix(),
          (r = n
            .children(
              `.${e.slideClass}[data-swiper-slide-index="${s}"]:not(.${e.slideDuplicateClass})`
            )
            .eq(0)
            .index()),
          ct(() => {
            t.slideTo(r);
          }))
        : t.slideTo(r);
  } else t.slideTo(r);
}
var fs = {
  slideTo: rs,
  slideToLoop: as,
  slideNext: os,
  slidePrev: ls,
  slideReset: cs,
  slideToClosest: ds,
  slideToClickedSlide: us,
};
function ps() {
  const t = this,
    e = F(),
    { params: n, $wrapperEl: i } = t,
    r = i.children().length > 0 ? T(i.children()[0].parentNode) : i;
  r.children(`.${n.slideClass}.${n.slideDuplicateClass}`).remove();
  let s = r.children(`.${n.slideClass}`);
  if (n.loopFillGroupWithBlank) {
    const c = n.slidesPerGroup - (s.length % n.slidesPerGroup);
    if (c !== n.slidesPerGroup) {
      for (let o = 0; o < c; o += 1) {
        const l = T(e.createElement("div")).addClass(
          `${n.slideClass} ${n.slideBlankClass}`
        );
        r.append(l);
      }
      s = r.children(`.${n.slideClass}`);
    }
  }
  n.slidesPerView === "auto" && !n.loopedSlides && (n.loopedSlides = s.length),
    (t.loopedSlides = Math.ceil(
      parseFloat(n.loopedSlides || n.slidesPerView, 10)
    )),
    (t.loopedSlides += n.loopAdditionalSlides),
    t.loopedSlides > s.length &&
      t.params.loopedSlidesLimit &&
      (t.loopedSlides = s.length);
  const a = [],
    d = [];
  s.each((c, o) => {
    T(c).attr("data-swiper-slide-index", o);
  });
  for (let c = 0; c < t.loopedSlides; c += 1) {
    const o = c - Math.floor(c / s.length) * s.length;
    d.push(s.eq(o)[0]), a.unshift(s.eq(s.length - o - 1)[0]);
  }
  for (let c = 0; c < d.length; c += 1)
    r.append(T(d[c].cloneNode(!0)).addClass(n.slideDuplicateClass));
  for (let c = a.length - 1; c >= 0; c -= 1)
    r.prepend(T(a[c].cloneNode(!0)).addClass(n.slideDuplicateClass));
}
function ms() {
  const t = this;
  t.emit("beforeLoopFix");
  const {
    activeIndex: e,
    slides: n,
    loopedSlides: i,
    allowSlidePrev: r,
    allowSlideNext: s,
    snapGrid: a,
    rtlTranslate: d,
  } = t;
  let c;
  (t.allowSlidePrev = !0), (t.allowSlideNext = !0);
  const l = -a[e] - t.getTranslate();
  e < i
    ? ((c = n.length - i * 3 + e),
      (c += i),
      t.slideTo(c, 0, !1, !0) &&
        l !== 0 &&
        t.setTranslate((d ? -t.translate : t.translate) - l))
    : e >= n.length - i &&
      ((c = -n.length + e + i),
      (c += i),
      t.slideTo(c, 0, !1, !0) &&
        l !== 0 &&
        t.setTranslate((d ? -t.translate : t.translate) - l)),
    (t.allowSlidePrev = r),
    (t.allowSlideNext = s),
    t.emit("loopFix");
}
function hs() {
  const t = this,
    { $wrapperEl: e, params: n, slides: i } = t;
  e
    .children(
      `.${n.slideClass}.${n.slideDuplicateClass},.${n.slideClass}.${n.slideBlankClass}`
    )
    .remove(),
    i.removeAttr("data-swiper-slide-index");
}
var gs = { loopCreate: ps, loopFix: ms, loopDestroy: hs };
function vs(t) {
  const e = this;
  if (
    e.support.touch ||
    !e.params.simulateTouch ||
    (e.params.watchOverflow && e.isLocked) ||
    e.params.cssMode
  )
    return;
  const n = e.params.touchEventsTarget === "container" ? e.el : e.wrapperEl;
  (n.style.cursor = "move"), (n.style.cursor = t ? "grabbing" : "grab");
}
function ys() {
  const t = this;
  t.support.touch ||
    (t.params.watchOverflow && t.isLocked) ||
    t.params.cssMode ||
    (t[
      t.params.touchEventsTarget === "container" ? "el" : "wrapperEl"
    ].style.cursor = "");
}
var ws = { setGrabCursor: vs, unsetGrabCursor: ys };
function bs(t, e) {
  e === void 0 && (e = this);
  function n(i) {
    if (!i || i === F() || i === H()) return null;
    i.assignedSlot && (i = i.assignedSlot);
    const r = i.closest(t);
    return !r && !i.getRootNode ? null : r || n(i.getRootNode().host);
  }
  return n(e);
}
function Ss(t) {
  const e = this,
    n = F(),
    i = H(),
    r = e.touchEventsData,
    { params: s, touches: a, enabled: d } = e;
  if (!d || (e.animating && s.preventInteractionOnTransition)) return;
  !e.animating && s.cssMode && s.loop && e.loopFix();
  let c = t;
  c.originalEvent && (c = c.originalEvent);
  let o = T(c.target);
  if (
    (s.touchEventsTarget === "wrapper" && !o.closest(e.wrapperEl).length) ||
    ((r.isTouchEvent = c.type === "touchstart"),
    !r.isTouchEvent && "which" in c && c.which === 3) ||
    (!r.isTouchEvent && "button" in c && c.button > 0) ||
    (r.isTouched && r.isMoved)
  )
    return;
  !!s.noSwipingClass &&
    s.noSwipingClass !== "" &&
    c.target &&
    c.target.shadowRoot &&
    t.path &&
    t.path[0] &&
    (o = T(t.path[0]));
  const u = s.noSwipingSelector ? s.noSwipingSelector : `.${s.noSwipingClass}`,
    p = !!(c.target && c.target.shadowRoot);
  if (s.noSwiping && (p ? bs(u, o[0]) : o.closest(u)[0])) {
    e.allowClick = !0;
    return;
  }
  if (s.swipeHandler && !o.closest(s.swipeHandler)[0]) return;
  (a.currentX = c.type === "touchstart" ? c.targetTouches[0].pageX : c.pageX),
    (a.currentY = c.type === "touchstart" ? c.targetTouches[0].pageY : c.pageY);
  const f = a.currentX,
    h = a.currentY,
    y = s.edgeSwipeDetection || s.iOSEdgeSwipeDetection,
    m = s.edgeSwipeThreshold || s.iOSEdgeSwipeThreshold;
  if (y && (f <= m || f >= i.innerWidth - m))
    if (y === "prevent") t.preventDefault();
    else return;
  if (
    (Object.assign(r, {
      isTouched: !0,
      isMoved: !1,
      allowTouchCallbacks: !0,
      isScrolling: void 0,
      startMoving: void 0,
    }),
    (a.startX = f),
    (a.startY = h),
    (r.touchStartTime = _e()),
    (e.allowClick = !0),
    e.updateSize(),
    (e.swipeDirection = void 0),
    s.threshold > 0 && (r.allowThresholdMove = !1),
    c.type !== "touchstart")
  ) {
    let g = !0;
    o.is(r.focusableElements) &&
      ((g = !1), o[0].nodeName === "SELECT" && (r.isTouched = !1)),
      n.activeElement &&
        T(n.activeElement).is(r.focusableElements) &&
        n.activeElement !== o[0] &&
        n.activeElement.blur();
    const b = g && e.allowTouchMove && s.touchStartPreventDefault;
    (s.touchStartForcePreventDefault || b) &&
      !o[0].isContentEditable &&
      c.preventDefault();
  }
  e.params.freeMode &&
    e.params.freeMode.enabled &&
    e.freeMode &&
    e.animating &&
    !s.cssMode &&
    e.freeMode.onTouchStart(),
    e.emit("touchStart", c);
}
function Es(t) {
  const e = F(),
    n = this,
    i = n.touchEventsData,
    { params: r, touches: s, rtlTranslate: a, enabled: d } = n;
  if (!d) return;
  let c = t;
  if ((c.originalEvent && (c = c.originalEvent), !i.isTouched)) {
    i.startMoving && i.isScrolling && n.emit("touchMoveOpposite", c);
    return;
  }
  if (i.isTouchEvent && c.type !== "touchmove") return;
  const o =
      c.type === "touchmove" &&
      c.targetTouches &&
      (c.targetTouches[0] || c.changedTouches[0]),
    l = c.type === "touchmove" ? o.pageX : c.pageX,
    u = c.type === "touchmove" ? o.pageY : c.pageY;
  if (c.preventedByNestedSwiper) {
    (s.startX = l), (s.startY = u);
    return;
  }
  if (!n.allowTouchMove) {
    T(c.target).is(i.focusableElements) || (n.allowClick = !1),
      i.isTouched &&
        (Object.assign(s, { startX: l, startY: u, currentX: l, currentY: u }),
        (i.touchStartTime = _e()));
    return;
  }
  if (i.isTouchEvent && r.touchReleaseOnEdges && !r.loop) {
    if (n.isVertical()) {
      if (
        (u < s.startY && n.translate <= n.maxTranslate()) ||
        (u > s.startY && n.translate >= n.minTranslate())
      ) {
        (i.isTouched = !1), (i.isMoved = !1);
        return;
      }
    } else if (
      (l < s.startX && n.translate <= n.maxTranslate()) ||
      (l > s.startX && n.translate >= n.minTranslate())
    )
      return;
  }
  if (
    i.isTouchEvent &&
    e.activeElement &&
    c.target === e.activeElement &&
    T(c.target).is(i.focusableElements)
  ) {
    (i.isMoved = !0), (n.allowClick = !1);
    return;
  }
  if (
    (i.allowTouchCallbacks && n.emit("touchMove", c),
    c.targetTouches && c.targetTouches.length > 1)
  )
    return;
  (s.currentX = l), (s.currentY = u);
  const p = s.currentX - s.startX,
    f = s.currentY - s.startY;
  if (n.params.threshold && Math.sqrt(p ** 2 + f ** 2) < n.params.threshold)
    return;
  if (typeof i.isScrolling == "undefined") {
    let g;
    (n.isHorizontal() && s.currentY === s.startY) ||
    (n.isVertical() && s.currentX === s.startX)
      ? (i.isScrolling = !1)
      : p * p + f * f >= 25 &&
        ((g = (Math.atan2(Math.abs(f), Math.abs(p)) * 180) / Math.PI),
        (i.isScrolling = n.isHorizontal()
          ? g > r.touchAngle
          : 90 - g > r.touchAngle));
  }
  if (
    (i.isScrolling && n.emit("touchMoveOpposite", c),
    typeof i.startMoving == "undefined" &&
      (s.currentX !== s.startX || s.currentY !== s.startY) &&
      (i.startMoving = !0),
    i.isScrolling)
  ) {
    i.isTouched = !1;
    return;
  }
  if (!i.startMoving) return;
  (n.allowClick = !1),
    !r.cssMode && c.cancelable && c.preventDefault(),
    r.touchMoveStopPropagation && !r.nested && c.stopPropagation(),
    i.isMoved ||
      (r.loop && !r.cssMode && n.loopFix(),
      (i.startTranslate = n.getTranslate()),
      n.setTransition(0),
      n.animating && n.$wrapperEl.trigger("webkitTransitionEnd transitionend"),
      (i.allowMomentumBounce = !1),
      r.grabCursor &&
        (n.allowSlideNext === !0 || n.allowSlidePrev === !0) &&
        n.setGrabCursor(!0),
      n.emit("sliderFirstMove", c)),
    n.emit("sliderMove", c),
    (i.isMoved = !0);
  let h = n.isHorizontal() ? p : f;
  (s.diff = h),
    (h *= r.touchRatio),
    a && (h = -h),
    (n.swipeDirection = h > 0 ? "prev" : "next"),
    (i.currentTranslate = h + i.startTranslate);
  let y = !0,
    m = r.resistanceRatio;
  if (
    (r.touchReleaseOnEdges && (m = 0),
    h > 0 && i.currentTranslate > n.minTranslate()
      ? ((y = !1),
        r.resistance &&
          (i.currentTranslate =
            n.minTranslate() -
            1 +
            (-n.minTranslate() + i.startTranslate + h) ** m))
      : h < 0 &&
        i.currentTranslate < n.maxTranslate() &&
        ((y = !1),
        r.resistance &&
          (i.currentTranslate =
            n.maxTranslate() +
            1 -
            (n.maxTranslate() - i.startTranslate - h) ** m)),
    y && (c.preventedByNestedSwiper = !0),
    !n.allowSlideNext &&
      n.swipeDirection === "next" &&
      i.currentTranslate < i.startTranslate &&
      (i.currentTranslate = i.startTranslate),
    !n.allowSlidePrev &&
      n.swipeDirection === "prev" &&
      i.currentTranslate > i.startTranslate &&
      (i.currentTranslate = i.startTranslate),
    !n.allowSlidePrev &&
      !n.allowSlideNext &&
      (i.currentTranslate = i.startTranslate),
    r.threshold > 0)
  )
    if (Math.abs(h) > r.threshold || i.allowThresholdMove) {
      if (!i.allowThresholdMove) {
        (i.allowThresholdMove = !0),
          (s.startX = s.currentX),
          (s.startY = s.currentY),
          (i.currentTranslate = i.startTranslate),
          (s.diff = n.isHorizontal()
            ? s.currentX - s.startX
            : s.currentY - s.startY);
        return;
      }
    } else {
      i.currentTranslate = i.startTranslate;
      return;
    }
  !r.followFinger ||
    r.cssMode ||
    (((r.freeMode && r.freeMode.enabled && n.freeMode) ||
      r.watchSlidesProgress) &&
      (n.updateActiveIndex(), n.updateSlidesClasses()),
    n.params.freeMode &&
      r.freeMode.enabled &&
      n.freeMode &&
      n.freeMode.onTouchMove(),
    n.updateProgress(i.currentTranslate),
    n.setTranslate(i.currentTranslate));
}
function Cs(t) {
  const e = this,
    n = e.touchEventsData,
    { params: i, touches: r, rtlTranslate: s, slidesGrid: a, enabled: d } = e;
  if (!d) return;
  let c = t;
  if (
    (c.originalEvent && (c = c.originalEvent),
    n.allowTouchCallbacks && e.emit("touchEnd", c),
    (n.allowTouchCallbacks = !1),
    !n.isTouched)
  ) {
    n.isMoved && i.grabCursor && e.setGrabCursor(!1),
      (n.isMoved = !1),
      (n.startMoving = !1);
    return;
  }
  i.grabCursor &&
    n.isMoved &&
    n.isTouched &&
    (e.allowSlideNext === !0 || e.allowSlidePrev === !0) &&
    e.setGrabCursor(!1);
  const o = _e(),
    l = o - n.touchStartTime;
  if (e.allowClick) {
    const b = c.path || (c.composedPath && c.composedPath());
    e.updateClickedSlide((b && b[0]) || c.target),
      e.emit("tap click", c),
      l < 300 &&
        o - n.lastClickTime < 300 &&
        e.emit("doubleTap doubleClick", c);
  }
  if (
    ((n.lastClickTime = _e()),
    ct(() => {
      e.destroyed || (e.allowClick = !0);
    }),
    !n.isTouched ||
      !n.isMoved ||
      !e.swipeDirection ||
      r.diff === 0 ||
      n.currentTranslate === n.startTranslate)
  ) {
    (n.isTouched = !1), (n.isMoved = !1), (n.startMoving = !1);
    return;
  }
  (n.isTouched = !1), (n.isMoved = !1), (n.startMoving = !1);
  let u;
  if (
    (i.followFinger
      ? (u = s ? e.translate : -e.translate)
      : (u = -n.currentTranslate),
    i.cssMode)
  )
    return;
  if (e.params.freeMode && i.freeMode.enabled) {
    e.freeMode.onTouchEnd({ currentPos: u });
    return;
  }
  let p = 0,
    f = e.slidesSizesGrid[0];
  for (
    let b = 0;
    b < a.length;
    b += b < i.slidesPerGroupSkip ? 1 : i.slidesPerGroup
  ) {
    const w = b < i.slidesPerGroupSkip - 1 ? 1 : i.slidesPerGroup;
    typeof a[b + w] != "undefined"
      ? u >= a[b] && u < a[b + w] && ((p = b), (f = a[b + w] - a[b]))
      : u >= a[b] && ((p = b), (f = a[a.length - 1] - a[a.length - 2]));
  }
  let h = null,
    y = null;
  i.rewind &&
    (e.isBeginning
      ? (y =
          e.params.virtual && e.params.virtual.enabled && e.virtual
            ? e.virtual.slides.length - 1
            : e.slides.length - 1)
      : e.isEnd && (h = 0));
  const m = (u - a[p]) / f,
    g = p < i.slidesPerGroupSkip - 1 ? 1 : i.slidesPerGroup;
  if (l > i.longSwipesMs) {
    if (!i.longSwipes) {
      e.slideTo(e.activeIndex);
      return;
    }
    e.swipeDirection === "next" &&
      (m >= i.longSwipesRatio
        ? e.slideTo(i.rewind && e.isEnd ? h : p + g)
        : e.slideTo(p)),
      e.swipeDirection === "prev" &&
        (m > 1 - i.longSwipesRatio
          ? e.slideTo(p + g)
          : y !== null && m < 0 && Math.abs(m) > i.longSwipesRatio
          ? e.slideTo(y)
          : e.slideTo(p));
  } else {
    if (!i.shortSwipes) {
      e.slideTo(e.activeIndex);
      return;
    }
    e.navigation &&
    (c.target === e.navigation.nextEl || c.target === e.navigation.prevEl)
      ? c.target === e.navigation.nextEl
        ? e.slideTo(p + g)
        : e.slideTo(p)
      : (e.swipeDirection === "next" && e.slideTo(h !== null ? h : p + g),
        e.swipeDirection === "prev" && e.slideTo(y !== null ? y : p));
  }
}
function qt() {
  const t = this,
    { params: e, el: n } = t;
  if (n && n.offsetWidth === 0) return;
  e.breakpoints && t.setBreakpoint();
  const { allowSlideNext: i, allowSlidePrev: r, snapGrid: s } = t;
  (t.allowSlideNext = !0),
    (t.allowSlidePrev = !0),
    t.updateSize(),
    t.updateSlides(),
    t.updateSlidesClasses(),
    (e.slidesPerView === "auto" || e.slidesPerView > 1) &&
    t.isEnd &&
    !t.isBeginning &&
    !t.params.centeredSlides
      ? t.slideTo(t.slides.length - 1, 0, !1, !0)
      : t.slideTo(t.activeIndex, 0, !1, !0),
    t.autoplay && t.autoplay.running && t.autoplay.paused && t.autoplay.run(),
    (t.allowSlidePrev = r),
    (t.allowSlideNext = i),
    t.params.watchOverflow && s !== t.snapGrid && t.checkOverflow();
}
function Ts(t) {
  const e = this;
  !e.enabled ||
    e.allowClick ||
    (e.params.preventClicks && t.preventDefault(),
    e.params.preventClicksPropagation &&
      e.animating &&
      (t.stopPropagation(), t.stopImmediatePropagation()));
}
function xs() {
  const t = this,
    { wrapperEl: e, rtlTranslate: n, enabled: i } = t;
  if (!i) return;
  (t.previousTranslate = t.translate),
    t.isHorizontal()
      ? (t.translate = -e.scrollLeft)
      : (t.translate = -e.scrollTop),
    t.translate === 0 && (t.translate = 0),
    t.updateActiveIndex(),
    t.updateSlidesClasses();
  let r;
  const s = t.maxTranslate() - t.minTranslate();
  s === 0 ? (r = 0) : (r = (t.translate - t.minTranslate()) / s),
    r !== t.progress && t.updateProgress(n ? -t.translate : t.translate),
    t.emit("setTranslate", t.translate, !1);
}
let _t = !1;
function Ls() {}
const hn = (t, e) => {
  const n = F(),
    {
      params: i,
      touchEvents: r,
      el: s,
      wrapperEl: a,
      device: d,
      support: c,
    } = t,
    o = !!i.nested,
    l = e === "on" ? "addEventListener" : "removeEventListener",
    u = e;
  if (!c.touch)
    s[l](r.start, t.onTouchStart, !1),
      n[l](r.move, t.onTouchMove, o),
      n[l](r.end, t.onTouchEnd, !1);
  else {
    const p =
      r.start === "touchstart" && c.passiveListener && i.passiveListeners
        ? { passive: !0, capture: !1 }
        : !1;
    s[l](r.start, t.onTouchStart, p),
      s[l](
        r.move,
        t.onTouchMove,
        c.passiveListener ? { passive: !1, capture: o } : o
      ),
      s[l](r.end, t.onTouchEnd, p),
      r.cancel && s[l](r.cancel, t.onTouchEnd, p);
  }
  (i.preventClicks || i.preventClicksPropagation) &&
    s[l]("click", t.onClick, !0),
    i.cssMode && a[l]("scroll", t.onScroll),
    i.updateOnWindowResize
      ? t[u](
          d.ios || d.android
            ? "resize orientationchange observerUpdate"
            : "resize observerUpdate",
          qt,
          !0
        )
      : t[u]("observerUpdate", qt, !0);
};
function ks() {
  const t = this,
    e = F(),
    { params: n, support: i } = t;
  (t.onTouchStart = Ss.bind(t)),
    (t.onTouchMove = Es.bind(t)),
    (t.onTouchEnd = Cs.bind(t)),
    n.cssMode && (t.onScroll = xs.bind(t)),
    (t.onClick = Ts.bind(t)),
    i.touch && !_t && (e.addEventListener("touchstart", Ls), (_t = !0)),
    hn(t, "on");
}
function Ps() {
  hn(this, "off");
}
var Ms = { attachEvents: ks, detachEvents: Ps };
const At = (t, e) => t.grid && e.grid && e.grid.rows > 1;
function Os() {
  const t = this,
    {
      activeIndex: e,
      initialized: n,
      loopedSlides: i = 0,
      params: r,
      $el: s,
    } = t,
    a = r.breakpoints;
  if (!a || (a && Object.keys(a).length === 0)) return;
  const d = t.getBreakpoint(a, t.params.breakpointsBase, t.el);
  if (!d || t.currentBreakpoint === d) return;
  const o = (d in a ? a[d] : void 0) || t.originalParams,
    l = At(t, r),
    u = At(t, o),
    p = r.enabled;
  l && !u
    ? (s.removeClass(
        `${r.containerModifierClass}grid ${r.containerModifierClass}grid-column`
      ),
      t.emitContainerClasses())
    : !l &&
      u &&
      (s.addClass(`${r.containerModifierClass}grid`),
      ((o.grid.fill && o.grid.fill === "column") ||
        (!o.grid.fill && r.grid.fill === "column")) &&
        s.addClass(`${r.containerModifierClass}grid-column`),
      t.emitContainerClasses()),
    ["navigation", "pagination", "scrollbar"].forEach((m) => {
      const g = r[m] && r[m].enabled,
        b = o[m] && o[m].enabled;
      g && !b && t[m].disable(), !g && b && t[m].enable();
    });
  const f = o.direction && o.direction !== r.direction,
    h = r.loop && (o.slidesPerView !== r.slidesPerView || f);
  f && n && t.changeDirection(), R(t.params, o);
  const y = t.params.enabled;
  Object.assign(t, {
    allowTouchMove: t.params.allowTouchMove,
    allowSlideNext: t.params.allowSlideNext,
    allowSlidePrev: t.params.allowSlidePrev,
  }),
    p && !y ? t.disable() : !p && y && t.enable(),
    (t.currentBreakpoint = d),
    t.emit("_beforeBreakpoint", o),
    h &&
      n &&
      (t.loopDestroy(),
      t.loopCreate(),
      t.updateSlides(),
      t.slideTo(e - i + t.loopedSlides, 0, !1)),
    t.emit("breakpoint", o);
}
function Ds(t, e, n) {
  if ((e === void 0 && (e = "window"), !t || (e === "container" && !n))) return;
  let i = !1;
  const r = H(),
    s = e === "window" ? r.innerHeight : n.clientHeight,
    a = Object.keys(t).map((d) => {
      if (typeof d == "string" && d.indexOf("@") === 0) {
        const c = parseFloat(d.substr(1));
        return { value: s * c, point: d };
      }
      return { value: d, point: d };
    });
  a.sort((d, c) => parseInt(d.value, 10) - parseInt(c.value, 10));
  for (let d = 0; d < a.length; d += 1) {
    const { point: c, value: o } = a[d];
    e === "window"
      ? r.matchMedia(`(min-width: ${o}px)`).matches && (i = c)
      : o <= n.clientWidth && (i = c);
  }
  return i || "max";
}
var zs = { setBreakpoint: Os, getBreakpoint: Ds };
function Is(t, e) {
  const n = [];
  return (
    t.forEach((i) => {
      typeof i == "object"
        ? Object.keys(i).forEach((r) => {
            i[r] && n.push(e + r);
          })
        : typeof i == "string" && n.push(e + i);
    }),
    n
  );
}
function $s() {
  const t = this,
    { classNames: e, params: n, rtl: i, $el: r, device: s, support: a } = t,
    d = Is(
      [
        "initialized",
        n.direction,
        { "pointer-events": !a.touch },
        { "free-mode": t.params.freeMode && n.freeMode.enabled },
        { autoheight: n.autoHeight },
        { rtl: i },
        { grid: n.grid && n.grid.rows > 1 },
        {
          "grid-column": n.grid && n.grid.rows > 1 && n.grid.fill === "column",
        },
        { android: s.android },
        { ios: s.ios },
        { "css-mode": n.cssMode },
        { centered: n.cssMode && n.centeredSlides },
        { "watch-progress": n.watchSlidesProgress },
      ],
      n.containerModifierClass
    );
  e.push(...d), r.addClass([...e].join(" ")), t.emitContainerClasses();
}
function qs() {
  const t = this,
    { $el: e, classNames: n } = t;
  e.removeClass(n.join(" ")), t.emitContainerClasses();
}
var _s = { addClasses: $s, removeClasses: qs };
function As(t, e, n, i, r, s) {
  const a = H();
  let d;
  function c() {
    s && s();
  }
  !T(t).parent("picture")[0] && (!t.complete || !r) && e
    ? ((d = new a.Image()),
      (d.onload = c),
      (d.onerror = c),
      i && (d.sizes = i),
      n && (d.srcset = n),
      e && (d.src = e))
    : c();
}
function Hs() {
  const t = this;
  t.imagesToLoad = t.$el.find("img");
  function e() {
    typeof t == "undefined" ||
      t === null ||
      !t ||
      t.destroyed ||
      (t.imagesLoaded !== void 0 && (t.imagesLoaded += 1),
      t.imagesLoaded === t.imagesToLoad.length &&
        (t.params.updateOnImagesReady && t.update(), t.emit("imagesReady")));
  }
  for (let n = 0; n < t.imagesToLoad.length; n += 1) {
    const i = t.imagesToLoad[n];
    t.loadImage(
      i,
      i.currentSrc || i.getAttribute("src"),
      i.srcset || i.getAttribute("srcset"),
      i.sizes || i.getAttribute("sizes"),
      !0,
      e
    );
  }
}
var Fs = { loadImage: As, preloadImages: Hs };
function Bs() {
  const t = this,
    { isLocked: e, params: n } = t,
    { slidesOffsetBefore: i } = n;
  if (i) {
    const r = t.slides.length - 1,
      s = t.slidesGrid[r] + t.slidesSizesGrid[r] + i * 2;
    t.isLocked = t.size > s;
  } else t.isLocked = t.snapGrid.length === 1;
  n.allowSlideNext === !0 && (t.allowSlideNext = !t.isLocked),
    n.allowSlidePrev === !0 && (t.allowSlidePrev = !t.isLocked),
    e && e !== t.isLocked && (t.isEnd = !1),
    e !== t.isLocked && t.emit(t.isLocked ? "lock" : "unlock");
}
var Ns = { checkOverflow: Bs },
  Ht = {
    init: !0,
    direction: "horizontal",
    touchEventsTarget: "wrapper",
    initialSlide: 0,
    speed: 300,
    cssMode: !1,
    updateOnWindowResize: !0,
    resizeObserver: !0,
    nested: !1,
    createElements: !1,
    enabled: !0,
    focusableElements: "input, select, option, textarea, button, video, label",
    width: null,
    height: null,
    preventInteractionOnTransition: !1,
    userAgent: null,
    url: null,
    edgeSwipeDetection: !1,
    edgeSwipeThreshold: 20,
    autoHeight: !1,
    setWrapperSize: !1,
    virtualTranslate: !1,
    effect: "slide",
    breakpoints: void 0,
    breakpointsBase: "window",
    spaceBetween: 0,
    slidesPerView: 1,
    slidesPerGroup: 1,
    slidesPerGroupSkip: 0,
    slidesPerGroupAuto: !1,
    centeredSlides: !1,
    centeredSlidesBounds: !1,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
    normalizeSlideIndex: !0,
    centerInsufficientSlides: !1,
    watchOverflow: !0,
    roundLengths: !1,
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: !0,
    shortSwipes: !0,
    longSwipes: !0,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: !0,
    allowTouchMove: !0,
    threshold: 0,
    touchMoveStopPropagation: !1,
    touchStartPreventDefault: !0,
    touchStartForcePreventDefault: !1,
    touchReleaseOnEdges: !1,
    uniqueNavElements: !0,
    resistance: !0,
    resistanceRatio: 0.85,
    watchSlidesProgress: !1,
    grabCursor: !1,
    preventClicks: !0,
    preventClicksPropagation: !0,
    slideToClickedSlide: !1,
    preloadImages: !0,
    updateOnImagesReady: !0,
    loop: !1,
    loopAdditionalSlides: 0,
    loopedSlides: null,
    loopedSlidesLimit: !0,
    loopFillGroupWithBlank: !1,
    loopPreventsSlide: !0,
    rewind: !1,
    allowSlidePrev: !0,
    allowSlideNext: !0,
    swipeHandler: null,
    noSwiping: !0,
    noSwipingClass: "swiper-no-swiping",
    noSwipingSelector: null,
    passiveListeners: !0,
    maxBackfaceHiddenSlides: 10,
    containerModifierClass: "swiper-",
    slideClass: "swiper-slide",
    slideBlankClass: "swiper-slide-invisible-blank",
    slideActiveClass: "swiper-slide-active",
    slideDuplicateActiveClass: "swiper-slide-duplicate-active",
    slideVisibleClass: "swiper-slide-visible",
    slideDuplicateClass: "swiper-slide-duplicate",
    slideNextClass: "swiper-slide-next",
    slideDuplicateNextClass: "swiper-slide-duplicate-next",
    slidePrevClass: "swiper-slide-prev",
    slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
    wrapperClass: "swiper-wrapper",
    runCallbacksOnInit: !0,
    _emitClasses: !1,
  };
function Rs(t, e) {
  return function (i) {
    i === void 0 && (i = {});
    const r = Object.keys(i)[0],
      s = i[r];
    if (typeof s != "object" || s === null) {
      R(e, i);
      return;
    }
    if (
      (["navigation", "pagination", "scrollbar"].indexOf(r) >= 0 &&
        t[r] === !0 &&
        (t[r] = { auto: !0 }),
      !(r in t && "enabled" in s))
    ) {
      R(e, i);
      return;
    }
    t[r] === !0 && (t[r] = { enabled: !0 }),
      typeof t[r] == "object" && !("enabled" in t[r]) && (t[r].enabled = !0),
      t[r] || (t[r] = { enabled: !1 }),
      R(e, i);
  };
}
const gt = {
    eventsEmitter: Hi,
    update: Yi,
    translate: es,
    transition: ss,
    slide: fs,
    loop: gs,
    grabCursor: ws,
    events: Ms,
    breakpoints: zs,
    checkOverflow: Ns,
    classes: _s,
    images: Fs,
  },
  vt = {};
class A {
  constructor() {
    let e, n;
    for (var i = arguments.length, r = new Array(i), s = 0; s < i; s++)
      r[s] = arguments[s];
    if (
      (r.length === 1 &&
      r[0].constructor &&
      Object.prototype.toString.call(r[0]).slice(8, -1) === "Object"
        ? (n = r[0])
        : ([e, n] = r),
      n || (n = {}),
      (n = R({}, n)),
      e && !n.el && (n.el = e),
      n.el && T(n.el).length > 1)
    ) {
      const o = [];
      return (
        T(n.el).each((l) => {
          const u = R({}, n, { el: l });
          o.push(new A(u));
        }),
        o
      );
    }
    const a = this;
    (a.__swiper__ = !0),
      (a.support = pn()),
      (a.device = Ii({ userAgent: n.userAgent })),
      (a.browser = qi()),
      (a.eventsListeners = {}),
      (a.eventsAnyListeners = []),
      (a.modules = [...a.__modules__]),
      n.modules && Array.isArray(n.modules) && a.modules.push(...n.modules);
    const d = {};
    a.modules.forEach((o) => {
      o({
        swiper: a,
        extendParams: Rs(n, d),
        on: a.on.bind(a),
        once: a.once.bind(a),
        off: a.off.bind(a),
        emit: a.emit.bind(a),
      });
    });
    const c = R({}, Ht, d);
    return (
      (a.params = R({}, c, vt, n)),
      (a.originalParams = R({}, a.params)),
      (a.passedParams = R({}, n)),
      a.params &&
        a.params.on &&
        Object.keys(a.params.on).forEach((o) => {
          a.on(o, a.params.on[o]);
        }),
      a.params && a.params.onAny && a.onAny(a.params.onAny),
      (a.$ = T),
      Object.assign(a, {
        enabled: a.params.enabled,
        el: e,
        classNames: [],
        slides: T(),
        slidesGrid: [],
        snapGrid: [],
        slidesSizesGrid: [],
        isHorizontal() {
          return a.params.direction === "horizontal";
        },
        isVertical() {
          return a.params.direction === "vertical";
        },
        activeIndex: 0,
        realIndex: 0,
        isBeginning: !0,
        isEnd: !1,
        translate: 0,
        previousTranslate: 0,
        progress: 0,
        velocity: 0,
        animating: !1,
        allowSlideNext: a.params.allowSlideNext,
        allowSlidePrev: a.params.allowSlidePrev,
        touchEvents: (function () {
          const l = ["touchstart", "touchmove", "touchend", "touchcancel"],
            u = ["pointerdown", "pointermove", "pointerup"];
          return (
            (a.touchEventsTouch = {
              start: l[0],
              move: l[1],
              end: l[2],
              cancel: l[3],
            }),
            (a.touchEventsDesktop = { start: u[0], move: u[1], end: u[2] }),
            a.support.touch || !a.params.simulateTouch
              ? a.touchEventsTouch
              : a.touchEventsDesktop
          );
        })(),
        touchEventsData: {
          isTouched: void 0,
          isMoved: void 0,
          allowTouchCallbacks: void 0,
          touchStartTime: void 0,
          isScrolling: void 0,
          currentTranslate: void 0,
          startTranslate: void 0,
          allowThresholdMove: void 0,
          focusableElements: a.params.focusableElements,
          lastClickTime: _e(),
          clickTimeout: void 0,
          velocities: [],
          allowMomentumBounce: void 0,
          isTouchEvent: void 0,
          startMoving: void 0,
        },
        allowClick: !0,
        allowTouchMove: a.params.allowTouchMove,
        touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 },
        imagesToLoad: [],
        imagesLoaded: 0,
      }),
      a.emit("_swiper"),
      a.params.init && a.init(),
      a
    );
  }
  enable() {
    const e = this;
    e.enabled ||
      ((e.enabled = !0),
      e.params.grabCursor && e.setGrabCursor(),
      e.emit("enable"));
  }
  disable() {
    const e = this;
    !e.enabled ||
      ((e.enabled = !1),
      e.params.grabCursor && e.unsetGrabCursor(),
      e.emit("disable"));
  }
  setProgress(e, n) {
    const i = this;
    e = Math.min(Math.max(e, 0), 1);
    const r = i.minTranslate(),
      a = (i.maxTranslate() - r) * e + r;
    i.translateTo(a, typeof n == "undefined" ? 0 : n),
      i.updateActiveIndex(),
      i.updateSlidesClasses();
  }
  emitContainerClasses() {
    const e = this;
    if (!e.params._emitClasses || !e.el) return;
    const n = e.el.className
      .split(" ")
      .filter(
        (i) =>
          i.indexOf("swiper") === 0 ||
          i.indexOf(e.params.containerModifierClass) === 0
      );
    e.emit("_containerClasses", n.join(" "));
  }
  getSlideClasses(e) {
    const n = this;
    return n.destroyed
      ? ""
      : e.className
          .split(" ")
          .filter(
            (i) =>
              i.indexOf("swiper-slide") === 0 ||
              i.indexOf(n.params.slideClass) === 0
          )
          .join(" ");
  }
  emitSlidesClasses() {
    const e = this;
    if (!e.params._emitClasses || !e.el) return;
    const n = [];
    e.slides.each((i) => {
      const r = e.getSlideClasses(i);
      n.push({ slideEl: i, classNames: r }), e.emit("_slideClass", i, r);
    }),
      e.emit("_slideClasses", n);
  }
  slidesPerViewDynamic(e, n) {
    e === void 0 && (e = "current"), n === void 0 && (n = !1);
    const i = this,
      {
        params: r,
        slides: s,
        slidesGrid: a,
        slidesSizesGrid: d,
        size: c,
        activeIndex: o,
      } = i;
    let l = 1;
    if (r.centeredSlides) {
      let u = s[o].swiperSlideSize,
        p;
      for (let f = o + 1; f < s.length; f += 1)
        s[f] &&
          !p &&
          ((u += s[f].swiperSlideSize), (l += 1), u > c && (p = !0));
      for (let f = o - 1; f >= 0; f -= 1)
        s[f] &&
          !p &&
          ((u += s[f].swiperSlideSize), (l += 1), u > c && (p = !0));
    } else if (e === "current")
      for (let u = o + 1; u < s.length; u += 1)
        (n ? a[u] + d[u] - a[o] < c : a[u] - a[o] < c) && (l += 1);
    else for (let u = o - 1; u >= 0; u -= 1) a[o] - a[u] < c && (l += 1);
    return l;
  }
  update() {
    const e = this;
    if (!e || e.destroyed) return;
    const { snapGrid: n, params: i } = e;
    i.breakpoints && e.setBreakpoint(),
      e.updateSize(),
      e.updateSlides(),
      e.updateProgress(),
      e.updateSlidesClasses();
    function r() {
      const a = e.rtlTranslate ? e.translate * -1 : e.translate,
        d = Math.min(Math.max(a, e.maxTranslate()), e.minTranslate());
      e.setTranslate(d), e.updateActiveIndex(), e.updateSlidesClasses();
    }
    let s;
    e.params.freeMode && e.params.freeMode.enabled
      ? (r(), e.params.autoHeight && e.updateAutoHeight())
      : ((e.params.slidesPerView === "auto" || e.params.slidesPerView > 1) &&
        e.isEnd &&
        !e.params.centeredSlides
          ? (s = e.slideTo(e.slides.length - 1, 0, !1, !0))
          : (s = e.slideTo(e.activeIndex, 0, !1, !0)),
        s || r()),
      i.watchOverflow && n !== e.snapGrid && e.checkOverflow(),
      e.emit("update");
  }
  changeDirection(e, n) {
    n === void 0 && (n = !0);
    const i = this,
      r = i.params.direction;
    return (
      e || (e = r === "horizontal" ? "vertical" : "horizontal"),
      e === r ||
        (e !== "horizontal" && e !== "vertical") ||
        (i.$el
          .removeClass(`${i.params.containerModifierClass}${r}`)
          .addClass(`${i.params.containerModifierClass}${e}`),
        i.emitContainerClasses(),
        (i.params.direction = e),
        i.slides.each((s) => {
          e === "vertical" ? (s.style.width = "") : (s.style.height = "");
        }),
        i.emit("changeDirection"),
        n && i.update()),
      i
    );
  }
  changeLanguageDirection(e) {
    const n = this;
    (n.rtl && e === "rtl") ||
      (!n.rtl && e === "ltr") ||
      ((n.rtl = e === "rtl"),
      (n.rtlTranslate = n.params.direction === "horizontal" && n.rtl),
      n.rtl
        ? (n.$el.addClass(`${n.params.containerModifierClass}rtl`),
          (n.el.dir = "rtl"))
        : (n.$el.removeClass(`${n.params.containerModifierClass}rtl`),
          (n.el.dir = "ltr")),
      n.update());
  }
  mount(e) {
    const n = this;
    if (n.mounted) return !0;
    const i = T(e || n.params.el);
    if (((e = i[0]), !e)) return !1;
    e.swiper = n;
    const r = () =>
      `.${(n.params.wrapperClass || "").trim().split(" ").join(".")}`;
    let a = (() => {
      if (e && e.shadowRoot && e.shadowRoot.querySelector) {
        const d = T(e.shadowRoot.querySelector(r()));
        return (d.children = (c) => i.children(c)), d;
      }
      return i.children ? i.children(r()) : T(i).children(r());
    })();
    if (a.length === 0 && n.params.createElements) {
      const c = F().createElement("div");
      (a = T(c)),
        (c.className = n.params.wrapperClass),
        i.append(c),
        i.children(`.${n.params.slideClass}`).each((o) => {
          a.append(o);
        });
    }
    return (
      Object.assign(n, {
        $el: i,
        el: e,
        $wrapperEl: a,
        wrapperEl: a[0],
        mounted: !0,
        rtl: e.dir.toLowerCase() === "rtl" || i.css("direction") === "rtl",
        rtlTranslate:
          n.params.direction === "horizontal" &&
          (e.dir.toLowerCase() === "rtl" || i.css("direction") === "rtl"),
        wrongRTL: a.css("display") === "-webkit-box",
      }),
      !0
    );
  }
  init(e) {
    const n = this;
    return (
      n.initialized ||
        n.mount(e) === !1 ||
        (n.emit("beforeInit"),
        n.params.breakpoints && n.setBreakpoint(),
        n.addClasses(),
        n.params.loop && n.loopCreate(),
        n.updateSize(),
        n.updateSlides(),
        n.params.watchOverflow && n.checkOverflow(),
        n.params.grabCursor && n.enabled && n.setGrabCursor(),
        n.params.preloadImages && n.preloadImages(),
        n.params.loop
          ? n.slideTo(
              n.params.initialSlide + n.loopedSlides,
              0,
              n.params.runCallbacksOnInit,
              !1,
              !0
            )
          : n.slideTo(
              n.params.initialSlide,
              0,
              n.params.runCallbacksOnInit,
              !1,
              !0
            ),
        n.attachEvents(),
        (n.initialized = !0),
        n.emit("init"),
        n.emit("afterInit")),
      n
    );
  }
  destroy(e, n) {
    e === void 0 && (e = !0), n === void 0 && (n = !0);
    const i = this,
      { params: r, $el: s, $wrapperEl: a, slides: d } = i;
    return (
      typeof i.params == "undefined" ||
        i.destroyed ||
        (i.emit("beforeDestroy"),
        (i.initialized = !1),
        i.detachEvents(),
        r.loop && i.loopDestroy(),
        n &&
          (i.removeClasses(),
          s.removeAttr("style"),
          a.removeAttr("style"),
          d &&
            d.length &&
            d
              .removeClass(
                [
                  r.slideVisibleClass,
                  r.slideActiveClass,
                  r.slideNextClass,
                  r.slidePrevClass,
                ].join(" ")
              )
              .removeAttr("style")
              .removeAttr("data-swiper-slide-index")),
        i.emit("destroy"),
        Object.keys(i.eventsListeners).forEach((c) => {
          i.off(c);
        }),
        e !== !1 && ((i.$el[0].swiper = null), ki(i)),
        (i.destroyed = !0)),
      null
    );
  }
  static extendDefaults(e) {
    R(vt, e);
  }
  static get extendedDefaults() {
    return vt;
  }
  static get defaults() {
    return Ht;
  }
  static installModule(e) {
    A.prototype.__modules__ || (A.prototype.__modules__ = []);
    const n = A.prototype.__modules__;
    typeof e == "function" && n.indexOf(e) < 0 && n.push(e);
  }
  static use(e) {
    return Array.isArray(e)
      ? (e.forEach((n) => A.installModule(n)), A)
      : (A.installModule(e), A);
  }
}
Object.keys(gt).forEach((t) => {
  Object.keys(gt[t]).forEach((e) => {
    A.prototype[e] = gt[t][e];
  });
});
A.use([_i, Ai]);
function gn(t, e, n, i) {
  const r = F();
  return (
    t.params.createElements &&
      Object.keys(i).forEach((s) => {
        if (!n[s] && n.auto === !0) {
          let a = t.$el.children(`.${i[s]}`)[0];
          a ||
            ((a = r.createElement("div")),
            (a.className = i[s]),
            t.$el.append(a)),
            (n[s] = a),
            (e[s] = a);
        }
      }),
    n
  );
}
function te(t) {
  let { swiper: e, extendParams: n, on: i, emit: r } = t;
  n({
    navigation: {
      nextEl: null,
      prevEl: null,
      hideOnClick: !1,
      disabledClass: "swiper-button-disabled",
      hiddenClass: "swiper-button-hidden",
      lockClass: "swiper-button-lock",
      navigationDisabledClass: "swiper-navigation-disabled",
    },
  }),
    (e.navigation = {
      nextEl: null,
      $nextEl: null,
      prevEl: null,
      $prevEl: null,
    });
  function s(h) {
    let y;
    return (
      h &&
        ((y = T(h)),
        e.params.uniqueNavElements &&
          typeof h == "string" &&
          y.length > 1 &&
          e.$el.find(h).length === 1 &&
          (y = e.$el.find(h))),
      y
    );
  }
  function a(h, y) {
    const m = e.params.navigation;
    h &&
      h.length > 0 &&
      (h[y ? "addClass" : "removeClass"](m.disabledClass),
      h[0] && h[0].tagName === "BUTTON" && (h[0].disabled = y),
      e.params.watchOverflow &&
        e.enabled &&
        h[e.isLocked ? "addClass" : "removeClass"](m.lockClass));
  }
  function d() {
    if (e.params.loop) return;
    const { $nextEl: h, $prevEl: y } = e.navigation;
    a(y, e.isBeginning && !e.params.rewind), a(h, e.isEnd && !e.params.rewind);
  }
  function c(h) {
    h.preventDefault(),
      !(e.isBeginning && !e.params.loop && !e.params.rewind) &&
        (e.slidePrev(), r("navigationPrev"));
  }
  function o(h) {
    h.preventDefault(),
      !(e.isEnd && !e.params.loop && !e.params.rewind) &&
        (e.slideNext(), r("navigationNext"));
  }
  function l() {
    const h = e.params.navigation;
    if (
      ((e.params.navigation = gn(
        e,
        e.originalParams.navigation,
        e.params.navigation,
        { nextEl: "swiper-button-next", prevEl: "swiper-button-prev" }
      )),
      !(h.nextEl || h.prevEl))
    )
      return;
    const y = s(h.nextEl),
      m = s(h.prevEl);
    y && y.length > 0 && y.on("click", o),
      m && m.length > 0 && m.on("click", c),
      Object.assign(e.navigation, {
        $nextEl: y,
        nextEl: y && y[0],
        $prevEl: m,
        prevEl: m && m[0],
      }),
      e.enabled || (y && y.addClass(h.lockClass), m && m.addClass(h.lockClass));
  }
  function u() {
    const { $nextEl: h, $prevEl: y } = e.navigation;
    h &&
      h.length &&
      (h.off("click", o), h.removeClass(e.params.navigation.disabledClass)),
      y &&
        y.length &&
        (y.off("click", c), y.removeClass(e.params.navigation.disabledClass));
  }
  i("init", () => {
    e.params.navigation.enabled === !1 ? f() : (l(), d());
  }),
    i("toEdge fromEdge lock unlock", () => {
      d();
    }),
    i("destroy", () => {
      u();
    }),
    i("enable disable", () => {
      const { $nextEl: h, $prevEl: y } = e.navigation;
      h &&
        h[e.enabled ? "removeClass" : "addClass"](
          e.params.navigation.lockClass
        ),
        y &&
          y[e.enabled ? "removeClass" : "addClass"](
            e.params.navigation.lockClass
          );
    }),
    i("click", (h, y) => {
      const { $nextEl: m, $prevEl: g } = e.navigation,
        b = y.target;
      if (e.params.navigation.hideOnClick && !T(b).is(g) && !T(b).is(m)) {
        if (
          e.pagination &&
          e.params.pagination &&
          e.params.pagination.clickable &&
          (e.pagination.el === b || e.pagination.el.contains(b))
        )
          return;
        let w;
        m
          ? (w = m.hasClass(e.params.navigation.hiddenClass))
          : g && (w = g.hasClass(e.params.navigation.hiddenClass)),
          r(w === !0 ? "navigationShow" : "navigationHide"),
          m && m.toggleClass(e.params.navigation.hiddenClass),
          g && g.toggleClass(e.params.navigation.hiddenClass);
      }
    });
  const p = () => {
      e.$el.removeClass(e.params.navigation.navigationDisabledClass), l(), d();
    },
    f = () => {
      e.$el.addClass(e.params.navigation.navigationDisabledClass), u();
    };
  Object.assign(e.navigation, {
    enable: p,
    disable: f,
    update: d,
    init: l,
    destroy: u,
  });
}
function ve(t) {
  return (
    t === void 0 && (t = ""),
    `.${t
      .trim()
      .replace(/([\.:!\/])/g, "\\$1")
      .replace(/ /g, ".")}`
  );
}
function ne(t) {
  let { swiper: e, extendParams: n, on: i, emit: r } = t;
  const s = "swiper-pagination";
  n({
    pagination: {
      el: null,
      bulletElement: "span",
      clickable: !1,
      hideOnClick: !1,
      renderBullet: null,
      renderProgressbar: null,
      renderFraction: null,
      renderCustom: null,
      progressbarOpposite: !1,
      type: "bullets",
      dynamicBullets: !1,
      dynamicMainBullets: 1,
      formatFractionCurrent: (m) => m,
      formatFractionTotal: (m) => m,
      bulletClass: `${s}-bullet`,
      bulletActiveClass: `${s}-bullet-active`,
      modifierClass: `${s}-`,
      currentClass: `${s}-current`,
      totalClass: `${s}-total`,
      hiddenClass: `${s}-hidden`,
      progressbarFillClass: `${s}-progressbar-fill`,
      progressbarOppositeClass: `${s}-progressbar-opposite`,
      clickableClass: `${s}-clickable`,
      lockClass: `${s}-lock`,
      horizontalClass: `${s}-horizontal`,
      verticalClass: `${s}-vertical`,
      paginationDisabledClass: `${s}-disabled`,
    },
  }),
    (e.pagination = { el: null, $el: null, bullets: [] });
  let a,
    d = 0;
  function c() {
    return (
      !e.params.pagination.el ||
      !e.pagination.el ||
      !e.pagination.$el ||
      e.pagination.$el.length === 0
    );
  }
  function o(m, g) {
    const { bulletActiveClass: b } = e.params.pagination;
    m[g]().addClass(`${b}-${g}`)[g]().addClass(`${b}-${g}-${g}`);
  }
  function l() {
    const m = e.rtl,
      g = e.params.pagination;
    if (c()) return;
    const b =
        e.virtual && e.params.virtual.enabled
          ? e.virtual.slides.length
          : e.slides.length,
      w = e.pagination.$el;
    let C;
    const M = e.params.loop
      ? Math.ceil((b - e.loopedSlides * 2) / e.params.slidesPerGroup)
      : e.snapGrid.length;
    if (
      (e.params.loop
        ? ((C = Math.ceil(
            (e.activeIndex - e.loopedSlides) / e.params.slidesPerGroup
          )),
          C > b - 1 - e.loopedSlides * 2 && (C -= b - e.loopedSlides * 2),
          C > M - 1 && (C -= M),
          C < 0 && e.params.paginationType !== "bullets" && (C = M + C))
        : typeof e.snapIndex != "undefined"
        ? (C = e.snapIndex)
        : (C = e.activeIndex || 0),
      g.type === "bullets" &&
        e.pagination.bullets &&
        e.pagination.bullets.length > 0)
    ) {
      const D = e.pagination.bullets;
      let P, v, $;
      if (
        (g.dynamicBullets &&
          ((a = D.eq(0)[e.isHorizontal() ? "outerWidth" : "outerHeight"](!0)),
          w.css(
            e.isHorizontal() ? "width" : "height",
            `${a * (g.dynamicMainBullets + 4)}px`
          ),
          g.dynamicMainBullets > 1 &&
            e.previousIndex !== void 0 &&
            ((d += C - (e.previousIndex - e.loopedSlides || 0)),
            d > g.dynamicMainBullets - 1
              ? (d = g.dynamicMainBullets - 1)
              : d < 0 && (d = 0)),
          (P = Math.max(C - d, 0)),
          (v = P + (Math.min(D.length, g.dynamicMainBullets) - 1)),
          ($ = (v + P) / 2)),
        D.removeClass(
          ["", "-next", "-next-next", "-prev", "-prev-prev", "-main"]
            .map((E) => `${g.bulletActiveClass}${E}`)
            .join(" ")
        ),
        w.length > 1)
      )
        D.each((E) => {
          const x = T(E),
            S = x.index();
          S === C && x.addClass(g.bulletActiveClass),
            g.dynamicBullets &&
              (S >= P && S <= v && x.addClass(`${g.bulletActiveClass}-main`),
              S === P && o(x, "prev"),
              S === v && o(x, "next"));
        });
      else {
        const E = D.eq(C),
          x = E.index();
        if ((E.addClass(g.bulletActiveClass), g.dynamicBullets)) {
          const S = D.eq(P),
            k = D.eq(v);
          for (let O = P; O <= v; O += 1)
            D.eq(O).addClass(`${g.bulletActiveClass}-main`);
          if (e.params.loop)
            if (x >= D.length) {
              for (let O = g.dynamicMainBullets; O >= 0; O -= 1)
                D.eq(D.length - O).addClass(`${g.bulletActiveClass}-main`);
              D.eq(D.length - g.dynamicMainBullets - 1).addClass(
                `${g.bulletActiveClass}-prev`
              );
            } else o(S, "prev"), o(k, "next");
          else o(S, "prev"), o(k, "next");
        }
      }
      if (g.dynamicBullets) {
        const E = Math.min(D.length, g.dynamicMainBullets + 4),
          x = (a * E - a) / 2 - $ * a,
          S = m ? "right" : "left";
        D.css(e.isHorizontal() ? S : "top", `${x}px`);
      }
    }
    if (
      (g.type === "fraction" &&
        (w.find(ve(g.currentClass)).text(g.formatFractionCurrent(C + 1)),
        w.find(ve(g.totalClass)).text(g.formatFractionTotal(M))),
      g.type === "progressbar")
    ) {
      let D;
      g.progressbarOpposite
        ? (D = e.isHorizontal() ? "vertical" : "horizontal")
        : (D = e.isHorizontal() ? "horizontal" : "vertical");
      const P = (C + 1) / M;
      let v = 1,
        $ = 1;
      D === "horizontal" ? (v = P) : ($ = P),
        w
          .find(ve(g.progressbarFillClass))
          .transform(`translate3d(0,0,0) scaleX(${v}) scaleY(${$})`)
          .transition(e.params.speed);
    }
    g.type === "custom" && g.renderCustom
      ? (w.html(g.renderCustom(e, C + 1, M)), r("paginationRender", w[0]))
      : r("paginationUpdate", w[0]),
      e.params.watchOverflow &&
        e.enabled &&
        w[e.isLocked ? "addClass" : "removeClass"](g.lockClass);
  }
  function u() {
    const m = e.params.pagination;
    if (c()) return;
    const g =
        e.virtual && e.params.virtual.enabled
          ? e.virtual.slides.length
          : e.slides.length,
      b = e.pagination.$el;
    let w = "";
    if (m.type === "bullets") {
      let C = e.params.loop
        ? Math.ceil((g - e.loopedSlides * 2) / e.params.slidesPerGroup)
        : e.snapGrid.length;
      e.params.freeMode &&
        e.params.freeMode.enabled &&
        !e.params.loop &&
        C > g &&
        (C = g);
      for (let M = 0; M < C; M += 1)
        m.renderBullet
          ? (w += m.renderBullet.call(e, M, m.bulletClass))
          : (w += `<${m.bulletElement} class="${m.bulletClass}"></${m.bulletElement}>`);
      b.html(w), (e.pagination.bullets = b.find(ve(m.bulletClass)));
    }
    m.type === "fraction" &&
      (m.renderFraction
        ? (w = m.renderFraction.call(e, m.currentClass, m.totalClass))
        : (w = `<span class="${m.currentClass}"></span> / <span class="${m.totalClass}"></span>`),
      b.html(w)),
      m.type === "progressbar" &&
        (m.renderProgressbar
          ? (w = m.renderProgressbar.call(e, m.progressbarFillClass))
          : (w = `<span class="${m.progressbarFillClass}"></span>`),
        b.html(w)),
      m.type !== "custom" && r("paginationRender", e.pagination.$el[0]);
  }
  function p() {
    e.params.pagination = gn(
      e,
      e.originalParams.pagination,
      e.params.pagination,
      { el: "swiper-pagination" }
    );
    const m = e.params.pagination;
    if (!m.el) return;
    let g = T(m.el);
    g.length !== 0 &&
      (e.params.uniqueNavElements &&
        typeof m.el == "string" &&
        g.length > 1 &&
        ((g = e.$el.find(m.el)),
        g.length > 1 &&
          (g = g.filter((b) => T(b).parents(".swiper")[0] === e.el))),
      m.type === "bullets" && m.clickable && g.addClass(m.clickableClass),
      g.addClass(m.modifierClass + m.type),
      g.addClass(e.isHorizontal() ? m.horizontalClass : m.verticalClass),
      m.type === "bullets" &&
        m.dynamicBullets &&
        (g.addClass(`${m.modifierClass}${m.type}-dynamic`),
        (d = 0),
        m.dynamicMainBullets < 1 && (m.dynamicMainBullets = 1)),
      m.type === "progressbar" &&
        m.progressbarOpposite &&
        g.addClass(m.progressbarOppositeClass),
      m.clickable &&
        g.on("click", ve(m.bulletClass), function (w) {
          w.preventDefault();
          let C = T(this).index() * e.params.slidesPerGroup;
          e.params.loop && (C += e.loopedSlides), e.slideTo(C);
        }),
      Object.assign(e.pagination, { $el: g, el: g[0] }),
      e.enabled || g.addClass(m.lockClass));
  }
  function f() {
    const m = e.params.pagination;
    if (c()) return;
    const g = e.pagination.$el;
    g.removeClass(m.hiddenClass),
      g.removeClass(m.modifierClass + m.type),
      g.removeClass(e.isHorizontal() ? m.horizontalClass : m.verticalClass),
      e.pagination.bullets &&
        e.pagination.bullets.removeClass &&
        e.pagination.bullets.removeClass(m.bulletActiveClass),
      m.clickable && g.off("click", ve(m.bulletClass));
  }
  i("init", () => {
    e.params.pagination.enabled === !1 ? y() : (p(), u(), l());
  }),
    i("activeIndexChange", () => {
      (e.params.loop || typeof e.snapIndex == "undefined") && l();
    }),
    i("snapIndexChange", () => {
      e.params.loop || l();
    }),
    i("slidesLengthChange", () => {
      e.params.loop && (u(), l());
    }),
    i("snapGridLengthChange", () => {
      e.params.loop || (u(), l());
    }),
    i("destroy", () => {
      f();
    }),
    i("enable disable", () => {
      const { $el: m } = e.pagination;
      m &&
        m[e.enabled ? "removeClass" : "addClass"](
          e.params.pagination.lockClass
        );
    }),
    i("lock unlock", () => {
      l();
    }),
    i("click", (m, g) => {
      const b = g.target,
        { $el: w } = e.pagination;
      if (
        e.params.pagination.el &&
        e.params.pagination.hideOnClick &&
        w &&
        w.length > 0 &&
        !T(b).hasClass(e.params.pagination.bulletClass)
      ) {
        if (
          e.navigation &&
          ((e.navigation.nextEl && b === e.navigation.nextEl) ||
            (e.navigation.prevEl && b === e.navigation.prevEl))
        )
          return;
        const C = w.hasClass(e.params.pagination.hiddenClass);
        r(C === !0 ? "paginationShow" : "paginationHide"),
          w.toggleClass(e.params.pagination.hiddenClass);
      }
    });
  const h = () => {
      e.$el.removeClass(e.params.pagination.paginationDisabledClass),
        e.pagination.$el &&
          e.pagination.$el.removeClass(
            e.params.pagination.paginationDisabledClass
          ),
        p(),
        u(),
        l();
    },
    y = () => {
      e.$el.addClass(e.params.pagination.paginationDisabledClass),
        e.pagination.$el &&
          e.pagination.$el.addClass(
            e.params.pagination.paginationDisabledClass
          ),
        f();
    };
  Object.assign(e.pagination, {
    enable: h,
    disable: y,
    render: u,
    update: l,
    init: p,
    destroy: f,
  });
}
function ut(t) {
  let { swiper: e, extendParams: n, on: i, emit: r } = t,
    s;
  (e.autoplay = { running: !1, paused: !1 }),
    n({
      autoplay: {
        enabled: !1,
        delay: 3e3,
        waitForTransition: !0,
        disableOnInteraction: !0,
        stopOnLastSlide: !1,
        reverseDirection: !1,
        pauseOnMouseEnter: !1,
      },
    });
  function a() {
    if (!e.size) {
      (e.autoplay.running = !1), (e.autoplay.paused = !1);
      return;
    }
    const m = e.slides.eq(e.activeIndex);
    let g = e.params.autoplay.delay;
    m.attr("data-swiper-autoplay") &&
      (g = m.attr("data-swiper-autoplay") || e.params.autoplay.delay),
      clearTimeout(s),
      (s = ct(() => {
        let b;
        e.params.autoplay.reverseDirection
          ? e.params.loop
            ? (e.loopFix(),
              (b = e.slidePrev(e.params.speed, !0, !0)),
              r("autoplay"))
            : e.isBeginning
            ? e.params.autoplay.stopOnLastSlide
              ? c()
              : ((b = e.slideTo(e.slides.length - 1, e.params.speed, !0, !0)),
                r("autoplay"))
            : ((b = e.slidePrev(e.params.speed, !0, !0)), r("autoplay"))
          : e.params.loop
          ? (e.loopFix(),
            (b = e.slideNext(e.params.speed, !0, !0)),
            r("autoplay"))
          : e.isEnd
          ? e.params.autoplay.stopOnLastSlide
            ? c()
            : ((b = e.slideTo(0, e.params.speed, !0, !0)), r("autoplay"))
          : ((b = e.slideNext(e.params.speed, !0, !0)), r("autoplay")),
          ((e.params.cssMode && e.autoplay.running) || b === !1) && a();
      }, g));
  }
  function d() {
    return typeof s != "undefined" || e.autoplay.running
      ? !1
      : ((e.autoplay.running = !0), r("autoplayStart"), a(), !0);
  }
  function c() {
    return !e.autoplay.running || typeof s == "undefined"
      ? !1
      : (s && (clearTimeout(s), (s = void 0)),
        (e.autoplay.running = !1),
        r("autoplayStop"),
        !0);
  }
  function o(m) {
    !e.autoplay.running ||
      e.autoplay.paused ||
      (s && clearTimeout(s),
      (e.autoplay.paused = !0),
      m === 0 || !e.params.autoplay.waitForTransition
        ? ((e.autoplay.paused = !1), a())
        : ["transitionend", "webkitTransitionEnd"].forEach((g) => {
            e.$wrapperEl[0].addEventListener(g, u);
          }));
  }
  function l() {
    const m = F();
    m.visibilityState === "hidden" && e.autoplay.running && o(),
      m.visibilityState === "visible" &&
        e.autoplay.paused &&
        (a(), (e.autoplay.paused = !1));
  }
  function u(m) {
    !e ||
      e.destroyed ||
      !e.$wrapperEl ||
      (m.target === e.$wrapperEl[0] &&
        (["transitionend", "webkitTransitionEnd"].forEach((g) => {
          e.$wrapperEl[0].removeEventListener(g, u);
        }),
        (e.autoplay.paused = !1),
        e.autoplay.running ? a() : c()));
  }
  function p() {
    e.params.autoplay.disableOnInteraction ? c() : (r("autoplayPause"), o()),
      ["transitionend", "webkitTransitionEnd"].forEach((m) => {
        e.$wrapperEl[0].removeEventListener(m, u);
      });
  }
  function f() {
    e.params.autoplay.disableOnInteraction ||
      ((e.autoplay.paused = !1), r("autoplayResume"), a());
  }
  function h() {
    e.params.autoplay.pauseOnMouseEnter &&
      (e.$el.on("mouseenter", p), e.$el.on("mouseleave", f));
  }
  function y() {
    e.$el.off("mouseenter", p), e.$el.off("mouseleave", f);
  }
  i("init", () => {
    e.params.autoplay.enabled &&
      (d(), F().addEventListener("visibilitychange", l), h());
  }),
    i("beforeTransitionStart", (m, g, b) => {
      e.autoplay.running &&
        (b || !e.params.autoplay.disableOnInteraction
          ? e.autoplay.pause(g)
          : c());
    }),
    i("sliderFirstMove", () => {
      e.autoplay.running &&
        (e.params.autoplay.disableOnInteraction ? c() : o());
    }),
    i("touchEnd", () => {
      e.params.cssMode &&
        e.autoplay.paused &&
        !e.params.autoplay.disableOnInteraction &&
        a();
    }),
    i("destroy", () => {
      y(),
        e.autoplay.running && c(),
        F().removeEventListener("visibilitychange", l);
    }),
    Object.assign(e.autoplay, { pause: o, run: a, start: d, stop: c });
}
new A(".about-slider", {
  modules: [te, ne, ut],
  speed: 700,
  observer: !0,
  observeParents: !0,
  observeSlideChildren: !0,
  pagination: { el: ".swiper-pagination", type: "fraction" },
  navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
});
new A(".about-slider__photo", {
  modules: [te, ne],
  speed: 700,
  observer: !0,
  observeParents: !0,
  observeSlideChildren: !0,
  autoHeight: !0,
  pagination: {
    el: ".swiper-pagination__photo",
    clickable: !0,
    dynamicBullets: !0,
  },
  navigation: { nextEl: ".swiper-photo__next", prevEl: ".swiper-photo__prev" },
});
new A(".services-rates__slider", {
  modules: [te, ne],
  speed: 700,
  slidesPerView: 1,
  spaceBetween: 15,
  observer: !0,
  observeParents: !0,
  observeSlideChildren: !0,
  autoHeight: !0,
  roundLengths: !0,
  breakpoints: {
    768: { autoplay: !1, autoHeight: !1, slidesPerView: 2, spaceBetween: 20 },
    992: { autoplay: !1, autoHeight: !1, slidesPerView: 2, spaceBetween: 20 },
    1200: { autoplay: !1, autoHeight: !1, slidesPerView: 3, spaceBetween: 30 },
  },
  navigation: {
    nextEl: ".swiper-services__next",
    prevEl: ".swiper-services__prev",
  },
  pagination: {
    el: ".swiper-pagination__services",
    clickable: !0,
    dynamicBullets: !0,
  },
});
new A(".reviews__slider", {
  modules: [te, ne],
  speed: 700,
  slidesPerView: 1,
  spaceBetween: 10,
  observer: !0,
  observeParents: !0,
  observeSlideChildren: !0,
  autoHeight: !0,
  roundLengths: !0,
  navigation: {
    nextEl: ".swiper-reviews__next",
    prevEl: ".swiper-reviews__prev",
  },
  pagination: {
    el: ".swiper-pagination__reviews",
    clickable: !0,
    dynamicBullets: !0,
  },
  breakpoints: {
    768: { autoplay: !1, autoHeight: !1, slidesPerView: 1, spaceBetween: 20 },
    992: { autoplay: !1, autoHeight: !1, slidesPerView: 2, spaceBetween: 40 },
    1200: { autoplay: !1, autoHeight: !1, slidesPerView: 2, spaceBetween: 60 },
  },
});
new A(".support__slider", {
  modules: [te, ne, ut],
  autoplay: { delay: 1e3 },
  speed: 700,
  slidesPerView: 1,
  spaceBetween: 0,
  loop: !0,
  freeMode: !0,
  observer: !0,
  observeParents: !0,
  observeSlideChildren: !0,
  roundLengths: !0,
  navigation: {
    nextEl: ".swiper-support__next",
    prevEl: ".swiper-support__prev",
  },
  pagination: {
    el: ".swiper-pagination__support",
    clickable: !0,
    dynamicBullets: !0,
  },
  breakpoints: {
    576: { slidesPerView: 2, spaceBetween: 20 },
    768: { slidesPerView: 2, spaceBetween: 20 },
    992: { slidesPerView: 3, spaceBetween: 40 },
    1200: { slidesPerView: 4, spaceBetween: 50 },
  },
});
new A(".events__slider", {
  modules: [te, ne, ut],
  autoplay: { delay: 1e3 },
  speed: 700,
  loop: !0,
  freeMode: !0,
  slidesPerView: 1,
  spaceBetween: 10,
  observer: !0,
  observeParents: !0,
  observeSlideChildren: !0,
  roundLengths: !0,
  navigation: {
    nextEl: ".swiper-events__next",
    prevEl: ".swiper-events__prev",
  },
  pagination: {
    el: ".swiper-pagination__events",
    clickable: !0,
    dynamicBullets: !0,
  },
  breakpoints: {
    576: { slidesPerView: 1, spaceBetween: 20 },
    768: { slidesPerView: 2, spaceBetween: 30 },
    992: { slidesPerView: 2, spaceBetween: 40 },
    1200: { slidesPerView: 3, spaceBetween: 50 },
    1440: { slidesPerView: 3, spaceBetween: 60 },
  },
});
new A(".evidence__slider", {
  modules: [te, ne, ut],
  autoplay: { delay: 1e3 },
  speed: 700,
  loop: !0,
  freeMode: !0,
  slidesPerView: 1,
  spaceBetween: 10,
  observer: !0,
  observeParents: !0,
  observeSlideChildren: !0,
  roundLengths: !0,
  navigation: {
    nextEl: ".swiper-evidence__next",
    prevEl: ".swiper-evidence__prev",
  },
  pagination: {
    el: ".swiper-pagination__evidence",
    clickable: !0,
    dynamicBullets: !0,
  },
  breakpoints: {
    576: { slidesPerView: 1, spaceBetween: 20 },
    768: { slidesPerView: 2, spaceBetween: 30 },
    992: { autoHeight: !1, slidesPerView: 2, spaceBetween: 40 },
    1200: { slidesPerView: 3, spaceBetween: 50 },
    1440: { slidesPerView: 3, spaceBetween: 60 },
  },
});
new A(".maps__slider", {
  modules: [te, ne],
  speed: 700,
  slidesPerView: 1,
  spaceBetween: 15,
  observer: !0,
  observeParents: !0,
  observeSlideChildren: !0,
  autoHeight: !0,
  roundLengths: !0,
  navigation: { nextEl: ".swiper-maps__next", prevEl: ".swiper-maps__prev" },
  pagination: {
    el: ".swiper-pagination__maps",
    clickable: !0,
    dynamicBullets: !0,
  },
  breakpoints: {
    576: { slidesPerView: 1, spaceBetween: 20 },
    768: { autoHeight: !1, slidesPerView: 1, spaceBetween: 20 },
    992: { autoHeight: !1, slidesPerView: 2, spaceBetween: 30 },
    1200: { autoHeight: !1, slidesPerView: 2, spaceBetween: 40 },
    1440: { autoHeight: !1, slidesPerView: 2, spaceBetween: 80 },
  },
});
$e();
function $e() {
  for (let t of document.querySelectorAll(
    'input[type="range"].slider-progress'
  ))
    t.style.setProperty("--value", t.value),
      t.style.setProperty("--min", t.min == "" ? "0" : t.min),
      t.style.setProperty("--max", t.max == "" ? "100" : t.max),
      t.addEventListener("input", () =>
        t.style.setProperty("--value", t.value)
      );
}
function Ft() {
  const t = document.querySelector("#number-debtors-input"),
    e = document.querySelector(".number-debtors-input--hidden"),
    n = document.querySelector("#lawyer-salary-input"),
    i = document.querySelector(".lawyer-salary-input--hidden"),
    r = document.querySelector("#average-shipping-cost-input"),
    s = document.querySelector(".average-shipping-cost-input--hidden"),
    a = document.querySelector("#number-debtors-range"),
    d = document.querySelector("#lawyer-salary-range"),
    c = document.querySelector("#average-shipping-cost-range"),
    o = document.querySelector(".savings-calculator__output"),
    l = document.querySelector(".savings-calculator__output--hidden"),
    u = document.querySelectorAll(".lawyer-per__year"),
    p = document.querySelectorAll(".lawyer-per__year--hidden"),
    f = document.querySelector(".annual-rate"),
    h = document.querySelector(".annual-rate--hidden"),
    y = document.querySelector(".lawyer-debtors"),
    m = document.querySelector(".urrobot-debtors"),
    g = document.querySelectorAll(".labor-costs"),
    b = document.querySelectorAll(".specialist-month"),
    w = document.querySelector(".salary-mounth"),
    C = document.querySelectorAll(".printing-costs"),
    M = document.querySelectorAll(".print-price"),
    D = document.querySelectorAll(".doc-qantity"),
    P = document.querySelectorAll(".number-documents-month"),
    v = document.querySelectorAll(".pac-year"),
    $ = document.querySelectorAll(".doc-year"),
    E = document.querySelector(".reams-price"),
    x = document.querySelector(".paper-price"),
    S = document.querySelector(".paper-quantity"),
    k = document.querySelector(".paper-reams"),
    O = document.querySelectorAll(".delivery-cost"),
    I = document.querySelectorAll(".delivery");
  let L = parseInt(t.value),
    q = parseInt(n.value),
    _ = parseInt(r.value),
    N,
    B,
    V,
    ie,
    be,
    pe,
    G,
    Se,
    Ee,
    Y,
    Ce,
    se,
    me,
    re,
    U;
  switch (
    (a.addEventListener("input", function () {
      return (t.value = this.value);
    }),
    t.addEventListener("input", function () {
      $e();
      let z = (a.value = this.value);
      return (
        (this.value = Math.min(
          this.getAttribute("max"),
          Math.max(0, this.value)
        )),
        z
      );
    }),
    (e.value = t.value),
    d.addEventListener("input", function () {
      return (n.value = this.value);
    }),
    n.addEventListener("input", function () {
      $e();
      let z = (d.value = this.value);
      return (
        (this.value = Math.min(
          this.getAttribute("max"),
          Math.max(0, this.value)
        )),
        z
      );
    }),
    (i.value = n.value),
    c.addEventListener("input", function () {
      let z = (r.value = this.value);
      return (
        (this.value = Math.min(
          this.getAttribute("max"),
          Math.max(0, this.value)
        )),
        z
      );
    }),
    r.addEventListener("input", function () {
      $e();
      let z = (c.value = this.value);
      return (
        (this.value = Math.min(
          this.getAttribute("max"),
          Math.max(0, this.value)
        )),
        z
      );
    }),
    (s.value = r.value),
    (B = 1.432),
    (V = q * B),
    (V = Math.ceil(V)),
    (N = V * 12),
    (ie = 4),
    (be = 40),
    (pe = L * 12),
    (G = pe * be),
    (Se = G * ie),
    (Ee = 450),
    (Y = 500),
    (se = G / Y),
    (se = Math.ceil(se)),
    (Ce = Ee * se),
    (me = pe * _),
    L)
  ) {
    case 1 <= L && L <= 100 ? L : !0:
      U = 65;
      break;
    case 101 <= L && L <= 500 ? L : !0:
      U = 60;
      break;
    case 501 <= L && L <= 1e3 ? L : !0:
      U = 55;
      break;
    case 1001 <= L && L <= 5e3 ? L : !0:
      U = 50;
      break;
    case 5001 <= L && L <= 1e4 ? L : !0:
      U = 45;
      break;
    default:
      U = 40;
      break;
  }
  re = U * L * 12;
  let Te = N + Se + Ce + me,
    he = Te - re;
  (o.textContent = he.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })),
    (l.value = he.toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })),
    u.forEach((z) => {
      z.textContent = Te.toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }),
    p.forEach((z) => {
      z.value = Te.toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }),
    (f.textContent = re.toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })),
    (h.value = re.toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })),
    (y.textContent = L.toLocaleString("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })),
    (m.textContent = L.toLocaleString("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })),
    g.forEach((z) => {
      z.textContent = N.toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }),
    (w.textContent = V.toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })),
    b.forEach((z) => {
      z.textContent = q.toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }),
    C.forEach((z) => {
      z.textContent = Se.toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }),
    M.forEach((z) => {
      z.textContent = ie.toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }),
    D.forEach((z) => {
      z.textContent = be.toLocaleString("ru-RU", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }),
    P.forEach((z) => {
      z.textContent = L.toLocaleString("ru-RU", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }),
    v.forEach((z) => {
      z.textContent = pe.toLocaleString("ru-RU", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }),
    $.forEach((z) => {
      z.textContent = G.toLocaleString("ru-RU", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }),
    (E.textContent = Ce.toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })),
    (x.textContent = Ee.toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })),
    (S.textContent = Y.toLocaleString("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })),
    (k.textContent = se.toLocaleString("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })),
    I.forEach((z) => {
      z.textContent = me.toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }),
    O.forEach((z) => {
      z.textContent = _.toLocaleString("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    });
}
const Bt = document.querySelector(".calc-form");
Bt != null && (Ft(), (Bt.oninput = Ft));
const Nt = document.querySelector("#court-proceedings"),
  Rt = document.querySelector("#pre-trial-proceedings"),
  yt = document.querySelector("#enforcement-proceedings"),
  Vs = document.querySelector(".enforcement-proceedings--hidden"),
  wt = document.querySelector("#extracts-from-rosreestr-EGRN"),
  js = document.querySelector(".extracts-from-rosreestr-EGRN--hidden"),
  bt = document.querySelector("#search-analysis-debtor-data"),
  Gs = document.querySelector(".search-analysis-debtor-data--hidden"),
  St = document.querySelector("#analytics-reporting"),
  Ws = document.querySelector(".analytics-reporting--hidden"),
  Vt = document.querySelector(".additional-functions"),
  jt = document.querySelector(".additional-functions__items"),
  Gt = document.querySelector(".court-proceedings__items"),
  Wt = document.querySelector(".pre-trial-proceedings__items"),
  Ne = document.querySelector("#sending-NBKI"),
  Us = document.querySelector(".sending-NBKI--hidden"),
  Re = document.querySelector("#simple-letter"),
  Ys = document.querySelector(".simple-letter--hidden"),
  Ve = document.querySelector("#registered-letter"),
  Xs = document.querySelector(".registered-letter--hidden"),
  je = document.querySelector("#working-individual"),
  Ks = document.querySelector(".working-individual--hidden"),
  Ge = document.querySelector("#working-entity"),
  Qs = document.querySelector(".working-entity--hidden"),
  We = document.querySelector("#robot-calling"),
  Zs = document.querySelector(".robot-calling--hidden"),
  Ue = document.querySelector("#robot-sms"),
  Js = document.querySelector(".robot-sms--hidden"),
  Ye = document.querySelector("#robot-VW"),
  er = document.querySelector(".robot-VW--hidden"),
  Xe = document.querySelector("#robot-VkOk"),
  tr = document.querySelector(".robot-VkOk--hidden"),
  Ke = document.querySelector("#robot-letter"),
  nr = document.querySelector(".robot-letter--hidden"),
  Qe = document.querySelector("#stan-add"),
  ir = document.querySelector(".stan-add--hidden"),
  Ze = document.querySelector("#judge-world"),
  sr = document.querySelector(".judge-world--hidden"),
  Je = document.querySelector("#judge-district"),
  rr = document.querySelector(".judge-district--hidden"),
  et = document.querySelector("#juris-FSSP"),
  ar = document.querySelector(".juris-FSSP--hidden"),
  tt = document.querySelector("#credit-historyFSSP"),
  or = document.querySelector(".credit-historyFSSP--hidden"),
  nt = document.querySelector("#debt-FSSP"),
  lr = document.querySelector(".debt-FSSP--hidden"),
  it = document.querySelector("#reco-doc"),
  cr = document.querySelector(".reco-doc--hidden");
let X,
  K,
  oe,
  ye,
  st,
  ke,
  W,
  Q,
  Pe,
  le,
  ce,
  de,
  Me,
  Oe,
  De,
  ze,
  Z,
  J,
  rt,
  at,
  ot,
  Et,
  Ut,
  Ct,
  Tt;
function Yt() {
  const t = document.querySelector(".amount-debtor"),
    e = document.querySelector(".amount-debtor--hidden"),
    n = document.querySelector(".amount-all-debtors"),
    i = document.querySelector(".amount-all-debtors--hidden");
  let r = document.querySelector("#services-number-debtors-input"),
    s = document.querySelector(".services-number-debtors-input--hidden"),
    a = document.querySelector("#services-number-debtors-range");
  const d = document.querySelector(".full-construction"),
    c = document.querySelector(".full-construction--hidden");
  a.addEventListener("input", function () {
    let _ = (r.value = this.value);
    return (
      (this.value = Math.min(
        this.getAttribute("max"),
        Math.max(0, this.value)
      )),
      _
    );
  }),
    r.addEventListener("input", function () {
      let _ = (a.value = this.value);
      return (
        (this.value = Math.min(
          this.getAttribute("max"),
          Math.max(0, this.value)
        )),
        $e(),
        _
      );
    });
  let o = parseInt(r.value);
  (s.value = o),
    d.checked ? (d.value = "\u0414\u0430") : (d.value = "\u041D\u0435\u0442"),
    (c.value = d.value);
  function l() {
    Nt.checked
      ? Gt.classList.add("court-proceedings--active")
      : (Gt.classList.remove("court-proceedings--active"),
        (je.checked = !1),
        (Ge.checked = !1));
  }
  l(), Nt.addEventListener("click", l);
  function u() {
    if (je.checked)
      switch (((Ks.value = je.value), o)) {
        case 1 <= o && o <= 100 ? o : !0:
          W = 65;
          break;
        case 101 <= o && o <= 500 ? o : !0:
          W = 60;
          break;
        case 501 <= o && o <= 1e3 ? o : !0:
          W = 55;
          break;
        case 1001 <= o && o <= 5e3 ? o : !0:
          W = 50;
          break;
        case 5001 <= o && o <= 1e4 ? o : !0:
          W = 45;
          break;
        default:
          W = 40;
          break;
      }
    else W = 0;
    return W;
  }
  u(), je.addEventListener("click", u);
  function p() {
    return Ge.checked ? ((Qs.value = Ge.value), (ke = 150)) : (ke = 0), ke;
  }
  p(), Ge.addEventListener("click", p);
  function f() {
    Rt.checked
      ? Wt.classList.add("pre-trial-proceedings--active")
      : (Wt.classList.remove("pre-trial-proceedings--active"),
        (We.checked = !1),
        (Ue.checked = !1),
        (Ye.checked = !1),
        (Xe.checked = !1),
        (Ke.checked = !1));
  }
  f(), Rt.addEventListener("click", f);
  function h() {
    if (We.checked)
      switch (((Zs.value = We.value), o)) {
        case 1 <= o && o <= 5e4 ? o : !0:
          X = 4;
          break;
        case 50001 <= o && o <= 1e5 ? o : !0:
          X = 3.5;
          break;
        case 100001 <= o && o <= 3e5 ? o : !0:
          X = 3;
          break;
        default:
          X = 2.5;
          break;
      }
    else X = 0;
    return X;
  }
  h(), We.addEventListener("click", h);
  function y() {
    if (Ue.checked)
      switch (((Js.value = Ue.value), o)) {
        case 1 <= o && o <= 5e4 ? o : !0:
          K = 3.6;
          break;
        case 50001 <= o && o <= 1e5 ? o : !0:
          K = 3.5;
          break;
        case 100001 <= o && o <= 3e5 ? o : !0:
          K = 3.4;
          break;
        default:
          K = 3.3;
          break;
      }
    else K = 0;
    return K;
  }
  y(), Ue.addEventListener("click", y);
  function m() {
    if (Ye.checked)
      switch (((er.value = Ye.value), o)) {
        case 1 <= o && o <= 5e4 ? o : !0:
          ye = 1;
          break;
        default:
          ye = 0.95;
          break;
      }
    else ye = 0;
    return ye;
  }
  m(), Ye.addEventListener("click", m);
  function g() {
    if (Xe.checked)
      switch (((tr.value = Xe.value), o)) {
        case 1 <= o && o <= 1e4 ? o : !0:
          oe = 0.8;
          break;
        default:
          oe = 0.7;
          break;
      }
    else oe = 0;
    return oe;
  }
  g(), Xe.addEventListener("click", g);
  function b() {
    return Ke.checked ? ((nr.value = Ke.value), (st = 2)) : (st = 0), oe;
  }
  b(), Ke.addEventListener("click", b);
  function w() {
    if (yt.checked)
      switch (((Vs.value = yt.value), o)) {
        case 1 <= o && o <= 100 ? o : !0:
          Q = 45;
          break;
        case 101 <= o && o <= 500 ? o : !0:
          Q = 35;
          break;
        case 501 <= o && o <= 1e3 ? o : !0:
          Q = 25;
          break;
        default:
          Q = 15;
          break;
      }
    else Q = 0;
    return Q;
  }
  w(), yt.addEventListener("click", w);
  function C() {
    if (wt.checked)
      switch (((js.value = wt.value), o)) {
        case 1 <= o && o <= 100 ? o : !0:
          J = 10;
          break;
        case 101 <= o && o <= 3e3 ? o : !0:
          J = 9;
          break;
        case 3001 <= o && o <= 1e4 ? o : !0:
          J = 8;
          break;
        default:
          J = 6;
          break;
      }
    else J = 0;
    return J;
  }
  C(), wt.addEventListener("click", C);
  function M() {
    return bt.checked ? ((Gs.value = bt.value), (ze = 6)) : (ze = 0), ze;
  }
  M(), bt.addEventListener("click", M);
  function D() {
    if (St.checked)
      switch (((Ws.value = St.value), o)) {
        case 1 <= o && o <= 100 ? o : !0:
          Z = 1e3;
          break;
        case 101 <= o && o <= 500 ? o : !0:
          Z = 2500;
          break;
        case 501 <= o && o <= 1e3 ? o : !0:
          Z = 5e3;
          break;
        case 1001 <= o && o <= 5e3 ? o : !0:
          Z = 1e4;
          break;
        default:
          Z = 15e3;
          break;
      }
    else Z = 0;
    return Z;
  }
  D(), St.addEventListener("click", D);
  function P() {
    Vt.checked
      ? jt.classList.add("additional-functions--active")
      : (jt.classList.remove("additional-functions--active"),
        (Ne.checked = !1),
        (Re.checked = !1),
        (Ve.checked = !1),
        (Qe.checked = !1),
        (Ze.checked = !1),
        (Je.checked = !1),
        (et.checked = !1),
        (tt.checked = !1),
        (nt.checked = !1),
        (it.checked = !1));
  }
  P(), Vt.addEventListener("click", P);
  function v() {
    return Ne.checked ? ((Us.value = Ne.value), (rt = 5)) : (rt = 0), rt;
  }
  v(), Ne.addEventListener("click", v);
  function $() {
    return Re.checked ? ((Ys.value = Re.value), (at = 43)) : (at = 0), at;
  }
  $(), Re.addEventListener("click", $);
  function E() {
    return Ve.checked ? ((Xs.value = Ve.value), (ot = 83)) : (ot = 0), ot;
  }
  E(), Ve.addEventListener("click", E);
  function x() {
    return Qe.checked ? ((ir.value = Qe.value), (Pe = 0.2)) : (Pe = 0), Pe;
  }
  x(), Qe.addEventListener("click", x);
  function S() {
    if (Ze.checked)
      switch (((sr.value = Ze.value), o)) {
        case 1 <= o && o <= 1e4 ? o : !0:
          le = 4;
          break;
        case 10001 <= o && o <= 5e4 ? o : !0:
          le = 3;
          break;
        default:
          le = 2;
          break;
      }
    else le = 0;
    return le;
  }
  S(), Ze.addEventListener("click", S);
  function k() {
    if (Je.checked)
      switch (((rr.value = Je.value), o)) {
        case 1 <= o && o <= 1e4 ? o : !0:
          ce = 3;
          break;
        case 10001 <= o && o <= 5e4 ? o : !0:
          ce = 2;
          break;
        default:
          ce = 1.5;
          break;
      }
    else ce = 0;
    return ce;
  }
  k(), Je.addEventListener("click", k);
  function O() {
    if (et.checked)
      switch (((ar.value = et.value), o)) {
        case 1 <= o && o <= 1e4 ? o : !0:
          de = 2;
          break;
        case 10001 <= o && o <= 5e4 ? o : !0:
          de = 1.8;
          break;
        default:
          de = 1;
          break;
      }
    else de = 0;
    return de;
  }
  O(), et.addEventListener("click", O);
  function I() {
    return tt.checked ? ((or.value = tt.value), (Me = 0.5)) : (Me = 0), Me;
  }
  I(), tt.addEventListener("click", I);
  function L() {
    return nt.checked ? ((lr.value = nt.value), (Oe = 0.5)) : (Oe = 0), Oe;
  }
  L(), nt.addEventListener("click", L);
  function q() {
    return it.checked ? ((cr.value = it.value), (De = 4)) : (De = 0), De;
  }
  q(),
    it.addEventListener("click", q),
    (Et = ot + at + rt),
    (Ct =
      Et +
      X +
      K +
      ye +
      oe +
      st +
      Pe +
      le +
      ce +
      de +
      Me +
      Oe +
      De +
      ke +
      W +
      ze +
      J +
      Q),
    (Ut =
      Et +
      X +
      K +
      ye +
      oe +
      st +
      Pe +
      le +
      ce +
      de +
      Me +
      Oe +
      De +
      ke +
      W +
      ze +
      J +
      Q),
    (Tt = Ut * o + Z),
    (t.textContent = Ct.toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })),
    (e.value = Ct.toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })),
    (n.textContent = Tt.toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })),
    (i.value = Tt.toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }));
}
const Xt = document.querySelector(".service-calculator");
Xt != null && (Yt(), (Xt.oninput = Yt));
function dr() {
  const t = document.documentElement,
    e = getComputedStyle(t).getPropertyValue("--marquee-elements-displayed"),
    n = document.querySelector("ul.marquee-content");
  t.style.setProperty("--marquee-elements", n.children.length);
  for (let i = 0; i < e; i++) n.appendChild(n.children[i].cloneNode(!0));
}
const ur = document.querySelector(".cooperate");
ur != null && dr();
window.addEventListener("DOMContentLoaded", function () {
  var t = document.querySelectorAll('input[type="tel"]');
  Array.prototype.forEach.call(t, function (e) {
    new fe({ selector: e, layout: e.dataset.mask });
  });
});
function fe(t) {
  if (((this.el = this.getElement(t.selector)), !this.el))
    return console.log(
      "\u0427\u0442\u043E-\u0442\u043E \u043D\u0435 \u0442\u0430\u043A \u0441 \u0441\u0435\u043B\u0435\u043A\u0442\u043E\u0440\u043E\u043C"
    );
  (this.layout = t.layout || "+_ (___) ___-__-__"),
    (this.maskreg = this.getRegexp()),
    this.setListeners();
}
fe.prototype.getRegexp = function () {
  var t = this.layout.replace(/_/g, "\\d");
  return (
    (t = t.replace(/\(/g, "\\(")),
    (t = t.replace(/\)/g, "\\)")),
    (t = t.replace(/\+/g, "\\+")),
    (t = t.replace(/\s/g, "\\s")),
    t
  );
};
fe.prototype.mask = function (t) {
  var e = t.target,
    n = this.layout,
    i = 0,
    r = n.replace(/\D/g, ""),
    s = e.value.replace(/\D/g, "");
  if (
    (r.length >= s.length && (s = r),
    (e.value = n.replace(/./g, function (d) {
      return /[_\d]/.test(d) && i < s.length
        ? s.charAt(i++)
        : i >= s.length
        ? ""
        : d;
    })),
    t.type == "blur")
  ) {
    var a = new RegExp(this.maskreg);
    a.test(e.value) || (e.value = "");
  } else this.setCursorPosition(e.value.length, e);
};
fe.prototype.setCursorPosition = function (t, e) {
  if ((e.focus(), e.setSelectionRange)) e.setSelectionRange(t, t);
  else if (e.createTextRange) {
    var n = e.createTextRange();
    n.collapse(!0),
      n.moveEnd("character", t),
      n.moveStart("character", t),
      n.select();
  }
};
fe.prototype.setListeners = function () {
  this.el.addEventListener("input", this.mask.bind(this), !1),
    this.el.addEventListener("focus", this.mask.bind(this), !1),
    this.el.addEventListener("blur", this.mask.bind(this), !1);
};
fe.prototype.getElement = function (t) {
  if (t === void 0) return !1;
  if (this.isElement(t)) return t;
  if (typeof t == "string") {
    var e = document.querySelector(t);
    if (this.isElement(e)) return e;
  }
  return !1;
};
fe.prototype.isElement = function (t) {
  return t instanceof Element || t instanceof HTMLDocument;
};
document.addEventListener("DOMContentLoaded", function () {
  const t = document.getElementById("faq-breadcrumb");
  if (t != null) {
    let a = function (d) {
      d.preventDefault(), (t.scrollLeft += d.deltaY);
    };
    var r = a;
    t.addEventListener("wheel", a, { passive: !1 });
  }
  if (document.querySelector(".faq-grid") != null) {
    let c = function () {
      window.NodeList &&
        !NodeList.prototype.forEach &&
        (NodeList.prototype.forEach = Array.prototype.forEach),
        typeof Object.assign != "function" &&
          Object.defineProperty(Object, "assign", {
            value: function (o, l) {
              if (o == null)
                throw new TypeError(
                  "Cannot convert undefined or null to object"
                );
              for (var u = Object(o), p = 1; p < arguments.length; p++) {
                var f = arguments[p];
                if (f != null)
                  for (var h in f)
                    Object.prototype.hasOwnProperty.call(f, h) && (u[h] = f[h]);
              }
              return u;
            },
            writable: !0,
            configurable: !0,
          }),
        (function () {
          if (typeof window.CustomEvent == "function") return !1;
          function o(l, u) {
            u = u || { bubbles: !1, cancelable: !1, detail: void 0 };
            var p = document.createEvent("CustomEvent");
            return p.initCustomEvent(l, u.bubbles, u.cancelable, u.detail), p;
          }
          (o.prototype = window.Event.prototype), (window.CustomEvent = o);
        })();
    };
    var s = c;
    c();
    class a {
      constructor(l, u = {}) {
        let p = {
          accordion: !1,
          initClass: "collapse-init",
          activeClass: "panel-active",
          heightClass: "collapse-reading-height",
        };
        (this.settings = Object.assign({}, p, u)),
          (this._container = l),
          (this._panels = l.querySelectorAll("details")),
          (this.events = {
            openingPanel: new CustomEvent("openingPanel"),
            openedPanel: new CustomEvent("openedPanel"),
            closingPanel: new CustomEvent("closingPanel"),
            closedPanel: new CustomEvent("closedPanel"),
          });
      }
      _setPanelHeight(l) {
        let u = l.querySelector("summary + *");
        u.style.height = u.scrollHeight + "px";
      }
      _removePanelHeight(l) {
        let u = l.querySelector("summary + *");
        u.style.height = null;
      }
      open(l) {
        l.dispatchEvent(this.events.openingPanel), (l.open = !0);
      }
      _afterOpen(l) {
        this._setPanelHeight(l), l.classList.add(this.settings.activeClass);
      }
      _endOpen(l) {
        l.dispatchEvent(this.events.openedPanel), this._removePanelHeight(l);
      }
      close(l) {
        l.dispatchEvent(this.events.closingPanel), this._afterClose(l);
      }
      _afterClose(l) {
        this._setPanelHeight(l),
          setTimeout(() => {
            l.classList.remove(this.settings.activeClass),
              this._removePanelHeight(l);
          }, 100);
      }
      _endClose(l) {
        l.dispatchEvent(this.events.closedPanel), (l.open = !1);
      }
      toggle(l) {
        l.open ? this.close(l) : this.open(l);
      }
      openSinglePanel(l) {
        this._panels.forEach((u) => {
          l == u && !l.open ? this.open(u) : this.close(u);
        });
      }
      openAll() {
        this._panels.forEach((l) => {
          this.open(l);
        });
      }
      closeAll() {
        this._panels.forEach((l) => {
          this.close(l);
        });
      }
      _attachEvents() {
        this._panels.forEach((l) => {
          let u = l.querySelector("summary"),
            p = l.querySelector("summary + *");
          l.addEventListener("toggle", (h) => {
            let y = l.classList.contains(this.settings.heightClass);
            l.open && !y && this._afterOpen(l);
          }),
            u.addEventListener("click", (h) => {
              this.settings.accordion
                ? (this.openSinglePanel(l), h.preventDefault())
                : l.open && (this.close(l), h.preventDefault());
            });
          let f = "";
          p.addEventListener("transitionend", (h) => {
            h.target === p &&
              (f || (f = h.propertyName),
              h.propertyName == f &&
                (l.classList.contains(this.settings.activeClass)
                  ? this._endOpen(l)
                  : this._endClose(l)));
          });
        });
      }
      init() {
        return (
          this._attachEvents(),
          this._container.classList.add(this.settings.initClass),
          this
        );
      }
    }
    let d = document.querySelector(".collapse");
    new a(d, { accordion: !0 }).init();
  }
  document.querySelector(".collapse-faq") != null && i();
  function i() {
    c();
    class a {
      constructor(l, u = {}) {
        let p = {
          accordion: !1,
          initClass: "collapse-init-faq",
          activeClass: "panel-active-faq",
          heightClass: "collapse-reading-height-faq",
        };
        (this.settings = Object.assign({}, p, u)),
          (this._container = l),
          (this._panels = l.querySelectorAll(".details")),
          (this.events = {
            openingPanel: new CustomEvent("openingPanel"),
            openedPanel: new CustomEvent("openedPanel"),
            closingPanel: new CustomEvent("closingPanel"),
            closedPanel: new CustomEvent("closedPanel"),
          });
      }
      _setPanelHeight(l) {
        let u = l.querySelector("summary + *");
        u.style.height = u.scrollHeight + "px";
      }
      _removePanelHeight(l) {
        let u = l.querySelector("summary + *");
        u.style.height = null;
      }
      open(l) {
        l.dispatchEvent(this.events.openingPanel), (l.open = !0);
      }
      _afterOpen(l) {
        this._setPanelHeight(l), l.classList.add(this.settings.activeClass);
      }
      _endOpen(l) {
        l.dispatchEvent(this.events.openedPanel), this._removePanelHeight(l);
      }
      close(l) {
        l.dispatchEvent(this.events.closingPanel), this._afterClose(l);
      }
      _afterClose(l) {
        this._setPanelHeight(l),
          setTimeout(() => {
            l.classList.remove(this.settings.activeClass),
              this._removePanelHeight(l);
          }, 100);
      }
      _endClose(l) {
        l.dispatchEvent(this.events.closedPanel), (l.open = !1);
      }
      toggle(l) {
        l.open ? this.close(l) : this.open(l);
      }
      openSinglePanel(l) {
        this._panels.forEach((u) => {
          l == u && !l.open ? this.open(u) : this.close(u);
        });
      }
      openAll() {
        this._panels.forEach((l) => {
          this.open(l);
        });
      }
      closeAll() {
        this._panels.forEach((l) => {
          this.close(l);
        });
      }
      _attachEvents() {
        this._panels.forEach((l) => {
          let u = l.querySelector("summary"),
            p = l.querySelector("summary + *");
          l.addEventListener("toggle", (h) => {
            let y = l.classList.contains(this.settings.heightClass);
            l.open && !y && this._afterOpen(l);
          }),
            u.addEventListener("click", (h) => {
              this.settings.accordion
                ? (this.openSinglePanel(l), h.preventDefault())
                : l.open && (this.close(l), h.preventDefault());
            });
          let f = "";
          p.addEventListener("transitionend", (h) => {
            h.target === p &&
              (f || (f = h.propertyName),
              h.propertyName == f &&
                (l.classList.contains(this.settings.activeClass)
                  ? this._endOpen(l)
                  : this._endClose(l)));
          });
        });
      }
      init() {
        return (
          this._attachEvents(),
          this.settings.accordion && this.openSinglePanel(this._panels[0]),
          this._container.classList.add(this.settings.initClass),
          this
        );
      }
    }
    let d = document.querySelector(".collapse-faq");
    new a(d, { accordion: !0 }).init();
    function c() {
      window.NodeList &&
        !NodeList.prototype.forEach &&
        (NodeList.prototype.forEach = Array.prototype.forEach),
        typeof Object.assign != "function" &&
          Object.defineProperty(Object, "assign", {
            value: function (o, l) {
              if (o == null)
                throw new TypeError(
                  "Cannot convert undefined or null to object"
                );
              for (var u = Object(o), p = 1; p < arguments.length; p++) {
                var f = arguments[p];
                if (f != null)
                  for (var h in f)
                    Object.prototype.hasOwnProperty.call(f, h) && (u[h] = f[h]);
              }
              return u;
            },
            writable: !0,
            configurable: !0,
          }),
        (function () {
          if (typeof window.CustomEvent == "function") return !1;
          function o(l, u) {
            u = u || { bubbles: !1, cancelable: !1, detail: void 0 };
            var p = document.createEvent("CustomEvent");
            return p.initCustomEvent(l, u.bubbles, u.cancelable, u.detail), p;
          }
          (o.prototype = window.Event.prototype), (window.CustomEvent = o);
        })();
    }
  }
});
var vn = {},
  fr = function (t) {
    var e = typeof t;
    return t !== null && (e === "object" || e === "function");
  },
  pr = fr,
  Lt = Object.prototype.hasOwnProperty,
  mr = Object.prototype.propertyIsEnumerable;
function hr(t) {
  if (t == null) throw new TypeError("Sources cannot be null or undefined");
  return Object(t);
}
function Kt(t, e, n) {
  var i = e[n];
  if (i != null) {
    if (Lt.call(t, n) && (t[n] === void 0 || t[n] === null))
      throw new TypeError(
        "Cannot convert undefined or null to object (" + n + ")"
      );
    !Lt.call(t, n) || !pr(i) ? (t[n] = i) : (t[n] = yn(Object(t[n]), e[n]));
  }
}
function yn(t, e) {
  if (t === e) return t;
  e = Object(e);
  for (var n in e) Lt.call(e, n) && Kt(t, e, n);
  if (Object.getOwnPropertySymbols)
    for (var i = Object.getOwnPropertySymbols(e), r = 0; r < i.length; r++)
      mr.call(e, i[r]) && Kt(t, e, i[r]);
  return t;
}
var gr = function (e) {
    e = hr(e);
    for (var n = 1; n < arguments.length; n++) yn(e, arguments[n]);
    return e;
  },
  j;
function vr(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
Object.defineProperty(vn, "__esModule", { value: !0 });
var yr = (function () {
    function t(e, n) {
      for (var i = 0; i < n.length; i++) {
        var r = n[i];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          "value" in r && (r.writable = !0),
          Object.defineProperty(e, r.key, r);
      }
    }
    return function (e, n, i) {
      return n && t(e.prototype, n), i && t(e, i), e;
    };
  })(),
  wr = gr,
  Ie = [],
  Qt = (function () {
    function t(e, n) {
      vr(this, t),
        (this.defaults = {
          classNames: {
            modalBackdrop: "modal__backdrop",
            modalContent: "modal__content",
            modalClose: "modal__close",
            modalIn: "modal_in",
            modalOut: "modal_out",
            bodyWithOpenModal: "has-open-tbody-modal",
          },
          closeVariant: { backdrop: !0, button: !0, esc: !0 },
        }),
        (this.events = {}),
        (this.DOM = {}),
        (this.eventsNames = {
          show: "tbody-modal.show",
          shown: "tbody-modal.shown",
          close: "tbody-modal.close",
          closed: "tbody-modal.closed",
        }),
        (this.variantsTransitionsNames = {
          transition: "transitionend",
          OTransition: "oTransitionEnd",
          MozTransition: "transitionend",
          WebkitTransition: "webkitTransitionEnd",
        }),
        (this.settings = wr(this.defaults, n)),
        this.init(e);
    }
    return (
      yr(t, [
        {
          key: "close",
          value: function () {
            var e = this.settings.classNames;
            this.DOM.modal.dispatchEvent(this.events.close),
              this.DOM.modal.classList.remove(e.modalIn),
              this.DOM.modal.classList.add(e.modalOut),
              (this.settings.isVisible = !1);
          },
        },
        {
          key: "closeForwardModal",
          value: function () {
            for (var e = Ie.length - 1; e >= 0; e -= 1)
              if (
                Ie[e].DOM.modal.classList.contains(
                  this.settings.classNames.modalIn
                )
              ) {
                this.close();
                break;
              }
          },
        },
        {
          key: "compensationScrollbarWidth",
          value: function () {
            var e = document.body.scrollHeight > window.innerHeight,
              n = this.getScrollbarSize();
            e && n && (document.documentElement.style.marginRight = n + "px");
          },
        },
        {
          key: "delegateTriggerEvents",
          value: function () {
            this.DOM.modal.classList.contains(this.settings.classNames.modalIn)
              ? this.handlerShown()
              : this.handlerClosed();
          },
        },
        {
          key: "eventListener",
          value: function () {
            var e = this,
              n = this.settings.closeVariant;
            n.backdrop &&
              this.DOM.modalBackdrop.addEventListener("click", function () {
                e.close();
              }),
              n.button &&
                this.DOM.modalClose.addEventListener("click", function () {
                  e.close();
                }),
              n.esc &&
                window.addEventListener("keydown", function (i) {
                  i.keyCode === 27 && e.closeForwardModal();
                }),
              this.DOM.modal.addEventListener(
                this.transitionName,
                function (i) {
                  i.propertyName === "visibility" && e.delegateTriggerEvents();
                }
              );
          },
        },
        {
          key: "findElements",
          value: function (e) {
            var n = this.settings.classNames;
            (this.DOM.modal = document.querySelector(e)),
              (this.DOM.modalBackdrop = this.DOM.modal.getElementsByClassName(
                n.modalBackdrop
              )[0]),
              (this.DOM.modalContent = this.DOM.modal.getElementsByClassName(
                n.modalContent
              )[0]),
              (this.DOM.modalClose = this.DOM.modal.getElementsByClassName(
                n.modalClose
              )[0]);
          },
        },
        {
          key: "getScrollbarSize",
          value: function () {
            if (this.settings.scrollbarSize === void 0) {
              var e = document.createElement("div");
              (e.style.cssText = `width: 99px;
                                    height: 99px;
                                    overflow:scroll;
                                    position:absolute;
                                    top: -9999px;`),
                document.body.appendChild(e),
                (this.settings.scrollbarSize = e.offsetWidth - e.clientWidth),
                document.body.removeChild(e);
            }
            return this.settings.scrollbarSize;
          },
        },
        {
          key: "handlerClosed",
          value: function () {
            var e = this.settings.classNames;
            this.DOM.modal.dispatchEvent(this.events.closed),
              this.DOM.modal.classList.remove(e.modalOut),
              Ie.every(function (n) {
                return !n.settings.isVisible;
              }) &&
                (document.documentElement.classList.remove(e.bodyWithOpenModal),
                (document.documentElement.style.marginRight = ""));
          },
        },
        {
          key: "handlerShown",
          value: function () {
            this.DOM.modal.dispatchEvent(this.events.shown);
          },
        },
        {
          key: "init",
          value: function (e) {
            this.findElements(e),
              this.registerEvents(),
              this.wichTransitionEvent(),
              this.eventListener(),
              Ie.push(this);
          },
        },
        {
          key: "registerEvents",
          value: function () {
            var e = this;
            Object.keys(this.eventsNames).forEach(function (n) {
              var i = document.createEvent("Event");
              i.initEvent(e.eventsNames[n], !0, !1), (e.events[n] = i);
            });
          },
        },
        {
          key: "show",
          value: function () {
            var e = this.settings.classNames;
            this.compensationScrollbarWidth(),
              this.DOM.modal.dispatchEvent(this.events.show),
              this.DOM.modal.classList.remove(e.modalOut),
              this.DOM.modal.classList.add(e.modalIn),
              (this.settings.isVisible = !0),
              document.documentElement.classList.add(e.bodyWithOpenModal);
          },
        },
        {
          key: "wichTransitionEvent",
          value: function () {
            var e = this,
              n = document.createElement("fakeelement");
            Object.keys(this.variantsTransitionsNames).forEach(function (i) {
              n.style[i] !== void 0 &&
                (e.transitionName = e.variantsTransitionsNames[i]);
            });
          },
        },
      ]),
      t
    );
  })();
(Qt.closeAll = function () {
  return Ie.map(function (t) {
    return t.close();
  });
}),
  (j = vn.default = Qt);
function br() {
  const e = 16.666666666666668,
    n = Math.round(4e3 / e),
    i = (c) => c * (2 - c),
    r = (c) => {
      let o = 0;
      const l = parseInt(c.innerHTML, 10),
        u = setInterval(() => {
          o++;
          const p = i(o / n),
            f = Math.round(l * p);
          parseInt(c.innerHTML, 10) !== f && (c.innerHTML = f),
            o === n && clearInterval(u);
        }, e);
    },
    s = () => {
      document.querySelectorAll(".count-number--js").forEach(r);
    },
    a = new IntersectionObserver(function (c) {
      c[0].intersectionRatio <= 0 || (s(), a.disconnect());
    }),
    d = document.querySelector(".calculations-number");
  d != null && a.observe(d);
}
br();
function Sr() {
  const e = 16.666666666666668,
    n = Math.round(2e3 / e),
    i = (c) => c * (2 - c),
    r = (c) => {
      let o = 0;
      const l = parseInt(c.innerHTML, 10),
        u = setInterval(() => {
          o++;
          const p = i(o / n),
            f = Math.round(l * p);
          parseInt(c.innerHTML, 10) !== f && (c.innerHTML = f),
            o === n && clearInterval(u);
        }, e);
    },
    s = () => {
      document.querySelectorAll(".progreess-count--js").forEach(r);
    },
    a = new IntersectionObserver(function (c) {
      c[0].intersectionRatio <= 0 || (s(), a.disconnect());
    }),
    d = document.querySelector(".progreess-number");
  d != null && a.observe(d);
}
Sr();
function Er() {
  const e = 16.666666666666668,
    n = Math.round(2e3 / e),
    i = (c) => c * (2 - c),
    r = (c) => {
      let o = 0;
      const l = parseInt(c.value, 10),
        u = setInterval(() => {
          o++;
          const p = i(o / n),
            f = Math.round(l * p);
          parseInt(c.value, 10) !== f && (c.value = f),
            o === n && clearInterval(u);
        }, e);
    },
    s = () => {
      document.querySelectorAll(".progress-number--js").forEach(r);
    },
    a = new IntersectionObserver(function (c) {
      c[0].intersectionRatio <= 0 || (s(), a.disconnect());
    }),
    d = document.querySelector(".progreess-number");
  d != null && a.observe(d);
}
Er();
const Zt = document.querySelectorAll(".show-modal1"),
  Jt = document.querySelector(".show-modal2"),
  en = document.querySelector(".show-modal3"),
  tn = document.querySelectorAll(".show-modal4"),
  nn = document.querySelectorAll(".show-modal5"),
  sn = document.querySelector(".show-modal7"),
  rn = document.querySelector(".show-modal8"),
  an = document.querySelector(".show-modal11"),
  on = document.querySelector(".show-modalCalc"),
  ln = document.querySelector(".show-modalCalc2"),
  Cr = new j(".modal", { closeVariant: { backdrop: !1 } }),
  Tr = new j(".modal2", { closeVariant: { backdrop: !1 } }),
  xr = new j(".modalCalc", { closeVariant: { backdrop: !1 } }),
  Lr = new j(".modalCalc2", { closeVariant: { backdrop: !1 } }),
  kr = new j(".modal3", { closeVariant: { backdrop: !1 } }),
  Pr = new j(".modal4", { closeVariant: { backdrop: !1 } }),
  Mr = new j(".modal5", { closeVariant: { backdrop: !1 } }),
  Or = new j(".modal7", { closeVariant: { backdrop: !1 } }),
  Dr = new j(".modal8", { closeVariant: { backdrop: !1 } }),
  zr = new j(".modal11", { closeVariant: { backdrop: !1 } });
Zt != null &&
  Zt.forEach((t) => {
    t.addEventListener("click", (e) => {
      e.preventDefault(), Cr.show();
    });
  });
Jt != null &&
  Jt.addEventListener("click", (t) => {
    t.preventDefault(), Tr.show();
  });
on != null &&
  on.addEventListener("click", (t) => {
    t.preventDefault(), xr.show();
  });
ln != null &&
  ln.addEventListener("click", (t) => {
    t.preventDefault(), Lr.show();
  });
en != null &&
  en.addEventListener("click", (t) => {
    t.preventDefault(), kr.show();
  });
tn != null &&
  tn.forEach((t) => {
    t.addEventListener("click", (e) => {
      e.preventDefault();
      let n = e.target;
      Pr.show();
      let i = n.dataset.title,
        r = document.querySelector('.value-title [name="value-title"]');
      const s = document.querySelectorAll(".modal__close");
      (r.value = r.value + i),
        s.forEach((a) => {
          a.addEventListener("click", (d) => {
            r.value = "";
          });
        });
    });
  });
nn != null &&
  nn.forEach((t) => {
    t.addEventListener("click", (e) => {
      e.preventDefault();
      let n = e.target;
      Mr.show();
      let i = n.dataset.title2,
        r = document.querySelector('.value-title2 [name="value-title2"]');
      const s = document.querySelectorAll(".modal__close");
      (r.value = r.value + i),
        s.forEach((a) => {
          a.addEventListener("click", (d) => {
            r.value = "";
          });
        });
    });
  });
sn != null &&
  sn.addEventListener("click", (t) => {
    t.preventDefault(), Or.show();
  });
rn != null &&
  rn.addEventListener("click", (t) => {
    t.preventDefault(), Dr.show();
  });
an != null &&
  an.addEventListener("click", (t) => {
    t.preventDefault(), zr.show();
  });
