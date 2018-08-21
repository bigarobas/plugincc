ENV = (function () {
	
	var NODE_VERSION = process.versions.node;
	var NODE_PATH_LIB = require('path');
	var NODE_MAJOR_VERSION = parseInt(NODE_VERSION.split(".")[0]);
	var NODE_ES_TYPE = (NODE_MAJOR_VERSION<2) ? "es5" : "es6";
	var EXTENTION_PATH =  CSHelper.csInterface.getSystemPath("extension");
	var OS_TYPE = (CSHelper.csInterface.getOSInformation().indexOf("Windows") >=0) ? "win" : "mac";

	function getAbsolutePath(filepath) {
		if (filepath[0] === '~') {
			switch (NODE_ES_TYPE) {
				case "es5":
					filepath = NODE_PATH_LIB.join(process.env.HOME, filepath.slice(1));
				break;
				default :
					filepath = NODE_PATH_LIB.join(process.env.HOMEDRIVE+process.env.HOMEPATH, filepath.slice(1));
				break;
			}
		}
		return getCleanPath(filepath);
	}

    function getRelativePath(filepath) {
        filepath = getCleanPath(filepath);
        filepath = filepath.replace(EXTENTION_PATH,"");
        return filepath;
    }

    function getCleanPath(filepath) {
        var regex = new RegExp(/\\/g);
		filepath = filepath.replace(regex,"/");
		regex = new RegExp(/%20/g);
		filepath = filepath.replace(regex," ");
        return filepath;
    }
	
	/*
    function getContext() {
        var ctx = (typeof console !== 'undefined') ? "js" : "jsx"; // FIND A BETTER SOLUTION
        return ctx;
	}
	*/
	
	return {
		NODE_PATH_LIB:NODE_PATH_LIB,
		NODE_VERSION:NODE_VERSION,
		NODE_MAJOR_VERSION:NODE_MAJOR_VERSION,
		NODE_ES_TYPE:NODE_ES_TYPE,
		EXTENTION_PATH:EXTENTION_PATH,
		getAbsolutePath:getAbsolutePath,
		getRelativePath:getRelativePath,
        getCleanPath:getCleanPath

	}
}());