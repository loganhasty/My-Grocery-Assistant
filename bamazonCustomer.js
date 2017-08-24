var inquirer = require('inquirer');
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err; 
});

console.log(`
-----------------------
Welcome to BAMazon!
-----------------------

Check out our products below:`);

function customerOrder() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            console.log(`
            ${res[i].stock_quantity}
    (${res[i].item_id}) ${res[i].product_name} $${res[i].price}`);
        }
        inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter the SKU number of the item you wish to purchase',
                name: 'item'
            },
            {
                type: 'input',
                message: 'How many would you like?',
                name: 'quantity'
            },
            {
                type: 'list',
                message: 'Continue shopping?',
                name: 'continue',
                choices: ['Yes', 'No'],
                default: 'Yes'
            }
        ])

        .then(function (answer) {
            connection.query(`SELECT * FROM bamazon.products WHERE item_id='${answer.item}'`, function(err, results) {
                if (answer.quantity <= results[0].stock_quantity){
                    results[0].stock_quantity -= answer.quantity;
                    console.log("Thanks for you order. Your item has been shipped!");
                } else {
                    console.log(results[0].stock_quantity);
                    console.log("We're sorry, your order couldn't be fulfilled due to lack of inventory. Please try again.");
                }

                if (answer.continue === 'Yes'){
                    customerOrder();
                } else {
                    connection.end();
                }
            })
        });
    })
};
    
customerOrder();