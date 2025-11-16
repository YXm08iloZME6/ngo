import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import iconDisabled from "../assets/icon-disabled.png";
import iconAnimals from "../assets/icon-animals.png";
import iconSport from "../assets/icon-sport.png";
import iconElse from "../assets/icon-map-marker.png";

export const Route = createFileRoute("/ngos/$ngoId")({
	component: RouteComponent,
});

type Contacts = {
	phone: string | null;
	email: string | null;
	website: string | null;
	social_media: string | null;
};

function RouteComponent() {
	const { ngoId } = Route.useParams();
	const { data: ngo, isLoading: isNgoLoading } = useQuery({
		queryKey: ["ngos"],
		queryFn: async () => {
			const res = await axios.get("http://localhost:8000/api/ngos/" + ngoId);
			return res.data;
		},
	});

	const [contacts, setContacts] = useState<Contacts>();

	useEffect(() => {
		if (!ngo) {
			return;
		}

		setContacts(JSON.parse(ngo.Contacts));
	}, [ngo]);

	if (isNgoLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="profile-page">
			<div className="profile-card">
				<div className="cover-image">
					<img src={ngo.NgoImageUrl ? ngo.NgoImageUrl : ngo.LogoUrl} alt="" />
					<div className="badge">
						<img
							src={
								ngo.Type === "Животные"
									? iconAnimals
									: ngo.Type === "Инвалиды"
										? iconDisabled
										: ngo.Type === "Спорт"
											? iconSport
											: iconElse
							}
							alt=""
						/>
					</div>
				</div>

				<div className="profile-info">
					<div className="profile-header">
						<img className="logo" src={ngo.LogoUrl} alt="" />
						<div className="profile-text">
							<h2>{ngo.Name}</h2>
						</div>
					</div>

					<div className="content">
						<p>{ngo.Description}</p>
						<div className="content-line"></div>
						<div className="contacts">
							<p>Контакты:</p>
							<div>{contacts?.phone}</div>
							<div>{contacts?.email}</div>
							<div>
								<a href={contacts?.website}>{contacts?.website}</a>
							</div>
							<div>
								<a href={contacts?.social_media}>{contacts?.social_media}</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
