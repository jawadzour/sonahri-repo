import { api } from "@/lib/api";
import type { ApiSuccess } from "@/types/api";
import type { VisitorSummary } from "@/types/models";

export async function fetchVisitorSummary(): Promise<VisitorSummary> {
  const { data } = await api.get<ApiSuccess<VisitorSummary>>("/analytics/summary");
  return data.data;
}
