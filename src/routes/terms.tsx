import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageLayout, Prose } from "@/components/site/PageLayout";
import {
  getCachedPublicPolicy,
  getCachedPublicPolicyUpdatedAt,
  getPublicPolicy,
} from "@/lib/public-policy.functions";

const title = "Terms of Service — Go4Task";

const description =
  "Terms and conditions for customers and service providers using Go4Task.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/terms" },
    ],
    links: [
      {
        rel: "canonical",
        href: "/terms",
      },
    ],
  }),

  component: TermsPage,
});

function TermsPage() {
  const cachedPolicy = getCachedPublicPolicy("TERMS");
  const cachedAt = getCachedPublicPolicyUpdatedAt("TERMS");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-policy", "TERMS"],
    queryFn: () =>
      getPublicPolicy({
        data: {
          type: "TERMS",
        },
      }),
    initialData: cachedPolicy,
    initialDataUpdatedAt: cachedAt,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
  });

  if (isLoading) {
    return (
      <PageLayout title="Terms of Service">
        <Prose>
          <div className="flex min-h-[280px] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
              <p className="text-sm">Loading terms...</p>
            </div>
          </div>
        </Prose>
      </PageLayout>
    );
  }

  if (isError || !data) {
    return (
      <PageLayout title="Terms of Service">
        <Prose>
          <p>Terms of Service is currently unavailable.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please refresh the page and try again.
          </p>
        </Prose>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Terms of Service"
      intro={
        data.updatedAt
          ? `Last updated: ${new Date(data.updatedAt).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}`
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
          <p>Terms content is currently unavailable.</p>
        )}
      </Prose>
    </PageLayout>
  );
}
