const _ = exports;

_.symbol = Symbol('symbol');

_.flat = a => a.reduce((f, v) => Array.isArray(v) ? f.concat(_.flat(v)) : f.concat(v), []);

const childTypes = 'string|number|function|boolean'.split('|');
_.isChild = it =>
  childTypes.includes(typeof it)
  || Array.isArray(it)
  || (it && it[_.symbol])
  // || (it && it.children)
  // || (it && it.attributes)
  || (it && it.$$typeof);

_.getPropsAndChildren = args => {

  let props;
  let children = [];

  if (!args || !args.length) {
    //
  } else if (args.length === 1) {
    if (_.isChild(args[0])) {
      props = null;
      if (Array.isArray(args[0])) {
        children = args[0];
      } else {
        children = args;
      }
    } else {
      props = args[0];
    }
  } else {
    if (_.isChild(args[0])) {
      props = null;
      children = args;
    } else {
      props = args[0] || null;
      children = args.slice(1);
    }
  }

  return { props, children };
}
