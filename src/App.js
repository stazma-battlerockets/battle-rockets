import "./App.scss";
import Header from "./components/Header";
import PlayerSelection from "./components/PlayerSelection";
import GetRockets from "./components/GetRockets";
import BattleRocketGrid from "./components/BattleRocketGrid";

function App() {
  return (
    <div className="wrapper">
      <Header />
      <main>
        <PlayerSelection />
        <BattleRocketGrid />
        <GetRockets />
      </main>
    </div>
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
