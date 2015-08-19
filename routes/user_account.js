var express = require('express');
var router = express.Router();
var dbConfig = require('../dbconfig');
var mysql      = require('mysql');


/* DB Connection */
var pool = mysql.createPool({
  host     : dbConfig.host,
  user     : dbConfig.user,
  password : dbConfig.password,
  database : dbConfig.database
});

/* GET user_account page. */
router.get('/:id', function(req, res, next) {
    
    var userdetails;
    pool.getConnection(function(err, connection) {
                
                if(!err) {
                        console.log("Database is connected ... \n\n"+req.params.name+' id '+req.params.id+' path '+req.path);  
                } else {
                        console.log("Error connecting database ... \n\n");  
                }
                
                // CALL GET_ACCOUNT_INFO(req.params)
                var query = connection.query('CALL GET_ACCOUNT_INFO(?)',
                                [req.params.id], function(err, rows) {
              
                if(err)	{
                        throw err;
                }
                console.log("rows.length:"+rows.length);
                
                console.log( query.sql );
                
                console.log( rows );

                userdetails = rows[0][0];

                console.log( userdetails );
                 
                res.render('user_account', { title: 'Dashboard - User Account', sess: req.session, user: userdetails });  

              
                connection.release();
            });
    
    });
    
});    

module.exports = router;