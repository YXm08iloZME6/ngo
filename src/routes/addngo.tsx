import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import axios from "axios";

interface INgosFormData {
	ngos_name: string;
	ngos_type: string;
	ngos_description: string;
	phone_number: string;
	email: string;
	website: string;
	social_media: string;
	latitude: string;
	longitude: string;
	logo_url: string;
	ngo_image: string;
}

interface IServerData {
	name: string;
	ngo_type: string;
	description: string;
	latitude: number;
	longitude: number;
	logo_url: string;
	ngo_image: string;
	contacts: {
		phone_number: string | null;
		email: string | null;
		website: string | null;
		social_media: string | null;
	};
}

const initialFormData: INgosFormData = {
	ngos_name: "",
	ngos_type: "",
	ngos_description: "",
	phone_number: "",
	email: "",
	website: "",
	social_media: "",
	latitude: "",
	longitude: "",
	logo_url: "",
	ngo_image: "",
};

export const Route = createFileRoute("/addngo")({
	component: RouteComponent,
});

function RouteComponent() {
	const [formData, setFormData] = useState<INgosFormData>(initialFormData);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const { name, value } = e.target;
			setFormData((prevData) => ({
				...prevData,
				[name]: value,
			}));
		},
		[],
	);

	const handleSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			console.log("Данные для сохранения (TS):", formData);

			const dataToSend: IServerData = {
				name: formData.ngos_name,
				ngo_type: formData.ngos_type,
				description: formData.ngos_description,
				latitude: parseFloat(formData.latitude),
				longitude: parseFloat(formData.longitude),
				logo_url: formData.logo_url,
				ngo_image: formData.ngo_image,
				contacts: {
					phone_number: formData.phone_number || null,
					email: formData.email || null,
					website: formData.website || null,
					social_media: formData.social_media || null,
				},
			};
			axios.post("http://localhost:8000/api/admin/save-ngo", dataToSend, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			setFormData(initialFormData);
		},
		[formData],
	);

	const clearForm = useCallback(() => {
		setFormData(initialFormData);
	}, []);

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div id="ngos-fields">
					<div>
						<label>
							Название:
							<input
								type="text"
								name="ngos_name"
								value={formData.ngos_name}
								onChange={handleChange}
								required
							/>
						</label>
					</div>
					<div>
						<label>
							Тип:
							<input
								type="text"
								name="ngos_type"
								value={formData.ngos_type}
								onChange={handleChange}
								required
							/>
						</label>
					</div>
					<div>
						<label>
							Описание:
							<textarea
								name="ngos_description"
								value={formData.ngos_description}
								onChange={handleChange}
								required
							/>
						</label>
					</div>

					<fieldset>
						<legend>Контакты</legend>
						<div>
							<label>
								Телефон:
								<input
									type="text"
									name="phone_number"
									placeholder="+79123456789"
									value={formData.phone_number}
									onChange={handleChange}
								/>
							</label>
						</div>
						<div>
							<label>
								Email:
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
								/>
							</label>
						</div>
						<div>
							<label>
								Сайт:
								<input
									type="url"
									name="website"
									value={formData.website}
									onChange={handleChange}
								/>
							</label>
						</div>
						<div>
							<label>
								Соцсети:
								<input
									type="url"
									name="social_media"
									value={formData.social_media}
									onChange={handleChange}
								/>
							</label>
						</div>
					</fieldset>

					<div>
						<label>
							Широта:
							<input
								type="number"
								step="any"
								name="latitude"
								value={formData.latitude}
								onChange={handleChange}
								required
							/>
						</label>
					</div>
					<div>
						<label>
							Долгота:
							<input
								type="number"
								step="any"
								name="longitude"
								value={formData.longitude}
								onChange={handleChange}
								required
							/>
						</label>
					</div>
					<div>
						<label>
							Логотип:
							<input
								type="url"
								name="logo_url"
								value={formData.logo_url}
								onChange={handleChange}
								required
							/>
						</label>
					</div>
					<div>
						<label>
							Фото:
							<input
								type="url"
								name="ngo_image"
								value={formData.ngo_image}
								onChange={handleChange}
								required
							/>
						</label>
					</div>
				</div>

				<button type="submit">Сохранить в БД</button>
				<button type="button" onClick={clearForm}>
					Очистить форму
				</button>
			</form>
		</div>
	);
}
