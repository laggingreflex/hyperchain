const dashify = require('dashify');
const _ = require('./utils');

const symbol = Symbol('symbol');

module.exports = (hh, opts = {}) => {
  if (typeof hh !== 'function') {
    throw new Error(`Need a reviver function (h/createElement). Provide one or use a helper (/react/preact/text)`);
  }
  const mergeDeep = Boolean(opts.mergeDeep !== false);
  return new Proxy(hh, {
    apply: (hh, that, args) => {
      const [component, ...rest] = args;
      if (!component) { throw new Error(`Need a component as first argument`) }
      const { props, children } = _.getPropsAndChildren(rest);
      if (Array.isArray(props.class)) {
        props.class = props.class.join(' ')
      }
      if (children && children.length) {
        if (children.length === 1 && typeof children[0] === 'function') {
          return hh(component, props, children[0]);
        } else {
          return hh(component, props, children);
        }
      } else {
        return hh(component, props);
      }
    },
    get: (t, component) => {
      const h = (...args) => {
        const { props, children } = _.getPropsAndChildren(args);
        if (!props.class) {
          props.class = [];
        }
        if (!Array.isArray(props.class)) {
          props.class = props.class.split(' ');
        }
        if (opts.tagClass && typeof component === 'string') {
          props.class.push(component);
        }
        if (opts.style) {
          const additionalClasses = Object.keys(opts.style).filter(_ => props.class.some(__ => _ === __));
          props.class.push(...(additionalClasses.map(_ => opts.style[_])));
        }
        if (Array.isArray(props.class)) {
          props.class = props.class.join(' ')
        }
        if (!props.class) {
          delete props.class;
        }
        let ret;
        if (children && children.length) {
          ret = hh(component, props, children) || {};
        } else {
          ret = hh(component, props) || {};
        }
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
            const children = _.parseTTL(args);
            const props = _.mergeProps({}, _.ifToClass(prevProp), ...prev, mergeDeep);
            return h(props, children);
          } else if (prop && args.length === 1 && (
              typeof args[0] === 'function'
              || prop === 'style'
              // || (typeof args[0] === 'string' && prevProp === 'attr')
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