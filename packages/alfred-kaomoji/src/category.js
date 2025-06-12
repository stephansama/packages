"use strict";
import alfy from "alfy";

import data from "../assets/categories.json" with { type: "json" };

const formattedData = data.map((title, id) => ({ id, title }));

const items = alfy
	.inputMatches(formattedData, "title")
	.map(({ title }) => ({ arg: title, title }));

alfy.output(items);
