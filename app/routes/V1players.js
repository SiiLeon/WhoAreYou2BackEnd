var express = require('express');
var router = express.Router();
const mongojs = require('mongojs')
const {body, validationResult} = require("express-validator");
const db = mongojs('mongodb://127.0.0.1:27017/proyectoSW', ['players'])


let remove = function(res, id){
    db.players.remove({_id: mongojs.ObjectId(id)}, (err, result) => {
        if (err) {
            console.log("No se elimino")
            res.send(err);
        } else {
            console.log("Se elimino")
            //res.send(result);
            res.redirect('../')
        }
    });
}


/* GET home page. */
router.get('/add', function(req, res, next) {
    if(req.session.userper=='admin') {
        res.render('add')
    }else if(req.session.userid){
        res.render('index',{title:"Bienvenido usuario"})
    }else{
        res.render('login',{element:'  '})
    }
});

router.post('/add', body('id').trim().notEmpty().isInt(),
    body('name').trim().notEmpty().isString(),
    body('birthdate').trim().notEmpty().isDate(),
    body('nationality').trim().notEmpty().isString(),
    body('teamId').trim().notEmpty().isInt(),
    body('position').trim().notEmpty().isString(),
    body('number').trim().notEmpty().isInt(),
    body('leagueId').trim().notEmpty().isInt(),
    function(req, res, next) {
    if(req.session.userper=='admin') {
        console.log(req.body)
        let errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log(errors.array());
            res.json({errors: errors.array()});
        }
        db.players.insertOne({
            'id': Number(req.body.id),
            'name': req.body.name,
            'birthdate': req.body.birthdate,
            'nationality': req.body.nationality,
            'teamId': Number(req.body.teamId),
            'position': req.body.position,
            'number': Number(req.body.number),
            'leagueId': Number(req.body.leagueId)},
            (err,result)=>{
            if(err){
                res.send(err)
            }else{
                res.redirect('./')
            }
            })
    }else if(req.session.userid){
        res.render('index',{title:"Bienvenido usuario"})
    }else{
        res.render('login',{element:'  '})
    }
});

router.get('/:id', function(req, res, next) {
    if(req.session.userper=='admin') {
        db.players.findOne({_id: mongojs.ObjectId(req.params.id)}, (err, doc) => {
            if (err) {
                 res.send(err);
            } else {
                console.log(doc)
                res.render('view', {element: doc})
            }
        })
    }else if(req.session.userid){
        res.render('index',{title:"Bienvenido usuario"})
    }else{
        res.render('login',{element:'  '})
    }
});

router.get('/remove/:id', function(req, res, next) {
    if(req.session.userper=='admin') {
        remove(res, req.params.id)
    }else if(req.session.userid){
        res.render('index',{title:"Bienvenido usuario"})
    }else{
        res.render('login',{element:'  '})
    }
});

router.get('/', (req, res) => {
    if(req.session.userper=='admin') {
        db.players.find((err, docs) => {
            if (err) {
                res.send(err);
            } else {
                res.render('inventory', {elements: docs})
            }
        })
    }else if(req.session.userid){
        res.render('index',{title:"Bienvenido usuario"})
    }else{
        res.render('login',{element:'  '})
    }
})


router.get('/edit/:id', function(req, res, next) {
    if(req.session.userper=='admin') {
        db.players.findOne({_id: mongojs.ObjectId(req.params.id)}, (err, doc) => {
            if (err) {
                res.send(err);
            } else {
                console.log(doc)
                res.render('edit', {element: doc})
            }
        })
    }else if(req.session.userid){
        res.render('index',{title:"Bienvenido usuario"})
    }else{
        res.render('login',{element:'  '})
    }
});

router.put('/edit', (req, res) => {
    if(req.session.userper=='admin') {
        console.log(req.body._id)
        db.players.findAndModify({
               query: {_id: mongojs.ObjectId(req.body._id)},
                update: {$set: {
                        id: Number(req.body.id),
                        name: req.body.name,
                        birthdate: req.body.birthdate,
                        nationality: req.body.nationality,
                        teamId: Number(req.body.teamId),
                        position: req.body.position,
                        number: Number(req.body.number),
                        leagueId: Number(req.body.leagueId)
                }}
        },
        (err, result) => {
            if (err) {
                res.send(err)
            } else {
                console.log("LOGRADO")
            }
        })
                res.redirect('../')
    }else if(req.session.userid){
        res.render('index',{title:"Bienvenido usuario"})
    }else{
        res.render('login',{element:'  '})
    }
})


module.exports = router;