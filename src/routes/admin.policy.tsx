import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export const Route = createFileRoute("/admin/policy")({
  component: AdminPoliciesPage,
});

function AdminPoliciesPage() {
  const [selectedType, setSelectedType] = useState<string>("PRIVACY");
  const [content, setContent] = useState<string>("");
  const [policyId, setPolicyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the selected policy
  useEffect(() => {
    const fetchPolicy = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("adminToken"); // Adjust based on your auth state
        const res = await fetch(`https://providersbackend.vercel.app/api/admin/policy/${selectedType}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const json = await res.json();
        
        if (json.success && json.data?.length > 0) {
          setContent(json.data[0].content);
          setPolicyId(json.data[0]._id);
        } else {
          setContent("");
          setPolicyId(null);
        }
      } catch (error) {
        toast.error("Failed to fetch policy");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicy();
  }, [selectedType]);

  // Upsert Policy
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      
      const formData = new FormData();
      formData.append("type", selectedType);
      formData.append("content", content);

      const res = await fetch("https://providersbackend.vercel.app/api/admin/policy", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();

      if (json.success) {
        toast.success(json.message || "Policy saved successfully");
        setPolicyId(json.data._id);
      } else {
        toast.error("Failed to save policy");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Policy
  const handleDelete = async () => {
    if (!policyId || !confirm("Are you sure you want to delete this policy?")) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`https://providersbackend.vercel.app/api/admin/policy/${policyId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      const json = await res.json();

      if (json.success) {
        toast.success("Policy deleted successfully");
        setContent("");
        setPolicyId(null);
      }
    } catch (error) {
      toast.error("Failed to delete policy");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Manage Policies</h1>

      <div className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Policy Type</label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a policy type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PRIVACY">Privacy Policy</SelectItem>
              <SelectItem value="TERMS">Terms of Service</SelectItem>
              <SelectItem value="REFUND">Refund Policy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Content</label>
          <RichTextEditor 
            value={content} 
            onChange={setContent} 
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Policy"}
          </Button>
          
          {policyId && (
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              Delete Policy
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}