
exports = module.exports = function bugs (options) {
    //console.log("bugs hook:\n" + JSON.stringify(options, null, 2));
    return function (req, res, next) {
        console.log('Executing hook: bugs');
        next();
    };
};

exports.config = {
    exported: "config for test"
};