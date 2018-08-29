//####################################################
// JSXBridgeEventScope
//####################################################

JSXBridgeEventScope  = {};
JSXBridgeEventScope.JS = "js";
JSXBridgeEventScope.JSX = "jsx";
JSXBridgeEventScope.MIRROR = "mirror";
JSXBridgeEventScope.BOTH = "both";
JSXBridgeEventScope.SAME = "same";

//####################################################
// JSXBridge
//####################################################

JSXBridge = function(client,bridgeName) {
    if (!JSXBridge.isInitialized()) JSXBridge.init();
    this.client = client;
    this.bridgeName = bridgeName;
    JSXBridge.register(this);
    this.initClient(client,bridgeName);
}

//####################################################
// JSXBridge prototype
//####################################################

//TODO : make it work !
JSXBridge.prototype.initClient = function (client,bridgeName) {
    if (!client) return;
    
    var _self = this;

    if (typeof client.addBridgeEventListener == 'undefined') {
        client.addBridgeEventListener = function(type,handler) {
            _self.addBridgeEventListener(type,handler);
        }
    }
    if (typeof client.dispatchBridgeEvent == 'undefined') {
        client.dispatchBridgeEvent = function(event) {
            _self.dispatchBridgeEvent(event);
        }
    }
    if (typeof client.dispatch == 'undefined') {
        client.dispatch = function(type,data,scope) {
            _self.dispatch(type,data,scope);
        }
    }
    if (typeof client.listen == 'undefined') {
        client.listen = function(type,handler) {
            _self.addBridgeEventListener(type,handler);
        }
    }
    if (typeof client.createBridgeEvent == 'undefined') {
        client.createBridgeEvent = function(type,data,scope) {
            return _self.createBridgeEvent(type,data,scope);
        }
    }
    if (typeof client.mirror == 'undefined') {
        client.mirror = function(function_name,function_args,callback_or_expression) {
            return _self.mirror(function_name,function_args,callback_or_expression);
        }
    }
    if (typeof client.getContext == 'undefined') {
        client.getContext = function() {
            return _self.getContext();
        }
    }
    if (typeof client.checkContext == 'undefined') {
        client.checkContext = function (ctx) {
            return _self.checkContext(ctx);
        }
    }
    
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

JSXBridge.prototype.addBridgeEventListener = function (type,handler) {
	return JSXBridge.registerAsListener(this,type,handler);
}

JSXBridge.prototype.removeBridgeEventListener = function (type,handler) {
	return JSXBridge.unRegisterAsListener(this,type,handler);
}

JSXBridge.prototype.dispatchBridgeEvent = function (event) {
    event.bridge = this;
    event.bridgeName = this.bridgeName;
	JSXBridge.dispatchBridgeEvent(event);
}

JSXBridge.prototype.dispatch = function (type,data,scope) {
    var event =  this.createBridgeEvent(type,data,scope);
    this.dispatchBridgeEvent(event);
}

JSXBridge.prototype.createBridgeEvent = function (type,data,scope) {
    return JSXBridge.createBridgeEvent(type,data,scope);
}

JSXBridge.prototype.mirror = function (function_name,function_args,callback_or_expression) {
    JSXBridge.mirror(this,function_name,function_args,callback_or_expression);  
}

//####################################################
// JSXBridge statics
//####################################################

JSXBridge._ctx = undefined;
JSXBridge._csInterface = undefined;
JSXBridge._bridgeName = "JSXBridge";
JSXBridge._bridge = null;
JSXBridge._initialized = false;
JSXBridge._mirrorsMap = [];
JSXBridge._mirrorsArray = [];
JSXBridge._bridgeEventHandlers = [];

JSXBridge.init = function(csi) {
	if (JSXBridge._initialized) return true;
	JSXBridge._ctx = (typeof console !== 'undefined') ? "js" : "jsx";
    JSXBridge._initialized = true;
    JSXBridge._bridge =  new JSXBridge(this,JSXBridge._bridgeName); 
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
        JSXBridge._csInterface.addEventListener(JSXBridgeEvent.MIRROR_FROM_JSX,JSXBridge.on_MIRROR_FROM_JSX)
    }

    return true;
}

JSXBridge.on_MIRROR_FROM_JSX = function (event) {
    var bridgeName = event.data.bridgeName;
    var mirror = JSXBridge._mirrorsMap[bridgeName];
    if (!mirror) return false;
    var functionName = event.data.functionName;
    var bridgeFunction =  mirror.client[functionName];
    if (!bridgeFunction) return false;
    var functionArgs = event.data.functionArgs;
    var bridgeCallResult = bridgeFunction.call(mirror.client,functionArgs);
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
            result = JSXBridge.stringify(args);
            break;
        default:
            result = JSXBridge.stringify(args);
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

JSXBridge._dispatchBridgeEventAmongListeners = function (event) {
    var type = event.type;
    var handlersList = JSXBridge.getOrCreateBridgeEventHandlersList(type);
    var listener;
    var n = handlersList.length;
    for (var i=0 ; i < n ; i++) {
        listener = handlersList[i];
        if (typeof listener.bridge.client != 'undefined') {
            listener.handler.call(listener.bridge.client,event);
        } else {
            listener.handler(event);
        }
    } 
}

JSXBridge._dispatchBridgeEventAmongListenersFromString = function (string_event) {
    var event = JSXBridgeEvent.createFromString(string_event);
    JSXBridge._dispatchBridgeEventAmongListeners(event);
}

JSXBridge.registerAsListener = function (bridge,type,handler) {
    var handlersList = JSXBridge.getOrCreateBridgeEventHandlersList(type);
    handlersList.push({bridge:bridge,handler:handler});
}

JSXBridge.unRegisterAsListener = function (bridge,type,handler) {
    var handlersList = JSXBridge.getOrCreateBridgeEventHandlersList(type);
    var listener;
    var i =  handlersList.length;
    while (i--) {
        listener = handlersList[i];
            if (listener.bridge == bridge && listener.handler == handler) { 
            handlersList.splice(i, 1);
        } 
    }
}

JSXBridge.dispatchBridgeEvent = function (bridgeEvent) {
    if (JSXBridge.checkContext("jsx")) {
        if (bridgeEvent.scope == JSXBridgeEventScope.JSX || bridgeEvent.scope == JSXBridgeEventScope.BOTH || bridgeEvent.scope == JSXBridgeEventScope.SAME) {
           JSXBridge._dispatchBridgeEventAmongListeners(bridgeEvent);
        }
        if (bridgeEvent.scope != JSXBridgeEventScope.JSX && bridgeEvent.scope != JSXBridgeEventScope.SAME) {
           
            JSXBridge.mirror_from_jsx(
                JSXBridge._bridge,
                '_dispatchBridgeEventAmongListeners',
                bridgeEvent.mirrorClone()
            );
        }
    } else {
        if (bridgeEvent.scope == JSXBridgeEventScope.JS || bridgeEvent.scope == JSXBridgeEventScope.BOTH || bridgeEvent.scope == JSXBridgeEventScope.SAME) {
           JSXBridge._dispatchBridgeEventAmongListeners(bridgeEvent);
        }
        if (bridgeEvent.scope != JSXBridgeEventScope.JS && bridgeEvent.scope != JSXBridgeEventScope.SAME) {
            JSXBridge.mirror_from_js(
                JSXBridge._bridge,
                '_dispatchBridgeEventAmongListeners',
                bridgeEvent.mirrorClone()
            );
        }
    }
}

JSXBridge.createBridgeEvent = function (type,data,scope) {
    var event =  new JSXBridgeEvent(type,data,scope);
    return event;
}


JSXBridge.getOrCreateBridgeEventHandlersList = function(type) {
    var handlersList = JSXBridge._bridgeEventHandlers[type];
     if (!handlersList) JSXBridge._bridgeEventHandlers[type] = [];
     return JSXBridge._bridgeEventHandlers[type];
}

JSXBridge.mirror = function (bridge,function_name,function_args,callback_or_expression) {
	if (JSXBridge.checkContext("jsx")) {
            JSXBridge.mirror_from_jsx(bridge,function_name,function_args,callback_or_expression);
    } else {
            JSXBridge.mirror_from_js(bridge,function_name,function_args,callback_or_expression);
    }
}

JSXBridge.mirror_from_jsx = function(bridge,function_name,function_args,callback_or_expression) {
    var args_str = JSXBridge.argsToString(function_args);
    var callback_function = (typeof callback_or_expression == 'function') ? callback_or_expression : null;
    var callback_expression = (typeof callback_or_expression == 'string') ? callback_or_expression : null;
    var data = JSXBridge.stringify({
        bridgeName : bridge.bridgeName,
        functionName : function_name,
        functionArgs : function_args,
        callbackExpression : callback_expression
    });
	if (JSXBridge.checkContext("jsx")) {
        var event = new CSXSEvent();
        event.type = JSXBridgeEvent.MIRROR_FROM_JSX,
        event.data = data;
        event.dispatch();
        return true;
    }
    return false;
}

JSXBridge.mirror_from_js = function(bridge,function_name,function_args,callback_or_expression) {
    var args_str = JSXBridge.argsToString(function_args);
    var callback_function = (typeof callback_or_expression == 'function') ? callback_or_expression : null;
    var callback_expression = (typeof callback_or_expression == 'string') ? callback_or_expression : null;
	if (JSXBridge.checkContext("js")) {
         if (typeof JSXBridge._csInterface !== 'undefined') {
			if (bridge.bridgeName != undefined) {
				var expr = bridge.bridgeName+'.'+function_name+'('+args_str+')';
				JSXBridge._csInterface.evalScript(expr,callback_function);
			}
		}
        return true;
    }
    return false;
}

//FROM :
//https://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json
JSXBridge.stringify = function(obj) {
    // Note: cache should not be re-used by repeated calls to JSON.stringify.
    var cache = [];
    var result = JSON.stringify(obj, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Duplicate reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                } catch (error) {
                    // discard key if value cannot be deduped
                    return;
                }
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null; // Enable garbage collection
    return result;
}



if ( typeof module === "object" && typeof module.exports === "object" ) {
	module.exports = JSXBridge;
} 