let express = require('express');
let path = require('path');
let session = require('express-session');
let RedisStore = require('connect-redis')(session);
let config = require('config-lite')(__dirname);
let unirest = require('unirest');
let log4js = require('log4js');
let pupUtil = require('./pup_util');

log4js.configure('./log4js/config.json');
const logger = log4js.getLogger();

let app = express();
app.use('/resourceMobile/static', express.static('./resourceMobile/static'));
app.use('/commandMobile/static', express.static('./commandMobile/static'));
app.use('/deviceManager/static', express.static('./deviceManager/static'));
app.use(log4js.connectLogger(log4js.getLogger(), {level: log4js.levels.INFO}));

logger.info('app start with config [' + JSON.stringify(config) + ']');

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

function respond(res, user, indexPath) {
    res.cookie('userId', user.userId);
    res.cookie('userName', user.userName);

    //调取cre接口，获取应用的地址
    let url = config.serviceUrl.cre + '/api/app/service?appIdList=' + config.appRelated.join('&appIdList=');
    logger.info("调用cre接口 begin " + url);
    unirest.get(url).end(function (response) {
        if (response.code === 200) {
            logger.info("调用cre接口 end 成功 " + url);
            let serviceList = response.body;
            for (let i = 0; i < serviceList.length; i++) {
                let service = serviceList[i];
                //将所用到的应用url地址放到cookie中去
                res.cookie(service.id, service.url);
            }
            //返回应用界面
            res.sendFile(path.join(__dirname, indexPath));
        } else {
            logger.error("调用cre接口 end 失败 " + url + " response body " + response.body);
            res.status(500).send('获取应用地址失败');
        }
    });
}

function go(req, res, indexPath) {
    //如果session中存在user，则说明已经登录过了，直接返回index.html界面
    if (req.session.user) {
        respond(res, req.session.user, indexPath);
        //如果参数中含有PUP返回的code参数，则需要从PUP中获取用户信息
    } else if (req.query.code) {
        pupUtil.getUserInfoByCodeFromPUP(req.query.code, function (user) {
            if (user !== null) {
                //将用户信息保存到session中
                req.session.user = user;

                respond(res, user, indexPath);
            } else {
                res.send("获取用户信息失败");
            }

        });

        //重定向到PUP的登录页面
    } else {
        res.redirect(pupUtil.getPUPLoginUrl(req));
    }
}

app.get('/resourceMobile', function (req, res) {
    go(req, res, 'resourceMobile/index.html');
});

app.get('/resourceMobile/*', function (req, res) {
    go(req, res, 'resourceMobile/index.html');
});

app.get('/commandMobile', function (req, res) {
    go(req, res, 'commandMobile/index.html');
});

app.get('/commandMobile/*', function (req, res) {
    go(req, res, 'commandMobile/index.html');
});

app.get('/deviceManager/', function (req, res) {
    go(req, res, 'deviceManager/index.html');
});

app.listen(config.port, function () {
    console.log('app started listening at ' + config.port);
});