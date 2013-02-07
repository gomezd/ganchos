#! /usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    basename = path.basename,
    express = require('express'),
    app = express(),

    port = 8080,

    hooks = {};

fs.readdirSync(__dirname + '/hooks').forEach(function(filename){
  if (!/\.js$/.test(filename)) return;
  var name = basename(filename, '.js');
  function load(){ return require('./hooks/' + name); }
  hooks.__defineGetter__(name, load);
});

Object.keys(hooks).forEach(function (h) {
    app.use(h, hooks[h]);
    console.log('Attached hook: ' + h);
});

app.listen(port, function () {
    console.log('Listening on port ' + port);
});
