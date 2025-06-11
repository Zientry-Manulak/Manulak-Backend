import { Request, Response } from "express";
import { handleError, handleSuccess } from "../helpers/response.helper";
import { IItem } from "../repositories/interfaces/item-interface";
import { itemService } from "../services/item-service";

class ItemController{

  public createItem = async(req:Request, res:Response): Promise<void> => {
    try {
        const item: IItem = req.body;
        const newItem = await itemService.createItem(item);
        handleSuccess(res, "Item Added Successfully", newItem);
    } catch (error:any) {
        handleError(res, error);
    }
  }

}

export const itemController  = new ItemController();