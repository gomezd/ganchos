#! /usr/bin/env node

var ganchos = require('../../lib/ganchos'),
    port = 8080,
    app = ganchos();

app.listen(port, function () {
    console.log('Listening on port ' + port);
});
