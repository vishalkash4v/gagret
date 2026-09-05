const appScreens = [
  {
    src: "/go4task-hero.png",
    alt: "Go4Task home screen and service professional introduction",
    title: "Find services for your everyday needs",
  },
  {
    src: "/go4task-login.png",
    alt: "Go4Task secure login screen with phone verification",
    title: "Quick and secure login",
  },
  {
    src: "/go4task-customer-home.png",
    alt: "Go4Task customer home screen showing services and offers",
    title: "Create a service request",
  },
  {
    src: "/go4task-offers.png",
    alt: "Go4Task offers screen showing multiple provider offers",
    title: "Compare multiple offers",
  },
  {
    src: "/go4task-provider-offer.png",
    alt: "Go4Task provider screen for sending a service offer",
    title: "Providers send their offers",
  },
  {
    src: "/go4task-bookings.png",
    alt: "Go4Task booking management screen",
    title: "Manage your booking",
  },
  {
    src: "/go4task-provider-home.png",
    alt: "Go4Task provider dashboard showing service requests",
    title: "Providers manage requests",
  },
  {
    src: "/go4task-signup.png",
    alt: "Go4Task signup screen with customer and provider options",
    title: "Join as a customer or provider",
  },
];

export function AppShowcase() {
  return (
    <section aria-labelledby="app-showcase-heading" className="bg-primary px-4 py-16 text-primary-foreground sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
            Inside the Go4Task app
          </span>
          <h2 id="app-showcase-heading" className="mt-4 text-3xl font-extrabold sm:text-4xl">
            See how the Go4Task workflow works
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            From signup and verification to service requests, provider offers and booking management —
            the app is built around the customer-provider workflow.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {appScreens.map((screen, index) => (
            <figure key={screen.src} className="group overflow-hidden rounded-2xl bg-white/10 p-2 shadow-lift">
              <div className="overflow-hidden rounded-xl bg-white">
                <img
                  src={screen.src}
                  alt={screen.alt}
                  width={941}
                  height={1672}
                  loading={index < 4 ? "lazy" : "lazy"}
                  decoding="async"
                  className="aspect-[941/1672] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <figcaption className="px-2 pb-2 pt-3 text-sm font-semibold">
                {screen.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
