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

  const [flip, setFlip] = useState(true);

  const [state, setState] = useState(urlData);

  const position: LatLngTuple = [state.latitude, state.longitude];

  const cardData = btoa(JSON.stringify(state));

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
              <img className="front-img" src={state.frontImage} alt="Avatar" />
              {isDefaultCard && (
                <input
                  type="text"
                  value={state.frontImage}
                  onChange={(e) => {
                    setState({ ...state, frontImage: e.target.value });
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              )}
            </div>
            <div className="flip-card-back">
              <div className="left-content">
                {isDefaultCard ? (
                  <textarea
                    className="writing"
                    value={state.message}
                    onChange={(e) => {
                      setState({ ...state, message: e.target.value });
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                ) : (
                  <p className="writing">{state.message}</p>
                )}
              </div>
              <div className="middleLine" />
              <div className="right-content">
                <div
                  className="stamp-container"
                  onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Map
                    className="stamp"
                    id="mapId"
                    center={position}
                    zoom={9}
                    attributionControl={false}
                    onMoveEnd={(e: any) => {
                      const { lat, lng } = e.target.getCenter();
                      setState({ ...state, latitude: lat, longitude: lng });
                    }}
                    zoomControl={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution=""
                    />
                  </Map>
                </div>
                {isDefaultCard && (
                  <label>
                    Latitude:
                    <textarea
                      value={Intl.NumberFormat(navigator.language, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 10,
                      }).format(state.latitude)}
                      onChange={(e) => {
                        const newLat = parseFloat(e.target.value);
                        if (newLat) {
                          setState({ ...state, latitude: newLat });
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  </label>
                )}
                {isDefaultCard && (
                  <label>
                    Longitude:
                    <textarea
                      value={Intl.NumberFormat(navigator.language, {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 10,
                      }).format(state.longitude)}
                      onChange={(e) => {
                        const newLong = parseFloat(e.target.value);
                        if (newLong) {
                          setState({ ...state, longitude: newLong });
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  </label>
                )}
                <div className="addressBox">
                  {isDefaultCard ? (
                    <input
                      type="text"
                      className="address"
                      value={state.to}
                      onChange={(e) => {
                        setState({ ...state, to: e.target.value });
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  ) : (
                    <p className="address">TO: {state.to}</p>
                  )}
                  {isDefaultCard ? (
                    <input
                      type="text"
                      className="address"
                      value={state.address}
                      onChange={(e) => {
                        setState({ ...state, address: e.target.value });
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  ) : (
                    <p className="address">{state.address}</p>
                  )}
                  {isDefaultCard ? (
                    <input
                      type="text"
                      className="address"
                      value={state.sender}
                      onChange={(e) => {
                        setState({ ...state, sender: e.target.value });
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  ) : (
                    <p className="address">FROM: {state.sender}</p>
                  )}
                  {isDefaultCard && (
                    <div>
                      <textarea
                        value={`${window.location.href}?card=${cardData}`}
                        onClick={(e: any) => {
                          e.stopPropagation();
                        }}
                      />
                    </div>
                  )}
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
