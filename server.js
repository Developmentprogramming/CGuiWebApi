const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const gallery = require('./controllers/gallery');
const docs = require('./controllers/docs');
const installation = require('./controllers/installation');

const db = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.get('/gallery', async (req, res) => {
  try {
    await gallery.handlers.handleGallery(req, res, db);
  }
  catch(err) {
    console.log(err)
  }
})

app.get('/docs/:target', (req, res) => {
  docs.handlers.handleDocs(req, res);
})

app.get('/installation/downloadinfo', (req, res) => {
  installation.handleInstallation(req, res, db);
})

app.get('/support', (req, res) => {
  gallery.handlers.handleSupport(req, res, db);
})

app.get('/usage/:target', (req, res) => {
  docs.handlers.usage(req.params.target, db, res);
})

app.listen(process.env.PORT || 3001, () => {
  console.log(`listening on port ${process.env.PORT}`)
});