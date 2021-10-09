import { useEffect, useState } from 'react';

const BattleRocketGrid = () => {

  const [ship, setShip] = useState({});

  const gridArray = [];

  for (let i = 0; i < 100; i++) {
    gridArray.push(i);
  }


  // An array of objects -> ship name and X and Y coords
  const allShips = [
    {
      name: "destroyer",
      coords: [[0, 1], [0, 10]]
    },
    {
      name: "submarine",
      coords: [[0, 1, 2], [0, 10, 20]]
    },
    {
      name: "cruiser",
      coords: [[0, 1, 2], [0, 10, 20]]
    },
    {
      name: "battleship",
      coords: [[0, 1, 2, 3], [0, 10, 20, 30]]
    },
    {
      name: "carrier",
      coords: [[0, 1, 2, 3, 4], [0, 10, 20, 30, 40]]
    }
  ];

  // console.log(ships);

  const handleClick = (shipType, index) => {
    // Our ship object
    const newShip = allShips[shipType];

    // Ship horizontal coords
    newShip.coords[0] = newShip.coords[0].map((coord) => {
      return coord + index;
    });

    // Ship vertical coords
    newShip.coords[1] = newShip.coords[1].map((coord) => {
      return coord + index;
    });
    
    setShip(newShip);


  };


  return (
    <section className="grid">
      <div className="gridContent">
        {
          gridArray.map((gridIndex) => {
            return (
              <div
                // The 0 is hard coded for horizontal coords
                className={`gridSquare ${ship.coords[0].includes(gridIndex) ? 'blue' : null}`}
                key={`square${gridIndex}`}
                // The 3 is hard coded for a battleship
                onClick={() => handleClick(3, gridIndex)}></div>
            )
          })
        }
      </div>
    </section >
  );
};

export default BattleRocketGrid;
