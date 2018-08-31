CORE.addBridgeEventListener("CORE.ENV.READY",onCoreEventHandler);
CORE.addBridgeEventListener("CORE.DEBUGGER.READY",onCoreEventHandler);
CORE.addBridgeEventListener("CORE.CONFIG.READY",onCoreEventHandler);
CORE.addBridgeEventListener("CORE.INCLUDES.READY",onCoreEventHandler);
CORE.addBridgeEventListener("CORE.MODULES.READY",onCoreEventHandler);
CORE.addBridgeEventListener("CORE.READY",onCoreEventHandler);

CORE.start();

function onCoreEventHandler(event) {
    switch(event.type) {
        case "CORE.ENV.READY":
            ENV.openDebugUrl();
            break;
        case "CORE.DEBUGGER.READY":
            DEBUG.channel("demo").log("Let's debug !");
            break;
        case "CORE.CONFIG.READY":
            DEBUG.channel("demo")
                .log("Remind me of this panel's external jsx list :")
                .log(
                    CONFIG.get("PANEL_IMPORTS_JSX")
                );
            break;
        case "CORE.INCLUDES.READY":
            JSXHelper2.popup("TEST FROM JSXHelper",function(res) {alert("CALLBACK TEST FROM JSXHelper");})
            break;
        case "CORE.MODULES.READY":
            break;
        case "CORE.READY":
            _bridge = new JSXBridge(this,"demo");
            _bridge.bridgeCall("CORE","test","coucou",null,"both");
            break;
        default : 
            break;
    }
   
}











