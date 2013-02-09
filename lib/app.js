
var fs = require('fs'),
    path = require('path'),
    yaml = require('js-yaml'),
    debug = require('debug')('githooks:server'),
    colors = require('colors'),

    ERR_NO_CONFIG_FILE = 1,

    basename = path.basename,
    join = path.join,
    
    baseDir = process.cwd(),
    hooksDir = join(baseDir, 'hooks'),
    configFile = join(baseDir, 'routes.yaml'),

    meta,
    routes,
    appConfig,

    express = require('express'),
    app = express(),
    hooks = {},

    noContentHandler = function (req, res) {
        debug('No content handler: request to %s', req.url);
        res.send(204);
    },

    errorHandler = function (err, req, res, next) {
        debug("handling error");
        console.error(('✘ Failed to handle ' + req.url + '\n'+ (err.stack ? err.stack : err)).red);
        res.send(500);
    };

try {
    meta = require(configFile);
    routes = meta.routes;
    appConfig = meta.appConfig;
} catch (e) {
    console.error('✘ Failed to load config file.\n'.red + e);
    process.exit(ERR_NO_CONFIG_FILE);
}

fs.readdirSync(hooksDir).forEach(function(filename){
    var name = basename(filename, '.js'),
        load = function () {
            return require(join(hooksDir,name));
        };
    hooks.__defineGetter__(name, load);
});
debug('loaded hooks');

Object.keys(routes).forEach(function (path) {
    var route = routes[path],
        config = {
            hello: "world"
        },
        handlers = [];

    route.hooks.forEach(function (name) {
        var hook = hooks[name],
            config = hook.config;
        handlers.push(hook(config));
        debug('Attached %s > %s(%s)', path, name, hook.name || 'anonymous');
    });

    app.get(path, handlers);
    app.get(path, noContentHandler);
});
console.log('✔ Loaded hooks'.green);

app.use(errorHandler);
module.exports = app;
