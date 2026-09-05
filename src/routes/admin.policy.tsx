import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { api, apiErrorMessage, getToken, unwrapList } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/policy")({
  ssr: false,
  component: AdminPoliciesPage,
});

type PolicyType = "PRIVACY" | "TERMS" | "REFUND";

type Policy = {
  _id: string;
  type: PolicyType;
  content: string;
  createdAt?: string;
  updatedAt?: string;
};

const POLICY_OPTIONS: { value: PolicyType; label: string }[] = [
  { value: "PRIVACY", label: "Privacy Policy" },
  { value: "TERMS", label: "Terms of Service" },
  { value: "REFUND", label: "Refund Policy" },
];

function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedType, setSelectedType] = useState<PolicyType>("PRIVACY");
  const [content, setContent] = useState("");
  const [policyId, setPolicyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const selectedPolicy = policies.find((policy) => policy.type === selectedType) ?? null;

  async function fetchAllPolicies() {
    setIsLoading(true);
    try {
      const response = await api.get("/policies");
      const list = unwrapList<Policy>(response.data);
      setPolicies(list);
    } catch (error) {
      toast.error(apiErrorMessage(error, "Failed to fetch policies"));
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchSelectedPolicy(type: PolicyType) {
    try {
      const response = await api.get(`/policy/${type}`);
      const list = unwrapList<Policy>(response.data);
      const policy = list[0];

      setContent(policy?.content ?? "");
      setPolicyId(policy?._id ?? null);
    } catch (error) {
      setContent("");
      setPolicyId(null);
      toast.error(apiErrorMessage(error, `Failed to fetch ${type} policy`));
    }
  }

  useEffect(() => {
    fetchAllPolicies();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      fetchSelectedPolicy(selectedType);
    }
  }, [selectedType, isLoading]);

  async function handleSave() {
    if (!content.trim()) {
      toast.error("Policy content is required");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("type", selectedType);
      formData.append("content", content);

      const response = await api.post("/policy", formData);
      const savedPolicy = response.data?.data as Policy | undefined;

      toast.success(response.data?.message || "Policy saved successfully");

      if (savedPolicy?._id) {
        setPolicyId(savedPolicy._id);
      }

      await fetchAllPolicies();
    } catch (error) {
      toast.error(apiErrorMessage(error, "Failed to save policy"));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!policyId) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete the ${selectedType.toLowerCase()} policy?`,
    );
    if (!confirmed) return;

    setIsSaving(true);
    try {
      const response = await api.delete(`/policy/${policyId}`);
      toast.success(response.data?.message || "Policy deleted successfully");
      setContent("");
      setPolicyId(null);
      await fetchAllPolicies();
    } catch (error) {
      toast.error(apiErrorMessage(error, "Failed to delete policy"));
    } finally {
      setIsSaving(false);
    }
  }

  const currentPolicy = selectedPolicy ?? (policyId ? { _id: policyId } : null);
  const tokenExists = Boolean(getToken());

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Policies</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage Privacy Policy, Terms of Service and Refund Policy from one module.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">Select Policy</label>
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as PolicyType)}>
            <SelectTrigger className="w-full md:w-[320px]">
              <SelectValue placeholder="Select a policy" />
            </SelectTrigger>
            <SelectContent>
              {POLICY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">
              {POLICY_OPTIONS.find((option) => option.value === selectedType)?.label}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentPolicy ? "Policy exists — edit and save changes." : "No policy created yet — add content and save."}
            </p>
          </div>
          {!tokenExists && (
            <p className="text-xs text-destructive">Admin session missing.</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Content</label>
          {isLoading ? (
            <div className="flex min-h-56 items-center justify-center rounded-lg border border-border text-sm text-muted-foreground">
              Loading policies…
            </div>
          ) : (
            <RichTextEditor value={content} onChange={setContent} />
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={handleSave} disabled={isLoading || isSaving}>
            {isSaving ? "Saving…" : "Save Policy"}
          </Button>

          {policyId && (
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading || isSaving}>
              Delete Policy
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="mb-3 text-sm font-semibold">Current Policies</p>
        <div className="grid gap-3 md:grid-cols-3">
          {POLICY_OPTIONS.map((option) => {
            const policy = policies.find((item) => item.type === option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedType(option.value)}
                className={`rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 ${
                  selectedType === option.value ? "border-primary bg-muted/50" : "border-border"
                }`}
              >
                <p className="text-sm font-medium">{option.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {policy ? `Updated ${new Date(policy.updatedAt ?? policy.createdAt ?? "").toLocaleDateString("en-IN")}` : "Not configured"}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
