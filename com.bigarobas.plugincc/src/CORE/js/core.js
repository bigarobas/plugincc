__CSI__ = new CSInterface();
__EXTENTION_PATH__ = __CSI__.getSystemPath(SystemPath.EXTENSION);

$ =  require(__EXTENTION_PATH__ + "/CORE/js/libs/jquery-2.0.2.min.js");

JSXBridgeEvent = require(__EXTENTION_PATH__ + "/CORE/mixed/JSXBridgeEvent.jsx");

JSXBridge = require(__EXTENTION_PATH__ + "/CORE/mixed/JSXBridge.jsx");
JSXBridge.init(__CSI__);

CoreEvents = require(__EXTENTION_PATH__ + "/CORE/mixed/CoreEvents.jsx");

Debugger = require(__EXTENTION_PATH__ + "/CORE/mixed/Debugger.jsx");
Debugger.setBridgeName("Debugger");
DEBUG = debug = null;

CSInterfaceHelper =  require(__EXTENTION_PATH__ + "/CORE/js/libs/CSInterfaceHelper.js");
CSHelper = new CSInterfaceHelper(__CSI__);

Environment =  require(__EXTENTION_PATH__ + "/CORE/mixed/Environment.jsx");
ENV = env = new Environment(__CSI__,'ENV');

JSXHelper2 = JSXH = jsxh = require(__EXTENTION_PATH__ + "/CORE/mixed/_WIP_JSXHelper.jsx");

Configuration =  require(__EXTENTION_PATH__ + "/CORE/mixed/Configuration.jsx");
CONFIG = config = new Configuration("CONFIG");

Module = require(__EXTENTION_PATH__ + "/CORE/js/modules/Module.js");
ModuleDef = require(__EXTENTION_PATH__ + "/CORE/js/modules/ModuleDef.js");

CORE_Private_Class = function (name) {

	this._name = name;
	this._hasBeenStartedOnce = false;
	this._isInitialized = false;
	this._modules = [];
	this._modulesDef = [];
	this._modules_path;

	this.bridge = new JSXBridge(this,"CORE");

}

//TODO :
// CORE.JSX INIT BEFORE INCLUDING PANEL JSX

CORE_Private_Class.prototype.onCoreBridgeEventHandler = function (event) {
	
	if (!DEBUG) {
		//console.log(event.bridgeName,event.context,event.type);
	} else {
		DEBUG.channel("core.js").log(event.type);
	}

	switch (event.type) {

		case "CORE.JSX.INIT.END" :
			this.synchEnv();
			break;

		case "CORE.ENV.SYNCH.END" :
			this.dispatch("CORE.ENV.READY");
			this.initDebugger();	
			break;

		case "CORE.DEBUGGER.JS.INIT.END" :
			this.dispatch("CORE.DEBUGGER.READY");
			this.loadCoreConfig();
			break;

		case "CORE.CONFIG.JS.CORE.END" :
				this.loadPanelConfig();
			break;
		case "CORE.CONFIG.JS.PANEL.END" :
				this.synchInitialConf();
			break;
		
		case "CORE.CONFIG.INIT.SYNCH.END":
			this.dispatch("CORE.CONFIG.READY");
			this.includeCoreJsx();
			break;
		
		case "CORE.INCLUDES.JSX.CORE.END" :
			this.includePanelJsx();
			break;

		case "CORE.INCLUDES.JSX.PANEL.END" :
			this.dispatch("CORE.INCLUDES.READY");
			this.loadModules();
			break;

		case "CORE.MODULES.JS.LOAD.END" :
			this.buildModules();
			break;

		case "CORE.MODULES.JS.BUILD.END" :
			this.initModules();
			break;

		case "CORE.MODULES.JS.INIT.END" :
			this.startModules();
			break;

		case "CORE.MODULES.JS.START.END" :
			this.dispatch("CORE.MODULES.READY");
			this.dispatch("CORE.JS.START.END");
			this._isInitialized = true;
			this.dispatch("CORE.READY");
			break;

		default:
			break;
		
	}
	
}

CORE_Private_Class.prototype.isReady = function() {
	return this._isInitialized;
}

//SHALL BE CALLED EXTERNALLY (BY A PANEL) TO START THE INIT PROCESS
CORE_Private_Class.prototype.start = function() {
	if (this._hasBeenStartedOnce) return;
	this._hasBeenStartedOnce = true;
	
	for (var i = 0 ; i<CoreEvents.events.length ; i++) 
		this.listen(CoreEvents.events[i],this.onCoreBridgeEventHandler);

	//DISPATCH EVENTS IN "JS" SCOPE UNTILE JSX BRIDGE IS INITIALIZED
	this.dispatch("CORE.JS.START",null,"js"); // A BIT LATE ^^
	this.init();
}

CORE_Private_Class.prototype.init = function() {
	this.dispatch("CORE.JS.INIT.BEGIN",null,"js");
	CSHelper.evaluate('CORE.init("'+__EXTENTION_PATH__+'")');
}

CORE_Private_Class.prototype.synchEnv = function() {
	this.dispatch("CORE.ENV.SYNCH.BEGIN");
	var _self =this;
	var data = ENV.getSynchableValues();
	CSHelper.evaluate('ENV.setSynchableValues('+JSON.stringify(data)+')',function(res) {
		_self.dispatch("CORE.ENV.SYNCH.END");
	});
}

CORE_Private_Class.prototype.initConfig = function() {
	this.dispatch("CORE.CONFIG.JS.INIT.BEGIN");
	this.loadCoreConfig();
}

CORE_Private_Class.prototype.initDebugger = function() {
	this.dispatch("CORE.DEBUGGER.JS.INIT.BEGIN");
	DEBUG = debug = new Debugger();
	DEBUG.channel("core.js").setVerbose(true,true,true);
	DEBUG.channel("core.js").mute(true);
	DEBUG.channel("core.js-verbose").mute(true);
	DEBUG.channel("module").mute(true);
	DEBUG.channel("csxs_custom_events").mute(true);
	DEBUG.channel("csxs_native_events").mute(true);
	DEBUG.channel("cep_native_events").mute(true);
	this.dispatch("CORE.DEBUGGER.JS.INIT.END");
}

CORE_Private_Class.prototype.loadCoreConfig = function() {
	this.dispatch("CORE.CONFIG.JS.CORE.BEGIN");
	DEBUG.channel("core.js-verbose").log("loadCoreConfig");
	var _self = this;
	$.getJSON("../../CORE/data/config.json",function(json) {
		DEBUG.channel("core.js-verbose").log("onCoreConfigLoaded");
		CONFIG.update(json);
		_self.dispatch("CORE.CONFIG.JS.CORE.END");
	});
}

CORE_Private_Class.prototype.includeCoreJsx = function() {
	this.dispatch("CORE.INCLUDES.JSX.CORE.BEGIN");
	DEBUG.channel("core.js-verbose").log("includeCoreJsx");
	var _self = this;
	CSHelper.includeJSXInOrder(CONFIG.get("CORE_IMPORTS_JSX"),function(res) {
		DEBUG.channel("core.js-verbose").log("onIncludeCoreJsxComplete");
		_self.dispatch("CORE.INCLUDES.JSX.CORE.END");
	});
}

CORE_Private_Class.prototype.loadPanelConfig = function() {
	this.dispatch("CORE.CONFIG.JS.PANEL.BEGIN");
	DEBUG.channel("core.js-verbose").log("loadPanelConfig");
	var _self = this;
	$.getJSON("../../PANEL/data/config.json",function(json) {
		DEBUG.channel("core.js-verbose").log("onPanelConfigLoaded").json(json);
		CONFIG.update(json);
		_self.dispatch("CORE.CONFIG.JS.PANEL.END");
	});
}

CORE_Private_Class.prototype.includePanelJsx = function() {
	DEBUG.channel("core.js-verbose").log("includePanelJsx");
	this.dispatch("CORE.INCLUDES.JSX.PANEL.BEGIN");
	var imports_list = CONFIG.get("PANEL_IMPORTS_JSX");
	//DEBUG.channel("core.js-verbose").log(imports_list);
	var _self = this;
	CSHelper.includeJSXInOrder(imports_list,function(res) {
		DEBUG.channel("core.js-verbose").log("onIncludePanelJsxComplete");
		_self.dispatch("CORE.INCLUDES.JSX.PANEL.END");
		
	});
}

CORE_Private_Class.prototype.synchInitialConf = function() {
	this.dispatch("CORE.CONFIG.INIT.SYNCH.BEGIN");
	var _self = this;
	CONFIG.synch(function(res) {
		DEBUG.channel("core.js-verbose").log("onConfigSynched : ").json(res);
		_self.dispatch("CORE.CONFIG.INIT.SYNCH.END");
	});
}

CORE_Private_Class.prototype.loadModules = function() {
	this.dispatch("CORE.MODULES.JS.LOAD.BEGIN");
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
		_self.dispatch("CORE.MODULES.JS.LOAD.END");
	});
}

CORE_Private_Class.prototype.buildModules = function() {
	this.dispatch("CORE.MODULES.JS.BUILD.BEGIN");
	var n = this._modulesDef.length;
	var def;
	var m;
	for (var i=0;i<n;i++) {
		def = this._modulesDef[i];
		m = def.build();
		this._modules.push(m);
	}
	this.dispatch("CORE.MODULES.JS.BUILD.END");
}

CORE_Private_Class.prototype.initModules = function() {
	this.dispatch("CORE.MODULES.JS.INIT.BEGIN");
	var n = this._modules.length;
	var m;
	for (var i=0;i<n;i++) {
		m = this._modules[i];
		m.init();
	}
	this.dispatch("CORE.MODULES.JS.INIT.END");
}

CORE_Private_Class.prototype.startModules = function() {
	this.dispatch("CORE.MODULES.JS.START.BEGIN");
	DEBUG.channel("core.js-verbose").log("startModules");
	var n = this._modules.length;
	var m;
	for (var i=0;i<n;i++) {
		m = this._modules[i];
		m.start();
	}
	this.dispatch("CORE.MODULES.JS.START.END");
}

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

/*

CORE_Private_Class.prototype.cleanJsonString = function (jsonString) {
	var regex = new RegExp(/\\"/g);
	jsonString = jsonString.replace(regex,'"');
	return jsonString;
}

CORE_Private_Class.prototype.initGlobalListeners = function() {
	DEBUG.channel("core.js-verbose").log("initGlobalListeners");
	this.init_CSXSEvent_Native_Listeners();
	this.init_CEPEvent_Native_Listeners();
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

	//COMMAND EVENTS
	//com.adobe.PhotoshopPersistent
	//com.adobe.PhotoshopUnPersistent
	//com.adobe.PhotoshopLoseFocus


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


