var express = require('express');
var router = express.Router();

// Load the MySQL pool connection
const pool = require('../db-config');
var table = 'CAFE';

/* GET cafés listing. */
router.get('/', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Use the connection
    connection.query('SELECT * FROM ' + table, function (error, results, fields) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
      console.log(results);
      res.send(results);
    });
  });
});

// GET café by id
router.get('/:id', function(req, res, next){
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Use the connection
    connection.query('SELECT * FROM ' + table + ' WHERE id = ' + req.params.id, function (error, result, fields) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
      console.log(result);
      res.send(result);
    });
  });
})

// POST to café
router.post('/', function(req, res, next){
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Build query
    var query = 'INSERT INTO ' + table + ' (name, password, latitude, longitude, created_at, updated_at) VALUES (\'' + req.body.name + '\', \'' + req.body.password + '\', ' + req.body.latitude + ', ' + req.body.longitude + ', current_timestamp(), null)';
    console.log(query);
    // Use the connection
    connection.query(query, function (error, result, fields) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
      console.log(result);
      res.status(201).send(`Café created with ID: ${result.insertId}`);
    });
  });
})

// PUT (update) to a café by id
router.put('/:id', function(req, res, next){
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Build query
    var query = 'UPDATE ' + table + ' SET';
    query += (req.body.name != null ? ' name = \'' + req.body.name + '\',' : '');
    query += (req.body.password != null ? ' password = \'' + req.body.password + '\',' : '');
    query += (req.body.latitude != null ? ' latitude = ' + req.body.latitude + ',' : '');
    query += (req.body.longitude != null ? ' longitude = ' + req.body.longitude + ',' : '');
    query += ' updated_at = current_timestamp() WHERE id = ' + req.params.id;
    console.log(query);

    // Use the connection    
    connection.query(query, function (error, result, fields) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
      console.log(result);
      if(result.changedRows == 1)
        res.send('Café updated successfully');
      else if(result.changedRows == 0)
        res.send('Café not found. TO BE CHANGED AS AN ERROR!')
      else 
        res.send(result.changedRows + ' rows updated. TO BE CHANGED AS AN ERROR!');
    });
  });
});

// DELETE a café by id
router.delete('/:id', function(req, res, next){
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Build query
    var query = 'DELETE FROM '+ table + ' WHERE id = ' + req.params.id;
    console.log(query);
    // Use the connection
    connection.query(query, function (error, result, fields) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
      console.log(result);
      if(result.affectedRows == 1)
        res.send('Café deleted successfully');
      else if(result.affectedRows == 0)
        res.send('Café not found. TO BE CHANGED AS AN ERROR!')
      else 
        res.send(result.affectedRows + ' rows deleted. TO BE CHANGED AS AN ERROR!');
    });
  });
});

module.exports = router;
