JSXBridge = function(target,bridgeName) {
    if (!JSXBridge.isInitialized()) JSXBridge.init();
    this.target = target;
    this.bridgeName = bridgeName;
    JSXBridge.register(this);
}

JSXBridgeEvent = function (type,data) {
    this.type = type;
    this.data = data;
}

JSXBridgeEvent.REFLECT_FROM_JSX = "JSXBridge_event_reflect_from_jsx";
JSXBridgeEvent.REFLECT_FROM_JS = "JSXBridge_event_reflect_from_js";

JSXBridge._ctx = undefined;
JSXBridge._csInterface = undefined;
JSXBridge._bridgeName = "JSXBridge";
JSXBridge._bridge = null;
JSXBridge._initialized = false;
JSXBridge._mirrorsMap = [];
JSXBridge._mirrorsArray = [];
JSXBridge._eventHandlers = [];

JSXBridge.init = function(csi) {
	if (JSXBridge._initialized) return true;
	JSXBridge._ctx = (typeof console !== 'undefined') ? "js" : "jsx";
	if (JSXBridge.checkContext("jsx")) {
        if (typeof CSXSEvent == 'undefined') {
            try {
                var pp = new ExternalObject("lib:\PlugPlugExternalObject");
            } catch (e) { 
                alert("JSXBridge couldn't create lib:\PlugPlugExternalObject");
                alert(e); 
                return false;
            }
        }
	} else {
        if (!JSXBridge.hasCSInterface()) {
            if (!csi) {
                try {
                    JSXBridge.setCSInterface(new CSInterface());
                } catch (e) {
                    console.log("JSXBridge couldn't find CSInterface Class");
                    console.log(e);
                    return false;
                }
            } else {
                JSXBridge.setCSInterface(csi);
            }
		}
        JSXBridge._initialized = true;
        JSXBridge._bridge =  new JSXBridge(this,JSXBridge._bridgeName); 
        JSXBridge.initJSListeners();
    }

	
    return true;
}



JSXBridge.initJSListeners = function() {
	if (!JSXBridge.hasCSInterface()) return;
    JSXBridge._csInterface.addEventListener(JSXBridgeEvent.REFLECT_FROM_JSX,JSXBridge.on_REFLECT_FROM_JSX)
}

JSXBridge.on_REFLECT_FROM_JSX = function (event) {
    var bridgeName = event.data.bridgeName;
    var mirror = JSXBridge._mirrorsMap[bridgeName];
    if (!mirror) return false;
    var functionName = event.data.functionName;
    var bridgeFunction =  mirror.target[functionName];
    if (!bridgeFunction) return false;
    var functionArgs = event.data.functionArgs;
    var bridgeCallResult = bridgeFunction.call(mirror.target,functionArgs);
    if (!event.data.callbackExpression) return false;
    var callbackExpression = event.data.callbackExpression;
    if (!callbackExpression) return false;
    var regex = new RegExp(/{bridge}/g);
	callbackExpression = callbackExpression.replace(regex,bridgeName);
    
	regex = new RegExp(/{args}/g);
	callbackExpression = callbackExpression.replace(regex,JSXBridge.argsToString(bridgeCallResult));
    JSXBridge._csInterface.evalScript(callbackExpression);
    return true;
}

JSXBridge.register = function (mirror) {
    JSXBridge._mirrorsMap[mirror.bridgeName] = mirror;
    JSXBridge._mirrorsArray.push(mirror);
}

JSXBridge.isInitialized = function() {
	return JSXBridge._initialized;
}

JSXBridge.hasBridgeName = function() {
	return (JSXBridge._bridgeName != undefined);
}

JSXBridge.setBridgeName = function (bridgeName) {
	JSXBridge._bridgeName = bridgeName;
    if (!JSXBridge._bridge) return;
	JSXBridge._bridge.setBridgeName(bridgeName);
}

JSXBridge.hasCSInterface = function() {
	return (JSXBridge._csInterface != undefined);
}


JSXBridge.setCSInterface = function (csi) {
	JSXBridge._csInterface = csi;
}

JSXBridge.argsToString = function (args) {
    if (!args) return "";
    var result = args;
    switch (typeof args) {
        case "number":
            result = args;
            break;
        case "string":
            result = '"'+args+'"';
            break;
        case "object":
            result = JSON.stringify(args);
            break;
        default:
            result = JSON.stringify(args);
            break;
    }
    return result
}

JSXBridge.checkContext = function (ctx) {
    if (JSXBridge._ctx == ctx) return true;
    return false;
}

JSXBridge.getContext = function () {
    return JSXBridge._ctx;
}

JSXBridge.addEventListener = function (type,handler) {
    if (JSXBridge.checkContext("jsx")) {
    } else {
        return JSXBridge._csInterface.addEventListener(type,handler);
    }
}

JSXBridge.watchEventType = function (type) {
    if (JSXBridge.checkContext("jsx")) {
    } else {
        return JSXBridge._csInterface.addEventListener(type,JSXBridge.onWatchEvent);
    }
}

JSXBridge.unWatchEventType = function (type) {
    if (JSXBridge.checkContext("jsx")) {
    } else {
        return JSXBridge._csInterface.removeEventListener(type,JSXBridge.onWatchEvent);
    }
}

JSXBridge.onWatchEvent = function (event) {
    if (JSXBridge.checkContext("jsx")) {
    } else {
        JSXBridge.dispatchEventAmongListeners(event);
    }
}

JSXBridge.dispatchEventAmongListeners = function (event) {
    var type = event.type;
    var handlersList = JSXBridge.getOrCreateHandlersList(type);
    var listener;
    var i = handlersList.length;
    while (i--) {
        listener = handlersList[i];
        listener.handler(event);
    } 
}

JSXBridge.registerAsListener = function (bridge,type,handler) {
    var handlerList = JSXBridge.getOrCreateHandlersList(type);
    handlerList.push({target:bridge,handler:handler});
}

JSXBridge.unRegisterAsListener = function (bridge,type,handler) {
    var handlersList = JSXBridge.getOrCreateHandlersList(type);
    var listener;
    var i =  handlersList.length;
    while (i--) {
        listener = handlersList[i];
            if (listener.target == bridge && listener.handler == handler) { 
            handlersList.splice(i, 1);
        } 
    }
}

JSXBridge.removeEventListener = function (type,handler) {
	if (JSXBridge.checkContext("jsx")) {
    } else {
        return JSXBridge._csInterface.removeEventListener(type,handler);
    }
}

JSXBridge.dispatchEvent = function (type,data) {

    var bridgeEvent = new JSXBridgeEvent(type,data);
    JSXBridge.dispatchEventAmongListeners(bridgeEvent);

	if (JSXBridge.checkContext("jsx")) {
        var event = new CSXSEvent();
        event.type = type;
        event.data = JSON.stringify(data);
        event.dispatch();
    } else {
        var event = new CSEvent();
        event.type = type;
        event.data = JSON.stringify(data);
        JSXBridge._csInterface.dispatchEvent(event);
        
        JSXBridge._bridge.mirror(
            'dispatchEventAmongListeners',
            bridgeEvent,
            function(res) {
                console.log("JSXBridge.dispatchEvent "+res);
            }
        )
    }
    
}

JSXBridge.getOrCreateHandlersList = function(type) {
    var handlerList = JSXBridge._eventHandlers[type];
     if (!handlerList) JSXBridge._eventHandlers[type] = [];
     return JSXBridge._eventHandlers[type];
}

JSXBridge.prototype.getContext = function () {
    return JSXBridge.getContext();
}

JSXBridge.prototype.checkContext = function (ctx) {
    return JSXBridge.checkContext(ctx);
}

JSXBridge.prototype.hasBridgeName = function() {
	return (this.bridgeName != undefined);
}

JSXBridge.prototype.setBridgeName = function (bridgeName) {
    this.bridgeName = bridgeName;
    return this.bridgeName;
}

JSXBridge.prototype.getBridgeName = function () {
	return this.bridgeName;
}

JSXBridge.prototype.addEventListener = function (type,handler) {
	return JSXBridge.registerAsListener(this,type,handler);
}

JSXBridge.prototype.removeEventListener = function (type,handler) {
	return JSXBridge.unRegisterAsListener(this,type,handler);
}

JSXBridge.prototype.dispatchEvent = function (type,data) {
	JSXBridge.dispatchEvent(type,data);
}


JSXBridge.prototype.mirror = function (function_name,function_args,callback_or_expression) {
    var args_str = JSXBridge.argsToString(function_args);
    var callback_function = (typeof callback_or_expression == 'function') ? callback_or_expression : null;
    var callback_expression = (typeof callback_or_expression == 'string') ? callback_or_expression : null;
	if (JSXBridge.checkContext("jsx")) {
            this.dispatchEvent(
                JSXBridgeEvent.REFLECT_FROM_JSX,
                {
                    bridgeName : this.bridgeName,
                    functionName : function_name,
                    functionArgs : function_args,
                    callbackExpression : callback_expression
                }
            );
    } else {
        if (typeof JSXBridge._csInterface !== 'undefined') {
			if (this.bridgeName != undefined) {
				var expr = this.bridgeName+'.'+function_name+'('+args_str+')';
                DEBUG.log(this.bridgeName+" bridge expr").log(expr);
				JSXBridge._csInterface.evalScript(expr,callback_function);
			}
		}
    }
}

if ( typeof module === "object" && typeof module.exports === "object" ) {
	module.exports = JSXBridge;
} 
