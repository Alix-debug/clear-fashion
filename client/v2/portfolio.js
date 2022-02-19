// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';
// All distinct brands
const all_brands = ['loom', 'coteleparis', 'adresse', '1083', 'dedicated'];

// current products on the page
let currentBrand="";
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select')

const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

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
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
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
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination, brand) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderBrands(brand)
};

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


document.addEventListener('DOMContentLoaded', async () => {
   const products = await fetchProducts();
   setCurrentProducts(products);
   render(currentProducts, currentPagination,currentBrand);
});





/*
Feature 3 - Filter by recent products
As a user
I want to filter by by recent products
So that I can browse the new released products (less than 2 weeks)
*/
/*
Feature 4 - Filter by reasonable price
As a user
I want to filter by reasonable price
So that I can buy affordable product i.e less than 50€
*/
/*
Feature 5 - Sort by price
As a user
I want to sort by price
So that I can easily identify cheapest and expensive products
*/
/*
Feature 6 - Sort by date
As a user
I want to sort by price
So that I can easily identify recent and old products
*/
/*
Feature 8 - Number of products indicator
As a user
I want to indicate the total number of products
So that I can understand how many products is available
*/
/*
Feature 9 - Number of recent products indicator
As a user
I want to indicate the total number of recent products
So that I can understand how many new products are available
*/
/*
Feature 10 - p50, p90 and p95 price value indicator
As a user
I want to indicate the p50, p90 and p95 price value
So that I can understand the price values of the products
*/
/*
Feature 11 - Last released date indicator
As a user
I want to indicate the last released date
So that I can understand if we have new products
*/
/*
Feature 12 - Open product link
As a user
I want to open product link in a new page
So that I can buy the product easily
*/
/*
Feature 13 - Save as favorite
As a user
I want to save a product as favorite
So that I can retreive this product later
*/
/*
Feature 14 - Filter by favorite
As a user
I want to filter by favorite products
So that I can load only my favorite products
*/
/*
Feature 15 - Usable and pleasant UX
As a user
I want to parse a usable and pleasant web page
So that I can find valuable and useful content
*/