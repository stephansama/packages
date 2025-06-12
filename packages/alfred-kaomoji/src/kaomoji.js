"use strict";
import alfy from "alfy";

import data from "../assets/kaomojis.json" with { type: "json" };

const formattedData = Object.entries(data).map(([title, body], i) => {
	const id = i + 1;
	return { body, id, title };
});

const items = alfy
	.inputMatches(formattedData, "title")
	.map(({ body, title }) => ({
		arg: body,
		subtitle: title,
		title: body,
	}));

alfy.output(items);
