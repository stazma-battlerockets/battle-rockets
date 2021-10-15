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
    </section>
  );
};

export default PlayerSelection;
