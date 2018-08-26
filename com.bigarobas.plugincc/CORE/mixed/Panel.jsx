Panel = function (name) {
    'use strict';
	this.name = name;
    this.bridge = new JSXBridge(this,name);
}

Panel.prototype.onCoreReady = function (event) {
    this.dispatch("PLUGIN.INIT.END");
    this.dispatch("PLUGIN.READY",this);
}

Panel.prototype.init = function () {
    this.dispatch("PLUGIN.INIT.BEGIN");
    if (CORE.isReady()) {
        this.dispatch("PLUGIN.INIT.END");
        this.dispatch("PLUGIN.READY",this);
    } else {
        this.listen("CORE.READY",this.onCoreReady);
        CORE.init();
    }
    
    
}

Panel.prototype.getName = function () {
    return this._name;
}

if ( typeof module === "object" && typeof module.exports === "object" ) {
	module.exports = Panel;
} 

