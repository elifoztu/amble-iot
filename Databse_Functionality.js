// Variables/nodes needed to utilize Firebase in this JS program
const { initializeApp } = require('firebase/app');
var nodeimu = require('@trbll/nodeimu');
var IMU = new nodeimu.IMU();
var sense = require('@trbll/sense-hat-led');
const { getDatabase, ref, onValue, set, update, get } = require('firebase/database');

// Our realtime database Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwftLGn3PIuWMm1KxPFuG3XJEq69RPIxQ",
  authDomain: "amble-bfa94.firebaseapp.com",
  databaseURL: "https://amble-bfa94-default-rtdb.firebaseio.com",
  projectId: "amble-bfa94",
  storageBucket: "amble-bfa94.firebasestorage.app",
  messagingSenderId: "765015893097",
  appId: "1:765015893097:web:d24ffa4a090ed8d023aef8",
  measurementId: "G-EG5MBM5YH6"
};

// Create references to each branch of the database
const health = ref(database, 'health'); // to be used to interact with health variables
const vibes = ref(database, 'vibes'); // to be used to interact with vibes variables
const lamp = ref(database, 'lamp'); // to be used to interact with lamp variables

