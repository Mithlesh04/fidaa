
function interceptors(obj,config,cb=_=>null){

    var fun = [], funLength = 0;
    for(let key in obj){
        if(!(obj[key] instanceof Function)){
            console.error('interceptors must be function = ', key)
            continue;
        }
        funLength++;
        fun.push(obj[key])
    }


    function main(index) {
        fun[index](config, (newConfig) => {
            if (newConfig === undefined) {
                throw new Error('interceptor return undefined')
            }
            config = newConfig;

            if (index + 1 < funLength) {
                main(index + 1)
            } else {
                cb(config)
            }
        })

    }

    if(fun.length){
        main(0)
    }else{
        cb(config)
    }
   
    
}

module.exports = interceptors;