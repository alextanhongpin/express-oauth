let service = {}

service.login = function login (email, password) {
  const request = fetch('/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      email, password
    })
  })
  const response = request.then((body) => {
    if (!body) {
      console.log(body)
      return false
    }
    return body.json()
  }).catch((err) => {
    console.log(err)
  })
  return response
}

service.register = function register (email, password) {
  const request = fetch('/register', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      email, password
    })
  })
  const response = request.then((body) => {
    if (body.status === 400) {
      // handle error
    }
    return body.json()
  })
  return response
}

service.logout = function logout () {}

service.authorize = function authorize () {}
