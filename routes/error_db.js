var express = require('express');
var router = express.Router();
var dbConfig = require('../dbconfig');
var mysql      = require('mysql');
var htmlspecialchars = require('htmlspecialchars');  // https://www.npmjs.com/package/htmlspecialchars
var validator = require('validator'); //https://github.com/chriso/validator.js


/* DB Connection */
var pool = mysql.createPool({
  host     : dbConfig.host,
  user     : dbConfig.user,
  password : dbConfig.password,
  database : dbConfig.database
});

/* GET deposit page. */
router.get('/:id', function(req, res, next) {
    
    console.log( req.session.user_id );
    console.log( req.params.id );
    
    pool.getConnection(function(err, connection) {

            if(!err) {
                    console.log("Database is connected ... \n\n");  
            } else {
                    console.log("Error connecting database ... \n\n");  
            }
            // user details
            var userdetails;
            var query = connection.query('CALL GET_ACCOUNT_INFO(?)',
                            [req.params.id], function(err, rows) {

            if(err)	{
                    throw err;
            }
            userdetails = rows[0][0];
            
            res.render('error_db', { title: 'Dashboard - Error', sess: req.session, user: userdetails });  
            connection.release();
            });

    });
        
    
    
});    




module.exports = router;