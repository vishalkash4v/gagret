import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageLayout, Prose } from "@/components/site/PageLayout";
import {
  getCachedPublicPolicy,
  getCachedPublicPolicyUpdatedAt,
  getPublicPolicy,
} from "@/lib/public-policy.functions";

const title = "Privacy Policy — Go4Task";

const description =
  "How Go4Task collects, uses and protects customer and service provider data across our home services marketplace.";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/privacy-policy" },
    ],
    links: [
      {
        rel: "canonical",
        href: "/privacy-policy",
      },
    ],
  }),

  component: PrivacyPage,
});

function PrivacyPage() {
  const cachedPolicy = getCachedPublicPolicy("PRIVACY");
  const cachedAt = getCachedPublicPolicyUpdatedAt("PRIVACY");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-policy", "PRIVACY"],
    queryFn: () =>
      getPublicPolicy({
        data: {
          type: "PRIVACY",
        },
      }),
    initialData: cachedPolicy,
    initialDataUpdatedAt: cachedAt,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
  });

  if (isLoading) {
    return (
      <PageLayout title="Privacy Policy">
        <Prose>
          <div className="flex min-h-[280px] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
              <p className="text-sm">Loading privacy policy...</p>
            </div>
          </div>
        </Prose>
      </PageLayout>
    );
  }

  if (isError || !data) {
    return (
      <PageLayout title="Privacy Policy">
        <Prose>
          <p>Privacy Policy is currently unavailable.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please refresh the page and try again.
          </p>
        </Prose>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Privacy Policy"
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
          <p>Privacy policy content is currently unavailable.</p>
        )}
      </Prose>
    </PageLayout>
  );
}
