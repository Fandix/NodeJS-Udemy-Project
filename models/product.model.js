const fs = require('fs');
const path = require('path');

const Cart = require('./cart.model');

const getProductsFromFile = (cb) => {
    const p = path.join(__dirname, '../', 'data', 'products.json');
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl,description, price) {
        this.id = id
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        const p = path.join(__dirname, '../', 'data', 'products.json');
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updateProducts = [...products];
                updateProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updateProducts), (err) => {
                    if (err) { console.log(err);}
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    if (err) { console.log(err);}
                });
            }     
        })
    }

    static deleteById(id) {
        const p = path.join(__dirname, '../', 'data', 'products.json');
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updateProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updateProducts), err => {
                if (err) { console.log(err); } else {
                    Cart.deleteCartProduct(id, product.id)
                }  
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            cb(product);
        })
    }
}