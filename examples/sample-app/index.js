#! /usr/bin/env node

var hooks = require('../../lib/app'),
    port = 8080;

hooks.listen(port, function () {
    console.log('Listening on port ' + port);
});
