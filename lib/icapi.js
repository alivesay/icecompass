var WebSocket = require('ws');
var uuid = require('uuid');
var NodeCache = require( "node-cache" );

var API_URI = 'wss://api.icecondor.com/v2';

var cache = new NodeCache( {
    stdTTL: 10,
    checkperiod: 150,
    useClones: false
});

function connect(token, callback) {
    cache.get(token, function (err, ws) {
        if (err) {
            return callback(err, null);
        }
        
        if (ws !== undefined) {
            return callback(null, ws);
        }

        ws = new WebSocket(API_URI, { 
            rejectUnauthorized: false,
            strictSSL: false,
            secureProtocol: 'SSLv3_method'
        });

        cache.set(token, ws, 10000);

        ws.on('open', function () {
            console.log('socket open');
            apiMethods.auth.session({ token: token }, function () {
                console.log('authenticated');
                return callback(null, ws);

            })
        });
        
        ws.on('close', function () {
            console.log('socket close'); 
            cache.del(token);
        });
        
        ws.on('message', function(data, flags) {
            console.log('data: ' + data.trim());
            var data = JSON.parse(data);
            if (data.id) {
                cache.get(data.id, function (err, requestCallback) {
                    if (requestCallback !== undefined) {
                        return requestCallback(err, data);
                    }
                });
            }
        });
    });
}

function rpcRequest(token, method, params, callback ) {
    var requestObj = {
        jsonrpc: '2.0',
        method: method,
        params: params,
        id: uuid.v1()
    };
    
    connect(token, function (err, ws) {
        if (err) {
            return callback(err, null);
        }
        
        cache.set(requestObj.id, callback);
        console.log('send: ' + JSON.stringify(requestObj));
        ws.send(JSON.stringify(requestObj));
    });

}

var apiMethods = {
    auth: {
        session: function (options, callback) {
            rpcRequest(options.token, 'auth.session', {
                device_key: options.token
            }, callback);
        }
    },
    user: {
        detail: function (options, callback) {
            rpcRequest(options.token, 'user.detail', {
                username: options.username
            }, callback);
        }
    }
};

module.exports = apiMethods;