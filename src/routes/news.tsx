import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/news")({
	component: RouteComponent,
});

type News = {
	Id: number;
	Title: string;
	Content: string;
	NgoId: number;
	ImageUrl: string;
};

function RouteComponent() {
	const { data, isPending } = useQuery({
		queryKey: ["newsList"],
		queryFn: async () => {
			const res = await axios.get("http://localhost:8000/api/news");
			return res.data;
		},
	});

	if (isPending) {
		return <div>Loading...</div>;
	}

	return (
		<div className="newsPage">
			<h1 className="page-title">Новости НКО</h1>
			<div className="news">
				{data.map((news: News) => {
					return (
						<div key={news.Id} className="news-card">
							<div className="news-img-container">
								<img className="news-img" src={news.ImageUrl} alt="" />
							</div>
							<div className="news-info">
								<p className="news-title">{news.Title}</p>
								<p className="news-description">{news.Content}</p>
							</div>
							<Link to="/" search={{ code: "" }} className="news-link">
								Читать дальше...
							</Link>
						</div>
					);
				})}
			</div>
		</div>
	);
}
