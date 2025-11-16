import { useEffect, useState } from "React";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import NgoCard from "../components/NgoCard.tsx";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import MapComponent from "@/components/MapComponent.tsx";
import MapBounds from "@/components/MapBounds.tsx";
import type { LatLngBounds, LatLngExpression } from "leaflet";
import axios from "axios";
import iconDisabled from "../assets/icon-disabled.png";
import iconAnimals from "../assets/icon-animals.png";
import iconSport from "../assets/icon-sport.png";
import iconElse from "../assets/icon-map-marker.png";

export const Route = createFileRoute("/map")({
	component: RouteComponent,
});

const types = [
	"Животные",
	"ОВЗ",
	"Спорт",
	"Жители",
	"Зависимость",
	"Пенсионеры",
	"Дети",
	"Религия",
	"Искусство",
];

type City = {
	id: number;
	Name: string;
	Latitude: number;
	Longitude: number;
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

function RouteComponent() {
	const { data: ngos, isPending } = useQuery({
		queryKey: ["ngosList"],
		queryFn: async () => {
			const res = await axios.get("http://localhost:8000/api/ngos");
			return res.data;
		},
	});
	const { data: cities } = useQuery({
		queryKey: ["cities"],
		queryFn: async () => {
			const res = await axios.get("http://localhost:8000/api/cities");
			return res.data;
		},
	});

	const [bounds, setBounds] = useState<LatLngBounds | null>(null);
	const [zoomCoords, setZoomCoords] = useState<LatLngExpression>();
	const [cardData, setCardData] = useState<Item[] | null>(null);
	const [cardTypes, setCardTypes] = useState<string[]>([
		"Животные",
		"OВЗ",
		"Спорт",
		"Жители",
		"Зависимость",
		"Пенсионеры",
		"Дети",
		"Религия",
		"Искусство",
	]);
	const [search, setSearch] = useState<string>("");

	useEffect(() => {
		if (isPending) {
			return;
		}

		let newFilteredData = [...ngos];

		if (cardTypes.length > 0) {
			newFilteredData = newFilteredData.filter((item) => {
				if (cardTypes.includes(item.Type) || item.Type === "Для всех") {
					return true;
				} else return false;
			});
		}

		if (search.length > 0) {
			const lowerCaseSearch = search.toLowerCase();
			newFilteredData = newFilteredData.filter((item) =>
				item.Name.toLowerCase().includes(lowerCaseSearch),
			);
		} else if (bounds) {
			newFilteredData = newFilteredData.filter((item) =>
				bounds.contains([item.Latitude, item.Longitude]),
			);
		}

		setCardData(newFilteredData);
	}, [ngos, bounds, search, cardTypes]);

	const handleBoundsChange = (bounds: LatLngBounds) => {
		setBounds(bounds);
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
	};

	const handleFilterClick = (type: string) => {
		if (cardTypes.includes(type)) {
			setCardTypes(cardTypes?.filter((i) => i !== type));
		} else {
			setCardTypes([...cardTypes, type]);
		}
	};

	if (isPending) {
		return <div>Loading...</div>;
	}

	return (
		<main className="main">
			<div className="mapPage">
				<div className="main-left">
					<div className="map-filters">
						<input
							className="filter-search"
							placeholder="Название НКО"
							type="text"
							value={search}
							onChange={handleSearchChange}
						/>
						<div className="filter-buttons">
							{types.map((type: string) => {
								return (
									<button
										onClick={() => handleFilterClick(type)}
										type="button"
										key={type}
										className={
											cardTypes.includes(type)
												? "filter-button"
												: "filter-button-disabled"
										}
									>
										<img
											className="filter-icon"
											src={
												type === "Животные"
													? iconAnimals
													: type === "ОВЗ"
														? iconDisabled
														: type === "Спорт"
															? iconSport
															: iconElse
											}
											alt=""
										/>
										{type}
									</button>
								);
							})}
						</div>
					</div>
					<div className="map-item-container">
						<div className="filter-cities">
							{cities.map((city: City) => {
								return (
									<button
										onClick={() =>
											setZoomCoords([city.Latitude, city.Longitude])
										}
										className="btn-city"
										type="button"
										key={city.id}
									>
										{city.Name}
									</button>
								);
							})}
						</div>
						<div className="map-item-count">
							{cardData?.length}{" "}
							{(cardData?.length ?? 0) < 5 ? "результата" : "результатов"}
						</div>
						<div className="map-item-list">
							<div>
								{cardData?.map((item: Item, index: number) => {
									if (index % 2 === 0) {
										return (
											<button
												type="button"
												className="btn-clear"
												onClick={() =>
													setZoomCoords([item.Latitude, item.Longitude])
												}
												key={item.id}
											>
												<NgoCard
													key={item.id}
													imgUrl={
														item.NgoImageUrl ? item.NgoImageUrl : item.LogoUrl
													}
													name={item.Name}
													description={item.Description}
												/>
											</button>
										);
									} else {
										return "";
									}
								})}
							</div>
							<div>
								{cardData?.map((item: Item, index: number) => {
									if (index % 2 === 0) {
										return "";
									} else {
										return (
											<button
												type="button"
												className="btn-clear"
												onClick={() =>
													setZoomCoords([item.Latitude, item.Longitude])
												}
												key={item.id}
											>
												<NgoCard
													imgUrl={item.LogoUrl}
													name={item.Name}
													description={item.Description}
												/>
											</button>
										);
									}
								})}
							</div>
						</div>
					</div>
				</div>
				<div className="main-right">
					<MapComponent nkos={cardData}>
						<MapBounds
							onBoundsChange={handleBoundsChange}
							coords={zoomCoords}
						/>
					</MapComponent>
				</div>
			</div>
		</main>
	);
}
