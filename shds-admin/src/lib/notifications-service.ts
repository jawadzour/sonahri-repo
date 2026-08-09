import { api } from "@/lib/api";
import type { ApiSuccess } from "@/types/api";
import type { ContactMessage, Donation, Volunteer } from "@/types/models";

export interface NotificationSummary {
  counts: {
    unread_messages: number;
    pending_volunteers: number;
    pending_donations: number;
    total: number;
  };
  recent_messages: ContactMessage[];
  recent_volunteers: Volunteer[];
  recent_donations: Donation[];
}

export const notificationsService = {
  async getSummary() {
    const { data } = await api.get<ApiSuccess<NotificationSummary>>("/notifications/summary");
    return data.data;
  },
};