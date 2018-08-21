class Module {
    constructor (id,name) {
        this.id = id;
        this.name = (!name) ? "MODULE" : name;

    }
    test () {
        DEBUG.log (this.name + " : "+this.id);
    }

    init () {
        DEBUG.log (this.name + " : "+this.id + " init");
    }

    start () {
        DEBUG.log (this.name + " : "+this.id + " start");
    }
}

module.exports = Module;