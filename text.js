const hyperchain = require('.');

module.exports = opts => hyperchain(toString, opts);

function toString(tag, attrs, children) {
  return `<${tag}`
    + Object.keys(attrs)
    .map(attr => {
      const val = attrs[attr];
      switch (typeof val) {
        case 'boolean':
        case 'number':
        case 'string':
          return ` ${attr}=${JSON.stringify(val)}`;
      }
    })
    .filter(Boolean)
    .join('')
    + `>`
    + (children || []).join('')
    + `</${tag}>`;
}
