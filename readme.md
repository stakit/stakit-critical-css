# stakit-critical-css

Stakit transform to inline critical, [`csso`](https://github.com/css/csso) optimized CSS using [`dropcss`](https://github.com/leeoniya/dropcss).

## Installation
```
npm i stakit-critical-css
```

## Usage
```javascript
var stakit = require('stakit')
var inlineCriticalCSS = require('stakit-critical-css')

var app = require('.')

stakit()
  .use(stakit.copy([ 'style.css' ])) // or get it from stakit-postcss
  .transform(inlineCriticalCSS, { src: 'style.css' })
  .output()
```

## API
### stakitCriticalCSS(opts)
Concats the stream of the file at `opts.src` and uses that as the raw CSS. Returns a `hstream` transform that prepends the optimized critical CSS to the head in a `<style>` tag.
