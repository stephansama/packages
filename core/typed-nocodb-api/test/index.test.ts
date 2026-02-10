import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createApi } from '../src/index';
import * as z from 'zod';

const schema = z.object({
    title: z.string(),
    completed: z.boolean(),
});

describe('typed-nocodb-api', () => {
    const baseId = 'baseId';
    const origin = 'http://localhost:8080';
    const tableId = 'tableId';
    const token = 'test-token';

    const api = createApi({
        baseId,
        origin,
        schema,
        tableId,
        token,
    });

    const mockFetch = vi.fn();

    beforeEach(() => {
        vi.stubGlobal('fetch', mockFetch);
        mockFetch.mockReset();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should throw if no token is provided', async () => {
        const apiNoToken = createApi({
            baseId,
            origin,
            schema,
            tableId,
        });
        
        // @ts-expect-error - testing runtime check
        await expect(apiNoToken.fetch({ action: 'LIST' })).rejects.toThrow('no token provided');
    });

    it('should perform LIST action', async () => {
        const mockResponse = {
            records: [
                { fields: { title: 'Test', completed: false }, id: 1 },
            ],
            pageInfo: {
                totalRows: 1,
                page: 1,
                pageSize: 25,
                isFirstPage: true,
                isLastPage: true
            },
            nestedNext: null,
            nestedPrev: null,
            next: null,
            prev: null
        };
        mockFetch.mockResolvedValue({
            ok: true,
            statusText: "OK",
            json: async () => mockResponse,
        });

        const result = await api.fetch({
            action: 'LIST',
            query: {
                fields: ['title', 'completed'],
                sort: { field: 'title', direction: 'asc' }
            }
        });

        const expectedUrl = `${origin}/api/v3/data/${baseId}/${tableId}/records`;
        const calledUrl = mockFetch.mock.calls[0][0];
        const calledOptions = mockFetch.mock.calls[0][1];

        expect(calledUrl).toContain(expectedUrl);
        expect(calledUrl).toContain('sort=%7B%22direction%22%3A%22asc%22%2C%22field%22%3A%22title%22%7D'); // URL encoded JSON
        
        expect(calledOptions).toEqual(expect.objectContaining({
            method: 'get',
            headers: expect.any(Headers),
        }));
        
        
        const { pageInfo, ...expectedResult } = mockResponse;
        expect(result).toEqual(expectedResult);
    });

    it('should perform COUNT action', async () => {
        const mockResponse = { count: 42 };
        mockFetch.mockResolvedValue({
            ok: true,
            statusText: "OK",
            json: async () => mockResponse,
        });

        const result = await api.fetch({ action: 'COUNT' });

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining(`/api/v3/data/${baseId}/${tableId}/records`),
            expect.objectContaining({ method: 'get' })
        );
        expect(result).toEqual(mockResponse);
    });

    it('should perform CREATE action', async () => {
        const newRecord = { title: 'New Task', completed: false };
        const mockResponse = {
            records: [{ fields: newRecord, id: "123" }] 
        };
        
        mockFetch.mockResolvedValue({
            ok: true,
            statusText: "OK",
            json: async () => mockResponse,
        });

        const result = await api.fetch({
            action: 'CREATE',
            body: { fields: newRecord }
        });

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining(`/api/v3/data/${baseId}/${tableId}/records`),
            expect.objectContaining({
                method: 'post',
                body: JSON.stringify({ fields: newRecord }),
            })
        );
        expect(result).toEqual(mockResponse);
    });

    it('should perform DELETE action', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            statusText: "OK",
            json: async () => ({}),
        });

        await api.fetch({
            action: 'DELETE',
            body: { id: 123 }
        });

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining(`/api/v3/data/${baseId}/${tableId}/records`),
            expect.objectContaining({
                method: 'patch', 
                body: JSON.stringify({ id: 123 }),
            })
        );
    });

    it('should perform UPDATE action', async () => {
        const updateData = { fields: { title: 'Updated', completed: true }, id: "123" };
        mockFetch.mockResolvedValue({
            ok: true,
            statusText: "OK",
            json: async () => ({}),
        });

        await api.fetch({
            action: 'UPDATE',
            body: updateData
        });

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining(`/api/v3/data/${baseId}/${tableId}/records`),
            expect.objectContaining({
                method: 'patch',
                body: JSON.stringify(updateData),
            })
        );
    });
});