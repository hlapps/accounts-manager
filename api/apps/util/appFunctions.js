'use strict';

const App = require('../app.model');
const { async, await } = require('asyncawait');
const Boom = require('boom');

const verifyValidApp = (request, reply) => {
    const newUser = request.payload.user;
    const origin = request.payload.origin;

    const verifyApp = async(() => {
        let app = await(App.findOne({ code: newUser.appCode }));
        if (!app) return { status: 'INVALID_APP' };
        let scope = app.scopes[origin];
        return { status: scope ? 'APP_OK' : 'INVALID_ORIGIN', scope };
    });

    verifyApp()
        .then((result) => {
            return reply(result.status != 'APP_OK' ? Boom.badRequest(result.status) : result.scope);
        })
        .catch((err) => {
            console.log("***ERROR VALIDATING APP***\n", err);
            return reply(Boom.badImplementation(err));
        });
}

module.exports = {
    verifyValidApp
};