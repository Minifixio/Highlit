import { BuyType } from "../../models/BuyType";

export function getBuyType(equipmentValue: number): BuyType {

    const type: BuyType = {id: 0, name: 'eco'}

    switch (true) {
        case equipmentValue <= 6000:
            type.id = 0;
            type.name = 'eco';
            break;
        case (equipmentValue > 6000 && equipmentValue <= 12500):
            type.id = 1;
            type.name = 'small-buy';
            break;
        case (equipmentValue > 12500 && equipmentValue <= 22500):
            type.id = 2;
            type.name = 'half-buy';
            break;
        case (equipmentValue > 22500):
            type.id = 3;
            type.name = 'full-buy';
            break;
    }

    return type;
}