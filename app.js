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
        path: '/api/users/{username}',
        handler: function (request, reply) {
            ICApi.user.detail({
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