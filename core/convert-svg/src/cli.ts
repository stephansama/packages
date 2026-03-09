import { cli } from "cleye";

// Parse argv
const argv = cli({
	flags: {
		input: {
			description: "input svg filename",
			type: String,
		},
		output: {
			default: "output ico filename",
			description: "Time of day to greet (morning or evening)",
			type: String,
		},
	},
	name: "@stephansama/convert-svg",
	parameters: [
		"<first name>", // First name is required
		"[last name]", // Last name is optional
	],
});

const name = [argv._.firstName, argv._.lastName].filter(Boolean).join(" ");

if (argv.flags.time === "morning") {
	console.log(`Good morning ${name}!`);
} else {
	console.log(`Good evening ${name}!`);
}
