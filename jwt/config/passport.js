const JwtStrategy = require('passport-jwt').Strategy;
 const  ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports= (passport) => {

  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = 'newpassword';
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.getUserById( jwt_payload._doc._id, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );
}