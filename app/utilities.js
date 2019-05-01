const getExtension = uri => uri.match(/[^\\]*\.(\w+)$/)[1];

module.exports = { getExtension };
