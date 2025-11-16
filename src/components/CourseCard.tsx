interface CourseCardProps {
	id: number;
	title: string;
	tags: string;
}

export default function CourseCard({ title, tags }: CourseCardProps) {
	const tagList: string[] = tags.split("#");
	tagList.shift();

	return (
		<div className="courseCard">
			<div className="courseCard-title">{title}</div>
			<div className="courseCard-tags">
				{tagList.map((tag) => {
					return (
						<div key={tag} className="courseCard-tag">
							{tag}
						</div>
					);
				})}
			</div>
		</div>
	);
}
