describe('chaining', () => {
  it('div.id(id)`Hello World!`', (done) => {
    const { div } = hyperchain((tagName, props, children) => {
      assert.equal(tagName, 'div');
      assert.deepEqual(props, { id: 'id' });
      assert.deepEqual(children, ['Hello World!']);
      done();
    });
    div.id('id')
    `Hello World!`
  });
  it('div.class1.id(id).class2.prop(prop)`Hello World!`', (done) => {
    const { div } = hyperchain((tagName, props, children) => {
      assert.equal(tagName, 'div');
      assert.deepEqual(props, { id: 'id', prop: 'prop', class: ['class1', 'class2'] });
      assert.deepEqual(children, ['Hello World!']);
      done();
    });
    div.class1.id('id').class2.prop('prop')
    `Hello World!`
  });
});
