class Module {
    constructor (id,name) {
        this.id = id;
        this.name = (!name) ? "MODULE" : name;

    }
    test () {
        DEBUG.channel("module").log(this.name + " : "+this.id);
    }

    init () {
        DEBUG.channel("module").log(this.name + " : "+this.id + " init");
    }

    start () {
        DEBUG.channel("module").log(this.name + " : "+this.id + " start");
    }
}

module.exports = Module;