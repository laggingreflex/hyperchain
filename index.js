const dashify = require('dashify');
const proxyAssign = require('proxy-assign');
const _ = require('./utils');
const defaultOpts = require('./opts')

module.exports = (hh, opts = {}) => {
  opts = proxyAssign(opts, defaultOpts);
  if (typeof hh !== 'function') {
    throw new Error(`Need a reviver function (h/createElement). Provide one or use a helper (/react/preact/text)`);
  }
  const mergeDeep = Boolean(opts.mergeDeep !== false);

  const elementMap = old => {
    if (!opts.elementMap || !(old in opts.elementMap)) return old;
    const component = opts.elementMap[old];
    if (!component) { throw new Error(`Invalid elementMap: {${old}: ${component}}`) }
    return component;
  }

  return new Proxy(hh, {
    apply: (hh, that, args) => {
      let [component, ...rest] = args;
      component = elementMap(component);
      if (!component) { throw new Error(`Need a component as first argument, received {${component}}`) }
      let { props, children } = _.getPropsAndChildren(rest);
      if (props && Array.isArray(props.class)) {
        props.class = props.class.join(' ')
      }
      if (opts.filterFalseyChildren && children && children.length) {
        children = children.filter(Boolean);
      }
      return hh(component, props, ...children);
    },
    get: (t, component) => {
      component = elementMap(component);
      const h = (...args) => {
        // console.log(`args:`, args);
        let { props, children } = _.getPropsAndChildren(args);
        if (opts.filterFalseyChildren && children && children.length) {
          children = children.filter(Boolean);
        }
        // if (!props.class) {
        //   props.class = [];
        // }
        if (opts.tagClass) {
          if (!props) props = {};
          if (!props.class) props.class = [];
        }
        if (props && props.class) {
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
            props.class = props.class.join(' ').trim();
          }
          if (!props.class) {
            delete props.class;
          }
        }
        // console.log({ props, children });
        let ret;
        if (props === undefined) {
          if (children.length) throw new Error(`This shouldn't have happened`);
          ret = hh(component) || {};
        } else {
          ret = hh(component, props, ...children) || {};
        }
        // let ret = hh(component, props, ...children) || {};
        // if (children && children.length) {
        //   ret = hh(component, props, children) || {};
        // } else {
        //   ret = hh(component, props) || {};
        // }
        ret[_.symbol] = true;
        return ret;
      }
      return re();

      function re(prev = [], prevProp) {
        // console.log({ prev, prevProp });
        if (typeof prevProp !== 'string') {
          // console.log(prevProp, '->null');
          // prevProp = null;
        }

        const getRetFn = prop => (...args) => {
          // console.log(`args:`, args);
          // args = args.filter(Boolean);
          if (!args.length) {
            // console.log(1);
            const props = prevProp ? _.mergeProps({}, _.ifToClass(prevProp), ...prev, mergeDeep) : prevProp;
            return h(props);
            // return h(props, []);
          } else if (_.isTTL(args)) {
            // console.log(2);
            const children = _.parseTTL(args);
            const props = prevProp ? _.mergeProps({}, _.ifToClass(prevProp), ...prev, mergeDeep) : prevProp;
            // console.log({ props, children });
            return h(props, ...children);
            // return h(props, children);
          } else if (prop && args.length === 1 && (
              typeof args[0] === 'function'
              || prop === 'style'
              // || (typeof args[0] === 'string' && prevProp === 'attr')
            )) {
            // console.log(3);
            // an attribute
            const arg = args[0];
            return re([{
              [prop]: arg
            }, ...prev])
          } else if (
            // all arguments are nodes/strings
            args.some(arg => (arg !== undefined && arg !== null) && (typeof arg === 'string' || arg[_.symbol] || arg['nodeName']))
            && !args.some(arg => !((arg !== undefined && arg !== null) && (typeof arg === 'string' || arg[_.symbol] || arg['nodeName'])))
          ) {
            // console.log(4);
            const props = prevProp ? _.mergeProps({}, _.ifToClass(prevProp), ...prev, mergeDeep) : prevProp;
            const children = args;
            return h(props, ...children);
            // return h(props, children);
          } else {
            // console.log(5);
            // default: [props, children] or [props] or [children]
            let { props, children } = _.getPropsAndChildren(args);
            if (props) {
              props = _.mergeProps({}, _.ifToClass(prevProp), ...prev, props, mergeDeep);
            }
            return h(props, ...children);
            // return h(props, children);
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
