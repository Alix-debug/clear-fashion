// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';
// All distinct brands
const all_brands = ['loom', 'coteleparis', 'adresse', '1083', 'dedicated'];


// current products on the page
let currentBrand="";
let currentProducts = [];
let currentPagination = {};
let myFavourites=[];

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select')
const selectFilter = document.querySelector('#filter-select')
const selectSort = document.querySelector('#sort-select')
const spanP50 = document.querySelector('#p50')
const spanP90 = document.querySelector('#p90')
const spanP95= document.querySelector('#p95')

const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.querySelector('#nbNewProducts');
const spanLastReleased = document.querySelector('#last_released')


 /**
  * Feature 10 - p50, p90 and p95 price value indicator
  * As a user
  * I want to indicate the p50, p90 and p95 price value
  * So that I can understand the price values of the products
  * Note : The p90 value (90th percentile) is the lower value expected to be exceeded in 90% of the products prices
  * @param {Object} array 
  * @param {float} quantile 
  * @returns 
  */

function quantile(array, quantile){
  const sorted = array.sort((a,b) => (a.price<b.price)?1:-1);
  var pos = (sorted.length - 1) * quantile,
      low = Math.floor(pos),
      rest = pos - low;

  if (sorted[low + 1] !== undefined) {
      return (sorted[low].price + rest * (sorted[low + 1].price - sorted[low].price)).toFixed(2);
  } else {
      return sorted[low].price;
  }
};

/**
  *
  Feature 3 - Filter by recent products
  As a user
  I want to filter by recent products
  So that I can browse the new released products (less than 2 weeks)
  *
 * @param {array} product_date 
 * @returns the number of day between the release date of the product and now
 */
function day_date(product_date){
  var today = new Date();
  var day = today.getDate();
  var month = today.getMonth()+1; 
  var year = today.getFullYear();

  var now=year * 365.25 + month * 30 + day
  var product_release = product_date.slice(0, 4)* 365.25 + product_date.slice(5, 7) * 30 + product_date.slice(8, 10);
  return parseInt(now - product_release)
}

/** Recent_products function
 * @param {Object} product 
 * @returns list of products with a release date anterior of 2 weeks
 */
function recent_products(product){
  let recent_products =[]
  product.forEach(
    element => 
      {
       if(day_date(element.released)<=14) 
        recent_products.push(element);})
  return recent_products;
  }

/** Merging for Sorting Function : from lowest to highest prices of the products
 * @param {products} left 
 * @param {products} right 
 * @returns new sorted array
 */
function merge_cheapest(left, right){

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

/** Merging for Sorting Function : from most expensive to cheapest prices of the products
 * 
 * @param {products} left 
 * @param {products} right 
 * @returns new sorted array
 */
 function merge_expensive(left, right){

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

/** function sort by price
 * 
 * @param {array} tab array of products
 * @param {boolean} cheapest = true by default : sort by cheapest 
 * @returns 
 */
function sort(tab,cheapest=true){
  if (tab.length < 2) {
      return tab;
  }
  var mid = Math.floor(tab.length / 2),
      right = tab.slice(mid),
      left = tab.slice(0, mid),
      p

  if (cheapest===true){
    p = merge_cheapest(sort(left), sort(right));
  }
  if (cheapest===false)
  {
    p = merge_expensive(sort(left), sort(right));
  } 
      
  p.unshift(0, tab.length);
  tab.splice.apply(tab, p);
  return tab;
}
/**
 * function to save favourite products
 * @param {string} productID 
 */
function AddToFavourite (productID){
  currentProducts.forEach(element=>{
    if(element.uuid === productID)
      myFavourites.push(element);
  });
}



/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Set global value
 * @param {string} selected_brand 
 * @param {Array} brands 
 */
 const setCurrentBrand = (selected_brand)=>{
  console.log("setCurrentBrand   selected brand",selected_brand)
  currentBrand=selected_brand;
}


/** 
 *  Declaration of onlyUnique function that returns unique items of an array
*/
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch (per default at 1)
 * @param  {Number}  [size=12] - size of the page (per default at 12)
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12,brandname="") => {
  try {
   
      const response = await fetch(
        `https://clear-fashion-api.vercel.app?page=${page}&size=${size}&brand=${brandname}`
      );
      const body = await response.json();
    
    
    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    /**
     * to find all distinct brands
     */
    /*const all_brands= await fetch(
      `https://clear-fashion-api.vercel.app?page=1&size=139`
    );
    const body_all_brand = await all_brands.json();
    
    if (body_all_brand.success !== true) {
      console.error(body_all_brand);
      return {currentProducts, currentPagination};
    }

    var brands=[]
    for(let i =0;i<body_all_brand.data.result.length;i++){
      brands.push(body_all_brand.data.result[i].brand);
    }
    const unique_brands = brands.filter(onlyUnique);
    //console.log("Here is the list of all available brands :",unique_brands);
    */

    return body.data;

  } 
  catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * 
 * Feature 12 - Open product link
 * As a user
 * I want to open product link in a new page
 * So that I can buy the product easily
 * 
 * 
 * Feature 13 - Save as favorite
 * As a user
 * I want to save a product as favorite
 * So that I can retreive this product later

 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>Brand : ${product.brand}, </span>
        <a href="${product.link}" target="_blank">${product.name}</a>
        <span>(Price : ${product.price} €)</span>
        <button class='myFavourites' onclick=AddToFavourite("${product.uuid}")>♥ Add to My favourite</button>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render brand selector
 * @param  {Object} brand
 */
 const renderBrands = brand => {
  const currentBrand=brand;
  const options = Array.from(
    {'length': all_brands.length},
    (value, index) => `<option value="${all_brands[index]}">${all_brands[index]}</option>`
  ).join('');

  selectBrand.innerHTML = options;
  selectBrand.value=currentBrand;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/** 
 * Render page indicators
 * @param  {Object} pagination
 * 
 * Feature 8 - Number of products indicator
 * As a user
 * I want to indicate the total number of products
 * So that I can understand how many products is available
 * 
 *
 * Feature 9 - Number of recent products indicator
 * As a user
 * I want to indicate the total number of recent products
 * So that I can understand how many new products are available
*/

const renderIndicators = (pagination,products) => {
  const {count} = pagination;
  spanNbProducts.innerHTML = count;
  spanNbNewProducts.innerHTML = recent_products(products).length;
};

const render = (products, pagination, brand) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination,products);
  renderBrands(brand);
  renderp50(products);
  renderp90(products);
  renderp95(products);
  lastReleaseYear(products);
};

/*
Feature 10 - p50, p90 and p95 price value indicator
As a user
I want to indicate the p50, p90 and p95 price value
So that I can understand the price values of the products
Note : The p90 value (90th percentile) is the lower value expected to be exceeded in 90% of the products prices
*/
/**
 * Render p50 price value
 * @param {Object} products 
 */
const renderp50 = products => {
  const p50= quantile(products,0.5);
  spanP50.innerHTML=p50;
}
/**
 * Render p90 price value
 * @param {Object} products 
 */
const renderp90 = products => {
  const p90= quantile(products,0.9);
  spanP90.innerHTML=p90;
}
/**
 * Render p95 price value
 * @param {Object} products 
 */
const renderp95 = products => {
  const p95= quantile(products,0.95);
  spanP95.innerHTML=p95;
}
/**
 * Feature 11 - Last released date indicator
 * As a user
 * I want to indicate the last released date
 * So that I can understand if we have new products
 * @param {Object} products 
 */
const lastReleaseYear = products => {
  products=products.sort((a,b)=>(Date.parse(a.released)<Date.parse(b.released))?1:-1);
  spanLastReleased.innerHTML=products[0].released

}
/**
 * Declaration of all Listeners
 */

/** selectShow.addEventListener : Select the number of products to display
 *  Correspond to Feature 0 - Show more
 *    As a user
 *    I want to show more products
 *    So that I can display 12, 24 or 48 products on the same page
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(1, parseInt(event.target.value),selectBrand.value);
  console.log("selectShow")
  console.log("products",products)
  console.log("selected brand",selectBrand.value)
  setCurrentBrand(selectBrand.value)
  setCurrentProducts(products);//change the pagination
  render(currentProducts, currentPagination,currentBrand);
});

/* selectPage.addEventListener : enable to change the page
 *  Correspond to Feature 1 - Browse pages
 *    As a user
 *    I want to browse available pages
 *    So that I can load more products
*/
selectPage.addEventListener('change', async (event) => {
  //Reminder : fetchProducts = async (page = 1, size = 12)
  //parseInt(event.target.value) = n° of the page
  //parseInt(selectShow.value) = nb of products to show
  const products = await fetchProducts(parseInt(event.target.value),parseInt(selectShow.value),selectBrand.value);
  console.log("selectPage");
  console.log("products",products);
  console.log("selected brand",selectBrand.value)
  setCurrentBrand(selectBrand.value)
  setCurrentProducts(products);//change the pagination
  render(currentProducts, currentPagination,currentBrand);
});

/* selectBrand.addEventListener : filter the product by brand
* Feature 2 - Filter by brands
*    As a user
*    I want to filter by brands name
*    So that I can browse product for a specific brand
*/
selectBrand.addEventListener('change', async (event) =>{
  console.log("selectBrand");
  console.log("brand ",event.target.value)
  const products = await fetchProducts(parseInt(selectPage.value),parseInt(selectShow.value),event.target.value)
  const brand = event.target.value

  setCurrentBrand(event.target.value)
  setCurrentProducts(products);//change the pagination
  render(currentProducts, currentPagination,currentBrand);
});

selectFilter.addEventListener('change', async (event) =>{
  
  const products = await fetchProducts(parseInt(selectPage.value),parseInt(selectShow.value),selectBrand.value)
  console.log(products.result)
  switch(event.target.value){
  /*
  Feature 3 - Filter by recent products
  As a user
  I want to filter by recent products
  So that I can browse the new released products (less than 2 weeks)
  */
    case "Recently released" :
      products.result=recent_products(products.result);
      break;

  /*
  Feature 4 - Filter by reasonable price
  As a user
  I want to filter by reasonable price
  So that I can buy affordable product i.e less than 50€
  */
    case "Reasonable price":
      let reasonable =[];
      products.result.forEach(
        element => 
          {
          if(element.price<=50)
          reasonable.push(element)
      }
      )
      products.result=reasonable;
      break;
  /*
  Feature 14 - Filter by favorite
  As a user
  I want to filter by favorite products
  So that I can load only my favorite products
  */
    case "Favorite":
      products.result=myFavourites
      break;
    default :
      break;

  }
  
  setCurrentProducts(products);//change the pagination
  render(currentProducts, currentPagination,currentBrand);
});

/*
Feature 5 - Sort by price
As a user
I want to sort by price
So that I can easily identify cheapest and expensive products

Feature 6 - Sort by date
As a user
I want to sort by price
So that I can easily identify recent and old products
*/
selectSort.addEventListener('change', async (event) =>{
  const products = await fetchProducts(parseInt(selectPage.value),parseInt(selectShow.value),selectBrand.value)
  let sorted_products=[]

  switch (event.target.value){
    case "price-asc":
      sorted_products = sort(products.result,true);
      console.log("sort the products by prices : cheapest to highest",sorted_products);
      break;
    case "price-desc":
      //sorted_products = sort(products.result,false);
      sorted_products=products.result.sort((a,b) => (a.price<b.price)?1:-1);
      console.log("sort the products by prices : Expensive to cheapest",sorted_products);
      break;
    case "date-asc":
      sorted_products=products.result.sort((a,b) => (Date.parse(a.released)<Date.parse(b.released))?1:-1);
      console.log("sort the products by dates : newest to oldest",sorted_products);
      break;    
    case "date-desc":
      sorted_products=products.result.sort((a,b) => (Date.parse(a.released)>Date.parse(b.released))?1:-1);
      console.log("sort the products by dates : oldest to newest",sorted_products);
      break;
    default :
      break;
  }
 
  products.result=sorted_products;
  setCurrentProducts(products);//change the pagination
  render(currentProducts, currentPagination,currentBrand);
});

document.addEventListener('DOMContentLoaded', async () => {
   const products = await fetchProducts();
   setCurrentProducts(products);
   render(currentProducts, currentPagination,currentBrand);
});



/*
Feature 15 - Usable and pleasant UX
As a user
I want to parse a usable and pleasant web page
So that I can find valuable and useful content
*/