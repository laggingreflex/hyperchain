const { createElement, Fragment } = require('react');
const hyperchain = require('.');
module.exports = opts => hyperchain(createElement, Object.assign({
  elementMap: {
    '_': Fragment,
  }
}, opts));
