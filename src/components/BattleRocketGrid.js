import { useEffect, useState } from 'react';
import Draggable from 'react-draggable';

const BattleRocketGrid = () => {

  const [ship, setShip] = useState({
    name: "default",
    coords: [[],[]]
  });

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


  const handleClick = (shipType, index) => {
    // Our ship object
    const orientation = 'horizontal';
    const newShip = allShips[shipType];
    
    // Ship horizontal coords array
    const newCoordsX = newShip.coords[0].map((coordX) => {
      
      return coordX + index;
    });

    // Ship vertical coords array
    const newCoordsY = newShip.coords[1].map((coordY) => {
      return coordY + index;
    });
    
    const outOfBoundsX = newCoordsX.some(coordX => {
      return (
        Math.floor (coordX / 10) !== Math.floor (index / 10)
      )
    });

    const outOfBoundsY = newCoordsY.some(coordY => coordY > 99);

    // Logic to update the state if out of bounds dependent on orientation
    if ((orientation === 'horizontal' && !outOfBoundsX) || (orientation === 'vertical' && !outOfBoundsY)) {
      newShip.coords = [newCoordsX, newCoordsY];
      setShip(newShip);
    } 

  };


  const [clicked, setClicked] = useState(false);


  return (
    <>
      
      <section className="grid">
        <div className="gridContent">
          {
            gridArray.map((gridIndex) => {
              return (
                <div
                  // The 0 is hard coded for horizontal coords
                  className={`gridSquare ${ship.coords[0].includes(gridIndex) ? 'blue' : ''}`}
                  key={`square${gridIndex}`}
                  // The 3 is hard coded for a battleship
                  onMouseEnter={clicked ? null : () => handleClick(3, gridIndex)}
                  onClick={() => setClicked(true)}
                
                  ></div>
              )
            })
          }
        </div>
      </section >
    </>
  );
};

export default BattleRocketGrid;
