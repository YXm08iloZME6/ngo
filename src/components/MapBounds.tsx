import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { LatLngBounds, LatLngExpression } from "leaflet";

interface MapBoundsProps {
	onBoundsChange?: (bounds: LatLngBounds) => void;
	coords?: LatLngExpression;
}

export default function MapBounds({ onBoundsChange, coords }: MapBoundsProps) {
	const map = useMap();

	useEffect(() => {
		if (!coords) return;

		map.flyTo(coords, 12, { duration: 1.2 });
	}, [map, coords]);

	useEffect(() => {
		if (!onBoundsChange) return;

		const handleChange = () => {
			const bounds = map.getBounds();
			onBoundsChange(bounds);
		};

		handleChange();
		map.on("moveend", handleChange);
		map.on("zoomend", handleChange);

		return () => {
			map.off("moveend", handleChange);
			map.off("zoomend", handleChange);
		};
	}, [map, onBoundsChange]);

	return null;
}
