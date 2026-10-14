import * as z from "zod";

function stringifyScalar(value: unknown): string {
	if (typeof value === "boolean") return value ? "true" : "false";
	if (typeof value === "number") return String(value);
	if (typeof value === "string") return value;
	return JSON.stringify(value);
}

/**
 * Serialize a parsed query object to a nocodb-compatible query string. Arrays
 * comma-join, booleans → "true"/"false", numbers stringify, and nested objects
 * (e.g. `nestedFields`) expand into bracketed keys like
 * `nestedFields[Author]=title,year`. undefined / null values are skipped.
 */
function toQueryString(parameters: unknown): string {
	const pairs: [string, string][] = [];
	for (const [key, value] of Object.entries(
		parameters as Record<string, unknown>,
	)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			pairs.push([key, value.map((v) => stringifyScalar(v)).join(",")]);
		} else if (typeof value === "object") {
			for (const [nestedKey, nestedValue] of Object.entries(
				value as Record<string, unknown>,
			)) {
				if (nestedValue === undefined || nestedValue === null) continue;
				const serialized = Array.isArray(nestedValue)
					? nestedValue.map((v) => stringifyScalar(v)).join(",")
					: stringifyScalar(nestedValue);
				pairs.push([`${key}[${nestedKey}]`, serialized]);
			}
		} else {
			pairs.push([key, stringifyScalar(value)]);
		}
	}
	return new URLSearchParams(pairs).toString();
}

export const ACTIONS = [
	"LIST",
	"CREATE",
	"UPDATE",
	"DELETE",
	"READ",
	"COUNT",
] as const;
export type ACTION = (typeof ACTIONS)[number];

export function createApi<Schema extends z.ZodObject>({
	baseId,
	origin,
	schema,
	tableId,
	token,
}: {
	baseId: string;
	origin: string;
	schema: Schema;
	tableId: string;
	token?: string;
}) {
	let _token: string | undefined = token;

	const api = {
		COUNT: {
			method: "get",
			responseSchema: z
				.object({ count: z.number() })
				.or(z.object({ msg: z.string().trim() })),
			url: `/api/v3/data/${baseId}/${tableId}/records`,
		},
		CREATE: {
			inputSchema: z.object({ fields: schema }),
			method: "post",
			responseSchema: z.object({
				records: z.array(
					z.object({ fields: schema, id: z.string().trim() }),
				),
			}),
			url: `/api/v3/data/${baseId}/${tableId}/records`,
		},
		DELETE: {
			inputSchema: z.object({ id: z.number() }),
			method: "patch",
			responseSchema: z.object(),
			url: `/api/v3/data/${baseId}/${tableId}/records`,
		},
		LIST: {
			method: "get",
			querySchema: z.object({
				fields: z
					.array(z.string().trim())
					.or(z.string().trim())
					.optional(),
				limit: z.int().positive().optional(),
				nestedFields: z
					.record(
						z.string().trim(),
						z.array(z.string().trim()).or(z.string().trim()),
					)
					.optional(),
				offset: z.int().nonnegative().optional(),
				shuffle: z.boolean().optional(),
				sort: z
					.object({
						direction: z.enum(["asc", "desc"]),
						field: z.string().trim(),
					})
					.transform((input) =>
						input.direction === "desc"
							? `-${input.field}`
							: input.field,
					)
					.optional(),
				viewId: z.string().trim().optional(),
				where: z.string().trim().optional(),
			}),
			responseSchema: z.object({
				nestedNext: z.string().trim().optional().nullable(),
				nestedPrev: z.string().trim().optional().nullable(),
				next: z.string().trim().optional().nullable(),
				prev: z.string().trim().optional().nullable(),
				records: z.array(z.object({ fields: schema, id: z.number() })),
			}),
			url: `/api/v3/data/${baseId}/${tableId}/records`,
		},
		READ: {
			method: "get",
			responseSchema: z.object({ fields: schema, id: z.number() }),
			url: `/api/v3/data/${baseId}/${tableId}/records/{recordId}`,
		},
		UPDATE: {
			inputSchema: z.object({ fields: schema, id: z.string().trim() }),
			method: "patch",
			responseSchema: z.object(),
			url: `/api/v3/data/${baseId}/${tableId}/records`,
		},
	} satisfies Record<
		ACTION,
		{
			inputSchema?: z.ZodType;
			method: "delete" | "get" | "patch" | "post" | "put";
			querySchema?: z.ZodType;
			responseSchema: z.ZodType;
			url: string;
		}
	>;

	type API = typeof api;

	return {
		async fetch<A extends ACTION>(
			props: ("inputSchema" extends keyof API[A]
				? { body: z.input<API[A]["inputSchema"]> }
				: {}) &
				("querySchema" extends keyof API[A]
					? { query?: z.input<API[A]["querySchema"]> }
					: {}) & {
					action: A;
					token?: string;
				},
		) {
			const token = (_token ??= props.token);
			if (!token) throw new Error("no token provided");

			const current = api[props.action];

			const url = new URL(current.url, origin);

			const headers = new Headers({
				"accept": "application/json",
				"xc-token": token,
			});

			let parameters = "";

			if ("query" in props && "querySchema" in current) {
				const parsed = current.querySchema.parse(props.query);
				parameters = "?" + toQueryString(parsed);
			}

			let body: string | undefined;

			if ("body" in props && "inputSchema" in current) {
				body = JSON.stringify(current.inputSchema.parse(props.body));
				headers.append("Content-Type", "application/json");
			}

			const response = await fetch(url.toString() + parameters, {
				body,
				headers,
				method: current.method,
			});

			if (!response.ok) {
				throw new Error(
					`failed to query nocodb ${response.statusText}`,
				);
			}

			const json = await response.json();
			// TODO: STE-74
			return current.responseSchema.parse(json) as z.output<
				API[A]["responseSchema"]
			>;
		},
	};
}
