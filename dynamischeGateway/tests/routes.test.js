// Import the routes module
const routes = require('../routes/index');

/** */
const invalidLoggingParameters = [
    [null, '/example'], ['GET', null], [null, null], ['', '/example'], ['GET', ''], ['', '']
];

// Test whether
describe('Logging Incoming Requests', () => {
    // Test a valid request
    test('Log an incoming request', () => {
        // Arrange
        console.info = jest.fn();
        console.error = jest.fn();
        
        // Act
        routes.logIncomingRequest('GET', '/example');

        // Assert
        expect(console.info).toHaveBeenCalledWith('Incoming request: [GET] /example');
        expect(console.error).not.toHaveBeenCalled();
    });

    test.each(invalidLoggingParameters)('Invalid logging attempts', (first, second) => {
        // Arrange
        console.info = jest.fn();
        console.error = jest.fn();

        // Act
        routes.logIncomingRequest(first, second);

        // Assert
        expect(console.error).toHaveBeenCalledWith('Incoming request with invalid parameters.');
        expect(console.info).not.toHaveBeenCalled();
    });
});