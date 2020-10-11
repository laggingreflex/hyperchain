const assert = require('assert');
const hyperchain = require('.');

const r = (component, props, ...children) => ({ component, props, children });
const h = hyperchain(r);

const deepIt = (ex, eq) => it(ex, () => assert[typeof eq === 'string' ? 'equal' : 'deepEqual'](eval(ex), eq));
deepIt.only = (ex, eq) => it.only(ex, () => assert[typeof eq === 'string' ? 'equal' : 'deepEqual'](eval(ex), eq));
const _deepIt = deepIt;

/* Basic */
it('should throw without reviver', () => assert.throws(hyperchain));
it('should throw without component', () => assert.throws(h));
deepIt(`h('div')`, {
  component: 'div',
  props: null,
  children: []
});
deepIt(`h('div', null, 'hi')`, {
  component: 'div',
  props: null,
  children: ['hi']
});
deepIt(`h('div', null, ['hi'])`, {
  component: 'div',
  props: null,
  children: [
    ['hi']
  ]
});
deepIt(`h('div', {}, 'hi')`, {
  component: 'div',
  props: {},
  children: ['hi']
});
deepIt(`h('div', {a: 1})`, {
  component: 'div',
  props: { a: 1 },
  children: []
});

/* basic nested */
deepIt(`h('div', null, h('div', null, 'hi'))`, {
  component: 'div',
  props: null,
  children: [{ component: 'div', props: null, children: ['hi'] }]
});
deepIt(`h('div', {a:1}, h('div', {b:2}, 'hi'))`, {
  component: 'div',
  props: { a: 1 },
  children: [{ component: 'div', props: { b: 2 }, children: ['hi'] }]
});

/* basic mixed */
deepIt(`h('div', null, 'a', h('div', null, 'b'), 'c')`, {
  component: 'div',
  props: null,
  children: ['a', {
    component: 'div',
    props: null,
    children: ['b']
  }, 'c']
});

/* tags */
deepIt(`h.div('hi')`, {
  component: 'div',
  props: null,
  children: ['hi']
});
deepIt(`h.div(['hi'])`, {
  component: 'div',
  props: null,
  children: ['hi']
});
deepIt('h.div`hi`', {
  component: 'div',
  props: null,
  children: ['hi']
});
deepIt(`h.div({a:1}, 'hi')`, {
  component: 'div',
  props: { a: 1 },
  children: ['hi']
});

/* tags nested */
deepIt(`h.div(h.div('hi'))`, {
  component: 'div',
  props: null,
  children: [{ component: 'div', props: null, children: ['hi'] }]
});
deepIt(`h.div(h.div('a'), h.div('b'))`, {
  component: 'div',
  props: null,
  children: [{ component: 'div', props: null, children: ['a'] }, {
    component: 'div',
    props: null,
    children: ['b']
  }]
});
deepIt(`h.div('a', h.div('b'), 'c')`, {
  component: 'div',
  props: null,
  children: ['a', {
    component: 'div',
    props: null,
    children: ['b']
  }, 'c']
});
deepIt(`h.div(h.div({a:1}, 'a'))`, {
  component: 'div',
  props: null,
  children: [{
    component: 'div',
    props: { a: 1 },
    children: ['a']
  }]
});
deepIt("h.div`Hello ${'world'}`", {
  component: 'div',
  props: null,
  children: [
    'Hello ', 'world'
  ]
});
deepIt("h.div`Hello ${'world'}, what's ${h.div`up`}?`", {
  component: 'div',
  props: null,
  children: [
    'Hello ', 'world', ", what's ",
    { component: 'div', props: null, children: ['up'] },
    '?'
  ]
});

/*classes */
deepIt(`h.div.class('hi')`, {
  component: 'div',
  props: { class: 'class' },
  children: ['hi']
});
deepIt('h.div.class`hi`', {
  component: 'div',
  props: { class: 'class' },
  children: ['hi']
});
deepIt('h.div.multi.class()', {
  component: 'div',
  props: { class: 'multi class' },
  children: []
});
deepIt(`h.div({class: ['array','class']})`, {
  component: 'div',
  props: { class: 'array class' },
  children: []
});
deepIt(`h.div({class: {object: true, class: false}})`, {
  component: 'div',
  props: { class: 'object' },
  children: []
});
deepIt(`h.div.prop({class: ['array']})`, {
  component: 'div',
  props: { class: 'prop array' },
  children: []
});
deepIt(`h.div.prop({class: {true: true, false: false}})`, {
  component: 'div',
  props: { class: 'prop true' },
  children: []
});
deepIt(`h.div({class: 'prop'})`, {
  component: 'div',
  props: { class: 'prop' },
  children: []
});

/*id */
deepIt(`h.div['#id']()`, {
  component: 'div',
  props: { id: 'id' },
  children: []
});

/*deDupe */
deepIt(`h.div.a.a.b.b()`, {
  component: 'div',
  props: { class: 'a b' },
  children: []
});


describe('separation', () => {
  const red = h.div.red;

  const redStrong = red.strong;
  const redLarge = red.large;

  const simpleClass = h.div.simple;
  const arrayClass = h.div({ class: ['array'] });
  const objectClass = h.div({ class: { object: true } });

  const deepIt = eval(String(_deepIt));

  deepIt(`red()`, {
    component: 'div',
    props: { class: 'red' },
    children: []
  });
  deepIt(`redStrong()`, {
    component: 'div',
    props: { class: 'red strong' },
    children: []
  });
  deepIt(`redLarge()`, {
    component: 'div',
    props: { class: 'red large' },
    children: []
  });
  deepIt(`red.additional()`, {
    component: 'div',
    props: { class: 'red additional' },
    children: []
  });
});

describe('nested classes', () => {

  const simpleClass = h.div.simple;

  const deepIt = eval(String(_deepIt));

  deepIt(`simpleClass({class: 'array'})`, {
    component: 'div',
    props: { class: 'simple array' },
    children: []
  });
});

describe('opts.tagClass', () => {
  const h = hyperchain(r, { tagClass: true });
  const deepIt = eval(String(_deepIt));

  deepIt(`h.div()`, {
    component: 'div',
    props: { class: 'div' },
    children: []
  });

  deepIt(`h.div.class()`, {
    component: 'div',
    props: { class: 'div class' },
    children: []
  });
  deepIt(`h.div.class({class: 'nested'})`, {
    component: 'div',
    props: { class: 'div class nested' },
    children: []
  });
});

describe('opts.dashifyClassnames', () => {
  const h = hyperchain(r, { dashifyClassnames: true });
  const deepIt = eval(String(_deepIt));

  deepIt(`h.div.dashedClass()`, {
    component: 'div',
    props: { class: 'dashed-class' },
    children: []
  });
  deepIt(`h.div.dashedClass['#withId']()`, {
    component: 'div',
    props: { class: 'dashed-class', id: 'with-id' },
    children: []
  });
});

describe('opts.filterFalseyChildren', () => {
  const h = hyperchain(r, { filterFalseyChildren: true });
  const deepIt = eval(String(_deepIt));

  deepIt(`h.div('a', false, 'b')`, {
    component: 'div',
    props: null,
    children: ['a', 'b']
  });
});


describe('opts.elementMap', () => {
  const h = hyperchain(r, { elementMap: { div: 'p', null: null } });
  const deepIt = eval(String(_deepIt));

  deepIt(`h.div()`, {
    component: 'p',
    props: null,
    children: []
  });

  assert.throws(() => h.null());
});

describe('opts.keyMap', () => {
  const h = hyperchain(r, { keyMap: { class: 'className' } });
  const deepIt = eval(String(_deepIt));

  deepIt(`h.div.class()`, {
    component: 'div',
    props: { className: 'class' },
    children: []
  });
  describe('function', () => {
    const h = hyperchain(r, {
      keyMap: {
        class: (props, component, ...children) => {
          if (component !== 'fragment') {
            props.className = props.class;
          }
          delete props.class;
        }
      }
    });
    const deepIt = eval(String(_deepIt));

    deepIt(`h.div.class()`, {
      component: 'div',
      props: { className: 'class' },
      children: []
    });
    deepIt(`h.fragment.class()`, {
      component: 'fragment',
      props: {},
      children: []
    });
  });
  describe('other', () => {
    const h = hyperchain(r, { keyMap: { class: 1 } });
    const deepIt = eval(String(_deepIt));

    assert.throws(() => h.div.class());
  });
});

describe('opts.style', () => {
  const h = hyperchain(r, { style: { actual: 'hashed' } });
  const deepIt = eval(String(_deepIt));

  deepIt(`h.div.actual()`, {
    component: 'div',
    props: { class: 'hashed' },
    children: []
  });
  deepIt(`h.div.other()`, {
    component: 'div',
    props: { class: 'other' },
    children: []
  });
});

describe('opts.style[]', () => {
  const h = hyperchain(r, { style: [{ actual: ['a'] }, { actual: ['b'] }] });
  const deepIt = eval(String(_deepIt));

  deepIt(`h.div.actual()`, {
    component: 'div',
    props: { class: 'a b' },
    children: []
  });
});

describe('opts.stylePreserveNames', () => {
  const h = hyperchain(r, { style: { actual: 'hashed' }, stylePreserveNames: true });
  const deepIt = eval(String(_deepIt));

  deepIt(`h.div.actual()`, {
    component: 'div',
    props: { class: 'actual hashed' },
    children: []
  });
});

describe('opts.styleOmitUnused', () => {
  const h = hyperchain(r, { style: { used: 'hash(used)' }, styleOmitUnused: true });
  const deepIt = eval(String(_deepIt));

  deepIt(`h.div.used.unused()`, {
    component: 'div',
    props: { class: 'hash(used)' },
    children: []
  });
});


describe('text', () => {
  const h = require('./text')({});
  const deepIt = eval(String(_deepIt));

  deepIt(`h.div()`, '<div></div>');
  deepIt(`h.div('hi')`, '<div>hi</div>');
  deepIt(`h.div('a', 'b')`, '<div>ab</div>');
  deepIt(`h.div(h.div('a'), 'b', h.div('c'))`, '<div><div>a</div>b<div>c</div></div>');
  deepIt(`h.div({id:'app'})`, '<div id="app"></div>');
  deepIt(`h.div['#app']()`, '<div id="app"></div>');
  deepIt(`h.div({bool:false})`, '<div bool="false"></div>');
  deepIt(`h.div({num:1})`, '<div num=1></div>');
  deepIt(`h.div()`, '<div></div>');
  deepIt(`h.div([['a']])`, '<div>a</div>');
});

describe('special', () => {
  it('class as both prop and object', () => {
    const h = hyperchain(r, {
      style: {
        prop: 'prop_hash',
        object: 'object_hash',
      },
      dashifyClassnames: true,
      tagClass: true,
      filterFalseyChildren: true,
    });
    assert.deepEqual(h.div.prop({ class: { object: true } }), {
      component: 'div',
      props: {
        class: 'div prop_hash object_hash'
      },
      children: [],
    })
  })
});
