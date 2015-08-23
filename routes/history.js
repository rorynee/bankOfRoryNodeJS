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
    
    if(new String(req.session.user_id).valueOf() === new String(req.params.id).valueOf()){
    
        
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
                    });
                    // Call to trans table - GET_TRANSACTIONS
                    connection.query('CALL GET_TRANSACTIONS(?)',
                                    [req.params.id], function(err, rows_trans) {

                    if(err)	{
                            throw err;
                    }
                    //console.log(rows_trans[0][0]);
                    //console.log(rows_trans[0][1]);
                    console.log(rows_trans[0]);
                    var trans = rows_trans[0];
                    //for (var i = 0; i < rows_trans[0].length; i++) {
                    //    trans += rows_trans[0][i];
                    //};
                    //console.log(trans);
                    res.render('history', { title: 'Dashboard - History', sess: req.session, user: userdetails, trans: trans });  
                                       
                    connection.release();
                    });

        });
        
    }else{
        res.redirect('/logout');
    }
    
});    




module.exports = router;