const handleGallery = async (req, res, db) => {
  const titles = (await db('gallery_main')).map(dbdata => dbdata.title);

  const filterdTitles = titles.filter((a, b) => titles.indexOf(a) === b);

  var finalContent = [];
  filterdTitles.forEach(title => {
    db('gallery_main').where('title', title).orderBy('name').then(data => {
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
    .catch(err => console.log(err));
  })

  let num = setInterval(() => {
    if(finalContent !== undefined && finalContent !== null && finalContent.length !== 0 && finalContent.length === filterdTitles.length) {
      res.status(200).json(finalContent);
      clearInterval(num);
    }
  })
}

const handleSupport = (req, res, db) => {
  db('support').then(result => { res.status(200).json(result) });
}

exports.handlers = { handleGallery, handleSupport };