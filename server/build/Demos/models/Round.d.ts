import { WinningTeam } from "./WinningTeam";
import { Kill } from "./Kill";
import { Buy } from "./BuyType";
import { Clutch } from "./Clutch";
import { MultipleKills } from "./MultipleKills";
export interface Round {
    start: number;
    end: number;
    round_number: number;
    winning_team: WinningTeam | null;
    kills: Kill[];
    multiple_kills: MultipleKills;
    buy: Buy | null;
    end_reason: number;
    clutch: Clutch | null;
    twitch_rating: number | null;
}
