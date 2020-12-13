import { transform } from 'https://cdn.skypack.dev/@babel/standalone'

import { editor } from './monacoEditor.js'
import { createEl, debounce, getEl } from './utility.js'

const editorEl = getEl('editor')
const outputEl = getEl('output')
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
  const { code: babelCode } = transform(codeToTranspile, options)

  // ignore /*#__PURE__*/ from transpiled output
  const transpiledCode = format(babelCode, stringMatchRegex)

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

        .app a {
          color: wheat;
        }
      </style>
    </head>
    <body>
      <div id="app"></div>

      <script src="https://cdn.skypack.dev/@babel/standalone" type="module"><\/script>
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
