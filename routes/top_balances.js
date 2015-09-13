var express = require('express');
var router = express.Router();
var dbConfig = require('../dbconfig');
var mysql      = require('mysql');
var md5 = require('MD5');
var htmlspecialchars = require('htmlspecialchars');  // https://www.npmjs.com/package/htmlspecialchars
var validator = require('validator'); //https://github.com/chriso/validator.js


/* DB Connection */
var pool = mysql.createPool({
  host     : dbConfig.host,
  user     : dbConfig.user,
  password : dbConfig.password,
  database : dbConfig.database
});

// To-do update for admin

/* GET update details page. */
router.get('/:id', function(req, res, next) {
    
        pool.getConnection(function(err, connection) {
                    var userdetails, balances;
                    if(err) {
                            console.log("Error connecting database ... \n\n");  
                    }
                    console.log("Database is connected ... \n\n"); 
                    
                    var query = connection.query('CALL GET_ACCOUNT_INFO(?)', [req.params.id], function(err, rows) {
                    if(err)	{
                            throw err;
                    }
                    userdetails = rows[0][0];
                    });
                    
                    var query_bal = connection.query('CALL GET_Top_BALANCES()', function(err, rows) {
                    if(err)	{
                            throw err;
                    }
                    balances = rows[0];
                    //console.log(balances);
                    res.render('top_balances', { title: 'Report - Top Balances', sess: req.session, user: userdetails, balances:balances}); 
                    });
                      
            connection.release();
        }); 
}); 

module.exports = router;