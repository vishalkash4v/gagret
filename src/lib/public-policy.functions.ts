export async function getPublicPolicy({
  data: { type },
}: {
  data: { type: string };
}) {
  const policyType = String(type).trim().toUpperCase();

  const response = await fetch(
    `https://providersbackend.vercel.app/api/admin/policy/${encodeURIComponent(
      policyType
    )}`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error("Policy API Error:", {
      type: policyType,
      status: response.status,
      body: errorText,
    });

    throw new Error(
      `Failed to load ${policyType} policy: ${response.status}`
    );
  }

  const json = await response.json();

  const policy = Array.isArray(json.data)
    ? json.data[0]
    : json.data;

  if (!policy) {
    throw new Error(`No ${policyType} policy found`);
  }

  return {
    content: policy.content ?? null,
    updatedAt: policy.updatedAt ?? null,
  };
}