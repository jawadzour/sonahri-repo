import { api } from "@/lib/api";
import type { ApiSuccess } from "@/types/api";
import type { WebsiteSettings, SeoSettings } from "@/types/models";

export const settingsService = {
  async getWebsiteSettings() {
    const { data } = await api.get<ApiSuccess<WebsiteSettings>>("/settings/website");
    return data.data;
  },
  async updateWebsiteSettings(payload: Partial<WebsiteSettings>) {
    const { data } = await api.put<ApiSuccess<WebsiteSettings>>("/settings/website", payload);
    return data.data;
  },
  async getSeoSettings() {
    const { data } = await api.get<ApiSuccess<SeoSettings>>("/settings/seo");
    return data.data;
  },
  async updateSeoSettings(payload: Partial<SeoSettings>) {
    const { data } = await api.put<ApiSuccess<SeoSettings>>("/settings/seo", payload);
    return data.data;
  },
};
