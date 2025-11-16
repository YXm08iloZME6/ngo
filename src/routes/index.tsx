import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import axios from "axios";

export const Route = createFileRoute("/")({
	validateSearch: (search: Record<string, unknown>) => {
		return {
			code: search.code,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { code } = Route.useSearch();

	useEffect(() => {
		if (code) {
			axios
				.post("http://localhost:8000/api/auth", { code })
				.then((response) => {
					const { access_token } = response.data;

					localStorage.setItem("token", access_token);
				});
		}
	}, [code]);
	return <div>Hello "/"!</div>;
}
