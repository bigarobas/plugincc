ModuleA = 
(function () {
    'use strict';

	function test () { 
        //alert("ModuleA jsx test");
        CORE.dispatchCustomEvent("ModuleA Custom Event");
     }
   
    return ( 
        {
            test : test
        }
    );

}());