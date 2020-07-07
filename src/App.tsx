import React, { useEffect, RefObject, createRef, useState } from "react";

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
    isDefaultCard: boolean;
  }

  const messagePlaceholder =
    "This is the Internet version of sending a postcard home. Use this to send and receive unique flippable postcards. Click on any of these text fields or the map to edit them. Click on the card to flip it.";
  const defaultUrlData: URLData = {
    frontImage: "https://i.imgur.com/TOpuoX2.jpg",
    latitude: 42.3528,
    longitude: -83.1421,
    message: "",
    to: "",
    address: "",
    sender: "",
    isDefaultCard: true,
  };

  const [flip, setFlip] = useState(true);

  const [state, setState] = useState(defaultUrlData);

  useEffect(() => {
    try {
      const urlData: URLData = JSON.parse(urlDataString);
      setState({ ...urlData, isDefaultCard: false });
    } catch (e) {
      console.log("could not parse data", e);
    }
  }, [urlDataString]);

  const isDefaultCard = state.isDefaultCard;

  useEffect(() => {
    if (isDefaultCard) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setState((s) => ({
          ...s,
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        }));
      });
    }
  }, [isDefaultCard]);

  const alreadySeenTutorial =
    localStorage.getItem("pc:seenTutorial") === "true";

  const [tutorialOpen, setTutorialOpen] = useState(
    state.isDefaultCard && !alreadySeenTutorial
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
  const linkTextRef: RefObject<HTMLInputElement> = createRef();
  const imageTextRef: RefObject<HTMLInputElement> = createRef();

  const cardData = btoa(JSON.stringify(state));

  return (
    <div className="App" data-testid="home">
      <a href="./" className="title">
        ✉PostcardPop
      </a>
      <meta property="og:title" content="PostcardPop Card" />
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
              {state.isDefaultCard && (
                <input
                  type="text"
                  className="frontImgInput"
                  value={state.frontImage}
                  ref={imageTextRef}
                  onChange={(e) => {
                    imageTextRef.current?.select();
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
                {state.isDefaultCard ? (
                  <textarea
                    className="writing"
                    placeholder={messagePlaceholder}
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
                <div className="addressBox">
                  {state.isDefaultCard ? (
                    <input
                      type="text"
                      className="address"
                      placeholder="Recipient name"
                      value={state.to}
                      onChange={(e) => {
                        setState({ ...state, to: e.target.value });
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  ) : (
                    <p className="address">{state.to}</p>
                  )}
                  {state.isDefaultCard ? (
                    <input
                      type="text"
                      className="address"
                      placeholder="Recipient city"
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
                  {state.isDefaultCard ? (
                    <input
                      type="text"
                      className="address"
                      placeholder="Your name"
                      value={state.sender}
                      onChange={(e) => {
                        setState({ ...state, sender: e.target.value });
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  ) : (
                    <p className="address">{state.sender}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {state.isDefaultCard && (
        <label className="shareLinkLabel">
          Share Link:
          <input
            type="text"
            className="shareLink"
            ref={linkTextRef}
            value={`${window.location.href}?card=${cardData}`}
            onClick={(e: any) => {
              e.stopPropagation();
              linkTextRef.current?.select();
            }}
          />
        </label>
      )}
      {!state.isDefaultCard ? (
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
