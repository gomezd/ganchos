
var debug = require('debug')('githooks:test');

exports = module.exports = function test (options) {
    //console.log("test hook:\n" + JSON.stringify(options, null, 2));
    return function testHook (req, res, next) {
        debug('called from %s', req.url);
        next();
    };
};

exports.config = {
    exported: "config for test"
};