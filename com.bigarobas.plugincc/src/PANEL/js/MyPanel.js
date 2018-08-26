console.log("HELLO");

PANEL = null;

CORE.addBridgeEventListener("CORE.READY",onCoreReady);
CORE.init();

function onCoreReady(event) {
    console.log("HELLO");
}

/*
function MyPanel() {
    
    console.log(this.addBridgeEventListener);
    this.bridge = new JSXBridge(this,"PANEL");
    console.log(this.addBridgeEventListener);
    this.listen("TEST",this.onEvent);
    CORE.dispatch("TEST","HELLO","both");

}


MyPanel.prototype.onEvent = function(e) {
    console.log(e);
    console.log(this);
}

*/

/*
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
*/










