ES5_POO_Helper = function() {};

ES5_POO_Helper.extend = function (ParentClass,className) {
    var ChildClass = function(){};
    ChildClass.prototype = Object.create(ParentClass.prototype);
    ChildClass.prototype.constructor = ChildClass;
    ChildClass.prototype.constructor.name = className;
    return ChildClass;
}
