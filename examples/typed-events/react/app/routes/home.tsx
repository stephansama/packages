import { TypedEvent } from "@stephansama/typed-events";
import * as React from "react";
import * as yup from "yup";

export default function Home() {
	return <EventComponent />;
}

export function meta() {
	return [
		{ title: "New React Router App" },
		{ content: "Welcome to React Router!", name: "description" },
	];
}

function EventComponent() {
	const event = new TypedEvent("typed:event", yup.object({}));
	const [count, setCount] = React.useState(0);

	React.useEffect(() => {
		const cleanup = event.listen(() => {
			console.info("hello from typed event");
			setCount((prev) => ++prev);
		});

		return () => {
			cleanup();
		};
	}, []);

	return (
		<div className="flex grow items-center justify-center gap-4">
			<button
				onClick={() => {
					event.dispatch({});
				}}
			>
				test event
			</button>
			<span>{count}</span>
		</div>
	);
}
