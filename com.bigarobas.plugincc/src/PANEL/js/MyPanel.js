console.log("HELLO");

PANEL = null;

CORE.addBridgeEventListener("CORE.READY",onCoreReady);
CORE.init();

function onCoreReady(event) {
    PANEL = new MyPanel();
}

function MyPanel() { 
    this.bridge = new JSXBridge(this,"PANEL");
    this.listen("TEST",this.onEvent);
    this.listen("ModuleA.TEST",this.onEvent);
    CORE.dispatch("TEST",{someData:[1,2,3,4]},"both");
}

MyPanel.prototype.onEvent = function(event) {
    DEBUG.channel("MyPanel")
        .separate()
        .log("Event Reseived")
        .log("type : "+event.type)
        .log("data : ")
        .struct(event.data)
        .separate()
        .logInContext("HELLO");
}



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










