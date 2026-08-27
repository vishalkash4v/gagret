import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, apiErrorMessage, unwrapList } from "@/lib/admin-api";

export interface AdminRecord {
  _id?: string;
  id?: string;
  [key: string]: unknown;
}

export function recordId(record: AdminRecord) {
  return String(record._id ?? record.id ?? "");
}

export function useAdminList<T extends AdminRecord>(key: string, path: string, ...listKeys: string[]) {
  const query = useQuery({
    queryKey: ["admin", key],
    queryFn: async () => {
      const res = await api.get(path);
      return unwrapList<T>(res.data, ...listKeys);
    },
    retry: 1,
  });

  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", key] });

  async function run(action: () => Promise<unknown>, successMessage: string) {
    try {
      await action();
      toast.success(successMessage);
      await refresh();
      return true;
    } catch (error) {
      toast.error(apiErrorMessage(error));
      return false;
    }
  }

  return { ...query, refresh, run };
}

export function toFormData(values: Record<string, string | File | undefined>) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === "") continue;
    fd.append(key, value);
  }
  return fd;
}

export function toJson(values: Record<string, string | File | undefined>) {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "string" && value.trim() !== "") out[key] = value;
  }
  return out;
}

export function pickString(record: AdminRecord, ...paths: string[]): string {
  for (const path of paths) {
    let cur: unknown = record;
    for (const part of path.split(".")) {
      if (cur && typeof cur === "object") cur = (cur as Record<string, unknown>)[part];
      else cur = undefined;
    }
    if (cur !== undefined && cur !== null && cur !== "") return String(cur);
  }
  return "—";
}
