"use strict";
function interceptors(obj, config, cb) {
    if (cb === void 0) { cb = function (_) { return null; }; }
    var fun = [], funLength = 0;
    for (var key in obj) {
        if (!(obj[key] instanceof Function)) {
            console.error('interceptors must be function = ', key);
            continue;
        }
        funLength++;
        fun.push(obj[key]);
    }
    function main(index) {
        fun[index](config, function (newConfig) {
            if (newConfig === undefined) {
                throw new Error('interceptor return undefined');
            }
            config = newConfig;
            if (index + 1 < funLength) {
                main(index + 1);
            }
            else {
                cb(config);
            }
        });
    }
    if (fun.length) {
        main(0);
    }
    else {
        cb(config);
    }
}
module.exports = interceptors;
//# sourceMappingURL=interceptors.js.map