

/*
PANEL = null;

CORE.addBridgeEventListener("CORE.READY",onCoreReady);
CORE.init();

PANEL = null;

function onCoreReady(event) {
    PANEL = (function() {
        function MyPanel() {
            console.log(this.addBridgeEventListener);
            this.bridge = new JSXBridge(this,"PANEL");
            console.log(this.addBridgeEventListener);
            this.addBridgeEventListener("TEST",this.onEvent);
            var event = CORE.createBridgeEvent("TEST","HELLO","both");
            CORE.dispatchBridgeEvent(event);
        
        }
        MyPanel.prototype.onEvent = function(e) {
            console.log(e);
            console.log(this);
        }
        return new MyPanel();
    })();
}
*/


console.log(__EXTENTION_PATH__);

Panel =  require(__EXTENTION_PATH__ + "/CORE/mixed/Panel.jsx");
p1 = new Panel("P1");
p1.listen("PLUGIN.READY",onPluginReady);
p1.init();


p2 = new Panel("P2");
p2.listen("PLUGIN.READY",onPluginReady);
p2.init();


function onPluginReady(event) {
    console.log(event);
    console.log(this);
}










