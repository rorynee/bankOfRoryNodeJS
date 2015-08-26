var express = require('express');
var router = express.Router();

// Can't set headers after they are sent


/* GET home page. */
router.get('/', function(req, res, next) {
    
    if(req.session.role){
        
        if(req.session.account){
            req.session.destroy();
    
            res.render('login', { title: 'Log In', success: "Goodbye and Thank you for your custome"  });    
        }
        
        
        req.session.destroy();
    
        res.render('login', { title: 'Log In', success: "You Have Been Logged Out"  }); 
        
    }else{

        req.session.destroy();
    
        res.render('login', { title: 'Log In', message: "Unauthorized Access. Please login again."  }); 
    }
    
  
});

module.exports = router;