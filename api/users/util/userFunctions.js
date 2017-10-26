'use strict';

const bcrypt = require('bcrypt');
const User = require('../../users/user.model');
const { async, await } = require('asyncawait');
const Boom = require('boom');

const verifyUniqueUser = (request, reply) => {
  const newUser = request.payload.user;

  const findUser = async(() => {
    let user = await(User.findOne({
      $or: [
        { email: newUser.email },
        { username: newUser.username }
      ]
    }));
    if (user) {
      if (user.username === newUser.username) {
        return 'USERNAME_TAKEN';
      } else if (user.email === newUser.email) {
        return 'EMAIL_TAKEN';
      }
    }
    return 'USER_OK';
  });

  findUser()
    .then((result) => {
      return reply(result != 'USER_OK' ? Boom.badRequest(result) : result);
    })
    .catch((err) => {
      console.log("***ERROR VALIDATING USER***\n", err);
      return reply(Boom.badImplementation(err));
    });
};

const hashPassword = async((password) => {
  let salt = await(bcrypt.genSalt(10));
  let hash = await(bcrypt.hash(password, salt));
  return hash;
});

const verifyCredentials = (request, reply) => {
  const password = request.payload.password;

  const verifyUser = async(() => {
    let user = await(User.findOne({
      $or: [
        { email: request.payload.email },
        { username: request.payload.username }
      ]
    }));
    console.log("***USER***\n", user);
    if (user) {
      let isValid = await(bcrypt.compare(password, user.password));
      if (isValid) {
        return { status: 'USER_OK', user };
      } else {
        return { status: 'WRONG_PASSWORD' };
      }
    } else {
      return { status: 'WRONG_USERNAME_OR_EMAIL' };
    }
  });


  verifyUser()
    .then((result) => {
      return reply(result.status != 'USER_OK' ? Boom.badRequest(result.status) : result.user);
    })
    .catch((err) => {
      console.log("***ERROR VALIDATING USER***\n", err);
      return reply(Boom.badImplementation(err));
    });
}

module.exports = {
  verifyUniqueUser,
  hashPassword,
  verifyCredentials
}