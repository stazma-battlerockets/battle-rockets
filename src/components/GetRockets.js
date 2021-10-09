import { useEffect, useState } from "react";
import axios from "axios";

const GetRockets = () => {
  const [rockets, setRocket] = useState([]);

  useEffect(() => {
    axios({
      url: "https://api.spacexdata.com/v4/rockets",
    }).then((results) => {
      // console.log(results.data);
    });
  }, []);

  return <div></div>;
};

export default GetRockets;
