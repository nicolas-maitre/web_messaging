Array.prototype.remove = function(value){
    var valIndex = this.indexOf(value);
    if(valIndex != -1){
        this.splice(valIndex, 1);
        this.remove(value);
    }
    return this
}
Array.prototype.without = function(value){
    var array = [...this];
    return array.remove(value);
}

var Utils = {};
module.exports = Utils;