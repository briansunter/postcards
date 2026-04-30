import { render } from "@testing-library/react";
import { vi } from "vitest";
import App from "./App";

// Mock react-leaflet since it uses ES modules
vi.mock("react-leaflet", () => ({
	MapContainer: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="map-container">{children}</div>
	),
	TileLayer: () => <div data-testid="tile-layer" />,
	useMap: () => ({
		setView: vi.fn(),
	}),
}));

// Mock matchMedia for theme detection
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// Mock geolocation
const mockGeolocation = {
	getCurrentPosition: vi.fn(),
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
