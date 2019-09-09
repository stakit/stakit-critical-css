/*

very heavily inspired by
https://github.com/jallajs/jalla/blob/master/lib/document.js#L154
thanks tornqvist

*/

var through = require('through2')
var dropcss = require('dropcss')
var { minify } = require('csso')
var hstream = require('hstream')
var { Readable } = require('readable-stream')
var svr = require('stream-value-reader')

var getStyle = null
var _lastIndex = 0 // small and dummy cache

module.exports = function (ctx) {
  var html = ''

  return function (opts) {
    opts = Object.assign({
      src: '/bundles/bundle.css'
    }, opts)

    // find stream for opts.src
    var index = -1
    if (ctx._files[_lastIndex].destination === opts.src) {
      index = _lastIndex
    } else {
      for (var i = 0; i < ctx._files.length && index === -1; i++) {
        if (ctx._files[i].destination === opts.src) {
          index = i
        }
      }
    }

    if (!getStyle) {
      getStyle = svr(ctx._files[index].stream, { encoding: 'string' })
    }

    return through(collectHTML, composeHTML)
  }

  function collectHTML (chunk, enc, cb) {
    html += chunk
    cb(null)
  }

  function composeHTML (done) {
    var res = ''
    var self = this

    getStyle().then(function (css) {
      var critical = dropcss({ html: html, css: css })
      var minified = minify(critical.css).css

      var prepend = hstream({
        head: {
          _prependHtml: `<style>${minified}</style>`
        }
      })
      var stream = new Readable()
      stream._read = Function.prototype

      // pipe the collected html through hstream forwarding to self
      stream.pipe(prepend).pipe(through(write, end))
      stream.push(html)
      stream.push(null)
    })

    // collect the resulting html with inlined CSS
    function write (chunk, enc, cb) {
      res += chunk
      cb(null, chunk)
    }

    // resolve self with the complete HTML (with inlined CSS)
    function end (cb) {
      self.push(res)
      cb()
      done()
    }
  }
}
