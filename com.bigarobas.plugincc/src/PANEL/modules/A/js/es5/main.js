function ModuleA (id,name) {
    Module.call(this,id,name);
}

ModuleA.prototype = Object.create(Module.prototype);
ModuleA.prototype.constructor = ModuleA;
ModuleA.prototype.init = function() {
    var _self = this;
    $("#btn_open_debug").click(function () {
        ENV.openDebugUrl();
        _self.dispatch("ModuleA.TEST");
    });
}

module.exports = ModuleA;