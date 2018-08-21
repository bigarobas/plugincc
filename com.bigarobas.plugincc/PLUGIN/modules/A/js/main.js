class ModuleA extends Module {
    constructor (id,name) {
        super(id,"Module A");
    }

    init () {
        super.init();
        $("#btn_test").click(function () {
            DEBUG.dispatch("TEST A");
            CSHelper.evaluate('ModuleA.test()');
        });
    }

    start () {
        super.start();
    }
}

module.exports = ModuleA;