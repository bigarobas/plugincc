PANEL = (function () {
    'use strict';
	
    function init() {
        DEBUG.log("panel.jsx init");
    }

    function test() {
        DEBUG.popup("panel.jsx test");
    }
    
    return ( 
        {
            init : init,
            test : test
        }
    );
    
}());
