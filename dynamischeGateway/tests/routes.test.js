// Import the routes module and the services file
const routes = require('../routes/index');
const services = require('../routes/registry.json').services;

/** Variables for repeated tests */
const invalidLoggingParameters = [
    [null, '/example'], ['GET', null], [null, null], ['', '/example'], ['GET', ''], ['', '']
];

const incompleteUrlData = [
    [{ 'path': 'a', '0': 'a' }], [{ 'apiName': 'a', '0': 'a' }], [{ 'apiName': 'a', 'path': 'a' }],
    [{ 'apiName': null, 'path': 'a', '0': 'a' }], [{ 'apiName': 'a', 'path': null, '0': 'a' }], [{ 'apiName': 'a', 'path': 'a', '0': null }],
    [{ 'apiName': null, 'path': null, '0': 'a' }], [{ 'apiName': null, 'path': 'a', '0': null }], [{ 'apiName': 'a', 'path': null, '0': null }],
    [{ 'apiName': null, 'path': null, '0': null }], [null]
]

// Test whether incoming request are logged correctly
describe('Logging Incoming Requests', () => {
    // Test a valid request
    test('Log an incoming request', () => {
        console.info = jest.fn();
        console.error = jest.fn();

        routes.logIncomingRequest('GET', '/example');

        expect(console.info).toHaveBeenCalledWith('Incoming request: [GET] /example');
        expect(console.error).not.toHaveBeenCalled();
    });

    // Test invalid parameter combinations
    test.each(invalidLoggingParameters)('Invalid logging attempts', (first, second) => {
        console.info = jest.fn();
        console.error = jest.fn();

        routes.logIncomingRequest(first, second);

        expect(console.error).toHaveBeenCalledWith('Incoming request with invalid parameters.');
        expect(console.info).not.toHaveBeenCalled();
    });
});

// Check whether a given service exists
describe('Does Service Exists', () => {
    // Test valid parameter
    test('Existing service', () => {
        const service = Object.keys(services)[0];
        const result = routes.serviceExist(service);
        expect(result).toBe(true);
    });

    // Test invalid parameter
    test('Non-existing service', () => {
        const randomService = (Math.random() + 1).toString(36).substring(2);
        const result = routes.serviceExist(randomService);
        expect(result).toBe(false);
    })

    // Test empty string
    test('Empty string for service', () => {
        const result = routes.serviceExist('');
        expect(result).toBe(false);
    })

    // Test null
    test('Null for service', () => {
        const result = routes.serviceExist(null);
        expect(result).toBe(false);
    })
});

describe('Creating the Target URL', () => {
    // Valid URL with parameters
    test('Valid data with parameters', () => {
        const service = Object.keys(services)[0];
        const requestParameters = {
            'apiName': service,
            'path': 'example',
            '0': '1'
        };

        const result = routes.createTargetUrl(requestParameters);
        const exampleURL = services[service].url + 'example/1'

        expect(result).toBe(exampleURL)
    });

    // Valid URL without parameters
    test('Valid data without parameters', () => {
        const service = Object.keys(services)[0];
        const requestParameters = {
            'apiName': service,
            'path': 'example',
            '0': ''
        };

        const result = routes.createTargetUrl(requestParameters);
        const exampleURL = services[service].url + 'example/'

        expect(result).toBe(exampleURL)
    });

    // Invalid API Name
    test('Invalid service', () => {
        const requestParameters = {
            'apiName': (Math.random() + 1).toString(36).substring(2),
            'path': 'example',
            '0': ''
        };

        expect(() => routes.createTargetUrl(requestParameters)).toThrow(/service|Service/)
    });

    // Incomplete data
    test.each(incompleteUrlData)('Incomplete data', (data) => {
        expect(() => routes.createTargetUrl(data)).toThrow(/required|Required/)
    });
});