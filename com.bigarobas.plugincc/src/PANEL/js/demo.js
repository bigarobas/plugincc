
CORE.addBridgeEventListener("CORE.READY",onCoreReady);
CORE.start();

function onCoreReady(event) {
   DEBUG.log(event);
   DEBUG.log(CONFIG.get("DEFAULT_MODULES_AUTO_DETECT_PATH"));
   DEBUG.log(ENV.getDebugUrl());
   ENV.openDebugUrl();
}











