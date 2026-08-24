import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Apple,
  BadgeCheck,
  ClipboardList,
  Coins,
  Gift,
  HandCoins,
  Handshake,
  IndianRupee,
  MapPinned,
  Play,
  ReceiptText,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import heroImage from "@/assets/hero-handyman.jpg";
import appScreens from "@/assets/app-screens.jpg";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/site/Button";
import { StoreBadges } from "@/components/site/StoreBadges";

const title = "HomeFix — Local Plumbers, Electricians & Home Repairs Near You";
const description =
  "Post a job free, get bids from verified pros within 50km and hire the best. 100% free for customers. Providers pay a small flat access fee only on won bookings.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "HomeFix",
          description,
          telephone: "+91-6230450047",
          email: "cqlsysvishal@gmail.com",
          areaServed: "Una, Himachal Pradesh",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Una",
            addressRegion: "Himachal Pradesh",
            addressCountry: "IN",
          },
        }),
      },
    ],
  }),
  component: LandingPage,
});

const customerSteps = [
  {
    Icon: ClipboardList,
    title: "Post a Request",
    text: "Describe the job in 30 seconds — add photos, pick a time slot, done. No fees, no calls.",
  },
  {
    Icon: ReceiptText,
    title: "Receive Offers",
    text: "Verified pros near you send transparent quotes with ratings, distance and availability.",
  },
  {
    Icon: Handshake,
    title: "Accept & Relax",
    text: "Compare, chat, accept the offer you like. Your pro shows up on schedule.",
  },
];

const providerSteps = [
  { Icon: Search, title: "See Nearby Jobs", text: "Live job feed within your 50km service radius, filtered by your skills." },
  { Icon: Send, title: "Send Your Bid", text: "Quote your own price. No lead packs, no bidding credits to buy upfront." },
  { Icon: HandCoins, title: "Pay Only if Accepted", text: "A small flat access fee applies only when a customer confirms your booking." },
  { Icon: Wrench, title: "Complete the Job", text: "Do great work, collect payment directly, and grow your rating and repeat clients." },
];

const features = [
  { Icon: ShieldCheck, title: "Verified Professionals", text: "ID, skill and address checks on every pro before their first bid goes live." },
  { Icon: MapPinned, title: "50km Hyper-Local Radius", text: "Only genuinely nearby experts see your job, so help arrives fast." },
  { Icon: IndianRupee, title: "Transparent Pricing", text: "Real quotes from real pros. No surge pricing, no surprise line items." },
  { Icon: Coins, title: "Zero Customer Fees", text: "Posting, bidding, chatting and booking are always 100% free for customers." },
];

function LandingPage() {
  const [audience, setAudience] = useState<"customers" | "providers">("customers");
  const steps = audience === "customers" ? customerSteps : providerSteps;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="bg-hero-gradient text-primary-foreground" aria-labelledby="hero-heading">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/12 px-3 py-1.5 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Now live across Una, Himachal Pradesh
              </span>
              <h1 id="hero-heading" className="mt-5 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
                Your Local Experts, Just a Tap Away.
              </h1>
              <p className="mt-5 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
                Get plumbing, electrical, and home repairs done instantly. 100% Free for customers.
                Providers pay only for confirmed jobs.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button as="a" href="#download" variant="accent" size="lg">
                  <Play className="h-5 w-5" aria-hidden="true" />
                  Download Android App
                </Button>
                <Button as="button" type="button" variant="muted" size="lg" disabled aria-disabled="true">
                  <Apple className="h-5 w-5" aria-hidden="true" />
                  iOS App — Coming Soon
                </Button>
              </div>

              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-primary-foreground">
                {[
                  ["12,400+", "Jobs completed"],
                  ["1,800+", "Verified pros"],
                  ["4.8★", "Average rating"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd>
                      <span className="block text-2xl font-extrabold">{value}</span>
                      <span className="block text-xs text-primary-foreground/70">{label}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <img
                src={heroImage}
                alt="Smiling verified HomeFix handyman with his toolkit greeting a happy family at their front door"
                width={1280}
                height={1024}
                className="w-full rounded-2xl object-cover shadow-lift"
              />
              <div className="surface-card absolute -bottom-5 left-4 flex items-center gap-3 px-4 py-3 sm:left-8">
                <BadgeCheck className="h-6 w-6 text-success" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-card-foreground">Background verified</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 text-accent" aria-hidden="true" /> 4.9 from 214 neighbours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Provider promo banner */}
        <section id="for-providers" aria-labelledby="promo-heading" className="px-4 py-12 sm:px-6">
          <div className="bg-promo-gradient mx-auto max-w-6xl rounded-2xl px-6 py-9 text-accent-foreground shadow-lift sm:px-10">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-accent-foreground/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  <Gift className="h-3.5 w-3.5" aria-hidden="true" />
                  Launch offer
                </span>
                <h2 id="promo-heading" className="mt-4 text-2xl font-extrabold sm:text-3xl">
                  Are you a service professional? Get your First 3 Jobs FREE!
                </h2>
                <p className="mt-3 text-sm font-medium text-accent-foreground/90 sm:text-base">
                  Refer a friend to earn 3 more free bookings. Zero subscription fees, zero hidden
                  commissions — pay a small flat access fee only when you win a booking.
                </p>
              </div>
              <Button as="a" href="#download" variant="primary" size="lg" className="w-full md:w-auto">
                Join as a Pro
              </Button>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" aria-labelledby="how-heading" className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 id="how-heading" className="text-3xl font-extrabold sm:text-4xl">How HomeFix Works</h2>
              <p className="mt-3 text-muted-foreground">
                One simple bidding flow — built to be free for the household and fair for the
                professional.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Choose audience"
              className="mx-auto mt-8 flex w-full max-w-xs rounded-xl border border-border bg-secondary p-1"
            >
              {(["customers", "providers"] as const).map((key) => (
                <button
                  key={key}
                  role="tab"
                  type="button"
                  id={`tab-${key}`}
                  aria-selected={audience === key}
                  aria-controls="steps-panel"
                  onClick={() => setAudience(key)}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold capitalize transition-colors ${
                    audience === key
                      ? "bg-card text-foreground shadow-[var(--shadow-soft)]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  For {key}
                </button>
              ))}
            </div>

            <ol
              id="steps-panel"
              role="tabpanel"
              aria-labelledby={`tab-${audience}`}
              className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {steps.map(({ Icon, title: stepTitle, text }, i) => (
                <li key={stepTitle} className="surface-card p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-2xl font-extrabold text-border">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{stepTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Why choose us */}
        <section aria-labelledby="why-heading" className="bg-secondary px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 id="why-heading" className="text-3xl font-extrabold sm:text-4xl">
                Why Choose HomeFix?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Trusted local home services — verified pros, honest quotes and no fees for customers.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ Icon, title: featureTitle, text }) => (
                <article key={featureTitle} className="surface-card p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success-soft text-success">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold">{featureTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Download */}
        <section id="download" aria-labelledby="download-heading" className="bg-hero-gradient px-4 py-16 text-primary-foreground sm:px-6">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 id="download-heading" className="text-3xl font-extrabold sm:text-4xl">
                Available now for Android. iOS dropping soon.
              </h2>
              <p className="mt-4 max-w-xl text-primary-foreground/85">
                Post a job, compare bids and track your pro in real time — all from your phone. Pros
                get their first 3 bookings free, plus 3 more for every provider they refer.
              </p>
              <StoreBadges className="mt-8" />
              <p className="mt-5 text-sm text-primary-foreground/70">
                Questions before you start? <Link to="/faq" className="font-semibold underline hover:text-accent">Read the FAQ</Link>{" "}
                or <Link to="/contact" className="font-semibold underline hover:text-accent">talk to our team</Link>.
              </p>
            </div>
            <img
              src={appScreens}
              alt="HomeFix app screens showing job posting, received bids and a confirmed booking"
              width={1280}
              height={912}
              loading="lazy"
              className="w-full rounded-2xl shadow-lift"
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
