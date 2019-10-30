import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app/layout/App'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter } from 'react-router-dom'

// ReactDOM.render(<App />, document.getElementById('root'))

const rootEl = document.getElementById('root')

const render = () => {
  ReactDOM.render(
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  , rootEl)
}

if (module.hot) {
  module.hot.accept('./app/layout/App', ()=> {
    setTimeout(render)
  })
}

render()

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
