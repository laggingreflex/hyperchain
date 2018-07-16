const ority = require('ority');
const deepmerge = require('deepmerge');
const _ = exports;

_.symbol = Symbol('symbol');

_.arrify = _ => _ ? Array.isArray(_) ? _ : [_] : [];
_.flat = a => a.reduce((f, v) => Array.isArray(v) ? f.concat(_.flat(v)) : f.concat(v), []);
_.ifToClass = _ => _ && { class: _ } || {};
_.arrifyClass = _ => {
  if (!_) return [];
  if (Array.isArray(_)) return _;
  if (typeof _ === 'string') return _.split(/ +/g);
  if (typeof _ === 'object') return Object.keys(_).reduce((c, k) => [...c, _[k] && k].filter(Boolean), []);
  throw new Error(`Invalid class: ${typeof _} ${JSON.stringify(_)}`);
};

const childTypes = 'string|number|function|boolean'.split('|');

_.getPropsAndChildren = args => {

  const isChild = it => childTypes.includes(typeof it) || Array.isArray(it) || (it && it[_.symbol]);

  let props;
  let children = [];

  // console.log(`args:`, args);

  if (!args || !args.length) {
    //
  } else if (args.length === 1) {
    if (isChild(args[0])) {
      props = null;
      if (Array.isArray(args[0])) {
        children = args[0];
      } else {
        children = args;
      }
    } else {
      props = args[0];
      // if (props && props.children) {
      //   children = props.children;
      // }
    }
  } else {
    if (isChild(args[0])) {
      props = null;
      children = args;
    } else {
      props = args[0] || null;
      children = args.slice(1);
    }
  }

  // console.log({ props, children });

  // if (isChild(args[0])) {
  //   props = null;
  //   children = args;
  // } else if (args.length > 1) {
  //   props = args[0] || null;
  //   children = args.slice(1);
  // } else {
  //   props = args[0] || null;
  //   children = args.slice(1);
  // }

  return { props, children };

  // if (typeof args[0])
  //   if (!Array.isArray(args)) {
  //     throw new Error(`Need an array of args, got: ${args} (${typeof args})`);
  //   }
  // if (_.isTTL(args)) {
  //   return { props: {}, children: _.parseTTL(...args) };
  // } else {
  //   let { props, children } = ority(args, [{
  //     props: 'object',
  //     children: ['string', 'number', 'function'],
  //   }, {
  //     children: ['string', 'number', 'function'],
  //     props: 'object',
  //   }, {
  //     props: 'object',
  //   }, {
  //     children: ['string', 'number', 'function'],
  //   }, {}]);
  //   props = props || {};
  //   children = _.arrify(children || []);
  //   return { props, children };
  // }
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
_.parseTTL = ([str, ...keys]) => str.reduce((children, child, i) => children.concat([child, keys[i] !== undefined && keys[i]].filter(Boolean)), []);
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
