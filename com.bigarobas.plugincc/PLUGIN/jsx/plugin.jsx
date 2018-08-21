PLUGIN = (function () {
    'use strict';
	
    function init() {
        DEBUG.log("plugin.jsx init");
    }

    function test() {
        DEBUG.popup("plugin.jsx test");
    }
    
    return ( 
        {
            init : init,
            test : test
        }
    );
    
}());
