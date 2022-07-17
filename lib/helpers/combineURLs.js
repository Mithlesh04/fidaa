module.exports = function combineURLs(baseURL='', relativeURL='') {
    return(
      baseURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : relativeURL
    )
  };
  