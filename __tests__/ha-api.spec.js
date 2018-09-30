'use strict';
const should = require('should');
const nock   = require('nock');
const smock  = require('simple-mock');
const HaApi  = require('../lib/ha-api');

const TEST_APIKEY_CONFIG = {
    baseUrl: 'http://bogus',
    apiPass: 'bogus'
};

const TEST_ACCESSTOKEN_CONFIG = {
    baseUrl: 'http://bogus',
    accessToken: 'bogus'
};

describe('HaApi Tests', function() {
    afterEach(function () {
        smock.restore();
    })

    describe('instantiation (api key)', function() {
        it('should instantiate correctly', function () {
            const haApi = new HaApi(TEST_APIKEY_CONFIG);

            haApi.config.should.equal(TEST_APIKEY_CONFIG);
            haApi.client.defaults.headers['x-ha-access'].should.equal(TEST_APIKEY_CONFIG.apiPass);
            haApi.client.defaults.baseURL.should.equal(`${TEST_APIKEY_CONFIG.baseUrl}/api`);
        });
    })

    describe('instantiation (access token)', function() {
        it('should instantiate correctly', function () {
            const haApi = new HaApi(TEST_ACCESSTOKEN_CONFIG);

            haApi.config.should.equal(TEST_ACCESSTOKEN_CONFIG);
            haApi.client.defaults.headers.Authorization.should.equal('Bearer ' + TEST_ACCESSTOKEN_CONFIG.accessToken);
            haApi.client.defaults.baseURL.should.equal(`${TEST_ACCESSTOKEN_CONFIG.baseUrl}/api`);
        });
    })

    describe('API Calls', function () {
        it('should get services',  async function() {
            nock(TEST_APIKEY_CONFIG.baseUrl).get('/api/services').reply(200, 'testing');

            const haApi = new HaApi(TEST_APIKEY_CONFIG);
            const services = await haApi.getServices();
            services.should.equal('testing');
        });

        it('should get events',  async function() {
            nock(TEST_APIKEY_CONFIG.baseUrl).get('/api/events').reply(200, 'testing');

            const haApi = new HaApi(TEST_APIKEY_CONFIG);
            const services = await haApi.getEvents();
            services.should.equal('testing');
        });
    });

    describe('API States & Entities', function() {
        it('should get states',  async function() {
            const apiStates = [{ entity_id: 'test_entity' }];
            const expectedStates = { test_entity: apiStates[0] };
            nock(TEST_APIKEY_CONFIG.baseUrl).get('/api/states').reply(200, apiStates);

            const haApi = new HaApi(TEST_APIKEY_CONFIG);
            const states = await haApi.getStates();
            states.should.deepEqual(expectedStates);
        });

        it('should get entities from states',  async function() {
            nock(TEST_APIKEY_CONFIG.baseUrl).get('/api/states').reply(200, [{ entity_id: 'test_entity' }]);

            const haApi = new HaApi(TEST_APIKEY_CONFIG);
            const entities = await haApi.getEntities();
            entities.should.deepEqual(['test_entity']);
        });
    })
});

