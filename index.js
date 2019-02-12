const dashify = require('dashify');
const proxyAssign = require('proxy-assign');
const _ = require('./utils');
const defaultOpts = require('./opts')

module.exports = (reviver, opts = {}) => {
  if (typeof reviver !== 'function') {
    throw new Error(`Need a reviver function (h/createElement). Provide one or use a helper (/react/preact/text)`);
  }

  opts = proxyAssign(opts, defaultOpts);

  return new Proxy(reviver, { apply: baseApply, get: baseGet });

  function baseApply(reviver, thisArg, args) {
    let [component, ...rest] = args;
    let { props, children } = _.getPropsAndChildren(rest);
    component = sortComponent(component);
    props = sortProps(props, component, ...children);
    children = sortChildren(children);
    return reviver(component, props, ...children);
  }

  function baseGet(t, component) {
    component = sortComponent(component);
    const tagName = String(component);
    let props;
    if (opts.tagClass || (opts.style && tagName in opts.style)) {
      props = { class: [tagName] }
    }
    const baseGet = (...args) => deepReviver.call({ component, props }, ...args);
    return new Proxy(baseGet, { get: deepGet.bind({ component, props }) })
  }

  function deepReviver(...args) {
    const { component } = this;
    let { props, children } = _.getPropsAndChildren(args);
    props = mergePrevProps(this.props, ...(this.prevProps || []), props);
    props = sortProps(props, component, ...children);
    children = sortChildren(children);
    const element = reviver(component, props, ...children);
    element[_.symbol] = true;
    return element;
  }

  function deepGet(t, className) {
    const prevProps = [...(this.prevProps || []), { class: className }];
    const baseGet = (...args) => deepReviver.call({ ...this, prevProps }, ...args);
    return new Proxy(baseGet, { get: deepGet.bind({ ...this, prevProps }) });
  }

  function sortComponent(component) {
    component = elementMap(component);
    if (!component) { throw new Error(`Need a component as first argument, received {${component}}`) }
    return component;
  }

  function sortProps(props, component, ...children) {
    if (props && props.class && Array.isArray(props.class)) {
      if (props.class.length) {
        props.class = props.class.join(' ');
      } else {
        delete props.class;
      }
    }
    applyKeyMap(props, component, ...children);
    return props;
  }

  function sortChildren(children) {
    if (opts.flatChildren && children && children.length) {
      children = _.flat(children);
    }
    if (opts.filterFalseyChildren && children && children.length) {
      children = children.filter(Boolean);
    }
    return children;
  }

  function mergePrevProps(...prevProps) {
    if (!prevProps.filter(Boolean).length) return null;
    const merged = {};
    for (const props of prevProps) {
      for (const key in props) {
        if (key === 'class') {
          merged.class = sortClass.call({ props: merged }, merged.class, props.class);
        } else {
          merged[key] = props[key];
        }
      }
    }
    return merged;
  }

  function sortClass(...classes) {
    let final = [];
    for (const classProp of classes) {
      if (!classProp) continue;
      if (typeof classProp === 'string') {
        final.push(classProp);
      } else if (Array.isArray(classProp)) {
        final.push(...classProp);
      } else {
        final.push(...Object.keys(classProp).reduce((arr, key) => arr.concat([classProp[key] && key].filter(Boolean)), []));
      }
    }
    if (opts.dashifyClassnames) {
      final = final.map(dashify);
    }
    for (let i = 0; i < final.length; i++) {
      const id = final[i];
      if (id.startsWith('#')) {
        this.props.id = id.substr(1);
        final.splice(i, 1);
      }
    }
    if (opts.style) {
      if (opts.stylePreserveNames) {
        final = final.concat(final.map(actual => opts.style[actual]).filter(Boolean));
      } else {
        final = final.map(actual => opts.style[actual] || actual);
      }
      if (opts.styleOmitUnused) {
        const used = Object.values(opts.style);
        final = final.filter(f => used.includes(f));
      }
    }
    return final;
  }

  function elementMap(old) {
    if (!opts.elementMap || !(old in opts.elementMap)) return old;
    const component = opts.elementMap[old];
    if (!component) { throw new Error(`Invalid elementMap: {${old}: ${component}}`) }
    return component;
  }

  function applyKeyMap(props, ...rest) {
    if (!props || !opts.keyMap) return;
    for (const key in opts.keyMap) {
      const map = opts.keyMap[key];
      if (typeof map === 'string') {
        props[opts.keyMap[key]] = props[key];
        delete props[key];
      } else if (typeof map === 'function') {
        map(props, ...rest);
      } else {
        throw new Error(`Invalid opts.keyMap Expected a string or a function, got ${typeof map}`);
      }
    }
    return props;
  }
}
