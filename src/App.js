import Header from "./components/Header";
import PlayerSelection from "./components/PlayerSelection";
import BattleRocketGrid from "./components/BattleRocketGrid";
import Footer from "./components/Footer";
import realtime from "./components/firebase.js";

import { BrowserRouter as Router, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ref, set, onValue } from "firebase/database";

import "./App.scss";

function App() {
  // States to control which players are ready
  const [playerOneReady, setPlayerOneReady] = useState(false);
  const [playerTwoReady, setPlayerTwoReady] = useState(false);

  // ===========================================
  // Function to display board on Game mode
  // ===========================================
  const readyToPlay = (player, status = true) => {
    handlePlayerReady(player, status);
  };

  // ===========================================
  // Handling updating the Firebase table with the ready values
  // ===========================================
  const handlePlayerReady = (player, status) => {
    const playerNodeRef = ref(realtime, `players/${player}/ready`);

    set(playerNodeRef, status);
  };

  // ===========================================
  // Grabbing player ready statuses from Firebase
  // ===========================================
  useEffect(() => {
    const dbRef = ref(realtime, `players`);
    // We grab a snapshot of our database and use the .val method to parse the JSON object that is our database data out of it
    onValue(dbRef, (snapshot) => {
      const players = snapshot.val();

      const newPlayers = [];

      for (let propName in players) {
        const newPlayer = {
          player: propName,
          data: players[propName],
        };

        newPlayers.push(newPlayer);
      }

      setPlayerOneReady(newPlayers[0].data.ready);
      setPlayerTwoReady(newPlayers[1].data.ready);
    });
  }, []);

  // ===========================================
  // Main Return
  // ===========================================
  return (
    <Router>
      <div className="wrapper">
        <main>
          <Route exact path="/">
            <div className="welcomePage">
              <Header />
              <PlayerSelection />
            </div>
          </Route>

          <Route path="/player1/game">
            <Header />

            <BattleRocketGrid setup={true} player={1} readyToPlay={readyToPlay} />

            {playerOneReady && playerTwoReady ? (
              <BattleRocketGrid setup={false} player={1} />
            ) : null}
          </Route>

          <Route path="/player2/game">
            <Header />
            <BattleRocketGrid setup={true} player={2} readyToPlay={readyToPlay} />

            {playerOneReady && playerTwoReady ? (
              <BattleRocketGrid setup={false} player={2} />
            ) : null}
          </Route>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
