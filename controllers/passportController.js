const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/', function(req, res, next) {
  res.redirect('/home');
});

//Logging in
router.get('/auth/google', passport.authenticate( 
  //Which passport strategu to use
  'google',
  {
    scope: ['profile', 'email'],
    //Optional
    prompt: 'select_account' //<-- this will allow the user to selecet account if they have many gmail
  }
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/home',
    //chnaage to whats best for your app
    failureRedirect: '/home'
  }
));

router.get('/logout', function(req, res){
  req.logout(function(){
    res.redirect('/home') //<-- chnage path for your landing page/app
  })//<--- added by passport 
});



module.exports = router;