// Load modules

var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');


// Declare internals

var internals = {};
internals.apiKeyId = 'test';
internals.apiKeySecret = 'test';

// Test shortcuts

var lab = exports.lab = Lab.script();
var it = lab.it;
var expect = Code.expect;


it('starts a server without applicationHref', function (done) {

    var server = new Hapi.Server();
    server.register([{
        register: require('../'),
        options:  {
            apiKeyId: internals.apiKeyId,
            apiKeySecret: internals.apiKeySecret
        }
    }],
    function (err) {

        expect(err).to.not.exist();
        expect(server.plugins.hapiStormpath.client).to.exist();
        done();
    });
});
