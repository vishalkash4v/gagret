import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageLayout, Prose } from "@/components/site/PageLayout";
import { getPublicPolicy } from "@/lib/public-policy.functions";

const title = "Terms of Service — Go4Task";

export const Route = createFileRoute("/terms")({
  loader: ({ context }) => context.queryClient.ensureQueryData({
    queryKey: ["public-policy", "TERMS"],
    queryFn: () => getPublicPolicy({ data: { type: "TERMS" } }),
  }),
  component: TermsPage,
});

function TermsPage() {
  const { data } = useSuspenseQuery({
    queryKey: ["public-policy", "TERMS"],
    queryFn: () => getPublicPolicy({ data: { type: "TERMS" } }),
  });

  return (
    <PageLayout title="Terms of Service" intro={data.updatedAt ? `Last updated: ${new Date(data.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : undefined}>
      <Prose>
        {data.content ? <div dangerouslySetInnerHTML={{ __html: data.content }} /> : <p>Terms content is currently unavailable.</p>}
      </Prose>
    </PageLayout>
  );
}