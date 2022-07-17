// const { FidaaConfig, FidaaCallback, FidaaRequestConfig } = require("../index")
const FidaaRequestMethods = require("./utils/requestMethods");
const mergeConfig = require("./utils/mergeConfig");
const xhr = require("./request/xhr");



function Fidaa( firstParam, callback) {

    var config = {}
    var defaultUrl = ""

    if('object' === typeof firstParam){
        config = firstParam
    }else if('string' === typeof firstParam){
        defaultUrl = firstParam
    }

    const { url = defaultUrl, method = "get", ...restConfig } = config
    
    return Fidaa.prototype.request({
        url,
        method,
        ...restConfig,
        ...callback && { callback }
    })
}

Fidaa.interceptors = {
    request: {},
    response: {}
}


// main request methods
Fidaa.prototype.request = function request(config){
    return xhr(mergeConfig(config),Fidaa.interceptors);
}


// other methods
for(let method of FidaaRequestMethods){
    Fidaa[method] = function httpMethod(
                url,
                config, 
                callback
            ) {
            return this.prototype.request({
                callback,
                ...config,
                method,
                url,
            });
        }

}


module.exports = Fidaa;