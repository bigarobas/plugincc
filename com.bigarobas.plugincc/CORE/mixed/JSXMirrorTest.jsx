JSXMirrorTest = function(bridgeName) {
    this.mirror = new JSXMirror(this,bridgeName);
}

JSXMirrorTest.prototype.popup = function (message) {
    if (this.mirror.checkContext("jsx")) {
		DEBUG.log(message);
	} else {
		this.mirror.bridge('popup',message,function(res){DEBUG.dispatch(res)});
	}

    return true;
}

JSXMirrorTest.prototype.popin = function (message) {
    if (this.mirror.checkContext("jsx")) {
		this.mirror.bridge('popin',message,'DEBUG.popup("RESULTAT : {args}");');
	} else {
		DEBUG.log(message);
	}
    return true;
}

if ( typeof module === "object" && typeof module.exports === "object" ) {
	module.exports = JSXMirrorTest;
} 
