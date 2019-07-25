var express = require('express');
var router = express.Router();
var sql = require('../db');
var passport = require('passport');

function authMiddleware(){
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login?fail=true')
  }
}

/* GET home page.*/
router.get('/', function(req, res, next) {
  res.render('index', {message: 'Express'});
});

//GET login page
router.get('/login', function(req, res, next) {
  if(req.query.fail){
    res.render('login', { message: 'Incorrect e-mail and/or password!' });
  }else{
    res.render('login', { message: null });
  }
});

//POST Login Page
router.post('/login',
  passport.authenticate('local', { successRedirect: '/to-do', failureRedirect: '/login?fail=true' })
);

//GET SIGN UP page
router.get('/signup', function(req, res, next) {
  if(req.query.fail){
    res.render('signup', { message: 'Sign up failed! Username or e-mail already registered!' });
  }else{
    res.render('signup', { message: null });
  }
});

//POST MySQL INSERT Query
router.post('/signup', function(req, res, next){
  sql.createUser(req.body.username, req.body.email, req.body.password, function(err, result){
    if(err){
      res.redirect('/signup?fail=true');
    }else{
      res.redirect('/login');
    }
  });
});

//Get To-do page
router.get('/to-do', authMiddleware(), function(req, res, next){
  sql.getTask(function(err, result){
    if(err){
      res.render('to-do', {message: null})
    }else{
      res.render('to-do', {username: req.user[0].username, data: result});
    }
  });
});

//Create Tasks
router.post('/create', authMiddleware(), function(req, res, next){
  sql.createTask(req.body.task, req.user[0].username);
  res.redirect('/to-do');
})

//Update Tasks
router.post('/update', authMiddleware(), function(req, res, next){
  sql.updateTask(req.body.id, req.body.task);
  res.redirect('/to-do');
})

//Delete Tasks
router.post('/delete', authMiddleware(), function(req, res, next){
  sql.deleteTask(req.body.id);
  res.redirect('/to-do');
})

//Logout Function
router.post('/logout', function(req, res, next){
  req.logOut();
  res.redirect('/login');
});

module.exports = router;
