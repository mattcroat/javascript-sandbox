import { editor } from './monacoEditor.js'
import { createEl, debounce, getEl } from './utility.js'

const editorEl = getEl('editor')
const outputEl = getEl('output')
const sourceEl = getEl('source')

function getCode() {
  return editor.getValue()
}

function transpileCode(code) {
  const options = { presets: ['es2015-loose', 'react'] }
  const { code: babelCode } = Babel.transform(code, options)

  const transpiledCode = babelCode.replace(/\/\*#__PURE__\*\//g, '')

  sourceEl.innerHTML = ''

  const titleEl = createEl('h3', '📜 Source')
  const preEl = createEl('pre', transpiledCode)
  sourceEl.append(titleEl, preEl)
}

function logErrors(e) {
  outputEl.innerHTML = ''

  const errorsEl = createEl('div')
  errorsEl.classList.add('errors')

  const titleEl = createEl('h3', '💩 Oops!')
  const preEl = createEl('pre', e.message)

  errorsEl.append(titleEl, preEl)
  outputEl.append(errorsEl)
}

function setIframeContent(code) {
  const source = `
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

        body {
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        .app {
          padding: 0 2rem;
          color: snow;
        }
      </style>
    </head>
    <body>
      <div id="app"></div>

      <script src="https://unpkg.com/react@17/umd/react.development.js"><\/script>
      <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"><\/script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
      <script type="text/babel" data-type="module">
        ${code}
      <\/script>
    </body>
    </html>
  `

  outputEl.innerHTML = ''

  const iframeEl = createEl('iframe')
  iframeEl.srcdoc = source

  outputEl.append(iframeEl)
}

function updateUI() {
  const code = getCode()

  setIframeContent(code)
  transpileCode(code)
}

function handleKeyUp() {
  updateUI()
}

editorEl.addEventListener('keyup', debounce(handleKeyUp, 1000))
window.addEventListener('error', logErrors)

updateUI()
