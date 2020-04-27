const db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'Developer@CGui',
    database : 'docs'
  }
})

const getList = async (res) => {
  const titles = (await db('list')).map(dbdata => dbdata.title);

  const filerdtitles = titles.filter((a, b) => titles.indexOf(a) === b);

  var finalContent = [];

  filerdtitles.forEach(title => {
    db('list').where('title', title).orderBy('name').then(dbdata => {
      const innerContent = [];
      innerContent.push({
        title: title,
        contents: dbdata.map(single => single.name)
      })

      return innerContent;
    }).then(result => finalContent.push(result));
  })

  var id = setInterval(() => {
    if(finalContent !== undefined && finalContent !== null && finalContent.length !== 0 && finalContent.length === filerdtitles.length) {
      res.status(200).json(finalContent);
      clearInterval(id);
    }
  })

}

const handleDocs = async (req, res) => {
  const names = (await db('list')).map(dbdata => dbdata.name);

  if(req.params.target === 'list')
    getList(res);

  names.forEach(async name => {
    if(req.params.target === name) {
      const maindata = await db('main').where('title', name);
      const reladata = (await db('relations').where('title', name)).map(rela => { return { name: rela.name, value: rela.value } });
      const funcdata = (await db('functions').where('title', name).orderBy('arrid')).map(func => { return { returnType: func.returntype, functionSyntax: func.functionsyntax } });
      const defaultvalues = await db('defaultvalues').where({ title: name, })
      const descfunc = (await db('descriptivefunctions').where('title', name).orderBy('arrid')).map(desc => {
        const finaldfValue = [];

        var id = setInterval(() => {
          if(defaultvalues !== Promise && defaultvalues !== null && defaultvalues !== undefined) {
            defaultvalues.forEach(innerData => {
              if(innerData.functionsyntax === desc.functionsyntax && innerData.arrid === desc.arrid)
                finaldfValue.push({ target: innerData.target, value: innerData.value })
            })
            clearInterval(id);
          }
        })

        return {
          returnType: desc.returntype,
          functionSyntax: desc.functionsyntax,
          functionDescription: desc.functiondescription,
          functionNotes: desc.functionnotes,
          returnValue: desc.returnvalue,
          defaultValues: finaldfValue
        }
      });
      const enums = (await db('enums').where('title', name)).map(e => e.name);

      const enumsfilterd = enums.filter((a, b) => enums.indexOf(a) === b);

      const finalContent = [];
      enumsfilterd.forEach(enums => {
        db('enums').where('name', enums).then(inndata => {
          const contents = inndata.map(idata => {
            return {
              name: idata.enumvalue,
              usedFor: idata.usedfor
            }
          })

          return {
            name: enums,
            contents
          }
        })
        .then(result => {
          finalContent.push(result)
        })
      })

      var id = setInterval(() => {
        if((maindata !== undefined && maindata !== null && maindata !== (Function || Promise)) && (reladata !== undefined && reladata !== null && reladata !== (Function || Promise)) && (funcdata !== undefined && funcdata !== null && funcdata !== (Function || Promise)) && (descfunc !== undefined && descfunc !== null && descfunc !== (Function || Promise)) && (finalContent !== undefined && finalContent !== null && finalContent.length === enumsfilterd.length && finalContent !== (Array || Object || Promise)) && ( defaultvalues !== undefined && defaultvalues !== null && defaultvalues !== (Promise || Object))) {
          res.status(200).json({
            title: maindata[0].title,
            imagesrc: maindata[0].imgsrc,
            imgw: maindata[0].imgw,
            imgh: maindata[0].imgh,
            description: maindata[0].description,
            relations: reladata,
            functions: funcdata,
            descriptiveFunctions: descfunc,
            enums: finalContent
          });
          clearInterval(id);
        }
      })
    }
  })
}

const usageResult = async (target) => {
  return await db('resultsimgsrc').where('title', target).orderBy('arrid')
}

exports.handlers = { usageResult, handleDocs };