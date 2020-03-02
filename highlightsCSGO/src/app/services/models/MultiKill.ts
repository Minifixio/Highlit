import { Kill } from '../models/Kill';

export interface MultiKill {
    attackerName: string;
    kills: Kill[];
}
