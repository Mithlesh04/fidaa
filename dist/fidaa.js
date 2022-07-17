"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// const { FidaaConfig, FidaaCallback, FidaaRequestConfig } = require("../index")
var FidaaRequestMethods = require("./utils/requestMethods");
var mergeConfig = require("./utils/mergeConfig");
var xhr = require("./request/xhr");
function Fidaa(firstParam, callback) {
    var config = {};
    var defaultUrl = "";
    if ('object' === typeof firstParam) {
        config = firstParam;
    }
    else if ('string' === typeof firstParam) {
        defaultUrl = firstParam;
    }
    var _a = config.url, url = _a === void 0 ? defaultUrl : _a, _b = config.method, method = _b === void 0 ? "get" : _b, restConfig = __rest(config, ["url", "method"]);
    return Fidaa.prototype.request(__assign(__assign({ url: url, method: method }, restConfig), callback && { callback: callback }));
}
Fidaa.interceptors = {
    request: {},
    response: {}
};
// main request methods
Fidaa.prototype.request = function request(config) {
    return xhr(mergeConfig(config), Fidaa.interceptors);
};
var _loop_1 = function (method) {
    Fidaa[method] = function httpMethod(url, config, callback) {
        return this.prototype.request(__assign(__assign({ callback: callback }, config), { method: method, url: url }));
    };
};
// other methods
for (var _i = 0, FidaaRequestMethods_1 = FidaaRequestMethods; _i < FidaaRequestMethods_1.length; _i++) {
    var method = FidaaRequestMethods_1[_i];
    _loop_1(method);
}
module.exports = Fidaa;
//# sourceMappingURL=fidaa.js.map