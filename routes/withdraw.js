var express = require('express');
var router = express.Router();
var dbConfig = require('../dbconfig');
var mysql      = require('mysql');
var htmlspecialchars = require('htmlspecialchars');  // https://www.npmjs.com/package/htmlspecialchars
var validator = require('validator'); //https://github.com/chriso/validator.js
//var methodOverride = require('method-override');

//router.use(methodOverride('_method')); // use PUT and DELETE

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
    
    if(new String(req.session.user_id).valueOf() === new String(req.params.id).valueOf()){
    
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
                    userdetails = rows[0][0];

                    res.render('withdraw', { title: 'Dashboard - Withdraw', sess: req.session, user: userdetails });  
                                       
                    connection.release();
                });

        });
        
    }else{
        res.redirect('/logout');
    }
    
});    


/* PUT Login page. */
router.put('/:id', function(req, res, next) {
        
	
        var account_id = req.params.id;
	console.log( req.params.id );
        console.log( req.body.input_dep );
	var amount = htmlspecialchars(req.body.input_dep);
        console.log( account_id );
        console.log( amount );
	// is the balance a floating number
	if(validator.isFloat(amount,{ min: 0.01, max: 9999999999999.99 } )){
		// is the balance between this range i.e. decimal(13,2) in MySQL
        
                        var userdetails;
                        pool.getConnection(function(err, connection) {

                                if(!err) {
                                        console.log("Database is connected ... \n\n");  
                                } else {
                                        console.log("Error connecting database ... \n\n");  
                                }

                                // CALL GET_ACCOUNT_INFO(req.params)
                                var query = connection.query('CALL WITHDRAW_MONEY(?,?)',
                                                [account_id,amount], function(err, rows) {

                                if(err)	{
                                        throw err;
                                }
                                console.log(rows);
                                console.log(rows.changedRows);
                                console.log(rows.affectedRows);
                         
                                if(rows.affectedRows === 1){
                                       
                                      // CALL GET_ACCOUNT_INFO(req.params)
                                           var query = connection.query('CALL GET_ACCOUNT_INFO(?)',
                                                           [req.params.id], function(err, rows) {

                                           if(err)	{
                                                   throw err;
                                           }
                                           userdetails = rows[0][0];
                                           var success =  "Thank You. Your Money has been Withdrawn";
                                           res.render('withdraw', { title: 'Dashboard - Withdraw', sess: req.session, user: userdetails, success: success }); 
                                           //connection.release();
                                       });
                               }else{

                                           var query = connection.query('CALL GET_ACCOUNT_INFO(?)',
                                                           [req.params.id], function(err, rows) {

                                           if(err)	{
                                                   throw err;
                                           }
                                           userdetails = rows[0][0];
                                           var message =  "Database Error. Please Try Again Later.";
                                           res.render('withdraw', { title: 'Dashboard - Withdraw', sess: req.session, user: userdetails,message: message }); 
//                                           
                                       });
                                }                           
                                connection.release();                           
                                });
			});				
	}else{
            console.log( "Invalid amount" );
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
                    userdetails = rows[0][0];
                    var message = "Invalid number entered. Please Try Again Later.";
                    res.render('withdraw', { title: 'Dashboard - Withdraw', sess: req.session, user: userdetails,message: message }); 
                    connection.release();
                });
            });
            
	}
});

module.exports = router;