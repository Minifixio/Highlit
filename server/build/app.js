"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appMaintenance = exports.serverMaintenance = exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = express_1.default();
const cors_1 = __importDefault(require("cors"));
const bodyParser = __importStar(require("body-parser"));
const cronTasks = __importStar(require("./Cron/CronTasks"));
const testManager = __importStar(require("./Tests/TestManager"));
const LoggerService_1 = require("./Debug/LoggerService");
const Routes_1 = require("./API/Routes");
// testManager.testCron()
// const http = require('http').createServer(app);
// Mainteance mode
exports.serverMaintenance = false;
exports.appMaintenance = false;
const logger = new LoggerService_1.Logger("app");
// Starting cron task
if (!exports.serverMaintenance) {
    cronTasks.lastMatchesTask.start();
    logger.debug('Starting cron job');
}
// Configuring Express
exports.app.use(cors_1.default());
exports.app.use(bodyParser.json());
exports.app.use(bodyParser.urlencoded({ extended: true }));
exports.app.use(express_1.default.static('./webapp'));
exports.app.use(express_1.default.static('../maintenance_page'));
exports.app.all("/match*", (req, res) => {
    if (exports.appMaintenance) {
        res.sendFile("maintenance.html", { root: __dirname + "/maintenance_page" });
    }
    else {
        res.sendFile("index.html", { root: "./webapp" });
    }
});
exports.app.all("/*", (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (exports.appMaintenance) {
        res.redirect("maintenance.html");
    }
    next();
});
exports.app.listen(3000, () => {
    logger.debug('App is listening on port 3000');
});
const routes = new Routes_1.Routes(exports.app);
routes.mountRoutes();
testManager.triggerCron();
// http.listen(3000, () => {
//     socketManager = require("./socket_manager.js");
//     socketManager.startSockets(http);
//     logger.debug('App listening on port 3000');
// });
//# sourceMappingURL=app.js.map