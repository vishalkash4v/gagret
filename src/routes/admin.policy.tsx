import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { ErrorState, EmptyState, TableSkeleton } from "@/components/admin/DataState";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { EnumBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, apiErrorMessage } from "@/lib/admin-api";
import { recordId, toFormData, unwrapList, useAdminList, type AdminRecord } from "@/hooks/use-admin-resource";

export const Route = createFileRoute("/admin/policy")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Policies — Go4Task Admin" },
      { name: "description", content: "Create and review Go4Task customer-facing policy content." },
      { property: "og:title", content: "Policies — Go4Task Admin" },
      { property: "og:description", content: "Create and review Go4Task customer-facing policy content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PolicyPage,
});

const POLICY_TYPES = ["PRIVACY", "TERMS"] as const;

function policyDate(row: AdminRecord) {
  const value = row["updatedAt"] ?? row["updated_at"] ?? row["createdAt"];
  if (!value) return "N/A";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function PolicyPage() {
  const { data = [], isLoading, error, refetch, run } = useAdminList<AdminRecord>("policy", "/policies", "policies", "data");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminRecord | null>(null);

  async function remove(policy: AdminRecord) {
    await run(() => api.delete(`/policy/${recordId(policy)}`), "Policy deleted");
  }

  return (
    <AdminLayout title="Policies" actions={<Button size="sm" onClick={() => setCreating(true)}><Plus aria-hidden="true" /> New policy</Button>}>
      <div className="mb-5 flex items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground">Manage the policies shown to Go4Task customers.</p>
        {!isLoading && !error && <p className="text-xs text-muted-foreground">{data.length} polic{data.length === 1 ? "y" : "ies"}</p>}
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
        {isLoading ? <TableSkeleton cols={4} /> : error ? <ErrorState message={apiErrorMessage(error, "Could not load policies")} onRetry={() => refetch()} /> : data.length === 0 ? <EmptyState message="No policies found." action={<Button onClick={() => setCreating(true)}><Plus aria-hidden="true" /> Create policy</Button>} /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-5 py-3 font-semibold">Type</th><th className="px-5 py-3 font-semibold">Content</th><th className="px-5 py-3 font-semibold">Last updated</th><th className="px-5 py-3 text-right font-semibold">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((row, index) => {
                  const type = String(row["type"] ?? "POLICY").toUpperCase();
                  const content = String(row["content"] ?? "").replace(/<[^>]+>/g, "").trim();
                  return <tr key={recordId(row) || index} className="transition-colors hover:bg-muted/40">
                    <td className="px-5 py-4"><EnumBadge label={type} tone="neutral" /></td>
                    <td className="max-w-md px-5 py-4 text-muted-foreground">{content || "No content"}</td>
                    <td className="px-5 py-4 text-muted-foreground">{policyDate(row)}</td>
                    <td className="px-5 py-4"><div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" aria-label={`Edit ${type} policy`} onClick={() => setEditing(row)}><Pencil aria-hidden="true" /></Button>
                      <ConfirmDelete label={`the ${type.toLowerCase()} policy`} onConfirm={() => remove(row)} />
                    </div></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <PolicyDialog open={creating || Boolean(editing)} policy={editing} onOpenChange={(open) => { if (!open) { setCreating(false); setEditing(null); } }} onSaved={() => { setCreating(false); setEditing(null); }} run={run} />
    </AdminLayout>
  );
}

function PolicyDialog({ open, policy, onOpenChange, onSaved, run }: { open: boolean; policy: AdminRecord | null; onOpenChange: (open: boolean) => void; onSaved: () => void; run: (action: () => Promise<unknown>, successMessage: string) => Promise<boolean> }) {
  const [type, setType] = useState<string>("PRIVACY");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingPolicy, setLoadingPolicy] = useState(false);

  useEffect(() => {
    if (!open) return;
    const selectedType = String(policy?.["type"] ?? "PRIVACY").toUpperCase();
    setType(selectedType);
    setContent(policy ? String(policy["content"] ?? "") : "");
    if (!policy) return;

    let cancelled = false;
    setLoadingPolicy(true);
    api.get(`/policy/${selectedType}`).then((response) => {
      const detail = unwrapList<AdminRecord>(response.data, "data")[0];
      if (!cancelled && detail) setContent(String(detail["content"] ?? ""));
    }).catch(() => undefined).finally(() => {
      if (!cancelled) setLoadingPolicy(false);
    });
    return () => { cancelled = true; };
  }, [open, policy]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!type.trim() || !content.trim()) return;
    setBusy(true);
    try {
      const values = toFormData({ type, content });
      const ok = await run(() => api.post("/policy", values), "Policy saved");
      if (ok) onSaved();
    } finally {
      setBusy(false);
    }
  }

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl"><DialogHeader><DialogTitle>{policy ? "Edit policy" : "Create policy"}</DialogTitle><DialogDescription>Update the customer-facing Privacy or Terms policy.</DialogDescription></DialogHeader>
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="space-y-1.5"><Label>Policy type</Label><Select value={type} onValueChange={setType} disabled={Boolean(policy) || loadingPolicy}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{POLICY_TYPES.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-1.5"><Label>Content</Label>{loadingPolicy ? <div className="flex min-h-48 items-center justify-center rounded-md border border-border text-sm text-muted-foreground">Loading policy…</div> : <RichTextEditor value={content} onChange={setContent} />}</div>
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button><Button type="submit" disabled={busy || loadingPolicy}>{busy ? "Saving…" : "Save policy"}</Button></DialogFooter>
    </form>
  </DialogContent></Dialog>;
}