
// Files
import * as hltvMngr from '../HLTV/HLTVManager'
import * as dbMngr from '../Database/DatabaseManager'
import * as demoMngr from '../Demos/Manager/DemoManager'
import * as mailMngr from '../Mails/MailManager'
import { Logger } from '../Debug/LoggerService';
import express from 'express';

const logger = new Logger("http");

export class Routes {

    public app: express.Express

    constructor(app: express.Express) {
        this.app = app
        this.init()
    }

    public init() {
        this.app.post('/v1/last_matches', async(req, res) => {
            const date = new Date(req.body.date);
            const endDate = new Date(date);
            const startDate = new Date(date);
            const startTimecode = new Date(startDate.setDate(date.getDate())).setHours(24, 0, 0, 0);
            const endTimecode = new Date(endDate.setDate(date.getDate() - 1)).setHours(24, 0, 0, 0);
            const response = await dbMngr.getLastMatchByDate(startTimecode, endTimecode);
            res.json(response);
        });

        this.app.post('/v1/map', async(req, res) => {
            const matchId = req.body.match_id;
            const mapNumber = req.body.map_number;

            try {
                const response = await demoMngr.findMatchInfos(matchId, mapNumber);
                res.json(response);
            } catch(e) {
                res.json([])
            }

        });

        this.app.post('/v1/maps', async(req, res) => {
            const matchId = req.body.match_id;
            const matchHasDemos = await dbMngr.matchHasDemos(matchId);
            let response = await dbMngr.getMapsInfos(matchId);
            if (!matchHasDemos) {
                logger.debug("Maps for match " + matchId + " does not exist");
                const update = await demoMngr.updateMatchInfos(matchId);
                if (update === 3) {
                    response = [];
                }
                if (update === 0) {
                    response = await dbMngr.getMapsInfos(matchId);
                }
            }

            const hasMapsWinnerId = await dbMngr.hasMapsWinnerId(matchId);

            // For the old matches without winner team id for maps
            if (!hasMapsWinnerId) {
                await dbMngr.updateMapsWinnerId(matchId)
                response = await dbMngr.getMapsInfos(matchId);
            }

            res.json(response);
        });

        this.app.get('/v1/refresh', async(req, res) => {
            await hltvMngr.getLastMatches();
            res.send('last matches refreshed')
        });

        this.app.post('/v1/mail', (req, res) => {
            if (req.body.type === 'error') {
                const matchId = req.body.match_id;
                const error = req.body.message;
                mailMngr.mailError(matchId, error);
            }
            res.json(true);
        });

        /**app.post('/v1/add-match', async(req, res) => {
            const matchId = req.body.match_id;
            socketManager.addMatch(matchId);
            res.json(true);
        });**/
    }
}