var choo = require('choo')
var html = require('choo/html')

var app = choo()

app.route('/', function (state, emit) {
  return html`
    <body>
      <div class="a b">
        <h1 class="d">HELLOW</h1>
      </div>
    </body>
  `
})

app.route('/about', function (state, emit) {
  return html`
    <body>
      no css
    </body>
  `
})

module.exports = app.mount('body')
