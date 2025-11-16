import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

export const Route = createFileRoute("/events")({
	component: RouteComponent,
});

type Event = {
	id: number;
	title: string;
	description: string;
	date: string;
};

function RouteComponent() {
	const { data, isPending } = useQuery({
		queryKey: ["events"],
		queryFn: async () => {
			const res = await axios.get("http://localhost:8000/api/events");
			return res.data;
		},
	});

	const [date, setDate] = useState(new Date());

	const [allEventsByDate, setAllEventsByDate] = useState({});

	useEffect(() => {
		if (!data) {
			return;
		}

		const processedEvents = data.reduce((acc, event, index) => {
			const dateKey = event.Date.substring(0, 10);
			const newEvent = {
				id: index,
				title: event.Title,
				description: event.Description,
				date: event.Date,
			};

			if (!acc[dateKey]) {
				acc[dateKey] = [];
			}

			acc[dateKey].push(newEvent);
			return acc;
		}, {});

		setAllEventsByDate(processedEvents);
	}, [data]);

	if (isPending) {
		return <div>Loading...</div>;
	}

	const selectedDateKey = `${date.getFullYear()}-${String(
		date.getMonth() + 1,
	).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

	const eventsForSelectedDay = allEventsByDate[selectedDateKey] || [];

	return (
		<div className="calendar-container">
			<motion.div
				className="calendar-wrapper"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className="calendar-inner">
					<Calendar
						onClickDay={(value) => setDate(value)}
						value={date}
						className="calendar-main"
						tileClassName="calendar-tile"
						tileContent={({ date: tileDate, view }) => {
							if (view !== "month") return null;

							const key = `${tileDate.getFullYear()}-${String(
								tileDate.getMonth() + 1,
							).padStart(2, "0")}-${String(tileDate.getDate()).padStart(
								2,
								"0",
							)}`;

							const dayEvents = allEventsByDate[key] || [];

							return dayEvents.length > 0 ? (
								<div className="event-dots">
									{dayEvents.map((e, idx) => (
										<span key={idx} className="event-dot" />
									))}
								</div>
							) : null;
						}}
					/>
				</div>
			</motion.div>

			<motion.div
				className="events-list"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className="events-inner">
					<h2 className="events-title">События на выбранный день</h2>

					{eventsForSelectedDay.length === 0 ? (
						<p className="no-events">Нет событий</p>
					) : (
						<ul className="events-ul">
							{console.log(eventsForSelectedDay)}
							{eventsForSelectedDay.map((event: Event) => (
								<li key={event.id} className="events-li">
									<p className="event-title">{event.title}</p>
									<p className="event-descr">{event.description}</p>
									<p className="event-time">
										Дата: {event.date.toString().split(" ")[0]}
									</p>
								</li>
							))}
						</ul>
					)}
				</div>
			</motion.div>
		</div>
	);
}
