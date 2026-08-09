import { useNavigate } from "react-router-dom";
import { Bell, HandHeart, MessageSquare, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDateTime, truncate } from "@/lib/format";

export function NotificationBell() {
  const navigate = useNavigate();
  const { summary } = useNotifications();

  const total = summary?.counts.total ?? 0;
  const hasNotifications = total > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px]"
            >
              {total > 9 ? "9+" : total}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {!summary || total === 0 ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            You're all caught up.
          </div>
        ) : (
          <>
            {summary.recent_messages.length > 0 && (
              <>
                <p className="px-2 pt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Unread messages
                </p>
                {summary.recent_messages.map((msg) => (
                  <DropdownMenuItem key={`msg-${msg.id}`} onClick={() => navigate("/messages")}>
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate text-sm">{msg.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {truncate(msg.subject || msg.message, 40)}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </>
            )}

            {summary.recent_volunteers.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <p className="px-2 pt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Pending volunteer applications
                </p>
                {summary.recent_volunteers.map((v) => (
                  <DropdownMenuItem key={`vol-${v.id}`} onClick={() => navigate("/volunteers")}>
                    <HandHeart className="h-4 w-4 shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate text-sm">{v.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{formatDateTime(v.created_at)}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </>
            )}

            {summary.recent_donations.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <p className="px-2 pt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Pending donations
                </p>
                {summary.recent_donations.map((d) => (
                  <DropdownMenuItem key={`don-${d.id}`} onClick={() => navigate("/donations")}>
                    <Wallet className="h-4 w-4 shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate text-sm">{d.is_anonymous ? "Anonymous" : d.donor_name}</p>
                      <p className="truncate text-xs text-muted-foreground">{formatDateTime(d.created_at)}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
