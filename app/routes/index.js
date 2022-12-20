var express = require('express');
var router = express.Router();
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/proyectoSW', ['users'])
const {body, validationResult} = require('express-validator');

/* GET home page. */

router.get('/',(req,res) => {

  if(req.session.userper=='admin'){
    res.redirect('/api/v1/players')
  }else if(req.session.userid) {
    res.redirect('/html/index.html')
    //res.render('index', {title: "Bienvenido usuario"})
  }else{
    res.render('login',{element:'  '})
  }
});

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/register',(req,res) => {
  res.render('register')
});

router.post('/register',
    body('username').isLength({min:1}).withMessage('No puedes dejar el username del usuario vacio'),
    body('name').isLength({min:1}).withMessage('No puedes dejar el nombre de usuario vacio'),
    body('surname').isLength({min:1}).withMessage('No puedes dejar el apellido de usuario vacio'),
    body('password').isLength({min:3}).withMessage('Debe haber al menos 3 caracteres en la contraseña'),
    body('rpassword').isLength({min:3})
        .withMessage('Debe haber al menos 3 caracteres en la contraseña')
        .custom((value,{req})=>{
          if(value==req.body.password){
            return true;
          }else{
            return false;
          }
        }).withMessage("Las contraseñas no coinciden"),
    body('email').isLength({min:1})
        .withMessage('No puedes dejar el apellido de usuario vacio')
        .isEmail()
        .withMessage("No esta bien el email")
    ,(req,res) => {
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      const nuevoUsuario = {
        username:req.body.username,
        password:req.body.password,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        rol:'user'
      };

      console.log(nuevoUsuario)

      db.users.insert(nuevoUsuario, function (err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/');
        }
      })

});


router.post('/user',(req,res) => {
  db.users.find({"username": req.body.username, "password": req.body.password}, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      if (Object.keys(result).length !== 0) {
        //document.getElementById("Error").style.visibility='hidden'
        console.log("CORRECTO")
        req.session.userid = req.body.username;
        req.session.userper = result[0].rol;
        console.log(result[0].rol)
        console.log(req.session)
        res.redirect('/');
      } else {
        //document.getElementById("Error").style.visibility='visible'
        console.log("MAL")
        res.render('login',{element:'Credenciales no están correctos'})
      }
    }
  })
})






module.exports = router;
