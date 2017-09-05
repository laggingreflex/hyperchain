const _ = require('./utils');
const chain = require('chain-anything');


module.exports = hh => {

  let component;
  const props = {};

  const mergeProps = (key, val) => _.mergeProps(props, {
    [key]: val
  });

  const h = (component, ...args) => {
    const { props, children } = _.getPropsAndChildren(args);
    // console.log(`hh()`, { component, props, children });
    return hh(component, props, children);
  }

  let prevKey;

  const setPrevKeyClass = () => {
    if (prevKey) {
      // console.log('setPrevKeyClass', prevKey);
      mergeProps('class', prevKey)
      prevKey = null;
    }
  }

  return chain({
    [chain.symbol.apply](...args) {
      if (_.isTTL(args)) {
        setPrevKeyClass();
        return h(component, props, [_.parseTTL(args)]);
      } else {
        if (!args.length) {
          setPrevKeyClass();
          return h(component || 'div', props);
        } else if (args.length === 1) {
          const [arg] = args;
          if (prevKey) {
            mergeProps(prevKey, arg);
            prevKey = null;
          } else {
            setPrevKeyClass();
            component = arg;
          }
        } else {
          setPrevKeyClass();
          return h(...args);
        }
      }
    },
    [chain.symbol.get](key) {
      // console.log(`key:`, key);
      if (component) {
        if (prevKey) {
          _.mergeProps(props, { class: prevKey });
          prevKey = key;
        } else {
          prevKey = key;
        }
      } else {
        component = 'div';
      }
    },
  })

}
