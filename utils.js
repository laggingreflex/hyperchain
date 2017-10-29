const ority = require('ority');
const deepmerge = require('deepmerge');
const _ = exports;

_.arrify = _ => _ ? Array.isArray(_) ? _ : [_] : [];
_.arrifyClass = _ => _ ? Array.isArray(_) ? _ : _ ? [...((_ || '').split(/ +/g) || [])] : [] : [];
_.ifToClass = _ => _ && { class: _ } || {};

_.getPropsAndChildren = args => {
  if (!Array.isArray(args)) {
    throw new Error(`Need an array of args, got: ${args} (${typeof args})`);
  }
  if (_.isTTL(args)) {
    return { props: {}, children: [_.parseTTL(...args)] };
  } else {
    let { props, children } = ority(args, [{
      props: 'object',
      children: ['string', 'number'],
    }, {
      children: ['string', 'number'],
      props: 'object',
    }, {
      props: 'object',
    }, {
      children: ['string', 'number'],
    }, {}]);
    props = props || {};
    children = _.arrify(children || []);
    return { props, children };
  }
}

_.getAttribValue = args => {
  if (args.length > 1 || !args[0] || typeof args[0] !== 'string') {
    throw new Error(`Expected a single string argument, got: ${args.map(_ => JSON.stringify(_))}`);
  } else {
    return args[0];
  }
}

// TTL = Tagged Template Literals, i.e: `...${...}...`
_.isTTL = args => Array.isArray(args[0]) && 'raw' in args[0];
_.parseTTL = ([str, ...keys]) => str.reduce((_, str, i) => _ + str + (keys[i] || ''), '');
_.parseIfTTL = args => _.isTTL(args) ? _.parseTTL(...args) : args;

_.mergeProps = (a, ...rest) => {
  const last = rest[rest.length - 1];
  let shouldMerge = false;
  if (typeof last === 'boolean') {
    rest = rest.slice(0, -1);
    shouldMerge = last;
  }
  for (let i = rest.length - 1; i >= 0; i--) {
    const b = rest[i];
    for (const key in b) {
      if (key === 'class') {
        try {
          a.class = [..._.arrifyClass(a.class), ..._.arrifyClass(b.class)];
        } catch (error) {
          console.log({ a, b });
          throw error
        }
      } else if (shouldMerge) {
        if (Array.isArray(a[key]) || Array.isArray(b[key])) {
          a[key] = b[key];
        } else if (typeof a[key] === 'object' || typeof b[key] === 'object') {
          a[key] = deepmerge.all([{}, a[key] || {}, b[key] || {}]);
        } else {
          a[key] = b[key];
        }
      } else {
        a[key] = b[key];
      }
    }
  }
  return a;
}
