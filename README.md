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
// or with helpers (available: react, preact)
const h =  require('hyperchain/react')(opts)
const h =  require('hyperchain/preact')(opts)
```

```js
h.div('hi')          // => <div> hi </div>
h.span('hi')         // => <span> hi </span>
h.p('a', 'b')        // => <p> a b </p>
h.h1({id:'h'}, 'a')  // => <h1 id="h"> b </h1>
h.span`hi`           // => <span> hi </span>
h.p`1 ${h.em`2`}`    // => <p>1 <em>2</em></p>
h.div.class('a')     // => <div class="class"> a </div>
h.div.class`a`       // => <div class="class"> a </div>
h.div.some.class()   // => <div class="some class">
h.div.someClass()    // => <div class="someClass">
h.div.someClass()    // => <div class="some-class">   (opts.dashifyClassnames: true)
h.div()              // => <div class="div">          (opts.tagClass: true)
h.div.CSS()          // => <div class="MODULES">      (opts.style: {CSS:'MODULES'})
h.div(1, 0, null, 2) // => <div> 1 2 </div>           (opts.filterFalseyChildren: true)
```


### API

```js
hyperchain(createElement, options)
```

* **`createElement`** `[function]` JSX/hyperscript reviver function
* **`options`** `[object]`

  * **`style`** `[object]` Uses [CSS Modules]-compatible styles object to add appropriate classnames. See [hyperstyles]
  * **`stylePreserveNames`** `[object]` Preserves original classnames in addition to CSS Module names replaced by `opts.style`
  * **`dashifyClassnames`** `[boolean]` Turns `.className` to `class-name`
  * **`tagClass`** `[boolean]` Adds tag-name as an additional class-name (which is also `opts.style` aware)
  * **`filterFalseyChildren`** `[boolean]` Filters out [falsey] children
  * **`elementMapMap`** `[object]` Map tagNames or components to something else
  * **`keyMap`** `[object]` Map keys/attrs to something else

```js
h.tagName[...className]`innerText`
h.tagName[...className](...children)
h.tagName[...className]({...props}, ...children)
```

* **`tagName`** `[string]` Tag name to use, eg. `.div`
* **`className`** `[string]` Class name to use, eg. `.someClass`
* **`children`** `[array]` Child nodes
* **`props`** `[object]` Attributes to set as an object, eg. `{id: …}`


[dashify]: https://github.com/jonschlinkert/dashify
[deepmerge]: https://github.com/KyleAMathews/deepmerge
[ority]: https://github.com/laggingreflex/ority
[proxy-assign]: https://github.com/laggingreflex/proxy-assign
[falsey]: https://developer.mozilla.org/en-US/docs/Glossary/Falsy
[flat]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
