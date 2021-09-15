import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/editor/contrib/inlineCompletions/ghostTextController.js'
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'
import 'monaco-editor/esm/vs/language/typescript/monaco.contribution'

import { elements } from '../../utils/dom'

const editorCode = /* html */ `
import React, { useEffect } from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'

import confetti from 'https://cdn.skypack.dev/canvas-confetti'

function App() {
  useEffect(() => confetti(), [])

  return (
    <div className="app">
      <h1>JavaScript Sandbox</h1>
      <p>
        You can use NPM packages provided by {''}
        <a href="https://www.skypack.dev/">Skypack</a>.
      </p>
      <img src="/image.gif" />
    </div>
  )
}

render(
  <App />,
  document.getElementById('app')
)`.trim()

const editorOptions = {
  value: editorCode,
  language: 'javascript',
  theme: 'vs-dark',
  automaticLayout: true,
  minimap: {
    enabled: false,
  },
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: 16,
  tabSize: 2,
}

const monacoEditor = monaco.editor.create(elements.editor, editorOptions)
export { monacoEditor as default }
