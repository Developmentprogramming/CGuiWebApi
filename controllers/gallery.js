const db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'Developer@CGui',
    database : 'gallery'
  }
})

const handleGallery = async (req, res) => {
  const titles = (await db('main')).map(dbdata => dbdata.title);

  const filterdTitles = titles.filter((a, b) => titles.indexOf(a) === b);

  var finalContent = [];
  filterdTitles.forEach(title => {
    db('main').where('title', title).orderBy('name').then(data => {
      const innerContent = [];
      innerContent.push({
        title: title,
        contents: data.map(innerdata => {
          return ({
            name: innerdata.name,
            imgsrc: innerdata.imgsrc,
            imgw: innerdata.imgw,
            imgh: innerdata.imgh
          })
        })
      })
      return innerContent;
    })
    .then(result => { finalContent.push(result) })
  })

  let num = setInterval(() => {
    if(finalContent !== undefined && finalContent !== null && finalContent.length !== 0 && finalContent.length === filterdTitles.length) {
      res.status(200).json(finalContent);
      clearInterval(num);
    }
  })
}

const handleSupport = (req, res) => {
  db('support').then(result => { res.status(200).json(result) });
}

exports.handlers = { handleGallery, handleSupport };