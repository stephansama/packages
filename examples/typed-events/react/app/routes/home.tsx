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
	const [count, setCount] = React.useState(0);

	const event = React.useMemo(
		() =>
			new TypedEvent(
				"typed:event",
				yup.object({ current: yup.number().required() }),
			),
		[],
	);

	React.useEffect(() => {
		const cleanup = event.listen((event) => {
			console.info("hello from typed event");
			setCount(event.detail.current);
		});

		return () => {
			cleanup();
		};
	}, []);

	return (
		<div className="flex grow items-center justify-center gap-4">
			<button
				onClick={() => {
					const input = document.getElementById(
						"number",
					) as HTMLInputElement | null;

					event.dispatch({
						current: input?.value ? input?.valueAsNumber : count + 1,
					});
				}}
			>
				test event
			</button>
			<input id="number" placeholder="number to override" type="number" />
			<span>{count}</span>
		</div>
	);
}
