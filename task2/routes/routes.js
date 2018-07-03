const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
module.exports = (app, passport) => {
  app.get('/', (req, res) => {
    res.json('welcome to authenticating jwt')
  });
  app.post('/signup', (req, res) => {
    const newUser = new User({
      email:req.body.email,
      password:req.body.password
    });
    User.createUser(newUser, (err, user) => {
       if(err) {
         res.json({success:false, message:'user is not registered..'});
       } else {
         res.json({success:true, message:'user is registered..'})
       }

    });
  });
  app.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    User.getUserByEmail(email, (err, user) => {
      if(err && !user) {
        res.status(500).json({success:false, message:'sequelizeValidationError'})
      }
      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) {
          res.status(500)
        }
        if(isMatch) {
          const token = jwt.sign(user,'newpassword', {expiresIn:600000000});
          res.json({success:true, token:token, user:{
            id: user._id,
            email: user.email,
            password:user.password
          }});
        } else {
          return  res.status(500).json({success:false, message:'sequelizeValidationError'})
        }
      })
    });
  });
  app.get('/profile', passport.authenticate('jwt',{session: false}), (req, res) => {
    res.json({user: user.req});
  });
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  })
}


