class ModuleB extends Module {
    constructor (id,name) {
        super(id,"Module B");
    }

    init () {
        super.init();
        $("#btn_test_2").click(function () {
            CSHelper.evaluate('ModuleB.test()');
        });
    }

    start () {
        super.start();
    }

    power() {
        DEBUG.dispatch("POWER B");
    }
}

module.exports = ModuleB;

/*
//ES5 VERSION

function ModuleB (id,name) {
    Module.call(this,id,name);
}

ModuleB.prototype = Object.create(Module.prototype);
ModuleB.prototype.constructor = ModuleB;
ModuleB.prototype.init = function() {
    $("#btn_test_2").click(function () {
        CSHelper.evaluate('ModuleB.test()');
    });
}

ModuleB.prototype.power = function () {
    DEBUG.dispatch("POWER B");
}

module.exports = ModuleB;

*/