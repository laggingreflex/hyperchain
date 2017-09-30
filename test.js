const td = require('testdouble');
const assert = require('assert');
const hyperchain = require('.');
const _ = require('./utils');

const itDeepEqual = (fn, a, b) => it(`${a.map(_=>JSON.stringify(_))} => ${JSON.stringify(b)}`, () => assert.deepEqual(fn(...a), b));

describe('basic', () => {
  it('hc(div, {}, [hi])', () => {
    const h = td.function();
    const hc = hyperchain(h);
    hc('div', {}, ['hi']);
    td.verify(h('div', {}, ['hi']));
  });
});

describe('tags', () => {
  it('hc.div(hi)', () => {
    const h = td.function();
    const hc = hyperchain(h);
    hc.div('hi');
    td.verify(h('div', {}, ['hi']));
  });
  it('hc.div`hi`', () => {
    const h = td.function();
    const hc = hyperchain(h);
    hc.div `hi`;
    td.verify(h('div', {}, ['hi']));
  });
  it('hc.div({props}, [hi])', () => {
    const h = td.function();
    const hc = hyperchain(h);
    hc.div({ props: 'props' }, ['hi']);
    td.verify(h('div', { props: 'props' }, ['hi']));
  });
  it('hc.div({props}, hi)', () => {
    const h = td.function();
    const hc = hyperchain(h);
    hc.div({ props: 'props' }, 'hi');
    td.verify(h('div', { props: 'props' }, ['hi']));
  });
});

describe('classes', () => {
  it('hc.div.class`hi`', () => {
    const h = td.function();
    const hc = hyperchain(h);
    hc.div.class `hi`;
    td.verify(h('div', { class: 'class' }, ['hi']));
  });
  it('hc.div.some.class`hi`', () => {
    const h = td.function();
    const hc = hyperchain(h);
    hc.div.some.class `hi`;
    td.verify(h('div', { class: 'some class' }, ['hi']));
  });
});


describe('attrs', () => {
  it('hc.div.id(id)`hi`', () => {
    const h = td.function();
    const hc = hyperchain(h);
    hc.div.id('id')
    `hi`;
    td.verify(h('div', { id: 'id' }, ['hi']));
  });
  it('hc.div.id(id).id(id2)`hi`', () => {
    const h = td.function();
    const hc = hyperchain(h);
    hc.div.id('id').id('id2')
    `hi`;
    td.verify(h('div', { id: 'id2' }, ['hi']));
  });
});



describe('separation', () => {
  it('...', () => {
    const h = td.function();
    const hc = hyperchain(h);
    const { div } = hc;
    div.class `hi`;
    div.class2 `hi`;
    td.verify(h('div', { class: 'class' }, ['hi']));
    td.verify(h('div', { class: 'class2' }, ['hi']));
  });
});


describe('nesting', () => {
  it('classes', () => {
    const h = td.function();
    const hc = hyperchain(h);
    const { div } = hc;
    const base = div.base
    const a = base.a
    const b = base.b
    a `a`
    b `b`
    td.verify(h('div', { class: 'base a' }, ['a']));
    td.verify(h('div', { class: 'base b' }, ['b']));
  });
});

describe('opts.mergeDeep', () => {
  it('should', () => {
    const h = td.function();
    const hc = hyperchain(h);
    hc.div.style({ a: 1 }).style({ b: 2 })
    `hi`;
    td.verify(h('div', { style: { a: 1, b: 2 } }, ['hi']));
  });
  it('shouldnt', () => {
    const h = td.function();
    const hc = hyperchain(h, { mergeDeep: false });
    hc.div.style({ a: 1 }).style({ b: 2 })
    `hi`;
    td.verify(h('div', { style: { b: 2 } }, ['hi']));
  });
});


describe('children', () => {
  it('hc.div(a, b)', () => {
    const h = td.function();
    const hc = hyperchain(h);
    hc.div('a', 'b');
    td.verify(h('div', {}, ['a', 'b']));
  });
  it('hc.div(hc.div(a), hc.div(b))', () => {
    const t1 = td.function();
    const t2 = td.function();
    const t3 = td.function();
    const h1 = hyperchain(t1);
    const h2 = hyperchain(t2);
    const h3 = hyperchain(t3);
    td.when(t2('div', {}, ['2'])).thenReturn('2');
    td.when(t3('div', {}, ['3'])).thenReturn('3');

    h1.div(h2.div `2`, h3.div `3`);

    td.verify(t1('div', {}, ['2', '3', ]));
  });
  it('hc.div(hc.div(a))', () => {
    const t1 = td.function();
    const t2 = td.function();
    const h1 = hyperchain(t1);
    const h2 = hyperchain(t2);
    td.when(t2('div', {}, ['2'])).thenReturn('2');

    h1.div(h2.div `2`);

    td.verify(t1('div', {}, ['2']));
  });
  it('hc.div.class(hc.div(a))', () => {
    const t1 = td.function();
    const t2 = td.function();
    const h1 = hyperchain(t1);
    const h2 = hyperchain(t2);
    const t2r = { t: 2 };
    td.when(t2('div', { class: 'class2' }, ['2'])).thenReturn(t2r);
    h1.div.class1(h2.div.class2 `2`);
    td.verify(t1('div', { class: 'class1' }, [t2r]));
  });
});










describe('opts.style', () => {
  it('hc.div.class.id(id)`hi`', () => {
    const h = td.function();
    const hc = hyperchain(h, { style: { a: 'aa' } });
    hc.div.a `hi`;
    td.verify(h('div', { class: 'a aa' }, ['hi']));
  });
});





describe('full', () => {
  it('hc.div.class.id(id)`hi`', () => {
    const h = td.function();
    const hc = hyperchain(h);
    hc.div.class.id('id')
    `hi`;
    td.verify(h('div', { class: 'class', id: 'id' }, ['hi']));
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
  describe('getPropsAndChildren', () => {
    it('throws on empty', () => assert.throws(_.getPropsAndChildren, /array/));
    itDeepEqual(_.getPropsAndChildren, [
      []
    ], { props: {}, children: [] });
    itDeepEqual(_.getPropsAndChildren, [
      [{},
        []
      ]
    ], { props: {}, children: [] });
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
  describe('isTTL', () => {
    it('throws on empty', () => assert.throws(_.isTTL));
    it('(args)`` is', () => ((...args) => assert(_.isTTL(args)))
      ``);
    it(`[...] isn't`, () => assert(!_.isTTL(['string', 'k', 'e', 'y', 's'])));
  });
  describe('parseTTL', () => {
    it('throws on empty', () => assert.throws(_.parseTTL));
    it('`Hello ${world}!` = Hello world!', () => ((...args) => assert.equal(_.parseTTL(args), 'Hello world!'))
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
