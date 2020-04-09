import { Kill } from '../models/Kill';

export interface MultiKill {
    attacker_name: string;
    kills: Kill[];
}
