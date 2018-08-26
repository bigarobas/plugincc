__CSI__ = new CSInterface();
__EXTENTION_PATH__ = __CSI__.getSystemPath(SystemPath.EXTENSION);

$ =  require(__EXTENTION_PATH__ + "/CORE/js/libs/jquery-2.0.2.min.js");

JSXBridge = require(__EXTENTION_PATH__ + "/CORE/mixed/JSXBridge.jsx");
JSXBridge.init(__CSI__);

Debugger = require(__EXTENTION_PATH__ + "/CORE/mixed/Debugger.jsx");
Debugger.setBridgeName("Debugger");
DEBUG = debug = new Debugger();

CSInterfaceHelper =  require(__EXTENTION_PATH__ + "/CORE/js/libs/CSInterfaceHelper.js");
CSHelper = new CSInterfaceHelper(__CSI__);

Environment =  require(__EXTENTION_PATH__ + "/CORE/js/Environment.js");
ENV = env = new Environment(__CSI__);

JSXHelper2 =  require(__EXTENTION_PATH__ + "/CORE/mixed/_WIP_JSXHelper.jsx");
JSXHelper2.setJSXBridgeName("JSXH");
JSXHelper2.setCSInterface(__CSI__);
JSXH = jsxh = new JSXHelper2();

Configuration =  require(__EXTENTION_PATH__ + "/CORE/mixed/Configuration.jsx");
CONFIG = config = new Configuration("CONFIG");

Module = (ENV.NODE_ES_TYPE == "es5") ? require(__EXTENTION_PATH__ + "/CORE/js/modules/es5/Module.js") : require(__EXTENTION_PATH__ + "/CORE/js/modules/Module.js");
ModuleDef = (ENV.NODE_ES_TYPE == "es5") ? require(__EXTENTION_PATH__ + "/CORE/js/modules/es5/ModuleDef.js") : require(__EXTENTION_PATH__ + "/CORE/js/modules/ModuleDef.js");


CORE_Private_Class = function (name) {
	this._name = name;
	this._hasBeenInitOnce = false;
	this._isInitialized = false;
	this._modules = [];
	this._modulesDef = [];
	this._modules_path;
	this._events_names = [
		"CORE.JS.INIT.BEGIN",
		"CORE.JS.INIT.END",
		"CORE.JS.BERIDGE.INIT.BEGIN",
		"CORE.JS.BERIDGE.INIT.END",
		"CORE.JS.DEBUGGER.INIT.BEGIN",
		"CORE.JS.DEBUGGER.INIT.END",
		"CORE.JS.MODULES.LOAD.BEGIN",
		"CORE.JS.MODULES.LOAD.END",
		"CORE.JS.MODULES.BUILD.BEGIN",
		"CORE.JS.MODULES.BUILD.END",
		"CORE.JS.MODULES.INIT.BEGIN",
		"CORE.JS.MODULES.INIT.END",
		"CORE.JS.MODULES.START.BEGIN",
		"CORE.JS.MODULES.START.END",
		"CORE.JS.CONFIG.CORE.BEGIN",
		"CORE.JS.CONFIG.CORE.END",
		"CORE.JS.CONFIG.PANEL.BEGIN",
		"CORE.JS.CONFIG.PANEL.END",
		"CORE.JS.CONFIG.READY",
		"CORE.JS.START.BEGIN",
		"CORE.JS.START.END",
		"CORE.READY"
	];

	this.bridge = new JSXBridge(this,"CORE");
		

	for (var i = 0 ; i<this._events_names.length ; i++) 
		this.listen(this._events_names[i],this.onBridgeEventHandler);

	this.listen("CORE.JSX.INIT.BEGIN",this.onBridgeEventHandler);
	this.listen("CORE.JSX.INIT.END",this.onBridgeEventHandler);
	this.listen("CORE.JSX.START.BEGIN",this.onBridgeEventHandler);
	this.listen("CORE.JSX.START.END",this.onBridgeEventHandler);

	//DISPATCH EVENTS IN "JS" SCOPE UNTILE JSX BRIDGE IS INITIALIZED
	this.dispatch("CORE.JS.INIT.BEGIN",null,"js");
	this.dispatch("CORE.JS.BERIDGE.INIT.BEGIN",null,"js");

}

//TODO : LET IT BE CALLED BY PANEL
//init();



CORE_Private_Class.prototype.init = function() {
	if (this._hasBeenInitOnce) return;
	this._hasBeenInitOnce = true;
	this.initBridgeInJSX();
}

CORE_Private_Class.prototype.initBridgeInJSX = function() {
	var _self = this;
	CSHelper.includeJSX("CORE/mixed/JSXBridge.jsx",function(res) {
		_self.dispatch("CORE.JS.BERIDGE.INIT.END");
	});
}



CORE_Private_Class.prototype.onBridgeEventHandler = function (event) {
	if (!DEBUG) {
		console.log(event.bridgeName,event.context,event.type);
	} else {
		DEBUG.channel("core.js").log(event.bridgeName+" "+event.context+" "+event.type);
	}
	switch (event.type) {

		case "CORE.JS.INIT.BEGIN" :
			break;

		case "CORE.JS.BERIDGE.INIT.BEGIN" :
			break;
		case "CORE.JS.BERIDGE.INIT.END" :
			this.initDebugger();
			break;

		case "CORE.JS.DEBUGGER.INIT.BEGIN" :
			break;
		case "CORE.JS.DEBUGGER.INIT.END" :
			this.loadCoreConfig();
			break;

		case "CORE.JS.CONFIG.CORE.BEGIN" :
			break;
		case "CORE.JS.CONFIG.CORE.END" :
			this.includeCoreJsx();
			break;

		case "CORE.JS.CONFIG.PANEL.BEGIN" :
			break;
		case "CORE.JS.CONFIG.PANEL.END" :
			this.includePanelJsx();
			break;
		
		case "CORE.JS.INIT.END" :
			CSHelper.evaluate('CORE.init()');
			break;

		case "CORE.JSX.INIT.BEGIN" :
			break;
		case "CORE.JSX.INIT.END" :
			this.synchInitialConf();
			break;
		
		case "CORE.JS.CONFIG.READY" :
			this.loadModules();
			break;

		case "CORE.JS.MODULES.LOAD.BEGIN" :
			break;
		case "CORE.JS.MODULES.LOAD.END" :
			this.start();
			break;

		case "CORE.JS.START.BEGIN" :
			break;

		case "CORE.JSX.START.BEGIN" :
			break;
		case "CORE.JSX.START.END" :
			this.buildModules();
			break;

		case "CORE.JS.MODULES.BUILD.BEGIN" :
			break;
		case "CORE.JS.MODULES.BUILD.END" :
			this.initModules();
			break;

		case "CORE.JS.MODULES.INIT.BEGIN" :
			break;
		case "CORE.JS.MODULES.INIT.END" :
			this.startModules();
			break;

		case "CORE.JS.MODULES.START.BEGIN" :
			break;
		case "CORE.JS.MODULES.START.END" :
			this._isInitialized = true;
			this.dispatch("CORE.JS.START.END");
			this.dispatch("CORE.READY");
			
			break;

		case "CORE.JS.START.END" :
			break;

		case "CORE.READY" :
			break;

		default:
			break;
		
	}
	
}

CORE_Private_Class.prototype.initDebugger = function() {
	this.dispatch("CORE.JS.DEBUGGER.INIT.BEGIN");
	DEBUG.channel("core.js").mute(false).setVerbose(true,true,true);
	DEBUG.channel("core.js-verbose").mute(true);
	DEBUG.channel("core.js-verbose").log("initDebugger");
	DEBUG.channel("module").mute(true);
	DEBUG.channel("csxs_custom_events").mute(true);
	DEBUG.channel("csxs_native_events").mute(true);
	DEBUG.channel("cep_native_events").mute(true);
	this.dispatch("CORE.JS.DEBUGGER.INIT.END");
}

CORE_Private_Class.prototype.isReady = function() {
	return this._isInitialized;
}

CORE_Private_Class.prototype.loadCoreConfig = function() {
	this.dispatch("CORE.JS.CONFIG.CORE.BEGIN");
	DEBUG.channel("core.js-verbose").log("loadCoreConfig");
	var _self = this;
	$.getJSON("../../CORE/data/config.json",function(json) {
		DEBUG.channel("core.js-verbose").log("onCoreConfigLoaded");
		CONFIG.update(json);
		_self.dispatch("CORE.JS.CONFIG.CORE.END");
	});
}

CORE_Private_Class.prototype.includeCoreJsx = function() {
	DEBUG.channel("core.js-verbose").log("includeCoreJsx");
	var _self = this;
	CSHelper.includeJSXInOrder(CONFIG.get("CORE_IMPORTS_JSX"),function(res) {
		DEBUG.channel("core.js-verbose").log("onIncludeCoreJsxComplete");
		_self.loadPanelConfig();
	});
}

CORE_Private_Class.prototype.loadPanelConfig = function() {
	this.dispatch("CORE.JS.CONFIG.PANEL.BEGIN");
	DEBUG.channel("core.js-verbose").log("loadPanelConfig");
	var _self = this;
	$.getJSON("../../PANEL/data/config.json",function(json) {
		DEBUG.channel("core.js-verbose").log("onPanelConfigLoaded").json(json);
		CONFIG.update(json);
		_self.dispatch("CORE.JS.CONFIG.PANEL.END");
	});
}

CORE_Private_Class.prototype.includePanelJsx = function() {
	DEBUG.channel("core.js-verbose").log("includePanelJsx");
	var _self = this;
	CSHelper.includeJSXInOrder(CONFIG.get("PANEL_IMPORTS_JSX"),function(res) {
		DEBUG.channel("core.js-verbose").log("onIncludePanelJsxComplete");
		_self.dispatch("CORE.JS.INIT.END");
	});
}
CORE_Private_Class.prototype.synchInitialConf = function() {
	var _self = this;
	CONFIG.synch(function(res) {
		DEBUG.channel("core.js-verbose").log("onConfigSynched : ").json(res);
		_self.dispatch("CORE.JS.CONFIG.READY");
	});
}

CORE_Private_Class.prototype.loadModules = function() {
	this.dispatch("CORE.JS.MODULES.LOAD.BEGIN");
	var auto = CONFIG.get("PANEL_MODULES_AUTO_DETECT");
	if (auto) {
		this.getModulesFolders();
	} else {
		// TODO : HANDLE PANEL_MODULES_AUTO_DETECT = false
	}
	
}

CORE_Private_Class.prototype.getModulesFolders = function() {
	this._modules_path = CONFIG.get("PANEL_MODULES_AUTO_DETECT_PATH");
	if (!this._modules_path) this._modules_path = CONFIG.get("DEFAULT_MODULES_AUTO_DETECT_PATH");
	this._modules_path = ENV.EXTENTION_PATH + this._modules_path;
	var _self = this;
	
	CSHelper.evaluate('$jsx.getFolderContentJsonFromPath("'+this._modules_path+'")',function(json) {
		DEBUG.channel("core.js-verbose").log("onGetModulesFoldersComplete :").json(json);
		var modules_folders = JSON.parse(json);
		var n = modules_folders.length;
		var module_path;
		for (var i=0;i<n;i++) {
			module_path = modules_folders[i];
			_self.registerModule(i,module_path);
		}
		_self.includeModulesJsx();
	});

	//TODO : TEST FOR NODE VERSION
	/*
	var json = ENV.NODE_LIB_FS.readdirSync(this._modules_path);
	var modules_folders = json;
	modules_folders.splice(modules_folders.indexOf("desktop.ini", 1));
	//IN LOOP : module_path = this._modules_path+"/"+modules_folders[i];
	*/
	
}

CORE_Private_Class.prototype.registerModule = function(id,path) {
	var def = new ModuleDef(id,path);
	this._modulesDef.push(def);
}

CORE_Private_Class.prototype.includeModulesJsx = function() {
	DEBUG.channel("core.js-verbose").log("includeModulesJsx");
	var n = this._modulesDef.length;
	var m;
	var jsx_paths = [];
	for (var i=0;i<n;i++) {
		m = this._modulesDef[i];
		jsx_paths.push(m.jsxPath);
	}
	var _self = this;
	CSHelper.includeJSXInOrder(jsx_paths,function(res) {
		DEBUG.channel("core.js-verbose").log("onIncludeModulesJsxComplete");
		_self.dispatch("CORE.JS.MODULES.LOAD.END");
	});
}

CORE_Private_Class.prototype.start = function() {
	this.dispatch("CORE.JS.START.BEGIN");
	DEBUG.channel("core.js-verbose").log("start");
	this.initGlobalListeners();
	CSHelper.evaluate('CORE.start()');
}

CORE_Private_Class.prototype.initGlobalListeners = function() {
	DEBUG.channel("core.js-verbose").log("initGlobalListeners");
	this.init_CSXSEvent_Native_Listeners();
	this.init_CEPEvent_Native_Listeners();
}

CORE_Private_Class.prototype.buildModules = function() {
	this.dispatch("CORE.JS.MODULES.BUILD.BEGIN");
	var n = this._modulesDef.length;
	var def;
	var m;
	for (var i=0;i<n;i++) {
		def = this._modulesDef[i];
		m = def.build();
		this._modules.push(m);
	}
	this.dispatch("CORE.JS.MODULES.BUILD.END");
}

CORE_Private_Class.prototype.initModules = function() {
	this.dispatch("CORE.JS.MODULES.INIT.BEGIN");
	var n = this._modules.length;
	var m;
	for (var i=0;i<n;i++) {
		m = this._modules[i];
		m.init();
	}
	this.dispatch("CORE.JS.MODULES.INIT.END");
}


CORE_Private_Class.prototype.startModules = function() {
	this.dispatch("CORE.JS.MODULES.START.BEGIN");
	DEBUG.channel("core.js-verbose").log("startModules");
	var n = this._modules.length;
	var m;
	for (var i=0;i<n;i++) {
		m = this._modules[i];
		m.start();
	}
	this.dispatch("CORE.JS.MODULES.START.END");
	
}

CORE_Private_Class.prototype.init_CSXSEvent_Native_Listeners = function() {
	CSHelper.csInterface.addEventListener("CSXSEvent_Native",this.on_CSXSEvent_Native_Handler);
}

CORE_Private_Class.prototype.on_CSXSEvent_Native_Handler = function(event) {
	//WATCH OUT "this" might not refer to CORE_Private_Class
	var encapsulatedEvent = JSON.parse(JSON.stringify(event.data));
	var encapsulatedData = (!encapsulatedEvent.data) ? "" : JSON.parse(cleanJsonString(encapsulatedEvent.data)) ;
	
	DEBUG.channel("csxs_native_events")
		.stack("on_CSXSEvent_Native_Handler")
		.stack(encapsulatedEvent.type)
		.stackJson(encapsulatedData)
		.flush();

}

CORE_Private_Class.prototype.init_CEPEvent_Native_Listeners = function() {
	CSHelper.csInterface.addEventListener("applicationActivate",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("documentAfterActivate",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("documentAfterDeactivate",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("documentAfterSave",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("documentEdited",this.on_CEPEvent_Native_Handler);

	CSHelper.csInterface.addEventListener("com.adobe.csxs.events.AppOffline",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("com.adobe.csxs.events.AppOnline",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("com.adobe.csxs.events.ThemeColorChanged",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("com.adobe.csxs.events.CustomApplicationEventWithoutPayload",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("com.adobe.csxs.events.CustomApplicationEventWithPayload",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("com.adobe.csxs.events.ApplicationBeforeQuit",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("com.adobe.csxs.events.WindowVisibilityChanged",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("com.adobe.csxs.events.ExtensionLoaded",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("com.adobe.csxs.events.ExtensionUnloaded",this.on_CEPEvent_Native_Handler);

	CSHelper.csInterface.addEventListener("afterSave",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("afterActivate",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("afterClose",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("afterContextChanged",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("afterSelectionAttributeChanged",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("afterSelectionChanged",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("beforeDeactivate",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("beforeNew",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("beforeOpen",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("beforeQuit",this.on_CEPEvent_Native_Handler);

	//NOTE SURE !
	CSHelper.csInterface.addEventListener("beforeSave",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("beforeActivate",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("beforeClose",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("beforeContextChanged",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("beforeSelectionAttributeChanged",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("beforeSelectionChanged",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("afterDeactivate",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("afterNew",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("afterOpen",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("afterQuit",this.on_CEPEvent_Native_Handler);

	//NOT SURE !
	CSHelper.csInterface.addEventListener("com.adobe.PhotoshopWorkspaceSet",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("com.adobe.PhotoshopWorkspaceGet",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("com.adobe.PhotoshopWorkspaceAware",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("com.adobe.PhotoshopWorkspaceData",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("com.adobe.PhotoshopWorkspaceRequest",this.on_CEPEvent_Native_Handler);
	CSHelper.csInterface.addEventListener("com.adobe.PhotoshopQueryDockingState",this.on_CEPEvent_Native_Handler);

	/*
	COMMAND EVENTS
	com.adobe.PhotoshopPersistent
	com.adobe.PhotoshopUnPersistent
	com.adobe.PhotoshopLoseFocus
	*/


}

CORE_Private_Class.prototype.on_CEPEvent_Native_Handler = function(event) {
	//WATCH OUT "this" might not refer to CORE_Private_Class
	DEBUG.channel("cep_native_events")
		.stack("on_CEPEvent_Native_Handler")
		.stack(event.type)
		.stackJson(event)
		.flush();
}

/*
CORE_Private_Class.prototype.dispatch = function(type,data,scope) {
	var event = this.bridge.createBridgeEvent(type,data,scope);
	this.bridge.dispatch(event);
}
*/


CORE_Private_Class.prototype.cleanJsonString = function (jsonString) {
	var regex = new RegExp(/\\"/g);
	jsonString = jsonString.replace(regex,'"');
	return jsonString;
}

CORE_Private_Class.prototype.test = function() { DEBUG.channel("core.js-verbose").log("test"); }


CORE = (function () {
	'use strict';

	return (
		new CORE_Private_Class()
	);

}());

/*
if ( typeof module === "object" && typeof module.exports === "object" ) {
	module.exports = CORE_Private_Class;
} 
*/
