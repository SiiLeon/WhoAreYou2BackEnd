import fs from 'fs'
import fetch from "node-fetch";
function bajarImg(ruta,fichero,urll,tipo,extra){
    const  writepath= ruta;
    fs.mkdirSync(writepath, {recursive:true})
    try {
        const data = fs.readFileSync(fichero, 'utf8').split("\r\n")

        data.forEach((elem, idx) => {
            elem.replace(" ","%20")
            var  url;
            if (extra !=null) {
                var aux =( parseInt(elem)% extra )
                url = `${urll}${aux}/${elem}.${tipo}`
            }
            else { url  = `${urll}${elem}.${tipo}`}
            fetch(url).then(res => {
                if (res.status === 200) {
                    res.body.pipe(fs.createWriteStream(`${writepath}${elem}.${tipo}`))
                } else {
                    console.log(`status: ${res.status} line: ${idx} elem:${elem} not found`)
                }
            }).catch(err => console.log(err))
        })
    }catch (err){
        console.error(err);
    }
}

//bajarImg('json/teamId2/','teamId.txt','https://cdn.sportmonks.com/images/soccer/teams/','png', 32)

//bajarImg('json/flag2/','nationalities.txt','https://playfootball.games/who-are-ya/media/nations/','svg')


var idx = 0;
var timer;
function bajarImg2(ruta,fichero,urll,tipo,extra){
    const  writepath= ruta;
    fs.mkdirSync(writepath, {recursive:true})
    try {
        const data = fs.readFileSync(fichero, 'utf8').split("\r\n")
        var len = data.length
        timer =setInterval(bajaAux,1000,data,len,urll,tipo,extra,writepath)
    }catch (err){
        console.error(err);
    }
}


async function bajaAux(data,len,urll,tipo,extra,writepath){
    var i = idx + 10;

     while(idx < i && idx < len ) {

         var elem = data[idx]
         elem.replace(" ", "%20")
         var url;
         if (extra != null) {
             var aux = (parseInt(elem) % extra)
             url = `${urll}${aux}/${elem}.${tipo}`
         } else {
             url = `${urll}${elem}.${tipo}`
         }
         await fetch(url).then(res => {
             if (res.status === 200) {
                 res.body.pipe(fs.createWriteStream(`${writepath}${elem}.${tipo}`))
             } else {
                 console.log(`status: ${res.status} line: ${idx} elem:${elem} not found`)
             }
         }).catch(err => console.log(err))
         idx++;
         }

         if (idx == len) {
             clearInterval(timer)
     }
}
bajarImg2('json/id/','id2.txt','https://media.api-sports.io/football/players/','png')


/*

EJERCICIO 4

//habria que acceder a la coleccion ligas y equipos aparte de equipo
//al cual ya accedemos
const db = mongojs('mongodb://127.0.0.1:27017/footballdata', ['leagues','teams']);

//variables
let logo;
let jsonEquipo;
let jsonLiga;
let desfase=0;
let peticiones=0;


// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


async function realizarPeticionEquipo(id){

  var myHeaders = new Headers();
  myHeaders.append("x-rapidapi-key", "a97bbf9ee5505d1567cf66b6b6e8aa5f");
  myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  let respuesta = await fetch("https://v3.football.api-sports.io/teams?id="+id, requestOptions)
      .then(response => response.json())
      .catch(error => console.log('error', error));

  logo = respuesta.response[0].team.logo;


  console.log('Logo devuelto: '+logo);
  return logo;
}


async function realizarPeticionLiga(id){

  var myHeaders = new Headers();
  myHeaders.append("x-rapidapi-key", "a97bbf9ee5505d1567cf66b6b6e8aa5f");
  myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  let respuesta = await fetch("https://v3.football.api-sports.io/leagues?id="+id, requestOptions)
      .then(response => response.json())
      .catch(error => console.log('error', error));
  logo= respuesta.response[0].league.logo;
  return logo;
}

function anadirLogo(jsonEquipo){
  jsonEquipo.forEach(equipo => {
    equipo.logo="";
    return equipo;
  });
  return jsonEquipo;
}

function recorrerTodos(liga){
  liga.forEach(e=>{

    let desfaseLocal=desfase;
    let peticionLocal=peticiones;
    sleep(desfaseLocal).then(()=>{
      realizarPeticionEquipo(e.newId).then(r=>{e.logo=r;});
      console.log('Peticion de ID: '+e.newId);
      console.log('Liga de ID: '+ e.leagueId)
      console.log('Numero de peticion: '+ peticionLocal);
      console.log('Con desfase: '+ desfaseLocal);
      console.log('------------------------');

    });


    sleep(3000+desfaseLocal).then(()=>{

      introducirEquipo(e);
      console.log('Introduccion de ID: '+e.newId);
      console.log('Con desfase: '+ desfaseLocal);
      console.log('------------------------');
    });

    desfase += 10000;
    peticiones++;

  });
}
function introducirEquipo(equipo){
  jsonEquipo={
    "teamId": equipo.teamId,
    "teamName": equipo.teamName,
    "leagueId": equipo.leagueId,
    "newId": equipo.newId,
    "logo": equipo.logo
  }

  console.log('Insertando el siguiente json en mongoDB teams:');
  console.log('ID del equipo:' + equipo.teamId);
  console.log('Nombre: '+ equipo.teamName);
  console.log('ID de la liga: '+ equipo.leagueId);
  console.log('ID nuevo: ' +equipo.newId);
  console.log('Logo: '+ equipo.logo);
  console.log('------------------------');
  db.teams.insertOne(jsonEquipo);
}


function introducirLiga(id, logo){
  jsonLiga={
    "id": id,
    "logo": logo
  }

  console.log('Insertando el siguiente json en mongoDB leagues:');
  console.log('ID de la liga:' + id);
  console.log('Logo: '+ logo);
  console.log('------------------------');

  db.leagues.insertOne(jsonLiga);
}

function principal(){
  let bundesliga=require('./JSONS/fullBundesliga.json');
  let laLiga=require('./JSONS/fullLaLiga.json');
  let ligue1=require('./JSONS/fullLigue1.json');
  let premiere=require('./JSONS/fullPremiere.json');
  let serieA=require('./JSONS/fullserieA.json');


  let bndMod=anadirLogo(bundesliga);
  let laLMod=anadirLogo(laLiga);
  let lg1Mod=anadirLogo(ligue1);
  let preMod=anadirLogo(premiere);
  let srAMod=anadirLogo(serieA);

  recorrerTodos(bndMod);
  recorrerTodos(laLMod);
  recorrerTodos(lg1Mod);
  recorrerTodos(preMod);
  recorrerTodos(srAMod);


  sleep(desfase+60000).then(()=>{
    //liga1
    let logBund;
    realizarPeticionLiga(78).then(r=>{logBund=r;});

    sleep(2000).then(()=>{
      introducirLiga(78,logBund);
    });

    //liga2
    let logLaLig;
    realizarPeticionLiga(140).then(r=>{logLaLig=r;});

    sleep(2000).then(()=>{
      introducirLiga(140,logLaLig);
    });

    //liga3
    let logLig1;
    realizarPeticionLiga(61).then(r=>{logLig1=r;});

    sleep(2000).then(()=>{
      introducirLiga(61,logLig1);
    });

    //liga4
    let logPremi;
    realizarPeticionLiga(39).then(r=>{logPremi=r;});

    sleep(2000).then(()=>{
      introducirLiga(39,logPremi);
    });

    //liga5
    let logSeriA;
    realizarPeticionLiga(135).then(r=>{logSeriA=r;});

    sleep(2000).then(()=>{
      introducirLiga(135,logSeriA);
    });
  });

}

//realiza todo el proceso de introducir en mongoDB las ligas y equipos en la colecciones
//leagues y teams

principal();
*/