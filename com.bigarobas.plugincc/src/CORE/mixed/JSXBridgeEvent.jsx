//####################################################
// JSXBridgeEvent
//####################################################

JSXBridgeEvent = function (type,data,scope) {
    this.type = type;
    this.data = data;
    this.context = JSXBridge.getContext();
    this.bridge = null;
    this.bridgeName = null;
    if (!scope) scope = JSXBridgeEventScope.BOTH;
    this.scope = scope;
}

JSXBridgeEvent.BRIDGE_CALL = "JSXBridgeEvent_BRIDGE_CALL";

JSXBridgeEvent.createFromString = function (event_string){
    var parsed = JSON.parse(event_string);
    var event = new JSXBridgeEvent(parsed.type,parsed.data,parsed.scope);
    event.context = parsed.context;
    event.bridge = parsed.bridge;
    event.bridgeName = parsed.bridgeName;
    return event;
}

JSXBridgeEvent.prototype.clone = function () {
    var event  = new JSXBridgeEvent(this.type,this.data,this.scope);
    event.context = this.context;
    event.bridge = this.bridge;
    event.bridgeName = this.bridgeName;
    return event;
}

JSXBridgeEvent.prototype.mirrorClone = function () {
    var event  = new JSXBridgeEvent(this.type,this.data,this.scope);
    event.context = this.context;
    event.bridge = "";
    event.bridgeName = this.bridgeName;
    return event;
}

JSXBridgeEvent.prototype.stringClone = function () {
    var clone = this.clone();
    clone.bridge = "";
    return JSXBridge.stringify(clone);
}

JSXBridgeEvent.prototype.toString = function() {
    return this.stringClone();
}

if ( typeof module === "object" && typeof module.exports === "object" ) {
	module.exports = JSXBridgeEvent;
}