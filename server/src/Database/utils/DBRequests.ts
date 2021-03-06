import { matchesDB, logger } from '../DatabaseManager'

export async function run(query: string, params: any[]) {
    return new Promise((resolve, reject) => {
        matchesDB.run(query, params, (err) => {
            if(err) {
                logger.debug(err.message);
                reject(err);
            }
            resolve();
        })
    })
}

export async function get(query: string, params: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
        matchesDB.get(query, params, (err, row) => {
            if(err) {
                logger.debug(err.message);
                reject(err);
            }
            resolve(row);
        })
    })
}

export async function all<T>(query: string, params: any[]): Promise<T[]> {
    return new Promise((resolve, reject) => {
        matchesDB.all(query, params, (err, rows) => {
            if(err) {
                logger.debug(err.message);
                reject(err);
            }
            resolve(rows);
        })
    })
}