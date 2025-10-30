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
	const inputRef = React.useRef<HTMLInputElement>(null);

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

		return cleanup;
	}, [event]);

	function handleClick() {
		const current = inputRef?.current?.value
			? inputRef.current.valueAsNumber
			: count + 1;

		event.dispatch({ current });
	}

	return (
		<div className="flex grow items-center justify-center gap-4">
			<button onClick={handleClick}>test {event.name} event</button>
			<input
				id="number"
				placeholder="number to override"
				ref={inputRef}
				type="number"
			/>
			<span>{count}</span>
		</div>
	);
}
