function Module(id,name) {
    this.id = id;
    this.name = (!name) ? "MODULE" : name;
}
  
Module.prototype.test = function() {
    DEBUG.log (this.name + " : "+this.id);
}

Module.prototype.init =function () {
    DEBUG.log (this.name + " : "+this.id + " init");
}

Module.prototype.start =function () {
    DEBUG.log (this.name + " : "+this.id + " start");
}


module.exports = Module;