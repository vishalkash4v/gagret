import { Apple, Play } from "lucide-react";

export function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a
        href="#download"
        aria-label="Download Go4Task on Google Play"
        className="inline-flex items-center gap-3 rounded-xl bg-foreground px-5 py-3 text-background transition-transform hover:-translate-y-0.5"
      >
        <Play className="h-6 w-6" aria-hidden="true" />
        <span className="text-left leading-tight">
          <span className="block text-[0.65rem] uppercase tracking-widest opacity-70">Get it on</span>
          <span className="block text-base font-bold">Google Play</span>
        </span>
      </a>
      <span
        aria-disabled="true"
        role="link"
        aria-label="App Store — coming soon"
        className="inline-flex cursor-not-allowed items-center gap-3 rounded-xl border border-border bg-muted px-5 py-3 text-muted-foreground"
      >
        <Apple className="h-6 w-6" aria-hidden="true" />
        <span className="text-left leading-tight">
          <span className="block text-[0.65rem] uppercase tracking-widest">Coming soon on</span>
          <span className="block text-base font-bold">App Store</span>
        </span>
      </span>
    </div>
  );
}
