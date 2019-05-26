var express = require('express');
var router = express.Router();
var User=require('../model/User')
var bcrypt=require('bcrypt-nodejs')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/useradd', function(req, res, next) {
res.render('user/user-add', { title: 'User add' });
})

router.post('/useradd', function(req, res, next) {
var user=new User();
user.name=req.body.name;
user.email=req.body.email;
user.password=req.body.password;
user.save(function(err,rtn){
  if(err) throw err;
  res.redirect('/users/userlist')
})
})

router.get('/userlist', function(req, res, next) {
User.find({},function(err,rtn){
  if(err) throw err;
  res.render('user/user-list',{title:'User list',users:rtn})
})
})

router.get('/userupdate/:id',function (req,res,next){
User.findById(req.params.id,function (err,rtn){
  if(err) throw err;
  console.log(rtn)
  res.render('user/user-update',{title:'User Update',users:rtn})
})
})

router.post('/userupdate',function (req,res,next){
var updateD={
  name: req.body.name,
  email: req.body.email,
  password:bcrypt.hashSync(this.password,bcrypt.genSaltSync(8),null)
}
User.findByIdAndUpdate(req.body.id,{$set:updateD},function(err,rtn){
  if(err) throw err;
  res.redirect('/users/userlist')
})
})

router.get('/userdetail/:id',function (req,res,next){
User.findById(req.params.id,function (err,rtn){
  if(err) throw err;
  res.render('user/user-detail',{title:'User Detail',users:rtn})
})
})

router.get('/userdel/:id',function (req,res,next){
User.findByIdAndRemove(req.params.id,function(err,rtn){
  if(err) throw err;
  res.redirect('/users/userlist')
})
})

router.post('/emaildu',function(req,res,next){
  User.findOne({email:req.body.email},function(err,rtn){
    if(err) throw err;
    if(rtn != null){
      res.json({status:true})
    }else {
      res.json({status:false})
    }
  })
})

module.exports = router;
