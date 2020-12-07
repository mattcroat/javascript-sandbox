const getEl = (id) => document.getElementById(id)

const iframeEl = getEl('iframe')
const textareaEl = getEl('textarea')

function debounce(callback, delay) {
  let timerId

  return () => {
    clearTimeout(timerId)
    timerId = setTimeout(callback, delay)
  }
}

function setIframeContent() {
  const js = textareaEl.value.trim()
  const code = JSON.stringify(js)

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
          color: snow;
        }

        #app {
          padding: 2rem;
          margin-bottom: 2rem;
        }

        h1, h2, p {
          margin: 1rem 0;
        }

        #output {
          font-size: 1rem;
          padding: 0 2rem 0 2rem;
          border-top: 1px solid hsl(220, 20%, 10%);
          line-height: 1.6;
        }

        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      </style>
    </head>
    <body>
      <div id="app"></div>

      <div id="output"></div>

      <script src="https://unpkg.com/react@17/umd/react.development.js"><\/script>
      <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"><\/script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
      <script type="text/babel">
        ${js}
      <\/script>
      <script>
        const options = { presets: ['react'] }
        const { code } = Babel.transform(${code}, options);

        const titleEl = document.createElement('h2')
        titleEl.innerText = 'JSX Output'

        const targetEl = document.getElementById('output')
        targetEl.innerHTML = '<pre>' + code.replace(/\\/\\*#__PURE__\\*\\//g, '') + '</pre>'

        targetEl.prepend(titleEl)
      <\/script>
    </body>
    </html>
  `

  iframeEl.srcdoc = source
}

textareaEl.addEventListener('keyup', debounce(setIframeContent, 1000))

setIframeContent()
