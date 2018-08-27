Debugger = function (id,shouldMute,parentChannel) {
    'use strict';
	if (!Debugger.isInitialized()) Debugger.init();
	this._channel_id = (id == undefined) ? "Debugger" : id;
	this._isAlertMuted = false;
	this._isWriteMuted = false;
	this._isChannelIdMuted = false;
	this._isMuted = false;
	this._parent_channel = (parentChannel == undefined) ? null : parentChannel;
	this._isBranchAlertMuted = (this._parent_channel == null) ? false : this._parent_channel._isBranchAlertMuted;
	this._isBranchWriteMuted = (this._parent_channel == null) ? false : this._parent_channel._isBranchWriteMuted;
	this._isBranchChannelIdMuted = (this._parent_channel == null) ? false : this._parent_channel._isBranchChannelIdMuted;
	this._isBranchMuted = (this._parent_channel == null) ? false : this._parent_channel._isBranchMuted;

	this._channels = [];
	this._channels_count = 0;
	
	this._newline = "\r\n";
	this._separator = "-----------------------------------";
	this._channel_path_separator = ":";
	this._channel_path_end = " > ";
	this._queue = [];
	this._channel_path = this.getChannelBranchPath();
}

Debugger.prototype._createChannel = function (id) {
	this._channels_count = this._channels.length;
	var chan = new Debugger(id,false,this);
	this._channels[id] = chan;
	this._channels[this._channels_count] = chan;
	this._channels_count++;
	return chan;
}

Debugger.prototype.getChannelBranchPath = function (channel) {
	if (channel == undefined) channel = this;
	var path = channel._channel_id;
	var parent = channel._parent_channel;
	while (parent!=null) {
		path = parent._channel_id + parent._channel_path_separator + path;
		parent = parent._parent_channel;
	}
	return path;
}

Debugger.prototype.channel = function (id) {
	if (!id) return this;
	var chan = this._channels[id];
	if (!chan) chan = this._createChannel(id);
	return chan;
}

Debugger.prototype.formatMessage = function(message) {
	if (this.canChannelId()) {
		message = this.getChannelIdFormattedString() + message;
	}
	return message;
}

Debugger.prototype.getChannelIdFormattedString = function() {
	return this._channel_path + this._channel_path_end;
}

Debugger.prototype.popup = function(message) { 
	if (this.canAlert()) { 
		message = this.formatMessage(message);
		Debugger._alert(message);
	}
	return this;
}

Debugger.prototype.popupJson = function(message) { 
	if (this.canAlert()) { 
		message = Debugger.stringify(message);
		var regex = new RegExp(/"/g);
		message = message.replace(regex,'\\"');
		message = this.formatMessage(message);
		Debugger._alert(message); 
	}
	return this;
}

Debugger.prototype.stack = function(message) { 
	message = this.formatMessage(message);
	this._queue.push(message);
	return this;
}

Debugger.prototype.stackJson = function(message) { 
	this._queue.push(Debugger.stringify(message));
	return this;
}
Debugger.prototype.flush = function (message,shoudSeparate) {
	if (this.canWrite()) {
		Debugger._writeln(this._separator);
		var n = this._queue.length;
		var message = "[stack flush] :"+this._newline;
		for (var i=0;i<n;i++) {
			message += this._newline + this._queue[i] + this._newline;
		}
		message += this._separator;
		this.writeln(message);
	}
	queue = [];
	return this;
}

Debugger.prototype.write = function (message) {
	if (this.canWrite()) { 
		message = this.formatMessage(message);
		Debugger._write(message);  
	}
	return this;
}

Debugger.prototype.log = function(message,shouldSeperate) {
	this.writeln(message,shouldSeperate);
	return this;
}

Debugger.prototype.writeln = function (message,shoudSeparate) {
	if (this.canWrite()) {
		message = this.formatMessage(message);
		if (shoudSeparate) Debugger._writeln(this._separator);
		Debugger._writeln(message); 
		if (shoudSeparate) Debugger._writeln(this._separator);
	}
	return this;
}

Debugger.prototype.json = function (message) {
	if (this.canWrite()) { 
		var message = Debugger.stringify(message);
		message = this.formatMessage(message);
		Debugger._writeln(message); 
	};
	return this;
}

Debugger.prototype.struct = function (message,shoudSeparate) {
	if (this.canWrite()) {this.formatMessage("")
		if (shoudSeparate) Debugger._writeln(this._separator);
		Debugger._writeln(this.formatMessage("")); 
		Debugger._writeln(message); 
		if (shoudSeparate) Debugger._writeln(this._separator);
	}
	return this;
}

Debugger.prototype.separate = function () {
	if (this.canWrite()) {
		Debugger._writeln(this._separator);
	}
	return this;
}

Debugger.prototype.dispatch = function (message) {
	if (this.canAlert()) { this.popup(message); }
	if (this.canWrite()) { this.writeln(message); }
	return this;
}

Debugger.prototype.setVerbose = function (shouldAlert,shouldWrite,shouldChannelId) {
	if (shouldAlert != undefined) this._isAlertMuted = !shouldAlert;
	if (shouldWrite != undefined) this._isWriteMuted = !shouldWrite;
	if (shouldChannelId != undefined) this._isChannelIdMuted = !shouldChannelId;
	return this;
}

Debugger.prototype.mute = function (shouldMute) {
	if (shouldMute != undefined) this._isMuted = shouldMute;
	return this;
}

Debugger.prototype.isMuted = function () {
	return (this._isMuted || this._isBranchMuted);
	return this;
}

Debugger.prototype.displayChannelID = function(shouldChannelId) {
	this._isChannelIdMuted = !shouldChannelId;
	return this;
}

Debugger.prototype.canAlert = function () {
	return (!this._isAlertMuted && !this._isBranchAlertMuted && !this._isMuted);
}

Debugger.prototype.canWrite = function () {
	return (!this._isWriteMuted && !this._isBranchWriteMuted && !this._isMuted);
}

Debugger.prototype.canChannelId = function () {
	return (!this._isChannelIdMuted && !this.isBranchChannelIdMuted);
}

Debugger.prototype.setSeparator = function (str) {
	this._separator = str;
	return this;
}

Debugger.prototype.logInContext = function() {
	//if (!Debugger.isInitialized()) return function(){};
	if (typeof console == 'undefined') return function(){};
	var context = "My Descriptive Logger Prefix:";
	return Function.prototype.bind.call(console.log, console, context);
}();


Debugger._bridgeName = "Debugger";
Debugger._bridge = null;
Debugger._initialized = false;
/*
Debugger._chromeLog = null;
Debugger._logInContext = null;
*/

Debugger.isInitialized = function() {
	return Debugger._initialized;
}

Debugger.hasBridgeName = function() {
	return (Debugger._bridgeName != undefined);
}

Debugger.setBridgeName = function (bridgeName) {
	Debugger._bridgeName = bridgeName;
	if (!Debugger._bridge) return;
	Debugger._bridge.setBridgeName(bridgeName);
}

Debugger.init = function() {
	if (Debugger._initialized) return true;
	Debugger._bridge =  new JSXBridge(this,Debugger._bridgeName); 
	Debugger._initialized = true;
	/*
	if (Debugger._bridge.checkContext("js")) {
		Debugger._chromeLog = console.log.bind(console);
		Debugger._logInContext = function() {
			var context = "My Descriptive Logger Prefix:";
			return Function.prototype.bind.call(console.log, console, context);
		}();
	}
	*/
}



Debugger._write = function (message) {
    if (this._bridge.checkContext("jsx")) {
       	$.write(message);
    } else {
        console.log(message);
    } 
}



Debugger._writeln = function (message) {
	if (this._bridge.checkContext("jsx")) {
		$.writeln(message);
	} else {
		console.log(message);
	} 
}

Debugger._alert = function (message) {
    if (this._bridge.checkContext("jsx")) {
        alert(message);
    } else {
        this._bridge.mirror(
            '_alert',
            "[from chrome] \\r"+message,
			null
        );
    } 
}

//FROM :
//https://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json
Debugger.stringify = function(obj) {
    // Note: cache should not be re-used by repeated calls to JSON.stringify.
    var cache = [];
    var result = JSON.stringify(obj, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Duplicate reference found
                try {
                    // If this value does not reference a parent it can be deduped
                    return JSON.parse(JSON.stringify(value));
                } catch (error) {
                    // discard key if value cannot be deduped
                    return;
                }
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null; // Enable garbage collection
    return result;
}

if ( typeof module === "object" && typeof module.exports === "object" ) {
	module.exports = Debugger;
} 

