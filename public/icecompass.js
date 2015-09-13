var IceCondor = (function(){
    var exports = {
        auth: auth,
        getUser: getUser,
        getUserLocation: getUserLocation
    };
    
    function request(options, callback) {
        $.ajax({
            type: options.method,
            url: options.url,
            data: options.data,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                return callback(null, data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                return callback(errorThrown, JSON.parse(jqXHR.responseText));
            }
        });
    }
    
    function auth(options, callback) {
        request({
            method: 'GET',
            url: '/api/auth',
            data: { token: options.token },
        }, callback);
    }
    
    function getUser(options, callback) {
        request({
            method: 'GET',
            url: '/api/users/' + options.username,
            data: { token: options.token },
        }, callback);
    }
    
    function getUserLocation(options, callback) {
        request({
            method: 'GET',
            url: '/api/users/' + options.username + '/stream',
            data: { token: options.token },
        }, callback);
    }
    
    return exports;
})();