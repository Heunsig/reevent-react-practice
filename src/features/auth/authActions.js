import { LOGIN_USER, SIGN_OUT_USER } from './authConstatns'
import { closeModal } from '../modals/modalActions'

export const login = (creds) => {
  return dispatch => {
    dispatch({ 
      type: LOGIN_USER,
      payload: { creds }
    })

    dispatch(closeModal())
  }
  // return {
  //   type: LOGIN_USER,
  //   payload: {
  //     creds
  //   }
  // }
}

export const logout = () => {
  return {
    type: SIGN_OUT_USER
  }
}