# hyperterse

Like [hyperscript] (+[helpers]) but even terser using [Tagged Template Literals], [method chaining], and [ES6 Proxy].

<small>**Use only where ES6 ([template-literals][template-literals-support], [proxy][proxy-support]) supported.**</small>

[hyperscript]: https://github.com/dominictarr/hyperscript
[helpers]: https://www.npmjs.com/package/hyperscript-helpers

[Tagged Template Literals]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals
[template-literals-support]: http://caniuse.com/#feat=template-literals

[ES6 Proxy]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[proxy-support]: http://caniuse.com/proxy

[method chaining]: https://schier.co/blog/2013/11/14/method-chaining-in-javascript.html

## Install

```sh
npm i hyperterse
```

## Usage

Include:

```js
import {createElement} from 'react'
import hyperterse from 'hyperterse'

const h = hyperterse(createElement)

const {div, span} = h
```
or with helpers (available: react, preact)
```js
import h, { div, span } from  'hyperterse/react'
```

Usage:

```js
const { div, span } = require('hyperterse/react')

// Template literals define innerText
div`Hello World!`            // => <div>Hello World!</div>
// .properties define classes
div.someClass`Hello World!`  // => <div class="someClass">…
div.some.class`Hello World!` // => <div class="some class">…
```

```js
const h = require('hyperterse/react')
h.div`Hello World!`
```
```js
h.div`hi`
  // chained .propertyFunctions() define attributes
  .id('box')
  .onclick(e => alert('Hi!'))
  .style({color: 'blue'})
```
```js
h.table(
  // first-level function defines children
  h.thead(
    h.tr(h.th`Header 1`, h.th`Header 2`, h.th`Header 3`)
  )
  h.tbody(
    h.tr(h.td`Column 1`, h.td`Row 1`, h.td`Column 3`)
    h.tr(h.td`Column 1`, h.td`Row 2`, h.td`Column 3`)
  )
)
```

## Libraries used

* **[shackles]** for [method chaining]

[shackles]: https://github.com/raineorshine/shackles
