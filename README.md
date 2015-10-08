#Stormpath plugin for hapi.js
A simple wrapper plugin for hapi.js to integrate with [Stormpath](https://stormpath.com)

[![Build Status](https://travis-ci.org/ck-lee/hapi-stormpath.svg)](https://travis-ci.org/ck-lee/hapi-stormpath)
[![Dependency Status](https://david-dm.org/ck-lee/hapi-stormpath.svg)](https://david-dm.org/ck-lee/hapi-stormpath)
[![devDependency Status](https://david-dm.org/ck-lee/hapi-stormpath/dev-status.svg)](https://david-dm.org/ck-lee/hapi-stormpath#info=devDependencies)

## Example to register plugin 
See [Stormpath client](http://docs.stormpath.com/nodejs/api/client#ctor) for more information
```javascript
var server = new Hapi.Server();
server.register([{
    register: require('hapi-stormpath'),
    options: {
        apiKeyId: 'apiKeyId', //required
        apiKeySecret: 'apiKeyId', //required
        applicationHref: 'applicationHref', // optional, if specified, plugin exposes application and authenticator
        cacheOptions: { store: 'memory', ttl: 300, tti: 300 } // optional
    }
}]);
```

## Example to use Stormpath API in a route handler
See [Stormpath api](http://docs.stormpath.com/nodejs/api/) for more information
```javascript
server.plugins.hapiStormpath.application.authenticateAccount(request.payload, function onAuthcResult(err, result) {

    if (err) {
        return reply(Boom.badRequest(err.userMessage));
    }
    var accessToken = result.getAccessToken();

    var requestObject = {
        url: '/oauth/token',
        method: 'POST',
        headers: { 'authorization': 'Bearer ' + accessToken },
        body: { grant_type: 'client_credentials' }
    };

    server.plugins.hapiStormpath.application.authenticateApiRequest({request: requestObject, ttl: 86400}, function (err, authResult) {

        if (err) {
            server.log(['error', 'authentication', 'stormPath', 'authenticateApiRequest'], err);
            return reply(Boom.badRequest(err.userMessage));
        }

        return reply({
            accessToken: authResult.token,
            givenName: authResult.account.givenName
        });
    });
});
```