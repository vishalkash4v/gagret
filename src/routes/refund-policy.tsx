import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageLayout, Prose } from "@/components/site/PageLayout";
import {
  getCachedPublicPolicy,
  getCachedPublicPolicyUpdatedAt,
  getPublicPolicy,
} from "@/lib/public-policy.functions";

const title = "Refund Policy — Go4Task";

const description =
  "Refund and cancellation policy for customers and service providers using Go4Task.";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      {
        title,
      },
      {
        name: "description",
        content: description,
      },
      {
        property: "og:title",
        content: title,
      },
      {
        property: "og:description",
        content: description,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "/refund-policy",
      },
    ],

    links: [
      {
        rel: "canonical",
        href: "/refund-policy",
      },
    ],
  }),

  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  const cachedPolicy = getCachedPublicPolicy("REFUND");
  const cachedAt = getCachedPublicPolicyUpdatedAt("REFUND");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-policy", "REFUND"],
    queryFn: () =>
      getPublicPolicy({
        data: {
          type: "REFUND",
        },
      }),
    initialData: cachedPolicy,
    initialDataUpdatedAt: cachedAt,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
  });

  if (isLoading) {
    return (
      <PageLayout title="Refund Policy">
        <Prose>
          <div className="flex min-h-[280px] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
              <p className="text-sm">Loading refund policy...</p>
            </div>
          </div>
        </Prose>
      </PageLayout>
    );
  }

  if (isError || !data) {
    return (
      <PageLayout title="Refund Policy">
        <Prose>
          <p>Refund policy is currently unavailable.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please refresh the page and try again.
          </p>
        </Prose>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Refund Policy"
      intro={
        data.updatedAt
          ? `Last updated: ${new Date(
              data.updatedAt
            ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}`
          : undefined
      }
    >
      <Prose>
        {data.content ? (
          <div
            dangerouslySetInnerHTML={{
              __html: data.content,
            }}
          />
        ) : (
          <p>Refund policy content is currently unavailable.</p>
        )}
      </Prose>
    </PageLayout>
  );
}
