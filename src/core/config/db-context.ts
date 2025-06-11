import mongoose, { Model } from "mongoose";
import { IItem } from "../../repositories/interfaces/item-interface";
import { ItemSchema } from "../../repositories/schemas/item-schema";


export default class DBContext{
    private static dbContext: DBContext; 

    // schema
    public readonly Item: Model<IItem> = mongoose.model<IItem>('Item', ItemSchema, 'Item');

    private constructor(){

    }

    public static initialize(): DBContext{
        if(!DBContext.dbContext){
            DBContext.dbContext = new DBContext();
        }
        return DBContext.dbContext;
    }

}