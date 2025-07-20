import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import Editor from './components/Editor'; 
import js from '@eslint/js';
import './App.css';
import Split from 'react-split';

import useLocalStorage from './hook/useLocalSorage';
function App() {
  const [html,setHtml]=useLocalStorage('html','')
  const [css,setCss]=useLocalStorage('css','')
  const [js,setJs]=useLocalStorage('js','')
  const [srcDoc,setSrcDoc]=useState('')

  useEffect(() => {
  const timeout = setTimeout(() => {
    setSrcDoc(`
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            ${js}
          </script>
        </body>
      </html>
    `);
  }, 250);

  return () => clearTimeout(timeout);
}, [html, css, js]); 

  return (
    <>
    <Split
  direction="vertical"
  className="split"
>
  <div className="pane top-pane">
    <Editor language="html" displayName="HTML" value={html} onChange={setHtml} />
    <Editor language="css" displayName="CSS" value={css} onChange={setCss} />
    <Editor language="javascript" displayName="JS" value={js} onChange={setJs} />
  </div>

  <div className="pane">
    <iframe
      srcDoc={srcDoc}
      title="output"
      sandbox="allow-scripts"
      width="100%"
      height="100%"
    />
  </div>
</Split>

    </>
  );
}

export default App;
