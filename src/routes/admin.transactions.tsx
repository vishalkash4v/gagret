import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import { RecordDialog } from "@/components/admin/RecordDialog";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { TextBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { api, apiErrorMessage, formatCurrency } from "@/lib/admin-api";
import {
  pickString,
  recordId,
  toJson,
  useAdminList,
  type AdminRecord,
} from "@/hooks/use-admin-resource";

export const Route = createFileRoute("/admin/transactions")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Transactions — HomeFix Admin" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: TransactionsPage,
});

const STATUSES = ["pending", "success", "failed", "refunded"];

function TransactionsPage() {
  const { data = [], isLoading, error, refetch, run } = useAdminList<AdminRecord>(
    "transactions",
    "/admin/transactions",
    "transactions",
  );
  const [editing, setEditing] = useState<AdminRecord | null>(null);

  const columns: Column<AdminRecord>[] = [
    {
      header: "Provider",
      cell: (r) => <span className="font-medium">{pickString(r, "provider.name", "providerName")}</span>,
    },
    {
      header: "Booking ID",
      cell: (r) => <span className="font-mono text-xs">{pickString(r, "booking._id", "bookingId", "booking")}</span>,
    },
    { header: "Amount", cell: (r) => formatCurrency(Number(r["amount"] ?? 0)) },
    { header: "Status", cell: (r) => <TextBadge value={pickString(r, "status", "paymentStatus")} /> },
    {
      header: "Actions",
      className: "text-right",
      cell: (r) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label="Force update transaction" onClick={() => setEditing(r)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <ConfirmDelete
            label="this transaction"
            onConfirm={() =>
              run(() => api.delete(`/admin/transactions/${recordId(r)}`), "Transaction deleted").then(() => undefined)
            }
          />
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Transactions">
      <ResourceTable
        rows={data}
        columns={columns}
        isLoading={isLoading}
        error={error ? apiErrorMessage(error, "Could not load transactions") : null}
        onRetry={() => refetch()}
        emptyMessage="No transactions found."
        searchPlaceholder="Search transactions…"
      />

      <RecordDialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        title="Force update transaction"
        description="Override the settlement status or amount."
        fields={[
          { name: "status", label: "Status", type: "select", options: STATUSES, required: true },
          { name: "amount", label: "Amount", type: "number" },
          { name: "remarks", label: "Remarks" },
        ]}
        initialValues={{
          status: editing ? String(editing["status"] ?? "") : "",
          amount: editing ? String(editing["amount"] ?? "") : "",
          remarks: editing ? String(editing["remarks"] ?? "") : "",
        }}
        onSubmit={async (values) => {
          if (!editing) return;
          const ok = await run(
            () => api.put(`/admin/transactions/${recordId(editing)}`, toJson(values)),
            "Transaction updated",
          );
          if (ok) setEditing(null);
        }}
      />
    </AdminLayout>
  );
}
