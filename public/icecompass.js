var IceCondor = (function(){
    var exports = {
        getUser: getUser
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
    
    function getUser(options, callback) {
        request({
            method: 'GET',
            url: '/api/users/' + options.username,
            data: { token: options.token },
        }, callback);
    }
    
    return exports;
})();