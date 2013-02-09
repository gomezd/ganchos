
var npm = require('npm'),
    path = require('path'),

    debug = require('debug')('githooks:npm'),

    install = function (fullPath, callback) {
        var name = path.basename(fullPath);
        npm.load({
            prefix: fullPath,
            loglevel: 'silent'
        }, function (err) {
            if (err) {
                callback(err);
            } else {
                npm.commands.install(function (err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        debug('npm install %s: %s', name, data.length ? data : 'installed');
                        callback();
                    }
                });
            }
        });
    };

module.exports = {
    install: install
}