const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db =  require('./db');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/products/:id', async (request, response, next) => {
  if(request.params.id!="search") {
    console.log(`🕵️‍♀️ Fetch a specific product identify by ${request.params.id}`);
    result= await db.find({'_id':request.params.id})
    response.send(result);
  }
  else next()
  
});

app.get('/products/search', async (request, response) => {
  console.log(`🕵️‍♀️ search 1a specific product identify by a specific query : ${request.query}`);
  let query = {}
  let limit = 12;
  if (request.query.limit!=null){
    limit = parseInt(request.query.limit);
  }
  if(request.query.brand!=null){
    query["brand"]=request.query.brand;
  }
  if(request.query.price!=null){
    query["price"]={$lt :parseFloat(request.query.price)};
  }
  
  result= await db.find(query)
  console.log(result)
  response.send(result.sort((a,b) => (a.price>b.price)?1:-1).slice(0,limit))  //or slice

});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
