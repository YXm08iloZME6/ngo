import { Link } from "@tanstack/react-router";
import logo from "../assets/logo.png";

export default function Navbar() {
	const client_id = "23de5da345484f8abe922e21211e2b80";
	const redirect_uri = "http://localhost:5173/";
	const scope = "login:info login:email login:avatar";
	const yandexUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;

	return (
		<div className="navbar">
			<div className="navbar-left">
				<Link search={{ code: " " }} to="/" class="nav-logo">
					<div>
						<img className="navbar-logo" src={logo} alt="" />
					</div>
				</Link>
			</div>
			<div className="navbar-right">
				<Link className="nav-link" to="/courses">
					<div>база знаний</div>
				</Link>
				<Link className="nav-link" to="/events">
					<div>события</div>
				</Link>
				<Link className="nav-link" to="/news">
					<div>новости</div>
				</Link>
				<Link className="nav-link" to="/map">
					карта
				</Link>
			</div>
		</div>
	);
}
