const dashify = require('dashify');
const _ = require('./utils');

const symbol = Symbol('symbol');

module.exports = (hh, opts = {}) => {
  const mergeDeep = Boolean(opts.mergeDeep !== false);
  return new Proxy(hh, {
    apply: (hh, that, args) => {
      const [component, ...rest] = args;
      if (!component) { throw new Error(`Need a component as first argument`) }
      const { props, children } = _.getPropsAndChildren(rest);
      return hh(component, props, children);
    },
    get: (t, component) => {
      const h = (...args) => {
        const { props, children } = _.getPropsAndChildren(args);
        const ret = hh(component, props, children) || {};
        ret[symbol] = true;
        return ret;
      }
      return re();

      function re(prev = [], prevProp) {
        if (typeof prevProp !== 'string') {
          prevProp = null;
        }
        const getRetFn = prop => (...args) => {
          if (args.length && args.some(_ => _[symbol])) {
            return h(_.mergeProps({}, _.ifToClass(prevProp), ...prev, mergeDeep), args);
          } else if (_.isTTL(args)) {
            const children = [_.parseTTL(args)];
            const props = _.mergeProps({}, _.ifToClass(prevProp), ...prev, mergeDeep);
            return h(props, children);
          } else if (prop && args.length === 1) {
            const arg = args[0];
            return re([{
              [prop]: arg
            }, ...prev]);
          } else {
            return h(_.mergeProps({}, ...prev, mergeDeep), args);
          }
        };
        return new Proxy(() => {}, {
          apply: (t, tt, args) => getRetFn(prevProp)(...args),
          get: (t, prop, recv) => {
            if (opts.dashifyClassnames) {
              prop = dashify(prop);
            }
            return re([{}, _.ifToClass(prevProp), ...prev], prop);
          },
        });
      }
    },
  });
}
