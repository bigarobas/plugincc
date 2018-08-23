Environment = function (csi) {
	if (!csi) csi = new CSInterface();
	this._CSI = csi;

	this.NODE_VERSION = process.versions.node;
	this.NODE_LIB_PATH = require('path');
	this.NODE_LIB_FS = require('fs');
	this.NODE_MAJOR_VERSION = parseInt(this.NODE_VERSION.split(".")[0]);
	this.NODE_ES_TYPE = (this.NODE_MAJOR_VERSION<2) ? "es5" : "es6";
	this.EXTENTION_PATH =  this._CSI.getSystemPath(SystemPath.EXTENSION);
	this.EXTENTION_ID =  this._CSI.getExtensionID();
	this.HOST = this._CSI.getHostEnvironment();
	this.HOST_APP_ID = this.HOST.appId;
	this.OS_TYPE = (this._CSI.getOSInformation().indexOf("Windows") >=0) ? "win" : "mac";
	this.EXTENTION_DEBUG_PORTS = this.getDebugPortsMap();
	this.EXTENTION_DEBUG_PORT = this.EXTENTION_DEBUG_PORTS[this.HOST_APP_ID];
	this.EXTENTION_DEBUG_URL = "http://localhost:"+this.EXTENTION_DEBUG_PORT+"/";
}

Environment.prototype.openDebugUrl = function() {
	this._CSI.openURLInDefaultBrowser(this.EXTENTION_DEBUG_URL);
}

Environment.prototype.getAbsolutePath = function(filepath) {
	if (filepath[0] === '~') {
		switch (this.NODE_ES_TYPE) {
			case "es5":
				filepath = this.NODE_LIB_PATH.join(process.env.HOME, filepath.slice(1));
			break;
			default :
				filepath = this.NODE_LIB_PATH.join(process.env.HOMEDRIVE+process.env.HOMEPATH, filepath.slice(1));
			break;
		}
	}
	return this.getCleanPath(filepath);
}

Environment.prototype.getRelativePath = function(filepath) {
	filepath = this.getCleanPath(filepath);
	filepath = filepath.replace(this.EXTENTION_PATH,"");
	return filepath;
}

Environment.prototype.getCleanPath = function(filepath) {
	var regex = new RegExp(/\\/g);
	filepath = filepath.replace(regex,"/");
	regex = new RegExp(/%20/g);
	filepath = filepath.replace(regex," ");
	return filepath;
}


Environment.prototype.getDebugPortsMap = function() {
	var debugPath = this.EXTENTION_PATH+"/.debug";
	var debugTXT = this.NODE_LIB_FS.readFileSync(debugPath,'utf8');
	var parser = new DOMParser();
	var debugXML = parser.parseFromString(debugTXT,"text/xml");
	var hosts = debugXML.evaluate(".//Host", debugXML, null, XPathResult.ANY_TYPE,null);
	var result = [];
	var host = hosts.iterateNext();
	while (host) {
		result[host.getAttribute("Name")] = host.getAttribute("Port");
		host = hosts.iterateNext();
	} 
	return result;
}

Environment.prototype.getContext = function() {
	var ctx = (typeof console !== 'undefined') ? "js" : "jsx"; // FIND A BETTER SOLUTION
	return ctx;
}

if ( typeof module === "object" && typeof module.exports === "object" ) {
	module.exports = Environment;
} 
