DEBUG = debug = null;
JSXH = jsxh = null;
CONFIG = config = null;
ENV = env = null;



CORE_Private_Class = function () {
    'use strict';
        this._plugPlugExternalObjectLib;
        this._bridge = null; 
        this._extension_path = null;
}

CORE_Private_Class.prototype.init = function(path) {

    this._extension_path = path;

    this.activatePlugPlugExternalObjectLib();

    this.includeJSX(this._extension_path+"/"+"CORE/jsx/libs/json2.jsx");
    this.includeJSX(this._extension_path+"/"+"CORE/jsx/libs/es5-shim.jsx");
    this.includeJSX(this._extension_path+"/"+"CORE/mixed/JSXBridge.jsx");

    this._bridge = new JSXBridge(this,"CORE"); 
    this.dispatch("CORE.JSX.INIT.BEGIN"); //A LITTLE LATE ^^

    this.includeJSX(this._extension_path+"/"+"CORE/mixed/Environment.jsx");
    this.includeJSX(this._extension_path+"/"+"CORE/mixed/Debugger.jsx");
    this.includeJSX(this._extension_path+"/"+"CORE/mixed/Configuration.jsx");
    
    this.initEnv();
    this.initDebugger();
    this.initConfig();

    this.dispatch("CORE.JSX.INIT.END");
    return true;

}

CORE_Private_Class.prototype.activatePlugPlugExternalObjectLib = function() {
    if (typeof CSXSEvent == 'undefined') {
        try {
            this._plugPlugExternalObjectLib = new ExternalObject("lib:\PlugPlugExternalObject");
        } catch (e) { 
            alert("CORE.jsx couldn't create lib:\PlugPlugExternalObject");
            alert(e); 
            return false;
        }
    }	
}

CORE_Private_Class.prototype.initEnv = function() {
    this.dispatch("CORE.JSX.ENV.INIT.BEGIN"); 
    ENV = env = new Environment(null,'ENV');
    this.dispatch("CORE.JSX.ENV.INIT.END"); 
}

CORE_Private_Class.prototype.initDebugger = function() {
    this.dispatch("CORE.JSX.DEBUGGER.INIT.BEGIN"); 
    Debugger.setBridgeName("Debugger");
    DEBUG = debug = Debug = new Debugger();
    DEBUG.channel('core.jsx').setVerbose(true,true,false);
    this.dispatch("CORE.JSX.DEBUGGER.INIT.END"); 
    //JSXH = new JSXHelper2()
}

CORE_Private_Class.prototype.initConfig = function() {
    this.dispatch("CORE.JSX.CONFIG.INIT.BEGIN"); 
    CONFIG = config = new Configuration("CONFIG");
    this.dispatch("CORE.JSX.CONFIG.INIT.END"); 
}

CORE_Private_Class.prototype.includeJSX = function(path) {
    //alert(path);
    //if (JSXH != null) return JSXH.includeJSX(path); //TODO RETHINK DEPENDENCY

        try {
        var res = $.evalFile(path);
        return (res);
    } catch (e) {
        alert("Exception:" + e);
    }
}

CORE_Private_Class.prototype.includeJSXFolder = function(path) {
    var folder = new Folder(path);
    if (folder.exists) {
        var jsxFiles = folder.getFiles("*.jsx");
        for (var i = 0; i < jsxFiles.length; i++) {
            var jsxFile = jsxFiles[i];
            try {
                $.evalFile(jsxFile);
            } catch (e) {
                alert(e.message + "\n" + jsxFile);
            }
        }
    }
}

CORE = (function () {
	'use strict';
	return (
		new CORE_Private_Class()
	);
}());

/*
function createEventListeners() {
    if (!app) return;
    return;
    destroyEventListeners();
    app.addEventListener("afterSave",onAppEventHandler);
    app.addEventListener("afterActivate",onAppEventHandler);
    app.addEventListener("afterClose",onAppEventHandler);
    app.addEventListener("afterContextChanged",onAppEventHandler);
    app.addEventListener("afterSelectionAttributeChanged",onAppEventHandler);
    app.addEventListener("afterSelectionChanged",onAppEventHandler);
    app.addEventListener("beforeDeactivate",onAppEventHandler);
    app.addEventListener("beforeNew",onAppEventHandler);
    app.addEventListener("beforeOpen",onAppEventHandler);
    app.addEventListener("beforeQuit",onAppEventHandler);
    //UNSURE !
    app.addEventListener("beforeSave",onAppEventHandler);
    app.addEventListener("beforeActivate",onAppEventHandler);
    app.addEventListener("beforeClose",onAppEventHandler);
    app.addEventListener("beforeContextChanged",onAppEventHandler);
    app.addEventListener("beforeSelectionAttributeChanged",onAppEventHandler);
    app.addEventListener("beforeSelectionChanged",onAppEventHandler);
    app.addEventListener("afterDeactivate",onAppEventHandler);
    app.addEventListener("afterNew",onAppEventHandler);
    app.addEventListener("afterOpen",onAppEventHandler);
    app.addEventListener("afterQuit",onAppEventHandler);
    
}

function destroyEventListeners() {
    if (!app) return;
    return;
    app.removeEventListener("afterSave",onAppEventHandler);
    app.removeEventListener("afterActivate",onAppEventHandler);
    app.removeEventListener("afterClose",onAppEventHandler);
    app.removeEventListener("afterContextChanged",onAppEventHandler);
    app.removeEventListener("afterSelectionAttributeChanged",onAppEventHandler);
    app.removeEventListener("afterSelectionChanged",onAppEventHandler);
    app.removeEventListener("beforeDeactivate",onAppEventHandler);
    app.removeEventListener("beforeNew",onAppEventHandler);
    app.removeEventListener("beforeOpen",onAppEventHandler);
    app.removeEventListener("beforeQuit",onAppEventHandler);
    //UNSURE !
    app.removeEventListener("beforeSave",onAppEventHandler);
    app.removeEventListener("beforeActivate",onAppEventHandler);
    app.removeEventListener("beforeClose",onAppEventHandler);
    app.removeEventListener("beforeContextChanged",onAppEventHandler);
    app.removeEventListener("beforeSelectionAttributeChanged",onAppEventHandler);
    app.removeEventListener("beforeSelectionChanged",onAppEventHandler);
    app.removeEventListener("afterDeactivate",onAppEventHandler);
    app.removeEventListener("afterNew",onAppEventHandler);
    app.removeEventListener("afterOpen",onAppEventHandler);
    app.removeEventListener("afterQuit",onAppEventHandler);
}

function onAppEventHandler(nativeEvent) {
    var type = nativeEvent.eventType;
    var event = {};
    event.type = type;
    dispatchNativeEvent(event);
}

function dispatchNativeEvent(nativeEvent) {
    var event = new CSXSEvent();
    event.type = "CSXSEvent_Native";
    event.data = JSON.stringify(nativeEvent);
    event.dispatch();
}
*/
    
    




