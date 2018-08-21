class ModuleB extends Module {
    constructor (id,name) {
        super(id,"Module B");
    }

    init () {
        super.init();
        $("#btn_test_2").click(function () {
            DEBUG.dispatch("TEST B");
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