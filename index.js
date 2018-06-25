const express = require("express");
const Sequelize = require("sequelize");
passportLocalSequelize = require("passport-local-sequelize");
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
      type: Sequelize.INTEGER,
      defaultValue: 01,
      primaryKey: true,
      unique: true
    },
    email: Sequelize.STRING,
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
    force: false,
    logging: console.log
  })
  .then(() => {
    return User.build({
      id: Math.random(),
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
apiRoutes.post("/user/sign up", (req, res) => {
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
    newUser.save(err => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "That email address already exist."
        });
      }
      res
        .status(200)
        .json({ success: true, message: "Successfully created new user " });
    });
  }
});

//Authenticate the user and get a JWT
apiRoutes.post("/User/login", (req, res) => {
  User.findOne(
    {
      email: req.body.email
    },
    (err, user) => {
      if (err) throw err;

      if (!user) {
        res.send({
          success: false,
          message: "Authenticate failed. User not found."
        });
      } else {
        //Check if the password matches
        if (isMatch && !err) {
          // create the token
          var token = jwt.sign(user, config.secret, {
            expiresIn: 10000080
          });
          res.json({ success: true, token: "JWT" + token });
        } else {
          res.send({
            success: false,
            message: "Authentication failed. Passwords did not match"
          });
        }
      }
    }
  );
});

apiRoutes.post("/api/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Post created",
        authData
      });
    }
  });
});

apiRoutes.post("api/login", (req, res) => {
  //mock user
  const user = {
    id: 1,
    username: "chibaba",
    email: "chi@gmail.com"
  };

  jwt.sign({ user: user }, "password", (err, token) => {
    token: token;
  });
});

module.exports = function(passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrkey = config.secret;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
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

//verifyToken
function verifyToken(req, res, next) {
  //Get the auth header value
  const bearerHeader = req.headers["authorization"];
  // check if bearer is undefined
  if (typeof bearerHeader != "undefined") {
    // Split at the Space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    //set the token
    req.token = bearerToken;
    //Next Middleware
    next();
  } else {
    //forbidden
    res.sendStatus(403);
  }
}

app.listen(3000, () => console.log("Server started on port 3000"));
