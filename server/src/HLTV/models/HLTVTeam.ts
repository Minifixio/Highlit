import { Team } from "hltv/lib/models/Team";

export interface HLTVTeam extends Team {
    id: number;
    name: string;
}