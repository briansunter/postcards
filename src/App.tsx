import React, { useEffect, useRef, useState } from "react";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";

import "./App.css";

function sleep(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}

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

function MapUpdater({ position }: { position: LatLngTuple }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 9);
  }, [map, position]);
  return null;
}

// Geocoding function using Nominatim
async function geocodeAddress(address: string): Promise<{ lat: number; lon: number } | null> {
  if (!address.trim()) return null;
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
  return null;
}

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlDataString = atob(urlParams.get("card") || "");

  const messagePlaceholder =
    "Write your message here...";
  const defaultUrlData: URLData = {
    frontImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    latitude: 42.3528,
    longitude: -83.1421,
    message: "",
    to: "",
    address: "",
    sender: "",
    isDefaultCard: true,
  };

  const [flip, setFlip] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

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
  
  const alreadySeenFlipHint =
    localStorage.getItem("pc:seenFlipHint") === "true";

  const [tutorialOpen, setTutorialOpen] = useState(
    state.isDefaultCard && !alreadySeenTutorial
  );
  
  const [flipHintOpen, setFlipHintOpen] = useState(
    !state.isDefaultCard && !alreadySeenFlipHint
  );

  const showTutorial = (shouldShow: boolean) => {
    setTutorialOpen(shouldShow);
    localStorage.setItem("pc:seenTutorial", !shouldShow ? "true" : "false");
  };

  const position: LatLngTuple = [state.latitude, state.longitude];
  const steps = [
    {
      content:
        "Welcome to PostcardPop! Create beautiful digital postcards to share with friends and family. Let's take a quick tour.",
      action: () => {
        setFlip(true);
      },
    },
    {
      content:
        "Click on the front image to change it. Use any image URL - we recommend Unsplash or Imgur for best results.",
      action: () => {
        setFlip(true);
      },
    },
    {
      content:
        "Tap anywhere on the postcard to flip it over and see the back.",
      action: () => {
        setFlip(true);
      },
    },
    {
      content:
        "Write your personal message here. Make it heartfelt and memorable!",
      action: () => {
        setFlip(false);
        sleep(1000).then(() => {
          showTutorial(false);
          showTutorial(true);
        });
      },
    },
    {
      content:
        "Type a city or address in the Location field and press Enter to update the map. Or drag the map to fine-tune the location.",
      action: () => {
        setFlip(false);
      },
    },
    {
      content:
        "Add the recipient's name and your name to personalize the postcard.",
      action: () => {
        setFlip(false);
      },
    },
    {
      content:
        "When you're done, copy the share link and send it to someone special!",
      action: () => {
        setFlip(false);
      },
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const linkTextRef = useRef<HTMLInputElement>(null);
  const imageTextRef = useRef<HTMLInputElement>(null);

  const cardData = btoa(JSON.stringify(state));

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      steps[currentStep].action?.();
      setCurrentStep(currentStep + 1);
    } else {
      showTutorial(false);
      setCurrentStep(0);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCloseTutorial = () => {
    showTutorial(false);
    setCurrentStep(0);
  };

  const handleCloseFlipHint = () => {
    setFlipHintOpen(false);
    localStorage.setItem("pc:seenFlipHint", "true");
  };

  const handleCopyLink = () => {
    if (linkTextRef.current) {
      linkTextRef.current.select();
      navigator.clipboard.writeText(linkTextRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle address input with geocoding
  const handleAddressChange = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const address = e.currentTarget.value;
      if (address.trim()) {
        setIsGeocoding(true);
        const result = await geocodeAddress(address);
        if (result) {
          setState((s) => ({
            ...s,
            latitude: result.lat,
            longitude: result.lon,
          }));
        }
        setIsGeocoding(false);
      }
    }
  };

  return (
    <div className="App" data-testid="home">
      <meta property="og:title" content="PostcardPop Card" />
      <meta property="og:image" content={state.frontImage} />

      {tutorialOpen && (
        <div className="tutorial-overlay" onClick={handleCloseTutorial}>
          <div className="tutorial-content" onClick={(e) => e.stopPropagation()}>
            <button className="tutorial-close" onClick={handleCloseTutorial}>
              ×
            </button>
            
            <div className="tutorial-step">
              <div className="tutorial-step-number">{currentStep + 1}</div>
              <span className="tutorial-step-label">Step {currentStep + 1} of {steps.length}</span>
            </div>
            
            <div className="tutorial-text">{steps[currentStep].content}</div>
            
            <div className="tutorial-buttons">
              {currentStep > 0 ? (
                <button className="tutorial-btn tutorial-btn-prev" onClick={handlePrevStep}>
                  ← Back
                </button>
              ) : (
                <div />
              )}
              
              {currentStep < steps.length - 1 ? (
                <button className="tutorial-btn tutorial-btn-next" onClick={handleNextStep}>
                  Next →
                </button>
              ) : (
                <button className="tutorial-btn tutorial-btn-done" onClick={handleCloseTutorial}>
                  Get Started ✨
                </button>
              )}
            </div>
            
            <div className="tutorial-progress">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`tutorial-progress-dot ${idx <= currentStep ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Simple flip hint for received postcards */}
      {flipHintOpen && (
        <div className="tutorial-overlay" onClick={handleCloseFlipHint}>
          <div className="tutorial-content flip-hint-content" onClick={(e) => e.stopPropagation()}>
            <button className="tutorial-close" onClick={handleCloseFlipHint}>
              ×
            </button>
            
            <div className="flip-hint-icon-large">🎴</div>
            
            <div className="tutorial-text" style={{ textAlign: 'center', fontSize: '1.25rem' }}>
              <strong>You've received a postcard!</strong><br /><br />
              Click the card to flip it over and read the message.
            </div>
            
            <div className="tutorial-buttons" style={{ justifyContent: 'center' }}>
              <button className="tutorial-btn tutorial-btn-done" onClick={handleCloseFlipHint}>
                Got it! 👍
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="header">
        <a href="./" className="title">
          <span className="title-icon">✉</span>
          PostcardPop
        </a>
        <p className="subtitle">Create & share beautiful digital postcards</p>
      </header>

      <div className="post-card-container">
        <div className="flip-card" onClick={() => setFlip(!flip)}>
          <div className={`flip-card-inner ${flip ? "flip-card-toggle-on" : "flip-card-toggle-off"}`}>
            {/* Front Side */}
            <div className="flip-card-front">
              <div className="front-image-container">
                <img className="front-img" src={state.frontImage} alt="Postcard front" />
                {state.isDefaultCard && (
                  <>
                    <input
                      type="text"
                      className="front-image-input"
                      value={state.frontImage}
                      ref={imageTextRef}
                      placeholder="Paste image URL here..."
                      onChange={(e) => {
                        setState({ ...state, frontImage: e.target.value });
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                    <div className="image-hint">💡 Click to edit image URL</div>
                  </>
                )}
              </div>
            </div>

            {/* Back Side */}
            <div className="flip-card-back">
              <div className="back-content">
                {/* Left Section - Message */}
                <div className="left-section">
                  <div className="message-area">
                    <label className="message-label">Message</label>
                    {state.isDefaultCard ? (
                      <textarea
                        className="message-textarea"
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
                      <div className="message-display">{state.message || "No message written"}</div>
                    )}
                  </div>
                </div>

                <div className="divider" />

                {/* Right Section - Stamp & Address */}
                <div className="right-section">
                  <div className="stamp-section">
                    <div 
                      className="stamp-container"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <div className="stamp-border" />
                      <MapContainer
                        className="stamp-map"
                        center={position}
                        zoom={9}
                        attributionControl={false}
                        zoomControl={false}
                        scrollWheelZoom={false}
                      >
                        <MapUpdater position={position} />
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution=""
                        />
                      </MapContainer>
                      {isGeocoding && (
                        <div className="stamp-loading">
                          <div className="loading-spinner" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="address-section">
                    {state.isDefaultCard ? (
                      <input
                        type="text"
                        className="address-input"
                        placeholder="To: Recipient name"
                        value={state.to}
                        onChange={(e) => {
                          setState({ ...state, to: e.target.value });
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    ) : (
                      <div className="address-display">{state.to && `To: ${state.to}`}</div>
                    )}

                    {state.isDefaultCard ? (
                      <div className="location-input-wrapper">
                        <input
                          type="text"
                          className="address-input"
                          placeholder="Location (type city & press Enter)"
                          value={state.address}
                          onChange={(e) => {
                            setState({ ...state, address: e.target.value });
                          }}
                          onKeyDown={handleAddressChange}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        />
                        <span className="location-hint">↵</span>
                      </div>
                    ) : (
                      <div className="address-display">{state.address}</div>
                    )}

                    {state.isDefaultCard ? (
                      <input
                        type="text"
                        className="address-input"
                        placeholder="From: Your name"
                        value={state.sender}
                        onChange={(e) => {
                          setState({ ...state, sender: e.target.value });
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    ) : (
                      <div className="address-display">{state.sender && `From: ${state.sender}`}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flip-hint">
          Click card to flip
        </div>
      </div>

      <div className="actions">
        <div className="action-row">
          {!state.isDefaultCard ? (
            <a className="btn btn-primary" href="./">
              ✨ Create Your Own
            </a>
          ) : (
            <button className="btn btn-secondary" onClick={() => showTutorial(true)}>
              ❓ Show Tutorial
            </button>
          )}
        </div>

        {state.isDefaultCard && (
          <div className="share-section">
            <label className="share-label">Share your postcard</label>
            <div className="share-input-wrapper">
              <input
                type="text"
                className="share-input"
                ref={linkTextRef}
                value={`${window.location.origin}${window.location.pathname}?card=${cardData}`}
                readOnly
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                }}
              />
              <button 
                className={`btn-copy ${copied ? 'copied' : ''}`}
                onClick={handleCopyLink}
              >
                {copied ? '✓ Copied!' : '📋 Copy Link'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
