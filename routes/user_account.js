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
    
    console.log( req.session.user_id );
    console.log( req.params.id );
    
    if(req.session.role === 1){
        var userdetails, accounts;
        pool.getConnection(function(err, connection) {

                    if(!err) {
                            console.log("Database is connected ... \n\n");  
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
                    userdetails = rows[0][0];
                
                    });
                    var query_accounts = connection.query('CALL GET_ACCOUNTS()', function(err, rows_acc) {
                    if(err)	{
                            throw err;
                    }
                    accounts = rows_acc[0];
                    
                        res.render('user_account', { title: 'Dashboard - Admin Account', sess: req.session,
                                                        user: userdetails, accounts: accounts });
                    });
                    connection.release();

        });
    }else if(new String(req.session.user_id).valueOf() === new String(req.params.id).valueOf()){
    
        var userdetails;
        pool.getConnection(function(err, connection) {

                    if(!err) {
                            console.log("Database is connected ... \n\n");  
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
                    userdetails = rows[0][0];

                    res.render('user_account', { title: 'Dashboard - User Account', sess: req.session, user: userdetails });  


                    connection.release();
                });

        });
        
    }else{
        res.redirect('/logout');
    }
    
});    

module.exports = router;