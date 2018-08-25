function Module(id,name) {
    this.id = id;
    this.name = (!name) ? "MODULE" : name;
}
  
Module.prototype.test = function() {
    DEBUG.channel("module").log(this.name + " : "+this.id);
}

Module.prototype.init =function () {
    DEBUG.channel("module").log(this.name + " : "+this.id + " init");
}

Module.prototype.start =function () {
    DEBUG.channel("module").log(this.name + " : "+this.id + " start");
}


module.exports = Module;