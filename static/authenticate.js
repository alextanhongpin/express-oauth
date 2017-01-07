// authenticate.js
//
// Description: Contains logic for authenticating users
// Will call every time the user enters the page
// and validate if the user is already authenticated or not

function getCredentials () {
  return {
    accessToken: window.localStorage.access_token,
    refreshToken: window.localStorage.refresh_token
  }
}
function hasCredentials (params) {
  // very poor way of checking
  // should fire a service call first
  // optionally, should have a base service call
  return params.accessToken && params.refreshToken
}
function authenticate () {
  if (!hasCredentials(getCredentials())) {
    window.location.href = '/login'
    return
  } else {
    // carry out first time call
  }
  const credentials = getCredentials()
  const request = fetch('/oauth/introspect', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: credentials.accessToken,
      token_type_hint: 'access_token'
    })
  })

  const response = request.then((body) => {
    return body.json()
  }).then((data) => {
    console.log(data)
    if (data.error === 'TokenExpiredError' || data.error === 'JsonWebTokenError') {
      // Refresh the token
      refresh()
    }
  })
}

function refresh () {
  const credentials = getCredentials()
  const request = fetch('/refresh', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer ' + credentials.accessToken
    },
    body: JSON.stringify({
      refresh_token: credentials.refreshToken,
      grant_type: 'refresh_token'
    })
  })

  const response = request.then((body) => {
    return body.json()
  }).then((data) => {
    console.log(data)
    window.localStorage.access_token = data.access_token
  })
}

function callProtectedAPI () {
  const credentials = getCredentials()
  const request = fetch('/api/v1/protected-api', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer ' + credentials.accessToken
    }
  })

  const response = request.then((body) => {
    return body.json()
  }).then((data) => {
    console.log(data)
    if (data.error === 'TokenExpiredError') {
      // Refresh the token
    }
  })
}
authenticate()
callProtectedAPI()
