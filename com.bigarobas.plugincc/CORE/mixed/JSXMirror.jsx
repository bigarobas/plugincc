JSXMirror = function(target,bridgeName) {
    if (!JSXMirror.isInitialized()) JSXMirror.init();
    this.target = target;
    this.bridgeName = bridgeName;
    JSXMirror.register(this);
}

JSXMirror._ctx = undefined;
JSXMirror._csInterface = undefined;
JSXMirror._initialized = false;
JSXMirror._mirrors = [];

JSXMirror.init = function(csi) {
	if (JSXMirror._initialized) return true;
	JSXMirror._ctx = (typeof console !== 'undefined') ? "js" : "jsx";
	if (JSXMirror._ctx == "js") {
		if (!JSXMirror.hasCSInterface()) {
            if (!csi) {
                try {
                    JSXMirror.setCSInterface(new CSInterface());
                } catch (e) {
                    JSXMirror._writeln("JSXMirror couldn't find CSInterface Class");
                    JSXMirror._writeln(e);
                }
            } else {
                JSXMirror.setCSInterface(csi);
            }
		}
        JSXMirror.initListeners();
	} else {
		
	}

	JSXMirror._initialized = true;
}

JSXMirror.EVENTS = {};
JSXMirror.EVENTS.REFLECT_FROM_JSX = "JSXMirror_event_reflect_from_jsx";
JSXMirror.EVENTS.REFLECT_FROM_JS = "JSXMirror_event_reflect_from_js";

JSXMirror.initListeners = function() {
	if (!JSXMirror.hasCSInterface()) return;
    JSXMirror._csInterface.addEventListener(JSXMirror.EVENTS.REFLECT_FROM_JSX,JSXMirror.on_REFLECT_FROM_JSX)
}

JSXMirror.on_REFLECT_FROM_JSX = function (event) {
    var mirror = JSXMirror._mirrors[event.data.bridgeName];
    if (!mirror) return;
    var func =  mirror.target[event.data.functionName];
    if (!func) return;
    var res = func.call(mirror.target,event.data.functionArgs);
    if (!event.data.callbackExpression) return;
    var expr = event.data.callbackExpression;
    if (!expr) return;
    expr = expr.replace("{args}",JSXMirror.argsToString(res));
    JSXMirror._csInterface.evalScript(expr);
}

JSXMirror.register = function (mirror) {
    JSXMirror._mirrors[mirror.bridgeName] = mirror;
}

JSXMirror.isInitialized = function() {
	return JSXMirror._initialized;
}

JSXMirror.hasCSInterface = function() {
	return (JSXMirror._csInterface != undefined);
}


JSXMirror.setCSInterface = function (csi) {
	JSXMirror._csInterface = csi;
}

JSXMirror.argsToString = function (args) {
    if (!args) return "";
    var result = "";
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



JSXMirror.prototype.checkContext = function (ctx) {
    if (JSXMirror._ctx == ctx) return true;
    return false;
}

JSXMirror.prototype.hasBridgeName = function() {
	return (this.bridgeName != undefined);
}

JSXMirror.prototype.setBridgeName = function (bridgeName) {
    this.bridgeName = bridgeName;
    return this.bridgeName;
}

JSXMirror.prototype.getBridgeName = function () {
	return this.bridgeName;
}


JSXMirror.prototype.bridge = function (function_name,function_args,callback_or_expression) {
    var args_str = JSXMirror.argsToString(function_args);
    var callback_function = (typeof callback_or_expression == 'function') ? callback_or_expression : null;
    var callback_expression = (typeof callback_or_expression == 'string') ? callback_or_expression : null;
	if (JSXMirror._ctx == "jsx") {
            var event = new CSXSEvent();
            event.type = JSXMirror.EVENTS.REFLECT_FROM_JSX;
            event.data = JSON.stringify({
                bridgeName : this.bridgeName,
                functionName : function_name,
                functionArgs : function_args,
                callbackExpression : callback_expression
            });
            event.dispatch();
    } else {
        if (typeof JSXMirror._csInterface !== 'undefined') {
			if (this.bridgeName != undefined) {
				var expr = this.bridgeName+'.'+function_name+'('+args_str+')';
				JSXMirror._csInterface.evalScript(expr,callback_function);
			}
		}
    }
}

if ( typeof module === "object" && typeof module.exports === "object" ) {
	module.exports = JSXMirror;
} 
