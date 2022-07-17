"use strict";
var definedKeys = require("./../utils/definedKeys");
var interceptors = require('./../helpers/interceptors');
function createCORSRequest(config) {
    var method = config.method, mainURL = config.mainURL;
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, mainURL, true);
    }
    else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, mainURL);
    }
    else {
        // CORS not supported.
        xhr = null;
        throw new Error('CORS not supported');
    }
    if (config.signal) {
        if (config.signal instanceof Object) {
            config.signal.abort = xhr.abort.bind(xhr);
        }
        else if (config.signal instanceof AbortController) {
            config.signal = signal;
        }
    }
    return xhr;
}
function xhr(config, interceptorsList) {
    var _mainconfig = config;
    function mainInterceptor(isError, response, xhttp, callback) {
        interceptors(interceptorsList.response, {
            isError: isError,
            response: response,
            xhttp: xhttp,
            config: _mainconfig
        }, callback);
    }
    var onSuccess = function (res, xhttp, resolve) {
        mainInterceptor(false, res, xhttp, function () {
            if (_mainconfig.callback) {
                _mainconfig.callback(null, res, xhttp);
            }
            if (_mainconfig.onSuccess) {
                _mainconfig.onSuccess(res, xhttp);
            }
            resolve(res, xhttp);
        });
    };
    var onError = function (e, xhttp, reject) {
        mainInterceptor(true, e, xhttp, function () {
            if (_mainconfig.callback) {
                _mainconfig.callback(e, null, xhttp);
            }
            if (_mainconfig.onError) {
                _mainconfig.onError(e, xhttp);
            }
            reject(e);
        });
    };
    var promise = new Promise(function (resolve, reject) {
        interceptors(interceptorsList.request, config, function (config) {
            _mainconfig = config;
            var xhttp = createCORSRequest(config);
            var _loop_1 = function (key) {
                if (definedKeys.includes(key))
                    return "continue";
                if (xhttp[key] !== undefined) {
                    xhttp[key] = config[key] instanceof Function ? function () {
                        config[key].call(this, xhttp);
                    } : config[key];
                }
            };
            for (var key in config) {
                _loop_1(key);
            }
            // set headers
            for (var header in config.headers) {
                xhttp.setRequestHeader(header, config.headers[header]);
            }
            var data = config.data || undefined;
            xhttp.addEventListener('readystatechange', function () {
                if (xhttp.readyState === xhttp.DONE) {
                    if (xhttp.status === 200) {
                        var res = xhttp.response;
                        if (xhttp.getResponseHeader('Content-Type').indexOf('application/json') > -1) {
                            res = JSON.parse(xhttp.response);
                        }
                        else if (config.responseType === 'json') {
                            try {
                                res = JSON.parse(xhttp.response);
                            }
                            catch (e) {
                                onError(e, xhttp, reject);
                            }
                        }
                        onSuccess(res, xhttp, resolve);
                    }
                    else if (xhttp.status === 401) {
                        onError(new Error('Unauthorized'), xhttp, reject);
                    }
                    else if (xhttp.status === 0) { // cancel request
                        onError(new Error('Request canceled'), xhttp, reject);
                    }
                    else {
                        onError(new Error(xhttp.statusText), xhttp, reject);
                    }
                }
            });
            xhttp.send(data instanceof FormData ? data :
                data instanceof Blob ? data :
                    data instanceof Object ? JSON.stringify(data) :
                        data);
        });
    });
    return (config.callback || (config.onError || config.onSuccess) ?
        promise.then(function (res) { return res; })["catch"](function (e) { return e; })
        :
            promise);
}
module.exports = xhr;
//# sourceMappingURL=xhr.js.map