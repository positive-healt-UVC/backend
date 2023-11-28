// Import the routes module
const routes = require('../routes/index');

// Test whether
describe('Logging Incoming Requests', () => {
    // Test a valid request
    test('Log an incoming request', () => {
        console.info = jest.fn();
        routes.logIncomingRequest('GET', '/example');
        expect(console.info).toHaveBeenCalledWith('Incoming request: [GET] /example');
    });
});