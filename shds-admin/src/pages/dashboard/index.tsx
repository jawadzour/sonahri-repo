import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FolderKanban,
  HandHeart,
  Image as ImageIcon,
  MessageSquare,
  Users as UsersIcon,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/crud/page-header";
import { api } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";
import type { ContactMessage } from "@/types/models";
import type { ApiPaginated } from "@/types/api";

interface StatCardDef {
  key: string;
  label: string;
  endpoint: string;
  icon: React.ElementType;
}

const STAT_CARDS: StatCardDef[] = [
  { key: "programs", label: "Programs", endpoint: "/programs", icon: FolderKanban },
  { key: "projects", label: "Projects", endpoint: "/projects", icon: FolderKanban },
  { key: "messages", label: "Unread Messages", endpoint: "/inquiries", icon: MessageSquare },
  { key: "volunteers", label: "Volunteer Applications", endpoint: "/volunteers", icon: UsersIcon },
  { key: "donations", label: "Donations", endpoint: "/donations", icon: Wallet },
  { key: "gallery", label: "Gallery Images", endpoint: "/gallery", icon: ImageIcon },
];

async function safeCount(endpoint: string): Promise<number | null> {
  try {
    const { data } = await api.get<ApiPaginated<unknown>>(`${endpoint}/`, {
      params: { page: 1, per_page: 1 },
    });
    return data.pagination?.total ?? 0;
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [recentMessages, setRecentMessages] = useState<ContactMessage[] | null>(null);
  const [donationTrend, setDonationTrend] = useState<{ label: string; amount: number }[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const results = await Promise.all(STAT_CARDS.map((c) => safeCount(c.endpoint)));
      const map: Record<string, number | null> = {};
      STAT_CARDS.forEach((c, i) => (map[c.key] = results[i]));
      setCounts(map);

      try {
        const { data } = await api.get<ApiPaginated<ContactMessage>>("/inquiries/", {
          params: { page: 1, per_page: 5, sort_by: "created_at", sort_dir: "desc" },
        });
        setRecentMessages(data.data);
      } catch {
        setRecentMessages(null);
      }

      try {
        const { data } = await api.get<ApiPaginated<{ amount: number; created_at: string }>>(
          "/donations/",
          { params: { page: 1, per_page: 50 } }
        );
        const byMonth = new Map<string, number>();
        for (const d of data.data) {
          const month = new Date(d.created_at).toLocaleDateString("en-US", { month: "short" });
          byMonth.set(month, (byMonth.get(month) ?? 0) + Number(d.amount));
        }
        setDonationTrend(Array.from(byMonth, ([label, amount]) => ({ label, amount })));
      } catch {
        setDonationTrend(null);
      }

      setIsLoading(false);
    })();
  }, []);

  return (
    <div>
      <PageHeader
        title={`Welcome back${user ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="Here's what's happening across the SHDS website today."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const value = counts[card.key];
          return (
            <Card key={card.key}>
              <CardContent className="flex items-center gap-3 pt-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  {isLoading ? (
                    <Skeleton className="h-6 w-10" />
                  ) : value === null ? (
                    <Badge variant="secondary" className="text-[10px]">Not connected</Badge>
                  ) : (
                    <p className="text-xl font-semibold leading-none">{value}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Donations trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : !donationTrend || donationTrend.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No donation data available yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={donationTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
            ) : !recentMessages || recentMessages.length === 0 ? (
              <div className="flex items-center gap-2 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                <HandHeart className="h-4 w-4" />
                No messages yet.
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-start justify-between gap-2 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{msg.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{msg.subject || msg.message}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    {formatDateTime(msg.created_at)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
