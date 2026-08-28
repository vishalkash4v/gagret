import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ImageIcon, Pencil, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import { RecordDialog } from "@/components/admin/RecordDialog";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { api, apiErrorMessage } from "@/lib/admin-api";
import {
  pickString,
  recordId,
  toFormData,
  useAdminList,
  type AdminRecord,
} from "@/hooks/use-admin-resource";

export const Route = createFileRoute("/admin/services")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Services — HomeFix Admin" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: ServicesPage,
});

function imageUrl(row: AdminRecord) {
  const value = row["image"] ?? row["icon"] ?? row["imageUrl"];
  return typeof value === "string" && value ? value : null;
}

function ServicesPage() {
  const { data = [], isLoading, error, refetch, run } = useAdminList<AdminRecord>(
    "services",
    "/admin/services",
    "services",
  );
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminRecord | null>(null);

  const columns: Column<AdminRecord>[] = [
    {
      header: "Image",
      cell: (r) =>
        imageUrl(r) ? (
          <img
            src={imageUrl(r) as string}
            alt={pickString(r, "name")}
            width={44}
            height={44}
            loading="lazy"
            className="h-11 w-11 rounded-lg border border-border object-cover"
          />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
            <ImageIcon className="h-4 w-4" aria-hidden="true" />
          </span>
        ),
    },
    { header: "Name", cell: (r) => <span className="font-medium">{pickString(r, "name", "title")}</span> },
    {
      header: "Status",
      cell: (r) => <StatusBadge active={r["isActive"] !== false} labels={["Active", "Inactive"]} />,
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (r) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle service status"
            onClick={() => run(() => api.put(`/admin/services/${recordId(r)}/toggle-status`), "Service status updated")}
          >
            {r["isActive"] !== false ? <ToggleRight className="h-4 w-4 text-success" /> : <ToggleLeft className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Edit service" onClick={() => setEditing(r)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <ConfirmDelete
            label="this service"
            onConfirm={() =>
              run(() => api.delete(`/admin/services/${recordId(r)}`), "Service deleted").then(() => undefined)
            }
          />
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Services"
      actions={
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create Service
        </Button>
      }
    >
      <ResourceTable
        rows={data}
        columns={columns}
        isLoading={isLoading}
        error={error ? apiErrorMessage(error, "Could not load services") : null}
        onRetry={() => refetch()}
        emptyMessage="No services yet. Create your first one."
        searchPlaceholder="Search services…"
      />

      <RecordDialog
        open={creating}
        onOpenChange={setCreating}
        title="Create service"
        description="Add a new service category customers can book."
        submitLabel="Create"
        fields={[
          { name: "name", label: "Service name", required: true, placeholder: "e.g. AC Repair" },
          { name: "image", label: "Image", type: "file", required: true },
        ]}
        initialValues={{ name: "" }}
        onSubmit={async (values) => {
          const ok = await run(
            () =>
              api.post("/admin/services", toFormData(values), {
                headers: { "Content-Type": "multipart/form-data" },
              }),
            "Service created",
          );
          if (ok) setCreating(false);
        }}
      />

      <RecordDialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        title="Edit service"
        description="Leave the image empty to keep the current one."
        fields={[
          { name: "name", label: "Service name", required: true },
          { name: "image", label: "Replace image", type: "file" },
        ]}
        initialValues={{ name: editing ? String(editing["name"] ?? "") : "" }}
        onSubmit={async (values) => {
          if (!editing) return;
          const ok = await run(
            () =>
              api.put(`/admin/services/${recordId(editing)}`, toFormData(values), {
                headers: { "Content-Type": "multipart/form-data" },
              }),
            "Service updated",
          );
          if (ok) setEditing(null);
        }}
      />
    </AdminLayout>
  );
}
