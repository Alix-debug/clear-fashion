'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoDB_URI: process.env.MONGODB_URI
  }
} else {
  console.error(`Error! Environment Variables are not set.
   Please add them from secret sidebar in replit`)
  process.exit(1)
}