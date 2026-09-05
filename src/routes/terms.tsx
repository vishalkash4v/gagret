import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageLayout, Prose } from "@/components/site/PageLayout";
import { getPublicPolicy } from "@/lib/public-policy.functions";

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
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-policy", "TERMS"],
    queryFn: () =>
      getPublicPolicy({
        data: {
          type: "TERMS",
        },
      }),
  });

  if (isLoading) {
    return (
      <PageLayout title="Terms of Service">
        <Prose>
          <p>Loading terms...</p>
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