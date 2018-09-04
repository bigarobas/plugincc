PANEL = null;

init();

function init() {
    if (ENV.getContext()=="js") {
        CORE.addBridgeEventListener("CORE.READY",onCoreReady);
        CORE.start();
    } else {
        PANEL = new MyPanel();
    }
}

function onCoreReady(event) {
    PANEL = new MyPanel();
    PANEL.popup();
}


function MyPanel() { 
    //alert("MyPanel constructor "+ENV.getContext());
    
   

    this.bridge = new JSXBridge(this,"PANEL");

    /*
    this.onEvent = function(event) {
        DEBUG.channel("MyPanel").popup(event.type+" : from "+event.context+ " listened by "+ENV.getContext());
    }
    
    this.listen("TEST",this.onEvent);
    
    this.listen("ModuleA.TEST",this.onEvent);

    this.dispatch("TEST",{someData:[1,2,3,4]},"both");
    */
    

    
}

MyPanel.prototype.popup = function() {
    if (this.checkContext("jsx")) {
        alert(this.getContext());
	} else {
		this.mirror('popup');
	} 
}










