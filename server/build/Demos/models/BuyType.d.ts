export interface BuyType {
    id: number;
    name: string;
}
export interface TeamBuy {
    value: number;
    type: BuyType;
}
export interface Buy {
    t: TeamBuy;
    ct: TeamBuy;
}
