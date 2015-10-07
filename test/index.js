// Load modules

var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var it = lab.it;
var expect = Code.expect;


it('starts a server without error', function (done) {

    var server = new Hapi.Server();
    server.register([{
        register: require('../'),
        options:  {
            apiKeyId: 'test',
            apiKeySecret: 'test'
        }
    }],
    function (err) {

        expect(err).to.not.exist();
        done();
    });
});
