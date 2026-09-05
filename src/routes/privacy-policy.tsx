import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageLayout, Prose } from "@/components/site/PageLayout";
import { getPublicPolicy } from "@/lib/public-policy.functions";

const title = "Privacy Policy — Go4Task";
const description =
  "How Go4Task collects, uses and protects customer and service provider data across our home services marketplace.";

export const Route = createFileRoute("/privacy-policy")({
  loader: ({ context }) => context.queryClient.ensureQueryData({
    queryKey: ["public-policy", "PRIVACY"],
    queryFn: () => getPublicPolicy({ data: { type: "PRIVACY" } }),
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { data } = useSuspenseQuery({
    queryKey: ["public-policy", "PRIVACY"],
    queryFn: () => getPublicPolicy({ data: { type: "PRIVACY" } }),
  });

  return (
    <PageLayout title="Privacy Policy" intro={data.updatedAt ? `Last updated: ${new Date(data.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : undefined}>
      <Prose>
        {data.content ? <div dangerouslySetInnerHTML={{ __html: data.content }} /> : <p>Privacy policy content is currently unavailable.</p>}
      </Prose>
    </PageLayout>
  );
}
