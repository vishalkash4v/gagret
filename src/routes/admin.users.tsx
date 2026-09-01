import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, ToggleLeft, ToggleRight } from "lucide-react";
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
  toJson,
  useAdminList,
  type AdminRecord,
} from "@/hooks/use-admin-resource";

export const Route = createFileRoute("/admin/users")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Users — Go4Task Admin" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: UsersPage,
});

function isActive(row: AdminRecord) {
  if (typeof row["isBlocked"] === "boolean") return !row["isBlocked"];
  if (typeof row["isActive"] === "boolean") return row["isActive"];
  if (typeof row["status"] === "string") return row["status"].toLowerCase() === "active";
  return true;
}

function UsersPage() {
  const { data = [], isLoading, error, refetch, run } = useAdminList<AdminRecord>("users", "/users", "users");
  const [editing, setEditing] = useState<AdminRecord | null>(null);

  const columns: Column<AdminRecord>[] = [
    { header: "Name", cell: (r) => <span className="font-medium">{[r["firstName"], r["lastName"]].filter(Boolean).join(" ") || "N/A"}</span> },
    { header: "Email", cell: (r) => pickString(r, "email") },
    { header: "Mobile", cell: (r) => pickString(r, "mobile", "phone", "mobileNumber") },
    { header: "Status", cell: (r) => <StatusBadge active={isActive(r)} /> },
    {
      header: "Actions",
      className: "text-right",
      cell: (r) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={isActive(r) ? "Block user" : "Unblock user"}
            onClick={() => run(() => api.put(`/users/${recordId(r)}/toggle-status`), "User status updated")}
          >
            {isActive(r) ? <ToggleRight className="h-4 w-4 text-success" /> : <ToggleLeft className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Edit user" onClick={() => setEditing(r)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <ConfirmDelete
            label="this user"
            onConfirm={() => run(() => api.delete(`/users/${recordId(r)}`), "User deleted").then(() => undefined)}
          />
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Users">
      <ResourceTable
        rows={data}
        columns={columns}
        isLoading={isLoading}
        error={error ? apiErrorMessage(error, "Could not load users") : null}
        onRetry={() => refetch()}
        emptyMessage="No users found."
        searchPlaceholder="Search users…"
      />

      <RecordDialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        title="Edit user"
        description="Update the customer's profile details."
        fields={[
          { name: "firstName", label: "First name", required: true },
          { name: "lastName", label: "Last name", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "mobile", label: "Mobile", required: true },
        ]}
        initialValues={{
          firstName: editing ? String(editing["firstName"] ?? "") : "",
          lastName: editing ? String(editing["lastName"] ?? "") : "",
          email: editing ? String(editing["email"] ?? "") : "",
          mobile: editing ? String(editing["mobile"] ?? editing["phone"] ?? "") : "",
        }}
        onSubmit={async (values) => {
          if (!editing) return;
           const ok = await run(() => api.put(`/users/${recordId(editing)}`, toJson(values)), "User updated");
          if (ok) setEditing(null);
        }}
      />
    </AdminLayout>
  );
}
