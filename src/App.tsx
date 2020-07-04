import React from "react";
import "./App.css";
import Front from "./img/miami.png";
import Stamp from "./img/stamp.jpg";

function App() {
  return (
    <div className="App" data-testid="home">
      <div className="post-card">
        <div className="flip-card">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img className="front-img" src={Front} alt="Avatar" />
            </div>
            <div className="flip-card-back">
              <div className="left-content">
                <p className="writing">
                  I feel bare. I didn't realize I wore my secrets as armor until
                  they were gone and now everyone sees me as I really am.
                </p>
              </div>
              <div className="right-content">
                <div className="stamp-container">
                  <img className="stamp" src={Stamp} alt="Avatar" />
                </div>
                <div className="addressBox">
                  <p className="address">Shay Marie</p>
                  <p className="address"> 123 Suntree</p>
                  <p className="address"> Melbourne, Fl 94107</p>
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
