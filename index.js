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


module.exports3 = hh => {


  const h = (component, ...args) => {
    const { props, children } = _.getPropsAndChildren(args);
    return hh(component, props, children);
  }

  const get = (mainH, tagName) => {
    const tagH = (...args) => mainH(tagName, ...args);

    const get = (tagH, propName) => {

      const deepH = (...args) => {
        if (_.isTTL(args)) {
          const children = _.parseTTL(args);
          return tagH({ class: propName }, [children]);
        } else if (args) {
          const attrib = propName;
          const value = _.getAttribValue(args);
          const attribProps = {};
          attribProps[attrib] = value;
          return (...args) => {
            const { props, children } = _.getPropsAndChildren(args);
            _.mergeProps(attribProps, props);
            return tagH(props, children);
          }
        }
      }



    };

    return new Proxy(tagH, { get });
  };

  return new Proxy(h, { get });
};




module.exports2 = h => {

  return new Proxy(mainH, { get: getterOnMainH });

  function mainH(component, ...args) {
    const { props, children } = _.getPropsAndChildren(args);
    return h(component, props, children);
  }

  function getterOnMainH(mainH, tagName) {
    return new Proxy(component, { get: getterToAttachClassName });

    function component(...args) {
      return mainH(tagName, ...args);
    }

    function getterToAttachClassName(x, propName) {
      return new Proxy(component, { get: getterToAttachClassName });

      function component(...args) {
        if (_.isTTL(args)) {
          const { props, children } = _.getPropsAndChildren(args);
          return mainH(tagName, _.mergeProps(props, { class: propName }), children);
        } else if (args.length > 1 || !args[0] || typeof args[0] !== 'string') {
          throw new Error(`Expecting a single string argument for \`.${propName}(${args.map(_ => JSON.stringify(_))})\` `)
        } else {
          const newProps = {
            [propName]: args[0]
          };
          return new Proxy(component, { get: getterToAttachClassName });

          function component(...args) {
            const { props, children } = _.getPropsAndChildren(args);
            return mainH(tagName, _.mergeProps(props, newProps), children);
          }
        }

      }
    }
  }
}

module.exports1 = h => new Proxy(h, {
  get(h, tagName) {
    const hTag = (...args) => {
      console.log({ tagName, args });
      if (_.isTTL(args)) {
        console.log('isTTL');
        return h(tagName, {}, [_.parseTTL(...args)]);
      }
      const { props, children } = _.getPropsAndChildren(args);
      return h(tagName, props, children);
    };
    const createClassNameProxy = h => new Proxy(h, {
      apply: h => (...args) => {
        // console.log('applied');
        console.log('applied', { args });
        if (_.isTTL(args)) {
          console.log('isTTL');
          return h({}, [_.parseTTL(...args)]);
        } else if (args.length === 1) {
          h(...args)
          // const props = {};
          // props[prop] = args[0];
          // return h(props);
        }
      },
      get: (h, prop) => createClassNameProxy((...args) => {
        console.log({ prop, args });
        if (_.isTTL(args)) {
          console.log('isTTL');
          return h({ class: [prop] }, [_.parseTTL(...args)]);
        } else if (args.length === 1) {
          const props = {};
          props[prop] = args[0];
          return h(props);
        }
        const { props, children } = _.getPropsAndChildren(args);
        props.class = _.arrify(props.class);
        if (!props.class.includes(prop)) {
          props.class.unshift(prop);
        }
        return h(props, children);
      }),
    });
    return createClassNameProxy(hTag);
  }
});
