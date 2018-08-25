# Toolbox for building Adobe CC extensions with CEP
It probably needs a better name ^^

**Purpose :**
- minimize code duplication in both contexts (JS / JSX)
- ease communication between both contexts (JS / JSX)
- bring separate independent tools as well as a full framework and workflow based on those tools.

## JSXBridge
This is the central module around which this toolset is made.
It allows :
- easy mirroring the code on both sides (JS/JSX) within the same file
- easy communicating with between objects on both sides with a custom Observer pattern that let you dispatch custom JSXBridgeEvents with 5 different scopes :
  - JS (only JSXBridge objects on JS context can receive the event)
  - JSX (only JSXBridge objects on JSX context can receive the event)
  - SAME (only JSXBridge objects in the SAME context (JS or JSX) can receive the event)
  - MIRROR (only JSXBridge objects in the MIRROR ("opposite") context (JS or JSX) can receive the event)
  - BOTH (JSXBridge objects in BOTH contexts (JS and JSX) can receive the event) 
- easy composite implementation
```
//IMPORTING THE MODULE
  // JS SIDE
  JSXBridge = require(__EXTENTION_PATH__ + "/CORE/mixed/JSXBridge.jsx");
  // JSX SIDE
  $.evalFile(__EXTENTION_PATH__ + "/CORE/mixed/JSXBridge.jsx");
  
// ON JS SIDE (wherever...)
var _bridge = new JSXBridge(this,"a_bridge_name");
_bridge.addBridgeEventListener("a_custom_event_type",function(e) {(...)});
(... later on)
var event = _bridge.createBridgeEvent("a_custom_event_type",some_data_object,"mirror");
_bridge.dispatchBridgeEvent(event);

// ON JSX SIDE (wherever...)
var _bridge = new JSXBridge(this,"a_bridge_name");
_bridge.addBridgeEventListener("a_custom_event_type",function(e) {(...)});
(... later on)
var event = _bridge.createBridgeEvent("a_custom_event_type",some_data_object,"both");
_bridge.dispatchBridgeEvent(event);

// RESULT ON JSX SIDE :
The JSX bridge will receive **2 events** with "a_custom_event_type".
1 from its own dispatch because it was on "both" scope.
1 from JS context's dispatch because it was on "mirror" scope = the opposite context of JS = JSX.
In this case the mirror (opposite) of JS is of course JSX.

// RESULT ON JS SIDE :
The JS bridge will receive only **1 event** with "a_custom_event_type".
0 from its own dispatch because it was on "mirror" scope = the opposite context of it's own = JSX.
1 from JSX context's dispatch because it was on "both" scope.
```
## Configuration
- 1 file for both sides of the force (js / jsx)
```
//IMPORTING THE MODULE
  // JS SIDE
  Configuration =  require(__EXTENTION_PATH__ + "/CORE/mixed/Configuration.jsx");

  // JSX SIDE
  $.evalFile(__EXTENTION_PATH__ + "/CORE/mixed/Configuration.jsx");
  
// ON BOTH SIDES
CONFIG = new Configuration("CONFIG");
CONFIG.update(json); //update with some json. existing keys are updated / non existing keys are created
CONFIG.set("some_key",some_value); // set a value to a key
CONFIG.get("some_key"); // get a value of a key
CONFIG.synch(); //this is the most interresting part. Synch the config with the other context (JSX if you are in JS and JS if you're in JSX). For now the synch is a push priority that means that the values are pushed to the the other side (existing keys are updated / non existing keys are created) then pulled to synch. We might have the other option too in the future = pull priority = the values are pulled from the other side (existing keys are updated / non existing keys are created) then pushed to synch.

```

## Debugger
- 1 file for both sides of the force (js / jsx)
```
//IMPORTING THE MODULE
  // JS SIDE
  Debugger = require(__EXTENTION_PATH__ + "/CORE/mixed/Debugger.jsx");
  // JSX SIDE
  $.evalFile(__EXTENTION_PATH__ + "/CORE/mixed/Debugger.jsx");
  
//UNSING THE MODULE (ON BOTH SIDE)
DEBUG = new Debugger();
DEBUG.log("Hello World");
```
- create channels and sub channels :
```
DEBUG.channel("main_channel_branch_name").channel("sub_channel_branch_name").log("Hello World");
```
- manage / costumise channels :
```
DEBUG.channel("main_channel_branch_name").mute(isCompletelyMuted);
DEBUG.channel("main_channel_branch_name").setVerbose(isWriteMuted,isAlertMutedn,isChannelIdPrefixDisplayed); 
DEBUG.channel("main_channel_branch_name").setSeparator("-._.-._.-._.-._.-._.-._.-._.-._.-._.-");
```
- supporting multiple write & alert methodes :
  - write(message) 
  ```
  DEBUG.channel("some_channel_name").write("Hello World");
  // JSX : $.write / JS : console.log
  ```
  - writeln(message) 
  ```
  DEBUG.channel("some_channel_name").writeln("Hello World");
  // JSX : $.writeln / JS : console.log
  ```
  - log(message) 
  ```
  DEBUG.channel("some_channel_name").log("Hello World");
  // JSX : $.writeln / JS : console.log
  // the same than .writeln()
  ```
  - json(someObject) 
  ```
  DEBUG.channel("some_channel_name").json(someObject);
  // .writeln() + JSON.stringify()
  ```
  - popup(message) 
  ```
  DEBUG.channel("some_channel_name").popup(message);
  // application alert - event if called from panel side (js)
  ```
  - popupJson 
  ```
  DEBUG.channel("some_channel_name").json(someObject);
  // .popup() + JSON.stringify()
  ```
- stack / flush
```
DEBUG.channel("some_channel_name").stack("Hello");
(...) some code
DEBUG.channel("some_channel_name").stack("How");
(...) some code
DEBUG.channel("some_channel_name").stack("Are");
(...) some code
DEBUG.channel("some_channel_name").stack("You");
(...) some code
DEBUG.channel("some_channel_name").stack("?");
(...) some code
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
(This still needs serious cleaning / harmonizeing / testing)
- JSXHelper             (global functions for all applications)
- JSXHelper_AEFT.jsx    (After Effects functions)
- JSXHelper_PHSP.jsx    (Photoshop functions)
- JSXHelper_PPRO.jsx    (Premiere functions)
- JSXHelper_INDS.jsx    (InDesign functions)
- (more to come...)

## CORE
This needs a better name (or not ^^).
This is the full framework which uses the modules above to bring more complete solution to build your panel.
- Configuration based initialisation of your panel.
  - 1 core json configuration file (that you won't need to change)
  - 1 plugin json configuration file specific to your panel were you can define :
    - all your project specific values (jsx files to load, paths, etc.)
    - all your custom key/values
- event driven CORE launch sequence managing both sides (JS and JSX)
  - INIT (Core)
  - LOAD (Config/Modules)
  - BUILD (Modules)
  - START (Core/Modules)
- JSXBridge : mixed context, and scoped event dispatcher
- super Debugger ^^
- JSXHelper(s)
- (more to come...)
