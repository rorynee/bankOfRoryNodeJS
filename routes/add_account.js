var express = require('express');
var router = express.Router();
var dbConfig = require('../dbconfig');
var mysql      = require('mysql');
var htmlspecialchars = require('htmlspecialchars');  // https://www.npmjs.com/package/htmlspecialchars
var validator = require('validator'); //https://github.com/chriso/validator.js
var md5 = require('MD5');

/* DB Connection */
var pool = mysql.createPool({
  host     : dbConfig.host,
  user     : dbConfig.user,
  password : dbConfig.password,
  database : dbConfig.database
});

/* GET deposit page. */
router.get('/:id', function(req, res, next) {
    
    if(req.session.role === 1){
    
        
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
                    res.render('add_account', { title: 'Dashboard - Add Account', sess: req.session, user: userdetails });  
                     
                     connection.release();
                    });
        });
        
    }else{
        res.redirect('/logout');
    }
    
});    

router.post('/:id', function(req, res, next) {
    
    if(req.session.role === 1){
    
    var email = req.body.inputEmail4.trim();
    var	fname = htmlspecialchars(req.body.input_fname.trim()); 
    var	lname = htmlspecialchars(req.body.input_lname.trim()); 
    var	age = htmlspecialchars(req.body.input_age.trim());  
    var	street = htmlspecialchars(req.body.input_street.trim());
    var	city = htmlspecialchars(req.body.input_city.trim());
    var	country = htmlspecialchars(req.body.input_country.trim());
	
    var	pass = req.body.input_pass.trim();
    var	pass_check = req.body.input_cpass.trim();
    var userdetails;
    pool.getConnection(function(err, connection) {

                    if(!err) {
                            console.log("Database is connected ... \n\n");  
                    } else {
                            console.log("Error connecting database ... \n\n");  
                    }
                    
                    var query = connection.query('CALL GET_ACCOUNT_INFO(?)',
                                    [req.params.id], function(err, rows) {

                    if(err)	{
                            throw err;
                    }
                    userdetails = rows[0][0];
                     connection.release();
                    });
    });
    
    // is the username an email address
    if(validator.isEmail(email)){

            if(fname.length > 0 && lname.length > 0){

                    if(validator.isInt(age,  { min: 18, max: 130 } )){

                            if(pass.length >= 6 && pass_check.length >= 6 ){
                                    // are the password equal to eachother
                                    if(validator.equals(pass,pass_check)){

                                            if(street.length > 0 && city.length > 0 && country.length > 0){

                                                    var hashpass = md5(pass);
                                                    var affectedRows = 0;
                                                pool.getConnection(function(err, connection) {

                                                    if(!err) {
                                                            console.log("Database is connected ... \n\n");  
                                                    } else {
                                                            console.log("Error connecting database ... \n\n");  
                                                    }


                                                    var query = connection.query('CALL ADD_NEW_ACCOUNT(?,?,?,?,?,?,?,?)',
                                                                    [fname,lname,email,age,street,city,country,hashpass], function(err, rows) {

                                                        if(err)	{
                                                            if(err.code === 'ER_DUP_ENTRY'){
                                                                res.render('add_account', { title: 'Dashboard - Add Account',sess: req.session, user: userdetails, message:"The Username/Email already exists. Please enter a valid value." });
                                                     
                                                            }else{
                                                                throw err;
                                                            }   
                                                        }else{
                                                            console.log(rows);
                                                            console.log(rows.insertId);
                                                            console.log(rows.affectedRows);
                                                            affectedRows = rows.affectedRows;

                                                            console.log(affectedRows);

                                                            if(parseInt(affectedRows) === 1 ){
                                                                
                                                                res.render('add_account', { title: 'Dashboard - Add Account',sess: req.session, user: userdetails, success: "Account Created successfully" });            
                                                               
                                                            }else{
                                                                res.redirect('/dashboard/error/'+req.session.user_id);
                                                            }


                                                    }   
                                                    connection.release();
                                                });    
                                                    
                                                    
                                                });

                                            }else{
                                                   res.render('add_account', { title: 'Dashboard - Add Account',sess: req.session, user: userdetails, message:"A full address must be provided. Please enter a valid value." });
                                            }


                                    }else{
                                            res.render('add_account', { title: 'Dashboard - Add Account',sess: req.session, user: userdetails, message:"Password must be the same. Please enter a valid value." });
                                    }


                            }else{
                                    res.render('add_account', { title: 'Dashboard - Add Account',sess: req.session, user: userdetails, message:"Password must be 6 or more characters. Please enter a valid value." });
                            }


                    }else{
                        res.render('add_account', { title: 'Dashboard - Add Account',sess: req.session, user: userdetails, message:"Age is invalid. You must be over 18 to open an account. Please enter a valid value." });	
                    }


            }else{
                    res.render('add_account', { title: 'Dashboard - Add Account',sess: req.session, user: userdetails, message:"First or Last the name is blank. Please enter a valid value." });	
            }

    }else{

            res.render('add_account', { title: 'Dashboard - Add Account',sess: req.session, user: userdetails, message:"Email is not a valid. Please enter a valid value." });	
    }
    }else{
        res.redirect('/logout');
    }
    
}); 

module.exports = router;