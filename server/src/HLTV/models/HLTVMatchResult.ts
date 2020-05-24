import { HLTVTeam } from "./HLTVTeam";
import { MapSlug } from "hltv/lib/enums/MapSlug";
import { Event } from 'hltv/lib/models/Event';

export interface HLTVMatchResult {
    readonly id: number;
    readonly team1: HLTVTeam;
    readonly team2: HLTVTeam;
    readonly format: string;
    readonly event: Event;
    readonly map?: MapSlug;
    readonly result: string;
    readonly stars: number;
    readonly date: number;
}
