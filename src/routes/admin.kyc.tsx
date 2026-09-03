import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, FileCheck2, Image as ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/admin/DataState";
import { EnumBadge, type BadgeTone } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiErrorMessage } from "@/lib/admin-api";
import { reviewKyc, useKycList, type KycRecord } from "@/hooks/use-verification";

export const Route = createFileRoute("/admin/kyc")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "KYC Verification — Go4Task Admin" },
      { name: "description", content: "Review and verify Go4Task customer KYC submissions." },
      { property: "og:title", content: "KYC Verification — Go4Task Admin" },
      { property: "og:description", content: "Review and verify Go4Task customer KYC submissions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: KycPage,
});

const FILTERS = [
  { value: "0", label: "All" },
  { value: "1", label: "Pending" },
  { value: "2", label: "Approved" },
  { value: "3", label: "Rejected" },
] as const;

const statuses: Record<number, { label: string; tone: BadgeTone }> = {
  1: { label: "Pending", tone: "warning" },
  2: { label: "Approved", tone: "success" },
  3: { label: "Rejected", tone: "danger" },
};

function nameOf(record: KycRecord) {
  return [record?.firstName, record?.lastName].filter(Boolean).join(" ") || "N/A";
}

function dateOf(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function statusOf(value: KycRecord["status"]) {
  return statuses[Number(value)] ?? { label: "Unknown", tone: "neutral" as BadgeTone };
}

function KycPage() {
  const [filter, setFilter] = useState("1");
  const [selected, setSelected] = useState<KycRecord | null>(null);
  const queryClient = useQueryClient();
  const type = Number(filter);
  const { data = [], isLoading, error, refetch } = useKycList(type);

  async function completeReview(status: 2 | 3, reason?: string) {
    const kycId = selected?.kycId;
    if (!kycId) {
      toast.error("This KYC record is missing its ID");
      return;
    }
    try {
      await reviewKyc(kycId, status, reason);
      toast.success(status === 2 ? "KYC approved" : "KYC rejected");
      setSelected(null);
      await queryClient.invalidateQueries({ queryKey: ["admin", "kyc"] });
    } catch (reviewError) {
      toast.error(apiErrorMessage(reviewError, "Could not update KYC status"));
    }
  }

  return (
    <AdminLayout title="KYC Verification">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Compare submitted identity documents before approving an account.</p>
          {!isLoading && !error && <p className="mt-1 text-xs text-muted-foreground">{data.length} submission{data.length === 1 ? "" : "s"}</p>}
        </div>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="h-auto w-full flex-wrap justify-start sm:w-auto">
            {FILTERS.map((item) => <TabsTrigger key={item.value} value={item.value}>{item.label}</TabsTrigger>)}
          </TabsList>
        </Tabs>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
        {isLoading ? <TableSkeleton cols={6} /> : error ? (
          <ErrorState message={apiErrorMessage(error, "Could not load KYC submissions")} onRetry={() => refetch()} />
        ) : data.length === 0 ? (
          <EmptyState message={filter === "1" ? "No pending KYC records found." : "No KYC records found."} action={<FileCheck2 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-5 py-3 font-semibold">Applicant</th><th className="px-5 py-3 font-semibold">Contact</th><th className="px-5 py-3 font-semibold">Document</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Submitted</th><th className="px-5 py-3 text-right font-semibold">Review</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((record, index) => {
                  const currentStatus = statusOf(record?.status);
                  return <tr key={record?.kycId ?? record?.userId ?? index} className="cursor-pointer transition-colors hover:bg-muted/40" onClick={() => setSelected(record)}>
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><Avatar src={record?.profilePic} alt={`${nameOf(record)} profile`} /><span className="font-medium">{nameOf(record)}</span></div></td>
                    <td className="px-5 py-4 text-muted-foreground">{record?.email ?? record?.mobile ?? "N/A"}</td>
                    <td className="px-5 py-4 font-medium">{record?.documentType ?? "N/A"}</td>
                    <td className="px-5 py-4"><EnumBadge label={currentStatus.label} tone={currentStatus.tone} /></td>
                    <td className="px-5 py-4 text-muted-foreground">{dateOf(record?.submittedAt)}</td>
                    <td className="px-5 py-4 text-right"><Button variant="outline" size="sm" onClick={(event) => { event.stopPropagation(); setSelected(record); }}>Review</Button></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <KycReviewDialog record={selected} onOpenChange={(open) => !open && setSelected(null)} onReview={completeReview} />
    </AdminLayout>
  );
}

function Avatar({ src, alt }: { src?: string; alt: string }) {
  return src ? <img src={src} alt={alt} className="h-9 w-9 rounded-full border border-border object-cover" loading="lazy" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary"><ImageIcon className="h-4 w-4" aria-hidden="true" /></span>;
}

function KycReviewDialog({ record, onOpenChange, onReview }: { record: KycRecord | null; onOpenChange: (open: boolean) => void; onReview: (status: 2 | 3, reason?: string) => Promise<void> }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const currentStatus = statusOf(record?.status);

  function close(open: boolean) {
    if (!open) { setRejecting(false); setReason(""); }
    onOpenChange(open);
  }

  async function submit(status: 2 | 3) {
    if (status === 3 && !reason.trim()) { toast.error("Add a rejection reason"); return; }
    setBusy(true);
    try { await onReview(status, reason); } finally { setBusy(false); }
  }

  return <Dialog open={Boolean(record)} onOpenChange={close}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
    <DialogHeader><DialogTitle>Review KYC submission</DialogTitle><DialogDescription>Compare the profile photo with both sides of the submitted document.</DialogDescription></DialogHeader>
    {record && <div className="space-y-5"><div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4"><Avatar src={record?.profilePic} alt={`${nameOf(record)} profile`} /><div><p className="font-semibold">{nameOf(record)}</p><p className="text-sm text-muted-foreground">{record?.email ?? record?.mobile ?? "Contact unavailable"}</p></div><div className="ml-auto"><EnumBadge label={currentStatus.label} tone={currentStatus.tone} /></div></div>
      <div className="grid gap-4 sm:grid-cols-3"><ImagePanel label="Profile photo" src={record?.profilePic} /><ImagePanel label="Document front" src={record?.frontImage} /><ImagePanel label="Document back" src={record?.backImage} /></div>
      <div className="grid gap-3 rounded-lg border border-border p-4 text-sm sm:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Document type</p><p className="mt-1 font-medium">{record?.documentType ?? "N/A"}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Submitted</p><p className="mt-1 font-medium">{dateOf(record?.submittedAt)}</p></div></div>
      {rejecting && <div className="space-y-2"><Label htmlFor="kyc-rejection-reason">Rejection reason</Label><Input id="kyc-rejection-reason" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explain what needs to be corrected" autoFocus /></div>}
    </div>}
    <DialogFooter className="gap-2 sm:gap-2">{rejecting ? <><Button type="button" variant="outline" onClick={() => setRejecting(false)} disabled={busy}>Back</Button><Button type="button" variant="destructive" onClick={() => submit(3)} disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <X />} Reject KYC</Button></> : <><Button type="button" variant="outline" onClick={() => setRejecting(true)} disabled={busy}><X /> Reject</Button><Button type="button" onClick={() => submit(2)} disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <Check />} Approve</Button></>}</DialogFooter>
  </DialogContent></Dialog>;
}

function ImagePanel({ label, src }: { label: string; src?: string }) {
  return <div className="overflow-hidden rounded-lg border border-border bg-muted/30"><div className="flex aspect-[4/3] items-center justify-center">{src ? <img src={src} alt={label} className="h-full w-full object-contain" loading="lazy" /> : <div className="text-center text-xs text-muted-foreground"><ImageIcon className="mx-auto mb-2 h-6 w-6" aria-hidden="true" />Image unavailable</div>}</div><p className="border-t border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p></div>;
}