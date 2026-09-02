import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, LifeBuoy, Mail, Phone, UserRound } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ErrorState, EmptyState, TableSkeleton } from "@/components/admin/DataState";
import { TextBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiErrorMessage } from "@/lib/admin-api";
import { recordId, useAdminList, type AdminRecord } from "@/hooks/use-admin-resource";

export const Route = createFileRoute("/admin/support")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Support Tickets — Go4Task Admin" },
      { name: "description", content: "Review and respond to Go4Task customer support requests." },
      { property: "og:title", content: "Support Tickets — Go4Task Admin" },
      { property: "og:description", content: "Review and respond to Go4Task customer support requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SupportPage,
});

type TicketUser = { firstName?: string; lastName?: string; email?: string; mobile?: string; phone?: string };

function userOf(row: AdminRecord) { return row["user"] as TicketUser | null | undefined; }
function userName(row: AdminRecord) { const user = userOf(row); const name = [user?.firstName, user?.lastName].filter(Boolean).join(" "); return name || "N/A"; }
function contact(row: AdminRecord) { const user = userOf(row); return { email: user?.email || "N/A", mobile: user?.mobile || user?.phone || "N/A" }; }
function ticketDate(row: AdminRecord) { const value = row["createdAt"] ?? row["created_at"] ?? row["date"]; if (!value) return "N/A"; const date = new Date(String(value)); return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
function statusClass(status: string) { const normalized = status.toUpperCase(); if (normalized === "RESOLVED") return "border-transparent bg-success-soft text-success"; if (normalized === "IN_PROGRESS") return "border-transparent bg-primary-soft text-primary"; return "border-transparent bg-accent-soft text-accent-foreground"; }

function SupportPage() {
  const { data = [], isLoading, error, refetch } = useAdminList<AdminRecord>("support", "/support", "support", "tickets");
  const [selected, setSelected] = useState<AdminRecord | null>(null);
  return <AdminLayout title="Support Tickets"><div className="mb-5 flex items-end justify-between gap-3"><div><p className="text-sm text-muted-foreground">Review customer requests and keep every conversation moving.</p></div>{!isLoading && !error && <p className="text-xs text-muted-foreground">{data.length} ticket{data.length === 1 ? "" : "s"}</p>}</div>
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">{isLoading ? <TableSkeleton cols={6} /> : error ? <ErrorState message={apiErrorMessage(error, "Could not load support tickets")} onRetry={() => refetch()} /> : data.length === 0 ? <EmptyState message="No support tickets found." action={<LifeBuoy className="h-5 w-5 text-muted-foreground" aria-hidden="true" />} /> : <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-sm"><thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-5 py-3 font-semibold">User</th><th className="px-5 py-3 font-semibold">Contact info</th><th className="px-5 py-3 font-semibold">Subject</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Date</th><th className="px-5 py-3 text-right font-semibold">Action</th></tr></thead><tbody className="divide-y divide-border">{data.map((row, index) => { const info = contact(row); const status = String(row["status"] ?? "PENDING"); return <tr key={recordId(row) || index} className="transition-colors hover:bg-muted/40"><td className="px-5 py-4"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary"><UserRound className="h-4 w-4" aria-hidden="true" /></span><span className="font-medium">{userName(row)}</span></div></td><td className="px-5 py-4"><div className="space-y-1 text-xs text-muted-foreground"><p>{info.email}</p><p>{info.mobile}</p></div></td><td className="max-w-[260px] truncate px-5 py-4 font-medium">{String(row["subject"] ?? "No subject")}</td><td className="px-5 py-4"><span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${statusClass(status)}`}>{status.replaceAll("_", " ")}</span></td><td className="px-5 py-4 text-muted-foreground">{ticketDate(row)}</td><td className="px-5 py-4 text-right"><Button variant="outline" size="sm" onClick={() => setSelected(row)}><Eye aria-hidden="true" /> View</Button></td></tr>; })}</tbody></table></div>}</div>
    <TicketDetails ticket={selected} onOpenChange={(open) => !open && setSelected(null)} />
  </AdminLayout>;
}

function TicketDetails({ ticket, onOpenChange }: { ticket: AdminRecord | null; onOpenChange: (open: boolean) => void }) {
  const info = ticket ? contact(ticket) : null;
  return <Dialog open={Boolean(ticket)} onOpenChange={onOpenChange}><DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{String(ticket?.["subject"] ?? "Support ticket")}</DialogTitle><DialogDescription>Full request details and customer contact information.</DialogDescription></DialogHeader>{ticket && <div className="space-y-6"><div className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4 sm:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</p><p className="mt-1 font-medium">{userName(ticket)}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p><span className={`mt-1 inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${statusClass(String(ticket["status"] ?? "PENDING"))}`}>{String(ticket["status"] ?? "PENDING").replaceAll("_", " ")}</span></div><div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4 text-primary" aria-hidden="true" />{info?.email}</div><div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4 text-primary" aria-hidden="true" />{info?.mobile}</div></div><div><h3 className="text-sm font-semibold">Description</h3><p className="mt-2 whitespace-pre-wrap rounded-lg border border-border bg-background p-4 text-sm leading-7 text-muted-foreground">{String(ticket["description"] ?? ticket["message"] ?? "No description provided.")}</p></div></div>}</DialogContent></Dialog>;
}