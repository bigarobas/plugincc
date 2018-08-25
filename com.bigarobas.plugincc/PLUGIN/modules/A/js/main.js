class ModuleA extends Module {
    constructor (id,name) {
        super(id,"Module A");
    }

    init () {
        super.init();
        $("#btn_open_debug").click(function () {
            ENV.openDebugUrl();
        });
    }

    start () {
        super.start();
    }
}

module.exports = ModuleA;