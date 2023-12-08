import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class ProductManager {
    constructor() {
        this.path = './db/products.json';
        this.products = [];
    }

    async addProduct({ title, description, price, thumbnail, code, stock, status, category }) {
        const id = uuidv4();
        let newProduct = { id, title, description, price, thumbnail, code, stock, status, category };

        this.products = await this.getProducts();
        this.products.push(newProduct);

        await fs.writeFile(this.path, JSON.stringify(this.products));

        return newProduct;
    }

    async getProducts() {
        const res = await fs.readFile(this.path, 'utf8');
        const resJSON = JSON.parse(res);
        return resJSON;
    }

    async getProductById(id) {
        const res = await this.getProducts();
        const product = res.find(e => e.id === id);

        if (product) {
            return product;
        } else {
            console.log('No existe el producto');
        }
    }

    async updateProduct(id, data) {
        const res = await this.getProducts();
        const index = res.findIndex(e => e.id === id);

        if (index !== -1) {
            res[index] = { id, ...data };
            await fs.writeFile(this.path, JSON.stringify(res));
            return res[index];
        } else {
            console.log('Producto no encontrado');
        }
    }

    async deleteProduct(id) {
        const res = await this.getProducts();
        const index = res.findIndex(e => e.id === id);

        if (index !== -1) {
            res.splice(index, 1);
            await fs.writeFile(this.path, JSON.stringify(res));
        } else {
            console.log('Producto no encontrado');
        }
    }
}