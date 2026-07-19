import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePageTitle } from "@/hooks/usePageTitle";
import { trpc } from "@/lib/trpc";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  usePageTitle("Admin Dashboard");
  
  const utils = trpc.useUtils();
  const inquiriesQuery = trpc.admin.listInquiries.useQuery();

  const deleteInquiry = trpc.admin.deleteInquiry.useMutation({
    onSuccess: () => {
      utils.admin.listInquiries.invalidate();
      toast.success("Deleted");
    },
    onError: err => toast.error(err.message),
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Contact Inquiries</h1>

        {inquiriesQuery.isLoading && <p>Loading...</p>}

        {inquiriesQuery.isError && (
          <p className="text-destructive">
            {inquiriesQuery.error.message}
          </p>
        )}

        {inquiriesQuery.data && inquiriesQuery.data.length === 0 && (
          <p className="text-muted-foreground">No inquiries yet.</p>
        )}

        <div className="space-y-4">
          {inquiriesQuery.data?.map(inquiry => (
            <Card key={inquiry.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    {inquiry.name}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      &lt;{inquiry.email}&gt;
                    </span>
                  </p>
                  {inquiry.phone && (
                    <p className="text-sm text-muted-foreground">
                      {inquiry.phone}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    Type: {inquiry.inquiryType}
                    {inquiry.subject ? ` · ${inquiry.subject}` : ""}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap">{inquiry.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(inquiry.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteInquiry.mutate({ id: inquiry.id })}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
