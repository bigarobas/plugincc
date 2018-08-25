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