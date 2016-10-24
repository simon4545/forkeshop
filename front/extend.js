var path = require('path');
var appDir = path.dirname(require.main.filename);

function merge(dest, src, redefine) {
    if (!dest) {
        throw new TypeError('argument dest is required')
    }

    if (!src) {
        throw new TypeError('argument src is required')
    }

    if (redefine === undefined) {
        redefine = true
    }

    Object.getOwnPropertyNames(src).forEach(function forEachOwnPropertyName(name) {
        if (!redefine && hasOwnProperty.call(dest, name)) {
            return
        }

        var descriptor = Object.getOwnPropertyDescriptor(src, name)
        Object.defineProperty(dest, name, descriptor)
    })

    return dest
}

module.exports=function(express){
    if(!express){
        throw new Exception('express object can not be null');
    }
    merge(express,{
        controller:function(controller){
            var _path=path.join(BASEPATH,'controller',this.controllerBase?this.controllerBase:'',controller);
            return require(_path);
        },
        model:function(model){
            var _path=path.join(BASEPATH,'models',model);
            return require(_path);
        },
        lib:function(lib){
            var _path=path.join(BASEPATH,'controller',this.controllerBase?this.controllerBase:'',controller);
            return require(_path);
        }
    });
    return express;
}