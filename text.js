const hyperchain = require('.');
const _ = require('./utils');

module.exports = opts => hyperchain(toString, opts);

function toString(tag, ...args) {
  const { props, children } = _.getPropsAndChildren(args);
  // console.log({props, children});
  return `<${tag}`
    + Object.keys(props || {})
    .map(prop => {
      const val = props[prop];
      switch (typeof val) {
        case 'boolean':
        case 'number':
        case 'string':
          return ` ${prop}=${JSON.stringify(val)}`;
      }
    })
    .filter(Boolean)
    .join('')
    + `>`
    + (_.flat(children || [])).join('')
    + `</${tag}>`;
}
