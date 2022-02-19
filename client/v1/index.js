const marketplace = require("./data")

// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

console.log('🚀 This is it.');

const MY_FAVORITE_BRANDS = [{
  'name': 'Hopaal',
  'url': 'https://hopaal.com/'
}, {
  'name': 'Loom',
  'url': 'https://www.loom.fr'
}, {
  'name': 'ADRESSE',
  'url': 'https://adresse.paris/'
}];



console.table(MY_FAVORITE_BRANDS);
console.log(MY_FAVORITE_BRANDS[0]);



/**
 * 🌱
 * Let's go with a very very simple first todo
 * Keep pushing
 * 🌱
 */

// 🎯 TODO: The cheapest t-shirt
// 0. I have 3 favorite brands stored in MY_FAVORITE_BRANDS variable
// 1. Create a new variable and assign it the link of the cheapest t-shirt
// I can find on these e-shops
const Cheapest_TShirt1= "https://www.loom.fr/products/le-t-shirt";
const Cheapest_TShirt2='https://hopaal.com/collections/t-shirts-homme/products/classique-forest-t-shirt-homme?variant=19733822111830'
'https://www.loom.fr/products/le-t-shirt'
const Cheapest_TShirt3='https://adresse.paris/t-shirts-et-polos/4238-t-shirt-ranelagh-1300000262026.html'

// 2. Log the variable
console.log("The cheapest Tshirt of loom ", Cheapest_TShirt1)
console.log("The cheapest Tshirt of hopaal ", Cheapest_TShirt2)
console.log("The cheapest Tshirt of adresse.paris ", Cheapest_TShirt3)

/**
 * 👕
 * Easy 😁?
 * Now we manipulate the variable `marketplace`
 * `marketplace` is a list of products from several brands e-shops
 * The variable is loaded by the file data.js
 * 👕
 */


// 🎯 TODO: Number of products
// 1. Create a variable and assign it the number of products
var nbProduct = marketplace.length
// 2. Log the variable
console.log(nbProduct)


// 🎯 TODO: Brands name
// 1. Create a variable and assign it the list of brands name only
const brand_name=[] //list with all brand names
for(let i =0; i<marketplace.length; i++)
{
  brand_name.push(marketplace[i].brand)
}
// 2. Log the variable
console.log("brands",brand_name);
// 3. Log how many brands we have
var unique = brand_name.filter((value, index, a) => a.indexOf(value) === index);  //contains all distinct brands names
console.log("length",unique.length);


// 🎯 TODO: Sort by price
// 1. Create a function to sort the marketplace products by price
function merge(left, right){

  var tab = [], l = 0, r = 0;
  while (l < left.length && r < right.length){
      if (left[l].price < right[r].price){
          tab.push(left[l++]);
      } else {
          tab.push(right[r++]);
      }
  }
  return tab.concat(left.slice(l)).concat(right.slice(r));
}


function sort(tab){
  if (tab.length < 2) {
      return tab;
  }
  var mid = Math.floor(tab.length / 2),
      right = tab.slice(mid),
      left = tab.slice(0, mid),
      p = merge(sort(left), sort(right));
  
  p.unshift(0, tab.length);
  tab.splice.apply(tab, p);
  return tab;
}

// 2. Create a variable and assign it the list of products by price from lowest to highest
sortedMarket = sort(marketplace)
// 3. Log the variable
console.log("sort the marketplace products by price", sortedMarket);


// 🎯 TODO: Sort by date
// 1. Create a function to sort the marketplace objects by products date
function date_to_day(array)
{
  year = array.slice(0,4)
  month = array.slice(5,7)
  day=array.slice(8,10)
  
  return year*365.25+month*30+day
}

function merge(left, right){

  var tab = [], l = 0, r = 0;
  while (l < left.length && r < right.length){
      if (date_to_day(left[l].date) < date_to_day(right[r].date)){
          tab.push(left[l++]);
      } else {
          tab.push(right[r++]);
      }
  }
  return tab.concat(left.slice(l)).concat(right.slice(r));
}


function sort(tab){
  if (tab.length < 2) {
      return tab;
  }
  var mid = Math.floor(tab.length / 2),
      right = tab.slice(mid),
      left = tab.slice(0, mid),
      p = merge(sort(left), sort(right));
  
  p.unshift(0, tab.length);
  tab.splice.apply(tab, p);
  return tab;
}


// 2. Create a variable and assign it the list of products by date from recent to old
sorted_marketplace= sort(marketplace)
// 3. Log the variable
console.log("sorted market place by date",sorted_marketplace)


// 🎯 TODO: Filter a specific price range
// 1. Filter the list of products between 50€ and 100€
var filteredMarket = []
for (let i = 0; i< marketplace.length; i++){if (marketplace[i].price > 50 && marketplace[i].price <100){filteredMarket.push(marketplace[i])}}
// 2. Log the list
console.log("Filter the list of products between 50€ and 100€",filteredMarket)

// 🎯 TODO: Average price
// 1. Determine the average price of the marketplace
var  mean = 0
for (let i = 0; i< marketplace.length; i++){mean+=marketplace[i].price}
mean /= marketplace.length
// 2. Log the average
console.log("Average price",mean)


/**
 * 🏎
 * We are almost done with the `marketplace` variable
 * Keep pushing
 * 🏎
 */

// 🎯 TODO: Products by brands
// 1. Create an object called `brands` to manipulate products by brand name
// The key is the brand name
// The value is the array of products
//
// Example:
// const brands = {
//   'brand-name-1': [{...}, {...}, ..., {...}],
//   'brand-name-2': [{...}, {...}, ..., {...}],
//   ....
//   'brand-name-n': [{...}, {...}, ..., {...}],
// };
//

const brands = {}; //final dic to log

unique.forEach(element => create_dic(element));

function create_dic(brand_name) {
  brands[brand_name] = [];
}

for(let i =0; i<marketplace.length; i++)
{
  brands[marketplace[i].brand].push(marketplace[i])
}
// 2. Log the variable
console.log("Regroup by the brand")
console.log("brands :", brands)
// 3. Log the number of products by brands
console.log("number of products by brands")
Object.keys(brands).forEach(function(key) {
  console.log("BRAND",key)
  console.log("number of products",brands[key].length)
});



// 🎯 TODO: Sort by price for each brand
// 1. For each brand, sort the products by price, from highest to lowest
function merge(left, right){

  var tab = [], l = 0, r = 0;
  while (l < left.length && r < right.length){
      if (left[l].price > right[r].price){
          tab.push(left[l++]);
      } else {
          tab.push(right[r++]);
      }
  }
  return tab.concat(left.slice(l)).concat(right.slice(r));
}

function sort(tab){
  if (tab.length < 2) {
      return tab;
  }
  var mid = Math.floor(tab.length / 2),
      right = tab.slice(mid),
      left = tab.slice(0, mid),
      p = merge(sort(left), sort(right));
  
  p.unshift(0, tab.length);
  tab.splice.apply(tab, p);
  return tab;
}

list=[]

Object.keys(brands).forEach(function(key) {
  list.push(sort(brands[key]));
});

// 2. Log the sort
console.log(list)

// 🎯 TODO: Sort by date for each brand
// 1. For each brand, sort the products by date, from old to recent
list=[]
function merge(left, right){

  var tab = [], l = 0, r = 0;
  while (l < left.length && r < right.length){
      if (left[l].date > right[r].date){
          tab.push(left[l++]);
      } else {
          tab.push(right[r++]);
      }
  }
  return tab.concat(left.slice(l)).concat(right.slice(r));
}

function sort(tab){
  if (tab.length < 2) {
      return tab;
  }
  var mid = Math.floor(tab.length / 2),
      right = tab.slice(mid),
      left = tab.slice(0, mid),
      p = merge(sort(left), sort(right));
  
  p.unshift(0, tab.length);
  tab.splice.apply(tab, p);
  return tab;
}
Object.keys(brands).forEach(function(key) {
  list.push(sort(brands[key]))});
// 2. Log the sort
console.log(list)



/**
 * 💶
 * Let's talk about money now
 * Do some Maths
 * 💶
 */

// 🎯 TODO: Compute the p90 price value
// 1. Compute the p90 price value of each brand
// The p90 value (90th percentile) is the lower value expected to be exceeded in 90% of the products

dico = {};

function date_to_day(array) {
  year = array.slice(0, 4);
  month = array.slice(5, 7);
  day = array.slice(8, 10);

  return year * 365.25 + month * 30 + day;
}

function merge(left, right) {
  var tab = [],
    l = 0,
    r = 0;
  while (l < left.length && r < right.length) {
    if (date_to_day(left[l].date) < date_to_day(right[r].date)) {
      tab.push(left[l++]);
    } else {
      tab.push(right[r++]);
    }
  }
  return tab.concat(left.slice(l)).concat(right.slice(r));
}

function sort(tab) {
  if (tab.length < 2) {
    return tab;
  }
  var mid = Math.floor(tab.length / 2),
    right = tab.slice(mid),
    left = tab.slice(0, mid),
    p = merge(sort(left), sort(right));

  p.unshift(0, tab.length);
  tab.splice.apply(tab, p);
  return tab;
}

Object.keys(brands).forEach(function (key) {
  dico[key] = sort(brands[key]);
});

function p90_price_value(dic) {
  Object.keys(dic).forEach(function (key) {
    console.log("90th percentile for brand",key)
    console.log(dic[key][parseInt(0.9 *dic[key].length)]);
  });
}

p90_price_value(dico);





/**
 * 🧥
 * Cool for your effort.
 * It's almost done
 * Now we manipulate the variable `COTELE_PARIS`
 * `COTELE_PARIS` is a list of products from https://coteleparis.com/collections/tous-les-produits-cotele
 * 🧥
 */

const COTELE_PARIS = [
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-gris',
    price: 45,
    name: 'BASEBALL CAP - TAUPE',
    uuid: 'af07d5a4-778d-56ad-b3f5-7001bf7f2b7d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-navy',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - NAVY',
    uuid: 'd62e3055-1eb2-5c09-b865-9d0438bcf075',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-fuchsia',
    price: 110,
    name: 'VESTE - FUCHSIA',
    uuid: 'da3858a2-95e3-53da-b92c-7f3d535a753d',
    released: '2020-11-17'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-camel',
    price: 45,
    name: 'BASEBALL CAP - CAMEL',
    uuid: 'b56c6d88-749a-5b4c-b571-e5b5c6483131',
    released: '2020-10-19'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-beige',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BEIGE',
    uuid: 'f64727eb-215e-5229-b3f9-063b5354700d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-rouge-vermeil',
    price: 110,
    name: 'VESTE - ROUGE VERMEIL',
    uuid: '4370637a-9e34-5d0f-9631-04d54a838a6e',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-bordeaux',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BORDEAUX',
    uuid: '93d80d82-3fc3-55dd-a7ef-09a32053e36c',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/le-bob-dylan-gris',
    price: 45,
    name: 'BOB DYLAN - TAUPE',
    uuid: 'f48810f1-a822-5ee3-b41a-be15e9a97e3f',
    released: '2020-12-21'
  }
]

// 🎯 TODO: New released products
// // 1. Log if we have new products only (true or false)
// // A new product is a product `released` less than 2 weeks.
test = true
for (let i = 0; i<COTELE_PARIS.length; i++)
{
  if(date_to_day(COTELE_PARIS[i].released)+14 < date_to_day(string(today.year+"-"+today.month+"-"+today.day)))
  { 
    test = false
  }
}
// 🎯 TODO: Reasonable price
// // 1. Log if coteleparis is a reasonable price shop (true or false)
// // A reasonable price if all the products are less than 100€
test2= true
for (let i = 0; i<COTELE_PARIS.length; i++){if(COTELE_PARIS[i].price > 100){ test2 = false}}

// 🎯 TODO: Find a specific product
// 1. Find the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the product
for (let i = 0; i<COTELE_PARIS.length; i++){if(COTELE_PARIS[i].uuid == 'b56c6d88-749a-5b4c-b571-e5b5c6483131'){var specificProduct = COTELE_PARIS[i]}}


// 🎯 TODO: Delete a specific product
// 1. Delete the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the new list of product

New_List = COTELE_PARIS
for (let i = 0; i<COTELE_PARIS.length; i++)
{
  if(COTELE_PARIS[i].uuid == 'b56c6d88-749a-5b4c-b571-e5b5c6483131'){var index = i}
}
New_List.splice(index, -1)

// 🎯 TODO: Save the favorite product
let blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};



// we make a copy of blueJacket to jacket
// and set a new property `favorite` to true
// 1. Log `blueJacket` and `jacket` variables
// 2. What do you notice?

blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// 3. Update `jacket` property with `favorite` to true WITHOUT changing blueJacket properties
jacket = JSON.parse(JSON.stringify(blueJacket));

jacket.favorite = true;


/**
 * 🎬
 * The End
 * 🎬
 */

// 🎯 TODO: Save in localStorage
// 1. Save MY_FAVORITE_BRANDS in the localStorage
// 2. log the localStorage


