var logger = class Logger {
    constructor(component) {
        this.component = component;
    }
    debug(message) {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();

        if(!(this.component == "")) {
            console.log(hours + " : " + minutes + "| [" + this.component + "] ", message)
        }
    }
}
module.exports.logger = logger;