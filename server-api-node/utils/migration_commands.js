const fs = require("fs");
var demoManager = require('../demo_manager.js')
var dbManager = require('../database_manager.js')

exports.makeFoldersMigration = async function makeFoldersMigration() {
    let matches = await dbManager.getAllMatches();

    matches.forEach(async(match) => {
        await demoManager.findMatchPath(match.match_id)
    })
}

exports.makeMvCommands = async function makeMvCommands() {
    let matches = await dbManager.getAllMatches();

    let response = [];
    response.push('#!/bin/bash');

    let loop = new Promise((resolve) => {
        matches.forEach(async(match) => {

            let matchId = match.match_id;

            let path = await demoManager.findMatchPath(matchId)
            
            let command  = `mv ./matches/${matchId}/* ${path}/ \n`;

            response.push(command);

            if (response.length == matches.length) {
                resolve(1)
            }
        });
    })

    await loop;

    var file = fs.createWriteStream('./moveScript.sh');
    response.forEach(v => { file.write(v + '\n'); });
    file.end();

}

exports.makeRmCommands = async function makeRmCommands() {
    let matches = await dbManager.getAllMatches();

    let response = [];
    response.push('#!/bin/bash');

    let loop = new Promise((resolve) => {
        matches.forEach(async(match) => {

            let matchId = match.match_id;

            
            let command  = `rm ./matches/${matchId}/ -Rf \n`;

            response.push(command);

            if (response.length == matches.length) {
                resolve(1)
            }
        });
    })

    await loop;

    var file = fs.createWriteStream('./deleteScript.sh');
    response.forEach(v => { file.write(v + '\n'); });
    file.end();
}
