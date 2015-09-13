var IceCondor = (function(){
    var exports = {};
    
    function postJSON(url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
        xhr.onload = function onload() {
            if (this.status != 200) {
                return callback('Error: ' + this.status, this.responseText);
            }
            return callback(null, this.responseText);
        };
        xhr.onerror = function onerror() {
            console.log('error');
        };
        xhr.send(JSON.stringify(data));
    }
    
    function getJSON(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function onload() {
            if (this.status != 200) {
                return callback('Error: ' + this.status, this.responseText);
            }
            return callback(null, this.responseText);
        };
        xhr.onerror = function onerror() {
            console.log('error');
        };
        xhr.send();
    }
    
    function getUser(options, callback) {
        getJSON('/api/users/' + options.username + '?token=' + options.token, callback);
    }
    
    exports.getUser = getUser;
    
    return exports;
})();