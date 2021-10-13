import { useEffect, useState } from "react";
import axios from "axios";

const GetRockets = () => {
  
  const [rockets, setRockets] = useState([])

    const apiEndpoint = "https://api.spacexdata.com/v4";

    useEffect(() => {
        
    axios({
        url: `${apiEndpoint}/rockets`,
    }).then((results) => {

        // const {company, name, description, type, first_flight, height, stages, mass, flickr_images, success_rate_pct }
       setRockets(results.data);

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

    });

  }, []);

  

  return (
  <div>
    <label htmlFor="rockets">Select a rocket:</label>
    <select name ='rockets' id='rockets'>
     
        {
          rockets.map((rocket)=>{
            return (
                <option key={rocket.id} id={rocket.id} value={rocket.name}>{rocket.name}</option>
            )
          })
      }
    </select>

  </div>)
};

export default GetRockets;
