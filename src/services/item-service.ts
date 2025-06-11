import { IItem } from "../repositories/interfaces/item-interface";
import { itemRepository } from "../repositories/item-repository";

class ItemService {
    async createItem(itemData:IItem) : Promise<IItem> {
        const item = await itemRepository.create(itemData);
        return item;
    }

}

export const itemService = new ItemService();