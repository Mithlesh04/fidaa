"use strict";
module.exports = function combineURLs(baseURL, relativeURL) {
    if (baseURL === void 0) { baseURL = ''; }
    if (relativeURL === void 0) { relativeURL = ''; }
    return (baseURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : relativeURL);
};
//# sourceMappingURL=combineURLs.js.map