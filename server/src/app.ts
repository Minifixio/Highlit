import express from 'express';
export const app = express();
import cors from 'cors';
import * as bodyParser from 'body-parser'
import * as cronTasks from './Cron/CronTasks'
import * as testManager from './Tests/TestManager'
import { Logger } from './Debug/LoggerService';
import { Routes } from './API/Routes'

// testManager.testCron()
// const http = require('http').createServer(app);

// Mainteance mode
export const serverMaintenance = true;
export const appMaintenance = false;

const logger = new Logger("app");

// Starting cron task
if(!serverMaintenance) { cronTasks.lastMatchesTask.start(); logger.debug('Starting cron job') }

// Configuring Express
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );
app.use(express.static('../dist'));
app.use(express.static('../maintenance_page'));

app.all("/*", (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if(appMaintenance) {
        res.redirect("maintenance.html");
    }
    next();
});

app.all("/match*", (req, res) => {
    if(appMaintenance) {
        res.sendFile("maintenance.html", { root: __dirname + "/maintenance_page"});
    } else {
        res.sendFile("index.html", { root: __dirname + "/dist"});
    }
});

app.listen(3000, () => {
    logger.debug('App is listening on port 3000')
})

const routes = new Routes(app)
routes.mountRoutes()

/**http.listen(3000, () => {
    socketManager = require("./socket_manager.js");
    socketManager.startSockets(http);
    logger.debug('App listening on port 3000');
});**/
