"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.all = exports.get = exports.run = void 0;
const DatabaseManager_1 = require("../DatabaseManager");
function run(query, params) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            DatabaseManager_1.matchesDB.run(query, params, (err) => {
                if (err) {
                    DatabaseManager_1.logger.debug(err.message);
                    reject(err);
                }
                resolve();
            });
        });
    });
}
exports.run = run;
function get(query, params) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            DatabaseManager_1.matchesDB.get(query, params, (err, row) => {
                if (err) {
                    DatabaseManager_1.logger.debug(err.message);
                    reject(err);
                }
                resolve(row);
            });
        });
    });
}
exports.get = get;
function all(query, params) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            DatabaseManager_1.matchesDB.all(query, params, (err, rows) => {
                if (err) {
                    DatabaseManager_1.logger.debug(err.message);
                    reject(err);
                }
                resolve(rows);
            });
        });
    });
}
exports.all = all;
//# sourceMappingURL=DBRequests.js.map