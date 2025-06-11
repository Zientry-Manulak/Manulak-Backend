import { Schema } from "mongoose";
import { IItem } from "../interfaces/item-interface";

export const ItemSchema: Schema<IItem> = new Schema<IItem>({
    name: {type:String, required:true},
})