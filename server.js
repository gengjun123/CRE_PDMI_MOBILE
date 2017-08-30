let express = require('express');
let path = require('path');
let session = require('express-session');
let RedisStore = require('connect-redis')(session);
let config = require('config-lite')(__dirname);
let unirest = require('unirest');

let app = express();
app.use('/static', express.static('./static'));

app.use(session({
    store: new RedisStore({
        host: config.redis.host,
        port: config.redis.port,
        pass: config.redis.auth
    }),
    secret: config.session.secret,
    cookie: {
        maxAge: config.session.maxAge
    },
    resave: false,
    saveUninitialized: false
}));

function getPUPLoginUrl(httpReq) {
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
}

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

function getUserIdByCodeFromPUP(code, callback) {
    unirest.get(config.serviceUrl.cre + '/api/authorization/users/pupCode/' + code)
        .end(function (response) {
            callback(response.body.userId);
        });
}

function respond(res, userId) {
    res.cookie('userId', userId);

    //调取cre接口，获取应用的地址
    let url = config.serviceUrl.cre + '/api/app/service?appIdList=' + config.appRelated.join('&appIdList=');
    unirest.get(url).end(function (response) {
        if (response.code === 200) {
            let serviceList = response.body;
            for (let i = 0; i < serviceList.length; i++) {
                let service = serviceList[i];
                //将所用到的应用url地址放到cookie中去
                res.cookie(service.id, service.url);
            }
            //返回应用界面
            res.sendFile(path.join(__dirname, 'index.html'));
        } else {
            res.send(500, '获取应用地址失败');
        }
    });
}

app.get('/', function (req, res) {
    //如果session中存在user，则说明已经登录过了，直接返回index.html界面
    if (req.session.user) {
        respond(res, req.session.user.userId);
    //如果参数中含有PUP返回的code参数，则需要从PUP中获取用户ID
    } else if (req.query.code) {
        getUserIdByCodeFromPUP(req.query.code, function (userId) {
            //将用户信息保存到session中
            req.session.user = {userId: userId};

            respond(res, userId);
        });

    //重定向到PUP的登录页面
    } else {
        res.redirect(getPUPLoginUrl(req));
    }
});
//
// app.get('/service', function (req, res) {
//     let url = config.serviceUrl.cre + '/api/app/service?appIdList=' + config.appRelated.join('&appIdList=');
//     unirest.get(url).end(function (response) {
//         res.send(response.body);
//     });
// });

app.listen(config.port, function () {
    console.log('app started listening at ' + config.port);
});