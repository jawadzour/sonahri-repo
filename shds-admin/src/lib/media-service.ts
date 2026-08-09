import { api } from "@/lib/api";
import type { ApiPaginated, ApiSuccess, ListParams } from "@/types/api";
import type { MediaFile } from "@/types/models";

export const mediaService = {
  async list(params: ListParams = {}) {
    const { data } = await api.get<ApiPaginated<MediaFile>>("/media/", { params });
    return data;
  },

  async upload(file: File, onProgress?: (percent: number) => void): Promise<MediaFile> {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<ApiSuccess<MediaFile>>("/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          onProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      },
    });
    return data.data;
  },

  async remove(id: number | string): Promise<void> {
    await api.delete(`/media/${id}`);
  },
};
