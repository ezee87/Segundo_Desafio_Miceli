const fs = require("fs");

class ProductManager {
    constructor() {
        this.path = "./products.JSON";
        this.maxId = 0;
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const products = await fs.promises.readFile(this.path, "utf-8");
                const productJS = JSON.parse(products);
                return productJS;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    async addProducts(products) {
        try {
            const newProducts = products.map((product) => ({
                ...product,
                id: this.#nuevoId(),
            }));
            await fs.promises.writeFile(this.path, JSON.stringify(newProducts));
            return newProducts;
        } catch (error) {
            console.log(error);
        }
    }

    async getProductById(idProduct) {
        const productsFile = await this.getProducts();
        const product = productsFile.find((product) => product.id === idProduct);
        if (product) {
            console.log(`Producto ${idProduct}:`);
            return product;
        } else {
            console.error(`Not found!`);
        }
    }

    async deleteProduct(idProduct) {
        const productsFile = await this.getProducts();
        const productIndex = productsFile.findIndex((product) => product.id === idProduct);
        if (productIndex === -1) {
            console.error(`Not found!`);
        } else {
            productsFile.splice(productIndex, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
            console.log(`El producto ${idProduct} se elimino!`);
        }
    }

    async updateProduct(id, updatedInfo) {
        const products = await this.getProducts();
        const productIndex = products.findIndex((product) => product.id === id);
        if (productIndex === -1) {
            console.error(`Not found!`);
        } else {
            const updatedProduct = {
                ...updatedInfo,
                id: products[productIndex].id,
            };
            products[productIndex] = updatedProduct;
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            console.log(`El producto ${id} se actualizo!`);
        }
    }

    #nuevoId() {
        this.maxId++;
        return this.maxId;
    }
}

const productManager = new ProductManager();

const producto = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
};

const updatedInfo = {
    title: "producto actualizado",
    description: "Este producto fue actualizado",
    price: 500,
    thumbnail: "Con imagen",
    code: "zyx987",
    stock: 4
};

const test = async () => {

    // Se muestra la lista de productos, como aun no se agrego ningun producto deberia ser un array vacio.
    console.log(await productManager.getProducts())
    // Se agrega el producto
    await productManager.addProducts([producto]);
    // Se busca por su ID y se muestra el producto
    console.log(await productManager.getProductById(1));
    // Se actualiza la informacion del producto y se muestra con el metodo getProductById
    await productManager.updateProduct(1, updatedInfo);
    console.log(await productManager.getProductById(1));
    // Se elimina el producto
    await productManager.deleteProduct(1);
    // Se busca por su ID al producto, ya no existe por lo que deberia mostrar el error.
    console.log(await productManager.getProductById(1));
    // Como se elimino el unico producto que existia, deberia volver a mostrarse un array vacio
    console.log(await productManager.getProducts())
    
};

test();