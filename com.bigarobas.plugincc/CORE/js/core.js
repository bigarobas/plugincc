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

CORE = (function () {
	'use strict';

	var _modules = [];
	var _modulesDef = [];
	var _modules_path;
	var _bridge;
	var _events_names = [
		"CORE.JS.INIT.BEGIN",
		"CORE.JS.INIT.END",
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
		"CORE.JS.CONFIG.PLUGIN.BEGIN",
		"CORE.JS.CONFIG.PLUGIN.END",
		"CORE.JS.CONFIG.READY",
		"CORE.JS.START.BEGIN",
		"CORE.JS.START.END",
		"CORE.JS.READY"
	];

	init();

	function init() {
		initBridge();
		dispatchBridgeEvent("CORE.JS.INIT.START");
		initDebugger();
		DEBUG.channel("core.js-verbose").log("init");
		loadCoreConfig();
	}

	function initBridge() {
		_bridge = new JSXBridge(this,"CORE");

		for (var i = 0 ; i<_events_names.length ; i++) 
			_bridge.addBridgeEventListener(_events_names[i],onBridgeEventHandler);

		_bridge.addBridgeEventListener("CORE.JSX.INIT.BEGIN",onBridgeEventHandler);
		_bridge.addBridgeEventListener("CORE.JSX.INIT.END",onBridgeEventHandler);
		_bridge.addBridgeEventListener("CORE.JSX.START.BEGIN",onBridgeEventHandler);
		_bridge.addBridgeEventListener("CORE.JSX.START.END",onBridgeEventHandler);
	}

	function onBridgeEventHandler(event) {
		if (!DEBUG) {
			console.log(event.bridgeName,event.context,event.type);
		} else {
			DEBUG.channel("core.js").log(event.bridgeName+" "+event.context+" "+event.type);
		}
		switch (event.type) {

			case "CORE.JS.INIT.BEGIN" :
				break;
			
			case "CORE.JS.CONFIG.CORE.BEGIN" :
				break;
			case "CORE.JS.CONFIG.CORE.END" :
				includeCoreJsx();
				break;
			case "CORE.JS.CONFIG.PLUGIN.BEGIN" :
				break;
			case "CORE.JS.CONFIG.PLUGIN.END" :
				break;
			
			case "CORE.JS.INIT.END" :
				CSHelper.evaluate('CORE.init()');
				break;

			case "CORE.JSX.INIT.BEGIN" :
				break;
			case "CORE.JSX.INIT.END" :
				CONFIG.synch(onConfigSynched);
				break;
			
			case "CORE.JS.CONFIG.READY" :
				loadModules();
				break;

			case "CORE.JS.MODULES.LOAD.BEGIN" :
				break;
			case "CORE.JS.MODULES.LOAD.END" :
				start();
				break;

			case "CORE.JS.START.BEGIN" :
				break;

			case "CORE.JSX.START.BEGIN" :
				break;
			case "CORE.JSX.START.END" :
				launchModules();
				break;

			case "CORE.JS.MODULES.BUILD.BEGIN" :
				break;
			case "CORE.JS.MODULES.BUILD.END" :
				break;

			case "CORE.JS.MODULES.INIT.BEGIN" :
				break;
			case "CORE.JS.MODULES.INIT.END" :
				break;

			case "CORE.JS.MODULES.START.BEGIN" :
				break;
			case "CORE.JS.MODULES.START.END" :
				dispatchBridgeEvent("CORE.JS.START.END");
				dispatchBridgeEvent("CORE.JS.READY");
				break;

			case "CORE.JS.START.END" :
				break;

			case "CORE.JS.READY" :
				break;

			default:
				break;
			
		}
		
	}

	function initDebugger() {
		DEBUG.channel("core.js").mute(false).setVerbose(true,true,true);
		DEBUG.channel("core.js-verbose").mute(true);
		DEBUG.channel("core.js-verbose").log("initDebugger");
		DEBUG.channel("module").mute(true);
		DEBUG.channel("csxs_custom_events").mute(true);
		DEBUG.channel("csxs_native_events").mute(true);
		DEBUG.channel("cep_native_events").mute(true);
	}

	function loadCoreConfig() {
		dispatchBridgeEvent("CORE.JS.CONFIG.CORE.BEGIN");
		DEBUG.channel("core.js-verbose").log("loadCoreConfig");
		$.getJSON("../../CORE/data/config.json", onCoreConfigLoaded);
	}

	function onCoreConfigLoaded(json) {
		DEBUG.channel("core.js-verbose").log("onCoreConfigLoaded");
		CONFIG.update(json);
		dispatchBridgeEvent("CORE.JS.CONFIG.CORE.END");
	}

	function includeCoreJsx() {
		DEBUG.channel("core.js-verbose").log("includeCoreJsx");
		CSHelper.includeJSXInOrder(CONFIG.get("CORE_IMPORTS_JSX"),onIncludeCoreJsxComplete);
	}

	function onIncludeCoreJsxComplete() {
		DEBUG.channel("core.js-verbose").log("onIncludeCoreJsxComplete");
		loadPluginConfig();
	}
	
	function loadPluginConfig() {
		dispatchBridgeEvent("CORE.JS.CONFIG.PLUGIN.BEGIN");
		DEBUG.channel("core.js-verbose").log("loadPluginConfig");
		$.getJSON("../../PLUGIN/data/config.json", onPluginConfigLoaded);
	}

	function onPluginConfigLoaded(json) {
		DEBUG.channel("core.js-verbose").log("onPluginConfigLoaded").json(json);
		CONFIG.update(json);
		dispatchBridgeEvent("CORE.JS.CONFIG.PLUGIN.END");
		includePluginJsx();
	}

	function includePluginJsx() {
		DEBUG.channel("core.js-verbose").log("includePluginJsx");
		CSHelper.includeJSXInOrder(CONFIG.get("PLUGIN_IMPORTS_JSX"),onIncludePluginJsxComplete);
	}

    function onIncludePluginJsxComplete() {
		DEBUG.channel("core.js-verbose").log("onIncludePluginJsxComplete");
		dispatchBridgeEvent("CORE.JS.INIT.END");
	}

	function onConfigSynched(res) {
		DEBUG.channel("core.js-verbose").log("onConfigSynched : ").json(res);
		dispatchBridgeEvent("CORE.JS.CONFIG.READY");
	}

	function loadModules() {
		dispatchBridgeEvent("CORE.JS.MODULES.LOAD.BEGIN");
		var auto = CONFIG.get("PLUGIN_MODULES_AUTO_DETECT");
		if (auto) {
			getModulesFolders();
		} else {
			// TODO : HANDLE PLUGIN_MODULES_AUTO_DETECT = false
		}
		
	}

	function getModulesFolders() {
		_modules_path = CONFIG.get("PLUGIN_MODULES_AUTO_DETECT_PATH");
		if (!_modules_path) _modules_path = CONFIG.get("DEFAULT_MODULES_AUTO_DETECT_PATH");
		_modules_path = ENV.EXTENTION_PATH + _modules_path;
		CSHelper.evaluate('$jsx.getFolderContentJsonFromPath("'+_modules_path+'")',onGetModulesFoldersComplete);
		//TEST FOR NODE VERSION
		/*
		var res = ENV.NODE_LIB_FS.readdirSync(_modules_path);
		onGetModulesFoldersComplete(res);
		*/
	}

	function onGetModulesFoldersComplete(res) {
		//TEST FOR NODE VERSION
		/*
		var modules_folders = res;
		modules_folders.splice(modules_folders.indexOf("desktop.ini", 1));
		//IN LOOP : module_path = _modules_path+"/"+modules_folders[i];
		*/
		DEBUG.channel("core.js-verbose").log("onGetModulesFoldersComplete :").json(res);
		var modules_folders = JSON.parse(res);
		var n = modules_folders.length;
		var module_path;
		for (var i=0;i<n;i++) {
			module_path = modules_folders[i];
			registerModule(i,module_path);
		}
		includeModulesJsx();
		
	}

	function registerModule(id,path) {
		var def = new ModuleDef(id,path);
		_modulesDef.push(def);
	}

	function includeModulesJsx() {
		DEBUG.channel("core.js-verbose").log("includeModulesJsx");
		var n = _modulesDef.length;
		var m;
		var jsx_paths = [];
		for (var i=0;i<n;i++) {
			m = _modulesDef[i];
			jsx_paths.push(m.jsxPath);
		}
		CSHelper.includeJSXInOrder(jsx_paths,onIncludeModulesJsxComplete);
	}

	function onIncludeModulesJsxComplete() {
		DEBUG.channel("core.js-verbose").log("onIncludeModulesJsxComplete");
		dispatchBridgeEvent("CORE.JS.MODULES.LOAD.END");
		
	}
    
    function start() {
		dispatchBridgeEvent("CORE.JS.START.BEGIN");
		DEBUG.channel("core.js-verbose").log("start");
		initGlobalListeners();
		CSHelper.evaluate('CORE.start()');
	}

	function initGlobalListeners() {
		DEBUG.channel("core.js-verbose").log("initGlobalListeners");
		init_CSXSEvent_Native_Listeners();
		init_CEPEvent_Native_Listeners();
	}

	function launchModules() {
		DEBUG.channel("core.js-verbose").log("launchModules");
		buildModules();
		initModules();
		startModules();
	}

	function buildModules() {
		dispatchBridgeEvent("CORE.JS.MODULES.BUILD.BEGIN");
		var n = _modulesDef.length;
		var def;
		var m;
		for (var i=0;i<n;i++) {
			def = _modulesDef[i];
			m = def.build();
			_modules.push(m);
		}
		dispatchBridgeEvent("CORE.JS.MODULES.BUILD.END");
	}

	function initModules() {
		dispatchBridgeEvent("CORE.JS.MODULES.INIT.BEGIN");
		var n = _modules.length;
		var m;
		for (var i=0;i<n;i++) {
			m = _modules[i];
			m.init();
		}
		dispatchBridgeEvent("CORE.JS.MODULES.INIT.END");
	}


	function startModules() {
		dispatchBridgeEvent("CORE.JS.MODULES.START.BEGIN");
		DEBUG.channel("core.js-verbose").log("startModules");
		var n = _modules.length;
		var m;
		for (var i=0;i<n;i++) {
			m = _modules[i];
			m.start();
		}
		dispatchBridgeEvent("CORE.JS.MODULES.START.END");
		
	}

	function init_CSXSEvent_Native_Listeners() {
		CSHelper.csInterface.addEventListener("CSXSEvent_Native", on_CSXSEvent_Native_Handler);
	}

	function on_CSXSEvent_Native_Handler(event) {
		var encapsulatedEvent = JSON.parse(JSON.stringify(event.data));
		var encapsulatedData = (!encapsulatedEvent.data) ? "" : JSON.parse(cleanJsonString(encapsulatedEvent.data)) ;
		
		DEBUG.channel("csxs_native_events")
			.stack("on_CSXSEvent_Native_Handler")
			.stack(encapsulatedEvent.type)
			.stackJson(encapsulatedData)
			.flush();

	}

	function init_CEPEvent_Native_Listeners() {
		

		CSHelper.csInterface.addEventListener("applicationActivate",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("documentAfterActivate",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("documentAfterDeactivate",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("documentAfterSave",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("documentEdited",on_CEPEvent_Native_Handler);

		CSHelper.csInterface.addEventListener("com.adobe.csxs.events.AppOffline",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("com.adobe.csxs.events.AppOnline",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("com.adobe.csxs.events.ThemeColorChanged",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("com.adobe.csxs.events.CustomApplicationEventWithoutPayload",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("com.adobe.csxs.events.CustomApplicationEventWithPayload",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("com.adobe.csxs.events.ApplicationBeforeQuit",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("com.adobe.csxs.events.WindowVisibilityChanged",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("com.adobe.csxs.events.ExtensionLoaded",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("com.adobe.csxs.events.ExtensionUnloaded",on_CEPEvent_Native_Handler);

		CSHelper.csInterface.addEventListener("afterSave",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("afterActivate",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("afterClose",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("afterContextChanged",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("afterSelectionAttributeChanged",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("afterSelectionChanged",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("beforeDeactivate",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("beforeNew",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("beforeOpen",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("beforeQuit",on_CEPEvent_Native_Handler);

		//NOTE SURE !
		CSHelper.csInterface.addEventListener("beforeSave",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("beforeActivate",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("beforeClose",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("beforeContextChanged",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("beforeSelectionAttributeChanged",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("beforeSelectionChanged",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("afterDeactivate",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("afterNew",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("afterOpen",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("afterQuit",on_CEPEvent_Native_Handler);

		//NOT SURE !
		CSHelper.csInterface.addEventListener("com.adobe.PhotoshopWorkspaceSet",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("com.adobe.PhotoshopWorkspaceGet",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("com.adobe.PhotoshopWorkspaceAware",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("com.adobe.PhotoshopWorkspaceData",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("com.adobe.PhotoshopWorkspaceRequest",on_CEPEvent_Native_Handler);
		CSHelper.csInterface.addEventListener("com.adobe.PhotoshopQueryDockingState",on_CEPEvent_Native_Handler);

		/*
		COMMAND EVENTS
		com.adobe.PhotoshopPersistent
		com.adobe.PhotoshopUnPersistent
		com.adobe.PhotoshopLoseFocus
		*/


	}

	function on_CEPEvent_Native_Handler(event) {
		DEBUG.channel("cep_native_events")
			.stack("on_CEPEvent_Native_Handler")
			.stack(event.type)
			.stackJson(event)
			.flush();
	}

	function dispatchBridgeEvent(type,data,scope) {
		var event = _bridge.createBridgeEvent(type,data,scope);
		_bridge.dispatchBridgeEvent(event);
	}
	

	function cleanJsonString(jsonString) {
		var regex = new RegExp(/\\"/g);
		jsonString = jsonString.replace(regex,'"');
		return jsonString;
	}

	function test() { DEBUG.channel("core.js-verbose").log("test"); }
	
	return (
		{	
			test:test
		}
	)

}());