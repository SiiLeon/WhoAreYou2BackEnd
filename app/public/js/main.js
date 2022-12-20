import { folder, leftArrow} from "./fragments.js";
import { fetchJSON } from "./loaders.js";

import {setupRows} from './rows.js';
import {autocomplete} from './autocomplete.js'

function differenceInDays(timeStart) {
  var  timeEnd = new Date();
   
  if (timeEnd > timeStart)
  {
       var diff = timeEnd.getTime() - timeStart.getTime();
        return parseInt(diff/(1000 * 60 * 60 * 24)+1)
  }
}

let difference_In_Days = differenceInDays(new Date("2022-12-19"));

window.onload = function () {
  document.getElementById(
    "gamenumber"
  ).innerText = difference_In_Days.toString();
  document.getElementById("back-icon").innerHTML = folder + leftArrow;
};

let game = {
  guesses: [],
  solution: {},
  players: [],
  leagues: []
};

let situacion= {
  "guesses": [],
  "solution": null
}



function getSolution(players, sArray, difference_In_Days) {
  let id = sArray[difference_In_Days-1].id
  let jug = players["id"]
  let player = players.filter(r=>r.id==id)[0]
  return player;
}

Promise.all([fetchJSON("../json/fullplayers.json"), fetchJSON("../json/solution.json")]).then(
  (values) => {

    let solution;
    
    [game.players, solution] = values;

    game.solution = getSolution(game.players, solution, difference_In_Days);

    document.getElementById(
      "mistery"
    ).src = `https://playfootball.games/media/players/${
      game.solution.id % 32
    }/${game.solution.id}.png`;


  let s=JSON.parse(localStorage.getItem("WAYgameState"))
  localStorage.setItem("WAYgameState",JSON.stringify(situacion));

  if(s!=null){
  let fin=false;
  let lastGuess=s.guesses[s.guesses.length-1]
  if(lastGuess== game.solution.id || s.guesses.length==8 )fin=true;
    console.log(fin)
  let addRow = setupRows(game,fin);
  let a=s.guesses;
  a.forEach(g =>{
      addRow(g);
  })

        

}
      
  

    autocomplete(document.getElementById("myInput"), game)
     
    /* let addRow = setupRows(game);
     
    console.log('--------------------------------------------------');

    let input = document.getElementById('myInput');
    // when the user types a number an press the Enter key:

    input.addEventListener('keydown', e => {
         if(e.key=='Enter')
         {
           addRow(  game.guesses[game.guesses.length-1]);
         }
        
    });
    
    */

  }
  
);