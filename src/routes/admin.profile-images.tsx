import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ImageCheck, Image as ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/admin/DataState";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiErrorMessage } from "@/lib/admin-api";
import { reviewProfileImage, usePendingProfileImages, type PendingProfileImage, type PendingProfileImageGroup } from "@/hooks/use-verification";

export const Route = createFileRoute("/admin/profile-images")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Profile Image Approvals — Go4Task Admin" },
      { name: "description", content: "Review provider profile image updates for Go4Task." },
      { property: "og:title", content: "Profile Image Approvals — Go4Task Admin" },
      { property: "og:description", content: "Review provider profile image updates for Go4Task." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ProfileImagesPage,
});

function providerName(group: PendingProfileImageGroup) {
  return [group?.firstName, group?.lastName].filter(Boolean).join(" ") || "N/A";
}

function ProfileImagesPage() {
  const { data = [], isLoading, error, refetch } = usePendingProfileImages();
  const queryClient = useQueryClient();
  const [rejecting, setRejecting] = useState<{ group: PendingProfileImageGroup; image: PendingProfileImage } | null>(null);
  const [reason, setReason] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);

  async function review(group: PendingProfileImageGroup, image: PendingProfileImage, status: 1 | 2, rejectionReason = "") {
    if (!group?.userId || !image?._id) { toast.error("This image is missing its provider or image ID"); return; }
    const key = `${group.userId}-${image._id}`;
    setBusyKey(key);
    try {
      await reviewProfileImage(group.userId, image._id, status, rejectionReason);
      toast.success(status === 1 ? "Profile image approved" : "Profile image rejected");
      setRejecting(null);
      setReason("");
      await queryClient.invalidateQueries({ queryKey: ["admin", "pending-profile-images"] });
    } catch (reviewError) {
      toast.error(apiErrorMessage(reviewError, "Could not update profile image"));
    } finally { setBusyKey(null); }
  }

  const pendingCount = data.reduce((total, group) => total + (group?.pendingImages?.filter((image) => Number(image?.status) === 0).length ?? 0), 0);

  return <AdminLayout title="Profile Image Approvals"><div className="mb-5 flex items-end justify-between gap-3"><div><p className="text-sm text-muted-foreground">Compare current provider photos with their requested updates.</p></div>{!isLoading && !error && <p className="text-xs text-muted-foreground">{pendingCount} pending image{pendingCount === 1 ? "" : "s"}</p>}</div>
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">{isLoading ? <TableSkeleton cols={5} /> : error ? <ErrorState message={apiErrorMessage(error, "Could not load pending profile images")} onRetry={() => refetch()} /> : pendingCount === 0 ? <EmptyState message="No pending profile image updates found." action={<ImageCheck className="h-5 w-5 text-muted-foreground" aria-hidden="true" />} /> : <div className="divide-y divide-border">{data.map((group, index) => (group?.pendingImages ?? []).filter((image) => Number(image?.status) === 0).map((image) => <ProfileImageRow key={image?._id ?? `${group?.userId}-${index}`} group={group} image={image} busy={busyKey === `${group?.userId}-${image?._id}`} onApprove={() => review(group, image, 1)} onReject={() => { setRejecting({ group, image }); setReason(""); }} />))}</div>}</div>
    <Dialog open={Boolean(rejecting)} onOpenChange={(open) => !open && setRejecting(null)}><DialogContent><DialogHeader><DialogTitle>Reject profile image?</DialogTitle><DialogDescription>Give the provider a clear reason so they know what to update.</DialogDescription></DialogHeader><div className="space-y-2"><Label htmlFor="image-rejection-reason">Rejection reason</Label><Input id="image-rejection-reason" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explain why this image cannot be approved" autoFocus /></div><DialogFooter><Button variant="outline" onClick={() => setRejecting(null)} disabled={Boolean(busyKey)}>Cancel</Button><Button variant="destructive" disabled={!reason.trim() || Boolean(busyKey)} onClick={() => rejecting && review(rejecting.group, rejecting.image, 2, reason)}>{busyKey ? <Loader2 className="animate-spin" /> : <X />} Reject image</Button></DialogFooter></DialogContent></Dialog>
  </AdminLayout>;
}

function ProfileImageRow({ group, image, busy, onApprove, onReject }: { group: PendingProfileImageGroup; image: PendingProfileImage; busy: boolean; onApprove: () => void; onReject: () => void }) {
  return <div className="grid gap-5 p-5 lg:grid-cols-[minmax(180px,0.85fr)_minmax(360px,1.4fr)_auto] lg:items-center"><div><p className="font-semibold">{providerName(group)}</p><p className="mt-1 text-sm text-muted-foreground">{group?.email ?? "Email unavailable"}</p><p className="text-sm text-muted-foreground">{group?.mobile ?? group?.phone ?? "Mobile unavailable"}</p></div><div className="grid grid-cols-2 gap-3"><ComparisonImage label="Current" src={group?.currentProfileImage} /><ComparisonImage label="Requested" src={image?.image} /></div><div className="flex gap-2 lg:flex-col"><Button size="sm" onClick={onApprove} disabled={busy}><Check /> Approve</Button><Button size="sm" variant="outline" onClick={onReject} disabled={busy}><X /> Reject</Button></div></div>;
}

function ComparisonImage({ label, src }: { label: string; src?: string }) {
  return <div className="overflow-hidden rounded-lg border border-border bg-muted/30"><div className="flex aspect-[5/3] items-center justify-center">{src ? <img src={src} alt={`${label} profile`} className="h-full w-full object-cover" loading="lazy" /> : <ImageIcon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />}</div><p className="border-t border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p></div>;
}