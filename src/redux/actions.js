export const setCommit = (isCommit) => {
    return (
        {
            type: "SET_COMMIT",
            payload: isCommit
        }
    )
}

export const setUserPermission = (permission) => {
  return (
    {
      type: "SET_USER_PERMISSION",
      payload: permission
    }
  )
}

export const showSnackbar = (message, severity) => {
  return (
    {
      type: "SHOW_SNACKBAR",
      payload: { message: message, severity: severity, open: true }
    }
  )
}

export const hideSnackbar = () => {
  console.log("hide")
  return (
    {
      type: "HIDE_SNACKBAR",
      payload: { message: null, severity: null, open: false }
    }
  )
}


export const setTokenTimer = (tokenTime) => {
  localStorage.setItem("token", tokenTime);
  return (
    {
      type: "SET_TOKEN_TIMER",
      payload: tokenTime
    }
  )
}