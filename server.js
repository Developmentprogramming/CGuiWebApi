const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const gallery = require('./controllers/gallery');
const docs = require('./controllers/docs');
const installation = require('./controllers/installation');

const app = express();
app.use(bodyParser.json());
app.use(cors());
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.get('/gallery', async (req, res) => {
  try {
    await gallery.handlers.handleGallery(req, res);
  }
  catch(err) {
    console.log(err)
  }
})

app.get('/docs/:target', (req, res) => {
  docs.handlers.handleDocs(req, res);
})

app.get('/installation/downloadinfo', (req, res) => {
  installation.handleInstallation(req, res);
})

app.get('/support', (req, res) => {
  gallery.handlers.handleSupport(req, res)
})

app.get('/usage/:target', (req, res) => {
  fs.readdir(`./Usage/${req.params.target}`, async (err, data) => {
    const contents = data.map((file, i) => {
      return fs.readFileSync(`./Usage/${req.params.target}/${file}`, 'UTF-8').split('/\r?\n/')[0]
    })

    const results = await docs.handlers.usageResult(req.params.target);

    res.status(200).json({ results, examples: contents });
  })
})

app.listen(process.env.PORT || 3001, () => {
  console.log(`listening on port ${process.env.PORT}`)
});