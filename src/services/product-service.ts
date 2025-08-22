import { IProduct } from "../repositories/interfaces/product-interface";
import { productRepository } from "../repositories/product-repository";

class ProductService {
    async createProduct(productData:IProduct) : Promise<any> {
        const newProduct = await productRepository.create(productData)
        return newProduct;
    }

}

export const productService = new ProductService();