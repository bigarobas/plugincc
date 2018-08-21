/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager, CSHelper*/

var Module;
var ModuleDef;


DEBUG = debug = Debug = null;
JSXH = null;

CORE = (function () {
    'use strict';
	var modules = [];
	var modulesDef = [];
	
	var modules_path;

	switch (ENV.NODE_ES_TYPE) {
		case "es5":
			Module = require(CSHelper.csInterface.getSystemPath("extension") + "/CORE/js/modules/es5/Module.js");
			ModuleDef = require(CSHelper.csInterface.getSystemPath("extension") + "/CORE/js/modules/es5/ModuleDef.js");
			break;
		default :
			Module = require(CSHelper.csInterface.getSystemPath("extension") + "/CORE/js/modules/Module.js");
			ModuleDef = require(CSHelper.csInterface.getSystemPath("extension") + "/CORE/js/modules/ModuleDef.js");
			break;
	}
	
	init();

	function init() {
		initLogger();
		DEBUG.channel("core.js").log("init");
		loadCoreConfig();
	}

	function initLogger() {
		Debugger.setJSXBridgeName("DEBUG");
		Debugger.setCSInterface(CSHelper.csInterface);
		DEBUG = debug = Debug = new Debugger();
		DEBUG.channel("core.js").setVerbose(true,true,true);
		DEBUG.channel("csxs_custom_events").setVerbose(false,false,false);
		DEBUG.channel("csxs_native_events").setVerbose(false,false,false);
		DEBUG.channel("cep_native_events").setVerbose(false,false,false);


		JSXHelper2.setJSXBridgeName("JSXH");
		JSXHelper2.setCSInterface(CSHelper.csInterface);
		JSXH = new JSXHelper2();
		
	}


	function loadCoreConfig() {
		$.getJSON("../../CORE/data/config.json", onCoreConfigLoaded);
	}

	function onCoreConfigLoaded(json) {
		DEBUG.channel("core.js").log("onCoreConfigLoaded");
		CONFIG.update(json);
		includeCoreJsx();
		
	}

	function includeCoreJsx() {
		CSHelper.includeJSXInOrder(CONFIG.get("CORE_IMPORTS_JSX"),onIncludeCoreJsxComplete);
	}

	function onIncludeCoreJsxComplete() {
		DEBUG.channel("core.js").log("onIncludeCoreJsxComplete");
		loadPluginConfig();
	}
	
	function loadPluginConfig() {
		$.getJSON("../../PLUGIN/data/config.json", onPluginConfigLoaded);
	}

	function onPluginConfigLoaded(json) {
		DEBUG.channel("core.js").log("onPluginConfigLoaded").json(json);
		CONFIG.update(json);
		includePluginJsx();
	}

	function includePluginJsx() {
		CSHelper.includeJSXInOrder(CONFIG.get("PLUGIN_IMPORTS_JSX"),onIncludePluginJsxComplete);
	}

    function onIncludePluginJsxComplete() {
		DEBUG.channel("core.js").log("onIncludePluginJsxComplete");
		CONFIG.synchPush(onConfigSynched);
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
	}

	function onGetModulesFoldersComplete(res) {
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

	function includeModulesJsx() {
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
		onModulesInitialized();
	}

	function registerModule(id,path) {
		var def = new ModuleDef(id,path);
		modulesDef.push(def);
	}

	function onModulesInitialized(res) {
		DEBUG.channel("core.js").log("onModulesInitialized");
		start();
	}
    
    function start() {
		DEBUG.channel("core.js").log("start");
		init_CSXSEvent_Native_Listeners();
		init_CSXSEvent_Custom_Listeners();
		init_CEPEvent_Native_Listeners();
		
		CSHelper.evaluate('CORE.init()');
		CSHelper.evaluate('CORE.start()');
		CSHelper.evaluate('ModuleA.test()');

		//JSXH.popup("SUPER TEST FROM JS");

		buildModules();
		initModules();
		startModules();

		
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