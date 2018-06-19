const express = require ('express');

const app = express();

app.get('/', (req, res) =>{
  res.status(200).json('success');
});

app.post('/data',(req, res) =>{
  let { home , address } = req.body;
  data.create({
    home,
    address
  
}).then(data=> res.json(data)).catch(err=> res.status(500).json('error creating API'));
});

app.get('/data', (req, res) =>{
 res.data('Any string man');
});

app.listen(3000, () =>{
  console.log('we are live on port 3000')
})
