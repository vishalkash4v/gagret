export async function getPublicPolicy({ data: { type } }: { data: { type: string } }) {
  try {
    const response = await fetch(`https://providersbackend.vercel.app/api/admin/policy/${type}`);
    const json = await response.json();
    
    const policy = json.data?.[0]; 
    
    return {
      content: policy?.content || null,
      updatedAt: policy?.updatedAt || null,
    };
  } catch (error) {
    console.error(`Failed to fetch ${type} policy:`, error);
    return { content: null, updatedAt: null };
  }
}