
var debug = require('debug')('ganchos:test');

exports = module.exports = function test (options) {
    return function testHook (req, res, next) {
        debug('called from %s', req.url);
        next();
    };
};

exports.config = {
    exported: "config for test"
};