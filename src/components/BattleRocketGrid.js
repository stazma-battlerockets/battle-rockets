import { useState, useEffect, useCallback } from "react";

const BattleRocketGrid = () => {
  // State to hold ship object
  const [ship, setShip] = useState({
    name: "default",
    coords: [],
  });

  // State to hold ship direction
  const [horizontal, setHorizontal] = useState(true);

  // State to toggle the coordinate array index
  const [coordToggle, setCoordToggle] = useState(0);

  // State to choose ship based on user click
  const [shipType, setShipType] = useState(3);

  // State to display ships on the grid
  const [placedShips, setPlacedShips] = useState([]);

  //
  const [clicked, setClicked] = useState(false);

  // Initializing grid array
  const gridArray = [];

  for (let i = 0; i < 100; i++) {
    gridArray.push(i);
  }

  // An array of objects -> ship name and X and Y coords
  const allShips = [
    {
      name: "destroyer",
      coords: [
        [0, 1],
        [0, 10],
      ],
      placed: null,
    },
    {
      name: "submarine",
      coords: [
        [0, 1, 2],
        [0, 10, 20],
      ],
      placed: null,
    },
    {
      name: "cruiser",
      coords: [
        [0, 1, 2],
        [0, 10, 20],
      ],
      placed: null,
    },
    {
      name: "battleship",
      coords: [
        [0, 1, 2, 3],
        [0, 10, 20, 30],
      ],
      placed: null,
    },
    {
      name: "carrier",
      coords: [
        [0, 1, 2, 3, 4],
        [0, 10, 20, 30, 40],
      ],
      placed: null,
    },
  ];

  // Toggle the coordToggle state whenever the horizontal state is changed
  useEffect(() => {
    setCoordToggle(horizontal ? 0 : 1);
  }, [horizontal]);

  // Used to toggle the orientation of the ship placement
  const rotateShip = (e) => {
    if (e.button === 2) {
      setHorizontal(!horizontal);
    }
  };

  // Handling the placement of the ships in real time
  const handleMouseEnter = (index) => {
    // Our ship object
    const newShip = allShips[shipType];

    // Placed ship coords array
    const newCoords = newShip.coords[coordToggle].map((coord) => {
      return coord + index;
    });

    let outOfBounds = false;

    if (horizontal) {
      outOfBounds = newCoords.some((coordX) => {
        // eg. 37, 38, 39, 40 -> after the Math.floor -> 3, 3, 3, 4
        return Math.floor(coordX / 10) !== Math.floor(index / 10);
      });
    } else if (!horizontal) {
      outOfBounds = newCoords.some((coordY) => coordY > 99);
    }

    // Logic to update the state if out of bounds dependent on orientation
    if (!outOfBounds) {
      newShip.coords = newCoords;
      setShip(newShip);
    }
  };

  return (
    <section className="gameBoard">
      <div className="shipSelection">
        <div className="destroyerSelect" onClick={() => setShipType(0)}></div>
        <div className="submarineSelect" onClick={() => setShipType(1)}></div>
        <div className="cruiserSelect" onClick={() => setShipType(2)}></div>
        <div className="battleshipSelect" onClick={() => setShipType(3)}></div>
        <div className="carrierSelect" onClick={() => setShipType(4)}></div>

        <p>Right click to rotate.</p>
      </div>
      <div
        className="gridContent"
        onMouseDown={rotateShip}
        onContextMenu={(e) => e.preventDefault()}
      >
        {gridArray.map((gridIndex) => {
          return (
            <div
              className={`gridSquare ${
                ship.coords.includes(gridIndex) ? "displayShip" : ""
              }`}
              key={`square${gridIndex}`}
              onMouseEnter={clicked ? null : () => handleMouseEnter(gridIndex)}
              onClick={() => setClicked(!clicked)}
            ></div>
          );
        })}
      </div>
    </section>
  );
};

export default BattleRocketGrid;
