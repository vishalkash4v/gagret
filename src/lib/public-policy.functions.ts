import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const POLICY_TYPES = ["PRIVACY", "TERMS"] as const;
const UPSTREAM = "https://providersbackend.vercel.app/api/admin";

export const getPublicPolicy = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ type: z.enum(POLICY_TYPES) }).parse(data))
  .handler(async ({ data }) => {
    const response = await fetch(`${UPSTREAM}/policy/${data.type}`);
    const payload = (await response.json().catch(() => ({}))) as { data?: unknown };
    const records = Array.isArray(payload.data) ? payload.data : [];
    const record = records.find(
      (item): item is Record<string, unknown> => Boolean(item) && typeof item === "object",
    );

    return {
      type: data.type,
      content: String(record?.["content"] ?? ""),
      updatedAt: String(record?.["updatedAt"] ?? record?.["createdAt"] ?? ""),
    };
  });