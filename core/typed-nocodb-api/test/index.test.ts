import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as z from "zod";

import { createApi } from "../src/index";

const apiSchema = z.object({
	completed: z.boolean(),
	title: z.string(),
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
			nestedNext: null,
			nestedPrev: null,
			next: null,
			pageInfo: {
				isFirstPage: true,
				isLastPage: true,
				page: 1,
				pageSize: 25,
				totalRows: 1,
			},
			prev: null,
			records: [{ fields: { completed: false, title: "Test" }, id: 1 }],
		};
		mockFetch.mockResolvedValue({
			json: async () => mockResponse,
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
		const calledUrl = mockFetch.mock.calls[0][0];
		const calledOptions = mockFetch.mock.calls[0][1];

		expect(calledUrl).toContain(expectedUrl);
		expect(calledUrl).toContain(
			"sort=%7B%22direction%22%3A%22asc%22%2C%22field%22%3A%22title%22%7D",
		); // URL encoded JSON

		expect(calledOptions).toEqual(
			expect.objectContaining({
				headers: expect.any(Headers),
				method: "get",
			}),
		);

		const { pageInfo, ...expectedResult } = mockResponse;
		expect(result).toEqual(expectedResult);
	});

	it("should perform COUNT action", async () => {
		const mockResponse = { count: 42 };
		mockFetch.mockResolvedValue({
			json: async () => mockResponse,
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
			records: [{ fields: newRecord, id: 123 }],
		};

		mockFetch.mockResolvedValue({
			json: async () => mockResponse,
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
			json: async () => ({}),
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
			id: 123,
		};
		mockFetch.mockResolvedValue({
			json: async () => ({}),
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
