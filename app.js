var Hapi = require('hapi');
var ICApi = require('./lib/icapi');

var server = new Hapi.Server();

server.connection({ port: process.env.PORT });

var plugins = [
    { register: require('inert') }
];

server.register(plugins, function (err) {
    if (err) {
        throw err;
    }
    
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './public',
                redirectToSlash: true,
                index: true
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/api/auth',
        handler: function (request, reply) {
            ICApi.auth.session({
                token: request.query.token
            }, function (err, result) {
                if (result && result.error && result.error.message === 'already authenticated') {
                    return reply({ user_id: result.error.user_id});
                }
                
                return reply(err, result);
            });
        }
    });
    
    server.route({
        method: 'GET',
        path: '/api/users/{username}',
        handler: function (request, reply) {
            ICApi.user.detail({
                token: request.query.token,
                username: request.params.username
            }, reply);
        }
    });
    
        server.route({
        method: 'GET',
        path: '/api/users/{username}/stream',
        handler: function (request, reply) {
            ICApi.stream.follow({
                token: request.query.token,
                username: request.params.username
            }, reply);
        }
    });
    
    server.on('response', function (request) {
        console.log("[%s] %s %s - %s",
                    request.info.remoteAddress,
                    request.method.toUpperCase(),
                    request.url.path,
                    request.response.statusCode);
    });
    
    server.start(function () {

      console.log('Server running at:', server.info.uri);
    });
})