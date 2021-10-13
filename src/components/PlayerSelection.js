// import { useState } from 'react'
import { Link } from 'react-router-dom';
const PlayerSelection = () => {

  // const [playerOne, setPlayerOne] = useState(false);
  // const [playerTwo, setPlayerTwo] = useState(false);

  return (
    <section className="playerSelection">

      <Link to="/playerOne">
        <button className="readyBtn playerOne">Player 1</button>
      </Link>

      <Link to="/playerTwo">
        <button className="readyBtn playerTwo">Player 2</button>

      </Link>

    </section >
  );
};

export default PlayerSelection;
