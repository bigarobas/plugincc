function ModuleB (id,name) {
    Module.call(this,id,name);
}

ModuleB.prototype = Object.create(Module.prototype);
ModuleB.prototype.constructor = ModuleB;
ModuleB.prototype.init = function() {
    $("#btn_test_2").click(function () {
        DEBUG.dispatch("TEST B");
        CSHelper.evaluate('ModuleB.test()');
    });
}

ModuleB.prototype.power = function () {
    DEBUG.dispatch("POWER B");
}

module.exports = ModuleB;