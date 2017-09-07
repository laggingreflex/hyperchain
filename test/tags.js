describe('tags', () => {
  it('h.div`Hello World!`', (done) => {
    const h = hyperchain((tagName, props, children) => {
      assert.equal(tagName, 'div');
      assert.deepEqual(props, {});
      assert.deepEqual(children, ['Hello World!']);
      done();
    });
    h.div `Hello World!`;
  });
  it('div`Hello World!`', (done) => {
    const { div } = hyperchain((tagName, props, children) => {
      assert.equal(tagName, 'div');
      assert.equal(children[0], 'Hello World!');
      done();
    });
    div `Hello World!`;
  });
  it('div`Hello ${World}!`', (done) => {
    const { div } = hyperchain((tagName, props, children) => {
      assert.equal(tagName, 'div');
      assert.equal(children[0], 'Hello World!');
      done();
    });
    div `Hello ${'World'}!`;
  });
});
