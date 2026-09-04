import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, BadgeX, Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import { RecordDialog } from "@/components/admin/RecordDialog";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { api, apiErrorMessage } from "@/lib/admin-api";
import {
  recordId,
  toJson,
  useAdminList,
  type AdminRecord,
} from "@/hooks/use-admin-resource";

export const Route = createFileRoute("/admin/providers")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Providers — Go4Task Admin" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: ProvidersPage,
});

function isActive(row: AdminRecord) {
  if (typeof row["isBlocked"] === "boolean") return !row["isBlocked"];
  if (typeof row["isActive"] === "boolean") return row["isActive"];
  return true;
}

function ProvidersPage() {
  const { data = [], isLoading, error, refetch, run } = useAdminList<AdminRecord>(
    "providers",
    "/providers",
    "providers",
  );
  const [editing, setEditing] = useState<AdminRecord | null>(null);

  const columns: Column<AdminRecord>[] = [
    {
      header: "Profile",
      cell: (r) => {
        const img = r["profileImage"] as string;
        const src = !img || img === "noimage.jpg" ? "https://ui-avatars.com/api/?name=" + (r["firstName"] || "P") : img;
        return <img src={src} alt="Profile" className="h-10 w-10 rounded-full object-cover bg-muted" />;
      },
    },
    { header: "Name", cell: (r) => <span className="font-medium">{providerName(r)}</span> },
    { 
      header: "Contact", 
      cell: (r) => (
        <div className="flex flex-col">
          <span className="font-medium whitespace-nowrap">
            {r["countryCode"] ? `${r["countryCode"]} ` : ""}{r["mobile"] || "N/A"}
          </span>
          <span className="text-sm text-muted-foreground">{String(r["email"] || "N/A")}</span>
        </div>
      ) 
    },
    { header: "Radius", cell: (r) => `${String((r["profile"] as any)?.radius ?? "0")} KM` },
    {
      header: "Verification",
      cell: (r) => <StatusBadge active={!!r["isVerified"]} labels={["Verified", "Unverified"]} />,
    },
    { header: "Status", cell: (r) => <StatusBadge active={isActive(r)} /> },
    {
      header: "Actions",
      className: "text-right",
      cell: (r) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={r["isVerified"] ? "Remove verification" : "Verify provider"}
            onClick={() =>
              run(
                () => api.put(`/providers/${recordId(r)}/verify`, { isVerified: !r["isVerified"] }),
                "Verification updated",
              )
            }
          >
            {r["isVerified"] ? <BadgeCheck className="h-4 w-4 text-success" /> : <BadgeX className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={isActive(r) ? "Block provider" : "Unblock provider"}
            onClick={() => run(() => api.put(`/providers/${recordId(r)}/toggle-status`), "Provider status updated")}
          >
            {isActive(r) ? <ToggleRight className="h-4 w-4 text-success" /> : <ToggleLeft className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Edit provider" onClick={() => setEditing(r)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <ConfirmDelete
            label="this provider"
            onConfirm={() =>
              run(() => api.delete(`/providers/${recordId(r)}`), "Provider deleted").then(() => undefined)
            }
          />
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Providers">
      <ResourceTable
        rows={data}
        columns={columns}
        isLoading={isLoading}
        error={error ? apiErrorMessage(error, "Could not load providers") : null}
        onRetry={() => refetch()}
        emptyMessage="No providers found."
        searchPlaceholder="Search providers…"
      />

      <RecordDialog
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        title="Edit provider"
        description="Update provider profile, credits and service radius."
        fields={[
          { name: "firstName", label: "First name", required: true },
          { name: "lastName", label: "Last name", required: true },
          { name: "email", label: "Email", type: "email", required: true },
          { name: "mobile", label: "Mobile" },
          { name: "bookingCredits", label: "Booking Credits", type: "number" },
          { name: "radius", label: "Service Radius (km)", type: "number" },
        ]}
        initialValues={{
          firstName: editing ? String(editing["firstName"] ?? "") : "",
          lastName: editing ? String(editing["lastName"] ?? "") : "",
          email: editing ? String(editing["email"] ?? "") : "",
          mobile: editing ? String(editing["mobile"] ?? "") : "",
          bookingCredits: editing ? String(editing["bookingCredits"] ?? "") : "",
          radius: editing ? String((editing["profile"] as any)?.radius ?? "") : "",
        }}
        onSubmit={async (values) => {
          if (!editing) return;
          const ok = await run(
            () => api.put(`/providers/${recordId(editing)}`, toJson(values)),
            "Provider updated",
          );
          if (ok) setEditing(null);
        }}
      />
    </AdminLayout>
  );
}

function providerName(row: AdminRecord) {
  return [row["firstName"], row["lastName"]].filter(Boolean).join(" ") || "N/A";
}