
// Naming standards

// 1. If it is a standalone verb,
// `create`, `get`, `update`, `delete`
// the it refers to single CRUD

const Client = require('../models/client')

class ClientController {
  createClient (params) {
    const client = new Client()
    client.client_secret = client.generateClientSecret()
    client.client_id = client.generateClientId()
    client.client_name = params.client_name
    client.logo_uri = params.logo_uri
    client.callback_uris = params.callback_uris

    return client.save()
  }

  getClient ({ _id }) {
    return Client.findOne({ _id })
  }
  getOneByClientId (client_id) {
    return Client.findOne({ client_id })
  }
  getBySecret ({ client_id, client_secret }) {
    return Client.findOne({ client_id, client_secret })
  }

  getClients () {
    return Client.find()
  }

  removeClient (_id) {
    return Client.findOneAndRemove({ _id })
  }

  updateClient (params) {
    return Client.update({
      _id: params._id
    }, {
      $set: {
        client_name: params.client_name,
        logo_uri: params.logo_uri,
        redirect_uris: params.redirect_uris.split(',').map((uri) => { return uri.trim() })
      }
      // $addToSet: {
      //   redirect_uris: {
      //     $each: params.redirect_uris.split(',')
      //   }
      // }
    }, {})
  }
}

module.exports = function init (options) {
  return new ClientController(options)
}
