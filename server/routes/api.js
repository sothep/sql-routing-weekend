var express = require('express');
var pg = require('pg');

var router = express.Router();
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/order_system';

router.get('/users', function(request, response){
  var results = [];

  pg.connect(connectionString, function(err, client){
    if (err) console.log(err);
    var query = client.query("SELECT * FROM users");

    query.on('row', function(row){
      results.push(row);
    });

    query.on('end', function(){
      client.end();
      return response.json(results);
    });
  });
});

router.get('/userAddresses/:userId', function(request, response){
  var results = [];

  pg.connect(connectionString, function(err, client){
    if (err) console.log(err);
    var query = client.query("SELECT * FROM addresses INNER JOIN users on addresses.user_id = users.id WHERE addresses.user_id = $1", [request.params.userId]);

    query.on('row', function(row){
      results.push(row);
    });

    query.on('end', function(){
      client.end();
      return response.json(results);
    });
  });
});

router.get('/userOrders/:userId/:startDate/:endDate', function(request, response){
  var results = [];

  pg.connect(connectionString, function(err, client){
    if (err) console.log(err);
    var query = client.query("SELECT * FROM orders INNER JOIN addresses ON orders.ship_address_id = address_id INNER JOIN users ON orders.user_id = users.id WHERE orders.user_id = $1 AND orders.order_date >= $2 AND orders.order_date < $3", [request.params.userId, request.params.startDate, request.params.endDate]);

    query.on('row', function(row){
      results.push(row);
    });

    query.on('end', function(){
      client.end();
      return response.json(results);
    });
  });
});

module.exports = router;
