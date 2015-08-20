var express = require('express');
var router = express.Router();
var dbConfig = require('../dbconfig');
var mysql      = require('mysql');
var md5 = require('MD5');


/* DB Connection */
var pool = mysql.createPool({
  host     : dbConfig.host,
  user     : dbConfig.user,
  password : dbConfig.password,
  database : dbConfig.database
});


var sess;

/* GET Login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Log In' });
});


/* POST Login page. */
router.post('/', function(req, res, next) {
    
    //var uname = req.body.username;
    //var pword = req.body.password;
    sess=req.session;

    
    
    if(req.body.username.length > 0 ){
       
       if(req.body.password.length >= 6){
           
            var uname = req.body.username;
            var pword = req.body.password;
            
            var hashpass = md5(pword);
            
            //connection.connect();
            
//            connection.connect(function(err){
//                if(!err) {
//                    console.log("Database is connected ... \n\n");  
//                } else {
//                    console.log("Error connecting database ... \n\n");  
//                }
//            });

            //var query = connection.query('CALL CHECK_LOGIN_DETAILS("'+uname+'","'+hashpass+'")', function(err, rows, fields) {
            
            pool.getConnection(function(err, connection) {
                
                if(!err) {
                        console.log("Database is connected ... \n\n");  
                } else {
                        console.log("Error connecting database ... \n\n");  
                }
                
                
                var query = connection.query('CALL CHECK_LOGIN_DETAILS(?,?)',
                                [uname,hashpass], function(err, rows) {
              
                if(err)	{
                        throw err;
                }
                console.log("rows.length:"+rows.length);
                if(rows[0].length !== 0 ){
                      console.log( query.sql );
                        //console.log( rows[0][0].first_name );
                        //console.log(fields);
                        //console.log( rows[0] );
                        //console.log("rows.length -> " +rows.length);
                        
                        //for (var i = 0; i < rows.length; i++) {
                        //    console.log(rows[0][i].first_name);
                        //};
                        
                        // Add session variables used to secure pages and for role controle

                        sess.user_id = rows[0][0].account_no;
                        sess.fname = rows[0][0].first_name;
                        sess.lname = rows[0][0].last_name;
                        sess.role = rows[0][0].user_roles_role_id;
                        sess.user_token = rows[0][0].account_no;
                        
                        res.redirect('/dashboard/user/'+sess.user_id);
                    
                }else{
                    req.session.destroy();
                    res.render('login', { title: 'Log In', message:'Password or Username is Invalid' });
                
                }
                connection.release();
            });


                
            });
            
            
       }else{
          
          res.render('login', { title: 'Log In', message:'Password is too short' });
           
       }
    }else{
       
         res.render('login', { title: 'Log In', message:'Username is not valid' });
        
    }
    
  
});

module.exports = router;