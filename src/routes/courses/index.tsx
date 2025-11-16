import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CourseCard from "@/components/CourseCard";

export const Route = createFileRoute("/courses/")({
	component: RouteComponent,
});

type Course = {
	id: number;
	Title: string;
	Tags: string;
};

function RouteComponent() {
	const { data, isPending } = useQuery({
		queryKey: ["courses"],
		queryFn: async () => {
			const res = await axios.get("http://localhost:8000/api/courses");
			return res.data;
		},
	});

	if (isPending) {
		return <div>Loading...</div>;
	}

	return (
		<div className="coursesPage">
			<h1 className="coursePage-title">База Знаний</h1>
			<div className="coursePage-tags"></div>
			<div className="coursePage-main">
				<div className="coursePage-filters"></div>
				<div className="coursePage-courses">
					{data.map((course: Course) => {
						return (
							<Link
								key={course.id}
								to="/courses/$courseId"
								params={{ courseId: course.id.toString() }}
								className="courseCard-link"
							>
								<CourseCard
									id={course.id}
									title={course.Title}
									tags={course.Tags}
								/>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
