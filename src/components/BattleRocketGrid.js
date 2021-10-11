import { useState, useEffect } from "react";

const BattleRocketGrid = () => {

  // An array of objects -> ship name, X and Y coords and if ship has been placed
  const allShips = [
    {
      name: "destroyer",
      length: 2,
      placed: false,
    },
    {
      name: "submarine",
      length: 3,
      placed: false,
    },
    {
      name: "cruiser",
      length: 3,
      placed: false,
    },
    {
      name: "battleship",
      length: 4,
      placed: false,
    },
    {
      name: "carrier",
      length: 5,
      placed: false,
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

  // Initializing grid array
  const gridArray = [];

  for (let i = 0; i < 100; i++) {
    gridArray.push(i);
  }

  // Used to toggle the orientation of the ship placement
  const rotateShip = (e) => {
    if (e.button === 2) {
      setHorizontal(!horizontal);
    }
  };

  // Handling the placement of the ships in real time
  const handleMouseEnter = (index) => {
    // Our ship position
    let shipPosition = index;

    // currentShip state will be empty before any ship has been selected and after any ship has been placed 
    if (currentShip) {

      // New ship coords array
      const newCoords = [];

      // Getting the new positions of each coordinate based on the chosen ship length and the orientation
      for (let i = 0; i < currentShip.length; i++) {
        newCoords.push(shipPosition);
        shipPosition = (horizontal ? shipPosition + 1 : shipPosition + 10);
      }

      // Logic to update the state if the coords are not out of bounds, dependent on orientation
      if (!handleOutOfBounds(newCoords, index)) {
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
    // Set the currentShip into the placedShip state with property placed = true
    setPlacedShips([...placedShips, { ...currentShip, placed: true }]);

    // Filtering out the currentShip from the availableShips
    setAvailableShips(availableShips.filter((ship) => ship.name !== currentShip.name));

    // Resetting the current ship
    setCurrentShip(null);
  }


  // Reset the whole grid and states
  const resetGrid = () => {
    setCurrentShip(null);
    setPlacedShips([]);
    setAvailableShips(allShips);
  };

  // Checking to see if the ship has already placed in a particular square of the grid
  const occupiedPlacedShip = (gridIndex) => {

    // Should return TRUE if any of the placed ships' coords include the gridIndex
    return (placedShips.some((placedShip) => {
      return placedShip.coords.includes(gridIndex);
    }));

  };

  // Checking to see which of the current state coords overlap with each grid square
  const occupiedCurrentShip = (gridIndex) => {
    if (currentShip) {
      if (currentShip.coords !== undefined) {
        return (currentShip.coords.includes(gridIndex));
      }
    } else {
      return false;
    }
  };

  // Checking to see if a particular square of the grid is occupied using either the placed or current ships
  const occupiedGridSquare = (gridIndex) => {

    // Could change this in the future to allow for different occupations to display different colours
    const isOccupied = (occupiedPlacedShip(gridIndex) || occupiedCurrentShip(gridIndex) ? "displayShip" : "");
    return isOccupied;

  };


  return (
    <section className="gameBoard">
      <div className="shipSelection">

        {/* Conditionally map the available ship selectors based on the availableShips state*/}
        {
          availableShips.map((availableShip) => {
            return (
              <div key={availableShip.name} className={`${availableShip.name}Select`} onClick={() => setCurrentShip(availableShip)}></div>
            )
          })
        }

        <p>Right click to rotate. </p>

        {/* Reset the grid and placed ships */}
        <button onClick={resetGrid}>Reset Grid</button>
      </div>
      <div
        className="gridContent"
        onMouseDown={rotateShip}
        onContextMenu={(e) => e.preventDefault()}
      >
        {gridArray.map((gridIndex) => {
          return (
            <div
              className={`gridSquare ${occupiedGridSquare(gridIndex) ? "displayShip" : ""}`}
              key={`square${gridIndex}`}
              onMouseEnter={() => handleMouseEnter(gridIndex)}
              onClick={handlePlaceShip} // Updating placedShips and availableShips states and setting currentShip back to null
            ></div>
          );
        })}
      </div>
    </section>
  );
};

export default BattleRocketGrid;