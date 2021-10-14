import { useEffect, useState } from "react";
import axios from "axios";

const GetRockets = () => {

  const [rockets, setRockets] = useState([])
  const [capsules, setCapsules] = useState([]);
  const [roadster, setRoadster] = useState([]);

  const [selected, setSelected] = useState({});
  const [selectedType, setSelectedType] = useState('');
  // Holds the roster of selected ships/rockets 
  // Will hold limited data - 
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





  return (
    <div className="rosterSelection">

      <div className="selectedInfo">

        {
          Object.keys(selected).length !== 0 ?

            (selectedType === 'rocket') ?
              <div>
                <h2>{selected.name}</h2>
                <p>Description: {selected.description}</p>
                <p>Type: {selected.type}</p>
                <p>First flight: {selected.first_flight}</p>
                <p>Height: {selected.height.meters}meters</p>
                <p>Stages: {selected.stages}</p>
                <p>Mass: {selected.mass.kg} kg</p>
                <p>Success rate: {selected.success_rate_pct}%</p>
                <img src={selected.flickr_images[0]} alt={selected.name} />
              </div>
              : null



            // // {/* Capsule */}

            // (selectedType === 'capsule') ?
            // ({
            //   <>
            //   <h2>Serial: {selected.serial}</h2>

            //   <p>Status: {selected.status}</p>
            //   <p>Last Update: {selected.last_update}</p>
            //   <p>Type: {selected.type}</p>
            //   <p>Reuse Count: {selected.reuse_count}</p>
            //   <p>Water Landings: {selected.water_landings}</p>
            //   <p>Land Landings: {selected.land_landings}</p>
            // </>
            // })
            // : null


            : null
        }



      </div>

      <form className="selectionForm">
        {/* Rocket Dropdown */}
        <label htmlFor="rockets">Select a Rocket:</label>
        <select name='rockets' id='rockets' onChange={(e) => {
          setSelected(rockets[e.target.value])
          setSelectedType('rocket')
        }}>
          <option value={null} selected disabled>-</option>
          {rockets.map((rocket, index) => <option key={rocket.id} id={rocket.id} value={index}>{rocket.name}</option>)}
        </select>

        {/* Capsule Dropdown */}
        <label htmlFor="capsules">Select a Capsule:</label>
        <select name='capsules' id='capsules'>
          <option value={null} selected disabled>-</option>
          {capsules.map((capsule) => <option key={capsule.id} id={capsule.id} value={capsule.serial}>{capsule.serial}</option>)}
        </select>

        {/* Roadster Selection */}
        <label htmlFor="roadster">Select Roadster (Elon would be proud):</label>
        <select name='roadster' id='roadster'>
          <option value={null} selected disabled>-</option>
          <option key={roadster.id} id={roadster.id} value={roadster.name}>{roadster.name}</option>
        </select>

      </form>

      <div className="selectedRoster">

      </div>

    </div>)

};

export default GetRockets;

// rockets
      // console.log(results.data);
      // company
      // name: 
      // description
      // type
      // first flight
      // height.meters
      // stages
      // mass
      // flickr_images[0] 
      // success_rate_pct

      // const {company, name, description, type, first_flight, height, stages, mass, flickr_images, success_rate_pct }

