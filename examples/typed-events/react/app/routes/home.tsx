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
				yup.object({
					current: yup.number().required(),
				}),
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

	function resetValues() {
		setCount(() => 0);

		if (inputRef.current) {
			inputRef.current.value = "";
		}
	}

	return (
		<div className="flex grow flex-col items-center justify-center gap-4 p-4">
			<div className="mb-5 flex flex-col items-center justify-center gap-2">
				<img
					className="size-20 rounded"
					height="100px"
					src="https://github.com/stephansama.png"
					width="100px"
				/>
				<a
					href="https://www.npmjs.com/package/@stephansama/typed-events"
					target="_blank"
				>
					<code>@stephansama/typed-events</code>
				</a>
			</div>
			<button
				className="cursor-pointer rounded p-2 hover:bg-white/10"
				onClick={handleClick}
			>
				test {event.name} event
			</button>
			<div className="flex gap-2">
				<input
					className="rounded p-2 ring-1 ring-white/10"
					id="number"
					placeholder="number to override"
					ref={inputRef}
					type="number"
				/>
				<button
					className="cursor-pointer rounded p-2 hover:bg-white/10"
					onClick={resetValues}
				>
					Reset
				</button>
			</div>
			<span>current count: {count}</span>
		</div>
	);
}
