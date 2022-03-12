/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimart = require('./sites/montlimart');
const adresseParis =require("./sites/adresseParis");
const fs = require("fs");


const Eshop = [
    'https://www.dedicatedbrand.com/en/men/news',
    'https://www.montlimart.com/toute-la-collection.html',
    'https://adresse.paris/630-toute-la-collection'
]
let moduleRequired =[
  dedicatedbrand,
  montlimart, 
  adresseParis
]
let all_produts=[]

async function sandbox () {
  
  for(let i=0; i<Eshop.length;i++){
    try {
      console.log(`🕵️‍♀️  browsing ${Eshop[i]} source`);
      products= await moduleRequired[i].scrape(Eshop[i]);
      console.log(products);
      console.log("done1");

      all_produts.push(products);
      fs.writeFile('scrapted_products.json',all_produts,function(err){
      if(err) {
          throw err;
        }
        console.log('json script created')
      })

    } 
    catch (e) {
      console.error(e);
    }

  };
  
}

const [,, eshop] = process.argv;

sandbox(eshop);
