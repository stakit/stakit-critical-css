var stakit = require('stakit')
var { render } = require('stakit-choo')
var testWriter = require('stakit-test-writer')
var inlineCriticalCSS = require('..')

var app = require('.')
var writer = testWriter()

var kit = stakit()
  .use(stakit.copy([ 'style.css' ]))
  .routes(() => [ '/', '/about' ])
  .render(render(app))
  .transform(inlineCriticalCSS, { src: 'style.css' })

kit.output(writer).then(function () {
  console.log(writer.get('/index.html'))
  console.log('=====================')
  console.log(writer.get('/about/index.html'))
})
