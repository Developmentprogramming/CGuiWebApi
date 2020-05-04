const db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'Developer@CGui',
    database : 'installation'
  }
})

const handleInstallation = (req, res) => {
  db('downloads').then(result => res.status(200).json(result));
}

exports.handleInstallation = handleInstallation