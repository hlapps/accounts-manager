'use strict';
require('dotenv').config();

const Hapi = require('hapi');
const Boom = require('boom');
const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');

const server = new Hapi.Server();

// The connection object takes some
// configuration, including the port
server.connection({ port: 3000, routes: { cors: true } });

const dbUrl = 'mongodb://localhost:27017/accounts_manager';

server.register(require('hapi-auth-jwt'), (err) => {

  // We're giving the strategy both a name
  // and scheme of 'jwt'
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.KEY,
    verifyOptions: { algorithms: ['HS256'] }
  });

  // Look through the routes in
  // all the subdirectories of API
  // and create a new route for each
  if (process.env.NODE_ENV === 'development') {
    console.log('Loading API routes...');
  }
  glob.sync('api/**/*routes*.js', {
    root: __dirname
  }).forEach(file => {
    require(path.join(__dirname, file)).forEach(route => {
      server.route(route);
      if (process.env.NODE_ENV === 'development') {
        console.log(route.method, route.path);
      }
    })
  });
});

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  // Once started, connect to Mongo through Mongoose
  mongoose.Promise = global.Promise;
  mongoose.connect(dbUrl, { useMongoClient: true }, (err) => {
    if (err) {
      throw err;
    }
    console.log("Mongoose connected!")
  });
});