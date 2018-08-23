Configuration = function () {
    'use strict';
    this.ctx = (typeof console !== 'undefined') ? "js" : "jsx";
	this.data = {};
    var _onPushComplete = null;
    this.init();
}

Configuration.prototype.init = function () {
        switch (this.ctx) {
            case "js":
                break;
            case "jsx" :
                //set("super_test","haha");
                break;
        }
    }

Configuration.prototype.update = function(json) {
        if(!json) return false;
        for (var key in json) {
            // Avoid returning these keys from the Associative Array that are stored in it for some reason
            if (key !== undefined && key !== "toJSONString" && key !== "parseJSON" ) {
                this.data[key] = json[key];
            }
        }
        return true;
    }
    
Configuration.prototype.get = function(key) {
        var value = this.data[key];
        return value;
    }

Configuration.prototype.set = function(key,value) {
        this.data[key] = value;
    }

Configuration.prototype.synchPush = function(onComplete) {
        this._onPushComplete = onComplete;
        var _Self = this;
        switch (this.ctx) {
            case "js":
                var json_string = JSON.stringify(this.data);
                CSHelper.evaluate('CONFIG.synchPull('+json_string+')',
                    function(res) {
                        var json = JSON.parse(res);
                        _Self.update(json);
                        _Self._onPushComplete(json);
                    }
                );
                break;
            case "jsx" :
                //TODO
                break;
        }
    }

Configuration.prototype.synchPull = function(json) {
        switch (this.ctx) {
            case "js":
                this.update(json);
                //TODO
                break;
            case "jsx" :
                this.update(json);
                return JSON.stringify(this.data);
                break;
        }
    }

Configuration.prototype.getConfigString = function() {
    return JSON.stringify(this.data);
}

if ( typeof module === "object" && typeof module.exports === "object" ) {
	module.exports = Configuration;
} 
    
