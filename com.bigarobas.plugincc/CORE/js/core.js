/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager, CSHelper*/

__CSI__ = new CSInterface();
__EXTENTION_PATH__ = __CSI__.getSystemPath(SystemPath.EXTENSION);

$ =  require(__EXTENTION_PATH__ + "/CORE/js/libs/jquery-2.0.2.min.js");

JSXBridge = require(__EXTENTION_PATH__ + "/CORE/mixed/JSXBridge.jsx");
JSXBridge.init(__CSI__);
JSXBridgeTest = require(__EXTENTION_PATH__ + "/CORE/mixed/JSXBridgeTest.jsx");
JSXMT = new JSXBridgeTest("JSXMT");

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

	var modules = [];
	var modulesDef = [];
	var modules_path;

	init();

	function init() {
		initLogger();
		DEBUG.channel("core.js").log("init");
		loadCoreConfig();
	}

	function initLogger() {
		DEBUG.channel("core.js").setVerbose(true,true,true);
		DEBUG.channel("csxs_custom_events").setVerbose(false,false,false);
		DEBUG.channel("csxs_native_events").setVerbose(false,false,false);
		DEBUG.channel("cep_native_events").setVerbose(false,false,false);
		DEBUG.channel("core.js").log("initLogger");
	}

	function loadCoreConfig() {
		DEBUG.channel("core.js").log("loadCoreConfig");
		$.getJSON("../../CORE/data/config.json", onCoreConfigLoaded);
	}

	function onCoreConfigLoaded(json) {
		DEBUG.channel("core.js").log("onCoreConfigLoaded");
		CONFIG.update(json);
		includeCoreJsx();
		
	}

	function includeCoreJsx() {
		DEBUG.channel("core.js").log("includeCoreJsx");
		CSHelper.includeJSXInOrder(CONFIG.get("CORE_IMPORTS_JSX"),onIncludeCoreJsxComplete);
	}

	function onIncludeCoreJsxComplete() {
		DEBUG.channel("core.js").log("onIncludeCoreJsxComplete");
		loadPluginConfig();
	}
	
	function loadPluginConfig() {
		DEBUG.channel("core.js").log("loadPluginConfig");
		$.getJSON("../../PLUGIN/data/config.json", onPluginConfigLoaded);
	}

	function onPluginConfigLoaded(json) {
		DEBUG.channel("core.js").log("onPluginConfigLoaded").json(json);
		CONFIG.update(json);
		includePluginJsx();
	}

	function includePluginJsx() {
		DEBUG.channel("core.js").log("includePluginJsx");
		CSHelper.includeJSXInOrder(CONFIG.get("PLUGIN_IMPORTS_JSX"),onIncludePluginJsxComplete);
	}

    function onIncludePluginJsxComplete() {
		DEBUG.channel("core.js").log("onIncludePluginJsxComplete");
		initCoreJsx();
	}

	function initCoreJsx() {
		DEBUG.channel("core.js").log("initCoreJsx");
		CSHelper.csInterface.addEventListener("CORE.JSX.INIT.BEGIN",onCoreJsxInitHandler);
		CSHelper.csInterface.addEventListener("CORE.JSX.INIT.ERROR",onCoreJsxInitHandler);
		CSHelper.csInterface.addEventListener("CORE.JSX.INIT.END",onCoreJsxInitHandler);
		CSHelper.evaluate('CORE.init()');
	}

	function onCoreJsxInitHandler(event) {
		DEBUG.channel("core.js").log("onCoreJsxInitHandler : ").json(event.type);
		switch (event.type) {
			case "CORE.JSX.INIT.BEGIN":
				break;
			case "CORE.JSX.INIT.ERROR":
				break;
			case "CORE.JSX.INIT.END":
				CSHelper.csInterface.removeEventListener("CORE.JSX.INIT.BEGIN",onCoreJsxInitHandler);
				CSHelper.csInterface.removeEventListener("CORE.JSX.INIT.ERROR",onCoreJsxInitHandler);
				CSHelper.csInterface.removeEventListener("CORE.JSX.INIT.END",onCoreJsxInitHandler);
				CONFIG.synch(onConfigSynched);
				break;
		}
		
	}

	function onConfigSynched(res) {
		DEBUG.channel("core.js").log("onConfigSynched : ").json(res);
		loadModules();
	}

	function loadModules() {
		DEBUG.channel("core.js").log("initModules");
		var auto = CONFIG.get("PLUGIN_MODULES_AUTO_DETECT");
		if (auto) {
			getModulesFolders();
		} else {
			start(); // TODO : HANDLE PLUGIN_MODULES_AUTO_DETECT = false
		}
		
	}

	function getModulesFolders() {
		modules_path = CONFIG.get("PLUGIN_MODULES_AUTO_DETECT_PATH");
		if (!modules_path) modules_path = CONFIG.get("DEFAULT_MODULES_AUTO_DETECT_PATH");
		modules_path = ENV.EXTENTION_PATH + modules_path;
		CSHelper.evaluate('$jsx.getFolderContentJsonFromPath("'+modules_path+'")',onGetModulesFoldersComplete);
		//TEST FOR NODE VERSION
		/*
		var res = ENV.NODE_LIB_FS.readdirSync(modules_path);
		onGetModulesFoldersComplete(res);
		*/
	}

	function onGetModulesFoldersComplete(res) {
		//TEST FOR NODE VERSION
		/*
		var modules_folders = res;
		modules_folders.splice(modules_folders.indexOf("desktop.ini", 1));
		//IN LOOP : module_path = modules_path+"/"+modules_folders[i];
		*/
		DEBUG.channel("core.js").log("onGetModulesFoldersComplete :").json(res);
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
		modulesDef.push(def);
	}

	function includeModulesJsx() {
		DEBUG.channel("core.js").log("includeModulesJsx");
		var n = modulesDef.length;
		var m;
		var jsx_paths = [];
		for (var i=0;i<n;i++) {
			m = modulesDef[i];
			jsx_paths.push(m.jsxPath);
		}
		CSHelper.includeJSXInOrder(jsx_paths,onIncludeModulesJsxComplete);
	}

	function onIncludeModulesJsxComplete() {
		DEBUG.channel("core.js").log("onIncludeModulesJsxComplete");
		start();
	}
    
    function start() {
		DEBUG.channel("core.js").log("start");
		initGlobalListeners();
		startCoreJsx();
	}

	function initGlobalListeners() {
		DEBUG.channel("core.js").log("initGlobalListeners");
		init_CSXSEvent_Native_Listeners();
		init_CSXSEvent_Custom_Listeners();
		init_CEPEvent_Native_Listeners();
	}

	function startCoreJsx() {
		DEBUG.channel("core.js").log("startCoreJsx");
		CSHelper.csInterface.addEventListener("CORE.JSX.START.BEGIN",onCoreJsxStartHandler);
		CSHelper.csInterface.addEventListener("CORE.JSX.START.ERROR",onCoreJsxStartHandler);
		CSHelper.csInterface.addEventListener("CORE.JSX.START.END",onCoreJsxStartHandler);
		CSHelper.evaluate('CORE.start()');
	}

	function onCoreJsxStartHandler(event) {
		DEBUG.channel("core.js").log("onCoreJsxStartHandler : ").json(event.type);
		switch (event.type) {
			case "CORE.JSX.START.BEGIN":
				break;
			case "CORE.JSX.START.ERROR":
				break;
			case "CORE.JSX.START.END":
				CSHelper.csInterface.removeEventListener("CORE.JSX.START.BEGIN",onCoreJsxStartHandler);
				CSHelper.csInterface.removeEventListener("CORE.JSX.START.ERROR",onCoreJsxStartHandler);
				CSHelper.csInterface.removeEventListener("CORE.JSX.START.END",onCoreJsxStartHandler);
				launchModules();
				break;
		}
		
	}

	function launchModules() {
		DEBUG.channel("core.js").log("launchModules");
		buildModules();
		initModules();
		startModules();
		onReady();
	}

	

	function buildModules() {
		DEBUG.channel("core.js").log("buildModules");
		var n = modulesDef.length;
		var def;
		var m;
		for (var i=0;i<n;i++) {
			def = modulesDef[i];
			m = def.build();
			modules.push(m);
		}
		onBuildModulesComplete();
	}

	function onBuildModulesComplete() { DEBUG.channel("core.js").log("onBuildModulesComplete"); }

	function initModules() {
		DEBUG.channel("core.js").log("initModules");
		var n = modules.length;
		var m;
		for (var i=0;i<n;i++) {
			m = modules[i];
			m.init();
		}
		onInitModulesComplete();
	}

	function onInitModulesComplete() { DEBUG.channel("core.js").log("onInitModulesComplete"); }

	function startModules() {
		DEBUG.channel("core.js").log("startModules");
		var n = modules.length;
		var m;
		for (var i=0;i<n;i++) {
			m = modules[i];
			m.start();
		}
		onStartModulesComplete();
		
	}

	function onStartModulesComplete() { DEBUG.channel("core.js").log("onStartModulesComplete"); }

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

	function init_CSXSEvent_Custom_Listeners() {
		CSHelper.csInterface.addEventListener("CSXSEvent_Custom", on_CSXSEvent_Custom_Handler);
	}
	function on_CSXSEvent_Custom_Handler(event) {
		DEBUG.channel("csxs_custom_events").log("on_CSXSEvent_Custom_Handler");
		var encapsulatedEvent = JSON.parse(JSON.stringify(event.data));
		var encapsulatedData = JSON.parse(cleanJsonString(encapsulatedEvent.data));
		DEBUG.channel("csxs_custom_events")
			.stack("on_CSXSEvent_Custom_Handler")
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

	function onReady() {
		//OK TO GO
	}
	

	function cleanJsonString(jsonString) {
		var regex = new RegExp(/\\"/g);
		jsonString = jsonString.replace(regex,'"');
		return jsonString;
	}

	function test() { DEBUG.channel("core.js").log("test"); }
	
	return (
		{	
			test:test
		}
	)

}());