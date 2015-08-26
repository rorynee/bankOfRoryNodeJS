var express = require('express');
var router = express.Router();
var dbConfig = require('../dbconfig');
var mysql      = require('mysql'); //https://github.com/felixge/node-mysql/
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

var sess;

/* GET signup page. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Sign Up' });
});

/* GET signup page. */
router.post('/', function(req, res, next) {
    
    
 
    var email = req.body.inputEmail3.trim();
    var	fname = htmlspecialchars(req.body.input_fname.trim()); 
    var	lname = htmlspecialchars(req.body.input_lname.trim()); 
    var	age = htmlspecialchars(req.body.input_age.trim());  
    var	street = htmlspecialchars(req.body.input_street.trim());
    var	city = htmlspecialchars(req.body.input_city.trim());
    var	country = htmlspecialchars(req.body.input_country.trim());
	
    var	pass = req.body.input_pass.trim();
    var	pass_check = req.body.input_cpass.trim();
    
    
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
                                                        if(err.code !== 'ER_DUP_ENTRY'){
                                                            throw err;
                                                        }   
                                                    }else{
                                                        console.log(rows);
                                                        console.log(rows.insertId);
                                                        console.log(rows.affectedRows);
                                                        affectedRows = rows.affectedRows;
                                                        
                                                        console.log(affectedRows);
                                                    
                                                        if(parseInt(affectedRows) === 1 ){
                                                            var lastID;
                                                            
                                                            connection.query('CALL GET_LAST_ACCOUNT_ID()', function(err, rows_lastId) {
                                                                if(err)	{
                                                                throw err;
                                                                }
                                                               console.log(rows_lastId[0][0].account_no); 
                                                               lastID = rows_lastId[0][0].account_no;
                                                               
                                                                sess=req.session;
                                                                // add new information to the session
                                                                sess.user_id = lastID;
                                                                sess.fname = fname;
                                                                sess.lname = lname;
                                                                sess.role = 3;
                                                                sess.user_token = lastID;

                                                                res.redirect('/dashboard/user/'+sess.user_id);
                                                            });

                                                           

                                                        }else{
                                                            res.render('signup', { title: 'Sign Up',message: "The Username/Email already exists. Please enter a valid value." });            


                                                        }


                                                    }   
                                                    connection.release();
                                                });    
                                                    
                                                    
                                                });

                                            }else{
                                                   res.render('signup', { title: 'Sign Up',message:"A full address must be provided. Please enter a valid value." });
                                            }


                                    }else{
                                            res.render('signup', { title: 'Sign Up',message:"Password must be the same. Please enter a valid value." });
                                    }


                            }else{
                                    res.render('signup', { title: 'Sign Up',message:"Password must be 6 or more characters. Please enter a valid value." });
                            }


                    }else{
                        res.render('signup', { title: 'Sign Up',message:"Age is invalid. You must be over 18 to open an account. Please enter a valid value." });	
                    }


            }else{
                    res.render('signup', { title: 'Sign Up',message:"First or Last the name is blank. Please enter a valid value." });	
            }

    }else{

            res.render('signup', { title: 'Sign Up',message:"Email is not a valid. Please enter a valid value." });	
    }
    
            
    
    
  //res.render('signup', { title: 'Sign Up' });
});

module.exports = router;