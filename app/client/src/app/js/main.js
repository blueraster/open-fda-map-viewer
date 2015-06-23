import babelPolyfill from 'babel-polyfill'
import {app as config} from 'js/config'
import {App} from 'app/app'
import React from 'react'

if (!babelPolyfill) { alert('Error: babel-polyfill could not be detected') }
let root = document.createElement('div')
root.className = config.rootClassName
document.body.appendChild(root)
React.render(<App />, root)
