"use strict";
var combineURLs = require("./../helpers/combineURLs");
function createConfig(config) {
    if (config === void 0) { config = {}; }
    config.mainURL = combineURLs(config.baseURL, config.url);
    // create url params
    if (config.params && 'object' === typeof config.params) {
        var prms = Object.keys(config.params).map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(config.params[key]);
        }).join('&');
        // check if url has query string
        if (config.mainURL.indexOf('?') > -1) {
            config.mainURL += '&' + prms;
        }
        else {
            config.mainURL += '?' + prms;
        }
    }
    // set headers
    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    if (config.data instanceof FormData) {
        headers['Content-Type'] = 'multipart/form-data';
    }
    else if (config.data instanceof Blob) {
        headers['Content-Type'] = 'application/octet-stream';
    }
    else if (config.data instanceof Object) {
        headers['Content-Type'] = 'application/json';
    }
    else if (config.data) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if (config.headers instanceof Object) {
        for (var header in headers) {
            if (!config.headers.hasOwnProperty(header)) {
                config.headers[header] = headers[header];
            }
        }
    }
    else {
        config.headers = headers;
    }
    return config;
}
module.exports = createConfig;
//# sourceMappingURL=mergeConfig.js.map