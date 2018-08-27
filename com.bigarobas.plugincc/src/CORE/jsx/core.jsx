/*
EVENTS : 
CORE.JSX.PREPARE.BEGIN
CORE.JSX.PREPARE.END
CORE.JSX.INIT.BEGIN
CORE.JSX.INIT.END
CORE.JSX.START.BEGIN
CORE.JSX.START.END
*/

DEBUG = debug = null;
JSXH = jsxh = null;
CONFIG = config = null;

CORE = (function () {
    'use strict';

        var PlugPlugExternalObjectLib;
        var _bridge = null; 
        var _extension_path = null;
       
        function prepare(path) {
            _extension_path = path;
            includeJSX(_extension_path+"/"+"CORE/jsx/libs/json2.jsx");
            includeJSX(_extension_path+"/"+"CORE/jsx/libs/es5-shim.jsx");
            includeJSX(_extension_path+"/"+"CORE/mixed/JSXBridge.jsx");
            return true;
        }

        function init() {
            initBridge();
            dispatchBridgeEvent("CORE.JSX.INIT.BEGIN");
            initDebugger();
            initPlugPlugExternalObjectLib();
            initConfig(); 
            dispatchBridgeEvent("CORE.JSX.INIT.END");
        }

        function initBridge() {
            _bridge = new JSXBridge(this,"CORE"); 
        }

        function initDebugger() {
            Debugger.setBridgeName("Debugger");
            DEBUG = debug = Debug = new Debugger();
            DEBUG.channel('core.jsx').setVerbose(true,true,true);
        
            //JSXH = new JSXHelper2();

        }

        function initConfig() {
            CONFIG = config = new Configuration("CONFIG");
        }

        function initPlugPlugExternalObjectLib() {
            if (typeof CSXSEvent == 'undefined') {
                try {
                    PlugPlugExternalObjectLib = new ExternalObject("lib:\PlugPlugExternalObject");
                } catch (e) { 
                    alert("CORE.jsx couldn't create lib:\PlugPlugExternalObject");
                    alert(e); 
                    return false;
                }
            }	
            dispatchBridgeEvent("CORE.JSX.PLUGPLUG.INITIALIZED");
        }

        function start() {
            dispatchBridgeEvent("CORE.JSX.START.BEGIN");
            dispatchBridgeEvent("CORE.JSX.START.END");
        }
        
        function test() {
            DEBUG.channel('core.jsx').popup("test");
        }

        function includeJSX(path) {
            //if (JSXH != null) return JSXH.includeJSX(path); //TODO RETHINK DEPENDENCY

             try {
                var res = $.evalFile(path);
                return (res);
            } catch (e) {
                alert("Exception:" + e);
            }
        }

        function includeJSXFolder(path) {
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

        function dispatchBridgeEvent(type,data,scope) {
            var event = _bridge.createBridgeEvent(type,data,scope);
            _bridge.dispatchBridgeEvent(event);
        }

        return ( 
                {
                    prepare : prepare,
                    init : init,
                    start : start,
                    includeJSX : includeJSX,
                    includeJSXFolder : includeJSXFolder,
                    test : test
                }
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
    
    




