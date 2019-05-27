var express = require('express');
var router = express.Router();
var Admin=require('../model/Admin')
var validator=require('email-validator')
var passwordValidator = require('password-validator')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})

router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Home Page' });
})

router.get('/signup',function(req,res,next){
  res.render('signup')
})

router.post('/signup',function(req,res,next){
  var admin=Admin()
  admin.name=req.body.name;
  admin.email=req.body.email;
  admin.password=req.body.password;
  console.log('Admin=====>',admin);
  admin.save(function(err,rtn){
    if(err) throw err;
    console.log(rtn);
    res.redirect('/');
  })
})

router.get('/signin',function(req,res,next){
  res.render('signin')
})

router.post('/signin',function(req,res,next){
  Admin.findOne({email:req.body.email},function (err,admin){
    if(err) throw err;
    
    if(admin != null && Admin.compare(req.body.password,admin.password)){
      req.session.user = {name:admin.name, email:admin.email, id:admin._id}
      res.redirect('/users/useradd')
    }else{
      res.redirect('/signin')
    }
  })
})

router.post('/emaildu',function(req,res,next){
  Admin.findOne({email:req.body.email},function(err,rtn){
    if(err) throw err;
    var check=(req.body.email == ''?true:validator.validate(req.body.email))
    console.log('email val is',validator.validate(req.body.email));
    if(rtn != null || !check){
      res.json({status:true})
    }else {
      res.json({status:false})
    }
  })
})

router.post('/pwdcheck',function(req,res,next){
  var schema = new passwordValidator();

// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist th
  res.json({status:schema.validate(req.body.password)})
})

module.exports = router;
