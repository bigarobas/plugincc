Configuration = function (bridgeName) {
    'use strict';
	this.data = {};
    this._onSynchComplete = null;
    this.bridgeName = bridgeName;
    this.bridge = new JSXBridge(this,bridgeName);
    //this.bridge.addEventListener("HELP",function (res) {alert("HELP : "+JSON.stringify(res));} );
}

Configuration.prototype.onSynchComplete = function (res) {
    if (!this._onSynchComplete) return;
    this._onSynchComplete(res);
}

Configuration.prototype.update = function(json) {
    //alert("update : "+this.bridge.getContext());
    //this.bridge.dispatchEvent("HELP","from "+this.bridge.getContext());
    if(!json) return false;
    if (typeof json == "string") json = JSON.parse(json);
    for (var key in json) {
        if (key !== undefined && key !== "toJSONString" && key !== "parseJSON" ) {
            this.data[key] = json[key];
        }
    }
    if (this.bridge.checkContext("jsx")) {
        return JSON.stringify(this.data);
    } else {
        return this.data;
    }
}
    
Configuration.prototype.get = function(key) {
    var value = this.data[key];
    return value;
}

Configuration.prototype.set = function(key,value) {
    this.data[key] = value;
}

Configuration.prototype.synch = function(onComplete) {
    
    this._onSynchComplete = onComplete;
    var _self = this;
    if (this.bridge.checkContext("jsx")) {
        
        this.bridge.mirror(
            'update',
            this.data,
            '(function() {\
                {bridge}.update({args});\
                {bridge}.onSynchComplete({args});\
            })();'
        );
    } else {
        this.bridge.mirror(
            'update',
            this.data,
            function(json) {
                _self.update(json);
                _self.onSynchComplete(json);
            }
        );
    }  
}

Configuration.prototype.getDataString = function() {
    return JSON.stringify(this.data);
}

Configuration.prototype.getData = function() {
    return this.data;
}

if ( typeof module === "object" && typeof module.exports === "object" ) {
	module.exports = Configuration;
} 
    
