var express = require('express');
var router = express.Router();//declarando un objeto router para ser mandado a la app
var pg=require('pg');
var bd=require('../bd.js');
var session= require('express-session');
var pool=bd.basedatos;
var multer=require("multer");
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images');
  },
  filename: function (req, file, callback) {
    // callback(null, file.fieldname + '-' + Date.now());
    callback(null,file.originalname);
    // callback(null, file.originalname + '-' + Date.now());
  }
});
// var storage=multer.diskStorage({
//   destination:function(req,file,cb){
//     cb(null,'./public/images/')
//   },
//   filemane:function(req,file,cb){
//     cb(null,Date.now()-file.originalname);
//   }
// })
// var fotos=multer({dest:'./public/images'})
var fotos=multer({ storage: storage })

router.all('/Usuarios', function(req, res, next) {//aui se le asigna las rutas
  // console.log('Bienvenido Gestion Usuarios');
  pool.connect(function(err, client, done) {
    if(err) {// si existe un error
      return console.error('ir a buscar error de cliente de la pool', err);
    }
    client.query('SELECT u.* from usuario u where u.estado=1', function(err, result) {
      // res.json(result.rows);
      console.log(result.rows[0]);
      res.render('GestionUsuarios',{
        LUsuarios:result.rows
      });
      if(err) {
        return console.error('Error de ejecución de consulta', err);
      }
      done();
    });
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  })
});//se pasa el nombre de la plantilla

router.post('/LUsuarios', function(req, res, next) {
  console.log('LLegue lisra de Usuarios');
  pool.connect(function(err, client, done) {
    if(err) {// si existe un error
      return console.error('ir a buscar error de cliente de la pool', err);
    }
    client.query('SELECT u.* from usuario u where u.estado=1', function(err, result) {
      // res.json(result.rows);
      console.log('La Lista en Json de Usuarios',result.rows);
      res.json(result.rows);
      if(err) {
        return console.error('Error de ejecución de consulta', err);
      }
      done();
    });
  });

  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  })
});

router.post('/ModalAddUser', function(req, res, next) {
  console.log('Llego ....adicionar Usuarios');
  res.render('MAUsuario')
});

// function codusuario(){
//   var coduser=0;
//   pool.connect(function(err, client, done) {
//     if(err) {// si existe un error
//       return console.error('ir a buscar error de cliente de la pool', err);
//     }
//     client.query('select COALESCE(max(codusu),0)+1 as codusu from usuario', function(err, result) {
//       coduser=result.rows[0].codusu;
//       console.log('La Lista en Json de Usuarios',result.rows);
//       console.log('Codigo Usuario',coduser);
//       if(err) {
//         return console.error('Error de ejecución de consulta', err);
//       }
//       done();
//     });
//   });
//   pool.on('error', function (err, client) {
//     console.error('idle client error', err.message, err.stack)
//   })
//   console.log('Codigo Usuario Ahoraa',coduser);
//   return coduser;
// }

// router.post('/adicionarUsuario',fotos.any(),function(req, res, next) {
router.post('/adicionarUsuario',fotos.single('foto'),function(req, res, next) {
  console.log("adUser:",req.body.ci,req.body.nombre,req.body.ap,req.body.am,req.body.genero,req.body.fecha,req.body.direccion,req.body.telefono,req.body.correo,req.body.descripcion);
  console.log("fotos",req.file);
  // console.log("Original Nombre",req.files[0].originalname);
  console.log("Original Nombre",req.file.originalname);
  // console.log('El valor Maximo',codusuario());

  pool.connect(function(err, client, done) {
    if(err) {// si existe un error
      return console.error('ir a buscar error de cliente de la pool', err);
    }
    client.query('select COALESCE(max(codusu),0)+1 as codusu from usuario', function(err, result) {
      coduser=result.rows[0].codusu;
      console.log('La Lista en Json de Usuarios',result.rows);
      console.log('Codigo Usuario',coduser);
      client.query('insert into usuario(codusu,ci,nombre,ap,am,genero,fechnac,direccion,telefono,correo,foto,observacion) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',[coduser,req.body.ci,req.body.nombre,req.body.ap,req.body.am,req.body.genero,req.body.fecha,req.body.direccion,req.body.telefono,req.body.correo,req.file.originalname,req.body.descripcion],
        function(err, result){
        if(err) {
          return console.error('Error de ejecución de consulta', err);
        }
        done();
      });
      if(err) {
        return console.error('Error de ejecución de consulta', err);
      }
      done();
    });
  });
  pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
  })
  // res.send('Respuesta')
});
module.exports = router;// se exporta el router a la app y se captura en app.use(router)
