/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sites/dedicatedbrand');
const loom = require('./sites/loom');
const db = require('./db');
var today = new Date();
var twoweeksago = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()-14);

async function sandbox () {
  try {
    let products = [];
    let pages = [
      'https://www.dedicatedbrand.com/en/men/basics',
      'https://www.dedicatedbrand.com/en/men/sale'
    ];

    console.log(`🕵️‍♀️  browsing ${pages.length} pages with for...of`);

    // Way 1 with for of: we scrape page by page
    for (let page of pages) {
      console.log(`🕵️‍♀️  scraping ${page}`);

      let results = await dedicatedbrand.scrape(page);

      console.log(`👕 ${results.length} products found`);

      products.push(results);
    }

    pages = [
      'https://www.loom.fr/collections/hauts-homme',
      'https://www.loom.fr/collections/bas-homme'
    ];

    console.log('\n');

    console.log(`🕵️‍♀️  browsing ${pages.length} pages with Promise.all`);

    const promises = pages.map(page => loom.scrape(page));
    const results = await Promise.all(promises);

    console.log(`👕 ${results.length} results of promises found`);
    console.log(`👕 ${results.flat().length} products found`);

    console.log(results);
    console.log(results.flat());

    products.push(results.flat());
    products = products.flat();

    console.log('\n');

    console.log(`👕 ${products.length} total of products found`);
    console.log('\n');

    const result = await db.insert(products);

    console.log(`💽  ${result.insertedCount} inserted products`);

    console.log('\n');

    //Find all products related to a given brands
    console.log('💽  Find Loom products only');
    const loomOnly = await db.find({'brand': 'loom'});
    console.log(`👕 ${loomOnly.length} total of products found for Loom`);
    console.log(loomOnly);

    //Find all products less than a price
    console.log('💽  Find all products less than 40$')
    const less_price = await db.find({'price':{$lt : 40}});
    console.log(`👕 ${less_price.length} total of products found for less than 40$`);

    //Find all products sorted by price 
    console.log('💽  Find all products all products sorted by price ');
    const sorted_by_price = await db.aggregate({$sort : {"price": 1}});
    console.log(`👕 ${sorted_by_price.length} total of products sorted by price`);

    //Find all products sorted by date 
    console.log('💽  Find all products all products sorted by price ');
    const sorted_by_date = await db.aggregate({$sort : {"date": 1}});
    console.log(`👕 ${sorted_by_date.length} total of products sorted by price`);

    //Find all products scraped less than 2 weeks
    console.log('💽  Find all products all products recently scraped ');
    const recent_products = await db.aggregate([{ "$match": { "$expr": { "$gt": ["$date", twoweeksago] } } }]);
    console.log(`👕 ${recent_products.length} total of products sorted by price`);


    db.close();
  } catch (e) {
    console.error(e);
  }
}

sandbox();
