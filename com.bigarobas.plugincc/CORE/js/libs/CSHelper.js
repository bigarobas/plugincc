//require CSInterface.js
//require includeJsx function in main JSX

CSHelper = 
(function () {
    'use strict';

    var csInterface = new CSInterface();
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION);
    
    function includeJSX(path,callBack) {
       var expr = 'CORE.includeJSX("' + extensionRoot + '/' + path + '")';
       console.log(expr);
       evaluate(expr,callBack);
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
            //console.log(res);
            includeJSX(path,includeNext);
        } 
    }
	
	/*
	function addNotifier(eventId,classId,jsxRelativePath) {
		//alert("COUCOU");
		var res = evaluate('addNotifier("'+eventId+'","'+classId+'","' + extensionRoot + '/' + jsxRelativePath + '")');
		//alert("OK");
       return res;
	}
	*/
    
    function evaluate(expression,callBack) {
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
            evaluate : evaluate,
            csInterface : csInterface,
            rgbToHex : rgbToHex,
            getDOMObjectMousePosition : getDOMObjectMousePosition
        }
    )
    
}());