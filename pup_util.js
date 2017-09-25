let config = require('config-lite')(__dirname);
let unirest = require('unirest');

function getRequestUrlFromReq(httpReq) {
    return httpReq.protocol + "://" + httpReq.get('host') + httpReq.originalUrl;
}

function genRandomString(len) {
    let result = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    if (!len) {
        return result;
    } else {
        for(let i = 0; i < len; i++) {
            result += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return result;
    }
}

module.exports = {
    getPUPLoginUrl: function (httpReq) {
        let loginUrl = config.pupLogin.authorizeUrl;
        if (loginUrl.indexOf('?') > 0) {
            loginUrl += '&';
        } else {
            loginUrl += "?"
        }

        let requestUrl = getRequestUrlFromReq(httpReq);

        loginUrl += 'client_id=' + encodeURIComponent(config.pupLogin.clientId);

        loginUrl += '&redirect_uri=' + encodeURIComponent(requestUrl);

        loginUrl += '&response_type=code';

        loginUrl += '&state=' + encodeURIComponent(genRandomString(10));

        loginUrl += '&target_url=' + encodeURIComponent(requestUrl);

        return loginUrl;
    },

    getUserInfoByCodeFromPUP: function(code, callback) {
        unirest.get(config.serviceUrl.cre + '/api/authorization/users/pupCode/' + code)
            .end(function (response) {
                callback(response.body);
            });
    }
};