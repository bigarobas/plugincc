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