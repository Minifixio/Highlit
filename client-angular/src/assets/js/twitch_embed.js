/**
 * @license
 @overview es6-promise - a tiny implementation of Promises/A+.
 @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 @license   Licensed under MIT license
            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 @version   v4.2.4+314e4831
*/
'use strict';
!function(options, factory) {
  if ("object" == typeof exports && "object" == typeof module) {
    module.exports = factory();
  } else {
    if ("function" == typeof define && define.amd) {
      define([], factory);
    } else {
      if ("object" == typeof exports) {
        exports.video = factory();
      } else {
        options.Twitch = options.Twitch || {};
        options.Twitch.video = factory();
      }
    }
  }
}("undefined" != typeof self ? self : this, function() {
  return function(e) {
    /**
     * @param {number} i
     * @return {?}
     */
    function t(i) {
      if (n[i]) {
        return n[i].exports;
      }
      var module = n[i] = {
        i : i,
        l : false,
        exports : {}
      };
      return e[i].call(module.exports, module, module.exports, t), module.l = true, module.exports;
    }
    var n = {};
    return t.m = e, t.c = n, t.d = function(e, name, n) {
      if (!t.o(e, name)) {
        Object.defineProperty(e, name, {
          configurable : false,
          enumerable : true,
          get : n
        });
      }
    }, t.n = function(module) {
      /** @type {function(): ?} */
      var n = module && module.__esModule ? function() {
        return module.default;
      } : function() {
        return module;
      };
      return t.d(n, "a", n), n;
    }, t.o = function(e, input) {
      return Object.prototype.hasOwnProperty.call(e, input);
    }, t.p = "", t(t.s = 152);
  }([function(module, canCreateDiscussions, __webpack_require__) {
    var freeGlobal = __webpack_require__(28);
    /** @type {(Window|boolean)} */
    var freeSelf = "object" == typeof self && self && self.Object === Object && self;
    var storeMixin = freeGlobal || freeSelf || Function("return this")();
    module.exports = storeMixin;
  }, function(module, canCreateDiscussions) {
    /** @type {function(*): boolean} */
    var isArray = Array.isArray;
    /** @type {function(*): boolean} */
    module.exports = isArray;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} o
     * @return {?}
     */
    function n(o) {
      return null != o && "object" == typeof o;
    }
    /** @type {function(!Object): ?} */
    module.exports = n;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {?} value
     * @return {?}
     */
    function baseGetTag(value) {
      return null == value ? void 0 === value ? index : v2 : symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    var Symbol = __webpack_require__(7);
    var getRawTag = __webpack_require__(53);
    var objectToString = __webpack_require__(54);
    /** @type {string} */
    var v2 = "[object Null]";
    /** @type {string} */
    var index = "[object Undefined]";
    var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
    /** @type {function(?): ?} */
    module.exports = baseGetTag;
  }, function(module, canCreateDiscussions, require) {
    /**
     * @param {!Object} name
     * @param {number} a
     * @return {?}
     */
    function connect(name, a) {
      var l = q(name, a);
      return isString(l) ? l : void 0;
    }
    var isString = require(70);
    var q = require(73);
    /** @type {function(!Object, number): ?} */
    module.exports = connect;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} o
     * @return {?}
     */
    function n(o) {
      /** @type {string} */
      var tp = typeof o;
      return null != o && ("object" == tp || "function" == tp);
    }
    /** @type {function(!Object): ?} */
    module.exports = n;
  }, function(task, canCreateDiscussions, n) {
    /**
     * @param {!Object} x
     * @param {number} r
     * @param {!Object} val
     * @param {string} fn
     * @return {?}
     */
    function r(x, r, val, fn) {
      /** @type {boolean} */
      var noVal = !val;
      if (!val) {
        val = {};
      }
      /** @type {number} */
      var i = -1;
      var n = r.length;
      for (; ++i < n;) {
        var p = r[i];
        var n = fn ? fn(val[p], x[p], p, val, x) : void 0;
        if (void 0 === n) {
          n = x[p];
        }
        if (noVal) {
          i(val, p, n);
        } else {
          f(val, p, n);
        }
      }
      return val;
    }
    var f = n(17);
    var i = n(34);
    /** @type {function(!Object, number, !Object, string): ?} */
    task.exports = r;
  }, function(module, canCreateDiscussions, interpret) {
    var root = interpret(0);
    var Symbol = root.Symbol;
    module.exports = Symbol;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} a
     * @return {undefined}
     */
    function self(a) {
      /** @type {number} */
      var j = -1;
      var r_len = null == a ? 0 : a.length;
      this.clear();
      for (; ++j < r_len;) {
        var pair = a[j];
        this.set(pair[0], pair[1]);
      }
    }
    var listCacheClear = __webpack_require__(60);
    var method = __webpack_require__(61);
    var hashGet = __webpack_require__(62);
    var has = __webpack_require__(63);
    var cookie = __webpack_require__(64);
    self.prototype.clear = listCacheClear;
    self.prototype.delete = method;
    self.prototype.get = hashGet;
    self.prototype.has = has;
    self.prototype.set = cookie;
    /** @type {function(!Object): undefined} */
    module.exports = self;
  }, function(task, canCreateDiscussions, dselect) {
    /**
     * @param {!Object} x
     * @param {number} r
     * @return {?}
     */
    function r(x, r) {
      var s = x.length;
      for (; s--;) {
        if (a(x[s][0], r)) {
          return s;
        }
      }
      return -1;
    }
    var a = dselect(15);
    /** @type {function(!Object, number): ?} */
    task.exports = r;
  }, function(module, canCreateDiscussions, require) {
    var getNative = require(4);
    var nativeCreate = getNative(Object, "create");
    module.exports = nativeCreate;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} value
     * @param {number} key
     * @return {?}
     */
    function getMapData(value, key) {
      var data = value.__data__;
      return isKeyable(key) ? data["string" == typeof key ? "string" : "hash"] : data.map;
    }
    var isKeyable = __webpack_require__(82);
    /** @type {function(!Object, number): ?} */
    module.exports = getMapData;
  }, function(module, canCreateDiscussions, require) {
    /**
     * @param {!Object} value
     * @return {?}
     */
    function build(value) {
      return isString(value) ? Number(value) : stringify(value);
    }
    var Number = require(36);
    var stringify = require(93);
    var isString = require(14);
    /** @type {function(!Object): ?} */
    module.exports = build;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} x
     * @return {?}
     */
    function n(x) {
      var obj = x && x.constructor;
      return x === ("function" == typeof obj && obj.prototype || oproto);
    }
    var oproto = Object.prototype;
    /** @type {function(!Object): ?} */
    module.exports = n;
  }, function(module, canCreateDiscussions, fn) {
    /**
     * @param {!Object} v
     * @return {?}
     */
    function connect(v) {
      return null != v && next(v.length) && !valid(v);
    }
    var valid = fn(31);
    var next = fn(40);
    /** @type {function(!Object): ?} */
    module.exports = connect;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} type
     * @param {?} string
     * @return {?}
     */
    function n(type, string) {
      return type === string || type !== type && string !== string;
    }
    /** @type {function(!Object, ?): ?} */
    module.exports = n;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    var getNative = __webpack_require__(4);
    var root = __webpack_require__(0);
    var Map = getNative(root, "Map");
    module.exports = Map;
  }, function(pkg, canCreateDiscussions, $) {
    /**
     * @param {!Object} object
     * @param {number} key
     * @param {?} value
     * @return {undefined}
     */
    function index(object, key, value) {
      var objValue = object[key];
      if (!(ohasOwn.call(object, key) && eq(objValue, value) && (void 0 !== value || key in object))) {
        put(object, key, value);
      }
    }
    var put = $(34);
    var eq = $(15);
    var oproto = Object.prototype;
    /** @type {function(this:Object, *): boolean} */
    var ohasOwn = oproto.hasOwnProperty;
    /** @type {function(!Object, number, ?): undefined} */
    pkg.exports = index;
  }, function(mixin, canCreateDiscussions) {
    /**
     * @param {!Object} module
     * @return {?}
     */
    mixin.exports = function(module) {
      return module.webpackPolyfill || (module.deprecate = function() {
      }, module.paths = [], module.children || (module.children = []), Object.defineProperty(module, "loaded", {
        enumerable : true,
        get : function() {
          return module.l;
        }
      }), Object.defineProperty(module, "id", {
        enumerable : true,
        get : function() {
          return module.i;
        }
      }), module.webpackPolyfill = 1), module;
    };
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} callback
     * @return {?}
     */
    function withoutResults(callback) {
      return function(identifierPositions) {
        return callback(identifierPositions);
      };
    }
    /** @type {function(!Object): ?} */
    module.exports = withoutResults;
  }, function(module, exports, __webpack_require__) {
    (function(s) {
      var freeGlobal = __webpack_require__(28);
      var freeExports = "object" == typeof exports && exports && !exports.nodeType && exports;
      var module = freeExports && "object" == typeof s && s && !s.nodeType && s;
      var moduleExports = module && module.exports === freeExports;
      var freeProcess = moduleExports && freeGlobal.process;
      var c = function() {
        try {
          var t = module && module.require && module.require("util").types;
          return t || freeProcess && freeProcess.binding && freeProcess.binding("util");
        } catch (t) {
        }
      }();
      s.exports = c;
    }).call(exports, __webpack_require__(18)(module));
  }, function(module, canCreateDiscussions, require) {
    var assign = require(101);
    var gOPN = require(43);
    var objectProto$11 = Object.prototype;
    /** @type {function(this:Object, string): boolean} */
    var propIsEnumerable = objectProto$11.propertyIsEnumerable;
    /** @type {function(!Object): !Array<?>} */
    var gOPS = Object.getOwnPropertySymbols;
    var storeMixin = gOPS ? function(obj) {
      return null == obj ? [] : (obj = Object(obj), assign(gOPS(obj), function(key) {
        return propIsEnumerable.call(obj, key);
      }));
    } : gOPN;
    module.exports = storeMixin;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} s
     * @param {number} d
     * @return {?}
     */
    function n(s, d) {
      /** @type {number} */
      var i = -1;
      var l = d.length;
      var n = s.length;
      for (; ++i < l;) {
        s[n + i] = d[i];
      }
      return s;
    }
    /** @type {function(!Object, number): ?} */
    module.exports = n;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    var overArg = __webpack_require__(41);
    var getPrototype = overArg(Object.getPrototypeOf, Object);
    module.exports = getPrototype;
  }, function(module, canCreateDiscussions, require) {
    var h2 = require(104);
    var end = require(16);
    var base = require(105);
    var img = require(106);
    var p = require(107);
    var o = require(3);
    var $ = require(32);
    var show = $(h2);
    var rollover = $(end);
    var trigger = $(base);
    var tiles = $(img);
    var $pElement = $(p);
    var l = o;
    if (h2 && "[object DataView]" != l(new h2(new ArrayBuffer(1))) || end && "[object Map]" != l(new end) || base && "[object Promise]" != l(base.resolve()) || img && "[object Set]" != l(new img) || p && "[object WeakMap]" != l(new p)) {
      /**
       * @param {!Object} a
       * @return {?}
       */
      l = function(a) {
        var i = o(a);
        var body = "[object Object]" == i ? a.constructor : void 0;
        var args = body ? $(body) : "";
        if (args) {
          switch(args) {
            case show:
              return "[object DataView]";
            case rollover:
              return "[object Map]";
            case trigger:
              return "[object Promise]";
            case tiles:
              return "[object Set]";
            case $pElement:
              return "[object WeakMap]";
          }
        }
        return i;
      };
    }
    module.exports = l;
  }, function(context, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} value
     * @return {?}
     */
    function init(value) {
      var lump = new value.constructor(value.byteLength);
      return (new Uint8Array(lump)).set(new Uint8Array(value)), lump;
    }
    var Uint8Array = __webpack_require__(110);
    /** @type {function(!Object): ?} */
    context.exports = init;
  }, function(task, canCreateDiscussions, resolver) {
    /**
     * @param {!Object} t
     * @param {number} d
     * @return {?}
     */
    function r(t, d) {
      return isPromise(t) ? t : p(t, d) ? [t] : require(resolve(t));
    }
    var isPromise = resolver(1);
    var p = resolver(122);
    var require = resolver(123);
    var resolve = resolver(126);
    /** @type {function(!Object, number): ?} */
    task.exports = r;
  }, function(task, canCreateDiscussions, require) {
    /**
     * @param {!Object} x
     * @return {?}
     */
    function r(x) {
      return "symbol" == typeof x || isNumber(x) && isPromise(x) == o;
    }
    var isPromise = require(3);
    var isNumber = require(2);
    /** @type {string} */
    var o = "[object Symbol]";
    /** @type {function(!Object): ?} */
    task.exports = r;
  }, function(module, gen34_options, moment) {
    (function(global) {
      var freeGlobal = "object" == typeof global && global && global.Object === Object && global;
      module.exports = freeGlobal;
    }).call(gen34_options, moment(29));
  }, function(module, canCreateDiscussions) {
    var g;
    g = function() {
      return this;
    }();
    try {
      g = g || Function("return this")() || (0, eval)("this");
    } catch (t) {
      if ("object" == typeof window) {
        /** @type {!Window} */
        g = window;
      }
    }
    module.exports = g;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} b
     * @param {number} callback
     * @return {?}
     */
    function join(b, callback) {
      /** @type {number} */
      var i = -1;
      var len = null == b ? 0 : b.length;
      /** @type {!Array} */
      var arr = Array(len);
      for (; ++i < len;) {
        arr[i] = callback(b[i], i, b);
      }
      return arr;
    }
    /** @type {function(!Object, number): ?} */
    module.exports = join;
  }, function(module, canCreateDiscussions, fn) {
    /**
     * @param {!Object} name
     * @return {?}
     */
    function parse(name) {
      if (!valid(name)) {
        return false;
      }
      var el = o(name);
      return el == $tree || el == $results || el == tabs_5 || el == pCurrentElement;
    }
    var o = fn(3);
    var valid = fn(5);
    /** @type {string} */
    var tabs_5 = "[object AsyncFunction]";
    /** @type {string} */
    var $tree = "[object Function]";
    /** @type {string} */
    var $results = "[object GeneratorFunction]";
    /** @type {string} */
    var pCurrentElement = "[object Proxy]";
    /** @type {function(!Object): ?} */
    module.exports = parse;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} value
     * @return {?}
     */
    function n(value) {
      if (null != value) {
        try {
          return funcToString.call(value);
        } catch (t) {
        }
        try {
          return value + "";
        } catch (t) {
        }
      }
      return "";
    }
    var funcProto = Function.prototype;
    /** @type {function(this:!Function): string} */
    var funcToString = funcProto.toString;
    /** @type {function(!Object): ?} */
    module.exports = n;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} a
     * @return {undefined}
     */
    function self(a) {
      /** @type {number} */
      var j = -1;
      var r_len = null == a ? 0 : a.length;
      this.clear();
      for (; ++j < r_len;) {
        var pair = a[j];
        this.set(pair[0], pair[1]);
      }
    }
    var listCacheClear = __webpack_require__(74);
    var method = __webpack_require__(81);
    var hashGet = __webpack_require__(83);
    var has = __webpack_require__(84);
    var cookie = __webpack_require__(85);
    self.prototype.clear = listCacheClear;
    self.prototype.delete = method;
    self.prototype.get = hashGet;
    self.prototype.has = has;
    self.prototype.set = cookie;
    /** @type {function(!Object): undefined} */
    module.exports = self;
  }, function(pkg, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} m
     * @param {number} k
     * @param {!Object} value
     * @return {undefined}
     */
    function callback(m, k, value) {
      if ("__proto__" == k && defineProperty) {
        defineProperty(m, k, {
          configurable : true,
          enumerable : true,
          value : value,
          writable : true
        });
      } else {
        /** @type {!Object} */
        m[k] = value;
      }
    }
    var defineProperty = __webpack_require__(35);
    /** @type {function(!Object, number, !Object): undefined} */
    pkg.exports = callback;
  }, function(module, canCreateDiscussions, saveNotifs) {
    var $defineProperty = saveNotifs(4);
    var storeMixin = function() {
      try {
        var hasKey = $defineProperty(Object, "defineProperty");
        return hasKey({}, "", {}), hasKey;
      } catch (t) {
      }
    }();
    module.exports = storeMixin;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} value
     * @param {number} inherited
     * @return {?}
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value);
      var isBuff = !isArr && isBuffer(value);
      var isTyped = !isArr && !isBuff && isTypedArray(value);
      var isType = !isArr && !isBuff && !isTyped && isArguments(value);
      var skipIndexes = isArr || isBuff || isTyped || isType;
      var result = skipIndexes ? baseTimes(value.length, String) : [];
      var exists = result.length;
      var undefined;
      for (undefined in value) {
        if (!(!inherited && !hasOwnProperty.call(value, undefined) || skipIndexes && ("length" == undefined || isTyped && ("offset" == undefined || "parent" == undefined) || isType && ("buffer" == undefined || "byteLength" == undefined || "byteOffset" == undefined) || c(undefined, exists)))) {
          result.push(undefined);
        }
      }
      return result;
    }
    var baseTimes = __webpack_require__(88);
    var isBuffer = __webpack_require__(37);
    var isArray = __webpack_require__(1);
    var isTypedArray = __webpack_require__(38);
    var c = __webpack_require__(39);
    var isArguments = __webpack_require__(91);
    var ObjProto = Object.prototype;
    /** @type {function(this:Object, *): boolean} */
    var hasOwnProperty = ObjProto.hasOwnProperty;
    /** @type {function(!Object, number): ?} */
    module.exports = arrayLikeKeys;
  }, function(mixin, canCreateDiscussions, require) {
    var matrix = require(89);
    var isArrayLikeObject = require(2);
    var ObjProto = Object.prototype;
    /** @type {function(this:Object, *): boolean} */
    var hasOwnProperty = ObjProto.hasOwnProperty;
    /** @type {function(this:Object, string): boolean} */
    var propertyIsEnumerable = ObjProto.propertyIsEnumerable;
    var m = matrix(function() {
      return arguments;
    }()) ? matrix : function(value) {
      return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    };
    mixin.exports = m;
  }, function(context, exports, parse) {
    (function(module) {
      var root = parse(0);
      var browser = parse(90);
      var freeExports = "object" == typeof exports && exports && !exports.nodeType && exports;
      var freeModule = freeExports && "object" == typeof module && module && !module.nodeType && module;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      var Buffer = moduleExports ? root.Buffer : void 0;
      var runtime = Buffer ? Buffer.isBuffer : void 0;
      var f = runtime || browser;
      module.exports = f;
    }).call(exports, parse(18)(context));
  }, function(module, canCreateDiscussions) {
    /**
     * @param {?} i
     * @param {number} a
     * @return {?}
     */
    function n(i, a) {
      /** @type {string} */
      var _ = typeof i;
      return !!(a = null == a ? previous : a) && ("number" == _ || "symbol" != _ && o.test(i)) && i > -1 && i % 1 == 0 && i < a;
    }
    /** @type {number} */
    var previous = 9007199254740991;
    /** @type {!RegExp} */
    var o = /^(?:0|[1-9]\d*)$/;
    /** @type {function(?, number): ?} */
    module.exports = n;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {?} t
     * @return {?}
     */
    function n(t) {
      return "number" == typeof t && t > -1 && t % 1 == 0 && t <= milliseconds;
    }
    /** @type {number} */
    var milliseconds = 9007199254740991;
    /** @type {function(?): ?} */
    module.exports = n;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} callback
     * @param {number} fn
     * @return {?}
     */
    function render(callback, fn) {
      return function(o) {
        return callback(fn(o));
      };
    }
    /** @type {function(!Object, number): ?} */
    module.exports = render;
  }, function(module, canCreateDiscussions, require) {
    /**
     * @param {!Object} value
     * @return {?}
     */
    function build(value) {
      return isString(value) ? Number(value, true) : stringify(value);
    }
    var Number = require(36);
    var stringify = require(96);
    var isString = require(14);
    /** @type {function(!Object): ?} */
    module.exports = build;
  }, function(module, canCreateDiscussions) {
    /**
     * @return {?}
     */
    function ScrollNavBar() {
      return [];
    }
    /** @type {function(): ?} */
    module.exports = ScrollNavBar;
  }, function(mixin, canCreateDiscussions, require) {
    var assertEquals = require(22);
    var _splitCapilalise = require(23);
    var isEmpty = require(21);
    var tmp = require(43);
    /** @type {function(!Object): !Array<?>} */
    var ownSymbols = Object.getOwnPropertySymbols;
    var m = ownSymbols ? function(name) {
      /** @type {!Array} */
      var spaceBetweenBarsSpecified = [];
      for (; name;) {
        assertEquals(spaceBetweenBarsSpecified, isEmpty(name));
        name = _splitCapilalise(name);
      }
      return spaceBetweenBarsSpecified;
    } : tmp;
    mixin.exports = m;
  }, function(context, canCreateDiscussions, setIsAsync) {
    /**
     * @param {!Object} value
     * @param {number} scale
     * @param {!Object} callback
     * @return {?}
     */
    function init(value, scale, callback) {
      var result = scale(value);
      return isPromise(value) ? result : done(result, callback(value));
    }
    var done = setIsAsync(22);
    var isPromise = setIsAsync(1);
    /** @type {function(!Object, number, !Object): ?} */
    context.exports = init;
  }, function(module, canCreateDiscussions, n) {
    /**
     * @param {!Object} name
     * @return {?}
     */
    function api(name) {
      return next(name, i, end);
    }
    var next = n(45);
    var end = n(44);
    var i = n(42);
    /** @type {function(!Object): ?} */
    module.exports = api;
  }, function(module, canCreateDiscussions, require) {
    /**
     * @param {?} key
     * @return {?}
     */
    function toKey(key) {
      if ("string" == typeof key || isSymbol(key)) {
        return key;
      }
      /** @type {string} */
      var keyString = key + "";
      return "0" == keyString && 1 / key == -Infinity ? "-0" : keyString;
    }
    var isSymbol = require(27);
    /** @type {number} */
    var Infinity = 1 / 0;
    /** @type {function(?): ?} */
    module.exports = toKey;
  }, function(module, canCreateDiscussions, iter_f) {
    /**
     * @param {!Object} name
     * @param {number} index
     * @param {!Object} callback
     * @return {?}
     */
    function run(name, index, callback) {
      return index = min(void 0 === index ? name.length - 1 : index, 0), function() {
        /** @type {!Arguments} */
        var arr = arguments;
        /** @type {number} */
        var i = -1;
        /** @type {number} */
        var count = min(arr.length - index, 0);
        /** @type {!Array} */
        var data = Array(count);
        for (; ++i < count;) {
          data[i] = arr[index + i];
        }
        /** @type {number} */
        i = -1;
        /** @type {!Array} */
        var results = Array(index + 1);
        for (; ++i < index;) {
          results[i] = arr[i];
        }
        return results[index] = callback(data), next(name, this, results);
      };
    }
    var next = iter_f(138);
    /** @type {function(...?): number} */
    var min = Math.max;
    /** @type {function(!Object, number, !Object): ?} */
    module.exports = run;
  }, function(mixin, canCreateDiscussions, prepare) {
    var u = prepare(139);
    var a = prepare(141);
    var m = a(u);
    mixin.exports = m;
  }, function(mixin, canCreateDiscussions) {
    /**
     * @param {!Object} x
     * @return {?}
     */
    function m(x) {
      return x;
    }
    /** @type {function(!Object): ?} */
    mixin.exports = m;
  }, function(canCreateDiscussions, exports, n) {
    /**
     * @param {?} e
     * @return {?}
     */
    function parseUri(e) {
      var o = {
        strictMode : false,
        key : ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
        q : {
          name : "queryKey",
          parser : /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser : {
          strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
          loose : /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
      };
      var n = o.parser[o.strictMode ? "strict" : "loose"].exec(e);
      var form = {};
      /** @type {number} */
      var i = 14;
      for (; i--;) {
        form[o.key[i]] = n[i] || "";
      }
      return form[o.q.name] = {}, form[o.key[12]].replace(o.q.parser, function(canCreateDiscussions, name, loadedPlugin) {
        if (name) {
          form[o.q.name][name] = loadedPlugin;
        }
      }), form;
    }
    /** @type {function(?): ?} */
    exports.a = parseUri;
  }, function(task, canCreateDiscussions, exprFn) {
    /**
     * @param {!Object} x
     * @return {?}
     */
    function r(x) {
      return "string" == typeof x || !d3$round(x) && arg(x) && d3_format_precision(x) == row;
    }
    var d3_format_precision = exprFn(3);
    var d3$round = exprFn(1);
    var arg = exprFn(2);
    /** @type {string} */
    var row = "[object String]";
    /** @type {function(!Object): ?} */
    task.exports = r;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} item
     * @return {?}
     */
    function ColorReplaceFilter(item) {
      /** @type {boolean} */
      var groupKey = hasOwnProp.call(item, key);
      var index = item[key];
      try {
        item[key] = void 0;
        /** @type {boolean} */
        var e = true;
      } catch (t) {
      }
      /** @type {string} */
      var t = toString.call(item);
      return e && (groupKey ? item[key] = index : delete item[key]), t;
    }
    var Symbol = __webpack_require__(7);
    var ObjProto = Object.prototype;
    /** @type {function(this:Object, *): boolean} */
    var hasOwnProp = ObjProto.hasOwnProperty;
    /** @type {function(this:*): string} */
    var toString = ObjProto.toString;
    var key = Symbol ? Symbol.toStringTag : void 0;
    /** @type {function(!Object): ?} */
    module.exports = ColorReplaceFilter;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} input
     * @return {?}
     */
    function n(input) {
      return toString.call(input);
    }
    var ObjProto = Object.prototype;
    /** @type {function(this:*): string} */
    var toString = ObjProto.toString;
    /** @type {function(!Object): ?} */
    module.exports = n;
  }, function(canCreateDiscussions, value, t) {
    /**
     * @param {!AudioNode} t
     * @param {!Function} m
     * @return {undefined}
     */
    function r(t, m) {
      if (!(t instanceof m)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    /**
     * @param {!Function} options
     * @param {string} n
     * @return {undefined}
     */
    function e(options, n) {
      /** @type {number} */
      var i = 0;
      for (; i < n.length; i++) {
        var prop = n[i];
        prop.enumerable = prop.enumerable || false;
        /** @type {boolean} */
        prop.configurable = true;
        if ("value" in prop) {
          /** @type {boolean} */
          prop.writable = true;
        }
        Object.defineProperty(options, prop.key, prop);
      }
    }
    /**
     * @param {!Function} t
     * @param {!Function} n
     * @param {!Function} a
     * @return {?}
     */
    function i(t, n, a) {
      return n && e(t.prototype, n), a && e(t, a), t;
    }
    t.d(value, "b", function() {
      return pluginName;
    });
    t.d(value, "c", function() {
      return streamEndedEvent;
    });
    t.d(value, "g", function() {
      return DEFAULT_CACHE_NAME;
    });
    t.d(value, "h", function() {
      return netFlag;
    });
    t.d(value, "i", function() {
      return PAUSE;
    });
    t.d(value, "j", function() {
      return status;
    });
    t.d(value, "k", function() {
      return A;
    });
    t.d(value, "l", function() {
      return STATE_PLAYING;
    });
    t.d(value, "m", function() {
      return event;
    });
    t.d(value, "n", function() {
      return k;
    });
    t.d(value, "a", function() {
      return T;
    });
    t.d(value, "e", function() {
      return L;
    });
    t.d(value, "f", function() {
      return M;
    });
    t.d(value, "o", function() {
      return C;
    });
    t.d(value, "p", function() {
      return R;
    });
    t.d(value, "d", function() {
      return swagErr;
    });
    t.d(value, "r", function() {
      return D;
    });
    t.d(value, "s", function() {
      return N;
    });
    t.d(value, "t", function() {
      return playMode;
    });
    t.d(value, "u", function() {
      return state;
    });
    t.d(value, "v", function() {
      return U;
    });
    t.d(value, "w", function() {
      return V;
    });
    t.d(value, "x", function() {
      return B;
    });
    t.d(value, "y", function() {
      return W;
    });
    t.d(value, "z", function() {
      return hm_id;
    });
    t.d(value, "A", function() {
      return Y;
    });
    t.d(value, "B", function() {
      return $;
    });
    t.d(value, "C", function() {
      return type;
    });
    t.d(value, "D", function() {
      return K;
    });
    t.d(value, "E", function() {
      return G;
    });
    t.d(value, "F", function() {
      return thisToolName;
    });
    t.d(value, "G", function() {
      return J;
    });
    t.d(value, "H", function() {
      return X;
    });
    t.d(value, "I", function() {
      return Z;
    });
    t.d(value, "J", function() {
      return VolumeInteger;
    });
    t.d(value, "K", function() {
      return et;
    });
    t.d(value, "L", function() {
      return parsing;
    });
    t.d(value, "M", function() {
      return rt;
    });
    t.d(value, "N", function() {
      return ot;
    });
    t.d(value, "O", function() {
      return zencoderUrl;
    });
    t.d(value, "P", function() {
      return ut;
    });
    t.d(value, "Q", function() {
      return volumePath;
    });
    t.d(value, "R", function() {
      return ct;
    });
    t.d(value, "S", function() {
      return lt;
    });
    t.d(value, "T", function() {
      return PAUSED;
    });
    t.d(value, "q", function() {
      return ht;
    });
    var module = t(56);
    var require = t.n(module);
    var link = t(57);
    var debug = t.n(link);
    var name = t(142);
    var write = t.n(name);
    var widget = t(146);
    var cfg = t.n(widget);
    var pkg = t(51);
    var self = t(147);
    var events = t(149);
    var yyyy = (t.n(events), function() {
      /** @type {string} */
      var imgURL = "https://player.twitch.tv";
      if (document.currentScript) {
        /** @type {string} */
        imgURL = document.currentScript.src;
      } else {
        /** @type {!Array<?>} */
        var img_tags = Array.prototype.filter.call(document.scripts, function(t) {
          return /twitch\.tv.*embed/.test(t.src);
        });
        imgURL = img_tags.length > 0 ? img_tags[0].src : document.scripts[document.scripts.length - 1].src;
      }
      var self = Object(pkg.a)(imgURL);
      var r = self.path.split("/");
      return "testplayer.twitch.tv" === self.host.toLowerCase() ? imgURL.replace(/\/js\/embed\/v1.js/g, "") : /^(\d+\.)(\d+\.)(\d+)$/.test(r[1]) ? "".concat(self.protocol, "://").concat(self.authority, "/").concat(r[1]) : "".concat(self.protocol, "://").concat(self.authority);
    }());
    var g = Object.freeze({
      channelName : "",
      currentTime : 0,
      duration : 0,
      mature : false,
      muted : false,
      playback : "",
      quality : "",
      qualitiesAvailable : [],
      stats : {},
      videoID : "",
      viewers : 0,
      volume : 0
    });
    var res = Object.freeze({
      height : 390,
      width : 640,
      allowfullscreen : false
    });
    /** @type {string} */
    var pluginName = "captions";
    /** @type {string} */
    var streamEndedEvent = "ended";
    /** @type {string} */
    var DEFAULT_CACHE_NAME = "offline";
    /** @type {string} */
    var netFlag = "online";
    /** @type {string} */
    var PAUSE = "pause";
    /** @type {string} */
    var status = "play";
    /** @type {string} */
    var A = "playbackBlocked";
    /** @type {string} */
    var STATE_PLAYING = "playing";
    /** @type {string} */
    var event = "ready";
    /** @type {string} */
    var k = "transitionToRecommendedVod";
    /** @type {string} */
    var T = "bufferEmpty";
    /** @type {string} */
    var L = "minuteWatched";
    /** @type {string} */
    var M = "nSecondPlay";
    /** @type {string} */
    var C = "videoPlay";
    /** @type {string} */
    var R = "videoError";
    /** @type {string} */
    var swagErr = "error";
    /** @type {string} */
    var D = "disableCaptions";
    /** @type {string} */
    var N = "enableCaptions";
    /** @type {string} */
    var playMode = "pause";
    /** @type {string} */
    var state = "play";
    /** @type {string} */
    var U = "seek";
    /** @type {string} */
    var V = "setAutoplay";
    /** @type {string} */
    var B = "setAutoMaxVideoSize";
    /** @type {string} */
    var W = "setCaptionSize";
    /** @type {string} */
    var hm_id = "channel";
    /** @type {string} */
    var Y = "channelId";
    /** @type {string} */
    var $ = "setclip";
    /** @type {string} */
    var type = "collection";
    /** @type {string} */
    var K = "setcontent";
    /** @type {string} */
    var G = "setEditClip";
    /** @type {string} */
    var thisToolName = "fullscreen";
    /** @type {string} */
    var J = "setLiveLowLatencyEnabled";
    /** @type {string} */
    var X = "setLiveMaxLatency";
    /** @type {string} */
    var Z = "setminiplayermode";
    /** @type {string} */
    var VolumeInteger = "mute";
    /** @type {string} */
    var et = "setPlayerType";
    /** @type {string} */
    var parsing = "quality";
    /** @type {string} */
    var rt = "theatre";
    /** @type {string} */
    var ot = "setTrackingProperties";
    /** @type {string} */
    var zencoderUrl = "video";
    /** @type {string} */
    var ut = "setvideosource";
    /** @type {string} */
    var volumePath = "volume";
    /** @type {string} */
    var ct = "showplayercontrols";
    /** @type {string} */
    var property = "ready";
    /** @type {string} */
    var method = "subscribe";
    /** @type {string} */
    var lt = "ended";
    /** @type {string} */
    var PAUSED = "paused";
    var ht = function() {
      /**
       * @param {!Object} b
       * @return {undefined}
       */
      function t(b) {
        var res_STAR_ = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : res;
        r(this, t);
        this._eventEmitter = new cfg.a;
        this._playerStateEmitter = new cfg.a;
        this._playerState = g;
        this._storeState = {};
        this._onHostReady = this._getHostReady();
        this._iframe = this._createPlayerIframe(res_STAR_);
        b.appendChild(this._iframe);
        this._host = this._iframe.contentWindow;
        this._send(method);
      }
      return i(t, [{
        key : "destroy",
        value : function() {
          this.callPlayerMethod("destroy");
        }
      }, {
        key : "_createPlayerIframe",
        value : function(opts) {
          var options = this._normalizeOptions(opts);
          /** @type {string} */
          options.origin = document.location.origin;
          /** @type {!Element} */
          var node = document.createElement("iframe");
          var sBa = Object(self.a)(debug()(options, "width", "height"));
          /** @type {string} */
          var s = "".concat(yyyy, "/?").concat(sBa);
          return node.setAttribute("src", s), node.setAttribute("width", options.width), node.setAttribute("height", options.height), node.setAttribute("frameBorder", "0"), node.setAttribute("scrolling", "no"), node.setAttribute("allow", "autoplay; fullscreen"), options.allowfullscreen && node.setAttribute("allowfullscreen", ""), node;
        }
      }, {
        key : "_normalizeOptions",
        value : function(options) {
          var params = write()({}, res, options);
          return false !== options.allowfullscreen && (params.allowfullscreen = true), params;
        }
      }, {
        key : "_getHostReady",
        value : function() {
          var test = this;
          return new events.Promise(function(displayChangeFn, _nextEventFunc) {
            /**
             * @param {!Object} value
             * @return {undefined}
             */
            function listener(value) {
              if (this._isClientMessage(value) && value.data.method === property) {
                this._storeState = value.data.args[0];
                window.removeEventListener("message", handler);
                window.addEventListener("message", this);
                this._eventEmitter.emit(event);
                displayChangeFn();
              }
            }
            var handler = listener.bind(test);
            window.addEventListener("message", handler);
            setTimeout(_nextEventFunc, 15E3);
          });
        }
      }, {
        key : "_send",
        value : function(load) {
          /** @type {number} */
          var length = arguments.length;
          /** @type {!Array} */
          var args = new Array(length > 1 ? length - 1 : 0);
          /** @type {number} */
          var i = 1;
          for (; i < length; i++) {
            args[i - 1] = arguments[i];
          }
          var msg = {
            namespace : "player.embed.host",
            method : load,
            args : args
          };
          this._host.postMessage(msg, "*");
        }
      }, {
        key : "_deferSend",
        value : function() {
          var _this = this;
          /** @type {number} */
          var i = arguments.length;
          /** @type {!Array} */
          var n = new Array(i);
          /** @type {number} */
          var k = 0;
          for (; k < i; k++) {
            n[k] = arguments[k];
          }
          return this._onHostReady.then(function() {
            return _this._send.apply(_this, n);
          });
        }
      }, {
        key : "_isClientMessage",
        value : function(event) {
          return !!this._iframe && (Boolean(event.data) && "player.embed.client" === event.data.namespace && event.source === this._iframe.contentWindow);
        }
      }, {
        key : "handleEvent",
        value : function(e) {
          if (this._isClientMessage(e)) {
            switch(e.data.method) {
              case "bridgestateupdate":
                this._playerState = e.data.args[0];
                this._playerStateEmitter.emit("playerstateupdate", this._playerState);
                break;
              case "bridgeplayerevent":
                this._eventEmitter.emit(e.data.args[0].event);
                break;
              case "bridgeplayereventwithpayload":
                this._eventEmitter.emit(e.data.args[0].event, e.data.args[0].data);
                break;
              case "bridgestorestateupdate":
                this._storeState = e.data.args[0];
                break;
              case "bridgedestroy":
                this._iframe.parentNode.removeChild(this._iframe);
                window.removeEventListener("message", this);
                delete this._iframe;
                delete this._host;
            }
          }
        }
      }, {
        key : "getPlayerState",
        value : function() {
          return this._playerState;
        }
      }, {
        key : "getStoreState",
        value : function() {
          return this._storeState;
        }
      }, {
        key : "addEventListener",
        value : function(event, fn) {
          this._eventEmitter.on(event, fn);
        }
      }, {
        key : "addPlayerStateListener",
        value : function(pathOrAccessor) {
          this._playerStateEmitter.on("playerstateupdate", pathOrAccessor);
          pathOrAccessor(this._playerState);
        }
      }, {
        key : "removePlayerStateListener",
        value : function(pathOrAccessor) {
          this._playerStateEmitter.off("playerstateupdate", pathOrAccessor);
        }
      }, {
        key : "removeEventListener",
        value : function(event, fn) {
          this._eventEmitter.off(event, fn);
        }
      }, {
        key : "callPlayerMethod",
        value : function(t) {
          /** @type {number} */
          var length = arguments.length;
          /** @type {!Array} */
          var vargs = new Array(length > 1 ? length - 1 : 0);
          /** @type {number} */
          var i = 1;
          for (; i < length; i++) {
            vargs[i - 1] = arguments[i];
          }
          return this._deferSend.apply(this, [t].concat(vargs));
        }
      }, {
        key : "setWidth",
        value : function(listener) {
          if (require()(listener) && listener >= 0) {
            this._iframe.setAttribute("width", listener);
          }
        }
      }, {
        key : "setHeight",
        value : function(listener) {
          if (require()(listener) && listener >= 0) {
            this._iframe.setAttribute("height", listener);
          }
        }
      }]), t;
    }();
  }, function(module, canCreateDiscussions, formGlobals) {
    /**
     * @param {!Object} value
     * @return {?}
     */
    function isFinite(value) {
      return "number" == typeof value && global_isFinite(value);
    }
    var globals = formGlobals(0);
    var global_isFinite = globals.isFinite;
    /** @type {function(!Object): ?} */
    module.exports = isFinite;
  }, function(module, canCreateDiscussions, $) {
    var h = $(30);
    var o = $(58);
    var c = $(121);
    var next = $(26);
    var callback = $(6);
    var t = $(132);
    var end = $(134);
    var f = $(46);
    var dev = end(function(line, e) {
      var b = {};
      if (null == line) {
        return b;
      }
      /** @type {boolean} */
      var s = false;
      e = h(e, function(token) {
        return token = next(token, line), s || (s = token.length > 1), token;
      });
      callback(line, f(line), b);
      if (s) {
        b = o(b, 7, t);
      }
      var i = e.length;
      for (; i--;) {
        c(b, e[i]);
      }
      return b;
    });
    module.exports = dev;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} value
     * @param {number} data
     * @param {!Object} customizer
     * @param {!Function} key
     * @param {!Object} object
     * @param {!Object} stack
     * @return {?}
     */
    function baseClone(value, data, customizer, key, object, stack) {
      var result;
      /** @type {number} */
      var isDeep = data & CLONE_DEEP_FLAG;
      /** @type {number} */
      var isFlat = data & CLONE_FLAT_FLAG;
      /** @type {number} */
      var isFull = data & CLONE_SYMBOLS_FLAG;
      if (customizer && (result = object ? customizer(value, key, object, stack) : customizer(value)), void 0 !== result) {
        return result;
      }
      if (!isHostObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        if (result = initCloneArray(value), !isDeep) {
          return arrayCopy(value, result);
        }
      } else {
        var j = isBuffer(value);
        /** @type {boolean} */
        var isFunc = j == smarts_img_col_idx || j == iVer;
        if (getTag(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (j == smiles_1_img_col_idx || j == smiles_2_img_col_idx || isFunc && !object) {
          if (result = isFlat || isFunc ? {} : initCloneObject(value), !isDeep) {
            return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!row[j]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, j, isDeep);
        }
      }
      if (!stack) {
        stack = new Stack;
      }
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      if (stack.set(value, result), isObject(value)) {
        return value.forEach(function(a) {
          result.add(baseClone(a, data, customizer, a, value, stack));
        }), result;
      }
      if (slice(value)) {
        return value.forEach(function(a, key) {
          result.set(key, baseClone(a, data, customizer, key, value, stack));
        }), result;
      }
      var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
      var props = isArr ? void 0 : keysFunc(value);
      return arrayEach(props || value, function(a, key) {
        if (props) {
          /** @type {!Object} */
          key = a;
          a = value[key];
        }
        assignValue(result, key, baseClone(a, data, customizer, key, value, stack));
      }), result;
    }
    var Stack = __webpack_require__(59);
    var arrayEach = __webpack_require__(86);
    var assignValue = __webpack_require__(17);
    var baseAssign = __webpack_require__(87);
    var baseAssignIn = __webpack_require__(95);
    var cloneBuffer = __webpack_require__(98);
    var arrayCopy = __webpack_require__(99);
    var copySymbols = __webpack_require__(100);
    var copySymbolsIn = __webpack_require__(102);
    var getAllKeys = __webpack_require__(103);
    var getAllKeysIn = __webpack_require__(46);
    var isBuffer = __webpack_require__(24);
    var initCloneArray = __webpack_require__(108);
    var initCloneByTag = __webpack_require__(109);
    var initCloneObject = __webpack_require__(115);
    var isArray = __webpack_require__(1);
    var getTag = __webpack_require__(38);
    var slice = __webpack_require__(117);
    var isHostObject = __webpack_require__(5);
    var isObject = __webpack_require__(119);
    var keys = __webpack_require__(12);
    /** @type {number} */
    var CLONE_DEEP_FLAG = 1;
    /** @type {number} */
    var CLONE_FLAT_FLAG = 2;
    /** @type {number} */
    var CLONE_SYMBOLS_FLAG = 4;
    /** @type {string} */
    var smiles_2_img_col_idx = "[object Arguments]";
    /** @type {string} */
    var smarts_img_col_idx = "[object Function]";
    /** @type {string} */
    var iVer = "[object GeneratorFunction]";
    /** @type {string} */
    var smiles_1_img_col_idx = "[object Object]";
    var row = {};
    /** @type {boolean} */
    row[smiles_2_img_col_idx] = row["[object Array]"] = row["[object ArrayBuffer]"] = row["[object DataView]"] = row["[object Boolean]"] = row["[object Date]"] = row["[object Float32Array]"] = row["[object Float64Array]"] = row["[object Int8Array]"] = row["[object Int16Array]"] = row["[object Int32Array]"] = row["[object Map]"] = row["[object Number]"] = row[smiles_1_img_col_idx] = row["[object RegExp]"] = row["[object Set]"] = row["[object String]"] = row["[object Symbol]"] = row["[object Uint8Array]"] = 
    row["[object Uint8ClampedArray]"] = row["[object Uint16Array]"] = row["[object Uint32Array]"] = true;
    /** @type {boolean} */
    row["[object Error]"] = row[smarts_img_col_idx] = row["[object WeakMap]"] = false;
    /** @type {function(!Object, number, !Object, !Function, !Object, !Object): ?} */
    module.exports = baseClone;
  }, function(module, canCreateDiscussions, require) {
    /**
     * @param {!Object} name
     * @return {undefined}
     */
    function Stack(name) {
      var data = this.__data__ = new Context(name);
      this.size = data.size;
    }
    var Context = require(8);
    var clear = require(65);
    var del = require(66);
    var action = require(67);
    var has = require(68);
    var cookie = require(69);
    Stack.prototype.clear = clear;
    Stack.prototype.delete = del;
    Stack.prototype.get = action;
    Stack.prototype.has = has;
    Stack.prototype.set = cookie;
    /** @type {function(!Object): undefined} */
    module.exports = Stack;
  }, function(module, canCreateDiscussions) {
    /**
     * @return {undefined}
     */
    function Box() {
      /** @type {!Array} */
      this.__data__ = [];
      /** @type {number} */
      this.size = 0;
    }
    /** @type {function(): undefined} */
    module.exports = Box;
  }, function(module, canCreateDiscussions, pointFromEvent) {
    /**
     * @param {!Object} key
     * @return {?}
     */
    function bind(key) {
      var data = this.__data__;
      var i = p(data, key);
      return !(i < 0) && (i == data.length - 1 ? data.pop() : splice.call(data, i, 1), --this.size, true);
    }
    var p = pointFromEvent(9);
    var array = Array.prototype;
    /** @type {function(this:IArrayLike<T>, *=, *=, ...T): !Array<T>} */
    var splice = array.splice;
    /** @type {function(!Object): ?} */
    module.exports = bind;
  }, function(module, canCreateDiscussions, pointFromEvent) {
    /**
     * @param {!Object} key
     * @return {?}
     */
    function bind(key) {
      var d = this.__data__;
      var x = p(d, key);
      return x < 0 ? void 0 : d[x][1];
    }
    var p = pointFromEvent(9);
    /** @type {function(!Object): ?} */
    module.exports = bind;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} key
     * @return {?}
     */
    function listCacheDelete(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    var assocIndexOf = __webpack_require__(9);
    /** @type {function(!Object): ?} */
    module.exports = listCacheDelete;
  }, function(module, canCreateDiscussions, NFA) {
    /**
     * @param {!Object} attr
     * @param {number} e
     * @return {?}
     */
    function bind(attr, e) {
      var d = this.__data__;
      var p = m(d, attr);
      return p < 0 ? (++this.size, d.push([attr, e])) : d[p][1] = e, this;
    }
    var m = NFA(9);
    /** @type {function(!Object, number): ?} */
    module.exports = bind;
  }, function(module, canCreateDiscussions, keyGen) {
    /**
     * @return {undefined}
     */
    function Box() {
      this.__data__ = new o;
      /** @type {number} */
      this.size = 0;
    }
    var o = keyGen(8);
    /** @type {function(): undefined} */
    module.exports = Box;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} t
     * @return {?}
     */
    function bind(t) {
      var data = this.__data__;
      var textWas = data.delete(t);
      return this.size = data.size, textWas;
    }
    /** @type {function(!Object): ?} */
    module.exports = bind;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} key
     * @return {?}
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }
    /** @type {function(!Object): ?} */
    module.exports = stackGet;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} value
     * @return {?}
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    /** @type {function(!Object): ?} */
    module.exports = setCacheHas;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} value
     * @param {number} key
     * @return {?}
     */
    function stackSet(value, key) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!_classlist || pairs.length < LARGE_ARRAY_SIZE - 1) {
          return pairs.push([value, key]), this.size = ++data.size, this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      return data.set(value, key), this.size = data.size, this;
    }
    var ListCache = __webpack_require__(8);
    var _classlist = __webpack_require__(16);
    var MapCache = __webpack_require__(33);
    /** @type {number} */
    var LARGE_ARRAY_SIZE = 200;
    /** @type {function(!Object, number): ?} */
    module.exports = stackSet;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} value
     * @return {?}
     */
    function self(value) {
      return !(!isRegExp(value) || getPrototypeOf(value)) && (isFunction(value) ? reIsNative : reIsHostCtor).test(normalize(value));
    }
    var isFunction = __webpack_require__(31);
    var getPrototypeOf = __webpack_require__(71);
    var isRegExp = __webpack_require__(5);
    var normalize = __webpack_require__(32);
    /** @type {!RegExp} */
    var savedRegExp = /[\\^$.*+?()[\]{}|]/g;
    /** @type {!RegExp} */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var funcProto = Function.prototype;
    var ObjProto = Object.prototype;
    /** @type {function(this:!Function): string} */
    var funcToString = funcProto.toString;
    /** @type {function(this:Object, *): boolean} */
    var hasOwnProperty = ObjProto.hasOwnProperty;
    /** @type {!RegExp} */
    var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(savedRegExp, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
    /** @type {function(!Object): ?} */
    module.exports = self;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} options
     * @return {?}
     */
    function CustomComponentType(options) {
      return !!yieldLimit && yieldLimit in options;
    }
    var coreJsData = __webpack_require__(72);
    var yieldLimit = function() {
      /** @type {(Array<string>|null)} */
      var mixElem = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return mixElem ? "Symbol(src)_1." + mixElem : "";
    }();
    /** @type {function(!Object): ?} */
    module.exports = CustomComponentType;
  }, function(module, canCreateDiscussions, interpret) {
    var root = interpret(0);
    var coreJsData = root["__core-js_shared__"];
    module.exports = coreJsData;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} type
     * @param {number} text
     * @return {?}
     */
    function n(type, text) {
      return null == type ? void 0 : type[text];
    }
    /** @type {function(!Object, number): ?} */
    module.exports = n;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @return {undefined}
     */
    function mapCacheClear() {
      /** @type {number} */
      this.size = 0;
      this.__data__ = {
        hash : new Hash,
        map : new (OtherHandlebars || Handlebars),
        string : new Hash
      };
    }
    var Hash = __webpack_require__(75);
    var Handlebars = __webpack_require__(8);
    var OtherHandlebars = __webpack_require__(16);
    /** @type {function(): undefined} */
    module.exports = mapCacheClear;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} a
     * @return {undefined}
     */
    function self(a) {
      /** @type {number} */
      var j = -1;
      var r_len = null == a ? 0 : a.length;
      this.clear();
      for (; ++j < r_len;) {
        var pair = a[j];
        this.set(pair[0], pair[1]);
      }
    }
    var listCacheClear = __webpack_require__(76);
    var method = __webpack_require__(77);
    var hashGet = __webpack_require__(78);
    var has = __webpack_require__(79);
    var cookie = __webpack_require__(80);
    self.prototype.clear = listCacheClear;
    self.prototype.delete = method;
    self.prototype.get = hashGet;
    self.prototype.has = has;
    self.prototype.set = cookie;
    /** @type {function(!Object): undefined} */
    module.exports = self;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @return {undefined}
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      /** @type {number} */
      this.size = 0;
    }
    var nativeCreate = __webpack_require__(10);
    /** @type {function(): undefined} */
    module.exports = hashClear;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} key
     * @return {?}
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      return this.size -= result ? 1 : 0, result;
    }
    /** @type {function(!Object): ?} */
    module.exports = hashDelete;
  }, function(module, canCreateDiscussions, floor) {
    /**
     * @param {!Object} key
     * @return {?}
     */
    function listCacheDelete(key) {
      var data = this.__data__;
      if (startYNew) {
        var n = data[key];
        return n === trident ? void 0 : n;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    var startYNew = floor(10);
    /** @type {string} */
    var trident = "__lodash_hash_undefined__";
    var ObjProto = Object.prototype;
    /** @type {function(this:Object, *): boolean} */
    var hasOwnProperty = ObjProto.hasOwnProperty;
    /** @type {function(!Object): ?} */
    module.exports = listCacheDelete;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} key
     * @return {?}
     */
    function listCacheDelete(key) {
      var data = this.__data__;
      return nativeCreate ? void 0 !== data[key] : hasOwnProperty.call(data, key);
    }
    var nativeCreate = __webpack_require__(10);
    var ObjProto = Object.prototype;
    /** @type {function(this:Object, *): boolean} */
    var hasOwnProperty = ObjProto.hasOwnProperty;
    /** @type {function(!Object): ?} */
    module.exports = listCacheDelete;
  }, function(module, canCreateDiscussions, createInverter) {
    /**
     * @param {!Object} name
     * @param {number} a
     * @return {?}
     */
    function bind(name, a) {
      var cache = this.__data__;
      return this.size += this.has(name) ? 0 : 1, cache[name] = invert && void 0 === a ? block : a, this;
    }
    var invert = createInverter(10);
    /** @type {string} */
    var block = "__lodash_hash_undefined__";
    /** @type {function(!Object, number): ?} */
    module.exports = bind;
  }, function(blob, canCreateDiscussions, require) {
    /**
     * @param {!Object} file
     * @return {?}
     */
    function data(file) {
      var result = $(this, file).delete(file);
      return this.size -= result ? 1 : 0, result;
    }
    var $ = require(11);
    /** @type {function(!Object): ?} */
    blob.exports = data;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} object
     * @return {?}
     */
    function isKey(object) {
      /** @type {string} */
      var type = typeof object;
      return "string" == type || "number" == type || "symbol" == type || "boolean" == type ? "__proto__" !== object : null === object;
    }
    /** @type {function(!Object): ?} */
    module.exports = isKey;
  }, function(context, canCreateDiscussions, require) {
    /**
     * @param {!Object} instance
     * @return {?}
     */
    function user(instance) {
      return $(this, instance).get(instance);
    }
    var $ = require(11);
    /** @type {function(!Object): ?} */
    context.exports = user;
  }, function(module, canCreateDiscussions, $parse) {
    /**
     * @param {!Object} key
     * @return {?}
     */
    function has(key) {
      return get(this, key).has(key);
    }
    var get = $parse(11);
    /** @type {function(!Object): ?} */
    module.exports = has;
  }, function(c2, canCreateDiscussions, keyGen) {
    /**
     * @param {!Object} line
     * @param {number} input
     * @return {?}
     */
    function add(line, input) {
      var el = o(this, line);
      var len = el.size;
      return el.set(line, input), this.size += el.size == len ? 0 : 1, this;
    }
    var o = keyGen(11);
    /** @type {function(!Object, number): ?} */
    c2.exports = add;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} o
     * @param {number} fn
     * @return {?}
     */
    function n(o, fn) {
      /** @type {number} */
      var k = -1;
      var kl = null == o ? 0 : o.length;
      for (; ++k < kl && false !== fn(o[k], k, o);) {
      }
      return o;
    }
    /** @type {function(!Object, number): ?} */
    module.exports = n;
  }, function(module, canCreateDiscussions, validateCallback) {
    /**
     * @param {!Object} data
     * @param {number} key
     * @return {?}
     */
    function action(data, key) {
      return data && callback(key, parseInt(key), data);
    }
    var callback = validateCallback(6);
    var parseInt = validateCallback(12);
    /** @type {function(!Object, number): ?} */
    module.exports = action;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {number} n
     * @param {number} f
     * @return {?}
     */
    function on(n, f) {
      /** @type {number} */
      var i = -1;
      /** @type {!Array} */
      var ret = Array(n);
      for (; ++i < n;) {
        ret[i] = f(i);
      }
      return ret;
    }
    /** @type {function(number, number): ?} */
    module.exports = on;
  }, function(mixin, canCreateDiscussions, createElement) {
    /**
     * @param {!Object} t
     * @return {?}
     */
    function m(t) {
      return s(t) && o(t) == maybe;
    }
    var o = createElement(3);
    var s = createElement(2);
    /** @type {string} */
    var maybe = "[object Arguments]";
    /** @type {function(!Object): ?} */
    mixin.exports = m;
  }, function(module, canCreateDiscussions) {
    /**
     * @return {?}
     */
    function ScrollNavBar() {
      return false;
    }
    /** @type {function(): ?} */
    module.exports = ScrollNavBar;
  }, function(mixin, canCreateDiscussions, __webpack_require__) {
    var tmp = __webpack_require__(92);
    var from_cache = __webpack_require__(19);
    var nodeUtil = __webpack_require__(20);
    var object = nodeUtil && nodeUtil.isTypedArray;
    var m = object ? from_cache(object) : tmp;
    mixin.exports = m;
  }, function(module, canCreateDiscussions, $) {
    /**
     * @param {!Object} i
     * @return {?}
     */
    function validate(i) {
      return t(i) && accept(i.length) && !!set[isAuthorSignature(i)];
    }
    var isAuthorSignature = $(3);
    var accept = $(40);
    var t = $(2);
    var set = {};
    /** @type {boolean} */
    set["[object Float32Array]"] = set["[object Float64Array]"] = set["[object Int8Array]"] = set["[object Int16Array]"] = set["[object Int32Array]"] = set["[object Uint8Array]"] = set["[object Uint8ClampedArray]"] = set["[object Uint16Array]"] = set["[object Uint32Array]"] = true;
    /** @type {boolean} */
    set["[object Arguments]"] = set["[object Array]"] = set["[object ArrayBuffer]"] = set["[object Boolean]"] = set["[object DataView]"] = set["[object Date]"] = set["[object Error]"] = set["[object Function]"] = set["[object Map]"] = set["[object Number]"] = set["[object Object]"] = set["[object RegExp]"] = set["[object Set]"] = set["[object String]"] = set["[object WeakMap]"] = false;
    /** @type {function(!Object): ?} */
    module.exports = validate;
  }, function(pkg, canCreateDiscussions, integrate) {
    /**
     * @param {!Object} object
     * @return {?}
     */
    function index(object) {
      if (!on(object)) {
        return add(object);
      }
      /** @type {!Array} */
      var result = [];
      var key;
      for (key in Object(object)) {
        if (hasOwnProperty.call(object, key) && "constructor" != key) {
          result.push(key);
        }
      }
      return result;
    }
    var on = integrate(13);
    var add = integrate(94);
    var ObjProto = Object.prototype;
    /** @type {function(this:Object, *): boolean} */
    var hasOwnProperty = ObjProto.hasOwnProperty;
    /** @type {function(!Object): ?} */
    pkg.exports = index;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    var overArg = __webpack_require__(41);
    var getPrototype = overArg(Object.keys, Object);
    module.exports = getPrototype;
  }, function(module, canCreateDiscussions, validateCallback) {
    /**
     * @param {!Object} data
     * @param {number} key
     * @return {?}
     */
    function action(data, key) {
      return data && callback(key, parseInt(key), data);
    }
    var callback = validateCallback(6);
    var parseInt = validateCallback(42);
    /** @type {function(!Object, number): ?} */
    module.exports = action;
  }, function(task, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} name
     * @return {?}
     */
    function r(name) {
      if (!isArray(name)) {
        return add(name);
      }
      var unit = parse(name);
      /** @type {!Array} */
      var returnValue = [];
      var key;
      for (key in name) {
        if ("constructor" != key || !unit && hasOwn.call(name, key)) {
          returnValue.push(key);
        }
      }
      return returnValue;
    }
    var isArray = __webpack_require__(5);
    var parse = __webpack_require__(13);
    var add = __webpack_require__(97);
    var OP = Object.prototype;
    /** @type {function(this:Object, *): boolean} */
    var hasOwn = OP.hasOwnProperty;
    /** @type {function(!Object): ?} */
    task.exports = r;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} arg
     * @return {?}
     */
    function n(arg) {
      /** @type {!Array} */
      var arr = [];
      if (null != arg) {
        var key;
        for (key in Object(arg)) {
          arr.push(key);
        }
      }
      return arr;
    }
    /** @type {function(!Object): ?} */
    module.exports = n;
  }, function(i, obj, interpret) {
    (function(module) {
      /**
       * @param {!Object} options
       * @param {number} url
       * @return {?}
       */
      function exports(options, url) {
        if (url) {
          return options.slice();
        }
        var data = options.length;
        var r = recordCreator ? recordCreator(data) : new options.constructor(data);
        return options.copy(r), r;
      }
      var root = interpret(0);
      var freeExports = "object" == typeof obj && obj && !obj.nodeType && obj;
      var freeModule = freeExports && "object" == typeof module && module && !module.nodeType && module;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      var Buffer = moduleExports ? root.Buffer : void 0;
      var recordCreator = Buffer ? Buffer.allocUnsafe : void 0;
      /** @type {function(!Object, number): ?} */
      module.exports = exports;
    }).call(obj, interpret(18)(i));
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} a
     * @param {number} x
     * @return {?}
     */
    function n(a, x) {
      /** @type {number} */
      var j = -1;
      var i = a.length;
      if (!x) {
        /** @type {!Array} */
        x = Array(i);
      }
      for (; ++j < i;) {
        x[j] = a[j];
      }
      return x;
    }
    /** @type {function(!Object, number): ?} */
    module.exports = n;
  }, function(mixin, canCreateDiscussions, fn) {
    /**
     * @param {!Object} name
     * @param {number} data
     * @return {?}
     */
    function m(name, data) {
      return o(name, unsubscribe(name), data);
    }
    var o = fn(6);
    var unsubscribe = fn(21);
    /** @type {function(!Object, number): ?} */
    mixin.exports = m;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} o
     * @param {number} fn
     * @return {?}
     */
    function on(o, fn) {
      /** @type {number} */
      var n = -1;
      var lcslen = null == o ? 0 : o.length;
      /** @type {number} */
      var ri = 0;
      /** @type {!Array} */
      var res = [];
      for (; ++n < lcslen;) {
        var key = o[n];
        if (fn(key, n, o)) {
          res[ri++] = key;
        }
      }
      return res;
    }
    /** @type {function(!Object, number): ?} */
    module.exports = on;
  }, function(mixin, canCreateDiscussions, fn) {
    /**
     * @param {!Object} name
     * @param {number} data
     * @return {?}
     */
    function m(name, data) {
      return o(name, unsubscribe(name), data);
    }
    var o = fn(6);
    var unsubscribe = fn(44);
    /** @type {function(!Object, number): ?} */
    mixin.exports = m;
  }, function(module, canCreateDiscussions, n) {
    /**
     * @param {!Object} name
     * @return {?}
     */
    function api(name) {
      return next(name, i, end);
    }
    var next = n(45);
    var end = n(21);
    var i = n(12);
    /** @type {function(!Object): ?} */
    module.exports = api;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    var getNative = __webpack_require__(4);
    var root = __webpack_require__(0);
    var DataView = getNative(root, "DataView");
    module.exports = DataView;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    var getNative = __webpack_require__(4);
    var root = __webpack_require__(0);
    var Promise = getNative(root, "Promise");
    module.exports = Promise;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    var getNative = __webpack_require__(4);
    var global = __webpack_require__(0);
    var Set = getNative(global, "Set");
    module.exports = Set;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    var getNative = __webpack_require__(4);
    var root = __webpack_require__(0);
    var WeakMap = getNative(root, "WeakMap");
    module.exports = WeakMap;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} array
     * @return {?}
     */
    function initCloneArray(array) {
      var length = array.length;
      var result = new array.constructor(length);
      return length && "string" == typeof array[0] && hasOwnProperty.call(array, "index") && (result.index = array.index, result.input = array.input), result;
    }
    var ObjProto = Object.prototype;
    /** @type {function(this:Object, *): boolean} */
    var hasOwnProperty = ObjProto.hasOwnProperty;
    /** @type {function(!Object): ?} */
    module.exports = initCloneArray;
  }, function(module, canCreateDiscussions, parseFloat) {
    /**
     * @param {!Object} value
     * @param {number} key
     * @param {!Object} data
     * @return {?}
     */
    function x(value, key, data) {
      var ctor = value.constructor;
      switch(key) {
        case b:
          return pad(value);
        case remote_mta:
        case server_groups:
          return new ctor(+value);
        case getUserByteStats:
          return a(value, data);
        case XliffUri:
        case EditPreviewDataUri:
        case thunderbird_3:
        case failedKey:
        case babel_asset:
        case highlight_font_color:
        case childDisabledBefore18:
        case BankBranch:
        case childCohabitedLastYear:
          return h(value, data);
        case l:
          return new ctor;
        case AccountHolderID:
        case getDistributionStatsPointTwoDegree:
          return new ctor(value);
        case getDistributionStatsWithSearchPointTwoDegree:
          return xScale(value);
        case BankSwift:
          return new ctor;
        case deductibleMedicalExpenses:
          return o(value);
      }
    }
    var pad = parseFloat(25);
    var a = parseFloat(111);
    var xScale = parseFloat(112);
    var o = parseFloat(113);
    var h = parseFloat(114);
    /** @type {string} */
    var remote_mta = "[object Boolean]";
    /** @type {string} */
    var server_groups = "[object Date]";
    /** @type {string} */
    var l = "[object Map]";
    /** @type {string} */
    var AccountHolderID = "[object Number]";
    /** @type {string} */
    var getDistributionStatsWithSearchPointTwoDegree = "[object RegExp]";
    /** @type {string} */
    var BankSwift = "[object Set]";
    /** @type {string} */
    var getDistributionStatsPointTwoDegree = "[object String]";
    /** @type {string} */
    var deductibleMedicalExpenses = "[object Symbol]";
    /** @type {string} */
    var b = "[object ArrayBuffer]";
    /** @type {string} */
    var getUserByteStats = "[object DataView]";
    /** @type {string} */
    var XliffUri = "[object Float32Array]";
    /** @type {string} */
    var EditPreviewDataUri = "[object Float64Array]";
    /** @type {string} */
    var thunderbird_3 = "[object Int8Array]";
    /** @type {string} */
    var failedKey = "[object Int16Array]";
    /** @type {string} */
    var babel_asset = "[object Int32Array]";
    /** @type {string} */
    var highlight_font_color = "[object Uint8Array]";
    /** @type {string} */
    var childDisabledBefore18 = "[object Uint8ClampedArray]";
    /** @type {string} */
    var BankBranch = "[object Uint16Array]";
    /** @type {string} */
    var childCohabitedLastYear = "[object Uint32Array]";
    /** @type {function(!Object, number, !Object): ?} */
    module.exports = x;
  }, function(module, canCreateDiscussions, defaultValue) {
    var view = defaultValue(0);
    var Uint8Array = view.Uint8Array;
    module.exports = Uint8Array;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} typedArray
     * @param {number} isDeep
     * @return {?}
     */
    function cloneDataView(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.byteLength);
    }
    var cloneArrayBuffer = __webpack_require__(25);
    /** @type {function(!Object, number): ?} */
    module.exports = cloneDataView;
  }, function(mixin, canCreateDiscussions) {
    /**
     * @param {!Object} regexp
     * @return {?}
     */
    function cloneRegExp$1(regexp) {
      var result = new regexp.constructor(regexp.source, string.exec(regexp));
      return result.lastIndex = regexp.lastIndex, result;
    }
    /** @type {!RegExp} */
    var string = /\w*$/;
    /** @type {function(!Object): ?} */
    mixin.exports = cloneRegExp$1;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} key
     * @return {?}
     */
    function assignKey(key) {
      return symbolValueOf$1 ? Object(symbolValueOf$1.call(key)) : {};
    }
    var Symbol = __webpack_require__(7);
    var symbolProto$2 = Symbol ? Symbol.prototype : void 0;
    var symbolValueOf$1 = symbolProto$2 ? symbolProto$2.valueOf : void 0;
    /** @type {function(!Object): ?} */
    module.exports = assignKey;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} typedArray
     * @param {number} isDeep
     * @return {?}
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }
    var cloneArrayBuffer = __webpack_require__(25);
    /** @type {function(!Object, number): ?} */
    module.exports = cloneTypedArray;
  }, function(pkg, canCreateDiscussions, bind) {
    /**
     * @param {!Object} x
     * @return {?}
     */
    function index(x) {
      return "function" != typeof x.constructor || write(x) ? {} : next(success(x));
    }
    var next = bind(116);
    var success = bind(23);
    var write = bind(13);
    /** @type {function(!Object): ?} */
    pkg.exports = index;
  }, function(module, canCreateDiscussions, saveNotifs) {
    var attemptClassAddition = saveNotifs(5);
    /** @type {function((Object|null), (Object|null)=): !Object} */
    var _create = Object.create;
    var storeMixin = function() {
      /**
       * @return {undefined}
       */
      function Created() {
      }
      return function(obj) {
        if (!attemptClassAddition(obj)) {
          return {};
        }
        if (_create) {
          return _create(obj);
        }
        /** @type {!Object} */
        Created.prototype = obj;
        var tmp = new Created;
        return Created.prototype = void 0, tmp;
      };
    }();
    module.exports = storeMixin;
  }, function(mixin, canCreateDiscussions, require) {
    var uninitialized = require(118);
    var from_cache = require(19);
    var rs = require(20);
    var object = rs && rs.isMap;
    var m = object ? from_cache(object) : uninitialized;
    mixin.exports = m;
  }, function(mixin, canCreateDiscussions, createElement) {
    /**
     * @param {!Object} t
     * @return {?}
     */
    function m(t) {
      return s(t) && o(t) == maybe;
    }
    var o = createElement(24);
    var s = createElement(2);
    /** @type {string} */
    var maybe = "[object Map]";
    /** @type {function(!Object): ?} */
    mixin.exports = m;
  }, function(mixin, canCreateDiscussions, require) {
    var uninitialized = require(120);
    var from_cache = require(19);
    var options = require(20);
    var object = options && options.isSet;
    var m = object ? from_cache(object) : uninitialized;
    mixin.exports = m;
  }, function(mixin, canCreateDiscussions, createElement) {
    /**
     * @param {!Object} t
     * @return {?}
     */
    function m(t) {
      return s(t) && o(t) == maybe;
    }
    var o = createElement(24);
    var s = createElement(2);
    /** @type {string} */
    var maybe = "[object Set]";
    /** @type {function(!Object): ?} */
    mixin.exports = m;
  }, function(task, canCreateDiscussions, n) {
    /**
     * @param {!Object} e
     * @param {number} a
     * @return {?}
     */
    function r(e, a) {
      return a = o(a, e), null == (e = m(e, a)) || delete e[p(f(a))];
    }
    var o = n(26);
    var f = n(128);
    var m = n(129);
    var p = n(47);
    /** @type {function(!Object, number): ?} */
    task.exports = r;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {?} name
     * @param {number} obj
     * @return {?}
     */
    function isKey(name, obj) {
      if (isObject(name)) {
        return false;
      }
      /** @type {string} */
      var type = typeof name;
      return !("number" != type && "symbol" != type && "boolean" != type && null != name && !isArray(name)) || (testRxp.test(name) || !u.test(name) || null != obj && name in Object(obj));
    }
    var isObject = __webpack_require__(1);
    var isArray = __webpack_require__(27);
    /** @type {!RegExp} */
    var u = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    /** @type {!RegExp} */
    var testRxp = /^\w*$/;
    /** @type {function(?, number): ?} */
    module.exports = isKey;
  }, function(mixin, canCreateDiscussions, $parse) {
    var mainCheck = $parse(124);
    /** @type {!RegExp} */
    var tokensRegExp = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    /** @type {!RegExp} */
    var rcamelCase = /\\(\\)?/g;
    var m = mainCheck(function(t) {
      /** @type {!Array} */
      var buf = [];
      return 46 === t.charCodeAt(0) && buf.push(""), t.replace(tokensRegExp, function(msg, method, val, termUri) {
        buf.push(val ? termUri.replace(rcamelCase, "$1") : method || msg);
      }), buf;
    });
    mixin.exports = m;
  }, function(module, canCreateDiscussions, unitToColor) {
    /**
     * @param {!Object} name
     * @return {?}
     */
    function render(name) {
      var result = c(name, function(canCreateDiscussions) {
        return cache.size === MAX_MEMOIZE_SIZE && cache.clear(), canCreateDiscussions;
      });
      var cache = result.cache;
      return result;
    }
    var c = unitToColor(125);
    /** @type {number} */
    var MAX_MEMOIZE_SIZE = 500;
    /** @type {function(!Object): ?} */
    module.exports = render;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Function} n
     * @param {!Function} fn
     * @return {?}
     */
    function memoize(n, fn) {
      if ("function" != typeof n || null != fn && "function" != typeof fn) {
        throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
      }
      /**
       * @return {?}
       */
      var memoized = function() {
        /** @type {!Arguments} */
        var value = arguments;
        var key = fn ? fn.apply(this, value) : value[0];
        var cache = memoized.cache;
        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = n.apply(this, value);
        return memoized.cache = cache.set(key, result) || cache, result;
      };
      return memoized.cache = new (memoize.Cache || MapCache), memoized;
    }
    var MapCache = __webpack_require__(33);
    /** @type {string} */
    var ERR_ACCESSORS_NOT_SUPPORTED = "Expected a function";
    memoize.Cache = MapCache;
    /** @type {function(!Function, !Function): ?} */
    module.exports = memoize;
  }, function(module, canCreateDiscussions, keyGen) {
    /**
     * @param {!Object} value
     * @return {?}
     */
    function parse(value) {
      return null == value ? "" : o(value);
    }
    var o = keyGen(127);
    /** @type {function(!Object): ?} */
    module.exports = parse;
  }, function(candidate, canCreateDiscussions, require) {
    /**
     * @param {?} value
     * @return {?}
     */
    function d(value) {
      if ("string" == typeof value) {
        return value;
      }
      if (prettyPrint(value)) {
        return g(value, d) + "";
      }
      if (isArray(value)) {
        return symbolToString ? symbolToString.call(value) : "";
      }
      /** @type {string} */
      var port = value + "";
      return "0" == port && 1 / value == -INFINITY ? "-0" : port;
    }
    var Symbol = require(7);
    var g = require(30);
    var prettyPrint = require(1);
    var isArray = require(27);
    /** @type {number} */
    var INFINITY = 1 / 0;
    var symbolProto = Symbol ? Symbol.prototype : void 0;
    var symbolToString = symbolProto ? symbolProto.toString : void 0;
    /** @type {function(?): ?} */
    candidate.exports = d;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} o
     * @return {?}
     */
    function n(o) {
      var ob = null == o ? 0 : o.length;
      return ob ? o[ob - 1] : void 0;
    }
    /** @type {function(!Object): ?} */
    module.exports = n;
  }, function(mixin, canCreateDiscussions, fn) {
    /**
     * @param {!Function} name
     * @param {number} url
     * @return {?}
     */
    function m(name, url) {
      return url.length < 2 ? name : next(name, unsubscribe(url, 0, -1));
    }
    var next = fn(130);
    var unsubscribe = fn(131);
    /** @type {function(!Function, number): ?} */
    mixin.exports = m;
  }, function(task, canCreateDiscussions, n) {
    /**
     * @param {!Object} b
     * @param {number} d
     * @return {?}
     */
    function r(b, d) {
      d = m(d, b);
      /** @type {number} */
      var k = 0;
      var l = d.length;
      for (; null != b && k < l;) {
        b = b[i(d[k++])];
      }
      return k && k == l ? b : void 0;
    }
    var m = n(26);
    var i = n(47);
    /** @type {function(!Object, number): ?} */
    task.exports = r;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} a
     * @param {string} i
     * @param {string} b
     * @return {?}
     */
    function n(a, i, b) {
      /** @type {number} */
      var j = -1;
      var h = a.length;
      if (i < 0) {
        i = -i > h ? 0 : h + i;
      }
      b = b > h ? h : b;
      if (b < 0) {
        b = b + h;
      }
      /** @type {number} */
      h = i > b ? 0 : b - i >>> 0;
      /** @type {number} */
      i = i >>> 0;
      /** @type {!Array} */
      var p = Array(h);
      for (; ++j < h;) {
        p[j] = a[j + i];
      }
      return p;
    }
    /** @type {function(!Object, string, string): ?} */
    module.exports = n;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} x
     * @return {?}
     */
    function on(x) {
      return isArray(x) ? void 0 : x;
    }
    var isArray = __webpack_require__(133);
    /** @type {function(!Object): ?} */
    module.exports = on;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} value
     * @return {?}
     */
    function isPlainObject(value) {
      if (!getPrototypeOf(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (null === proto) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return "function" == typeof Ctor && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
    }
    var baseGetTag = __webpack_require__(3);
    var getPrototype = __webpack_require__(23);
    var getPrototypeOf = __webpack_require__(2);
    /** @type {string} */
    var objectTag = "[object Object]";
    var funcProto = Function.prototype;
    var ObjProto = Object.prototype;
    /** @type {function(this:!Function): string} */
    var funcToString = funcProto.toString;
    /** @type {function(this:Object, *): boolean} */
    var hasOwnProperty = ObjProto.hasOwnProperty;
    /** @type {string} */
    var objectCtorString = funcToString.call(Object);
    /** @type {function(!Object): ?} */
    module.exports = isPlainObject;
  }, function(task, canCreateDiscussions, integrate) {
    /**
     * @param {!Object} val
     * @return {?}
     */
    function r(val) {
      return add(on(val, void 0, one), val + "");
    }
    var one = integrate(135);
    var on = integrate(48);
    var add = integrate(49);
    /** @type {function(!Object): ?} */
    task.exports = r;
  }, function(module, canCreateDiscussions, keyGen) {
    /**
     * @param {!Object} o
     * @return {?}
     */
    function validate(o) {
      return (null == o ? 0 : o.length) ? key(o, 1) : [];
    }
    var key = keyGen(136);
    /** @type {function(!Object): ?} */
    module.exports = validate;
  }, function(meta, canCreateDiscussions, parse) {
    /**
     * @param {!Object} el
     * @param {number} a
     * @param {!Object} callback
     * @param {!Function} that
     * @param {!Object} t
     * @return {?}
     */
    function fn(el, a, callback, that, t) {
      /** @type {number} */
      var i = -1;
      var l = el.length;
      if (!callback) {
        callback = baseUri;
      }
      if (!t) {
        /** @type {!Array} */
        t = [];
      }
      for (; ++i < l;) {
        var value = el[i];
        if (a > 0 && callback(value)) {
          if (a > 1) {
            fn(value, a - 1, callback, that, t);
          } else {
            h(t, value);
          }
        } else {
          if (!that) {
            t[t.length] = value;
          }
        }
      }
      return t;
    }
    var h = parse(22);
    var baseUri = parse(137);
    /** @type {function(!Object, number, !Object, !Function, !Object): ?} */
    meta.exports = fn;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} n
     * @return {?}
     */
    function validate(n) {
      return isNaN(n) || isBetween(n) || !!(c && n && n[c]);
    }
    var Symbol = __webpack_require__(7);
    var isBetween = __webpack_require__(37);
    var isNaN = __webpack_require__(1);
    var c = Symbol ? Symbol.isConcatSpreadable : void 0;
    /** @type {function(!Object): ?} */
    module.exports = validate;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Function} t
     * @param {number} d
     * @param {!Object} x
     * @return {?}
     */
    function n(t, d, x) {
      switch(x.length) {
        case 0:
          return t.call(d);
        case 1:
          return t.call(d, x[0]);
        case 2:
          return t.call(d, x[0], x[1]);
        case 3:
          return t.call(d, x[0], x[1], x[2]);
      }
      return t.apply(d, x);
    }
    /** @type {function(!Function, number, !Object): ?} */
    module.exports = n;
  }, function(mixin, canCreateDiscussions, __webpack_require__) {
    var getValue = __webpack_require__(140);
    var defineProperty = __webpack_require__(35);
    var tmp = __webpack_require__(50);
    var m = defineProperty ? function(name, view) {
      return defineProperty(name, "toString", {
        configurable : true,
        enumerable : false,
        value : getValue(view),
        writable : true
      });
    } : tmp;
    mixin.exports = m;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Object} data
     * @return {?}
     */
    function api(data) {
      return function() {
        return data;
      };
    }
    /** @type {function(!Object): ?} */
    module.exports = api;
  }, function(module, canCreateDiscussions) {
    /**
     * @param {!Function} width
     * @return {?}
     */
    function leFunc(width) {
      /** @type {number} */
      var num_summed = 0;
      /** @type {number} */
      var prevT = 0;
      return function() {
        /** @type {number} */
        var currT = now();
        /** @type {number} */
        var dragstocreate = groupsize - (currT - prevT);
        if (prevT = currT, dragstocreate > 0) {
          if (++num_summed >= summands) {
            return arguments[0];
          }
        } else {
          /** @type {number} */
          num_summed = 0;
        }
        return width.apply(void 0, arguments);
      };
    }
    /** @type {number} */
    var summands = 800;
    /** @type {number} */
    var groupsize = 16;
    /** @type {function(): number} */
    var now = Date.now;
    /** @type {function(!Function): ?} */
    module.exports = leFunc;
  }, function(mixin, canCreateDiscussions, require) {
    var extend = require(17);
    var createElement = require(6);
    var balanced = require(143);
    var parseCustomTokens = require(14);
    var parseCustomRules = require(13);
    var cls = require(12);
    var OP = Object.prototype;
    /** @type {function(this:Object, *): boolean} */
    var hasOwn = OP.hasOwnProperty;
    var m = balanced(function(result, context) {
      if (parseCustomRules(context) || parseCustomTokens(context)) {
        return void createElement(context, cls(context), result);
      }
      var key;
      for (key in context) {
        if (hasOwn.call(context, key)) {
          extend(result, key, context[key]);
        }
      }
    });
    mixin.exports = m;
  }, function(module, canCreateDiscussions, __webpack_require__) {
    /**
     * @param {!Object} t
     * @return {?}
     */
    function createAssigner(t) {
      return baseRest(function(obj, arrays) {
        /** @type {number} */
        var i = -1;
        var length = arrays.length;
        var customizer = length > 1 ? arrays[length - 1] : void 0;
        var iteratee = length > 2 ? arrays[2] : void 0;
        /** @type {(!Function|undefined)} */
        customizer = t.length > 3 && "function" == typeof customizer ? (length--, customizer) : void 0;
        if (iteratee && baseDifference(arrays[0], arrays[1], iteratee)) {
          /** @type {(!Function|undefined)} */
          customizer = length < 3 ? void 0 : customizer;
          /** @type {number} */
          length = 1;
        }
        /** @type {!Object} */
        obj = Object(obj);
        for (; ++i < length;) {
          var b = arrays[i];
          if (b) {
            t(obj, b, i, customizer);
          }
        }
        return obj;
      });
    }
    var baseRest = __webpack_require__(144);
    var baseDifference = __webpack_require__(145);
    /** @type {function(!Object): ?} */
    module.exports = createAssigner;
  }, function(candidate, canCreateDiscussions, require) {
    /**
     * @param {!Object} key
     * @param {number} type
     * @return {?}
     */
    function set(key, type) {
      return assert(validate(key, type, message), key + "");
    }
    var message = require(50);
    var validate = require(48);
    var assert = require(49);
    /** @type {function(!Object, number): ?} */
    candidate.exports = set;
  }, function(pkg, canCreateDiscussions, require) {
    /**
     * @param {!Object} elem
     * @param {number} key
     * @param {!Object} data
     * @return {?}
     */
    function index(elem, key, data) {
      if (!verify(data)) {
        return false;
      }
      /** @type {string} */
      var type = typeof key;
      return !!("number" == type ? isArray(data) && debug(key, data.length) : "string" == type && key in data) && $(data[key], elem);
    }
    var $ = require(15);
    var isArray = require(14);
    var debug = require(39);
    var verify = require(5);
    /** @type {function(!Object, number, !Object): ?} */
    pkg.exports = index;
  }, function(module, canCreateDiscussions, bibsection) {
    var ret;
    !function(e) {
      /**
       * @return {undefined}
       */
      function Random() {
      }
      /**
       * @param {!Object} listeners
       * @param {!Function} listener
       * @return {?}
       */
      function indexOfListener(listeners, listener) {
        var i = listeners.length;
        for (; i--;) {
          if (listeners[i].listener === listener) {
            return i;
          }
        }
        return -1;
      }
      /**
       * @param {string} name
       * @return {?}
       */
      function alias(name) {
        return function() {
          return this[name].apply(this, arguments);
        };
      }
      /**
       * @param {!Object} obj
       * @return {?}
       */
      function isFunction(obj) {
        return "function" == typeof obj || obj instanceof RegExp || !(!obj || "object" != typeof obj) && isFunction(obj.listener);
      }
      var proto = Random.prototype;
      var ctx = e.EventEmitter;
      /**
       * @param {(RegExp|string)} evt
       * @return {?}
       */
      proto.getListeners = function(evt) {
        var response;
        var key;
        var events = this._getEvents();
        if (evt instanceof RegExp) {
          response = {};
          for (key in events) {
            if (events.hasOwnProperty(key) && evt.test(key)) {
              response[key] = events[key];
            }
          }
        } else {
          response = events[evt] || (events[evt] = []);
        }
        return response;
      };
      /**
       * @param {!Array} listeners
       * @return {?}
       */
      proto.flattenListeners = function(listeners) {
        var i;
        /** @type {!Array} */
        var flatListeners = [];
        /** @type {number} */
        i = 0;
        for (; i < listeners.length; i = i + 1) {
          flatListeners.push(listeners[i].listener);
        }
        return flatListeners;
      };
      /**
       * @param {string} evt
       * @return {?}
       */
      proto.getListenersAsObject = function(evt) {
        var response;
        var listeners = this.getListeners(evt);
        return listeners instanceof Array && (response = {}, response[evt] = listeners), response || listeners;
      };
      /**
       * @param {string} evt
       * @param {!Function} listener
       * @return {?}
       */
      proto.addListener = function(evt, listener) {
        if (!isFunction(listener)) {
          throw new TypeError("listener must be a function");
        }
        var key;
        var listeners = this.getListenersAsObject(evt);
        /** @type {boolean} */
        var listenerIsWrapped = "object" == typeof listener;
        for (key in listeners) {
          if (listeners.hasOwnProperty(key) && -1 === indexOfListener(listeners[key], listener)) {
            listeners[key].push(listenerIsWrapped ? listener : {
              listener : listener,
              once : false
            });
          }
        }
        return this;
      };
      proto.on = alias("addListener");
      /**
       * @param {string} evt
       * @param {!Function} listener
       * @return {?}
       */
      proto.addOnceListener = function(evt, listener) {
        return this.addListener(evt, {
          listener : listener,
          once : true
        });
      };
      proto.once = alias("addOnceListener");
      /**
       * @param {(RegExp|string)} evt
       * @return {?}
       */
      proto.defineEvent = function(evt) {
        return this.getListeners(evt), this;
      };
      /**
       * @param {!NodeList} evts
       * @return {?}
       */
      proto.defineEvents = function(evts) {
        /** @type {number} */
        var i = 0;
        for (; i < evts.length; i = i + 1) {
          this.defineEvent(evts[i]);
        }
        return this;
      };
      /**
       * @param {string} evt
       * @param {!Function} listener
       * @return {?}
       */
      proto.removeListener = function(evt, listener) {
        var index;
        var key;
        var listeners = this.getListenersAsObject(evt);
        for (key in listeners) {
          if (listeners.hasOwnProperty(key) && -1 !== (index = indexOfListener(listeners[key], listener))) {
            listeners[key].splice(index, 1);
          }
        }
        return this;
      };
      proto.off = alias("removeListener");
      /**
       * @param {!Object} evt
       * @param {!Object} listeners
       * @return {?}
       */
      proto.addListeners = function(evt, listeners) {
        return this.manipulateListeners(false, evt, listeners);
      };
      /**
       * @param {!Object} evt
       * @param {!Object} listeners
       * @return {?}
       */
      proto.removeListeners = function(evt, listeners) {
        return this.manipulateListeners(true, evt, listeners);
      };
      /**
       * @param {boolean} remove
       * @param {!Object} evt
       * @param {!Object} listeners
       * @return {?}
       */
      proto.manipulateListeners = function(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;
        if ("object" != typeof evt || evt instanceof RegExp) {
          i = listeners.length;
          for (; i--;) {
            single.call(this, evt, listeners[i]);
          }
        } else {
          for (i in evt) {
            if (evt.hasOwnProperty(i) && (value = evt[i])) {
              if ("function" == typeof value) {
                single.call(this, i, value);
              } else {
                multiple.call(this, i, value);
              }
            }
          }
        }
        return this;
      };
      /**
       * @param {(RegExp|string)} evt
       * @return {?}
       */
      proto.removeEvent = function(evt) {
        var key;
        /** @type {string} */
        var type = typeof evt;
        var events = this._getEvents();
        if ("string" === type) {
          delete events[evt];
        } else {
          if (evt instanceof RegExp) {
            for (key in events) {
              if (events.hasOwnProperty(key) && evt.test(key)) {
                delete events[key];
              }
            }
          } else {
            delete this._events;
          }
        }
        return this;
      };
      proto.removeAllListeners = alias("removeEvent");
      /**
       * @param {string} evt
       * @param {number} args
       * @return {?}
       */
      proto.emitEvent = function(evt, args) {
        var a;
        var listener;
        var i;
        var key;
        var listeners = this.getListenersAsObject(evt);
        for (key in listeners) {
          if (listeners.hasOwnProperty(key)) {
            a = listeners[key].slice(0);
            /** @type {number} */
            i = 0;
            for (; i < a.length; i++) {
              listener = a[i];
              if (true === listener.once) {
                this.removeListener(evt, listener.listener);
              }
              if (listener.listener.apply(this, args || []) === this._getOnceReturnValue()) {
                this.removeListener(evt, listener.listener);
              }
            }
          }
        }
        return this;
      };
      proto.trigger = alias("emitEvent");
      /**
       * @param {string} evt
       * @return {?}
       */
      proto.emit = function(evt) {
        /** @type {!Array<?>} */
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
      };
      /**
       * @param {?} value
       * @return {?}
       */
      proto.setOnceReturnValue = function(value) {
        return this._onceReturnValue = value, this;
      };
      /**
       * @return {?}
       */
      proto._getOnceReturnValue = function() {
        return !this.hasOwnProperty("_onceReturnValue") || this._onceReturnValue;
      };
      /**
       * @return {?}
       */
      proto._getEvents = function() {
        return this._events || (this._events = {});
      };
      /**
       * @return {?}
       */
      Random.noConflict = function() {
        return e.EventEmitter = ctx, Random;
      };
      if (void 0 !== (ret = function() {
        return Random;
      }.call(e, bibsection, e, module))) {
        module.exports = ret;
      }
    }("undefined" != typeof window ? window : this || {});
  }, function(canCreateDiscussions, F, saveNotifs) {
    /**
     * @param {?} value
     * @return {?}
     */
    function fn(value) {
      return (fn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(exprCode) {
        return typeof exprCode;
      } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      })(value);
    }
    /**
     * @param {!Object} object
     * @return {?}
     */
    function value(object) {
      /** @type {!Array} */
      var e = [];
      var name;
      for (name in object) {
        if (object.hasOwnProperty(name)) {
          var value = object[name];
          /** @type {string} */
          name = encodeURIComponent(name);
          if (true === value) {
            e.push(name);
          } else {
            if (false === value) {
              e.push("!".concat(name));
            } else {
              if (null !== value && "object" === fn(value)) {
                /** @type {string} */
                value = encodeURIComponent(JSON.stringify(value));
                e.push("".concat(name, "=").concat(value));
              } else {
                /** @type {string} */
                value = encodeURIComponent(value);
                e.push("".concat(name, "=").concat(value));
              }
            }
          }
        }
      }
      return e.join("&");
    }
    /** @type {function(!Object): ?} */
    F.a = value;
    saveNotifs(148);
  }, function(canCreateDiscussions, s, n) {
    /**
     * @param {number} value
     * @return {?}
     */
    function v(value) {
      /** @type {!Array} */
      var result = [value / 3600, value / 60 % 60, value % 60];
      /** @type {number} */
      var i = 0;
      for (; i < result.length; i++) {
        /** @type {number} */
        var value = Math.floor(result[i]);
        /** @type {(number|string)} */
        result[i] = value < 10 ? "0".concat(value) : value;
      }
      return result;
    }
    /**
     * @param {undefined} name
     * @return {?}
     */
    function process(name) {
      var a = v(name);
      /** @type {!Array} */
      var spans = ["s", "m", "h"];
      /** @type {string} */
      var s = "";
      a = a.reverse();
      /** @type {number} */
      var i = 0;
      for (; i < a.length; i++) {
        /** @type {string} */
        s = a[i] + spans[i] + s;
      }
      return s.replace(/00(h|m|s)/g, "");
    }
    /** @type {function(undefined): ?} */
    s.a = process;
  }, function(module, gen34_options, __webpack_require__) {
    (function(process, global) {
      !function(addedRenderer, factory) {
        module.exports = factory();
      }(0, function() {
        /**
         * @param {!Object} id
         * @return {?}
         */
        function formatError(id) {
          /** @type {string} */
          var argType = typeof id;
          return null !== id && ("object" === argType || "function" === argType);
        }
        /**
         * @param {!Object} value
         * @return {?}
         */
        function isFunction(value) {
          return "function" == typeof value;
        }
        /**
         * @param {?} fn
         * @return {undefined}
         */
        function setScheduler(fn) {
          setTimeout = fn;
        }
        /**
         * @param {?} asapFn
         * @return {undefined}
         */
        function setAsap(asapFn) {
          asap = asapFn;
        }
        /**
         * @return {?}
         */
        function fetch() {
          return void 0 !== query ? function() {
            query(callback);
          } : next();
        }
        /**
         * @return {?}
         */
        function next() {
          /** @type {function((!Function|null|string), number=, ...*): number} */
          var delay = setTimeout;
          return function() {
            return delay(callback, 1);
          };
        }
        /**
         * @return {undefined}
         */
        function callback() {
          /** @type {number} */
          var i = 0;
          for (; i < lib$rsvp$asap$$len; i = i + 2) {
            (0, lib$rsvp$asap$$queue[i])(lib$rsvp$asap$$queue[i + 1]);
            lib$rsvp$asap$$queue[i] = void 0;
            lib$rsvp$asap$$queue[i + 1] = void 0;
          }
          /** @type {number} */
          lib$rsvp$asap$$len = 0;
        }
        /**
         * @param {!Function} onFulfillment
         * @param {!Function} onRejection
         * @return {?}
         */
        function then(onFulfillment, onRejection) {
          var parent = this;
          var child = new this.constructor(noop);
          if (void 0 === child[PROMISE_ID]) {
            makePromise(child);
          }
          var state = parent._state;
          if (state) {
            var callback = arguments[state - 1];
            asap(function() {
              return invokeCallback(state, child, callback, parent._result);
            });
          } else {
            subscribe(parent, child, onFulfillment, onRejection);
          }
          return child;
        }
        /**
         * @param {!Object} value
         * @return {?}
         */
        function resolve(value) {
          var Promise = this;
          if (value && "object" == typeof value && value.constructor === Promise) {
            return value;
          }
          var promise = new Promise(noop);
          return _resolve(promise, value), promise;
        }
        /**
         * @return {undefined}
         */
        function noop() {
        }
        /**
         * @return {?}
         */
        function selfFulfillment() {
          return new TypeError("You cannot resolve a promise with itself");
        }
        /**
         * @return {?}
         */
        function cannotReturnOwn() {
          return new TypeError("A promises callback cannot return that same promise.");
        }
        /**
         * @param {!Object} promise
         * @return {?}
         */
        function getThen(promise) {
          try {
            return promise.then;
          } catch (fn) {
            return $.error = fn, $;
          }
        }
        /**
         * @param {!Function} then
         * @param {!Object} value
         * @param {!Function} fulfillmentHandler
         * @param {!Function} rejectionHandler
         * @return {?}
         */
        function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
          try {
            then.call(value, fulfillmentHandler, rejectionHandler);
          } catch (e) {
            return e;
          }
        }
        /**
         * @param {!Object} promise
         * @param {!Object} thenable
         * @param {!Object} then
         * @return {undefined}
         */
        function handleForeignThenable(promise, thenable, then) {
          asap(function(promise) {
            /** @type {boolean} */
            var sealed = false;
            var error = tryThen(then, thenable, function(value) {
              if (!sealed) {
                /** @type {boolean} */
                sealed = true;
                if (thenable !== value) {
                  _resolve(promise, value);
                } else {
                  fulfill(promise, value);
                }
              }
            }, function(value) {
              if (!sealed) {
                /** @type {boolean} */
                sealed = true;
                _reject(promise, value);
              }
            }, "Settle: " + (promise._label || " unknown promise"));
            if (!sealed && error) {
              /** @type {boolean} */
              sealed = true;
              _reject(promise, error);
            }
          }, promise);
        }
        /**
         * @param {!Object} promise
         * @param {!Object} thenable
         * @return {undefined}
         */
        function handleOwnThenable(promise, thenable) {
          if (thenable._state === FULFILLED) {
            fulfill(promise, thenable._result);
          } else {
            if (thenable._state === REJECTED) {
              _reject(promise, thenable._result);
            } else {
              subscribe(thenable, void 0, function(value) {
                return _resolve(promise, value);
              }, function(value) {
                return _reject(promise, value);
              });
            }
          }
        }
        /**
         * @param {!Object} promise
         * @param {!Object} maybeThenable
         * @param {!Object} then$$
         * @return {undefined}
         */
        function handleMaybeThenable(promise, maybeThenable, then$$) {
          if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
            handleOwnThenable(promise, maybeThenable);
          } else {
            if (then$$ === $) {
              _reject(promise, $.error);
              /** @type {null} */
              $.error = null;
            } else {
              if (void 0 === then$$) {
                fulfill(promise, maybeThenable);
              } else {
                if (isFunction(then$$)) {
                  handleForeignThenable(promise, maybeThenable, then$$);
                } else {
                  fulfill(promise, maybeThenable);
                }
              }
            }
          }
        }
        /**
         * @param {!Object} promise
         * @param {!Object} value
         * @return {undefined}
         */
        function _resolve(promise, value) {
          if (promise === value) {
            _reject(promise, selfFulfillment());
          } else {
            if (formatError(value)) {
              handleMaybeThenable(promise, value, getThen(value));
            } else {
              fulfill(promise, value);
            }
          }
        }
        /**
         * @param {!Request} promise
         * @return {undefined}
         */
        function publishRejection(promise) {
          if (promise._onerror) {
            promise._onerror(promise._result);
          }
          publish(promise);
        }
        /**
         * @param {!Object} promise
         * @param {!Object} value
         * @return {undefined}
         */
        function fulfill(promise, value) {
          if (promise._state === PENDING) {
            /** @type {!Object} */
            promise._result = value;
            /** @type {number} */
            promise._state = FULFILLED;
            if (0 !== promise._subscribers.length) {
              asap(publish, promise);
            }
          }
        }
        /**
         * @param {!Object} promise
         * @param {!Object} reason
         * @return {undefined}
         */
        function _reject(promise, reason) {
          if (promise._state === PENDING) {
            /** @type {number} */
            promise._state = REJECTED;
            /** @type {!Object} */
            promise._result = reason;
            asap(publishRejection, promise);
          }
        }
        /**
         * @param {!Object} parent
         * @param {!Object} child
         * @param {!Function} onFulfillment
         * @param {!Function} onRejection
         * @return {undefined}
         */
        function subscribe(parent, child, onFulfillment, onRejection) {
          var _subscribers = parent._subscribers;
          var length = _subscribers.length;
          /** @type {null} */
          parent._onerror = null;
          /** @type {!Object} */
          _subscribers[length] = child;
          /** @type {!Function} */
          _subscribers[length + FULFILLED] = onFulfillment;
          /** @type {!Function} */
          _subscribers[length + REJECTED] = onRejection;
          if (0 === length && parent._state) {
            asap(publish, parent);
          }
        }
        /**
         * @param {!Request} promise
         * @return {undefined}
         */
        function publish(promise) {
          var subscribers = promise._subscribers;
          var settled = promise._state;
          if (0 !== subscribers.length) {
            var child = void 0;
            var callback = void 0;
            var detail = promise._result;
            /** @type {number} */
            var i = 0;
            for (; i < subscribers.length; i = i + 3) {
              child = subscribers[i];
              callback = subscribers[i + settled];
              if (child) {
                invokeCallback(settled, child, callback, detail);
              } else {
                callback(detail);
              }
            }
            /** @type {number} */
            promise._subscribers.length = 0;
          }
        }
        /**
         * @param {!Object} callback
         * @param {number} detail
         * @return {?}
         */
        function tryCatch(callback, detail) {
          try {
            return callback(detail);
          } catch (fn) {
            return $.error = fn, $;
          }
        }
        /**
         * @param {number} settled
         * @param {!Object} promise
         * @param {!Object} callback
         * @param {number} detail
         * @return {?}
         */
        function invokeCallback(settled, promise, callback, detail) {
          var hasCallback = isFunction(callback);
          var value = void 0;
          var error = void 0;
          var succeeded = void 0;
          var s = void 0;
          if (hasCallback) {
            if (value = tryCatch(callback, detail), value === $ ? (s = true, error = value.error, value.error = null) : succeeded = true, promise === value) {
              return void _reject(promise, cannotReturnOwn());
            }
          } else {
            /** @type {number} */
            value = detail;
            /** @type {boolean} */
            succeeded = true;
          }
          if (!(promise._state !== PENDING)) {
            if (hasCallback && succeeded) {
              _resolve(promise, value);
            } else {
              if (s) {
                _reject(promise, error);
              } else {
                if (settled === FULFILLED) {
                  fulfill(promise, value);
                } else {
                  if (settled === REJECTED) {
                    _reject(promise, value);
                  }
                }
              }
            }
          }
        }
        /**
         * @param {!Object} promise
         * @param {!Function} callback
         * @return {undefined}
         */
        function each(promise, callback) {
          try {
            callback(function(value) {
              _resolve(promise, value);
            }, function(value) {
              _reject(promise, value);
            });
          } catch (reason) {
            _reject(promise, reason);
          }
        }
        /**
         * @return {?}
         */
        function fakeToken() {
          return id++;
        }
        /**
         * @param {!Object} promise
         * @return {undefined}
         */
        function makePromise(promise) {
          /** @type {number} */
          promise[PROMISE_ID] = id++;
          promise._state = void 0;
          promise._result = void 0;
          /** @type {!Array} */
          promise._subscribers = [];
        }
        /**
         * @return {?}
         */
        function validationError() {
          return new Error("Array Methods must be provided an Array");
        }
        /**
         * @param {?} entries
         * @return {?}
         */
        function all(entries) {
          return (new Enumerator(this, entries)).promise;
        }
        /**
         * @param {!Object} a
         * @return {?}
         */
        function race(a) {
          var c = this;
          return new c(isArray(a) ? function(onFulfillment, reject) {
            var az = a.length;
            /** @type {number} */
            var i = 0;
            for (; i < az; i++) {
              c.resolve(a[i]).then(onFulfillment, reject);
            }
          } : function(canCreateDiscussions, reject) {
            return reject(new TypeError("You must pass an array to race."));
          });
        }
        /**
         * @param {!Object} reason
         * @return {?}
         */
        function reject(reason) {
          var Constructor = this;
          var promise = new Constructor(noop);
          return _reject(promise, reason), promise;
        }
        /**
         * @return {?}
         */
        function splitText() {
          throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
        }
        /**
         * @return {?}
         */
        function getDate() {
          throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
        }
        /**
         * @return {undefined}
         */
        function polyfill() {
          var local = void 0;
          if (void 0 !== global) {
            /** @type {!Object} */
            local = global;
          } else {
            if ("undefined" != typeof self) {
              /** @type {!Window} */
              local = self;
            } else {
              try {
                local = Function("return this")();
              } catch (t) {
                throw new Error("polyfill failed because global object is unavailable in this environment");
              }
            }
          }
          var P = local.Promise;
          if (P) {
            /** @type {null} */
            var r = null;
            try {
              /** @type {string} */
              r = Object.prototype.toString.call(P.resolve());
            } catch (t) {
            }
            if ("[object Promise]" === r && !P.cast) {
              return;
            }
          }
          local.Promise = Promise;
        }
        var _isArray = void 0;
        /** @type {!Function} */
        _isArray = Array.isArray ? Array.isArray : function(signals) {
          return "[object Array]" === Object.prototype.toString.call(signals);
        };
        /** @type {!Function} */
        var isArray = _isArray;
        /** @type {number} */
        var lib$rsvp$asap$$len = 0;
        var query = void 0;
        var setTimeout = void 0;
        /**
         * @param {!Function} callback
         * @param {!Object} arg
         * @return {undefined}
         */
        var asap = function(callback, arg) {
          /** @type {!Function} */
          lib$rsvp$asap$$queue[lib$rsvp$asap$$len] = callback;
          /** @type {!Object} */
          lib$rsvp$asap$$queue[lib$rsvp$asap$$len + 1] = arg;
          if (2 === (lib$rsvp$asap$$len = lib$rsvp$asap$$len + 2)) {
            if (setTimeout) {
              setTimeout(callback);
            } else {
              rawAsap();
            }
          }
        };
        /** @type {(Window|undefined)} */
        var global = "undefined" != typeof window ? window : void 0;
        /** @type {(Window|{})} */
        var scope = global || {};
        var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;
        /** @type {boolean} */
        var queryBoth = "undefined" == typeof self && void 0 !== process && "[object process]" === {}.toString.call(process);
        /** @type {boolean} */
        var rawDataIsList = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel;
        /** @type {!Array} */
        var lib$rsvp$asap$$queue = new Array(1e3);
        var rawAsap = void 0;
        rawAsap = queryBoth ? function() {
          return function() {
            return process.nextTick(callback);
          };
        }() : BrowserMutationObserver ? function() {
          /** @type {number} */
          var t = 0;
          var observer = new BrowserMutationObserver(callback);
          /** @type {!Text} */
          var event = document.createTextNode("");
          return observer.observe(event, {
            characterData : true
          }), function() {
            /** @type {number} */
            event.data = t = ++t % 2;
          };
        }() : rawDataIsList ? function() {
          /** @type {!MessageChannel} */
          var channel = new MessageChannel;
          return channel.port1.onmessage = callback, function() {
            return channel.port2.postMessage(0);
          };
        }() : void 0 === global ? function() {
          try {
            var vertx = Function("return this")().require("vertx");
            return query = vertx.runOnLoop || vertx.runOnContext, fetch();
          } catch (t) {
            return next();
          }
        }() : next();
        /** @type {string} */
        var PROMISE_ID = Math.random().toString(36).substring(2);
        var PENDING = void 0;
        /** @type {number} */
        var FULFILLED = 1;
        /** @type {number} */
        var REJECTED = 2;
        var $ = {
          error : null
        };
        /** @type {number} */
        var id = 0;
        var Enumerator = function() {
          /**
           * @param {!Function} Constructor
           * @param {!Object} input
           * @return {undefined}
           */
          function Enumerator(Constructor, input) {
            /** @type {!Function} */
            this._instanceConstructor = Constructor;
            this.promise = new Constructor(noop);
            if (!this.promise[PROMISE_ID]) {
              makePromise(this.promise);
            }
            if (isArray(input)) {
              this.length = input.length;
              this._remaining = input.length;
              /** @type {!Array} */
              this._result = new Array(this.length);
              if (0 === this.length) {
                fulfill(this.promise, this._result);
              } else {
                this.length = this.length || 0;
                this._enumerate(input);
                if (0 === this._remaining) {
                  fulfill(this.promise, this._result);
                }
              }
            } else {
              _reject(this.promise, validationError());
            }
          }
          return Enumerator.prototype._enumerate = function(input) {
            /** @type {number} */
            var i = 0;
            for (; this._state === PENDING && i < input.length; i++) {
              this._eachEntry(input[i], i);
            }
          }, Enumerator.prototype._eachEntry = function(entry, i) {
            var c = this._instanceConstructor;
            var resolve$$ = c.resolve;
            if (resolve$$ === resolve) {
              var _then = getThen(entry);
              if (_then === then && entry._state !== PENDING) {
                this._settledAt(entry._state, i, entry._result);
              } else {
                if ("function" != typeof _then) {
                  this._remaining--;
                  /** @type {!Object} */
                  this._result[i] = entry;
                } else {
                  if (c === Promise) {
                    var promise = new c(noop);
                    handleMaybeThenable(promise, entry, _then);
                    this._willSettleAt(promise, i);
                  } else {
                    this._willSettleAt(new c(function(resolve$$) {
                      return resolve$$(entry);
                    }), i);
                  }
                }
              }
            } else {
              this._willSettleAt(resolve$$(entry), i);
            }
          }, Enumerator.prototype._settledAt = function(state, i, value) {
            var promise = this.promise;
            if (promise._state === PENDING) {
              this._remaining--;
              if (state === REJECTED) {
                _reject(promise, value);
              } else {
                /** @type {!Object} */
                this._result[i] = value;
              }
            }
            if (0 === this._remaining) {
              fulfill(promise, this._result);
            }
          }, Enumerator.prototype._willSettleAt = function(promise, i) {
            var enumerator = this;
            subscribe(promise, void 0, function(value) {
              return enumerator._settledAt(FULFILLED, i, value);
            }, function(value) {
              return enumerator._settledAt(REJECTED, i, value);
            });
          }, Enumerator;
        }();
        var Promise = function() {
          /**
           * @param {!Function} callback
           * @return {undefined}
           */
          function d(callback) {
            this[PROMISE_ID] = fakeToken();
            this._result = this._state = void 0;
            /** @type {!Array} */
            this._subscribers = [];
            if (noop !== callback) {
              if ("function" != typeof callback) {
                splitText();
              }
              if (this instanceof d) {
                each(this, callback);
              } else {
                getDate();
              }
            }
          }
          return d.prototype.catch = function(onRejection) {
            return this.then(null, onRejection);
          }, d.prototype.finally = function(callback) {
            var object = this;
            var f = object.constructor;
            return object.then(function(canCreateDiscussions) {
              return f.resolve(callback()).then(function() {
                return canCreateDiscussions;
              });
            }, function(canCreateDiscussions) {
              return f.resolve(callback()).then(function() {
                throw canCreateDiscussions;
              });
            });
          }, d;
        }();
        return Promise.prototype.then = then, Promise.all = all, Promise.race = race, Promise.resolve = resolve, Promise.reject = reject, Promise._setScheduler = setScheduler, Promise._setAsap = setAsap, Promise._asap = asap, Promise.polyfill = polyfill, Promise.Promise = Promise, Promise;
      });
    }).call(gen34_options, __webpack_require__(150), __webpack_require__(29));
  }, function(mixin, canCreateDiscussions) {
    /**
     * @return {?}
     */
    function defaultSetTimout() {
      throw new Error("setTimeout has not been defined");
    }
    /**
     * @return {?}
     */
    function defaultClearTimeout() {
      throw new Error("clearTimeout has not been defined");
    }
    /**
     * @param {!Function} fun
     * @return {?}
     */
    function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
        return setTimeout(fun, 0);
      }
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        return cachedSetTimeout = setTimeout, setTimeout(fun, 0);
      }
      try {
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
          return cachedSetTimeout.call(this, fun, 0);
        }
      }
    }
    /**
     * @param {?} marker
     * @return {?}
     */
    function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
        return clearTimeout(marker);
      }
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        return cachedClearTimeout = clearTimeout, clearTimeout(marker);
      }
      try {
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
          return cachedClearTimeout.call(null, marker);
        } catch (e) {
          return cachedClearTimeout.call(this, marker);
        }
      }
    }
    /**
     * @return {undefined}
     */
    function cleanUpNextTick() {
      if (imageSize && currentQueue) {
        /** @type {boolean} */
        imageSize = false;
        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          /** @type {number} */
          queueIndex = -1;
        }
        if (queue.length) {
          drainQueue();
        }
      }
    }
    /**
     * @return {undefined}
     */
    function drainQueue() {
      if (!imageSize) {
        var timeout = runTimeout(cleanUpNextTick);
        /** @type {boolean} */
        imageSize = true;
        var len = queue.length;
        for (; len;) {
          currentQueue = queue;
          /** @type {!Array} */
          queue = [];
          for (; ++queueIndex < len;) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }
          /** @type {number} */
          queueIndex = -1;
          /** @type {number} */
          len = queue.length;
        }
        /** @type {null} */
        currentQueue = null;
        /** @type {boolean} */
        imageSize = false;
        runClearTimeout(timeout);
      }
    }
    /**
     * @param {(Object|string)} fun
     * @param {!Array} array
     * @return {undefined}
     */
    function Item(fun, array) {
      /** @type {(Object|string)} */
      this.fun = fun;
      /** @type {!Array} */
      this.array = array;
    }
    /**
     * @return {undefined}
     */
    function noop() {
    }
    var cachedSetTimeout;
    var cachedClearTimeout;
    var process = mixin.exports = {};
    !function() {
      try {
        /** @type {!Function} */
        cachedSetTimeout = "function" == typeof setTimeout ? setTimeout : defaultSetTimout;
      } catch (t) {
        /** @type {function(): ?} */
        cachedSetTimeout = defaultSetTimout;
      }
      try {
        /** @type {!Function} */
        cachedClearTimeout = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
      } catch (t) {
        /** @type {function(): ?} */
        cachedClearTimeout = defaultClearTimeout;
      }
    }();
    var currentQueue;
    /** @type {!Array} */
    var queue = [];
    /** @type {boolean} */
    var imageSize = false;
    /** @type {number} */
    var queueIndex = -1;
    /**
     * @param {!Function} fun
     * @return {undefined}
     */
    process.nextTick = function(fun) {
      /** @type {!Array} */
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
        /** @type {number} */
        var i = 1;
        for (; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
      }
      queue.push(new Item(fun, args));
      if (!(1 !== queue.length || imageSize)) {
        runTimeout(drainQueue);
      }
    };
    /**
     * @return {undefined}
     */
    Item.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    /** @type {string} */
    process.title = "browser";
    /** @type {boolean} */
    process.browser = true;
    process.env = {};
    /** @type {!Array} */
    process.argv = [];
    /** @type {string} */
    process.version = "";
    process.versions = {};
    /** @type {function(): undefined} */
    process.on = noop;
    /** @type {function(): undefined} */
    process.addListener = noop;
    /** @type {function(): undefined} */
    process.once = noop;
    /** @type {function(): undefined} */
    process.off = noop;
    /** @type {function(): undefined} */
    process.removeListener = noop;
    /** @type {function(): undefined} */
    process.removeAllListeners = noop;
    /** @type {function(): undefined} */
    process.emit = noop;
    /** @type {function(): undefined} */
    process.prependListener = noop;
    /** @type {function(): undefined} */
    process.prependOnceListener = noop;
    /**
     * @param {?} type
     * @return {?}
     */
    process.listeners = function(type) {
      return [];
    };
    /**
     * @param {string} obj
     * @return {?}
     */
    process.binding = function(obj) {
      throw new Error("process.binding is not supported");
    };
    /**
     * @return {?}
     */
    process.cwd = function() {
      return "/";
    };
    /**
     * @param {?} dir
     * @return {?}
     */
    process.chdir = function(dir) {
      throw new Error("process.chdir is not supported");
    };
    /**
     * @return {?}
     */
    process.umask = function() {
      return 0;
    };
  }, , function(canCreateDiscussions, err, __webpack_require__) {
    /**
     * @param {!AudioNode} t
     * @param {!Function} m
     * @return {undefined}
     */
    function r(t, m) {
      if (!(t instanceof m)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    /**
     * @param {!Function} d
     * @param {string} props
     * @return {undefined}
     */
    function t(d, props) {
      /** @type {number} */
      var i = 0;
      for (; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        /** @type {boolean} */
        descriptor.configurable = true;
        if ("value" in descriptor) {
          /** @type {boolean} */
          descriptor.writable = true;
        }
        Object.defineProperty(d, descriptor.key, descriptor);
      }
    }
    /**
     * @param {!Function} p
     * @param {!Function} n
     * @param {!Function} a
     * @return {?}
     */
    function i(p, n, a) {
      return n && t(p.prototype, n), a && t(p, a), p;
    }
    /**
     * @param {!Object} str
     * @return {?}
     */
    function hmsToNPT(str) {
      return __WEBPACK_IMPORTED_MODULE_20_date_fns_min___default()(str) ? document.getElementById(str) : str;
    }
    Object.defineProperty(err, "__esModule", {
      value : true
    });
    __webpack_require__.d(err, "PlayerEmbed", function() {
      return Player;
    });
    var __WEBPACK_IMPORTED_MODULE_20_date_fns_min__ = __webpack_require__(52);
    var __WEBPACK_IMPORTED_MODULE_20_date_fns_min___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20_date_fns_min__);
    var args = __webpack_require__(55);
    var event = __webpack_require__(153);
    var network = __webpack_require__(154);
    var Errors = Object.freeze({
      ABORTED : network.a.ABORTED.code,
      NETWORK : network.a.NETWORK.code,
      DECODE : network.a.DECODE.code,
      FORMAT_NOT_SUPPORTED : network.a.FORMAT_NOT_SUPPORTED.code,
      CONTENT_NOT_AVAILABLE : network.a.CONTENT_NOT_AVAILABLE.code,
      RENDERER_NOT_AVAILABLE : network.a.RENDERER_NOT_AVAILABLE.code
    });
    var Analytics = Object.freeze({
      MINUTE_WATCHED : args.e,
      VIDEO_PLAY : args.o,
      BUFFER_EMPTY : args.a,
      VIDEO_ERROR : args.p,
      N_SECOND_PLAY : args.f
    });
    var d = Object.freeze({
      TRANSITION_TO_RECOMMENDED_VOD : args.n
    });
    var Player = function() {
      /**
       * @param {undefined} start
       * @param {?} state
       * @return {undefined}
       */
      function t(start, state) {
        r(this, t);
        this._bridge = new args.q(hmsToNPT(start), state);
      }
      return i(t, [{
        key : "play",
        value : function() {
          this._bridge.callPlayerMethod(args.u);
        }
      }, {
        key : "pause",
        value : function() {
          this._bridge.callPlayerMethod(args.t);
        }
      }, {
        key : "seek",
        value : function(value) {
          this._bridge.callPlayerMethod(args.v, value);
        }
      }, {
        key : "setVolume",
        value : function(value) {
          this._bridge.callPlayerMethod(args.Q, value);
        }
      }, {
        key : "setTheatre",
        value : function(value) {
          this._bridge.callPlayerMethod(args.M, value);
        }
      }, {
        key : "setAutoplay",
        value : function(value) {
          this._bridge.callPlayerMethod(args.w, value);
        }
      }, {
        key : "setFullscreen",
        value : function(value) {
          this._bridge.callPlayerMethod(args.F, value);
        }
      }, {
        key : "setMuted",
        value : function(value) {
          this._bridge.callPlayerMethod(args.J, value);
        }
      }, {
        key : "setChannel",
        value : function(value) {
          this._bridge.callPlayerMethod(args.z, value);
        }
      }, {
        key : "setChannelId",
        value : function(value) {
          this._bridge.callPlayerMethod(args.A, value);
        }
      }, {
        key : "setCollection",
        value : function(value) {
          var type = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
          var position = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "";
          this._bridge.callPlayerMethod(args.C, value, type, position);
        }
      }, {
        key : "setVideo",
        value : function(value) {
          var type = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
          this._bridge.callPlayerMethod(args.O, value, type);
        }
      }, {
        key : "setContent",
        value : function(data) {
          var msg = data.contentId;
          var customerId = data.customerId;
          this._bridge.callPlayerMethod(args.D, msg, customerId);
        }
      }, {
        key : "setClip",
        value : function(value) {
          this._bridge.callPlayerMethod(args.B, value);
        }
      }, {
        key : "setEditClip",
        value : function(value) {
          this._bridge.callPlayerMethod(args.E, value);
        }
      }, {
        key : "setVideoSource",
        value : function(value) {
          this._bridge.callPlayerMethod(args.P, value);
        }
      }, {
        key : "setQuality",
        value : function(value) {
          this._bridge.callPlayerMethod(args.L, value);
        }
      }, {
        key : "setWidth",
        value : function(right) {
          this._bridge.setWidth(right);
        }
      }, {
        key : "setHeight",
        value : function(data) {
          this._bridge.setHeight(data);
        }
      }, {
        key : "setMiniPlayerMode",
        value : function(value) {
          this._bridge.callPlayerMethod(args.I, value);
        }
      }, {
        key : "setTrackingProperties",
        value : function(value) {
          if (Object(event.a)(window.location.href)) {
            this._bridge.callPlayerMethod(args.N, value);
          }
        }
      }, {
        key : "setPlayerType",
        value : function(value) {
          this._bridge.callPlayerMethod(args.K, value);
        }
      }, {
        key : "setLiveLowLatencyEnabled",
        value : function(value) {
          this._bridge.callPlayerMethod(args.G, value);
        }
      }, {
        key : "setLiveMaxLatency",
        value : function(value) {
          this._bridge.callPlayerMethod(args.H, value);
        }
      }, {
        key : "setAutoMaxVideoSize",
        value : function(value, type) {
          this._bridge.callPlayerMethod(args.x, value, type);
        }
      }, {
        key : "showPlayerControls",
        value : function(value) {
          this._bridge.callPlayerMethod(args.R, value);
        }
      }, {
        key : "addEventListener",
        value : function(topic, value) {
          this._bridge.addEventListener(topic, value);
        }
      }, {
        key : "removeEventListener",
        value : function(listener, fnName) {
          this._bridge.removeEventListener(listener, fnName);
        }
      }, {
        key : "enableCaptions",
        value : function() {
          this._bridge.callPlayerMethod(args.s);
        }
      }, {
        key : "disableCaptions",
        value : function() {
          this._bridge.callPlayerMethod(args.r);
        }
      }, {
        key : "setCaptionSize",
        value : function(value) {
          this._bridge.callPlayerMethod(args.y, value);
        }
      }, {
        key : "getContentId",
        value : function() {
          return this._bridge.getStoreState().stream.contentId;
        }
      }, {
        key : "getChannel",
        value : function() {
          return this._bridge.getPlayerState().channelName;
        }
      }, {
        key : "getChannelId",
        value : function() {
          return this._bridge.getPlayerState().channelId;
        }
      }, {
        key : "getCurrentTime",
        value : function() {
          return this._bridge.getPlayerState().currentTime;
        }
      }, {
        key : "getCustomerId",
        value : function() {
          return this._bridge.getStoreState().stream.customerId;
        }
      }, {
        key : "getDuration",
        value : function() {
          return this._bridge.getPlayerState().duration;
        }
      }, {
        key : "getEnded",
        value : function() {
          return this._bridge.getPlayerState().playback === args.S;
        }
      }, {
        key : "getMuted",
        value : function() {
          return this._bridge.getPlayerState().muted;
        }
      }, {
        key : "getPlaybackStats",
        value : function() {
          return this._bridge.getStoreState().stats.videoStats;
        }
      }, {
        key : "getPlaySessionId",
        value : function() {
          return this._bridge.getStoreState().playSessionId;
        }
      }, {
        key : "isMatureChannel",
        value : function() {
          return this._bridge.getStoreState().mature;
        }
      }, {
        key : "isPaused",
        value : function() {
          return this._bridge.getPlayerState().playback === args.T;
        }
      }, {
        key : "getQuality",
        value : function() {
          return this._bridge.getPlayerState().quality;
        }
      }, {
        key : "getQualities",
        value : function() {
          return this._bridge.getPlayerState().qualitiesAvailable;
        }
      }, {
        key : "getViewers",
        value : function() {
          return this._bridge.getStoreState().viewercount;
        }
      }, {
        key : "getVideo",
        value : function() {
          return this._bridge.getPlayerState().videoID;
        }
      }, {
        key : "getVolume",
        value : function() {
          return this._bridge.getPlayerState().volume;
        }
      }, {
        key : "getAutoplay",
        value : function() {
          return this._bridge.getPlayerState().autoplay;
        }
      }, {
        key : "getTheatre",
        value : function() {
          return this._bridge.getStoreState().screenMode.isTheatreMode;
        }
      }, {
        key : "getFullscreen",
        value : function() {
          return this._bridge.getStoreState().screenMode.isFullScreen;
        }
      }, {
        key : "getFullscreenEnabled",
        value : function() {
          return this._bridge.getStoreState().screenMode.canFullScreen;
        }
      }, {
        key : "getSessionInfo",
        value : function() {
          return {
            broadcastId : this._bridge.getStoreState().broadcastId,
            playSessionId : this._bridge.getStoreState().playSessionId
          };
        }
      }, {
        key : "getCaptionsAvailable",
        value : function() {
          return this._bridge.getStoreState().captions.available;
        }
      }, {
        key : "_addPlayerStateListener",
        value : function(data) {
          this._bridge.addPlayerStateListener(data);
        }
      }, {
        key : "_removePlayerStateListener",
        value : function(data) {
          this._bridge.removePlayerStateListener(data);
        }
      }, {
        key : "destroy",
        value : function() {
          this._bridge.destroy();
        }
      }], [{
        key : "READY",
        get : function() {
          return args.m;
        }
      }, {
        key : "PLAY",
        get : function() {
          return args.j;
        }
      }, {
        key : "PLAYING",
        get : function() {
          return args.l;
        }
      }, {
        key : "PAUSE",
        get : function() {
          return args.i;
        }
      }, {
        key : "ENDED",
        get : function() {
          return args.c;
        }
      }, {
        key : "ONLINE",
        get : function() {
          return args.h;
        }
      }, {
        key : "OFFLINE",
        get : function() {
          return args.g;
        }
      }, {
        key : "ERROR",
        get : function() {
          return args.d;
        }
      }, {
        key : "CAPTIONS",
        get : function() {
          return args.b;
        }
      }, {
        key : "PLAYBACK_BLOCKED",
        get : function() {
          return args.k;
        }
      }]), t;
    }();
    window.Twitch = window.Twitch || {};
    window.Twitch.Player = Player;
    window.Twitch.Analytics = Analytics;
    window.Twitch.Errors = Errors;
    window.Twitch.EmbedEvents = d;
  }, function(canCreateDiscussions, bridge, $) {
    /**
     * @return {?}
     */
    function update() {
      return window.self !== window.parent ? document.referrer : window.location.href;
    }
    /**
     * @return {?}
     */
    function action() {
      var scanDoc = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : update();
      var result = Object(self.a)(scanDoc);
      var m = result.host.split(".").slice(-2).join(".");
      return m === lch || m === hcl;
    }
    /** @type {function(): ?} */
    bridge.a = action;
    var self = $(51);
    /** @type {string} */
    var lch = "twitch.tv";
    /** @type {string} */
    var hcl = "twitch.tech";
  }, function(canCreateDiscussions, p, n) {
    var opacity = Object.freeze({
      ABORTED : {
        code : 1E3,
        message : "The video download was cancelled. Please try again."
      },
      NETWORK : {
        code : 2E3,
        message : "There was a network error. Please try again."
      },
      CCU_CAP_REACHED : {
        code : 2001,
        message : "An error occurred. Please try again."
      },
      DECODE : {
        code : 3E3,
        message : "Your browser encountered an error while decoding the video."
      },
      FORMAT_NOT_SUPPORTED : {
        code : 4E3,
        message : "This video is either unavailable or not supported in this browser."
      },
      CONTENT_NOT_AVAILABLE : {
        code : 5E3,
        message : "This video is unavailable."
      },
      RENDERER_NOT_AVAILABLE : {
        code : 6E3,
        message : "Your browser does not support playback of this video."
      },
      DRM_GEOBLOCKED : {
        code : 7E3,
        message : "This premium content is not available in your region."
      },
      DRM_UNSUPPORTED_DEVICE : {
        code : 7001,
        message : "Your device does not support playback of this premium content. Please try a different device."
      },
      DRM_UNBLOCKER : {
        code : 7002,
        message : "A proxy or unblocker has been detected. This premium content will not be available to you while it is in use."
      },
      DRM_CELLULAR_NETWORK_PROHIBITED : {
        code : 7003,
        message : "Please connect to a Wi-Fi network to watch this premium content."
      },
      DRM_SAFARI_UNSUPPORTED_DEVICE : {
        code : 7004,
        message : "Safari is not currently supported for this stream. Please try Chrome or Firefox."
      }
    });
    p.a = opacity;
  }]);
});
