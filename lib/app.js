
var fs = require('fs'),
    path = require('path'),
    yaml = require('js-yaml'),
    async = require('async'),
    util = require('./util'),

    debug = require('debug')('githooks:server'),

    ERR_NO_CONFIG_FILE = 1,
    ERR_LOAD_HOOKS = 2,

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
        util.error('Failed to handle ' + req.url, e, true);
        res.send(500);
    },

    loadHooks = function (callback) {
        debug('Loading hooks');
        fs.readdir(hooksDir, function (err, files) {
            if (err) {
                callback(err);
            } else {
                async.forEach(files, function (file, done) {
                    var fullPath = join(hooksDir, file),
                        name = basename(file, '.js'),
                        load = function () {
                            return require(fullPath);
                        };

                    async.series({
                        install: function (next) {
                            fs.stat(fullPath, function (err, stats) {
                                next();
                            });
                        },
                        attach: function (next) {
                            hooks.__defineGetter__(name, load);
                            debug('Attached %s', name);
                            next();
                        }
                    }, done);
                }, callback);
            }
        });
    },

    mountHooks = function (callback) {
        debug('Mounting hooks');
        async.forEach(Object.keys(routes), function (path, done) {
            var route = routes[path],
                config = {
                    hello: "world"
                },
                handlers = [];

            route.hooks.forEach(function (name) {
                var hook = hooks[name],
                    config = hook.config;
                handlers.push(hook(config));
                debug('Mounted %s > %s(%s)', path, name, hook.name || 'anonymous');
            });

            app.get(path, handlers);
            app.get(path, noContentHandler);
            done();
        }, callback);
    };

try {
    meta = require(configFile);
    routes = meta.routes;
    if (!routes) {
        throw new Error('No routes defined.');
    }
    appConfig = meta.appConfig || {};
} catch (e) {
    util.fatal('Failed to load config file.', e, ERR_NO_CONFIG_FILE);
}

loadHooks(function (err) {
    if (err) {
        util.fatal('Failed to load hooks.', err, ERR_LOAD_HOOKS);
    } else {
        mountHooks(function (err) {
            debug('Mounted error handler.');
            app.use(errorHandler);
            util.success('Loaded hooks');
        })
    }
});

module.exports = app;
