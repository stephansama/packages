import * as z from "zod";

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
				.or(z.object({ msg: z.string() })),
			url: `/api/v3/data/${baseId}/${tableId}/records`,
		},
		CREATE: {
			inputSchema: z.object({ fields: schema }),
			method: "post",
			responseSchema: z.object({
				records: z.array(z.object({ fields: schema, id: z.string() })),
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
				fields: z.array(z.string()).or(z.string()),
				sort: z
					.object({
						direction: z.enum(["asc", "desc"]),
						field: z.string(),
					})
					.transform((input) => JSON.stringify(input)),
			}),
			responseSchema: z.object({
				nestedNext: z.string().optional().nullable(),
				nestedPrev: z.string().optional().nullable(),
				next: z.string().optional().nullable(),
				prev: z.string().optional().nullable(),
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
			inputSchema: z.object({ fields: schema, id: z.string() }),
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

	type FetchOptions = {
		[A in ACTION]: ("inputSchema" extends keyof API[A]
			? { body: z.infer<API[A]["inputSchema"]> }
			: {}) &
			("querySchema" extends keyof API[A]
				? { query?: z.infer<API[A]["querySchema"]> }
				: {}) & {
				action: A;
				token?: string;
			};
	}[ACTION];

	return {
		async fetch(props: FetchOptions) {
			const token = (_token ??= props.token);
			if (!token) throw new Error("no token provided");

			const current = api[props.action];

			const url = new URL(current.url, origin);

			let params = "";

			if ("query" in props && "querySchema" in current) {
				const parsed = current.querySchema.parse(props.query);
				params = "?" + new URLSearchParams(parsed).toString();
			}

			let body: string | undefined;

			if ("body" in props && "inputSchema" in current) {
				body = JSON.stringify(current.inputSchema.parse(props.body));
			}

			const response = await fetch(url + params, {
				body,
				headers: new Headers({
					"accept": "application/json",
					"xc-token": token,
				}),
				method: current.method,
			});

			const json = await response.json();
			return current.responseSchema.parse(json);
		},
	};
}
