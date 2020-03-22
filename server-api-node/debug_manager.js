var logger = class Logger {
    constructor(component) {
        this.component = component;
    }
    debug(message) {
        if(!(this.component == "")) {
            console.log("[" + this.component + "] ", message)
        }
    }
}
module.exports.logger = logger;