import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import { RecordDialog } from "@/components/admin/RecordDialog";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { EnumBadge, type BadgeTone } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { api, apiErrorMessage } from "@/lib/admin-api";
import {
  recordId,
  toJson,
  useAdminList,
  type AdminRecord,
} from "@/hooks/use-admin-resource";

export const Route = createFileRoute("/admin/bookings")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Bookings — Go4Task Admin" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: BookingsPage,
});

const STATUSES = ["0", "1", "2"];

type BookingPerson = { firstName?: string; lastName?: string; name?: string };

function userOf(row: AdminRecord) {
  return row["user"] as BookingPerson | null | undefined;
}

function providerName(row: AdminRecord) {
  const provider = row["provider"] as BookingPerson | null | undefined;
  return provider ? [provider.firstName, provider.lastName].filter(Boolean).join(" ") || "N/A" : "Unassigned";
}

function serviceName(row: AdminRecord) {
  const service = row["service"] as { name?: string } | null | undefined;
  return service?.name ?? "N/A";
}

function BookingStatusBadge({ value }: { value: unknown }) {
  const status = Number(value);
  const statuses: Array<{ label: string; tone: BadgeTone }> = [
    { label: "Pending", tone: "warning" },
    { label: "Assigned/Active", tone: "info" },
    { label: "Completed", tone: "success" },
  ];
  const current = statuses[status];
  return current ? <EnumBadge label={current.label} tone={current.tone} /> : <EnumBadge label="Unknown" tone="neutral" />;
}

function BookingsPage() {
  const { data = [], isLoading, error, refetch, run } = useAdminList<AdminRecord>(
    "bookings",
    "/bookings",
    "bookings",
  );
  const [editing, setEditing] = useState<AdminRecord | null>(null);

  const columns: Column<AdminRecord>[] = [
    {
      header: "Customer",
      cell: (r) => (
       <span className="font-medium">{[userOf(r)?.firstName, userOf(r)?.lastName].filter(Boolean).join(" ") || "N/A"}</span>
      ),
    },
    { header: "Provider", cell: (r) => providerName(r) },
    { header: "Service", cell: (r) => serviceName(r) },
    { header: "Status", cell: (r) => <BookingStatusBadge value={r["status"]} /> },
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
              run(() => api.delete(`/bookings/${recordId(r)}`), "Booking deleted").then(() => undefined)
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
          status: editing ? String(editing["status"] ?? "") : "",
          scheduledAt: editing ? String(editing["scheduledAt"] ?? editing["scheduleDate"] ?? "") : "",
          notes: editing ? String(editing["notes"] ?? "") : "",
        }}
        onSubmit={async (values) => {
          if (!editing) return;
          const ok = await run(
            () => api.put(`/bookings/${recordId(editing)}`, toJson(values)),
            "Booking updated",
          );
          if (ok) setEditing(null);
        }}
      />
    </AdminLayout>
  );
}
