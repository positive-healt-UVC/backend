// Import the routes module
const routes = require('../routes/index');

/** Variables for repeated tests */
const invalidLoggingParameters = [
    [null, '/example'], ['GET', null], [null, null], ['', '/example'], ['GET', ''], ['', '']
];

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
        const services = require('../routes/registry.json').services;
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