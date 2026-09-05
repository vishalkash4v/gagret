import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ErrorState, EmptyState, TableSkeleton } from "@/components/admin/DataState";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { EnumBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, apiErrorMessage } from "@/lib/admin-api";
import { recordId, toFormData, useAdminList, type AdminRecord } from "@/hooks/use-admin-resource";

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

const STATUS_OPTIONS = ["PUBLISHED", "DRAFT"] as const;

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function policyDate(row: AdminRecord) {
  const value = row["updatedAt"] ?? row["updated_at"] ?? row["createdAt"];
  if (!value) return "N/A";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function PolicyPage() {
  const { data = [], isLoading, error, refetch, run } = useAdminList<AdminRecord>("policy", "/policy", "policy", "policies", "data");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<AdminRecord | null>(null);

  return (
    <AdminLayout title="Policies" actions={<Button size="sm" onClick={() => setCreating(true)}><Plus aria-hidden="true" /> New policy</Button>}>
      <div className="mb-5 flex items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground">Manage the policies shown to Go4Task customers.......</p>
        {!isLoading && !error && <p className="text-xs text-muted-foreground">{data.length} polic{data.length === 1 ? "y" : "ies"}</p>}
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
        {isLoading ? <TableSkeleton cols={5} /> : error ? <ErrorState message={apiErrorMessage(error, "Could not load policies")} onRetry={() => refetch()} /> : data.length === 0 ? <EmptyState message="No policies found." action={<Button onClick={() => setCreating(true)}><Plus aria-hidden="true" /> Create policy</Button>} /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-5 py-3 font-semibold">Title</th><th className="px-5 py-3 font-semibold">Slug</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Last updated</th><th className="px-5 py-3 text-right font-semibold">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((row, index) => {
                  const status = String(row["status"] ?? "DRAFT").toUpperCase();
                  return <tr key={recordId(row) || index} className="transition-colors hover:bg-muted/40">
                    <td className="px-5 py-4 font-medium">{String(row["title"] ?? "Untitled policy")}</td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">/{String(row["slug"] ?? "")}</td>
                    <td className="px-5 py-4"><EnumBadge label={status} tone={status === "PUBLISHED" ? "success" : "neutral"} /></td>
                    <td className="px-5 py-4 text-muted-foreground">{policyDate(row)}</td>
                    <td className="px-5 py-4 text-right"><Button variant="ghost" size="icon" aria-label="Edit policy" onClick={() => setEditing(row)}><Pencil aria-hidden="true" /></Button></td>
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
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<string>("DRAFT");
  const [content, setContent] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(policy ? String(policy["title"] ?? "") : "");
    setSlug(policy ? String(policy["slug"] ?? "") : "");
    setStatus(policy ? String(policy["status"] ?? "DRAFT").toUpperCase() : "DRAFT");
    setContent(policy ? String(policy["content"] ?? "") : "");
    setSlugTouched(Boolean(policy));
  }, [open, policy]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) { toast.error("Title, slug and content are required"); return; }
    setBusy(true);
    try {
      const values = toFormData({ title: title.trim(), slug: slug.trim(), status, content });
      const ok = await run(() => api.post("/policy", values, { headers: { "Content-Type": "multipart/form-data" } }), "Policy created");
      if (ok) onSaved();
    } finally {
      setBusy(false);
    }
  }

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl"><DialogHeader><DialogTitle>{policy ? "Add policy version" : "Create policy"}</DialogTitle><DialogDescription>Publish clear, current policy content for Go4Task customers.</DialogDescription></DialogHeader>
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1.5"><Label htmlFor="policy-title">Title</Label><Input id="policy-title" value={title} onChange={(event) => { const value = event.target.value; setTitle(value); if (!slugTouched) setSlug(slugify(value)); }} placeholder="Privacy Policy" /></div><div className="space-y-1.5"><Label htmlFor="policy-slug">Slug</Label><Input id="policy-slug" value={slug} onChange={(event) => { setSlugTouched(true); setSlug(slugify(event.target.value)); }} placeholder="privacy-policy" /></div></div>
      <div className="space-y-1.5"><Label>Status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{STATUS_OPTIONS.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-1.5"><Label>Content</Label><RichTextEditor value={content} onChange={setContent} /></div>
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button><Button type="submit" disabled={busy}>{busy ? "Saving…" : "Create policy"}</Button></DialogFooter>
    </form>
  </DialogContent></Dialog>;
}