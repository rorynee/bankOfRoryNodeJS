var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    
    if(req.session.role){
        
        req.session.destroy();
    
        res.render('login', { title: 'Log In', success: "You Have Been Logged Out"  }); 
        
    }else{
        
        req.session.destroy();
    
        res.render('login', { title: 'Log In', message: "Unauthorized Access. Please login again."  }); 
    }
    
  
});

module.exports = router;