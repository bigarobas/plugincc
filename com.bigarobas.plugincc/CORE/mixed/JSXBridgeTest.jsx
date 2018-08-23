JSXBridgeTest = function(bridgeName) {
    this.bridge = new JSXBridge(this,bridgeName);
}

JSXBridgeTest.prototype.popup = function (message) {
    if (this.bridge.checkContext("jsx")) {
		DEBUG.log(message);
	} else {
		this.bridge.mirror('popup',message,function(res){DEBUG.dispatch(res)});
	}

    return true;
}

JSXBridgeTest.prototype.popin = function (message) {
    if (this.bridge.checkContext("jsx")) {
		this.bridge.mirror('popin',message,'DEBUG.popup("RESULTAT : {args}");');
	} else {
		DEBUG.log(message);
	}
    return true;
}

if ( typeof module === "object" && typeof module.exports === "object" ) {
	module.exports = JSXBridgeTest;
} 
