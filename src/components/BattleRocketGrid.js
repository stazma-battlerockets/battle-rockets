import Popup from "./Popup";
import { useEffect, useState } from "react";
import { ref, set, get, onValue } from "firebase/database";
import { useBeforeunload } from "react-beforeunload";
import realtime from "./firebase";

const BattleRocketGrid = ({ setup, player, readyToPlay }) => {
  // An array of objects -> ship name, X and Y coords and if ship has been placed
  const allShips = [
    {
      name: "destroyer",
      length: 2,
      placed: false,
      isHit: [],
      isSunk: false,
    },
    {
      name: "submarine",
      length: 3,
      placed: false,
      isHit: [],
      isSunk: false,
    },
    {
      name: "cruiser",
      length: 3,
      placed: false,
      isHit: [],
      isSunk: false,
    },
    {
      name: "battleship",
      length: 4,
      placed: false,
      isHit: [],
      isSunk: false,
    },
    {
      name: "carrier",
      length: 5,
      placed: false,
      isHit: [],
      isSunk: false,
    },
  ];

  // ===========================================
  // All States
  // ===========================================

  // State to hold ship object
  const [currentShip, setCurrentShip] = useState(null);

  // State to hold ship direction
  const [horizontal, setHorizontal] = useState(true);

  // State to display ships placed on the grid
  const [placedShips, setPlacedShips] = useState([]);

  // State to display the available ships to place on the grid
  const [availableShips, setAvailableShips] = useState(allShips);

  //State to hold if user has added all ships to the grid and is ready for BATTLE!
  const [shipsReady, setShipsReady] = useState(false);

  // State to hold shots taken by whoever's playing
  const [yourShot, setYourShot] = useState([]);

  // State to hold shots taken by their opponents
  const [opponentShot, setOpponentShot] = useState([]);

  // State to handle player turn
  const [playerOneTurn, setPlayerOneTurn] = useState(true);

  // State to ready the player for the game
  const [ready, setReady] = useState(false);

  // Initializing grid array
  const gridArray = [];

  for (let i = 0; i < 100; i++) {
    gridArray.push(i);
  }

  // Used to toggle the orientation of the ship placement with a mouse right click
  const rotateShip = (e) => {
    if (e.button === 2) {
      setHorizontal(!horizontal);
    }
  };

  // ===========================================
  // Handling the placement of the ships in real time
  // ===========================================

  const handleMouseEnter = (gridIndex) => {
    // Our ship position
    let shipPosition = gridIndex;

    // currentShip state will be empty before any ship has been selected and after any ship has been placed
    if (currentShip) {
      // New ship coords array
      const newCoords = [];

      // Getting the new positions of each coordinate based on the chosen ship length and the orientation
      for (let i = 0; i < currentShip.length; i++) {
        newCoords.push(shipPosition);
        shipPosition = horizontal ? shipPosition + 1 : shipPosition + 10;
      }

      // Checking for overlaps in the placed vs current ship
      // Logic to update the state if the coords are not out of bounds, dependent on orientation
      if (!handleOutOfBounds(newCoords, gridIndex)) {
        setCurrentShip({ ...currentShip, coords: newCoords });
      }
    }
  };

  // ===========================================
  // Placing current ship into placed ships
  // ===========================================
  const handlePlaceShip = () => {
    if (currentShip) {
      if (currentShip.coords !== undefined) {
        // If placedShips is empty - go ahead with the logic to place ships on the page as there is nothing to compare
        if (!placedShips) {
          // Set the currentShip into the placedShip state with property placed = true
          setPlacedShips([...placedShips, { ...currentShip, placed: true }]);

          // Filtering out the currentShip from the availableShips
          setAvailableShips(
            availableShips.filter((ship) => ship.name !== currentShip.name)
          );
          // Resetting the current ship
          setCurrentShip(null);
        } else {
          // Local variable to check if ship coords are matching
          let isMatch = false;
          // Callback function to pass into .some() to compare coords between two arrays - currentShip.coords and placedShip.coords
          const compareCoords = (coords) => {
            // Check currentShip length and we stop this loop if isMatch = true
            for (let i = 0; i < currentShip.coords.length && !isMatch; i++) {
              if (coords === currentShip.coords[i]) {
                isMatch = true;
              }
            }
          };
          // Check placedShip length and we stop this loop if isMatch = true
          for (let i = 0; i < placedShips.length && !isMatch; i++) {
            let placedCoords = placedShips[i].coords;
            placedCoords.some(compareCoords);
          }
          if (!isMatch) {
            // Set the currentShip into the placedShip state with property placed = true
            setPlacedShips([...placedShips, { ...currentShip, placed: true }]);

            // Filtering out the currentShip from the availableShips
            setAvailableShips(
              availableShips.filter((ship) => ship.name !== currentShip.name)
            );

            // Resetting the current ship
            setCurrentShip(null);
          }
        }
      }
    }
  };

  // ===========================================
  // Handling logic for seeing if ship coords are out of bounds
  // ===========================================
  const handleOutOfBounds = (shipCoords, gridIndex) => {
    let outOfBounds = false;

    if (horizontal) {
      outOfBounds = shipCoords.some((coordX) => {
        // eg. 37, 38, 39, 40 -> after the Math.floor -> 3, 3, 3, 4
        return Math.floor(coordX / 10) !== Math.floor(gridIndex / 10);
      });
    } else if (!horizontal) {
      outOfBounds = shipCoords.some((coordY) => coordY > 99);
    }

    return outOfBounds;
  };

  // ===========================================
  // Reset the whole grid and states
  // ===========================================
  const resetGrid = () => {
    setCurrentShip(null);
    setPlacedShips([]);
    setAvailableShips(allShips);
    setShipsReady(false);
  };

  // ===========================================
  // To grab the a large array of all the coordinates for the placed ships
  // ===========================================
  const totalShipCoords = () => {
    let totalCoords = [];

    placedShips.forEach((placedShip) => {
      placedShip.coords.forEach((coord) => {
        totalCoords.push(coord);
      });
    });

    return totalCoords;
  };

  // ===========================================
  // Checking to see if the ship has already placed in a particular square of the grid
  // ===========================================
  const occupiedPlacedShip = (gridIndex) => {
    // Should return TRUE if any of the placed ships' coords include the gridIndex
    return placedShips.some((placedShip) => {
      return placedShip.coords.includes(gridIndex);
    });
  };

  // ===========================================
  // Checking to see if the ship has been hit
  // ===========================================
  const occupiedHitShip = (shotArray, gridIndex) => {
    // Should return TRUE if any of the placed ships' coords include the gridIndex

    if (shotArray.includes(gridIndex)) {
      if (totalShipCoords().includes(gridIndex)) {
        return true;
      } else {
        return false;
      }
    } else {
      return "empty";
    }
  };

  // ===========================================
  // Checking to see if the ship has been sunk
  // ===========================================
  const occupiedSunkShip = (gridIndex) => {
    return placedShips.some((placedShip) => {
      return placedShip.isHit.includes(gridIndex) && placedShip.isSunk;
    });
  };

  // ===========================================
  // Checking to see which of the current state coords overlap with each grid square
  // ===========================================
  const occupiedCurrentShip = (gridIndex) => {
    if (currentShip) {
      if (currentShip.coords !== undefined) {
        return currentShip.coords.includes(gridIndex);
      }
    } else {
      return false;
    }
  };

  // ===========================================
  // Main function to determine if any square is occupied, calling the above functions
  // ===========================================
  const occupiedGridSquare = (shotArray, gridIndex) => {
    let isOccupied = "empty";

    if (setup === true) {
      if (occupiedPlacedShip(gridIndex) || occupiedCurrentShip(gridIndex)) {
        isOccupied = "displayShip";
      } else {
        isOccupied = "empty";
      }
    }

    if (placedShips.length !== 0) {
      if (occupiedHitShip(shotArray, gridIndex) === true) {
        isOccupied = "hit";
      } else if (occupiedHitShip(shotArray, gridIndex) === false) {
        isOccupied = "miss";
      }

      if (occupiedSunkShip(gridIndex)) {
        isOccupied = "sunk";
      }
    }

    return isOccupied;
  };

  // ===========================================
  // Preparing an altered instance of the placedShips array for when we set state
  // ===========================================
  const changeIsHit = (ships, newIndex, square) => {
    let newShips = [...ships];
    let newShip = { ...ships[newIndex] };

    newShips.splice(newIndex, 1);

    const newShipHits = [...newShip.isHit, square];

    if (newShipHits.length === newShip.coords.length) {
      newShip = { ...newShip, isHit: newShipHits, isSunk: true };
    } else {
      newShip = { ...newShip, isHit: newShipHits };
    }

    newShips.splice(newIndex, 0, newShip);

    return [...newShips];
  };

  // ===========================================
  // If the ship is hit to update the classNames
  // ===========================================
  const isHit = (target) => {

    if (!yourShot.includes(target)) {
      setPlayerTurn();
    }
    takeShot(target);
    placedShips.forEach((placedShip, index) => {
      placedShip.coords.forEach((coord) => {
        if (coord === target && !placedShip.isHit.includes(target)) {
          setPlacedShips(changeIsHit(placedShips, index, target));
        }
      });
    });
  };

  // ===========================================
  // On page refresh or close we reset the grid and change the status of the player back to false
  // ===========================================
  useBeforeunload(() => {
    readyToPlay(player, false);
    resetPage();
  });

  // ===========================================
  // Reset page
  // ===========================================

  const resetPage = () => {
    resetGrid();
    resetShotsTaken();
    setPlayerSelected(player, false);
  };
  // ===========================================
  // Setting player selected into Firebase 
  // ===========================================
  const setPlayerSelected = (player, status) => {
    const playerSelectRef = ref(realtime, `playerSelection/player${player}Selected`);

    set(playerSelectRef, status);
  };

  // ===========================================
  // Handle to placing placedShips into Firebase // only in the setup
  // ===========================================
  const setPlacedShipsFirebase = () => {
    const playerNodeRef = ref(realtime, `players/${player}/placedShips`);
    set(playerNodeRef, placedShips);
  };

  // ===========================================
  // Resetting the shotsTaken for either player
  // ===========================================
  const resetShotsTaken = () => {
    const playerNodeRef = ref(realtime, `players/${player}/shotsTaken`);
    let startShots = [-1];
    set(playerNodeRef, startShots);
  };

  // ===========================================
  // Grabbing game data from the opponent
  // ===========================================
  const getGameData = () => {
    let opponentNum;

    if (player === 1) {
      opponentNum = 2;
    } else if (player === 2) {
      opponentNum = 1;
    }
    const playerNodeRef = ref(realtime, `players/${opponentNum}/placedShips`);

    let dataArray = [];

    get(playerNodeRef)
      .then((snapshot) => {
        const data = snapshot.val();

        data.forEach((ship) => {
          dataArray.push({ ...ship, isHit: [] });
        });
      })
      .then(() => {
        setPlacedShips(dataArray);
      });
  };

  // ===========================================
  // Function to grab the coords of shots taken and send it to firebase
  // ===========================================
  const takeShot = (gridIndex) => {
    const playerNodeRef = ref(realtime, `players/${player}/shotsTaken`);

    let shotsArray = [];
    get(playerNodeRef)
      .then((snapshot) => {
        const shotsData = snapshot.val();

        if (!shotsData.includes(gridIndex)) {
          shotsArray = [...shotsData, gridIndex];
        } else {
          shotsArray = [...shotsData];
        }
      })
      .then(() => {
        set(playerNodeRef, shotsArray);
        setYourShot(shotsArray);
      });
  };

  // ===========================================
  // Setup for the multiplayer aspects of the game
  // ===========================================
  useEffect(() => {
    let opponentNum;

    if (player === 1) {
      opponentNum = 2;
    } else if (player === 2) {
      opponentNum = 1;
    }
    const opponentNodeRef = ref(realtime, `players/${opponentNum}/shotsTaken`);

    const playerTurnRef = ref(realtime, `playerOneTurn`);

    onValue(opponentNodeRef, (snapshot) => {
      setOpponentShot(snapshot.val());
    });

    onValue(playerTurnRef, (snapshot) => {
      setPlayerOneTurn(snapshot.val());
    });
  }, [player]);

  // ===========================================
  // Setting the turn for the players
  // ===========================================
  const setPlayerTurn = () => {
    const playerTurnRef = ref(realtime, `playerOneTurn`);

    set(playerTurnRef, player === 1 ? false : true);
  };


  return (
    <section className="gameBoard">
      {/* Whole set up section */}
      {setup ? (
        <div className="shipSelection">
          {/* Conditionally map the available ship selectors based on the availableShips state*/}
          {availableShips.map((availableShip) => {
            return (
              <div
                key={availableShip.name}
                className={`${availableShip.name}Select`}
                onClick={() => setCurrentShip(availableShip)}
              ></div>
            );
          })}

          {shipsReady ? null : <p>Right click to rotate.</p>}

          {/* Reset the grid and placed ships */}
          {placedShips.length !== 5 || !shipsReady ? (
            <button onClick={resetGrid} className="resetGrid gameText">
              Reset Grid
            </button>
          ) : null}

          {/* Ready to play button only available once the ships are all placed */}
          {(placedShips.length === 5 && shipsReady === false) ? (

            <button
              className="battleTime gameText"
              onClick={() => {
                setShipsReady(true);
                readyToPlay(player);
                setPlacedShipsFirebase();
              }}
            >
              Ready to Play
            </button>

          ) : (shipsReady === true) ? <p className="gameText">Awaiting Opponent</p> : null}
        </div>
      ) : <div className="gameTextContainer">
        {ready ? (
          <p className="playerTurn gameText">Player {playerOneTurn ? "1" : "2"} Turn</p>
        ) : (
          <button
            className="startBattle gameText"
            onClick={() => {
              getGameData();
              setReady(true);
            }}
          >Start!</button>)}

        {
          placedShips.map((placedShip) => {
            return placedShip.isSunk ? <p className="sunkShip gameText">You have sunk the <span>{placedShip.name.toUpperCase()}</span></p> : null
          })
        }

        {
          (placedShips.every((placedShip) => {
            return placedShip.isSunk === true;
          }) && ready === true) ? <Popup trigger={true} outcome="win"></Popup> : null
        }

      </div>
      }

      <div
        className="gridContent"
        onMouseDown={rotateShip}
        onContextMenu={(e) => e.preventDefault()}
      >
        {gridArray.map((gridIndex) => {
          return (
            <div
              className={`gridSquare ${setup === true
                ? occupiedGridSquare(opponentShot, gridIndex)
                : occupiedGridSquare(yourShot, gridIndex)
                }`}
              key={`square${gridIndex}`}
              id={`square${gridIndex}`}
              onMouseEnter={() => handleMouseEnter(gridIndex)}
              onClick={
                setup
                  ? shipsReady
                    ? null
                    : handlePlaceShip
                  : ready
                    ? (playerOneTurn === true && player === 1) ||
                      (playerOneTurn === false && player === 2)
                      ? () => isHit(gridIndex)
                      : null
                    : null
              }
            ></div>
          );
        })}
      </div>


    </section>
  );
};

export default BattleRocketGrid;

