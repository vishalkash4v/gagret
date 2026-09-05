import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageLayout, Prose } from "@/components/site/PageLayout";
import { getPublicPolicy } from "@/lib/public-policy.functions";

const title = "Terms & Conditions — Go4Task";
const description =
  "The terms governing use of the Go4Task home services app for customers and service providers, including the flat access fee model.";

export const Route = createFileRoute("/terms")({
  loader: ({ context }) => context.queryClient.ensureQueryData({
    queryKey: ["public-policy", "TERMS"],
    queryFn: () => getPublicPolicy({ data: { type: "TERMS" } }),
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { data } = useSuspenseQuery({
    queryKey: ["public-policy", "TERMS"],
    queryFn: () => getPublicPolicy({ data: { type: "TERMS" } }),
  });

  return (
    <PageLayout title="Terms & Conditions" intro={data.updatedAt ? `Last updated: ${new Date(data.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : undefined}>
      <Prose>
        {data.content ? <div dangerouslySetInnerHTML={{ __html: data.content }} /> : <p>Terms and conditions content is currently unavailable.</p>}
      </Prose>
    </PageLayout>
  );
}
