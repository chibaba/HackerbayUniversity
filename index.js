const express = require ('express');

const app = express();
//const router = express.Router();
//const request = require ('request');

app.get('/', (req, res) =>{
  res.status('success');
});

app.post('/data',(req, res)=>{
  req('https:we are good', (req, res, body) =>{
  }).then(data=> res.json(data)).catch(err=> res.status(500).json('error creating API'));
});

app.get('/data', (req, res)=>{
 res.data('Any string man');
});

app.listen(3000, ()=>{
  console.log('we are live on port 3000')
})
