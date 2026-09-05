const PUBLIC_API_BASE_URL =
  "https://providersbackend.vercel.app/api/admin";

export type PublicPolicy = {
  content: string | null;
  updatedAt: string | null;
};

type CachedPolicy = {
  data: PublicPolicy;
  cachedAt: number;
  etag?: string;
};

const CACHE_PREFIX = "go4task:public-policy:";

function getCacheKey(type: string) {
  return `${CACHE_PREFIX}${type}`;
}

function readCachedPolicy(type: string): CachedPolicy | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(getCacheKey(type));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CachedPolicy;
    if (!parsed?.data || typeof parsed.cachedAt !== "number") return null;

    return parsed;
  } catch {
    return null;
  }
}

function writeCachedPolicy(type: string, data: PublicPolicy, etag?: string) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      getCacheKey(type),
      JSON.stringify({
        data,
        cachedAt: Date.now(),
        ...(etag ? { etag } : {}),
      } satisfies CachedPolicy)
    );
  } catch {
    // Storage can be unavailable in private/restricted browser contexts.
  }
}

export function getCachedPublicPolicy(type: string): PublicPolicy | undefined {
  return readCachedPolicy(String(type).trim().toUpperCase())?.data;
}

export function getCachedPublicPolicyUpdatedAt(
  type: string
): number | undefined {
  return readCachedPolicy(String(type).trim().toUpperCase())?.cachedAt;
}

export async function getPublicPolicy({
  data: { type },
}: {
  data: { type: string };
}) {
  const policyType = String(type).trim().toUpperCase();
  const cached = readCachedPolicy(policyType);

  try {
    const url = `${PUBLIC_API_BASE_URL}/policy/${encodeURIComponent(
      policyType
    )}`;

    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (cached?.etag) {
      headers["If-None-Match"] = cached.etag;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (response.status === 304 && cached) {
      writeCachedPolicy(policyType, cached.data, cached.etag);
      return cached.data;
    }

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        `Policy API failed: ${response.status} ${response.statusText}`
      );
    }

    let json: any;

    try {
      json = JSON.parse(responseText);
    } catch {
      throw new Error("Policy API returned invalid JSON");
    }

    const policy = Array.isArray(json?.data)
      ? json.data[0]
      : json?.data;

    if (!policy) {
      throw new Error(`No ${policyType} policy found`);
    }

    const result: PublicPolicy = {
      content: policy.content ?? null,
      updatedAt: policy.updatedAt ?? null,
    };

    writeCachedPolicy(
      policyType,
      result,
      response.headers.get("etag") ?? undefined
    );

    return result;
  } catch (error) {
    if (cached?.data) {
      console.warn(
        `[Policy] Using cached ${policyType} policy after fetch failure.`
      );
      return cached.data;
    }

    console.error(`[Policy] Failed to load ${policyType}:`, error);
    throw error;
  }
}
