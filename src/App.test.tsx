import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

// Mock react-leaflet since it uses ES modules
jest.mock("react-leaflet", () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  useMap: () => ({
    setView: jest.fn(),
  }),
}));

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};
Object.defineProperty(global, "navigator", {
  value: { geolocation: mockGeolocation },
  writable: true,
});

test("renders PostcardPop app", () => {
  const { getByTestId } = render(<App />);
  const appElement = getByTestId("home");
  expect(appElement).toBeInTheDocument();
});
