DEBUG = debug = null;
JSXH = jsxh = null;
CONFIG = config = null;

CORE = (function () {
    'use strict';

        var PlugPlugExternalObjectLib;

        function init() {
            initPlugPlugExternalObjectLib();
            dispatchCustomEvent("CORE.JSX.INIT.BEGIN");
            initLogger();
            initConfig(); 
            DEBUG.channel('core.jsx').log("init");
            dispatchCustomEvent("CORE.JSX.INIT.END");
        }

        function initLogger() {
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
            dispatchCustomEvent("CORE.JSX.PLUGPLUG.INITIALIZED");
        }

        function start() {
            dispatchCustomEvent("CORE.JSX.START.BEGIN");
            DEBUG.channel('core.jsx').log("started");
            dispatchCustomEvent("CORE.JSX.START.END");
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

        function encapsulateCommandAndDispatch(cmd) {
            var event = new CSXSEvent();
            event.type = "CSXSEvent_Custom";
            event.data = (!cmd) ? {} : JSON.stringify(cmd);
            event.dispatch();
        }

        function dispatchCommand(type,data) {
            var event = new CSXSEvent();
            event.type = type;
            event.data = (!data) ? JSON.stringify({type:type}) : JSON.stringify(data);
            encapsulateCommandAndDispatch(event);
        }

        function dispatchCustomEvent(type,data) {
           var event = new CSXSEvent();
            event.type = type;
            event.data = (!data) ? JSON.stringify({type:type}) : JSON.stringify(data);
            event.dispatch();
        }

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
    
    return ( 
        {
            init : init,
            start : start,
            includeJSX : includeJSX,
            includeJSXFolder : includeJSXFolder,
            dispatchCustomEvent : dispatchCustomEvent,
            test : test
        }
    );
    
}());




