import React, { useState } from "react";

import "./App.css";

function App() {
  const urlParams = new URLSearchParams(window.location.search);

  const frontImage = urlParams.get("front_image");
  const stampImage = urlParams.get("stamp_image");
  const message = atob(urlParams.get("message") || "");
  const name = atob(urlParams.get("name") || "");
  const street = atob(urlParams.get("street") || "");
  const state = atob(urlParams.get("state") || "");
  const [flip, setFlip] = useState(false);

  const defaultStamp = "https://i.imgur.com/ktLaE2K.jpeg";
  const defaultFront = "https://i.imgur.com/YMP3MRq.jpg";

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
              <img
                className="front-img"
                src={frontImage || defaultFront}
                alt="Avatar"
              />
            </div>
            <div className="flip-card-back">
              <div className="left-content">
                <p className="writing">{message}</p>
              </div>
              <div className="right-content">
                <div className="stamp-container">
                  <img
                    className="stamp"
                    src={stampImage || defaultStamp}
                    alt="Avatar"
                  />
                </div>
                <div className="addressBox">
                  <p className="address">{name} </p>
                  <p className="address"> {street} </p>
                  <p className="address"> {state} </p>
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
