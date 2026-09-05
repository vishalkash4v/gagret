const PUBLIC_API_BASE_URL =
  "https://providersbackend.vercel.app/api/admin";

export async function getPublicPolicy({
  data: { type },
}: {
  data: { type: string };
}) {
  const policyType = String(type).trim().toUpperCase();

  try {
    const url = `${PUBLIC_API_BASE_URL}/policy/${encodeURIComponent(
      policyType
    )}`;

    console.log("[Policy] Fetching:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const responseText = await response.text();

    console.log("[Policy] Response:", {
      type: policyType,
      status: response.status,
      body: responseText,
    });

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

    return {
      content: policy.content ?? null,
      updatedAt: policy.updatedAt ?? null,
    };
  } catch (error) {
    console.error(`[Policy] Failed to load ${policyType}:`, error);
    throw error;
  }
}