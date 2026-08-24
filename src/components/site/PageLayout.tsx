import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-hero-gradient text-primary-foreground">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
            <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
            {intro && <p className="mt-4 text-base text-primary-foreground/80">{intro}</p>}
          </div>
        </section>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <article className="space-y-6 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground">
      {children}
    </article>
  );
}
