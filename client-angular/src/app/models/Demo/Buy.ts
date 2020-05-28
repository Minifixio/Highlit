export interface BuyType {
    id: number;
    name: string;
}

export interface TeamBuy {
    value: number;
    type: BuyType;
    url: string;
}

export interface Buy {
    t: TeamBuy;
    ct: TeamBuy;
}