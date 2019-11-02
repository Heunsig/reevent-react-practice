import {
  ASYNC_ACTION_START,
  ASYNC_ACTION_FINISH,
  ASYNC_ACTION_ERROR
} from './asyncConstants'

import { createReducer } from '../../app/common/util/reducerUtils'

const initialState = {
  loading: false,
  elementName: null
}

const aysncActionStarted = (state, payload) => {
  return {
    ...state,
    loading: true,
    elementName: payload
  }
}
const aysncActionFinished = (state) => {
  return {
    ...state,
    loading: false,
    elementName: null
  }
}


const aysncActionError = (state) => {
  return {
    ...state,
    loading: false,
    elementName: null
  }
}

export default createReducer(initialState, {
  [ASYNC_ACTION_START]: aysncActionStarted,
  [ASYNC_ACTION_FINISH]: aysncActionFinished,
  [ASYNC_ACTION_ERROR]: aysncActionError
})