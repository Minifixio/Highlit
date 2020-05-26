import { MultiKill } from "../../models/MultiKill";
import { MultipleKills } from "../../models/MultipleKills";
import { Kill } from "../../models/Kill";

export function computeMultiKills (roundKills: Kill[]): MultipleKills {
    const attackers: string[] = [];
    const triples: MultiKill[] = [];
    const quads: MultiKill[] = [];
    const aces: MultiKill[] = [];

    roundKills.forEach(kill => { // Making an array with names of each attackers of the round
        if (attackers.indexOf(kill.attacker_name) === -1) {
            attackers.push(kill.attacker_name)
        }
    })

    roundKills = roundKills.sort((a, b) => a.time - b.time); // Sorting by time order to have to start of multiple kill time

    attackers.forEach(attacker => { // For each attacker check occurence in roundKills and adding to multipleKills if his kills >= 3
        let killCount = 0;

        const multiKill: MultiKill = {
            attacker_name: attacker,
            kills: []
        };

        roundKills.forEach(kill => {
            if(kill.attacker_name === attacker) {
                multiKill.kills.push(kill);
                killCount += 1;
            }
        })
        if (killCount === 3) { triples.push(multiKill) }
        if (killCount === 4) { quads.push(multiKill) }
        if (killCount === 5) { aces.push(multiKill) }
    });

    const multipleKills: MultipleKills = { triples, quads, aces }

    return multipleKills;
}