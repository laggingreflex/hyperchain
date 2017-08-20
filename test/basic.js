describe('basic', () => {

  it('should return a function that calls the original function', (done) => {
    const h = hyperterse(() => done());
    h();
  })

  it('h.div `Hello World!`', (done) => {
    const h = hyperterse((tagName, props, children) => {
      assert.equal(tagName, 'div');
      assert.equal(children[0], 'Hello World!');
      done();
    });
    h.div `Hello World!`;
  });

  it('div `Hello World!`', (done) => {
    const { div } = hyperterse((tagName, props, children) => {
      assert.equal(tagName, 'div');
      assert.equal(children[0], 'Hello World!');
      done();
    });
    div `Hello World!`;
  });

  it('div.someClass`Hello World!`', (done) => {
    const { div } = hyperterse((tagName, props, children) => {
      assert.equal(tagName, 'div');
      assert.deepEqual(props.class, ['someClass']);
      assert.equal(children[0], 'Hello World!');
      done();
    });
    div.someClass `Hello World!`;
  });

  it('div.some.class`Hello World!`', (done) => {
    const { div } = hyperterse((tagName, props, children) => {
      assert.equal(tagName, 'div');
      assert.deepEqual(props.class, ['some', 'class']);
      assert.equal(children[0], 'Hello World!');
      done();
    });
    div.some.class `Hello World!`;
  });
  it('div.some.other.class`Hello World!`', (done) => {
    const { div } = hyperterse((tagName, props, children) => {
      assert.equal(tagName, 'div');
      assert.deepEqual(props.class, ['some', 'other', 'class']);
      assert.equal(children[0], 'Hello World!');
      done();
    });
    div.some.other.class `Hello World!`;
  });

});
