var csInterface   = CSHelper.csinterface;  
var applicationID = csInterface.getApplicationID();  
var extensionID   = csInterface.getExtensionID();  
  
function CallbackUnique (csEvent) {  
  try {  
  var callback;  
  if (typeof csEvent.data === "string") {  
  // fixing the fact csEvent.data is a JSON string hidden in a string, e.g.  
  // ver1,{ "eventID": 1148218467, "eventData": {"null":{"_enum":"ordinal","_ref":"document","_value":"first"}}}   
  // stripping the "ver1,"  
  var eventDataString = csEvent.data.replace("ver1,{", "{");   
  var eventDataObj    = JSON.parse(eventDataString);  
  // putting back the object  
  csEvent.data = eventDataObj;  
  // + needed?  
  psEventDelegate.invoke(+eventDataObj.eventID, csEvent);  
  console.log("CallbackUnique: " + JSON.stringify(eventDataObj));  
  } else {  
  console.log("CallbackUnique expecting string for csEvent.data!");  
  }  
  } catch(e) {  
  console.log("CallbackUnique catch:" + e);  
  }  
}  
  
function EventDelegate () {  
  this.eventMap = {};  
}  
  
EventDelegate.prototype.invoke = function(eventTypeID, csEvent) {  
  var callback = this.eventMap[eventTypeID].callback;  
  if (callback) {  
  callback(csEvent);  
  }  
}  
  
EventDelegate.prototype.registerEvent = function(typeID, unRegister) {  
  var eventEnding = null;  
  if (unRegister) {  
  console.log('UnRegistering ' + typeID);  
  eventEnding = 'PhotoshopUnRegisterEvent';  
  csInterface.removeEventListener('com.adobe.PhotoshopJSONCallback' + extensionID, CallbackUnique);  
  } else {  
  console.log('Registering ' + typeID);  
  eventEnding = 'PhotoshopRegisterEvent';  
  csInterface.addEventListener("com.adobe.PhotoshopJSONCallback" + extensionID, CallbackUnique);  
  }  
  
  var event = new CSEvent(  
  "com.adobe." + eventEnding,  
  "APPLICATION",  
  applicationID,  
  extensionID  
  );  
  
  event.data = typeID;  
  csInterface.dispatchEvent(event);  
};  
  
EventDelegate.prototype.addEventListener = function(typeString, callback) {  
  csInterface.evalScript("app.stringIDToTypeID('" + typeString + "')", function(res) {  
  this.eventMap[res] = { "callback" : callback };  
  this.registerEvent(res, true);  // unRegister (just in case)  
  this.registerEvent(res, false); // Register  
  }.bind(this));  
}  
  
PhotoshopEvEventDelegateentDelegate.prototype.removeEventListener = function(typeString, callback) {  
  csInterface.evalScript("app.stringIDToTypeID('" + typeString + "')", function(res) {  
  // this.eventMap[+res] = null;  
  this.eventMap[res] = null;  
  this.registerEvent(res, true);  // unRegister  
  }.bind(this));  
}  
  
module.exports = new EventDelegate();  