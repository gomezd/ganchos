#! /usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    yaml = require('js-yaml'),
    basename = path.basename,
    
    meta = require('./routes.yaml'),
    routes = meta.routes,
    globalConfigs = meta.config,

    express = require('express'),
    app = express(),
    port = 8080,
    hooks = {},

    noContentHandler = function (req, res) {
        console.log('Handled request.');
        res.send(204);
    };

fs.readdirSync(__dirname + '/hooks').forEach(function(filename){
    if (!/\.js$/.test(filename)) return;
    var name = basename(filename, '.js');
    function load(){ return require('./hooks/' + name); }
    hooks.__defineGetter__(name, load);
});

// Object.keys(hooks).forEach(function (h) {
//     app.use(h, hooks[h]);
//     console.log('Attached hook: ' + h);
// });

Object.keys(routes).forEach(function (path) {
    var route = routes[path],
        config = {
            hello: "world"
        };

    route.hooks.forEach(function (name) {
        var hook = hooks[name],
            config = hook.config;
console.log(path + ' > ' + name);
        app.use(path, hook(config));
    });

    app.get(path, noContentHandler);
    console.log('Attached ' + path + ' ' + route.hooks);
});

app.listen(port, function () {
    console.log('Listening on port ' + port);
});
