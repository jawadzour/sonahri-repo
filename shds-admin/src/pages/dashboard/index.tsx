import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  BadgeCheck,
  Award,
  Eye,
  FileText,
  Fingerprint,
  FolderKanban,
  HandHeart,
  Handshake,
  Image as ImageIcon,
  MessageSquare,
  PlusCircle,
  RefreshCw,
  Sparkles,
  Users as UsersIcon,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/crud/page-header";
import { api } from "@/lib/api";
import { fetchVisitorSummary } from "@/lib/analytics-service";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";
import type { ContactMessage, VisitorSummary } from "@/types/models";
import type { ApiPaginated } from "@/types/api";

const REFRESH_INTERVAL_MS = 30_000;

interface StatCardDef {
  key: string;
  label: string;
  endpoint: string;
  icon: React.ElementType;
}

const STAT_CARDS: StatCardDef[] = [
  { key: "programs", label: "Programs", endpoint: "/programs", icon: FolderKanban },
  { key: "projects", label: "Projects", endpoint: "/projects", icon: FolderKanban },
  { key: "messages", label: "Total Messages", endpoint: "/inquiries", icon: MessageSquare },
  { key: "volunteers", label: "Volunteer Applications", endpoint: "/volunteers", icon: UsersIcon },
  { key: "donations", label: "Donations", endpoint: "/donations", icon: Wallet },
  { key: "gallery", label: "Gallery Images", endpoint: "/gallery", icon: ImageIcon },
];

const QUICK_ACTIONS: { label: string; to: string; icon: React.ElementType }[] = [
  { label: "Add Program", to: "/programs", icon: FolderKanban },
  { label: "Add Project", to: "/projects", icon: FolderKanban },
  { label: "Add Gallery Image", to: "/gallery", icon: ImageIcon },
  { label: "Add Team Member", to: "/team", icon: Award },
  { label: "Add Partner", to: "/partners", icon: Handshake },
  { label: "Add Report", to: "/reports", icon: FileText },
];

type ActivityItem =
  | { type: "message"; id: number; created_at: string; title: string; subtitle: string }
  | { type: "volunteer"; id: number; created_at: string; title: string; subtitle: string }
  | { type: "donation"; id: number; created_at: string; title: string; subtitle: string };

const ACTIVITY_ICON: Record<ActivityItem["type"], React.ElementType> = {
  message: MessageSquare,
  volunteer: HandHeart,
  donation: Wallet,
};

const ACTIVITY_LINK: Record<ActivityItem["type"], string> = {
  message: "/messages",
  volunteer: "/volunteers",
  donation: "/donations",
};

const ACTIVITY_ICON_CLASS: Record<ActivityItem["type"], string> = {
  message: "bg-blue-500/10 text-blue-600",
  volunteer: "bg-purple-500/10 text-purple-600",
  donation: "bg-emerald-500/10 text-emerald-600",
};

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
  const { summary: notifications, refetch: refetchNotifications } = useNotifications();

  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [recentMessages, setRecentMessages] = useState<ContactMessage[] | null>(null);
  const [donationTrend, setDonationTrend] = useState<{ label: string; amount: number }[] | null>(null);
  const [visitorSummary, setVisitorSummary] = useState<VisitorSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const isFetchingRef = useRef(false);

  const loadDashboard = useCallback(
    async (isBackground: boolean) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      if (isBackground) setIsRefreshing(true);

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

      try {
        setVisitorSummary(await fetchVisitorSummary());
      } catch {
        setVisitorSummary(null);
      }

      await refetchNotifications();

      setLastUpdated(new Date());
      setIsLoading(false);
      setIsRefreshing(false);
      isFetchingRef.current = false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    loadDashboard(false);

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadDashboard(true);
      }
    }, REFRESH_INTERVAL_MS);

    // Catch up immediately when the admin tabs back in, rather than
    // waiting for the next interval tick on possibly stale data.
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadDashboard(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [loadDashboard]);

  const needsAttention = notifications
    ? [
        {
          key: "messages",
          label: "Unread Messages",
          count: notifications.counts.unread_messages,
          to: "/messages",
          icon: MessageSquare,
        },
        {
          key: "donations",
          label: "Pending Donations",
          count: notifications.counts.pending_donations,
          to: "/donations",
          icon: Wallet,
        },
        {
          key: "volunteers",
          label: "Pending Applications",
          count: notifications.counts.pending_volunteers,
          to: "/volunteers",
          icon: HandHeart,
        },
      ]
    : [];

  const activityFeed: ActivityItem[] = notifications
    ? [
        ...notifications.recent_messages.map((m): ActivityItem => ({
          type: "message",
          id: m.id,
          created_at: m.created_at,
          title: m.name,
          subtitle: m.subject || m.message,
        })),
        ...notifications.recent_volunteers.map((v): ActivityItem => ({
          type: "volunteer",
          id: v.id,
          created_at: v.created_at,
          title: v.name,
          subtitle: `Wants to volunteer${v.area_of_interest ? ` — ${v.area_of_interest}` : ""}`,
        })),
        ...notifications.recent_donations.map((d): ActivityItem => ({
          type: "donation",
          id: d.id,
          created_at: d.created_at,
          title: d.is_anonymous ? "Anonymous donor" : d.donor_name,
          subtitle: `${formatCurrency(d.amount, d.currency)} pending verification`,
        })),
      ]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 8)
    : [];

  return (
    <div>
      <PageHeader
        title={`Welcome back${user ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="Here's what's happening across the SHDS website today."
        action={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isRefreshing ? "animate-pulse bg-primary" : "bg-emerald-500"
                )}
              />
              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
                : "Loading…"}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadDashboard(true)}
              disabled={isLoading || isRefreshing}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Needs Attention */}
      <div className="mb-6">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-primary" /> Needs Your Attention
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : notifications && notifications.counts.total === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex items-center gap-3 py-6">
              <BadgeCheck className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="font-medium">You're all caught up!</p>
                <p className="text-sm text-muted-foreground">
                  No unread messages, pending donations, or applications waiting on you.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {needsAttention.map((item) => {
              const Icon = item.icon;
              const isUrgent = item.count > 0;
              return (
                <Link key={item.key} to={item.to}>
                  <Card
                    className={cn(
                      "transition-all hover:shadow-md",
                      isUrgent && "border-amber-300 bg-amber-50/50 dark:bg-amber-950/10"
                    )}
                  >
                    <CardContent className="flex items-center gap-3 pt-5">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
                          isUrgent ? "bg-amber-500/15 text-amber-600" : "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold leading-none">{item.count}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <PlusCircle className="h-4 w-4 text-primary" /> Quick Actions
        </h2>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Button key={action.to} asChild variant="outline" size="sm">
                <Link to={action.to}>
                  <Icon className="h-3.5 w-3.5" />
                  {action.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Content & Engagement stats */}
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

      {/* Visitor stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Eye className="h-4 w-4" />
            </div>
            <div>
              {isLoading ? (
                <Skeleton className="h-6 w-10" />
              ) : visitorSummary === null ? (
                <Badge variant="secondary" className="text-[10px]">Not connected</Badge>
              ) : (
                <p className="text-xl font-semibold leading-none">
                  {visitorSummary.total_views.toLocaleString()}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">Total Page Views</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Fingerprint className="h-4 w-4" />
            </div>
            <div>
              {isLoading ? (
                <Skeleton className="h-6 w-10" />
              ) : visitorSummary === null ? (
                <Badge variant="secondary" className="text-[10px]">Not connected</Badge>
              ) : (
                <p className="text-xl font-semibold leading-none">
                  {visitorSummary.unique_visitors_30d.toLocaleString()}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">Unique Visitors (30d)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 pt-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              {isLoading ? (
                <Skeleton className="h-6 w-10" />
              ) : visitorSummary === null ? (
                <Badge variant="secondary" className="text-[10px]">Not connected</Badge>
              ) : (
                <p className="text-xl font-semibold leading-none">
                  {visitorSummary.views_today.toLocaleString()}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">Views Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Visitor trend (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : !visitorSummary || visitorSummary.trend.every((p) => p.views === 0) ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No visitor data available yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={visitorSummary.trend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    minTickGap={24}
                    tickFormatter={(value) => formatDate(value, "d MMM")}
                  />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} allowDecimals={false} />
                  <Tooltip
                    labelFormatter={(value) => formatDate(String(value), "d MMM yyyy")}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="var(--primary)"
                    fill="var(--primary)"
                    fillOpacity={0.15}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top pages (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
            ) : !visitorSummary || visitorSummary.top_pages.length === 0 ? (
              <div className="flex items-center gap-2 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                No page views yet.
              </div>
            ) : (
              visitorSummary.top_pages.map((page) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between gap-2 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <span className="truncate text-sm font-medium">{page.path}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {page.views.toLocaleString()} views
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
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
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
            ) : activityFeed.length === 0 ? (
              <div className="flex items-center gap-2 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
                <HandHeart className="h-4 w-4" />
                Nothing pending right now.
              </div>
            ) : (
              activityFeed.map((item) => {
                const Icon = ACTIVITY_ICON[item.type];
                return (
                  <Link
                    key={`${item.type}-${item.id}`}
                    to={ACTIVITY_LINK[item.type]}
                    className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0 hover:opacity-80"
                  >
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                        ACTIVITY_ICON_CLASS[item.type]
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {formatDateTime(item.created_at)}
                    </span>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
