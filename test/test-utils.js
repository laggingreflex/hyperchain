const t = exports;

// it(`a=>b` () => assert.deepEqual( fn(...a), b ))
t.itDeepEqual = (fn, a, b) => it(`${a.map(_=>JSON.stringify(_))} => ${JSON.stringify(b)}`, () => assert.deepEqual(fn(...a), b));
