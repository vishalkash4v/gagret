export async function getPublicPolicy({
  data: { type },
}: {
  data: { type: string };
}) {
  try {
    const response = await fetch(
      `https://providersbackend.vercel.app/api/admin/policy/${type}`
    );

    if (!response.ok) {
      throw new Error(`Policy API failed: ${response.status}`);
    }

    const json = await response.json();

    const policy = Array.isArray(json.data)
      ? json.data[0]
      : json.data;

    return {
      content: policy?.content || null,
      updatedAt: policy?.updatedAt || null,
    };
  } catch (error) {
    console.error(`Failed to fetch ${type} policy:`, error);

    return {
      content: null,
      updatedAt: null,
    };
  }
}