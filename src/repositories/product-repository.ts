const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ProductRepository {

    async create(productData: any): Promise<any> {
        const { name, bought_price } = productData
        const product = await prisma.product.create({
            data: {
                name,
                bought_price
            }
        })

        return product;
    }


}

export const productRepository = new ProductRepository();