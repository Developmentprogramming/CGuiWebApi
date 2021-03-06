const https = require('https');
const linebyline = require('line-by-line');

const getList = async (res, db) => {
  const titles = (await db('docs_list')).map(dbdata => dbdata.title);

  const filerdtitles = titles.filter((a, b) => titles.indexOf(a) === b);

  var finalContent = [];

  filerdtitles.forEach(title => {
    db('docs_list').where('title', title).orderBy('name').then(dbdata => {
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

const handleDocs = async (req, res, db) => {
  const names = (await db('docs_list')).map(dbdata => dbdata.name);

  if(req.params.target === 'list')
    await getList(res, db);

  names.forEach(async name => {
    if(req.params.target === name) {
      const maindata = await db('docs_main').where('title', name);
      const reladata = (await db('docs_relations').where('title', name)).map(rela => { return { name: rela.name, value: rela.value } });
      const funcdata = (await db('docs_functions').where('title', name).orderBy('arrid')).map(func => { return { returnType: func.returntype, functionSyntax: func.functionsyntax, arrid: func.arrid } });
      const defaultvalues = await db('docs_funcs_defaultvalues').where('title', name)
      const descfunc = (await db('docs_descriptivefunctions').where('title', name).orderBy('arrid')).map(desc => {
        const finaldfValue = []

        var id = setInterval(() => {
          if(defaultvalues !== Promise && defaultvalues !== null, defaultvalues !== undefined) {
            defaultvalues.forEach(dfValue => { 
              if(dfValue.functionsyntax === desc.functionsyntax) {
                finaldfValue.push({ target: dfValue.target, value: dfValue.value});
              }
            })
            clearInterval(id)
          }
        })

        return {
          returnType: desc.returntype,
          functionSyntax: desc.functionsyntax,
          functionDescription: desc.functiondescription,
          functionNotes: desc.functionnotes,
          returnValue: desc.returnvalue,
          defaultValues: finaldfValue,
          arrid: desc.arrid
        }
      });
      const enums = (await db('docs_enums').where('title', name)).map(e => e.name);

      const enumsfilterd = enums.filter((a, b) => enums.indexOf(a) === b);

      const finalContent = [];
      enumsfilterd.forEach(enums => {
        db('docs_enums').where('name', enums).then(inndata => {
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

const usage = async (target, db, res) => {
  const data = await db('docs_usage').where('title', target).orderBy('arrid');
  const finalContent = []

  data.forEach(innerData => {
    const options = {
      host: innerData.host,
      path: innerData.path,
      method: 'GET'
    }

    const final = [];
    const req = https.request(options, (response) => {
      response.setEncoding('utf8');

      lr = new linebyline(response);

      lr.on('error', (err) => {
        console.log(err);
      });

      lr.on('line', (line) => {
        final.push(line);
      })

      lr.on('end', () => {
        finalContent.push({
          example: final.join('\n'),
          resultimgsrc: innerData.imgsrc
        })
      })
    })

    req.on('error', (e) => {
      console.log(e)
      req.abort();
      res.status(400).json(e);
    })

    req.end();
  })

  var id = setInterval(() => {
    if(data.length === finalContent.length) {
      res.status(200).json(finalContent)
      clearInterval(id)
    }
  })
}

exports.handlers = { usage, handleDocs };