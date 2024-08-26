const fs = require('fs');
const path = require('path');

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  // Helper function to read and parse the products file
  static readProductsFile(callback) {
    const filePath = path.join(
      path.dirname(require.main.filename),
      'data',
      'products.json'
    );

    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        // File does not exist or other read error
        callback([]);
        return;
      }

      try {
        const products = fileContent.length ? JSON.parse(fileContent) : [];
        callback(products);
      } catch (parseError) {
        console.log('Error parsing JSON:', parseError);
        callback([]);
      }
    });
  }

  save() {
    const filePath = path.join(
      path.dirname(require.main.filename),
      'data',
      'products.json'
    );

    // Ensure the 'data' directory exists
    fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
      if (err) {
        console.log('Error creating directory:', err);
        return;
      }

      Product.readProductsFile((products) => {
        products.push(this);

        fs.writeFile(filePath, JSON.stringify(products), (err) => {
          if (err) {
            console.log('Error writing file:', err);
          }
        });
      });
    });
  }

  static fetchAll(cb) {
    Product.readProductsFile(cb);
  }
};