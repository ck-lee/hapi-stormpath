// Load modules

var Hoek = require('hoek');
var stormpath = require('stormpath');


// Declare internals

var internals = {};

internals.defaults = {};

exports.register = function (server, options, next) {

    Hoek.assert(options.apiKeyId, 'options.apiKeyId is required');
    Hoek.assert(options.apiKeySecret, 'options.apiKeySecret is required');

    var apiKey = new stormpath.ApiKey(options.apiKeyId, options.apiKeySecret);

    var defaults = { apiKey: apiKey };
    var clientOptions = { cacheOptions: options.cacheOptions, nonceStore: options.nonceStore };
    var config = Hoek.applyToDefaults(defaults, clientOptions);

    var client = new stormpath.Client(config);

    internals.client = client;

    if (options.applicationHref) {

        client.getApplication(options.applicationHref, function (err, application) {

            Hoek.assert(!err, 'Error occurred on stormpath client.getApplication()');

            var authenticator = new stormpath.OAuthAuthenticator(application);

            server.expose({
                application: application,
                authenticator: authenticator,
                client: internals.client
            });

            next();
        });

    } else {

        server.expose({
            client: internals.client
        });

        next();
    }
};

exports.register.attributes = {
    pkg: require('./package.json'),
    name: 'hapiStormpath'
};
