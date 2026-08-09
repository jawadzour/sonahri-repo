import { api } from "@/lib/api";
import type { ApiPaginated, ApiSuccess, ListParams } from "@/types/api";

/**
 * Generic REST client for a resource, matching the Flask backend's
 * conventions: GET (list, paginated) / GET :id / POST / PUT :id / DELETE :id,
 * all wrapped in the {success, data, ...} envelope from app/utils/responses.py.
 *
 * Every module (Programs, Projects, Gallery, ...) gets a fully working
 * CRUD client from a single call to this factory instead of hand-writing
 * near-identical fetch logic 15+ times.
 */
export function createResourceService<T, TInput = Partial<T>>(endpoint: string) {
  const base = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  return {
    async list(params: ListParams = {}): Promise<ApiPaginated<T>> {
      const { data } = await api.get<ApiPaginated<T>>(`${base}/`, { params });
      return data;
    },

    async get(id: number | string): Promise<T> {
      const { data } = await api.get<ApiSuccess<T>>(`${base}/${id}`);
      return data.data;
    },

    async create(payload: TInput): Promise<T> {
      const { data } = await api.post<ApiSuccess<T>>(`${base}/`, payload);
      return data.data;
    },

    async update(id: number | string, payload: TInput): Promise<T> {
      const { data } = await api.put<ApiSuccess<T>>(`${base}/${id}`, payload);
      return data.data;
    },

    async remove(id: number | string): Promise<void> {
      await api.delete(`${base}/${id}`);
    },
  };
}
