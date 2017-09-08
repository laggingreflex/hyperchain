# hyperchain

An extremely terse syntax for [hyperscript].

[hyperscript]\(+[helpers]) on steroids!

<small>**Uses ES6 features, use only where supported ([template-literals][template-literals-support], [proxy][proxy-support])** </small>

[hyperscript]: https://github.com/dominictarr/hyperscript
[helpers]: https://www.npmjs.com/package/hyperscript-helpers

[Tagged Template Literals]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals
[template-literals-support]: http://caniuse.com/#feat=template-literals

[ES6 Proxy]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[proxy-support]: http://caniuse.com/proxy

[method chaining]: https://schier.co/blog/2013/11/14/method-chaining-in-javascript.html

## Install

```sh
npm i hyperchain
```

## Usage

### Include

```js
import { createElement } from 'react'
import hyperchain from 'hyperchain'

const h = hyperchain(createElement, opts)
// or
const {div, span} = hyperchain(createElement, opts);
```
or with helpers (available: react, preact)
```js
const { div, span } =  require('hyperchain/react')(opts)
const { div, span } =  require('hyperchain/preact')(opts)
```

### API

```js
hyperchain(h).tagName[...classes][...attributes()]`innerText`
hyperchain(h).tagName[...classes][...attributes()](...children)
```

### Examples

```js
h.div`Hello World!`
```
```js
// Template literals define innerText
div`Hello World!`            // => <div>Hello World!</div>
// .properties define classes
div.class`Hello World!`      // => <div class="class">…
div.some.class`Hello World!` // => <div class="some class">…
div.someClass`Hello World!`  // => <div class="someClass">…
// with hyperchain(..., {dashifyClassnames: true})
div.someClass`Hello World!`  // => <div class="some-class">…
```

```js
h.div
  // chained .propertyFunctions() define attributes
  .id('box')
  .onclick(e => alert('Hi!'))
  .style({color: 'blue'})
  `Hello world!`
```
```js
// reusable & composable
const div = h.div.baseClass.style({background: 'yellow'})
const divRed = div.red.style({color: 'red'})
const divBlue = div.blue.style({color: 'blue'})
divRed`red text`    // => h('div', {class: ['base', 'red'], style: {background: 'yellow', color: 'red'}}, ['red text'])
divBlue`blue text`  // => h('div', {class: ['base', 'blue'], style: {background: 'yellow', color: 'blue'}}, ['blue text'])
```
```js
table(
  // first-level function defines children
  thead(
    tr(th`Header 1`, th`Header 2`, th`Header 3`)
  )
  tbody(
    tr(td`Column 1`, td`Row 1`, td`Column 3`)
    tr(td`Column 1`, td`Row 2`, td`Column 3`)
  )
)
```
