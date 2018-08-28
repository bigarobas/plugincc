# Toolbox for building Adobe CC extensions with CEP
It probably needs a better name ^^

**Purpose :**
- minimize code duplication in both contexts (JS / JSX)
- ease communication between both contexts (JS / JSX)
- bring independent tools as well as a full framework and workflow based on those tools.
- no dependencies (except CEP - Creative Cloud Extension SDK libs of course)

## JSXBridge
This is the central module around which this toolset is made.
When creating a JSXBridge for an Object this object is auto implemented with the following methodes :
- mirror(function_name,function_args,callback_or_expression)
- getContext() 
- checkContext(ctx)
- listen(type,handler)
- dispatch(type,data,scope)

These methodes allow us to :
- easy mirroring methodes on both sides (JS/JSX)
```javascript
//Let's say you have 2 files one on JS and the other on JSX context with code on global level :

//on JS side
SAME_BRIDGE_NAME = new ClassA();
SAME_BRIDGE_NAME.log("HELLO FROM JS");
function ClassA () { 
    this.bridge = new JSXBridge(this,"SAME_BRIDGE_NAME");
    this.log = function(message) {
      //console is defined is JS context so we can use it
      console.log(message);
    }
}

//on JSX side
SAME_BRIDGE_NAME = new ClassB();
SAME_BRIDGE_NAME.log("HELLO FROM JSX");
function ClassB () { 
    this.bridge = new JSXBridge(this,"SAME_BRIDGE_NAME");
    this.log = function(message) {
      //console is NOT defined is JSX context so we mirror the action to the JS side
      this.mirror('log',message);
    }
}

//RESULT in chrome console (JS context) :
> HELLO FROM JS
> HELLO FROM JSX
```
- MIXED CONTEXT : you can also do the same thing with only 1 file (loaded both on JS and JSX context)
```javascript
BRIDGE_NAME = new ClassA();
function ClassA () { 
    this.bridge = new JSXBridge(this,"BRIDGE_NAME");
    this.log("HELLO FROM "+this.getContext());
}

ClassA.prototype.log = function (message) {
  if (this.checkContext("js") {
    //console is defined is JS context so we can use it
    console.log(message);
  } else {
    //console is NOT defined is JSX context so we mirror the action to the JS side
    this.mirror('log',message);
  }
}

//RESULT in chrome console (JS context) :
> HELLO FROM js
> HELLO FROM jsx
```
- it's also possible to mirror one function in one contexte to a completely different function of completly different object in the other context
- the mirror methode takes a callback_or_expression argument depending on the context it's called on :
    - a callback function if it's called from JS context (that will be called with the mirror JSX function return value).
    - a callback expression if it's called from JSX context (that will be evaluated with the JS function return value). This expression contain key_words ({bridge} and {args}) which will dynamically be replaced before the expression is evaluated.
```javascript
// imagine we want to synch a MIXED OBJECT (1 jsx file loaded in both contexts JS & JSX)
// we need to push the update to the other context and retrieve the new updated state to synch back with the first object
// 
this.synch = function(onComplete) {
    this.onSynchComplete = onComplete;
    var _self = this;
    if (this.checkContext("jsx")) {
        this.mirror(
            'update',
            this.data,
            '(function() {\
                {bridge}.update({args});\
                {bridge}.onSynchComplete({args});\
            })();'
        );
    } else {
        this.mirror(
            'update',
            this.data,
            function(json) {
                _self.update(json);
                _self.onSynchComplete(json);
            }
        );
    }  
}

this.update(data) {
    //update with data
    //return new state
}
```
- easy communication between objects in both contexts with a custom Observer pattern that let you dispatch custom JSXBridgeEvents with 5 different scopes :
  - JS (only JSXBridge objects on JS context can receive the event)
  - JSX (only JSXBridge objects on JSX context can receive the event)
  - SAME (only JSXBridge objects in the SAME context (JS or JSX) can receive the event)
  - MIRROR (only JSXBridge objects in the MIRROR ("opposite") context (JS or JSX) can receive the event)
  - BOTH (JSXBridge objects in BOTH contexts (JS and JSX) can receive the event) 
```javascript
//IMPORTING THE MODULE
  // JS SIDE
  Configuration =  require(__EXTENTION_PATH__ + "/CORE/mixed/JSXBridge.jsx");
  // JSX SIDE
  $.evalFile(__EXTENTION_PATH__ + "/CORE/mixed/JSXBridge.jsx");
  
// IN AN OBJECT IN JS CONTEXT
var _bridge = new JSXBridge(this,"SOME_BRIDGE_NAME");
this.listen("a_custom_event_type",function(event) {(...)});
this.dispatch("a_custom_event_type",some_data_object,"mirror");

// IN AN OBJECT IN JSX CONTEXT
var _bridge = new JSXBridge(this,"SAME_OR_OTHER_BRIDGE_NAME");
this.listen("a_custom_event_type",function(event) {(...)});
this.dispatch("a_custom_event_type",some_data_object,"both")

/*
# RESULT ON JSX SIDE :
The JSX bridge will receive 2 events with "a_custom_event_type".
1 from its own dispatch because it was on "both" scope.
1 from JS context's dispatch because it was on "mirror" scope = the opposite context of JS = JSX.
In this case the mirror (opposite) of JS is of course JSX.

# RESULT ON JS SIDE :
The JS bridge will receive only 1 event with "a_custom_event_type".
0 from its own dispatch because it was on "mirror" scope = the opposite context of it's own = JSX.
1 from JSX context's dispatch because it was on "both" scope.
*/
```

## Configuration
- Mixed Configuration object synched and available in both contexts (JS ad JSX)
```javascript
//IMPORTING THE MODULE
  // JS SIDE
  Configuration =  require(__EXTENTION_PATH__ + "/CORE/mixed/Configuration.jsx");

  // JSX SIDE
  $.evalFile(__EXTENTION_PATH__ + "/CORE/mixed/Configuration.jsx");
  
// ON BOTH SIDES
CONFIG = new Configuration("CONFIG");
CONFIG.update(json); // update with some json. existing keys are updated / non existing keys are created
CONFIG.set("some_key",some_value); // set a value to a key
CONFIG.get("some_key"); // get a value of a key
CONFIG.synch(); // synch the config with the other context
```
synch() is the most interresting part :

It synchronizes the config with the other context (JSX if you are in JS and JS if you're in JSX).

For now the synch is a "push prioritised".
This means that the values are pushed to the the other side.
Existing keys are updated / non existing keys are created.
Then key/values are pulled to synch. 
Existing keys are updated (which should not happen) / non existing keys are created.

We might have the other option "pull prioritised" too in the future.
This means the key/values are pulled from the other context.
Existing keys are updated / non existing keys are created.
Then key/values are pushed to synch.
Existing keys are updated (which should not happen) / non existing keys are created.

## Debugger
- Mixed Multichanel Debugger available in both contexts (JS ad JSX)
```javascript
// IMPORTING THE MODULE
  // JS SIDE
  Debugger = require(__EXTENTION_PATH__ + "/CORE/mixed/Debugger.jsx");
  // JSX SIDE
  $.evalFile(__EXTENTION_PATH__ + "/CORE/mixed/Debugger.jsx");
  
// USING THE MODULE (ON BOTH SIDE)
DEBUG = new Debugger();
DEBUG.log("Hello World");
```
- create channels and sub channels :
```javascript
DEBUG.channel("main_channel_branch_name").channel("sub_channel_branch_name").log("Hello World");
```
- manage / costumise channels :
```javascript
DEBUG.channel("main_channel_branch_name").mute(isCompletelyMuted);
DEBUG.channel("main_channel_branch_name").setVerbose(isWriteMuted,isAlertMutedn,isChannelIdPrefixDisplayed); 
DEBUG.channel("main_channel_branch_name").setSeparator("-._.-._.-._.-._.-._.-._.-._.-._.-._.-");
```
- supporting multiple write & alert methodes :
  - write(message) 
  ```javascript
  DEBUG.channel("some_channel_name").write("Hello World");
  // JSX : JSX : mirrored to chrome.console.log instead of $.write / JS : chrome.console.log
  ```
  - writeln(message) 
  ```javascript
  DEBUG.channel("some_channel_name").writeln("Hello World");
  // JSX : mirrored to chrome.console.log instead of $.writeln / JS : chrome.console.log
  ```
  - log(message) 
  ```javascript
  DEBUG.channel("some_channel_name").log("Hello World");
  // JSX : mirrored to chrome.console.log instead of $.writeln / JS : chrome.console.log
  // the same than .writeln()
  ```
  - json(someObject) 
  ```javascript
  DEBUG.channel("some_channel_name").json(someObject);
  // .writeln() + JSON.stringify()
  ```
  - popup(message) 
  ```javascript
  DEBUG.channel("some_channel_name").popup(message);
  // application alert - event if called from chrome side (js)
  ```
  - popupJson 
  ```javascript
  DEBUG.channel("some_channel_name").json(someObject);
  // .popup() + JSON.stringify()
  ```
- stack / flush
```javascript
DEBUG.channel("some_channel_name").stack("Hello");
// (some code)
DEBUG.channel("some_channel_name").stack("How");
// (some code)
DEBUG.channel("some_channel_name").stack("Are");
// (some code)
DEBUG.channel("some_channel_name").stack("You");
// (some code)
DEBUG.channel("some_channel_name").stack("?");
// (some code)
DEBUG.channel("some_channel_name").flush();

// log formatted stack :
// ---------------------------------
// Hello
// How
// Are
// You
// ?
// ---------------------------------
```
- chained notation
```
DEBUG.channel("some_channel_name")
  .mute(false)
  .setVerbose(true,false,false)
  .stack("A")
  .stack("B")
  .log("1")
  .stack("C")
  .popup("X")
  .flush();
```

## JSXHelper(s)
A collection of handy functions for some  Adobe CC applications :
(This still needs serious cleaning / harmonizing / old projects great functions hunting / testing)
- JSXHelper             (global functions for all applications)
- JSXHelper_AEFT.jsx    (After Effects functions)
- JSXHelper_PHSP.jsx    (Photoshop functions)
- JSXHelper_PPRO.jsx    (Premiere functions)
- JSXHelper_INDS.jsx    (InDesign functions)
- (more to come...)

## CORE
This needs a better name (or not ^^).
This is the framework approach which uses the modules above to bring a more complete solution to build your panel.
- JSXBridge : Scoped event dispatcher and mixed context Helper.
- Configuration based initialisation of your panel.
  - 1 core json configuration file (that you won't need to change)
  - 1 panel json configuration file specific to your panel were you can define :
    - all your project specific values (jsx files to load, paths, etc.)
    - all your custom key/values
- Mixed Configuration object synched and available is both contexts (JS ad JSX)
- Mixed Environement object synched and available is both contexts (JS ad JSX)
- Mixed Multi Channel Debugger available is both contexts (JS ad JSX)
- JSXHelper(s) : a collection of handy functions for some  Adobe CC applications.
- es5-shim built-in for JSX (ES3 JSX power up to ES5)
- Event driven CORE launch sequence managing both sides (JS and JSX)
```javascript
//CORE
CORE.JS.START
CORE.JS.INIT.BEGIN
CORE.JS.INIT.END
CORE.JSX.INIT.BEGIN
CORE.JSX.INIT.END
CORE.READY

//ENVIRONMENT
CORE.JS.ENV.INIT.BEGIN
CORE.JS.ENV.INIT.END
CORE.JSX.ENV.INIT.BEGIN
CORE.JSX.ENV.INIT.END
CORE.ENV.SYNCH.BEGIN
CORE.ENV.SYNCH.END
CORE.ENV.READY

//DEBUGGER
CORE.JS.DEBUGGER.INIT.BEGIN
CORE.JS.DEBUGGER.INIT.END
CORE.JSX.DEBUGGER.INIT.BEGIN
CORE.JSX.DEBUGGER.INIT.END
CORE.DEBUGGER.READY

//CONFIGURATION
CORE.JS.CONFIG.INIT.BEGIN
CORE.JS.CONFIG.INIT.END
CORE.JS.CONFIG.CORE.BEGIN
CORE.JS.CONFIG.CORE.END
CORE.JS.CONFIG.PANEL.BEGIN
CORE.JS.CONFIG.PANEL.END
CORE.JSX.CONFIG.INIT.BEGIN
CORE.JSX.CONFIG.INIT.END
CORE.CONFIG.INIT.SYNCH.BEGIN
CORE.CONFIG.INIT.SYNCH.END
CORE.CONFIG.READY

//INCLUDES
CORE.INCLUDE.JSX.CORE.BEGIN
CORE.INCLUDE.JSX.CORE.END
CORE.INCLUDE.JSX.PANEL.BEGIN
CORE.INCLUDE.JSX.PANEL.END
CORE.INCLUDE.JSX.READY

//MODULES
CORE.JS.MODULES.LOAD.BEGIN
CORE.JS.MODULES.LOAD.END
CORE.JS.MODULES.BUILD.BEGIN
CORE.JS.MODULES.BUILD.END
CORE.JS.MODULES.INIT.BEGIN
CORE.JS.MODULES.INIT.END
CORE.JS.MODULES.START.BEGIN
CORE.JS.MODULES.START.END
CORE.MODULES.READY
```
- (more to come...)
