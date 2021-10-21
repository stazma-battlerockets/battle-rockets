import { ref, set, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import realtime from "./firebase";

const PlayerSelection = () => {
  // States to control which player has been selected on the main page
  const [playerOneSelected, setPlayerOneSelected] = useState(false);
  const [playerTwoSelected, setPlayerTwoSelected] = useState(false);

  // ===========================================
  // Setting the firebase statuses for persistent read later
  // ===========================================
  const setPlayerSelected = (player, status = true) => {
    const playerSelectRef = ref(
      realtime,
      `playerSelection/player${player}Selected`
    );

    set(playerSelectRef, status);
  };

  // ===========================================
  // Reset Btn to reset everything to initial state in Firebase
  // ===========================================
  const resetBtn = (status, ready) => {
    const playerOneRef = ref(realtime, `playerSelection/player1Selected`);
    const playerTwoRef = ref(realtime, `playerSelection/player2Selected`);

    const playerOneShotsRef = ref(realtime, `players/1/shotsTaken`);
    const playerTwoShotsRef = ref(realtime, `players/2/shotsTaken`);

    const playerOneReadyRef = ref(realtime, `players/1/ready`);
    const playerTwoReadyRef = ref(realtime, `players/2/ready`);

    let startShots = [-1];

    set(playerOneReadyRef, ready);
    set(playerTwoReadyRef, ready);
    set(playerOneRef, status);
    set(playerTwoRef, status);
    set(playerOneShotsRef, startShots);
    set(playerTwoShotsRef, startShots);
    setPlayerOneSelected(false);
    setPlayerTwoSelected(false);
  };

  useEffect(() => {
    const playerSelectRef = ref(realtime, `playerSelection`);
    onValue(playerSelectRef, (snapshot) => {
      const playerSelect = snapshot.val();
      setPlayerOneSelected(playerSelect.player1Selected);
      setPlayerTwoSelected(playerSelect.player2Selected);
    });
  }, []);

  return (
    <section className="playerSelection">
      <Link to="/player1/game">
        <button
          className={`readyBtn playerOne ${playerOneSelected ? "hidden" : ""}`}
          onClick={() => setPlayerSelected(1)}
        >
          Player 1
        </button>
      </Link>

      <Link to="/player2/game">
        <button
          className={`readyBtn playerTwo ${playerTwoSelected ? "hidden" : ""}`}
          onClick={() => setPlayerSelected(2)}
        >
          Player 2
        </button>
      </Link>

      <div className="resetBtnContainer">
        <button
          onClick={() => {
            resetBtn(false, false);
          }}
        >
          Reset Game
        </button>
      </div>
    </section>
  );
};

export default PlayerSelection;
