import type { ReactNode } from "React";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import { Link } from "@tanstack/react-router";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import iconCluster from "../assets/icon-map-marker.png";
import NgoCard from "./NgoCard";

const customIcon = new L.Icon({
	iconUrl: iconCluster,
	iconSize: new L.Point(32, 32),
});

const createClusterCustomIcon = function (cluster: any) {
	return L.divIcon({
		html: `<div>${cluster.getChildCount()}</div>`,
		className: "custom-marker-cluster",
		iconSize: L.point(40, 40, true),
	});
};

type Item = {
	id: number;
	Name: string;
	Description: string;
	Type: string;
	Contacts: string;
	Latitude: number;
	Longitude: number;
	LogoUrl: string;
	NgoImageUrl: string;
};

interface MapProps {
	nkos: Item[] | null;
	children: ReactNode;
}

export default function MapComponent({ nkos, children }: MapProps) {
	return (
		<MapContainer center={[54.211, 49.62]} zoom={3} scrollWheelZoom={true}>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			<MarkerClusterGroup
				showCoverageOnHover={false}
				iconCreateFunction={createClusterCustomIcon}
			>
				{nkos?.map((nko: Item) => (
					<Marker
						key={nko.id}
						icon={customIcon}
						position={[nko.Latitude, nko.Longitude]}
					>
						<Popup>
							<Link key={nko.id} to={"/ngos/" + nko.id}>
								<NgoCard
									name={nko.Name}
									description={nko.Description}
									imgUrl={nko.LogoUrl}
								/>
							</Link>
						</Popup>
					</Marker>
				))}
			</MarkerClusterGroup>
			<Link to="/addngo" className="map-btn">
				Добавить НКО
			</Link>
			{children}
		</MapContainer>
	);
}
