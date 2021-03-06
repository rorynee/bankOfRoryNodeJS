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
router.get('/details/:id', function(req, res, next) {
    
        pool.getConnection(function(err, connection) {
                    var userdetails, account_types;
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
                    
                    var query_type = connection.query('CALL GET_ACCOUNT_TYPES()', function(err, rows) {
                    if(err)	{
                            throw err;
                    }
                    account_types = rows[0];
                    res.render('details', { title: 'Dashboard - User Details', sess: req.session, user: userdetails, account_types: account_types}); 
                    });
                    connection.release();
        }); 
});    

/* PUT /dashboard/update_balance/ Form. */
router.put('/update_balance/:id', function(req, res, next) {
    
    //var account_num = htmlspecialchars(req.body.account_num.trim());
    var balance = htmlspecialchars(req.body.balance.trim());
    
    if(validator.isFloat(balance,{ min: 0.01, max: 9999999999999.99 } )){
        
        pool.getConnection(function(err, connection) {
                var affectedRows;
                if(err) {
                        console.log("Error connecting database ... \n\n");  
                }
                console.log("Database is connected ... \n\n"); 
                
                
                var query_type = connection.query('Call UPDATE_BALANCE(?,?)',
                                            [req.params.id,balance], function(err, rows) {
                if(err)	{
                        throw err;
                }
                
                console.log(rows);
                console.log(rows.affectedRows);
                affectedRows = rows.affectedRows;
                console.log(affectedRows);
                
                if(parseInt(affectedRows) === 1 ){
                    res.redirect('/dashboard/admin/'+req.session.user_id);
                }else{
                    res.redirect('/dashboard/error/'+req.session.user_id);
                }
                
                });
                connection.release();
            }); 
        
        
    }else{
         pool.getConnection(function(err, connection) {
                var userdetails, account_types;
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

                var query_type = connection.query('CALL GET_ACCOUNT_TYPES()', function(err, rows) {
                if(err)	{
                        throw err;
                }
                account_types = rows[0];
                res.render('details', { title: 'Dashboard - User Details',sess: req.session, user: userdetails, account_types: account_types,
                                message_bal:"Invalid number entered. Please enter a valid value." }); 

                });
                connection.release();
            }); 
    }
      
});

/* PUT /dashboard/account_type/ Form. */
router.put('/account_type/:id', function(req, res, next) {
    //console.log(req.params.id);
    var id = req.params.id;
    var account_type = htmlspecialchars(req.body.input_account.trim());
    
    if(new String(req.session.role).valueOf() === "1" ){
        
        if(validator.isInt(account_type,  { min: 1, max: 2 } )){
            
            pool.getConnection(function(err, connection) {
                var affectedRows;
                if(err) {
                        console.log("Error connecting database ... \n\n");  
                }
                console.log("Database is connected ... \n\n"); 
                
                
                var query_type = connection.query('CALL UPDATE_ACCOUNT_type(?,?)',
                                            [id,account_type], function(err, rows) {
                if(err)	{
                        throw err;
                }
                //console.log(query_type);
                console.log(rows);
                console.log(rows.affectedRows);
                affectedRows = rows.affectedRows;
                console.log(affectedRows);
                

                if(parseInt(affectedRows) === 1 ){
                    //console.log('redirected to -> /dashboard/admin/'+req.session.user_id);
                    res.redirect('/dashboard/admin/'+req.session.user_id);

                }else{
                    res.redirect('/dashboard/error/'+req.session.user_id);
                }
                
                });
                connection.release();
            }); 
            
        }else{
            pool.getConnection(function(err, connection) {
                var userdetails, account_types;
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

                var query_type = connection.query('CALL GET_ACCOUNT_TYPES()', function(err, rows) {
                if(err)	{
                        throw err;
                }
                account_types = rows[0];
                res.render('details', { title: 'Dashboard - User Details',sess: req.session, user: userdetails, account_types: account_types,
                                message_acc:"Account type must be Current or Student. Please enter a valid value." }); 

                });
                connection.release();
            }); 
        }    
    }else{
        res.redirect('/logout');
    }
    
    
});


/* PUT /dashboard/account_pass/ Form. */
router.put('/account_pass/:id', function(req, res, next) {
    
    
    var pass = req.body.input_pass.trim();
    var pass_check = req.body.input_cpass.trim();
    
    
    if(pass.length >= 6 && pass_check.length >= 6 ){
        // are the password equal to eachother
        if(validator.equals(pass,pass_check)){
            
            var hashpass = md5(pass);
            
            pool.getConnection(function(err, connection) {
                var affectedRows = 0;
                if(err) {
                        console.log("Error connecting database ... \n\n");  
                }
                console.log("Database is connected ... \n\n"); 

                var query = connection.query('Call UPDATE_ACCOUNT_PASS(?,?)', [req.params.id,hashpass], function(err, rows) {
                if(err)	{
                        throw err;
                }else{
                    console.log(rows);
                    console.log(rows.affectedRows);
                    affectedRows = rows.affectedRows;
                    console.log(affectedRows);

                    if(parseInt(affectedRows) === 1 ){

                        if(req.session.role === 1){
                            res.redirect('/dashboard/admin/'+req.session.user_id);
                        }else{
                            res.redirect('/dashboard/user/'+req.params.id);
                        }

                    }else{
                        if(req.session.role === 1){
                            res.redirect('/dashboard/error/'+req.session.user_id);
                        }else{
                            res.redirect('/dashboard/error/'+req.params.id);
                        }
                    
                    }
                    
                }
                
                });


                
                connection.release();
            }); 



        }else{
                pool.getConnection(function(err, connection) {
                var userdetails, account_types;
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

                var query_type = connection.query('CALL GET_ACCOUNT_TYPES()', function(err, rows) {
                if(err)	{
                        throw err;
                }
                account_types = rows[0];
                res.render('details', { title: 'Dashboard - User Details',sess: req.session, user: userdetails, account_types: account_types,
                                message_pas:"Password must be the same. Please enter a valid value." }); 

                });
                connection.release();
            }); 
            
        }


    }else{
        pool.getConnection(function(err, connection) {
        var userdetails, account_types;
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

        var query_type = connection.query('CALL GET_ACCOUNT_TYPES()', function(err, rows) {
        if(err)	{
                throw err;
        }
        account_types = rows[0];
        res.render('details', { title: 'Dashboard - User Details',sess: req.session, user: userdetails, account_types: account_types,
                        message_pas:"Password must be 6 or more characters. Please enter a valid value." }); 

        });
        connection.release();
    }); 
    }
});

/* PUT /dashboard/update/ Form. */
router.put('/update/:id', function(req, res, next) {
    
    var	fname = htmlspecialchars(req.body.input_fname.trim()); 
    var	lname = htmlspecialchars(req.body.input_lname.trim()); 
    var	age = htmlspecialchars(req.body.input_age.trim());  
    var	street = htmlspecialchars(req.body.input_street.trim());
    var	city = htmlspecialchars(req.body.input_city.trim());
    var	country = htmlspecialchars(req.body.input_country.trim());
    var userdetails, account_types;
    pool.getConnection(function(err, connection) {
        
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

        var query_type = connection.query('CALL GET_ACCOUNT_TYPES()', function(err, rows) {
        if(err)	{
                throw err;
        }
        account_types = rows[0];
        });
        connection.release();
    }); 

    if(fname.length > 0 && lname.length > 0){

            if(validator.isInt(age,  { min: 18, max: 130 } )){

                        if(street.length > 0 && city.length > 0 && country.length > 0){

                                   var affectedRows = 0;
                                    pool.getConnection(function(err, connection) {

                                        if(!err) {
                                                console.log("Database is connected ... \n\n");  
                                        } else {
                                                console.log("Error connecting database ... \n\n");  
                                        }

                                        // CALL UPDATE_ACCOUNT($value, '$fname', '$lname', $age, '$street', '$city','$country')
                                        var query = connection.query('CALL UPDATE_ACCOUNT(?,?,?,?,?,?,?)',
                                                        [req.params.id,fname,lname,age,street,city,country], function(err, rows) {

                                            if(err)	{
                                                   throw err;   
                                            }else{
                                                console.log(rows);
                                                console.log(rows.affectedRows);
                                                affectedRows = rows.affectedRows;

                                                console.log(affectedRows);

                                                if(parseInt(affectedRows) === 1 ){
                                                    
                                                    if(req.session.role === 1){
                                                        res.redirect('/dashboard/admin/'+req.session.user_id);
                                                    }else{
                                                        res.redirect('/dashboard/user/'+req.params.id);
                                                    }

                                                }else{
                                                    if(req.session.role === 1){
                                                        res.redirect('/dashboard/error/'+req.session.user_id);
                                                    }else{
                                                        res.redirect('/dashboard/error/'+req.params.id);
                                                    }

                                                }


                                            }   
                                            connection.release();
                                        });    


                                        });

                            }else{

                                   res.render('details', { title: 'Dashboard - User Details', sess: req.session, user: userdetails, account_types: account_types,
                                                            message_up:"A full address must be provided. Please enter a valid value." }); 
                            }
            }else{

               res.render('details', { title: 'Dashboard - User Details', sess: req.session, user: userdetails, account_types: account_types,
                                        message_up:"Age is invalid. You must be over 18 to open an account. Please enter a valid value." });
            }


    }else{
 	
         res.render('details', { title: 'Dashboard - User Details',sess: req.session, user: userdetails, account_types: account_types,
                                        message_up:"First or Last the name is blank. Please enter a valid value." });
    }
    
      
});

/* Delete /dashboard/update/ Form. */
router.delete('/update/:id', function(req, res, next) {
    
    console.log(req.session.role);
    console.log(req.params.id);
    
    if(new String(req.session.role).valueOf() === "1" && new String(req.params.id).valueOf() === "1" ){
         console.log("in first");
        pool.getConnection(function(err, connection) {
            var userdetails, account_types;
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

            var query_type = connection.query('CALL GET_ACCOUNT_TYPES()', function(err, rows) {
            if(err)	{
                    throw err;
            }
            account_types = rows[0];
            res.render('details', { title: 'Dashboard - User Details',sess: req.session, user: userdetails, account_types: account_types,
                            myerror:"Admin Super User Cannot Be Deleted." }); 

            });
            connection.release();
        });
    }else if(new String(req.session.role).valueOf() === "2" && new String(req.session.user_id).valueOf() === "2" && new String(req.params.id).valueOf() === "2" ){
        console.log("in second");
        pool.getConnection(function(err, connection) {
            var userdetails, account_types;
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

            var query_type = connection.query('CALL GET_ACCOUNT_TYPES()', function(err, rows) {
            if(err)	{
                    throw err;
            }
            account_types = rows[0];
            res.render('details', { title: 'Dashboard - User Details',sess: req.session, user: userdetails, account_types: account_types,
                            myerror:"Support Team Account Cannot Be Deleted." }); 

            });
            connection.release();
        });
    }else{
        console.log("in third");
        
        pool.getConnection(function(err, connection) {
            var userdetails, account_types;
            if(err) {
                    console.log("Error connecting database ... \n\n");  
            }
            console.log("Database is connected ... \n\n"); 

            var affectedRows = 0;
            var query_type = connection.query('CALL DELETE_ACCOUNT(?)', [req.params.id], function(err, rows) {
            if(err)	{
                    throw err;
            }
            affectedRows = rows.affectedRows;

            console.log(affectedRows);

            if(parseInt(affectedRows) === 1 ){
                
                
                req.session.account = "delete";
                res.redirect('/logout');
    
              }else{
                    if(req.session.role === 1){
                        res.redirect('/dashboard/error/'+req.session.user_id);
                    }else{
                        res.redirect('/dashboard/error/'+req.params.id);
                    }
                    
                }
            });
            connection.release();
        });
        
    } 
});


module.exports = router;