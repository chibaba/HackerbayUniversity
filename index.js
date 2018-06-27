const express = require("express");
const Sequelize = require("sequelize");
const passportLocalSequelize = require("passport-local-sequelize");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const passport = require("passport");
const apiRoutes = express.Router();
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").Extracted;

const connection = new Sequelize("palandas", "postgres", "newpassword", {
  host: "localhost",
  dialect: "postgres"
});
const User = connection.define(
  "user", 
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    email:  {
          type: Sequelize.STRING,
          isUnique: true,
          allowNull: false,
          isEmail: true
         },
    password: Sequelize.STRING
  },
  {
    hooks: {
      beforeValidate: User => {
        User.password = bcrypt.hashSync(User.password, 10);
      }
    }
  }
);


connection
  .sync({
    force: true,
    logging: console.log
  })
  .then(() => {
    return User.build({
      email: "chiba@gmail.com",
      password: "we are here"
    }).save();
  })
  .catch(error => {
    console.log(error);
  });

const jwt = require("jsonwebtoken");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//initialize passport
app.use(passport.initialize());



// Register new user
apiRoutes.post("/user/signup", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({
      success: false,
      message: "please enter an email and password to register"
    });
  } else {
    let newUser = new User({
      email: req.body.email,
      password: req.body.password
    });

    //Attempt to save the new user
    // User.create({
    //   username: req.body.username,
    //   email: req.body.email,
    //   password: password
    // }).then(function () {
    //   return res.status(200).json({ message: "user created" });
    // }).catch(Sequelize.ValidationError, function (msg) {
    //   return res.status(422).send(err.errors);
    // }).catch(function (err) {
    //   return res.status(400).json({ message: "issues trying to connect to database" });
    // })
    newUser.save(err => {
      if (err && isUniqueError) {
        return res.catch(Sequelize.ValidationError).status(400).json({
          
          message: "That email address already exist."
        });
      }
      res
        .status(200)
        .json({ success: true, message: "Successfully created new user " });
    });
  }
});

const verify = (passport) => {

  let options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeader();
  options.secret = "newpassword";
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      User.findOne({ id: jwt_payload.id }, (err, user) => {
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
};
//Authenticate the user and get a JWT
apiRoutes.post("/User/login", (req, res) => {
  User.findOne(
    {
      email: req.body.email
    },
    (err, user) => {
      if (err) {
        return res.status(500).json({message: 'user not found'})
      }

      if (!user) {
        res.send({
          success: false,
          message: "Authenticate failed. User not found."
        });
      } else {
        //Check if the password matches
        const password = User.generateHash(req.body.password);
          // create the token
          const token = jwt.sign(user, secretOrKey, {
            expiresIn: 10000080
          });
          res.json({ success: true, token: "JWT" + token });
        }  {
          res.send({
            success: false,
            message: "Authentication failed. Passwords did not match"
          });
        }
      //}
    }
  );
});



app.listen(3000, () => console.log("Server started on port 3000"));
