import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCQdqQNcM9zw_6cOkZ586OvIdNw1_cusg0",
    authDomain: "battle-rockets.firebaseapp.com",
    databaseURL: "https://battle-rockets-default-rtdb.firebaseio.com",
    projectId: "battle-rockets",
    storageBucket: "battle-rockets.appspot.com",
    messagingSenderId: "72544122425",
    appId: "1:72544122425:web:cbe5d04f1f410d4ed7ffe8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const realtime = getDatabase(app);

export default realtime;