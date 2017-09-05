describe('classes', () => {
  it('div.someClass`Hello World!`', (done) => {
    const { div } = hyperterse((tagName, props, children) => {
      assert.equal(tagName, 'div');
      assert.deepEqual(props, { class: ['someClass'] });
      assert.deepEqual(children, ['Hello World!']);
      done();
    });
    div.someClass `Hello World!`;
  });
  it('div.some.class`Hello World!`', (done) => {
    const { div } = hyperterse((tagName, props, children) => {
      assert.equal(tagName, 'div');
      assert.deepEqual(props, { class: ['some', 'class'] });
      assert.deepEqual(children, ['Hello World!']);
      done();
    });
    div.some.class `Hello World!`;
  });
  it('div.some.other.class`Hello World!`', (done) => {
    const { div } = hyperterse((tagName, props, children) => {
      assert.equal(tagName, 'div');
      assert.deepEqual(props, { class: ['some', 'other', 'class'] });
      assert.deepEqual(children, ['Hello World!']);
      done();
    });
    div.some.other.class `Hello World!`;
  });
});
