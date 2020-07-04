import React, { useState } from "react";
import { Map, TileLayer } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

import "./App.css";

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlDataString = atob(urlParams.get("card") || "");
  interface URLData {
    frontImage: string;
    latitude: number;
    longitude: number;
    message: string;
    to: string;
    address: string;
    sender: string;
  }

  let isDefaultCard = true;

  let urlData: URLData;
  const defaultUrlData: URLData = {
    frontImage: "https://i.imgur.com/TOpuoX2.jpg",
    latitude: 42.3528,
    longitude: -83.1421,
    message:
      "This is the internet version of sending a postcard home. Use this to send and receive unique flippable postcards. Click on any of these text fields or the map to edit them. Click on the card to flip it.",
    to: "Someone Special",
    address: "San Francisco, CA",
    sender: "Brian Sunter",
  };
  try {
    urlData = JSON.parse(urlDataString);
    isDefaultCard = false;
  } catch (e) {
    urlData = defaultUrlData;
    console.log("could not parse data", e);
  }

  const {
    frontImage,
    latitude,
    longitude,
    message,
    to,
    address,
    sender,
  } = urlData;

  const [flip, setFlip] = useState(true);

  const position: LatLngTuple = [latitude, longitude];

  return (
    <div className="App" data-testid="home">
      <div className="post-card">
        <div className="flip-card">
          <div
            onClick={() => setFlip(!flip)}
            className={`flip-card-inner ${
              flip ? "flip-card-togggle-on" : "flip-card-toggle-off"
            }`}
          >
            <div className="flip-card-front">
              <img className="front-img" src={frontImage} alt="Avatar" />
            </div>
            <div className="flip-card-back">
              <div className="left-content">
                <p className="writing">{message}</p>
              </div>
              <div className="middleLine" />
              <div className="right-content">
                <div className="stamp-container">
                  <Map
                    className="stamp"
                    id="mapId"
                    center={position}
                    zoom={9}
                    attributionControl={false}
                    zoomControl={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution=""
                    />
                  </Map>
                </div>
                <div className="addressBox">
                  <p className="address">TO: {to} </p>
                  <p className="address"> {address} </p>
                  <p className="address">FROM: {sender} </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
