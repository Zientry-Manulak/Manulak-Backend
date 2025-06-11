import { CoreRepository } from "./core-repositroy";
import { IItem } from "./interfaces/item-interface";

class ItemRepository extends CoreRepository{
    async create(item: IItem):Promise<IItem>{
        return await new this.dbContext.Item(item).save();
    }
}

export const itemRepository = new ItemRepository();