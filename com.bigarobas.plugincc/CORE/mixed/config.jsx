CONFIG = (function () {
    'use strict';
    var ctx = (typeof console !== 'undefined') ? "js" : "jsx";
	var data = {};
    var self = this;
    var _onPushComplete = null;

    init();

    function init() {
        switch (ctx) {
            case "js":
                break;
            case "jsx" :
                //set("super_test","haha");
                break;
        }
    }

    function update(json) {
        if(!json) return false;
        for (var key in json) {
            // Avoid returning these keys from the Associative Array that are stored in it for some reason
            if (key !== undefined && key !== "toJSONString" && key !== "parseJSON" ) {
                data[key] = json[key];
            }
        }
        return true;
    }
    
    function get(key) {
        var value = data[key];
        return value;
    }

    function set(key,value) {
        data[key] = value;
    }

    function synchPush(onComplete) {
        _onPushComplete = onComplete;
        switch (ctx) {
            case "js":
                var json_string = JSON.stringify(data);
                CSHelper.evaluate('CONFIG.synchPull('+json_string+')',onSynchPushComplete);
                break;
            case "jsx" :
                //TODO
                break;
        }
    }


    function onSynchPushComplete(res) {
        var json = JSON.parse(res);
        update(json);
        _onPushComplete(json);
    }

    function synchPull(json) {
        switch (ctx) {
            case "js":
                update(json);
                //TODO
                break;
            case "jsx" :
                update(json);
                return JSON.stringify(data);
                break;
        }
    }

    function getConfigString() {
        return JSON.stringify(data);
    }
    
    return ( 
        {
            update:update,
            get : get,
            set : set,
            getConfigString : getConfigString,
            synchPush : synchPush,
            synchPull : synchPull,		
        }
    );

    
}());