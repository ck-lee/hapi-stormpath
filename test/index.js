// Load modules

var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');
var nock = require('nock');

// Declare internals

var internals = {};
internals.apiKeyId = 'test';
internals.apiKeySecret = 'test';
internals.applicationHref = 'https://api.stormpath.com/v1/applications/test';


// Test shortcuts
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var expect = Code.expect;

describe('when stormpath client is valid', function () {

    var api;

    it('starts a server without applicationHref', function (done) {

        var server = new Hapi.Server();
        server.register([{
            register: require('../'),
            options: {
                apiKeyId: internals.apiKeyId,
                apiKeySecret: internals.apiKeySecret,
                cacheOptions: {
                    store: 'memory',
                    ttl: 300,
                    tti: 300
                }
            }
        }],
            function (err) {

                expect(err).to.not.exist();
                expect(server.plugins.hapiStormpath.client).to.exist();
                done();
            });
    });

    before(function (done) {

        api = internals.mockApi();
        done();
    });

    it('starts a server with applicationHref', function (done) {

        var server = new Hapi.Server();
        server.register([{
            register: require('../'),
            options: {
                apiKeyId: internals.apiKeyId,
                apiKeySecret: internals.apiKeySecret,
                applicationHref: internals.applicationHref
            }
        }],
            function (err) {

                expect(err).to.not.exist();
                expect(server.plugins.hapiStormpath.client).to.exist();
                expect(server.plugins.hapiStormpath.application).to.exist();
                expect(server.plugins.hapiStormpath.authenticator).to.exist();
                done();
                api.done();
            });
    });
});

internals.mockApi = function () {

    return nock('https://api.stormpath.com/v1/applications/test')
        .get('')
        .reply(200,
            { 'href': 'https://api.stormpath.com/v1/applications/test', 'name': 'test', 'description': '', 'status': 'ENABLED', 'createdAt': '2015-08-21T11:42:24.496Z', 'modifiedAt': '2015-08-21T11:42:24.523Z', 'tenant': { 'href': 'https://api.stormpath.com/v1/tenants/test' }, 'defaultAccountStoreMapping': { 'href': 'https://api.stormpath.com/v1/accountStoreMappings/test' }, 'defaultGroupStoreMapping': { 'href': 'https://api.stormpath.com/v1/accountStoreMappings/test' }, 'customData': { 'href': 'https://api.stormpath.com/v1/applications/test/customData' }, 'oAuthPolicy': { 'href': 'https://api.stormpath.com/v1/oAuthPolicies/test' }, 'accounts': { 'href': 'https://api.stormpath.com/v1/applications/test/accounts' }, 'groups': { 'href': 'https://api.stormpath.com/v1/applications/test/groups' }, 'accountStoreMappings': { 'href': 'https://api.stormpath.com/v1/applications/test/accountStoreMappings' }, 'loginAttempts': { 'href': 'https://api.stormpath.com/v1/applications/test/loginAttempts' }, 'passwordResetTokens': { 'href': 'https://api.stormpath.com/v1/applications/test/passwordResetTokens' }, 'apiKeys': { 'href': 'https://api.stormpath.com/v1/applications/test/apiKeys' }, 'verificationEmails': { 'href': 'https://api.stormpath.com/v1/applications/test/verificationEmails' }, 'authTokens': { 'href': 'https://api.stormpath.com/v1/applications/test/authTokens' }, 'idSiteModel': { 'href': 'https://api.stormpath.com/v1/applications/test/idSiteModel' } });
};

