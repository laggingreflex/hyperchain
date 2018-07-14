# hyperchain
[![npm](https://img.shields.io/npm/v/hyperchain.svg)](https://www.npmjs.com/package/hyperchain)

[hyperscript]-like DOM builder with chaining, composition, and reusability. Inspired by [hyperscript-helpers].

## Features

* Property chaining sets tag-name and class-names

* Template literals sets innerText

* Compose and reuse components (like [styled-components])

* Apply [CSS Modules] (like [hyperstyles])

<small>**Note: Uses ES6 features ([Proxy][proxy-support], [Tagged Template Literals][ttl-support]), use only where browser/env supports it.** </small>

[hyperscript]: https://github.com/dominictarr/hyperscript
[hyperscript-helpers]: https://www.npmjs.com/package/hyperscript-helpers

[Proxy]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[proxy-support]: http://caniuse.com/proxy

[Tagged Template Literals]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals
[ttl-support]: http://caniuse.com/#feat=template-literals

[method chaining]: https://schier.co/blog/2013/11/14/method-chaining-in-javascript.html

[CSS Modules]: https://github.com/css-modules/css-modules
[hyperstyles]: https://github.com/colingourlay/hyperstyles

[styled-components]: https://github.com/styled-components/styled-components

## Install

```sh
npm i hyperchain
```

## Usage

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
hyperchain(createElement, options)
```

* **`createElement`** `[function]` JSX/hyperscript reviver function
* **`options`** `[object]`

  * **`style`** `[object]` Uses [CSS Modules]-compatible styles object to add appropriate classnames. See [hyperstyles]
  * **`dashifyClassnames`** `[boolean]` Turns `.className` to `class-name`
  * **`tagClass`** `[boolean]` Adds tag-name as an additional class-name (which is also `opts.style` aware)
  * **`filterFalseyChildren`** `[boolean]` Filters out [falsey] children
  * **`flatChildren`** `[boolean]` [Flat]tens children array(s)

```js
h.tagName[...className]`innerText`
h.tagName[...className](...children)
h.tagName[...className]({...props}, [...children])
```

* **`tagName`** `[string]` Tag name to use, eg. `.div`
* **`className`** `[string]` Class name to use, eg. `.someClass`
* **`children`** `[array]` Child nodes
* **`props`** `[object]` Attributes to set as an object, eg. `{id: …}`


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
// reusable components
const yellowBase = h.div.base.style({background: 'yellow'})

const redText = yellowBase.red.style({color: 'red'})
redText `red text`
// <div
//   class="base red"
//   style="background:yellow; color:red"
// >
//   red text
// </div>

const boldText = yellowBase.bold.style({fontWeight: 'bold'})
boldText `bold text`
// <div
//   class="base bold"
//   style="background:yellow; font-weight:bold"
// >
//   bold text
// </div>
```

## Libraries used


* **[dashify]** to dashify classNames
* **[deepmerge]** to merge props
* **[ority]** to infer arguments better
* **[proxy-assign]** to merge options with defaults

[dashify]: https://github.com/jonschlinkert/dashify
[deepmerge]: https://github.com/KyleAMathews/deepmerge
[ority]: https://github.com/laggingreflex/ority
[proxy-assign]: https://github.com/laggingreflex/proxy-assign
[falsey]: https://developer.mozilla.org/en-US/docs/Glossary/Falsy
[flat]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
