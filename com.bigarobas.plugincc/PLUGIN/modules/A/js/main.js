class ModuleA extends Module {
    constructor (id,name) {
        super(id,"Module A");
    }

    init () {
        super.init();
        this.bridge = new JSXBridge(this,"ModuleA");
        var _self = this;
        this.bridge.addBridgeEventListener("TEST",
            function (event) {
                alert( _self.bridge.getContext() + " : " + event.context);
                alert( event.data.a + " , " + event.data.b);  
            } 
        );

        $("#btn_open_debug").click(function () {
            ENV.openDebugUrl();
            var event = _self.bridge.createBridgeEvent("TEST",{a:"module A",b:"rien"},"both");
            _self.bridge.dispatchBridgeEvent(event);
        });
    }

    start () {
        super.start();
    }
}

module.exports = ModuleA;