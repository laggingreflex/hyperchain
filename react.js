const { createElement } = require('react');
const hyperchain = require('.');
module.exports = opts => hyperchain(createElement, opts);
