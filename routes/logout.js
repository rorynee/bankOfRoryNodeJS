var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    
    
    
    req.session.destroy();
    
  res.render('login', { title: 'Log In', success: "You Have Been Logged Out"  });
});

module.exports = router;