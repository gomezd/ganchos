
exports = module.exports;

exports.config = {
    exported: "config"
};

exports.test = function (config) {
    return function (req, res, next) {
        console.log('Executing hook: test');
        next();
    };
};