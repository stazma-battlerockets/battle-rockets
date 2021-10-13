import "./App.scss";
import Header from "./components/Header";
import PlayerSelection from "./components/PlayerSelection";
import BattleRocketGrid from "./components/BattleRocketGrid";
import GetRockets from "./components/GetRockets";
import realtime from './components/firebase.js';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useState, useEffect } from "react";
import { ref, set, onValue } from 'firebase/database';

function App() {

  // State to control whether the game grid shows
  const [showGame, setShowGame] = useState(false);
  
  // State to control which players are ready

  const [playerOneReady, setPlayerOneReady]=  useState(false);
  const [playerTwoReady, setPlayerTwoReady] = useState(false);
  // Function to display board on Game mode
  const readyToPlay = (player, status=true) => {
    setShowGame(!showGame);
    handlePlayerReady(player, status);
  };

  // Handling updating the Firebase table with the ready values
  const handlePlayerReady = (player, status) => {
    const playerNodeRef = ref(realtime, `players/${player}/ready`);

    set(playerNodeRef, status);
  }



  // Getting the data
  useEffect(() => {
    const dbRef = ref(realtime, 'players');
    // We grab a snapshot of our database and use the .val method to parse the JSON object that is our database data out of it
    onValue(dbRef, (snapshot) => {

      const players = snapshot.val();

      const newPlayers = [];

      for (let propName in players) {
        const newPlayer = {
          player: propName,
          data: players[propName]
        }

        newPlayers.push(newPlayer);
      }

      setPlayerOneReady(newPlayers[0].data.ready);
      setPlayerTwoReady(newPlayers[1].data.ready);

    });

  }, []);

  return (
    <Router>
      <div className="wrapper">
        <main>
          <Route exact path="/">
            <div className="welcomePage">
              <Header />
              <PlayerSelection />
            </div>
            <GetRockets />
          </Route>



          <Route path="/playerOne">
            <Header />
            
            <BattleRocketGrid 
              setup={true}
              player={1}
              readyToPlay={readyToPlay}
            />
            

            {showGame && (playerOneReady && playerTwoReady) ?
              <BattleRocketGrid 
                setup={false} 
                player={1}/> : null
            }
            
          </Route>

          <Route path='/playerTwo' >
            <Header />
            <BattleRocketGrid 
              setup={true}
              player={2}
              readyToPlay={readyToPlay} />
              
            {showGame && (playerOneReady && playerTwoReady) ?
              <BattleRocketGrid 
              setup={false}
              player={2} />
              : null
            }
          
            
          </Route>
{/* 
          <Route path='/game'>
            <GamePlay player='playerOne' />
            <GamePlay player='playerTwo' />
          </Route> */}

        </main>
      </div>
    </Router>
  );
}

export default App;

// // PSEUDOCODE //
// Header component:
//  - Welcome page (animated)
//  - Create state for player 1 and player 2 - if one is selected - that state is set to true
//    - If both states are set to true, the game can begin - save state in Firebase?

//  // GAME SETUP //
//  - after they choose player option, they will get to choose their ships/rockets (5 in total)
//    - some stats of the rockets or ships are displayed
//    - when they click on the rocket/ship, information about the rocket/ship is displayed
//  - once all chosen, game boards will be displayed
//    - 10 x 10 grid
//    - a button to click when they're ready
//  - players can place their ships on the board and rotate (NO CHEATING!)
//    - state to store players board (ships' positions and orientations)
//    - state to store the readiness of both players

//  // GAME PLAY //
//  - if both players are ready, load the play screen (both screens appear)
//    - do sth to determine the player who goes first (or randomize)
//    - store in state and switch state to determines which player is playing
//  - player will click the opponent's grid, if the chosen square is in one the arrays stored in state, then we display it as a hit
//    if not, sth else happens
//  - create a counter for how many ships have been sunk by that player (MORE STATE)
//    - after you blow up a rocket, elon musk picture appear on screen
//    - if the counter hits 5, that player wins
//  - reset button
//    - when player clicks on the reset button, the screen goes back to the ships placement setup with option to choose another ships

// // FUTURE QUESTION //
// - what happens if one player leaves?

