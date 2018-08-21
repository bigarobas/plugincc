function ModuleA (id,name) {
    Module.call(this,id,name);
}

ModuleA.prototype = Object.create(Module.prototype);
ModuleA.prototype.constructor = ModuleA;
ModuleA.prototype.init = function() {
    $("#btn_test").click(function () {
        DEBUG.dispatch("TEST A");
        CSHelper.evaluate('ModuleA.test()');
    });
}

module.exports = ModuleA;