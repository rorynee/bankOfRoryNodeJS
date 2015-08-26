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
                    account_types = rows[0][0];
                    res.render('details', { title: 'Dashboard - User Details', sess: req.session, user: userdetails, account_types: account_types}); 
                    });
                    connection.release();
        }); 
});    

/* PUT /dashboard/update_balance/ Form. */
router.put('/update_balance/:id', function(req, res, next) {
    
    
    res.render('details', { title: 'Dashboard - User Details' });  
});

/* PUT /dashboard/account_type/ Form. */
router.put('/account_type/:id', function(req, res, next) {
    
    
    res.render('details', { title: 'Dashboard - User Details' });  
});

/* PUT /dashboard/update/ Form. */
router.put('/update/:id', function(req, res, next) {
    
    var	fname = htmlspecialchars(req.body.input_fname.trim()); 
    var	lname = htmlspecialchars(req.body.input_lname.trim()); 
    var	age = htmlspecialchars(req.body.input_age.trim());  
    var	street = htmlspecialchars(req.body.input_street.trim());
    var	city = htmlspecialchars(req.body.input_city.trim());
    var	country = htmlspecialchars(req.body.input_country.trim());
    

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
                                                        //res.redirect('/dashboard/admin/'+req.session.user_id);
                                                    }else{
                                                        res.redirect('/dashboard/user/'+req.params.id);
                                                    }

                                                }


                                            }   
                                            connection.release();
                                        });    


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
                                                account_types = rows[0][0];
                                                res.render('details', { title: 'Dashboard - User Details', sess: req.session, user: userdetails, account_types: account_types,
                                                            message_up:"A full address must be provided. Please enter a valid value." }); 
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
                            account_types = rows[0][0];
                            res.render('details', { title: 'Dashboard - User Details', sess: req.session, user: userdetails, account_types: account_types,
                                        message_up:"Age is invalid. You must be over 18 to open an account. Please enter a valid value." }); 
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
                        account_types = rows[0][0];
                        res.render('details', { title: 'Dashboard - User Details',sess: req.session, user: userdetails, account_types: account_types,
                                        message_up:"First or Last the name is blank. Please enter a valid value." }); 
                        
                        });
                        connection.release();
                    }); 
            	
    }
    
      
});

/* Delete /dashboard/update/ Form. */
router.delete('/update/:id', function(req, res, next) {
    
    if(req.session.role === 1 && req.session.user_id === 1 && req.params.id ===1 ){
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
            account_types = rows[0][0];
            res.render('details', { title: 'Dashboard - User Details',sess: req.session, user: userdetails, account_types: account_types,
                            myerror:"Admin Super User Cannot Be Deleted." }); 

            });
            connection.release();
        });
    }else if(req.session.role === 2 && req.session.user_id === 2 && req.params.id ===2 ){
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
            account_types = rows[0][0];
            res.render('details', { title: 'Dashboard - User Details',sess: req.session, user: userdetails, account_types: account_types,
                            myerror:"Support Team Account Cannot Be Deleted." }); 

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
    
              }
            });
            connection.release();
        });
        
    }
    
    
    
});


module.exports = router;