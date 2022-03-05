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

  return $('.product-info') // $(".product-info") — selects all elements with class="product-info"
    .map((i, element) => {
        const link =$(element)
        .find('.product-name a')
        .attr('href');

      return {
        link,
        'brand': 'montlimart',
        'price': parseFloat(
          $(element)
            .find('.regular-price .price')
            .text()
        ),
        'name': $(element)
          .find('.product-name a')
          .attr('title'),
        'photo': $(element).parent()
          .find('.product-image img')
          .attr('src'),
        '_id': uuidv5(link, uuidv5.URL)
      };
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
