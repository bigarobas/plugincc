JSXHelper2 = function () {

    'use strict';

	if (!JSXHelper2.isInitialized()) JSXHelper2.init();

}

JSXHelper2.prototype.includeJSX = function (path,callBack) {
    if (JSXHelper2._ctx == "js") {
       this._callBridge('includeJSX("'+path+'")');
    } else {
        try {
            var res = $.evalFile(path);
            alert(path);
            if (callBack) callBack(res);
            return (res);
        } catch (e) {
            alert("Exception:" + e);
        }
    }
}

JSXHelper2.prototype.popup = function (message,callBack) {
    if (JSXHelper2._ctx == "js") {
       this._callBridge('popup("'+message+'")');
    } else {
        alert(message);
    }
}

JSXHelper2.prototype._callBridge = function (expression,callBack) {

    if (typeof JSXHelper2._csInterface == 'undefined') return;
    var jsxBridgeName = this._jsxBridgeName;
    if (jsxBridgeName == undefined) jsxBridgeName = JSXHelper2._jsxBridgeName;
    if (jsxBridgeName == undefined) return;
    var jsxExp = jsxBridgeName+'.'+expression;
    JSXHelper2._csInterface.evalScript(jsxExp,callBack);
}

JSXHelper2._ctx = undefined;
JSXHelper2._jsxBridgeName = undefined;
JSXHelper2._csInterface = undefined;
JSXHelper2._initialized = false;

JSXHelper2.isInitialized = function() {
	return JSXHelper2._initialized;
}

JSXHelper2.hasCSInterface = function() {
	return (JSXHelper2._csInterface != undefined);
}

JSXHelper2.hasJsxBridgeName = function() {
	return (JSXHelper2._jsxBridgeName != undefined);
}

JSXHelper2.init = function() {
	if (JSXHelper2._initialized) return true;
	JSXHelper2._ctx = (typeof console !== 'undefined') ? "js" : "jsx";

	if (JSXHelper2._ctx == "js") {
		if (!JSXHelper2.hasCSInterface()) {
			try {
				JSXHelper2.setCSInterface(new CSInterface());
			} catch (e) {
				JSXHelper2._writeln("JSXHelper2 couldn't find CSInterface Class");
				JSXHelper2._writeln(e);
			}
		}
	}	

	JSXHelper2._initialized = true;
}

JSXHelper2.setCSInterface = function (csi) {
	JSXHelper2._csInterface = csi;
}

JSXHelper2.setJSXBridgeName = function (bridgeName) {
	JSXHelper2._jsxBridgeName = bridgeName;
}

if (typeof console !== 'undefined') module.exports = JSXHelper2;

/*
    
}

        function importJsxFolder(path) {
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

JSXHelper2._ctx = undefined;
JSXHelper2._jsxBridgeName = undefined;
JSXHelper2._csInterface = undefined;
JSXHelper2._initialized = false;

JSXHelper2.isInitialized = function() {
	return JSXHelper2._initialized;
}

JSXHelper2.hasCSInterface = function() {
	return (JSXHelper2._csInterface != undefined);
}

JSXHelper2.hasJsxBridgeName = function() {
	return (JSXHelper2._jsxBridgeName != undefined);
}

JSXHelper2.init = function() {
	if (JSXHelper2._initialized) return true;
	JSXHelper2._ctx = (typeof console !== 'undefined') ? "js" : "jsx";

	if (JSXHelper2._ctx == "js") {
		if (!JSXHelper2.hasCSInterface()) {
			try {
				JSXHelper2.setCSInterface(new CSInterface());
			} catch (e) {
				JSXHelper2._writeln("JSXHelper2 couldn't find CSInterface Class");
				JSXHelper2._writeln(e);
			}
		}
	}	

	JSXHelper2._initialized = true;
}

JSXHelper2.setCSInterface = function (csi) {
	JSXHelper2._csInterface = csi;
}

JSXHelper2.setJSXBridgeName = function (bridgeName) {
	JSXHelper2._jsxBridgeName = bridgeName;
}

JSXHelper2._jsx = function (message,jsxBridgeName) {
	if (JSXHelper2._ctx == "jsx") {
		alert(message);
	} else {
		alert(message);
		if (typeof JSXHelper2._csInterface !== 'undefined') {
			if (jsxBridgeName == undefined) jsxBridgeName = JSXHelper2._jsxBridgeName;
			if (jsxBridgeName != undefined) {
				var expr = jsxBridgeName+'.popup("'+"[from chrome] \\r"+message+'")';
				JSXHelper2._csInterface.evalScript('expr');
			}
		}
	}
}


if (typeof console !== 'undefined') module.exports = JSXHelper2;

function JSXHelper2() {

    'use strict';

    if (!JSXHelper2.isInitialized()) JSXHelper2.init();
    
}
*/

/*
JSXHelper2 = 
$jsx =
(function () {
    'use strict';

    var csInterface = new CSInterface();
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION);
    
    function includeJSX(path,callBack) {
       var expr = 'CORE.importJsx("' + extensionRoot + '/' + path + '")';
       jsx(expr,callBack);
    }

    function includeJSXInOrder(paths,callBack) {
        var n = paths.length;
        var included = 0;
        includeNext(null);
        function includeNext(res) {
            if (included>=n) {
                if (callBack) callBack();
                return null;
            } 
            var path = paths[included];
            included++;
            //console.log("includeInOrder : "+included + " : "+path);
            includeJSX(path,includeNext);
        } 
    }
	

	function addNotifier(eventId,classId,jsxRelativePath) {
		//alert("COUCOU");
		var res = jsx('addNotifier("'+eventId+'","'+classId+'","' + extensionRoot + '/' + jsxRelativePath + '")');
		//alert("OK");
       return res;
	}

    
    function jsx(expression,callBack) {
       csInterface.evalScript(expression,callBack);
       //console.log("jsx > "+expression);
    }

  
    
    function rgbToHex(r, g, b) {
        //return ((r << 16) | (g << 8) | b).toString(16);
        var rgb = b | (g << 8) | (r << 16);
        return (0x1000000 | rgb).toString(16).substring(1);
    }

    function getDOMObjectMousePosition(obj,event) {
        var rect = obj.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
    }
    
    return ( 
        {
            includeJSX : includeJSX,
            includeJSXInOrder : includeJSXInOrder,
			//addNotifier : addNotifier,
            jsx : jsx,
            csInterface : csInterface,
            rgbToHex : rgbToHex,
            getDOMObjectMousePosition : getDOMObjectMousePosition
        }
    )
    
}());


$JSX=
$jsx=
JSXHelper2 = 
(function () {
    'use strict';

	function test () { alert("JSXHelper2.test"); }

    function rgbToHex (r, g, b) {
        //return ((r << 16) | (g << 8) | b).toString(16);
        var rgb = b | (g << 8) | (r << 16);
        return (0x1000000 | rgb).toString(16).substring(1);
    }

    function getActionDescFromID(id) {
        var id = Number(id);
        var desc = new ActionDescriptor();
        desc.fromID(id);
        var ref = desc.getReference(s2t('target'));
        var eventClass = ref.getDesiredClass();
        return t2s(eventClass);
    }

    function s2t (s) { return app.stringIDToTypeID(s); }

    function t2s (t) { return app.typeIDToStringID(t); }

    

    function getFolderContent(folder) {
		var content = folder.getFiles();
        return(content);
    }

    function getFolderContentJson(folder) {
		var content = getFolderContent(folder);
        var res = [];
        for (var i = 0 ; i < content.length ; i++) {
            res.push(content[i].fullName);
        }
        res = JSON.stringify(res);
        return res;
    }
    function getFolderContentJsonFromPath(path) {
		var folder = new Folder(path);
        return getFolderContentJson(folder);
    }

    function getFolderContentFromPath(path) {
        var folder = new Folder(path);
        return getFolderContentJson(folder);
    }
	
    function selectFolder(path,prompt) {
        if (path==null) return Folder.selectDialog(prompt);
        var folder = new Folder(path);
        return folder.selectDlg(prompt);
    }

    function selectFolderAndGetContent(path,prompt) {
        var folder = selectFolder(path,prompt);
        if (folder == null) return null;
        var content = getFolderContent(folder);
        if (content == null) return null;
        return content;
    }



    return ( 
        {
            rgbToHex : rgbToHex,
            getActionDescFromID : getActionDescFromID,
            s2t : s2t,
            t2s : t2s,
            getFolderContent : getFolderContent,
            getFolderContentJson:getFolderContentJson,
            getFolderContentFromPath : getFolderContentFromPath,
            getFolderContentJsonFromPath:getFolderContentJsonFromPath,
            selectFolder : selectFolder,
            selectFolderAndGetContent : selectFolderAndGetContent,
            test : test
        }
    );


}());

 
//


// JSX SIDE



//
/*
jsx_getDescFromID = function(id) {
	var id = Number(id);
	var desc = new ActionDescriptor();
	desc.fromID(id);
	var ref = desc.getReference(jsx_s2t('target'));
	var eventClass = ref.getDesiredClass();
	return jsx_t2s(eventClass);
}

jsx_s2t = function(s) { return app.stringIDToTypeID(s); }
jsx_t2s = function(t) { return app.typeIDToStringID(t); }

jsx_getLayers = function(root,layers) {
    //alert("jsx_getLayers");
    var layer, isLayerSet; 
    if (layers == null) layers = [];
    var n = root.layers.length;
    //alert("jsx_getLayers n="+n);
    for (var i = 0 ; i < n ; i++) {
            layer = root.layers[i];
            isLayerSet = layer.typename == "LayerSet";
            if (isLayerSet) {
                jsx_getLayers(layer,layers);
            } else {
                layers.push(layer);
            }
    }
    //alert("jsx_getLayers layers="+layers);
    return layers;
}

jsx_checkOrCreateFolder = function(folderPath) {
        var folder = new Folder(folderPath);
        if(!folder.exists) folder.create();
        return folder;
    }


jsx_getLayersFullObjects = function(root,inheritence) {
 
    if (inheritence == null) {
        inheritence = {
            name : null,
            fullName : null,
        }
    }
    var layer, isLayerSet; 
    var layersObject = [];
    var n = root.layers.length;
    for (var i = 0 ; i < n ; i++) {
            layer = layerSet.layers[i];
            isLayerSet = layer.typename == "LayerSet";
            if (isLayerSet) {
                jsx_getLayers(layer);
            } else {
                layers.push(layer);
            }
    }
    return layersObject;

}

jsx_setFGColorFromHexValue = function (hexValue) {
    var color = new SolidColor();
    color.rgb.hexValue = hexValue;
    app.foregroundColor = color;
}

jsx_setBGColorFromHexValue = function (hexValue) {
    var color = new SolidColor();
    color.rgb.hexValue = hexValue;
    app.backgroudColor = color;
}

jsx_processLayers = function (root,func,func_params) {
    
};


jsx_timeline_goto = function(frameNumber,frameRate){  

    var jumpToFrameNumber = frameNumber; // counts from 1  
    var desc = new ActionDescriptor();  
    var ref1 = new ActionReference();  
    ref1.putIndex( stringIDToTypeID( "animationFrameClass" ), jumpToFrameNumber );  
    desc.putReference( charIDToTypeID( "null" ), ref1 );  
    executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO ); 
 
    //alert("TEST 1");
    
    var idsetd = charIDToTypeID( "setd" );
    var desc30 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref7 = new ActionReference();
        var idPrpr = charIDToTypeID( "Prpr" );
        var idtime = stringIDToTypeID( "time" );
        ref7.putProperty( idPrpr, idtime );
        var idtimeline = stringIDToTypeID( "timeline" );
        ref7.putClass( idtimeline );
    desc30.putReference( idnull, ref7 );
    var idT = charIDToTypeID( "T   " );
        var desc31 = new ActionDescriptor();
        var idseconds = stringIDToTypeID( "seconds" );
        desc31.putInteger( idseconds, 0 );
    
    //alert("TEST 2");
        
        //FRAME NUMBER
        var idframe = stringIDToTypeID( "frame" );
        desc31.putInteger( idframe, frameNumber );
    
    //alert("TEST 3");
        
        //FRAME RATE
        var idframeRate = stringIDToTypeID( "frameRate" );
        desc31.putDouble( idframeRate, frameRate );
    
    //alert("TEST 4");
    
    var idtimecode = stringIDToTypeID( "timecode" );
    desc30.putObject( idT, idtimecode, desc31 );
    executeAction( idsetd, desc30, DialogModes.NO );
    
    //alert("TEST 5");
};

jsx_timeline_getFrameCount = function(){  
     var ref = new ActionReference();  
     ref.putProperty( charIDToTypeID( 'Prpr' ), stringIDToTypeID( "frameCount" ) );  
     ref.putClass( stringIDToTypeID( "timeline" ) );  
     var desc = new ActionDescriptor();  
     desc.putReference( charIDToTypeID( 'null' ), ref );  
     var resultDesc = executeAction( charIDToTypeID( 'getd' ), desc, DialogModes.NO );  
    
     return resultDesc.getInteger( stringIDToTypeID( "frameCount" ) );  
};

jsx_timeline_getFrameRate = function(){  
    var ref = new ActionReference();  
     ref.putProperty( charIDToTypeID( 'Prpr' ), stringIDToTypeID("documentTimelineSettings") );  
      ref.putClass( stringIDToTypeID( "timeline" ) );  
     var desc = new ActionDescriptor();  
     desc.putReference( charIDToTypeID( 'null' ), ref );  
     var resultDesc = executeAction( charIDToTypeID( 'getd' ), desc, DialogModes.NO );  
  
     return resultDesc.getDouble( stringIDToTypeID('frameRate') );  
};

jsx_verbose = true;

jsx_alert = function (message) {
    if (!jsx_verbose) return;
    alert(message);
    //console.log(message);
};


jsx_str_whitespaceless = function (s) {
	return (s.replace(/\s/g, ""));
}

jsx_dispatch_event_to_panel = function (type,data) {
	if (data == null || data == undefined) data = "";
	var csxsEvent = new CSXSEvent();
	csxsEvent.type = type;
	csxsEvent.data = data;
	csxsEvent.dispatch();
}

#####################################################
IDSN GLOBALS
#####################################################

jsx_idsn_getPageItemType = function (item) {
	return item.getElements()[0].constructor.name;
}

jsx_idsn_getPageByID = function (page_id) {
	var doc=app.activeDocument;
	var page = doc.pages.itemByID(page_id);
	return page;
}

jsx_idsn_selectPageByID = function (page_id) {
	var page = jsx_idsn_getPageByID(page_id);
	var window = app.activeWindow;
	window.activePage = page;
	return page;
}

jsx_idsn_setViewQuality = function (quality) {
	var window = app.activeWindow;
	switch (quality) {
		case "HIGH_QUALITY":
			quality = ViewDisplaySettings.HIGH_QUALITY;
			break;
		case "TYPICAL":
			quality = ViewDisplaySettings.TYPICAL;
			break;
		case "OPTIMIZED":
			quality = ViewDisplaySettings.OPTIMIZED;
			break;
		default :
			quality = null;
			break;
			
	}
	if (quality==null) return;
	window.viewDisplaySetting = quality;
}

jsx_padNumber = function (n, width, z) {
	  z = z || '0';
	  n = n + '';
	  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

/*#####################################################
									   END IDSN GLOBALS
#####################################################*/


/*
jsx_logger = (function () {
    'use strict';
    
    var channels = [];
    
    function channel(id) {
        
        var channel = (channels[id] == null) ? createChannel(id) : channels[id];
    }
    
    function createChannel(id) {
        var channel = (channels[id] == null) ? 
            (function () { return ( {
                log : function (message) {
                    
                }
            } ) }());
             : channels[id];
    }
    
    function log(message,channel) {
        
    }
    
    return ( 
        {
            channel : channel,
            applyPalette : applyPalette,
            selectFiles : selectFiles
        }
    )
    
}());
*/

