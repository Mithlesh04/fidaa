const definedKeys = require("./../utils/definedKeys");
const interceptors = require('./../helpers/interceptors')

function createCORSRequest(config) {
    var { method, mainURL } = config
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, mainURL, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, mainURL);
    } else {
        // CORS not supported.
        xhr = null;
        throw new Error('CORS not supported')
    }

    if (config.signal) {
        if (config.signal instanceof Object) {
            config.signal.abort = xhr.abort.bind(xhr)
        }
        else if (config.signal instanceof AbortController) {
            config.signal = signal
        }
    }

    return xhr;
}


function xhr(config, interceptorsList) {
    var _mainconfig = config

    function mainInterceptor(
        isError, response, xhttp, callback
    ) {
        interceptors(
            interceptorsList.response,
            {
                isError,
                response, // this can be success data or error data
                xhttp,
                config: _mainconfig
            },
            callback
        )
        
    }

    const onSuccess = (res, xhttp, resolve) => {
        mainInterceptor(
            false,
            res, 
            xhttp,
            ()=>{
                if (_mainconfig.callback) {
                    _mainconfig.callback(null, res, xhttp)
                }
                if (_mainconfig.onSuccess) {
                    _mainconfig.onSuccess(res, xhttp)
                }
                resolve(res, xhttp)
            }
        )
        
    }

    const onError = (e, xhttp, reject) => {
        mainInterceptor(
            true,
            e,
            xhttp,
            () => {
                if (_mainconfig.callback) {
                    _mainconfig.callback(e, null, xhttp)
                }
                if (_mainconfig.onError) {
                    _mainconfig.onError(e, xhttp)
                }
                reject(e)
            })
    }

    const promise = new Promise((resolve, reject) => {
        interceptors(
            interceptorsList.request,
            config,
            (config) => {
                _mainconfig = config
                const xhttp = createCORSRequest(config);

                for (let key in config) {
                    if (definedKeys.includes(key)) continue;
                    if (xhttp[key] !== undefined) {
                        xhttp[key] = config[key] instanceof Function ? function () {
                            config[key].call(this, xhttp)
                        } : config[key]
                    }
                }

                // set headers
                for (let header in config.headers) {
                    xhttp.setRequestHeader(header, config.headers[header])
                }

                const data = config.data || undefined;


                xhttp.addEventListener('readystatechange', () => {
                    if (xhttp.readyState === xhttp.DONE) {
                        if (xhttp.status === 200) {

                            var res = xhttp.response

                            if (xhttp.getResponseHeader('Content-Type').indexOf('application/json') > -1) {
                                res = JSON.parse(xhttp.response)
                            } else if (config.responseType === 'json') {
                                try {
                                    res = JSON.parse(xhttp.response)
                                } catch (e) {
                                    onError(
                                        e,
                                        xhttp,
                                        reject
                                    )
                                }
                            }

                            onSuccess(res, xhttp, resolve)
                        }
                        else if (xhttp.status === 401) {
                            onError(
                                new Error('Unauthorized'),
                                xhttp,
                                reject
                            )
                        }
                        else if (xhttp.status === 0) { // cancel request
                            onError(
                                new Error('Request canceled'),
                                xhttp,
                                reject
                            )
                        }
                        else {
                            onError(
                                new Error(xhttp.statusText),
                                xhttp,
                                reject
                            )
                        }

                    }
                })

                    xhttp.send(
                        data instanceof FormData ? data :
                            data instanceof Blob ? data :
                                data instanceof Object ? JSON.stringify(data) :
                                    data
                    )
                

            }
        )

    })

    return (
        config.callback || (config.onError || config.onSuccess) ?
            promise.then(res => res).catch(e => e)
            :
            promise
    )


}


module.exports = xhr;