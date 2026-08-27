import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import { RecordDialog } from "@/components/admin/RecordDialog";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { TextBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { api, apiErrorMessage } from "@/lib/admin-api";
import {
  pickString,
  recordId,
  toJson,
  useAdminList,
  type AdminRecord,
} from "@/hooks/use-admin-resource";

export const Route = createFileRoute("/admin/bookings")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Bookings — HomeFix Admin" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: BookingsPage,
});

const STATUSES = ["pending", "accepted", "in-progress", "completed", "cancelled"];

function BookingsPage() {
  const { data = [], isLoading, error, refetch, run } = useAdminList<AdminRecord>(
    "bookings",
    "/admin/bookings",
    "bookings",
  );
  const [editing, setEditing] = useState<AdminRecord | null>(null);

  const columns: Column<AdminRecord>[] = [
    {
      header: "Customer",
      cell: (r) => (
        <span className="font-medium">{pickString(r, "user.name", "customer.name", "userName", "customerName")}</span>
      ),
    },
    { header: "Provider", cell: (r) => pickString(r, "provider.name", "providerName") },
    { header: "Service", cell: (r) => pickString(r, "service.name", "serviceName", "category") },
    { header: "Status", cell: (r) => <TextBadge value={pickString(r, "status")} /> },
    {
      header: "Actions",
      className: "text-right",
      cell: (r) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label="Force update booking" onClick={() => setEditing(r)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <ConfirmDelete
            label="this booking"
            onConfirm={() =>
              run(() => api.delete(`/admin/bookings/${recordId(r)}`), "Booking deleted").then(() => undefined)
            }
          />
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Bookings">
      <ResourceTable
        rows={data}
        columns={columns}
        isLoading={isLoading}
        error={error ? apiErrorMessage(error, "Could not load bookings") : null}
        onRetry={() => refetch()}
        emptyMessage="No bookings found."
        searchPlaceholder="Search bookings…"
      />

      <RecordDialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        title="Force update booking"
        description="Override the booking status or scheduled details."
        fields={[
          { name: "status", label: "Status", type: "select", options: STATUSES, required: true },
          { name: "scheduledAt", label: "Scheduled at", placeholder: "YYYY-MM-DD HH:mm" },
          { name: "notes", label: "Admin note" },
        ]}
        initialValues={{
          status: editing ? String(editing.status ?? "") : "",
          scheduledAt: editing ? String(editing.scheduledAt ?? editing.scheduleDate ?? "") : "",
          notes: editing ? String(editing.notes ?? "") : "",
        }}
        onSubmit={async (values) => {
          if (!editing) return;
          const ok = await run(
            () => api.put(`/admin/bookings/${recordId(editing)}`, toJson(values)),
            "Booking updated",
          );
          if (ok) setEditing(null);
        }}
      />
    </AdminLayout>
  );
}
