const handleInstallation = (req, res, db) => {
  db('installation_downloads').then(result => res.status(200).json(result));
}

exports.handleInstallation = handleInstallation