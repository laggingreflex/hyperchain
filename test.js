const td = require('testdouble');
const assert = require('assert');
const hyperchain = require('.');
const _ = require('./utils');

const itDeepEqual = (fn, a, b) => it(`${a.map(_=>JSON.stringify(_))} => ${JSON.stringify(b)}`, () => assert.deepEqual(fn(...a), b));
itDeepEqual.skip = (fn, a, b) => it.skip(`${a.map(_=>JSON.stringify(_))} => ${JSON.stringify(b)}`, () => assert.deepEqual(fn(...a), b));

describe('basic', () => {
  it('h(div, null, hi)', () => {
    const r = td.function();
    const h = hyperchain(r);
    h('div', null, 'hi');
    td.verify(r('div', null, 'hi'));
  });
  it('h(div, null, [hi])', () => {
    const r = td.function();
    const h = hyperchain(r);
    h('div', null, ['hi']);
    td.verify(r('div', null, ['hi']));
  });
  it('h(div, {}, hi)', () => {
    const r = td.function();
    const h = hyperchain(r);
    h('div', {}, 'hi');
    td.verify(r('div', {}, 'hi'));
  });
  it('h(div, {}, [hi])', () => {
    const r = td.function();
    const h = hyperchain(r);
    h('div', {}, ['hi']);
    td.verify(r('div', {}, ['hi']));
  });
  describe('opts.filterFalseyChildren', () => {
    it('h(div, null, hi, null, hi)', () => {
      const r = td.function();
      const h = hyperchain(r, { filterFalseyChildren: true });
      h('div', null, 'hi', null, 'hi');
      td.verify(r('div', null, 'hi', 'hi'));
    });
  });
});


describe('tags', () => {
  it('h.div(hi)', () => {
    const r = td.function();
    const h = hyperchain(r);
    h.div('hi');
    td.verify(r('div', null, 'hi'));
  });
  it('h.div`hi`', () => {
    const r = td.function();
    const h = hyperchain(r);
    h.div `hi`;
    td.verify(r('div', null, 'hi'));
  });
  it('h.div({props}, hi)', () => {
    const r = td.function();
    const h = hyperchain(r);
    h.div({ props: 'props' }, 'hi');
    td.verify(r('div', { props: 'props' }, 'hi'));
  });
  it('h.div({props}, hi)', () => {
    const r = td.function();
    const h = hyperchain(r);
    h.div({ props: 'props' }, ['hi']);
    td.verify(r('div', { props: 'props' }, ['hi']));
  });
});

describe('classes', () => {
  it('h.div.class`hi`', () => {
    const r = td.function();
    const h = hyperchain(r);
    h.div.class `hi`;
    td.verify(r('div', { class: 'class' }, 'hi'));
  });
  it('h.div.some.class`hi`', () => {
    const r = td.function();
    const h = hyperchain(r);
    h.div.some.class `hi`;
    td.verify(r('div', { class: 'some class' }, 'hi'));
  });
  it('h.div({class: {a: true, b: false}})', () => {
    const r = td.function();
    const h = hyperchain(r);
    h.div({ class: { a: true, b: false } }, 'hi');
    td.verify(r('div', { class: 'a' }, 'hi'));
  });
});


describe.skip('attrs', () => {
  it('h.div.id(id)`hi`', () => {
    const r = td.function();
    const h = hyperchain(r);
    h.div.attr.id('id')
    `hi`;
    td.verify(r('div', { id: 'id' }, ['hi']));
  });
  it('h.div.id(id).id(id2)`hi`', () => {
    const r = td.function();
    const h = hyperchain(r);
    h.div.id('id').id('id2')
    `hi`;
    td.verify(r('div', { id: 'id2' }, ['hi']));
  });
});



describe('separation', () => {
  it('...', () => {
    const r = td.function();
    const h = hyperchain(r);
    const { div } = h;
    div.class `hi`;
    div.class2 `hi`;
    td.verify(r('div', { class: 'class' }, 'hi'));
    td.verify(r('div', { class: 'class2' }, 'hi'));
  });
});


describe('nesting', () => {
  it('classes', () => {
    const r = td.function();
    const h = hyperchain(r);
    const { div } = h;
    const base = div.base
    const a = base.a
    const b = base.b
    a `a`
    b `b`
    td.verify(r('div', { class: 'base a' }, 'a'));
    td.verify(r('div', { class: 'base b' }, 'b'));
  });
});

describe.skip('opts.mergeDeep', () => {
  it('should', () => {
    const r = td.function();
    const h = hyperchain(r);
    h.div({ style: { a: 1 } })({ style: { b: 2 } })
    `hi`;
    td.verify(r('div', { style: { a: 1, b: 2 } }, 'hi'));
  });
  it('shouldnt', () => {
    const r = td.function();
    const h = hyperchain(r, { mergeDeep: false });
    h.div.style({ a: 1 }).style({ b: 2 })
    `hi`;
    td.verify(r('div', { style: { b: 2 } }, 'hi'));
  });
});


describe('opts.tagClass', () => {
  it('should', () => {
    const r = td.function();
    const h = hyperchain(r, { tagClass: true });
    h.div `hi`;
    td.verify(r('div', { class: 'div' }, 'hi'));
  });
  it('should with style', () => {
    const r = td.function();
    const h = hyperchain(r, { style: { div: 'hash' }, tagClass: true });
    h.div `hi`;
    td.verify(r('div', { class: 'div hash' }, 'hi'));
  });
  it('shouldnt', () => {
    const r = td.function();
    const h = hyperchain(r, { tagClass: false });
    h.div `hi`;
    td.verify(r('div', null, 'hi'));
  });
});

describe('opts.dashifyClassnames', () => {
  it('should', () => {
    const r = td.function();
    const h = hyperchain(r, { dashifyClassnames: true });
    h.div.className `hi`;
    td.verify(r('div', { class: 'class-name' }, 'hi'));
  });
  it('shouldnt', () => {
    const r = td.function();
    const h = hyperchain(r, { dashifyClassnames: false });
    h.div.className `hi`;
    td.verify(r('div', { class: 'className' }, 'hi'));
  });
});

describe('opts.filterFalseyChildren', () => {
  it('should', () => {
    const r = td.function();
    const h = hyperchain(r, { filterFalseyChildren: true });
    h.div('hi', false, 'hi');
    td.verify(r('div', null, 'hi', 'hi'));
  });
  it('shouldnt', () => {
    const r = td.function();
    const h = hyperchain(r, { filterFalseyChildren: false });
    h.div('hi', false, 'hi');
    td.verify(r('div', null, 'hi', false, 'hi'));
  });
});

describe('opts.flatChildren', () => {
  it('should', () => {
    const r = td.function();
    const h = hyperchain(r, { flatChildren: true });
    h.div([
      ['hi']
    ]);
    td.verify(r('div', null, 'hi'));
  });
  it('shouldnt', () => {
    const r = td.function();
    const h = hyperchain(r, { flatChildren: false });
    h.div([
      ['hi']
    ]);
    td.verify(r('div', null, ['hi']));
  });
  it('should', () => {
    const r = td.function();
    const h = hyperchain(r, { flatChildren: true });
    h.div.a([
      ['hi']
    ]);
    td.verify(r('div', null, 'hi'));
  });
  it('shouldnt', () => {
    const r = td.function();
    const h = hyperchain(r, { flatChildren: false });
    h.div.a([
      ['hi']
    ]);
    td.verify(r('div', null, ['hi']));
  });
});

describe('opts.elementMap', () => {
  it('should', () => {
    const r = td.function();
    const h = hyperchain(r, { elementMap: { 'div': 'p' } });
    h.div();
    td.verify(r('p'));
  });
  it('shouldnt', () => {
    const r = td.function();
    const h = hyperchain(r, { elementMap: false });
    h.div();
    td.verify(r('div'));
  });
});

describe('opts.keyMap', () => {
  it('should', () => {
    const r = td.function();
    const h = hyperchain(r, { keyMap: { class: 'className' } });
    h.div.div();
    td.verify(r('div', { className: 'div' }));
  });
  it('shouldnt', () => {
    const r = td.function();
    const h = hyperchain(r, { keyMap: false });
    h.div.div();
    td.verify(r('div', { class: 'div' }));
  });
  it('should', () => {
    const r = td.function();
    const h = hyperchain(r, {
      keyMap: {
        class: (props, c) => {
          if (c !== 'Fragment') {
            props.className = props.class
          }
          delete props.class;
        }
      }
    });
    h.div.div();
    td.verify(r('div', { className: 'div' }));
    h.Fragment.div();
    td.verify(r('Fragment', {}));
    // td.verify(r('Fragment'));
  });
});

describe('children', () => {
  it('h.div(a, b)', () => {
    const r = td.function();
    const h = hyperchain(r);
    h.div('a', 'b');
    td.verify(r('div', null, 'a', 'b'));
  });
  it('h.div(h.div(a), h.div(b))', () => {
    const r1 = td.function();
    const r2 = td.function();
    const r3 = td.function();
    const h1 = hyperchain(r1);
    const h2 = hyperchain(r2);
    const h3 = hyperchain(r3);
    td.when(r2('div', null, '2')).thenReturn('2');
    td.when(r3('div', null, '3')).thenReturn('3');

    h1.div(h2.div `2`, h3.div `3`);

    td.verify(r1('div', null, '2', '3'));
  });
  it('h.div(h.div(a), h.div(b))', () => {
    const r1 = td.function();
    const r2 = td.function();
    const h1 = hyperchain(r1);
    const h2 = hyperchain(r2);
    td.when(r2('div', null, '2')).thenReturn('2');

    h1.div(h2.div `2`, 3);

    td.verify(r1('div', null, '2', 3));
  });
  it('h.div(h.div(a), h.div(b))', () => {
    const r1 = td.function();
    const r3 = td.function();
    const h1 = hyperchain(r1);
    const h3 = hyperchain(r3);
    td.when(r3('div', null, '3')).thenReturn('3');

    h1.div(2, h3.div `3`);

    td.verify(r1('div', null, 2, '3'));
  });
  it('h.div(h.div(a))', () => {
    const r1 = td.function();
    const r2 = td.function();
    const h1 = hyperchain(r1);
    const h2 = hyperchain(r2);
    td.when(r2('div', null, '2')).thenReturn('2');

    h1.div(h2.div `2`);

    td.verify(r1('div', null, '2'));
  });
  it('h.div.class(h.div(a))', () => {
    const r1 = td.function();
    const r2 = td.function();
    const h1 = hyperchain(r1);
    const h2 = hyperchain(r2);
    const r2r = { t: 2 };
    td.when(r2('div', { class: 'class2' }, '2')).thenReturn(r2r);
    h1.div.class1(h2.div.class2 `2`);
    td.verify(r1('div', { class: 'class1' }, r2r));
  });
});










describe('opts.style', () => {
  it('h({style: {a: aa}}).div', () => {
    const r = td.function();
    const h = hyperchain(r, { style: { a: 'aa' } });
    h.div.a `hi`;
    td.verify(r('div', { class: 'a aa' }, 'hi'));
  });
});





describe('full', () => {
  it.skip('h.div.class.id(id)`hi`', () => {
    const r = td.function();
    const h = hyperchain(r);
    h.div.class.id('id')
    `hi`;
    td.verify(r('div', { class: 'class', id: 'id' }, ['hi']));
  });
});



describe('utils', () => {
  describe('arrify', () => {
    itDeepEqual(_.arrify, [], []);
    itDeepEqual(_.arrify, [''], []);
    itDeepEqual(_.arrify, [
      ['']
    ], ['']);
    itDeepEqual(_.arrify, [
      []
    ], []);
  });
  describe('arrifyClass', () => {
    itDeepEqual(_.arrifyClass, [], []);
    itDeepEqual(_.arrifyClass, [''], []);
    itDeepEqual(_.arrifyClass, [
      ['']
    ], ['']);
    itDeepEqual(_.arrifyClass, [
      []
    ], []);
    itDeepEqual(_.arrifyClass, ['a b'], ['a', 'b']);
  });
  describe.skip('getPropsAndChildren', () => {
    it.skip('throws on empty', () => assert.throws(_.getPropsAndChildren, /array/));
    itDeepEqual(_.getPropsAndChildren, [
      []
    ], { props: null, children: [] });
    itDeepEqual(_.getPropsAndChildren, [
      [{},
        []
      ]
    ], {
      props: {},
      children: [
        []
      ]
    });
    itDeepEqual(_.getPropsAndChildren, [
      [
        [], {}
      ]
    ], { props: {}, children: [] });
    itDeepEqual(_.getPropsAndChildren, [
      [
        []
      ]
    ], { props: {}, children: [] });
    itDeepEqual(_.getPropsAndChildren, [
      [{}]
    ], { props: {}, children: [] });
    itDeepEqual(_.getPropsAndChildren, [
      ['hi']
    ], { props: {}, children: ['hi'] });
    itDeepEqual(_.getPropsAndChildren, [
      [
        ['hi']
      ]
    ], { props: {}, children: ['hi'] });
    itDeepEqual(_.getPropsAndChildren, [
      [{},
        ['hi']
      ]
    ], { props: {}, children: ['hi'] });
  });
  describe('getPropsAndChildren', () => {
    itDeepEqual(_.getPropsAndChildren, [
      []
    ], { props: null, children: [] });
    itDeepEqual(_.getPropsAndChildren, [
      [{},
        []
      ]
    ], {
      props: {},
      children: [
        []
      ]
    });
  });
  describe('isTTL', () => {
    it('throws on empty', () => assert.throws(_.isTTL));
    it('(args)`` is', () => ((...args) => assert(_.isTTL(args)))
      ``);
    it(`[...] isn't`, () => assert(!_.isTTL(['string', 'k', 'e', 'y', 's'])));
  });
  describe('parseTTL', () => {
    it('throws on empty', () => assert.throws(_.parseTTL));
    it('`Hello ${world}!` = Hello world!', () => ((...args) => assert.deepEqual(_.parseTTL(args), ['Hello ', 'world', '!']))
      `Hello ${'world'}!`);
  });
  describe('mergeProps', () => {
    // itDeepEqual(_.mergeProps, [], {});
    itDeepEqual(_.mergeProps, [{ a: 1 }, { b: 2 }], { a: 1, b: 2 });
    itDeepEqual(_.mergeProps, [{ a: 1 }, { a: 2 }], { a: 2 });
    itDeepEqual(_.mergeProps, [{ class: 'a' }, { class: 'b' }], { class: ['a', 'b'] });
    itDeepEqual(_.mergeProps, [{ class: 'a' }, { class: ['b'] }], { class: ['a', 'b'] });
    itDeepEqual(_.mergeProps, [{ class: ['a'] }, { class: 'b' }], { class: ['a', 'b'] });
    itDeepEqual(_.mergeProps, [{ class: ['a'] }, { class: ['b'] }], { class: ['a', 'b'] });
    itDeepEqual(_.mergeProps, [{ class: 'a' }, { class: undefined }], { class: ['a'] });
    it('modifies original', () => {
      const a = { a: 1 };
      _.mergeProps(a, { b: 2 });
      assert.deepEqual(a, { a: 1, b: 2 });
    })
  });
});


describe('edge cases', () => {
  it('h.div()', () => {
    const r = td.function();
    const h = hyperchain(r);
    h.div();
    td.verify(r('div'));
  });
  it('h.div(undefined)', () => {
    const r = td.function();
    const h = hyperchain(r);
    h.div();
    td.verify(r('div'));
  });
  it('h.div(hi, undefined, hi)', () => {
    const r = td.function();
    const h = hyperchain(r);
    h.div('hi', undefined, 'hi');
    td.verify(r('div', null, 'hi', undefined, 'hi'));
  });
});



describe('text', () => {
  const h = require('./text')({});
  it('h.div(hi)', () => {
    assert.equal(
      h.div('hi'),
      `<div>hi</div>`
    )
  });
  it('<div id="a" class="b"><div>hi</div></div>', () => {
    assert.equal(
      h.div({ id: 'a', class: 'b', data: null, onclick: () => {} }, [h.div('hi')]),
      `<div id="a" class="b"><div>hi</div></div>`
    )
  });
  it('h.div([h.div.a(), h.div.b()])', () => {
    assert.equal(
      h.div(h.div.a(), h.div.b()),
      `<div><div class="a"></div><div class="b"></div></div>`
    )
  });
  it('h.div([h.div.a(), h.div.b()])', () => {
    assert.equal(
      h.div([h.div.a(), h.div.b()]),
      `<div><div class="a"></div><div class="b"></div></div>`
    )
  });
  it('h.div({a:1}, [h.div.a(), h.div.b()])', () => {
    assert.equal(
      h.div({ a: 1 }, [h.div.a(), h.div.b()]),
      `<div a=1><div class="a"></div><div class="b"></div></div>`
    )
  });
});



describe('Context API', () => {
  it('h(Consumer, {}, () => {})', () => {
    const r = td.function();
    const h = hyperchain(r);
    const fn = () => {};
    h('Consumer', {}, fn);
    td.verify(r('Consumer', {}, fn));
  });
});



describe('elementMap', () => {
  it('h.x->y({}, hi)', () => {
    const r = td.function();
    const h = hyperchain(r, { elementMap: { x: 'y' } });
    h.x('hi');
    td.verify(r('y', null, 'hi'));
  });
  it('h.x->y.x({}, hi)', () => {
    const r = td.function();
    const h = hyperchain(r, { elementMap: { x: 'y' } });
    h.x.x('hi');
    td.verify(r('y', { class: 'x' }, 'hi'));
  });
  it('h.y.x({}, hi)', () => {
    const r = td.function();
    const h = hyperchain(r, { elementMap: { x: 'y' } });
    h.y.x('hi');
    td.verify(r('y', { class: 'x' }, 'hi'));
  });
  it('h(x->y, {}, hi)', () => {
    const r = td.function();
    const h = hyperchain(r, { elementMap: { x: 'y' } });
    h('x', {}, 'hi');
    td.verify(r('y', {}, 'hi'));
  });
});
