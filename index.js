const express = require('express');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');

const connection = new Sequelize('palandas', 'postgres', 'newpassword', {
  host: 'localhost',
  dialect: 'postgres'
});
 const Conn = connection.define('conn', {
   email : Sequelize.TEXT,
   password: Sequelize.TEXT
 }, {
   hooks: {
     afterValidate:   (Conn) => {
       Conn.password = bcrypt.hashSync(Conn.password, 10);
     }
     }
 });
//   id   :{
//     primaryKey  :true,
//     autoIncrement  :true,
//     type           : Sequelize.INTEGER,
//     allowNull      : false
//   },
//   email    :{
//     type   :   Sequelize.STRING,
//     isUnique : true,
//     allowNull:false,
//     validate:{
//       isEmail : true
//     }
//   },
//   password  : {
//     type: Sequelize.INTEGER
//   }
// });

 connection.sync({
   force: true,
   logging: console.log
 }).then(() => {
   return Conn.create({
     email: 'chiba@gmail.com',
     password: 'we are here'

   })

 }).catch((error) => {
   console.log(error)
 })
  
const jwt = require('jsonwebtoken');

const app = express();


app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
});

app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403)
    } else {

      res.json({
        message: 'Post created',
        authData
      })
    }
  });
});

app.post('api/login', (req,res) => {
  //mock user
  const user = {
    id: 1,
    username: 'chibaba',
    email: 'chi@gmail.com'
  }

  jwt.sign({user: user}, 'secretkey',(err, token) => {
    token:token
  })
})

//verifyToken
function verifyToken(req, res, next) {
  //Get the auth header value
  const bearerHeader = req.headers['authorization']
  // check if bearer is undefined 
  if(typeof bearerHeader != 'undefined') {
    // Split at the Space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    //set the token
    req.token = bearerToken
    //Next Middleware
    next();

  } else {
    //forbidden
    res.sendStatus(403);
  }
}

app.listen(3000, () => console.log('Server started on port 3000'));