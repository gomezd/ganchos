#! /usr/bin/env node

var http = require('http'),
    hooks = require('./lib/app'),
    port = 8080;

http.createServer(hooks).listen(port, function () {
    console.log('Listening on port ' + port);
});
