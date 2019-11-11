import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app/layout/App'
import ReduxToastr from 'react-redux-toastr'
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import * as serviceWorker from './serviceWorker'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from './app/store/configureStore'
import ScrollToTop from './app/common/util/ScrollToTop'
// import { loadEvents } from './features/event/eventActions'

const store = configureStore()
// store.dispatch(loadEvents())

const rootEl = document.getElementById('root')
const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <HashRouter>
        <ScrollToTop>
          <ReduxToastr
            position='bottom-right'
            transitionIn='fadeIn'
            transitionOut='fadeOut'
           />
           <App/>
        </ScrollToTop>
      </HashRouter>      
    </Provider>
  , rootEl)
}

if (module.hot) {
  module.hot.accept('./app/layout/App', ()=> {
    setTimeout(render)
  })
}

store.firebaseAuthIsReady.then(()=>{
  render()  
})


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
