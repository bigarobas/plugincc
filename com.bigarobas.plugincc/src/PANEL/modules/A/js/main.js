class ModuleA extends Module {
    constructor (id,name) {
        super(id,"Module A");
    }

    init () {
        super.init();
        var _self = this;
        $("#btn_open_debug").click(function () {
            ENV.openDebugUrl();
            _self.dispatch("ModuleA.TEST");

        });
    }

    start () {
        super.start();
    }
}

module.exports = ModuleA;

/*
//ES5 VERSION

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
*/
