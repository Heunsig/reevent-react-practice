import { createReducer } from '../../app/common/util/reducerUtils'

const initialState = {
  followingUsers: {}
};

const addFollowingUser = (state, payload) => {
  const newUser = payload.newUser
  return {
    ...state,
    followingUsers: {...state.followingUsers, ...newUser}
  }
}

const deleteFollowingUser = (state, payload) => {
  return {
    ...state,
    followingUsers: Object.keys(state.followingUsers).reduce((object, key) => {
      if (key !== payload.userId) {
        object[key] = state.followingUsers[key]
      }
      return object
    }, {})
  }
}

const fetchFollowingUsers = (state, payload) => {
  return {
    ...state,
    followingUsers: payload.followingUsers
  }
}


export default createReducer(initialState, {
  'ADD_FOLLOWING_USER': addFollowingUser,
  'DELETE_FOLLOWING_USER': deleteFollowingUser,
  'FETCH_FOLLOWING_USERS': fetchFollowingUsers
})