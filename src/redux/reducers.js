const INITIAL_STATE = {
  show_commit: false,
  user_permission: localStorage.getItem("perms"),
  snackbar: { message: null, severity: null },
  tokenTimer: parseInt(localStorage.getItem("token"))
};

const reducers = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_COMMIT': return {
      ...state,
      show_commit: action.payload
    }
    case 'SET_USER_PERMISSION': return {
      ...state,
      user_permission: action.payload
    }
    case 'SHOW_SNACKBAR': return {
      ...state,
      snackbar: action.payload
    }
    case 'HIDE_SNACKBAR': return {
      ...state,
      snackbar: action.payload
    }
    case 'SET_TOKEN_TIMER': return {
      ...state,
      tokenTimer: action.payload
    }

    default:
      return state;
  }
}

export default reducers;