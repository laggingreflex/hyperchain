const ority = require('ority');
const _ = exports;

_.arrify = _ => _ ? Array.isArray(_) ? _ : [_] : [];

_.getPropsAndChildren = args => {
  let { props, children } = ority(args, [{
    props: 'object',
    children: ['string'],
  }, {
    props: 'object',
  }, {
    children: ['string'],
  }]);
  props = props || {};
  children = _.arrify(children);
  return { props, children };
}
