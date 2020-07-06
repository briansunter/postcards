import React, { RefObject, createRef, useState } from "react";

import { Map, TileLayer } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import Tour from "reactour";

import "leaflet/dist/leaflet.css";

import "./App.css";

function sleep(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}

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
      "This is the Internet version of sending a postcard home. Use this to send and receive unique flippable postcards. Click on any of these text fields or the map to edit them. Click on the card to flip it.",
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

  const alreadySeenTutorial =
    localStorage.getItem("pc:seenTutorial") === "true";

  const [tutorialOpen, setTutorialOpen] = useState(
    isDefaultCard && !alreadySeenTutorial
  );

  const showTutorial = (shouldShow: boolean) => {
    setTutorialOpen(shouldShow);
    localStorage.setItem("pc:seenTutorial", !shouldShow ? "true" : "false");
  };

  const position: LatLngTuple = [state.latitude, state.longitude];
  const steps = [
    {
      selector: ".App",
      content:
        "Welcome to PostcardPop, a way of making digital postcards to send to your friends. This is the tutorial. Click the next arrow to go to the next tutorial step or click 'x' to exit.",
      action: () => {
        setFlip(true);
      },
    },
    {
      selector: ".frontImgInput",
      content:
        "This is where you can select a nice cover image for your postcard. Make sure sure your image site supports embedding. I recommend https://imgur.com.",
      action: () => {
        setFlip(true);
      },
    },
    {
      selector: ".front-img",
      content: "Tap anywhere on the card to flip.",
      action: () => {
        setFlip(true);
      },
    },
    {
      selector: ".left-content",
      content: "This is the area to write your message.",
      action: () => {
        setFlip(false);
        sleep(1000).then(() => {
          showTutorial(false);
          showTutorial(true);
        });
      },
    },
    {
      selector: ".stamp",
      content:
        "Instead of a 'stamp', use a small map of your current location from OpenStreetMaps. You can drag to change the location. You can also update the latitude and longitude boxes below",
      action: () => {
        setFlip(false);
      },
    },
    {
      selector: ".address",
      content:
        "Add the person you're sending the postcard to and their city here.",
      action: () => {
        setFlip(false);
      },
    },
    {
      selector: ".shareLink",
      content:
        "This is the link to share your postcard. Send it to someone so they can view it.",
      action: () => {
        setFlip(false);
      },
    },
  ];
  const linkTextRef: RefObject<HTMLTextAreaElement> = createRef();

  const cardData = btoa(JSON.stringify(state));
  return (
    <div className="App" data-testid="home">
      <a href="./" className="title">
        PostcardPop ✉
      </a>
      <meta property="og:image" content={state.frontImage} />

      <Tour
        closeWithMask={false}
        steps={steps}
        isOpen={tutorialOpen}
        lastStepNextButton={<button className="makeOwnButton">Done!</button>}
        onRequestClose={() => showTutorial(false)}
      />
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
                  className="frontImgInput"
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
                    <input
                      type="text"
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
                    <input
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
                    <label>
                      TO:
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
                    </label>
                  ) : (
                    <p className="address">TO: {state.to}</p>
                  )}
                  {isDefaultCard ? (
                    <label>
                      Address:
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
                    </label>
                  ) : (
                    <p className="address">{state.address}</p>
                  )}
                  {isDefaultCard ? (
                    <label>
                      From:
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
                    </label>
                  ) : (
                    <p className="address">FROM: {state.sender}</p>
                  )}
                  {isDefaultCard && (
                    <div>
                      <textarea
                        className="shareLink"
                        ref={linkTextRef}
                        value={`${window.location.href}?card=${cardData}`}
                        onClick={(e: any) => {
                          e.stopPropagation();
                          linkTextRef.current?.select();
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
      {!isDefaultCard ? (
        <a className="makeOwnButton" href="./">
          Make your own
        </a>
      ) : (
        <a
          className="makeOwnButton"
          href="./"
          onClick={() => showTutorial(true)}
        >
          Show Tutorial
        </a>
      )}
    </div>
  );
}

export default App;
