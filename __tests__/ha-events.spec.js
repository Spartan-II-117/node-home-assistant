require('should');
const smock    = require('simple-mock');
const HaEvents = require('../lib/ha-events');

const TEST_APIKEY_CONFIG = {
    baseUrl: 'http://bogus',
    apiPass: 'bogus',
    events:  {
        transport: 'sse',       // For future support of websockets
        retries:   {
            maxAttempts: 10,    // How many times to retry connection
            delay:       5000   // Delay this long before retry (in ms)
        }
    }
};

const TEST_ACCESSTOKEN_CONFIG = {
    baseUrl: 'http://bogus',
    accessToken: 'bogus',
    events:  {
        transport: 'sse',       // For future support of websockets
        retries:   {
            maxAttempts: 10,    // How many times to retry connection
            delay:       5000   // Delay this long before retry (in ms)
        }
    }
};

describe('HaEvents Tests', function() {
    afterEach(function () {
        smock.restore();
    })

    describe('instantiation (apikey)', function() {
        it('should instantiate correctly', function () {
            const haEvents = new HaEvents(TEST_APIKEY_CONFIG);

            haEvents.config.should.equal(TEST_APIKEY_CONFIG);
            haEvents.streamUrl.should.equal(`${TEST_APIKEY_CONFIG.baseUrl}/api/stream`);
        });
    })
    describe('instantiation (accesstoken)', function() {
        it('should instantiate correctly', function () {
            const haEvents = new HaEvents(TEST_ACCESSTOKEN_CONFIG);

            haEvents.config.should.equal(TEST_ACCESSTOKEN_CONFIG);
            haEvents.streamUrl.should.equal(`${TEST_ACCESSTOKEN_CONFIG.baseUrl}/api/stream`);
        });
    })
});

