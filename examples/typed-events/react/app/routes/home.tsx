import {
	createBroadcastChannel,
	createEvent,
	createMessage,
} from "@stephansama/typed-events";
import {
	useEventListener,
	useListenerMap,
} from "@stephansama/typed-events/react";
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

const channel = createBroadcastChannel("typed:controller", {
	update: yup.object({
		current: yup.number().required(),
	}),
});

const event = createEvent(
	"typed:event",
	yup.object({
		current: yup.number().required(),
	}),
);

const message = createMessage("crossorigin", {
	toggle: yup.object({}),
	update: yup.object({
		value: yup.number().required(),
	}),
});

function EventComponent() {
	const [count, setCount] = React.useState(0);
	const inputRef = React.useRef<HTMLInputElement>(null);

	useListenerMap(channel, {
		update(payload) {
			console.info("hello from typed broadcast channel");
			setCount(payload.data.current);
		},
	});

	useListenerMap(message, {
		toggle({ raw: message, type }) {
			if (type === "message") {
				console.info(message.origin);
			}
		},
		update(payload) {
			setCount(payload.data.value);
		},
	});

	useEventListener(event, (e) => {
		console.info("hello from typed event");
		setCount(e.detail.current);
	});

	function handleClick() {
		const current = inputRef?.current?.value
			? inputRef.current.valueAsNumber
			: count + 1;

		event.dispatch({ current });
		channel.dispatch("update", { current });
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
			<button
				onClick={function () {
					message.dispatch("update", {
						value: count + 1,
					});
				}}
			>
				test message event
			</button>
			<button
				onClick={function () {
					// const iframe = document.querySelector("iframe");

					message.dispatch(
						"toggle",
						{},
						// { origin: iframe!.src, window: iframe!.contentWindow! },
					);
				}}
			>
				test crossorigin message event
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
			<iframe height={500} src="http://localhost:5174" width={500} />
		</div>
	);
}
