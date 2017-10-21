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
      if (Array.isArray(props.class)) {
        props.class = props.class.join(' ')
      }
      return hh(component, props, children);
    },
    get: (t, component) => {
      const h = (...args) => {
        const { props, children } = _.getPropsAndChildren(args);
        if (opts.style && props.class && props.class.length) {
          const additionalClasses = Object.keys(opts.style).filter(_ => props.class.some(__ => _ === __));
          props.class.push(...(additionalClasses.map(_ => opts.style[_])));
        }
        if (Array.isArray(props.class)) {
          props.class = props.class.join(' ')
        }
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
          args = args.filter(Boolean);
          if (!args.length) {
            const props = _.mergeProps({}, _.ifToClass(prevProp), ...prev, mergeDeep);
            return h(props, []);
          } else if (_.isTTL(args)) {
            const children = [_.parseTTL(args)];
            const props = _.mergeProps({}, _.ifToClass(prevProp), ...prev, mergeDeep);
            return h(props, children);
          } else if (prop && args.length === 1 && (
              typeof args[0] === 'string' || 'function' === typeof args[0]
              || prop === 'style'
            )) {
            // an attribute
            const arg = args[0];
            return re([{
              [prop]: arg
            }, ...prev])
          } else if (
            // all arguments are nodes/strings
            args.some(arg => (arg !== undefined && arg !== null) && (typeof arg === 'string' || arg[symbol] || arg['nodeName']))
            && !args.some(arg => !((arg !== undefined && arg !== null) && (typeof arg === 'string' || arg[symbol] || arg['nodeName'])))
          ) {
            const props = _.mergeProps({}, _.ifToClass(prevProp), ...prev, mergeDeep);
            const children = args;
            return h(props, children);
          } else {
            // default: [props, children] or [props] or [children]
            let { props, children } = _.getPropsAndChildren(args);
            props = _.mergeProps({}, _.ifToClass(prevProp), ...prev, props, mergeDeep);
            return h(props, children);
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
