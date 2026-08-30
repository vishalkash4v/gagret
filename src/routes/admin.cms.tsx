import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { ErrorState, EmptyState, TableSkeleton } from "@/components/admin/DataState";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, apiErrorMessage } from "@/lib/admin-api";
import { recordId, toFormData, useAdminList, type AdminRecord } from "@/hooks/use-admin-resource";

export const Route = createFileRoute("/admin/cms")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "CMS & Policies — HomeFix Admin" },
      { name: "description", content: "Manage HomeFix policy pages and published content." },
      { property: "og:title", content: "CMS & Policies — HomeFix Admin" },
      { property: "og:description", content: "Manage HomeFix policy pages and published content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CmsPage,
});

const STATUS_OPTIONS = ["PUBLISHED", "DRAFT"] as const;

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function pageDate(row: AdminRecord) {
  const value = row["updatedAt"] ?? row["updated_at"] ?? row["lastUpdated"] ?? row["createdAt"];
  if (!value) return "N/A";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function pageStatus(value: unknown) {
  const status = String(value ?? "DRAFT").toUpperCase();
  return <Badge variant={status === "PUBLISHED" ? "default" : "secondary"}>{status}</Badge>;
}

function CmsPage() {
  const { data = [], isLoading, error, refetch, run } = useAdminList<AdminRecord>("cms", "/admin/cms", "cms", "pages");
  const [editing, setEditing] = useState<AdminRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [preview, setPreview] = useState<AdminRecord | null>(null);

  async function remove(row: AdminRecord) {
    await run(() => api.delete(`/admin/cms/${recordId(row)}`), "Page deleted");
  }

  return (
    <AdminLayout title="CMS & Policies" actions={<Button size="sm" onClick={() => setCreating(true)}><Plus aria-hidden="true" /> New page</Button>}>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Keep customer-facing policies and help content accurate.</p>
        </div>
        {!isLoading && !error && <p className="text-xs text-muted-foreground">{data.length} page{data.length === 1 ? "" : "s"}</p>}
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
        {isLoading ? <TableSkeleton cols={5} /> : error ? <ErrorState message={apiErrorMessage(error, "Could not load CMS pages")} onRetry={() => refetch()} /> : data.length === 0 ? <EmptyState message="No CMS pages found." action={<Button onClick={() => setCreating(true)}><Plus aria-hidden="true" /> Create page</Button>} /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-5 py-3 font-semibold">Title</th><th className="px-5 py-3 font-semibold">Slug</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Last updated</th><th className="px-5 py-3 text-right font-semibold">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((row, index) => <tr key={recordId(row) || index} className="transition-colors hover:bg-muted/40">
                  <td className="px-5 py-4 font-medium">{String(row["title"] ?? "Untitled page")}</td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">/{String(row["slug"] ?? "")}</td>
                  <td className="px-5 py-4">{pageStatus(row["status"])}</td>
                  <td className="px-5 py-4 text-muted-foreground">{pageDate(row)}</td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" aria-label="Preview page" onClick={() => setPreview(row)}><Eye aria-hidden="true" /></Button>
                    <Button variant="ghost" size="icon" aria-label="Edit page" onClick={() => setEditing(row)}><Pencil aria-hidden="true" /></Button>
                    <ConfirmDelete label="this page" onConfirm={() => remove(row)} />
                  </div></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <CmsDialog open={creating || Boolean(editing)} page={editing} onOpenChange={(open) => { if (!open) { setCreating(false); setEditing(null); } }} onSaved={() => { setCreating(false); setEditing(null); }} run={run} />
      <Dialog open={Boolean(preview)} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{String(preview?.["title"] ?? "Untitled page")}</DialogTitle><DialogDescription>/{String(preview?.["slug"] ?? "")}</DialogDescription></DialogHeader>
          <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: String(preview?.["content"] ?? "<p>No content available.</p>") }} />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function CmsDialog({ open, page, onOpenChange, onSaved, run }: { open: boolean; page: AdminRecord | null; onOpenChange: (open: boolean) => void; onSaved: () => void; run: (action: () => Promise<unknown>, successMessage: string) => Promise<boolean> }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<string>("DRAFT");
  const [content, setContent] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(page ? String(page["title"] ?? "") : "");
    setSlug(page ? String(page["slug"] ?? "") : "");
    setStatus(page ? String(page["status"] ?? "DRAFT").toUpperCase() : "DRAFT");
    setContent(page ? String(page["content"] ?? "") : "");
    setSlugTouched(Boolean(page));
  }, [open, page]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) { toast.error("Title, slug and content are required"); return; }
    setBusy(true);
    try {
      const values = toFormData({ title: title.trim(), slug: slug.trim(), status, content });
      const action = page ? api.put(`/admin/cms/${recordId(page)}`, values, { headers: { "Content-Type": "multipart/form-data" } }) : api.post("/admin/cms", values, { headers: { "Content-Type": "multipart/form-data" } });
      const ok = await run(() => action, page ? "Page updated" : "Page created");
      if (ok) onSaved();
    } finally { setBusy(false); }
  }

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl"><DialogHeader><DialogTitle>{page ? "Edit page" : "Create page"}</DialogTitle><DialogDescription>Publish clear, up-to-date content for customers.</DialogDescription></DialogHeader>
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1.5"><Label htmlFor="cms-title">Title</Label><Input id="cms-title" value={title} onChange={(event) => { const value = event.target.value; setTitle(value); if (!slugTouched) setSlug(slugify(value)); }} placeholder="Privacy Policy" /></div><div className="space-y-1.5"><Label htmlFor="cms-slug">Slug</Label><Input id="cms-slug" value={slug} onChange={(event) => { setSlugTouched(true); setSlug(slugify(event.target.value)); }} placeholder="privacy-policy" /></div></div>
      <div className="space-y-1.5"><Label>Status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{STATUS_OPTIONS.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-1.5"><Label>Content</Label><RichTextEditor value={content} onChange={setContent} /></div>
      <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button><Button type="submit" disabled={busy}>{busy ? "Saving…" : page ? "Save changes" : "Create page"}</Button></DialogFooter>
    </form>
  </DialogContent></Dialog>;
}