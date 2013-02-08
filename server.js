#! /usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    yaml = require('js-yaml'),
    debug = require('debug')('githooks:server'),
    basename = path.basename,
    
    meta = require('./routes.yaml'),
    routes = meta.routes,
    globalConfigs = meta.config,

    express = require('express'),
    app = express(),
    port = 8080,
    hooks = {},

    noContentHandler = function (req, res) {
        debug('No content handler: request to %s', req.url);
        res.send(204);
    },

    errorHandler = function (err, req, res, next) {
        debug("handling error");
        console.error(err.stack);
        res.send(500);
    };

fs.readdirSync(__dirname + '/hooks').forEach(function(filename){
    var name = basename(filename, '.js'),
        load = function () {
            return require('./hooks/' + name);
        };
    hooks.__defineGetter__(name, load);
});

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

app.use(errorHandler);
app.listen(port, function () {
    console.log('Listening on port ' + port);
});
