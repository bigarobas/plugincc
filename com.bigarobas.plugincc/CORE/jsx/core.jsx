/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/

//FIRST JSX TO BE LOADED 
//THERE IS NO OTHER CORE CONST AVAILABLE YET

DEBUG = debug = Debug = null;
JSXH = null;

CORE = (function () {
    'use strict';

        var PlugPlugExternalObjectLib;

        function init() {
            initLogger();
            initPlugPlugExternalObjectLib();
            dispatchCustomEvent("CORE.JSX.INIT");
            DEBUG.channel('core.jsx').log("initialized");
        }

        function initLogger() {
            DEBUG = debug = Debug = new Debugger();
            DEBUG.channel('core.jsx').setVerbose(true,true,true);
        
            JSXH = new JSXHelper2();
            //JSXH.popup("SUPER TEST FROM JSX");
        }

        function initPlugPlugExternalObjectLib() {
            try {
                PlugPlugExternalObjectLib = new ExternalObject("lib:\PlugPlugExternalObject");
            } catch (e) { 
                alert(e) 
            }
            DEBUG.channel('core.jsx').log("initPlugPlugExternalObjectLib : "+PlugPlugExternalObjectLib);
        }

        function start() {
            dispatchCustomEvent("CORE.JSX.START");
            DEBUG.channel('core.jsx').log("started");
        }
        
        function test() {
            DEBUG.channel('core.jsx').popup("test");
        }

        function includeJSX(path) {
            if (JSXH != null) return JSXH.includeJSX(path); //TODO RETHINK DEPENDENCY

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

        

        function onAppEventHandler(event) {
            var type = event.eventType;
            var evt = {};
            evt.type = type;
            dispatchNativeEvent(evt);
        }

        function dispatchNativeEvent(event) {
            var eventObj = new CSXSEvent();
            eventObj.type = "CSXSEvent_Native";
            eventObj.data = JSON.stringify(event);
            eventObj.dispatch();
        }

        function encapsulateEventAndDispatch(event) {
            var eventObj = new CSXSEvent();
            eventObj.type = "CSXSEvent_Custom";
            eventObj.data = (!event) ? {} : JSON.stringify(event);
            eventObj.dispatch();
        }

        function dispatchCustomEvent(type,data) {
            var dataEvent = new CSXSEvent();
            dataEvent.type = type;
            dataEvent.data = (!data) ? JSON.stringify({type:type}) : JSON.stringify(data);
            encapsulateEventAndDispatch(dataEvent);
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




