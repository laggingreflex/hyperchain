const _ = require('../utils');
const t = require('./test-utils');

 describe('utils', () => {
  describe('arrify', () => {
    t.itDeepEqual(_.arrify, [], []);
    t.itDeepEqual(_.arrify, [''], []);
    t.itDeepEqual(_.arrify, [['']], ['']);
    t.itDeepEqual(_.arrify, [[]], []);
  });
  describe('arrifyClass', () => {
    t.itDeepEqual(_.arrifyClass, [], []);
    t.itDeepEqual(_.arrifyClass, [''], []);
    t.itDeepEqual(_.arrifyClass, [['']], ['']);
    t.itDeepEqual(_.arrifyClass, [[]], []);
    t.itDeepEqual(_.arrifyClass, ['a b'], ['a', 'b']);
  });
  describe('getPropsAndChildren', () => {
    it('throws on empty', () => assert.throws(_.getPropsAndChildren, /array/));
    t.itDeepEqual(_.getPropsAndChildren, [[]], { props: {}, children: [] });
    t.itDeepEqual(_.getPropsAndChildren, [[{}, []]], { props: {}, children: [] });
    t.itDeepEqual(_.getPropsAndChildren, [[[],{}]], { props: {}, children: [] });
    t.itDeepEqual(_.getPropsAndChildren, [[[]]], { props: {}, children: [] });
    t.itDeepEqual(_.getPropsAndChildren, [[{}]], { props: {}, children: [] });
    t.itDeepEqual(_.getPropsAndChildren, [['hi']], { props: {}, children: ['hi'] });
    t.itDeepEqual(_.getPropsAndChildren, [[['hi']]], { props: {}, children: ['hi'] });
    t.itDeepEqual(_.getPropsAndChildren, [[{},['hi']]], { props: {}, children: ['hi'] });
  });
  describe('isTTL', () => {
    it('throws on empty', () => assert.throws(_.isTTL));
    it('(args)`` is', () => ((...args) => assert(_.isTTL(args)))``);
    it(`[...] isn't`, () => assert(!_.isTTL(['string', 'k', 'e', 'y', 's'])));
  });
  describe('parseTTL', () => {
    it('throws on empty', () => assert.throws(_.parseTTL));
    it('`Hello ${world}!` = Hello world!', () => ((...args) => assert.equal(_.parseTTL(args), 'Hello world!'))`Hello ${'world'}!`);
  });
  describe('mergeProps', () => {
    // t.itDeepEqual(_.mergeProps, [], {});
    t.itDeepEqual(_.mergeProps, [{a:1}, {b:2}], {a:1, b:2});
    t.itDeepEqual(_.mergeProps, [{a:1}, {a:2}], {a:2});
    t.itDeepEqual(_.mergeProps, [{class:'a'}, {class:'b'}], {class:['a', 'b']});
    t.itDeepEqual(_.mergeProps, [{class:'a'}, {class:['b']}], {class:['a', 'b']});
    t.itDeepEqual(_.mergeProps, [{class:['a']}, {class:'b'}], {class:['a', 'b']});
    t.itDeepEqual(_.mergeProps, [{class:['a']}, {class:['b']}], {class:['a', 'b']});
    it('modifies original', () => {
      const a = {a:1};
      _.mergeProps(a, { b: 2 });
      assert.deepEqual(a, { a: 1, b: 2 });
    })
  });
});
