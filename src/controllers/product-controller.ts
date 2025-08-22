import { Request, Response } from "express";
import { handleError, handleSuccess } from "../helpers/response.helper";
import { IProduct } from "../repositories/interfaces/product-interface";
import { productService } from "../services/product-service";

class ProductController{

  public createProduct = async(req:Request, res:Response): Promise<void> => {
    try {
        const product: IProduct = req.body;
        const newProduct = await productService.createProduct(product);
        handleSuccess(res, "New Product Added Successfully", newProduct);
    } catch (error:any) {
        handleError(res, error);
    }
  }

}

export const productController  = new ProductController();