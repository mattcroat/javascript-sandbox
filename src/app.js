import { editor } from './monacoEditor.js'
import { createEl, debounce, getEl } from './utility.js'

const iframeEl = getEl('iframe')
const errorsEl = getEl('errors')

const editorEl = getEl('editor')
const sourceEl = getEl('source')

const importsMatchRegex = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*/g
const stringMatchRegex = /\/\*#__PURE__\*\//g

function getCode() {
  return editor.getValue()
}

function format(string, regex, replacement = '') {
  return string.replace(regex, replacement).trim()
}

function transpileCode(code) {
  // ignore imports to reduce output noise
  const codeToTranspile = format(code, importsMatchRegex)

  // the magic sauce used to transpile the code
  const options = { presets: ['es2015-loose', 'react'] }
  const { code: babelCode } = window.Babel(codeToTranspile, options)

  // ignore /*#__PURE__*/ from transpiled output
  const transpiledCode = format(babelCode, stringMatchRegex)

  sourceEl.innerHTML = ''

  const titleEl = createEl('h3', '📜 Source')
  const preEl = createEl('pre', transpiledCode)

  sourceEl.append(titleEl, preEl)
}

function logErrors(error) {
  errorsEl.innerHTML = ''

  iframeEl.classList.add('hidden')
  errorsEl.classList.remove('hidden')

  const titleEl = createEl('h3', '💩 Oops!')
  const preEl = createEl('pre', error)

  errorsEl.append(titleEl, preEl)
}

function setIframeContent(code) {
  iframeEl.classList.remove('hidden')
  errorsEl.classList.add('hidden')

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

        .app a {
          color: wheat;
        }
      </style>
    </head>
    <body>
      <div id="app"></div>

      <script src="https://unpkg.com/@babel/standalone/babel.min.js" type="module"></script>
      <script>
        function handleError({ message: errorMessage }) {
          window.parent.postMessage(errorMessage, '*')
        }

        window.addEventListener('error', handleError)
      </script>
      <script type="text/babel" data-type="module">
        ${code}
      </script>
    </body>
    </html>
  `

  iframeEl.srcdoc = source
}

function updateUI() {
  const code = getCode()

  setIframeContent(code)
  transpileCode(code)
}

function handleKeyUp() {
  updateUI()
}

function handleMessage({ data: errorMessage }) {
  if (typeof errorMessage === 'string') {
    logErrors(errorMessage)
  }
}

editorEl.addEventListener('keyup', debounce(handleKeyUp, 1000))
window.addEventListener('message', handleMessage)

updateUI()
