class ModuleDef {
    constructor (id,folderPath) {
        this.id = id;
        this.modulePath = ENV.getAbsolutePath(folderPath);
        this.jsxPath = ENV.getRelativePath(this.modulePath)+"/jsx/main.jsx";
        this.jsClassPath = this.modulePath+"/js/main.js";
        this.jsClass = require(this.jsClassPath);
        this.name = null; 
        this.module = null;
    }

    build () {
        this.module = new this.jsClass(this.id,this.name);
        return this.module;
    }

}

module.exports = ModuleDef;