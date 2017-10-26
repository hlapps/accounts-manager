'use strict';

const bcrypt = require('bcrypt');
const userFunctions = require('../users/util/userFunctions');
const userControler = require('../users/user.controler');
const userSchemas = require('../users/user.schemas');
const appFunctions = require('../apps/util/appFunctions');

module.exports = [
  {
    method: 'POST',
    path: '/api/users',
    config: {
      pre: [
        { method: userFunctions.verifyUniqueUser },        
        { method: appFunctions.verifyValidApp, assign: 'scope' },
      ],
      handler: userControler.post,
      validate: {
        payload: userSchemas.create
      }
    }
  },
  {
    method: 'POST',
    path: '/api/users/auth',
    config: {
      pre: [{ method: userFunctions.verifyCredentials, assign: 'user' }],
      handler: userControler.auth,
      validate: {
        payload: userSchemas.auth
      }
    }
  }];