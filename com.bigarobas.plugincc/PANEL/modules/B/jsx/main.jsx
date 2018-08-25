ModuleB = 
(function () {
    'use strict';

	function test () { alert("ModuleB jsx test"); }
   
    return ( 
        {
            test : test
        }
    );

}());