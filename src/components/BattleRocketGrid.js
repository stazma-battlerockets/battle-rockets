import { useState } from "react";

const BattleRocketGrid = ({player}) => {
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

  // Handling the placement of the ships in real time
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

  // Handling logic for seeing if ship coords are out of bounds
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

  // Placing current ship into placed ships
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
          // Callback function to pass into .some() to compare coords between two arrays - currentShip.coords and placedship.coords
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

  // Reset the whole grid and states
  const resetGrid = () => {
    setCurrentShip(null);
    setPlacedShips([]);
    setAvailableShips(allShips);
    setShipsReady(false);
  };

  // Checking to see if the ship has already placed in a particular square of the grid
  const occupiedPlacedShip = (gridIndex) => {
    // Should return TRUE if any of the placed ships' coords include the gridIndex
    return placedShips.some((placedShip) => {
      return placedShip.coords.includes(gridIndex);
    });
  };

  //
  const occupiedHitShip = (gridIndex) => {
    // Should return TRUE if any of the placed ships' coords include the gridIndex
    return placedShips.some((placedShip) => {
      return placedShip.isHit.includes(gridIndex);
    });
  };

  //
  const occupiedSunkShip = (gridIndex) => {
    return placedShips.some((placedShip) => {
      return placedShip.isHit.includes(gridIndex) && placedShip.isSunk;
    });
  };

  // Checking to see which of the current state coords overlap with each grid square
  const occupiedCurrentShip = (gridIndex) => {
    if (currentShip) {
      if (currentShip.coords !== undefined) {
        return currentShip.coords.includes(gridIndex);
      }
    } else {
      return false;
    }
  };

  // Checking to see if a particular square of the grid is occupied using either the placed or current ships
  const occupiedGridSquare = (gridIndex) => {
    let isOccupied = "empty";

    if (occupiedPlacedShip(gridIndex) || occupiedCurrentShip(gridIndex)) {
      isOccupied = "displayShip";
    }

    if (occupiedHitShip(gridIndex)) {
      isOccupied = "hit";
    }

    if (occupiedSunkShip(gridIndex)) {
      isOccupied = "sunk";
    }

    return isOccupied;
  };

  // Updating the isHit property for the hit ship
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

  const isHit = (e, target) => {
    placedShips.forEach((placedShip, index) => {
      placedShip.coords.forEach((coord) => {
        if (coord === target && !placedShip.isHit.includes(target)) {
          setPlacedShips(changeIsHit(placedShips, index, target));
        }
      });
    });
    if (e.target.classList.contains("empty")) {
      e.target.classList.remove("empty");
      e.target.classList.add("miss");
    }
  };



  return (
    // setShip type value hardcoded for each ship div so that shipType is toggled depending on which div is clicked
    <section className="gameBoard">
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

        <p>Right click to rotate.</p>

        {/* Reset the grid and placed ships */}
        {placedShips.length !== 5 || !shipsReady ? (
          <button onClick={resetGrid}>Reset Grid</button>
        ) : null}

        {/* Ready to play button only available once the ships are all placed */}
        {placedShips.length === 5 ? (
          <button onClick={() => setShipsReady(true)}>
            {shipsReady ? "Time for battle!" : "Ready to Play"}
          </button>
        ) : null}
      </div>

      <div
        className="gridContent"
        onMouseDown={rotateShip}
        onContextMenu={(e) => e.preventDefault()}
      >
        {gridArray.map((gridIndex) => {
          return (
            <div
              className={`gridSquare ${occupiedGridSquare(gridIndex)}`}
              key={`square${gridIndex}`}
              id={`square${gridIndex}`}
              onMouseEnter={() => handleMouseEnter(gridIndex)}
              onClick={

                shipsReady ? (e) => isHit(e, gridIndex) : handlePlaceShip
              } // Updating placedShips and availableShips states and setting currentShip back to null
            ></div>
          );
        })}
      </div>
    </section>
  );
};

export default BattleRocketGrid;
