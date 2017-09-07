describe('children', () => {
  it('div()', (done) => {
    const { div } = hyperchain((tagName, props, children) => {
      assert.equal(tagName, 'div');
      assert.deepEqual(props, { id: 'id' });
      assert.deepEqual(children, ['Hello World!']);
      done();
    });
    div.id('id')
    `Hello World!`
  });
});
