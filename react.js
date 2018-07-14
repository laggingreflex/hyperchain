const { createElement, Fragment } = require('react');
const hyperchain = require('.');
module.exports = opts => hyperchain(createElement, Object.assign({
  elementMap: {
    '_': Fragment,
  },
  keyMap: {
    class: (props, component) => {
      if (component !== Fragment) {
        props.className = props.class;
      }
      delete props.class;
    },
  },
}, opts));
