# hyperchain

An extremely terse syntax for [hyperscript]. Like [hyperscript]\(+[helpers]) but on steroids, using [Tagged Template Literals] and [ES6 Proxy] [method chaining].

<small>**Use only where ES6 ([template-literals][template-literals-support], [proxy][proxy-support]) are available.** </small>

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

Include:

```js
import {createElement} from 'react'
import hyperchain from 'hyperchain'

const h = hyperchain(createElement)

const {div, span} = h
```
or with helpers (available: react, preact)
```js
import h, { div, span } from  'hyperchain/react'
```

Usage:

```js
h.div`Hello World!`
```
```js
// Template literals define innerText
div`Hello World!`            // => <div>Hello World!</div>
// .properties define classes
div.someClass`Hello World!`  // => <div class="someClass">…
div.some.class`Hello World!` // => <div class="some class">…
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

## Libraries used

* **[chain-anything]** for ES6 [chain-anything]

[chain-anything]: https://github.com/laggingreflex/chain-anything
