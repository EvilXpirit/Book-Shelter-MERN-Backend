const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'places.json');

// Read places from file
const loadPlaces = () => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

// Save places to file
const savePlaces = (places) => {
  const dataJSON = JSON.stringify(places);
  fs.writeFileSync(filePath, dataJSON);
};

const getPlaces = () => {
  return loadPlaces();
};

const addPlace = (place) => {
  const places = loadPlaces();
  places.push(place);
  savePlaces(places);
};

module.exports = {
  getPlaces,
  addPlace,
};
