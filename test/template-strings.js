describe('template strings', () => {
  it('h.div`Hello ${World}!`', (done) => {
    const h = hyperchain((tagName, props, children) => {
      assert.equal(tagName, 'div');
      assert.deepEqual(props, {});
      assert.deepEqual(children, ['Hello World!']);
      done();
    });
    h.div `Hello ${'World'}!`;
  });
});
