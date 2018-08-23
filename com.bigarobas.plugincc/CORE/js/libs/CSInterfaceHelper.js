//require CSInterface.js
//require includeJsx function in main JSX

CSInterfaceHelper = function(csi) {
    'use strict';
    if (!csi) csi = new CSInterface();
    this.csInterface = csi;
    this.extentionPath = this.csInterface.getSystemPath(SystemPath.EXTENSION);
}

CSInterfaceHelper.prototype.includeJSX = function(path,callBack) {
    var expr = 'CORE.includeJSX("' + this.extentionPath + '/' + path + '")';
    this.evaluate(expr,callBack);
 }

CSInterfaceHelper.prototype.includeJSXInOrder = function(paths,callBack) {
    var n = paths.length;
    var included = 0;
    var self = this;
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
        self.includeJSX(path,includeNext);
    } 
}
 
 /*
 CSInterfaceHelper.prototype.addNotifier(eventId,classId,jsxRelativePath) {
     //alert("COUCOU");
     var res = evaluate('addNotifier("'+eventId+'","'+classId+'","' + extensionRoot + '/' + jsxRelativePath + '")');
     //alert("OK");
    return res;
 }
 */
 
 CSInterfaceHelper.prototype.evaluate = function(expression,callBack) {
    this.csInterface.evalScript(expression,callBack);
    //console.log("jsx > "+expression);
 }


 
 CSInterfaceHelper.prototype.rgbToHex = function(r, g, b) {
     //return ((r << 16) | (g << 8) | b).toString(16);
     var rgb = b | (g << 8) | (r << 16);
     return (0x1000000 | rgb).toString(16).substring(1);
 }

 CSInterfaceHelper.prototype.getDOMObjectMousePosition = function(obj,event) {
     var rect = obj.getBoundingClientRect();
     return {
       x: event.clientX - rect.left,
       y: event.clientY - rect.top
     };
 }


module.exports = CSInterfaceHelper;