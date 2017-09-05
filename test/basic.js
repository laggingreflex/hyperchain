describe('basic', () => {
  it('should return a function that calls the original function', (done) => {
    const h = hyperterse(() => done());
    h();
  })
});
