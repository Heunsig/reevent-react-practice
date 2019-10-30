export const createReducer = (initialsState, fnMap) => {
  return (state = initialsState, {type, payload}) => {
    const handler = fnMap[type]

    return handler ? handler(state, payload) : state
  }
}