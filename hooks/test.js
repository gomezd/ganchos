
exports = module.exports = function test (options) {
    //console.log("test hook:\n" + JSON.stringify(options, null, 2));
    return function (req, res, next) {
        console.log('Executing hook: test');
        next();
    };
};

exports.config = {
    exported: "config for test"
};