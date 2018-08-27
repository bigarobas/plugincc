Environment = function (csi,bridgeName) {
	this.CONTEXT = (typeof console !== 'undefined') ? "js" : "jsx";
    this.bridge = new JSXBridge(this,bridgeName);
	if (this.CONTEXT == "js") {
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
	} else {
		this._CSI = null;
		this.NODE_VERSION = null;
		this.NODE_LIB_PATH = null;
		this.NODE_LIB_FS = null;
		this.NODE_MAJOR_VERSION = null;
		this.NODE_ES_TYPE = null;
		this.EXTENTION_PATH =  null;
		this.EXTENTION_ID =  null;
		this.HOST = null;
		this.HOST_APP_ID = null;
		this.OS_TYPE = null;
		this.EXTENTION_DEBUG_PORTS = null;
		this.EXTENTION_DEBUG_PORT = null;
		this.EXTENTION_DEBUG_URL = null;
	}
}

Environment.prototype.setSynchableValues = function(data) {
	this.NODE_VERSION 					= 			data.NODE_VERSION;
	this.NODE_MAJOR_VERSION 			= 			data.NODE_MAJOR_VERSION;
	this.NODE_ES_TYPE					= 			data.NODE_ES_TYPE;
	this.EXTENTION_PATH 				= 			data.EXTENTION_PATH;
	this.EXTENTION_ID 					= 			data.EXTENTION_PATH;
    this.HOST       					= 			data.HOST;
	this.HOST_APP_ID 					= 			data.HOST_APP_ID;
	this.OS_TYPE 						= 			data.OS_TYPE;
	this.EXTENTION_DEBUG_PORT 			= 			data.EXTENTION_DEBUG_PORT;
	this.EXTENTION_DEBUG_URL 			= 			data.EXTENTION_DEBUG_URL;
    return true;
}

Environment.prototype.getSynchableValues = function() {
	var data = {};
	data.NODE_VERSION 					= 			this.NODE_VERSION;
	data.NODE_MAJOR_VERSION 			= 			this.NODE_MAJOR_VERSION;
	data.NODE_ES_TYPE					= 			this.NODE_ES_TYPE;
	data.EXTENTION_PATH 				= 			this.EXTENTION_PATH;
	data.EXTENTION_PATH 				=	 		this.EXTENTION_ID;
    data.HOST       					= 			this.HOST;
	data.HOST_APP_ID 					= 			this.HOST_APP_ID;
	data.OS_TYPE 						= 			this.OS_TYPE;
	data.EXTENTION_DEBUG_PORT 			= 			this.EXTENTION_DEBUG_PORT;
	data.EXTENTION_DEBUG_URL 			= 			this.EXTENTION_DEBUG_URL;
	return data;

}

Environment.prototype.openDebugUrl = function() {
	if (this.CONTEXT == "js") {
		this._CSI.openURLInDefaultBrowser(this.EXTENTION_DEBUG_URL);
	} else {
		//TODO : to implement on JSX side ?
	}
}

Environment.prototype.getAbsolutePath = function(filepath) {
	if (this.CONTEXT == "js") {
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
	} else {
		//TODO : to implement on JSX side ?
		return filepath;
	}
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
	if (this.CONTEXT == "js") {
        var result = [];
		var debugPath = this.EXTENTION_PATH+"/.debug";
		var debugTXT = this.NODE_LIB_FS.readFileSync(debugPath,'utf8');
		var parser = new DOMParser();
		var debugXML = parser.parseFromString(debugTXT,"text/xml");
		var hosts = debugXML.evaluate(".//Host", debugXML, null, XPathResult.ANY_TYPE,null);
		var host = hosts.iterateNext();
		while (host) {
			result[host.getAttribute("Name")] = host.getAttribute("Port");
			host = hosts.iterateNext();
		} 
		return result;
	} else {
		return [];
		//TODO : to implement on JSX side ?
	}
}

Environment.prototype.getContext = function() {
	return this.CONTEXT;
}

if ( typeof module === "object" && typeof module.exports === "object" ) {
	module.exports = Environment;
} 
