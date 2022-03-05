const fetch = require('node-fetch');
const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');

/**
 * Parse webpage montlimart
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product-container') 
    .map((i, element) => {
        const link =$(element)
        .find('.product-image-container a')
        .attr('href');
      if (link != undefined){
        return {
            link,
            'brand': 'ADRESSE Paris',
            'price': parseFloat(
              $(element)
                .find('.content_price span')
                .text()
            ),
            'name': $(element)
              .find('.right-block .product-name-container a')
              .attr('title'),
            'photo': $(element)
              .find('.left-block .product-image-container a img').attr('data-original'),
            //'_id': uuidv5(link, uuidv5.URL)
          };
        
      }
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
