import { Player } from "./Player";

export interface Team {
    clanName: string;
    teamNumber: number;
    members: Player[]
}