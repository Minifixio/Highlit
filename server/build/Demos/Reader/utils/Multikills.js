"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeMultiKills = void 0;
function computeMultiKills(roundKills) {
    const attackers = [];
    const triples = [];
    const quads = [];
    const aces = [];
    roundKills.forEach(kill => {
        if (attackers.indexOf(kill.attacker_name) === -1) {
            attackers.push(kill.attacker_name);
        }
    });
    roundKills = roundKills.sort((a, b) => a.time - b.time); // Sorting by time order to have to start of multiple kill time
    attackers.forEach(attacker => {
        let killCount = 0;
        const multiKill = {
            attacker_name: attacker,
            kills: []
        };
        roundKills.forEach(kill => {
            if (kill.attacker_name === attacker) {
                multiKill.kills.push(kill);
                killCount += 1;
            }
        });
        if (killCount === 3) {
            triples.push(multiKill);
        }
        if (killCount === 4) {
            quads.push(multiKill);
        }
        if (killCount === 5) {
            aces.push(multiKill);
        }
    });
    const multipleKills = { triples, quads, aces };
    return multipleKills;
}
exports.computeMultiKills = computeMultiKills;
//# sourceMappingURL=Multikills.js.map