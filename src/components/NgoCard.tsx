interface NgoCardProps {
	imgUrl: string;
	name: string;
	description: string;
}

export default function NgoCard({ imgUrl, name, description }: NgoCardProps) {
	return (
		<div className="ngoCard">
			<div className="ngoCard-imgContainer">
				<img className="ngoCard-img" src={imgUrl} alt={name} />
			</div>
			<div className="ngoCard-info">
				<p className="ngoCard-name">{name}</p>
				<p className="ngoCard-description">{description}</p>
			</div>
		</div>
	);
}
