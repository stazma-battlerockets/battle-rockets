import { useEffect, useState } from "react";
import { ref, set } from "firebase/database";
import realtime from "./firebase";
import axios from "axios";
import { Link } from "react-router-dom";

// Get rockets
// Display the available roster with unit information
// Let the user select roster of rockets, when a unit is selected, remove the unit from the roster list
const GetRockets = ({ player }) => {
  // States to hold the info from each API call
  const [rockets, setRockets] = useState([]);
  const [capsules, setCapsules] = useState([]);
  const [roadster, setRoadster] = useState([]);

  const [selected, setSelected] = useState({});
  const [selectedType, setSelectedType] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Holds the roster of selected ships/rockets
  const [selectedRoster, setSelectedRoster] = useState([]);

  const apiEndpoint = "https://api.spacexdata.com/v4";

  useEffect(() => {
    axios({
      url: `${apiEndpoint}/rockets`,
    }).then((results) => {
      setRockets(results.data);
    });

    axios({
      url: `${apiEndpoint}/capsules`,
    }).then((results) => {
      setCapsules(results.data);
    });

    axios({
      url: `${apiEndpoint}/roadster`,
    }).then((results) => {
      setRoadster(results.data);
    });
  }, []);

  const storeRoster = (rocket) => {
    setSelectedRoster([...selectedRoster, rocket]);
  };

  // Removing items from the list once they are added to roster
  const removeRocket = () => {
    const newRocketArray = [...rockets];

    newRocketArray.splice(selectedIndex, 1);

    setRockets(newRocketArray);
  };

  // Store roster in firebase
  const firebaseRoster = (player) => {
    const playerNodeRef = ref(realtime, `players/${player}/roster`);

    let playerRoster = selectedRoster;

    set(playerNodeRef, playerRoster);
  };

  return (
    <div className="rosterSelection">
      <form className="selectionForm">
        {/* Rocket Dropdown */}
        <label htmlFor="rockets">Select a Rocket:</label>
        <select
          name="rockets"
          id="rockets"
          onChange={(e) => {
            setSelected(rockets[e.target.value]);
            setSelectedType("rocket");
            setSelectedIndex(e.target.value);
          }}
          value={selected.name}
        >
          <option value={null} selected disabled>
            -
          </option>
          {rockets.map((rocket, index) => (
            <option key={rocket.id} id={rocket.id} value={index}>
              {rocket.name}
            </option>
          ))}
        </select>

        {/* Capsule Dropdown */}
        <label htmlFor="capsules">Select a Capsule:</label>
        <select name="capsules" id="capsules">
          <option value={null} selected disabled>
            -
          </option>
          {capsules.map((capsule) => (
            <option key={capsule.id} id={capsule.id} value={capsule.serial}>
              {capsule.serial}
            </option>
          ))}
        </select>

        {/* Roadster Selection */}
        <label htmlFor="roadster">Select Roadster (Elon would be proud):</label>
        <select name="roadster" id="roadster">
          <option value={null} selected disabled>
            -
          </option>
          <option key={roadster.id} id={roadster.id} value={roadster.name}>
            {roadster.name}
          </option>
        </select>
      </form>

      <div className="selectedInfo">
        {Object.keys(selected).length !== 0 ? (
          selectedType === "rocket" ? (
            <>
              <h2>{selected.name}</h2>
              <div className="shipInfo">
                <div className="imageContainer">
                  <img src={selected.flickr_images[0]} alt={selected.name} />
                </div>
                <div className="infoContainer">
                  <p>Description: {selected.description}</p>
                  <p>Type: {selected.type}</p>
                  <p>First flight: {selected.first_flight}</p>
                  <p>Height: {selected.height.meters} meters</p>
                  <p>Stages: {selected.stages}</p>
                  <p>Mass: {selected.mass.kg} kg</p>
                  <p>Success rate: {selected.success_rate_pct}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  storeRoster({
                    name: selected.name,
                    type: selected.type,
                  });
                  removeRocket();
                }}
              >
                Add to your roster
              </button>
            </>
          ) : null
        ) : null}
      </div>

      <h2>Your Current Roster</h2>
      {selectedRoster.length !== 5
        ? selectedRoster.map((rocket) => {
            return (
              <div className="selectedRoster">
                <p>{rocket.name}</p>
              </div>
            );
          })
        : null}

      <Link to={`/player${player}/game`}>
        <button>GAME TIME!</button>
      </Link>
    </div>
  );
};

export default GetRockets;
