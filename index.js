const _ = require('./utils');

module.exports = h => new Proxy(h, {
  get(h, tagName) {
    const hTag = (...args) => {
      const { props, children } = _.getPropsAndChildren(args);
      return h(tagName, props, children);
    };
    const createClassNameProxy = h => new Proxy(h, {
      get: (h, className) => createClassNameProxy((...args) => {
        const { props, children } = _.getPropsAndChildren(args);
        props.class = _.arrify(props.class);
        if (!props.class.includes(className)) {
          props.class.unshift(className);
        }
        return h(props, children);
      }),
    });
    return createClassNameProxy(hTag);
  }
});
