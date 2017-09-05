const ority = require('ority');
const isPlainObject = require('is-plain-object');
const _ = exports;

_.arrify = _ => _ ? Array.isArray(_) ? _ : [_] : [];
_.arrifyClass = _ => _ ? Array.isArray(_) ? _ : [..._.split(/ +/g)] : [];

_.getPropsAndChildren = args => {
  if (!Array.isArray(args)) {
    throw new Error(`Need an array of args, got: ${args} (${typeof args})`);
  }
  if (_.isTTL(args)) {
    return { props: {}, children: [_.parseTTL(...args)] };
  } else {
    let { props, children } = ority(args, [{
      props: 'object',
      children: ['string'],
    }, {
      children: ['string'],
      props: 'object',
    }, {
      props: 'object',
    }, {
      children: ['string'],
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
  for (let i = rest.length - 1; i >= 0; i--) {
    const b = rest[i];
    for (const key in b) {
      if (key === 'class') {
        a.class = [..._.arrifyClass(a.class), ..._.arrifyClass(b.class)];
      } else {
        a[key] = b[key];
      }
    }
  }
  return a;
}
_.mergeProps1 = (...props) => (props || []).reduce((a = {}, b = {}) => {
  [a, b].forEach(props => {
    if (!isPlainObject(props)) {
      // console.error({ props });
      throw new Error(`\`props\` needs to be a plain object, not: ${props} ({type: '${typeof props}'})`);
    }
  });
  for (const key in b) {
    if (key === 'class') {
      a.class = [..._.arrifyClass(a.class), ..._.arrifyClass(b.class)];
    } else {
      a[key] = b[key];
    }
  }
  return a;
});

_.addClassToProps = (props = {}, className) => {
  if (!isPlainObject(props)) {
    // console.error({ props });
    throw new Error(`\`props\` needs to be a plain object, not: ${props} ({type: '${typeof props}'})`);
  }
  props.class = _.arrify(props.class);
  if (!props.class.includes(className)) {
    props.class.unshift(className);
  }
}
