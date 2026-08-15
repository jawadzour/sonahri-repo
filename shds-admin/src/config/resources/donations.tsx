import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { ImageIcon } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Donation } from "@/types/models";
import type { ResourceConfig } from "@/types/resource-config";

function ScreenshotCell({ row }: { row: Donation }) {
  const [open, setOpen] = useState(false);
  if (!row.payment_screenshot_url) return <>—</>;
  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <ImageIcon className="h-4 w-4" />
        View
      </Button>
      <ImageLightbox
        src={row.payment_screenshot_url}
        alt={`Payment screenshot — ${row.is_anonymous ? "Anonymous" : row.donor_name}`}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

const statusVariant: Record<Donation["status"], "secondary" | "success" | "destructive" | "warning"> = {
  pending: "warning",
  completed: "success",
  failed: "destructive",
  refunded: "secondary",
};

const statusLabel: Record<Donation["status"], string> = {
  pending: "Pending",
  completed: "Verified",
  failed: "Rejected",
  refunded: "Refunded",
};

export const donationsConfig: ResourceConfig<Donation> = {
  key: "donations",
  label: "Donations",
  singularLabel: "Donation",
  description: "Track donations submitted through the public Donate page and manual entries.",
  endpoint: "/donations",
  searchPlaceholder: "Search by donor name or reference...",
  columns: [
    {
      key: "donor_name",
      label: "Donor",
      render: (row) => (row.is_anonymous ? "Anonymous" : row.donor_name),
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => formatCurrency(row.amount, row.currency),
    },
    { key: "payment_method", label: "Method" },
    { key: "transaction_reference", label: "Reference" },
    {
      key: "payment_screenshot_url",
      label: "Screenshot",
      render: (row) => <ScreenshotCell row={row} />,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <Badge variant={statusVariant[row.status]}>{statusLabel[row.status]}</Badge>,
    },
    { key: "created_at", label: "Date", render: (row) => formatDate(row.created_at) },
  ],
  fields: [
    { name: "donor_name", label: "Donor name", type: "text", required: true },
    { name: "donor_email", label: "Donor email", type: "email" },
    { name: "donor_phone", label: "Donor phone", type: "text" },
    { name: "amount", label: "Amount", type: "number", required: true },
    { name: "currency", label: "Currency", type: "text", placeholder: "PKR" },
    {
      name: "payment_method",
      label: "Payment method",
      type: "select",
      options: [
        { label: "Bank Transfer", value: "bank_transfer" },
        { label: "JazzCash", value: "jazzcash" },
        { label: "Easypaisa", value: "easypaisa" },
        { label: "Other", value: "other" },
      ],
    },
    { name: "transaction_reference", label: "Transaction reference", type: "text" },
    { name: "payment_screenshot_url", label: "Payment screenshot", type: "image", colSpan: 2 },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { label: "Pending", value: "pending" },
        { label: "Verified", value: "completed" },
        { label: "Rejected", value: "failed" },
        { label: "Refunded", value: "refunded" },
      ],
    },
    { name: "is_anonymous", label: "Anonymous donor", type: "boolean" },
    { name: "message", label: "Message", type: "textarea", colSpan: 2 },
  ],
  emptyStateTitle: "No donations recorded yet",
};