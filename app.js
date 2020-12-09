import { createEl, debounce, getEl } from './utility.js'

const textareaEl = getEl('textarea')
const iframeEl = getEl('iframe')
const transpiledEl = getEl('transpiled')
const errorsEl = getEl('errors')

function getCode(el) {
  return {
    code: el.value.trim(),
  }
}

function transpileCode(code) {
  const options = { presets: ['react'] }
  const { code: babelCode } = Babel.transform(code, options)

  const transpiledCode = babelCode.replace(/\/\*#__PURE__\*\//g, '')

  transpiledEl.innerHTML = ''

  const titleEl = createEl('h3', 'JSX Output')
  const preEl = createEl('pre', transpiledCode)
  transpiledEl.append(titleEl, preEl)
}

function logErrors(e) {
  errorsEl.innerHTML = ''

  const titleEl = createEl('h3', 'Errors')
  const preEl = createEl('pre', e.message)

  errorsEl.append(titleEl, preEl)
}

function setIframeContent(iframe, code) {
  const source = `
    <html>
    <head>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          font-size: 1.25rem;
          padding: 2rem;
          color: snow;
        }

        h1, p {
          margin: 1rem 0;
        }
      </style>
    </head>
    <body>
      <div id="app"></div>

      <script src="https://unpkg.com/react@17/umd/react.development.js"><\/script>
      <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"><\/script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
      <script type="text/babel">
        ${code}
      <\/script>
    </body>
    </html>
  `

  iframe.srcdoc = source
}

function updateUI() {
  const { code } = getCode(textareaEl)

  setIframeContent(iframeEl, code)
  transpileCode(code)
}

function handleKeyUp() {
  updateUI()
}

textareaEl.addEventListener('keyup', debounce(handleKeyUp, 1000))
window.addEventListener('error', logErrors)

updateUI()
