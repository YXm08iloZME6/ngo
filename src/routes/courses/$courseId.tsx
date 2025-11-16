import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/courses/$courseId")({
	component: RouteComponent,
});

type Video = {
	id: number;
	CourseId: number;
	Link: string;
	Title: string;
	Speaker: string;
};

type Course = {
	id: number;
	Title: string;
	Tags: string;
};

function RouteComponent() {
	const { courseId } = Route.useParams();
	const { data, isPending } = useQuery({
		queryKey: ["videos"],
		queryFn: async () => {
			const res = await axios.get(
				"http://localhost:8000/api/courses/" + courseId,
			);
			return res.data;
		},
	});

	if (isPending) {
		return <div>Loading...</div>;
	}

	return (
		<div className="coursePage">
			<h1>{data.course.Title}</h1>
			{data.videos.map((video: Video, index: number) => {
				return (
					<div key={video.id} className="video">
						<div className="video-number">{index + 1}</div>
						<div className="video-card">
							<p className="video-name">{video.Title}</p>
							<iframe
								title={video.Title}
								width="720"
								height="405"
								src={
									"https://rutube.ru/play/embed/" +
									video.Link.split("private/")[1]
								}
								style={{ border: "none;" }}
								allow="clipboard-write; autoplay"
								webkitAllowFullScreen
								mozallowfullscreen
								allowFullScreen
							></iframe>
						</div>
					</div>
				);
			})}
		</div>
	);
}
