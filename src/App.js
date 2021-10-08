import "./App.scss";
import axios from "axios";

function App() {
  axios({
    url: "https://api.spacexdata.com/v4/rockets",
  }).then((results) => {
    console.log(results);
  });

  return (
    <div className="wrapper">
      <h1>Battle Rockets</h1>
    </div>
  );
}

export default App;
