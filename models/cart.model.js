const fs = require('fs');
const path = require('path');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        const p = path.join(__dirname, '../', 'data', 'cart.json');
        fs.readFile(p, (err, data) => {
            let cart = { products: [], totalPrice: 0 };
            if (err) {
                console.log(err);
            } else {
                cart = JSON.parse(data)
            }

            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updateProduct;
            if (existingProduct) {
                updateProduct =  {...existingProduct};
                updateProduct.qty++;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updateProduct;
            } else {
                updateProduct = { id: id, qty: 1 };
                cart.products.push(updateProduct);
            }
            
            cart.totalPrice += +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                if (err) { console.log(err); }
            });
        })
    }

    static deleteCartProduct(id, productPrice) {
        const p = path.join(__dirname, '../', 'data', 'cart.json');
        fs.readFile(p, (err, data) => {
            if (err) {
                return;
            }

            const updatedCart = { ...JSON.parse(data) };
            const product = updatedCart.products.find(prod => prod.id === id);
            if (!product) {
                return;
            }

            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                if (err) { console.log(err); }
            });
        });
    }

    static getCart(cb) {
        const p = path.join(__dirname, '../', 'data', 'cart.json');
        fs.readFile(p, (err, data) => {
            const cart = JSON.parse(data);
            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        });
    }
}