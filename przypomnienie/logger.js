
// any function or general stuff we want to export (can be variable or class or other stuff)
function log(message) {
    console.log(message);
}

module.exports.log = log; // Exporting the log function, it can also be ANY variable
