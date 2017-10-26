const User = require('../users/user.model');
const App = require('../apps/app.model');
const userFunctions = require('../users/util/userFunctions');
const tokenFunctions = require('../users/util/tokenFunctions');
const { async, await } = require('asyncawait');
const Boom = require('boom');

const post = (request, reply) => {
    const _user = request.payload.user;

    const newUser = async(() => {
        let user = new User();
        user.email = _user.email;
        user.username = _user.username;
        user.scope = request.pre.scope || 'unknown';
        let hash = await(userFunctions.hashPassword(_user.password));
        user.password = hash;
        let savedUser = await(user.save());
        if (savedUser) return { status: 'OK', id_token: tokenFunctions.createToken(user) };
    });

    newUser()
        .then((result) => {
            return reply(result.status === 'OK' ? result : Boom.badRequest(result.status))
                .code(result.status === 'OK' ? 201 : 400)
        })
        .catch((err) => {
            console.log("***ERROR CREATING USER***");
            return reply(Boom.badImplementation(err));
        });
};

const auth = (request, reply) => {
    return reply({ id_token: tokenFunctions.createToken(request.pre.user) }).code(201);
}

module.exports = {
    post,
    auth
}