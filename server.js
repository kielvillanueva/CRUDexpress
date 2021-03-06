const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
  
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inventory'
});

db.connect();
console.log('Successfully connected to DB');  
 
/**All Items Endpoint */
app.get('/items', (req, res) => {

    db.query('SELECT * FROM items', [], (error, results) => {

        if(error) throw error

        console.log('Rows Returned: ', results.length);
        return res.send({
            code: 200, 
            data: results, 
            message: 'Items list.'
        });

    });

});
 
 
/**Item Endpoint */
app.get('/item/:id', (req, res) => {
  
    let itemId = req.params.id;
  
    if (!itemId) {
        return res.status(400).send({ code: 400, message: 'Please provide ID' });
    }
  
    db.query('SELECT * FROM items where id=?', itemId, function (error, results) {

        if (error) throw error;
        
        console.log('Rows Returned: ', results.length);
        return res.send({ 
            code: 200,
            data: results[0], 
            message: 'Single item.' 
        });

    });

});
 

/**Add Item Endpoint */
app.post('/item', (req, res) => {
  
    let item = req.body;
  
    if (!item.name || !item.qty || !item.amount) {
        return res.status(400).send({ code: 400, message: 'Please provide name, qty, amount' });
    }
  
    db.query("INSERT INTO items SET ? ", item, function (error, results, fields) {

        if (error) throw error;

        return res.send({ 
            code: 200, 
            data: results, 
            message: 'Item has been created successfully.' 
        });

    });

});
 

/**Update Item Endpoint */
app.put('/item/:id', (req, res) => {
  
    let itemId = req.params.id;
    let item = req.body;
  
    if (!itemId) {
        return res.status(400).send({ error: item, message: 'Please provide itemId' });
    }
    
    if (!item) {
        return res.status(400).send({ error: item, message: 'Please provide either name, qty or amount' });
    }
  
    db.query("UPDATE items SET ? WHERE id = ?", [item, itemId], function (error, results, fields) {

        if (error) throw error;

        return res.send({ 
            code: 200,
            data: results, 
            message: 'Item has been updated successfully.' 
        });

    });

});
 

/**Delete Item Endpoint */
app.delete('/item/:id', (req, res) => {
  
    let itemId = req.params.id;
  
    if (!itemId) {
        return res.status(400).send({ error: true, message: 'Please provide itemId' });
    }

    db.query('DELETE FROM items WHERE id = ?', [itemId], function (error, results, fields) {

        if (error) throw error;

        return res.send({ 
            code: 200,
            data: results, 
            message: 'Item has been deleted successfully.' 
        });

    });

}); 
 
app.listen(3000, () => {
    console.log('Node app is running on port 3000');
});
 
module.exports = app;