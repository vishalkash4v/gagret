import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageLayout, Prose } from "@/components/site/PageLayout";
import { getPublicPolicy } from "@/lib/public-policy.functions";

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
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-policy", "REFUND"],
    queryFn: () =>
      getPublicPolicy({
        data: {
          type: "REFUND",
        },
      }),
  });

  if (isLoading) {
    return (
      <PageLayout title="Refund Policy">
        <Prose>
          <p>Loading refund policy...</p>
        </Prose>
      </PageLayout>
    );
  }

if (isError || !data) {
  return (
    <PageLayout title="Refund Policy">
      <Prose>
        <p>Refund policy is currently unavailable.</p>

        {isError && (
          <p className="mt-2 text-sm text-muted-foreground">
            Please refresh the page and try again.
          </p>
        )}
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