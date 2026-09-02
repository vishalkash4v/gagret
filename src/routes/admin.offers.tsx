import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import { RecordDialog } from "@/components/admin/RecordDialog";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { EnumBadge, TextBadge, type BadgeTone } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { api, apiErrorMessage, formatCurrency } from "@/lib/admin-api";
import {
  recordId,
  toJson,
  useAdminList,
  type AdminRecord,
} from "@/hooks/use-admin-resource";

export const Route = createFileRoute("/admin/offers")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Offers — Go4Task Admin" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: OffersPage,
});

const STATUSES = ["0", "1", "2", "3", "4", "5"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded", "free"];

const offerStatuses: Array<{ label: string; tone: BadgeTone }> = [
  { label: "Pending", tone: "warning" },
  { label: "Accepted by User", tone: "info" },
  { label: "Rejected", tone: "danger" },
  { label: "Provider Approved", tone: "violet" },
  { label: "Cancelled", tone: "neutral" },
  { label: "Timeout", tone: "orange" },
];

type Provider = { firstName?: string; lastName?: string };

function providerOf(row: AdminRecord) {
  return row["provider"] as Provider | null | undefined;
}

function OfferStatusBadge({ value }: { value: unknown }) {
  const status = offerStatuses[Number(value)];
  return status ? <EnumBadge label={status.label} tone={status.tone} /> : <TextBadge value="Unknown" />;
}

function OffersPage() {
  const { data = [], isLoading, error, refetch, run } = useAdminList<AdminRecord>("offers", "/offers", "offers");
  const [editing, setEditing] = useState<AdminRecord | null>(null);

  const columns: Column<AdminRecord>[] = [
    {
      header: "Provider",
      cell: (r) => (
        <span className="font-medium">
          {[providerOf(r)?.firstName, providerOf(r)?.lastName].filter(Boolean).join(" ") || "N/A"}
        </span>
      ),
    },
    { header: "Amount", cell: (r) => formatCurrency(Number(r["offerAmount"] ?? 0)) },
    { header: "Access Fee", cell: (r) => formatCurrency(Number(r["accessFee"] ?? r["fee"] ?? 0)) },
    { header: "Status", cell: (r) => <OfferStatusBadge value={r["status"]} /> },
    { header: "Payment", cell: (r) => <TextBadge value={typeof r["paymentStatus"] === "string" ? r["paymentStatus"] : "N/A"} /> },
    {
      header: "Actions",
      className: "text-right",
      cell: (r) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label="Force update offer" onClick={() => setEditing(r)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <ConfirmDelete
            label="this offer"
            onConfirm={() => run(() => api.delete(`/offers/${recordId(r)}`), "Offer deleted").then(() => undefined)}
          />
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Offers">
      <ResourceTable
        rows={data}
        columns={columns}
        isLoading={isLoading}
        error={error ? apiErrorMessage(error, "Could not load offers") : null}
        onRetry={() => refetch()}
        emptyMessage="No offers found."
        searchPlaceholder="Search offers…"
      />

      <RecordDialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        title="Force update offer"
        description="Override bid amount, access fee or payment state."
        fields={[
          { name: "offerAmount", label: "Offer amount", type: "number", required: true },
          { name: "accessFee", label: "Access fee", type: "number" },
          { name: "status", label: "Status", type: "select", options: STATUSES, required: true },
          { name: "paymentStatus", label: "Payment status", type: "select", options: PAYMENT_STATUSES },
        ]}
        initialValues={{
          offerAmount: editing ? String(editing["offerAmount"] ?? "") : "",
          accessFee: editing ? String(editing["accessFee"] ?? "") : "",
          status: editing ? String(editing["status"] ?? "") : "",
          paymentStatus: editing ? String(editing["paymentStatus"] ?? "") : "",
        }}
        onSubmit={async (values) => {
          if (!editing) return;
          const ok = await run(() => api.put(`/offers/${recordId(editing)}`, toJson(values)), "Offer updated");
          if (ok) setEditing(null);
        }}
      />
    </AdminLayout>
  );
}
