const express = require ('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).json('success');
});

 let data = []
app.post('/data',(req, res) => {
  let post = req.body.data
  data.push(post)
}).then(data=> res.json(post)).catch(err=> res.status(500).json('error creating API'));

app.get('/data', (req, res) => {
 res.json(data);
});

app.listen(3000, () => {
  console.log('we are live on port 3000')
})
