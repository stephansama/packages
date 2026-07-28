import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as z from "zod";

import { createApi } from "../src/index";

const apiSchema = z.object({
	completed: z.boolean(),
	title: z.string().trim(),
});

describe("typed-nocodb-api", () => {
	const baseId = "baseId";
	const origin = "http://localhost:8080";
	const tableId = "tableId";
	const token = "test-token";

	const api = createApi({
		baseId,
		origin,
		schema: apiSchema,
		tableId,
		token,
	});

	const mockFetch = vi.fn();

	beforeEach(() => {
		vi.stubGlobal("fetch", mockFetch);
		mockFetch.mockReset();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("should throw if no token is provided", async () => {
		const apiNoToken = createApi({
			baseId,
			origin,
			schema: apiSchema,
			tableId,
		});

		await expect(apiNoToken.fetch({ action: "LIST" })).rejects.toThrow(
			"no token provided",
		);
	});

	it("should perform LIST action", async () => {
		const mockResponse = {
			nestedNext: undefined,
			nestedPrev: undefined,
			next: undefined,
			pageInfo: {
				isFirstPage: true,
				isLastPage: true,
				page: 1,
				pageSize: 25,
				totalRows: 1,
			},
			prev: undefined,
			records: [{ fields: { completed: false, title: "Test" }, id: 1 }],
		};
		mockFetch.mockResolvedValue({
			json: () => mockResponse,
			ok: true,
			statusText: "OK",
		});

		const result = await api.fetch({
			action: "LIST",
			query: {
				fields: ["title", "completed"],
				sort: { direction: "asc", field: "title" },
			},
		});

		const expectedUrl = `${origin}/api/v3/data/${baseId}/${tableId}/records`;
		const calledUrl = mockFetch.mock.calls[0][0] as string;
		const calledOptions = mockFetch.mock.calls[0][1] as object;

		expect(calledUrl).toContain(expectedUrl);
		expect(calledUrl).toContain("fields=title%2Ccompleted");
		expect(calledUrl).toContain("sort=title");

		expect(calledOptions).toEqual(
			expect.objectContaining({
				headers: expect.any(Headers) as Headers,
				method: "get",
			}),
		);

		const { pageInfo: _, ...expectedResult } = mockResponse;
		expect(result).toEqual(expectedResult);
	});

	it("should serialize all LIST query parameters into the URL", async () => {
		mockFetch.mockResolvedValue({
			json: () => ({ records: [] }),
			ok: true,
			statusText: "OK",
		});

		await api.fetch({
			action: "LIST",
			query: {
				fields: ["title", "completed"],
				limit: 25,
				nestedFields: { Author: ["name", "email"] },
				offset: 50,
				shuffle: true,
				sort: { direction: "desc", field: "created_at" },
				viewId: "view-1",
				where: "(title,eq,foo)",
			},
		});

		const calledUrl = mockFetch.mock.calls[0][0] as string;

		expect(calledUrl).toContain("fields=title%2Ccompleted");
		expect(calledUrl).toContain("where=%28title%2Ceq%2Cfoo%29");
		expect(calledUrl).toContain("viewId=view-1");
		expect(calledUrl).toContain("limit=25");
		expect(calledUrl).toContain("offset=50");
		expect(calledUrl).toContain("shuffle=true");
		expect(calledUrl).toContain("sort=-created_at");
		expect(calledUrl).toContain("nestedFields%5BAuthor%5D=name%2Cemail");
	});

	it("should perform COUNT action", async () => {
		const mockResponse = { count: 42 };
		mockFetch.mockResolvedValue({
			json: async () => await Promise.resolve(mockResponse),
			ok: true,
			statusText: "OK",
		});

		const result = await api.fetch({ action: "COUNT" });

		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining(
				`/api/v3/data/${baseId}/${tableId}/records`,
			),
			expect.objectContaining({ method: "get" }),
		);
		expect(result).toEqual(mockResponse);
	});

	it("should perform CREATE action", async () => {
		const newRecord = { completed: false, title: "New Task" };
		const mockResponse = {
			records: [{ fields: newRecord, id: "123" }],
		};

		mockFetch.mockResolvedValue({
			json: async () => await Promise.resolve(mockResponse),
			ok: true,
			statusText: "OK",
		});

		const result = await api.fetch({
			action: "CREATE",
			body: { fields: newRecord },
		});

		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining(
				`/api/v3/data/${baseId}/${tableId}/records`,
			),
			expect.objectContaining({
				body: JSON.stringify({ fields: newRecord }),
				method: "post",
			}),
		);
		expect(result).toEqual(mockResponse);
	});

	it("should perform DELETE action", async () => {
		mockFetch.mockResolvedValue({
			json: () => ({}),
			ok: true,
			statusText: "OK",
		});

		await api.fetch({
			action: "DELETE",
			body: { id: 123 },
		});

		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining(
				`/api/v3/data/${baseId}/${tableId}/records`,
			),
			expect.objectContaining({
				body: JSON.stringify({ id: 123 }),
				method: "patch",
			}),
		);
	});

	it("should perform UPDATE action", async () => {
		const updateData = {
			fields: { completed: true, title: "Updated" },
			id: "123",
		};
		mockFetch.mockResolvedValue({
			json: async () => await Promise.resolve({}),
			ok: true,
			statusText: "OK",
		});

		await api.fetch({
			action: "UPDATE",
			body: updateData,
		});

		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining(
				`/api/v3/data/${baseId}/${tableId}/records`,
			),
			expect.objectContaining({
				body: JSON.stringify(updateData),
				method: "patch",
			}),
		);
	});
});
