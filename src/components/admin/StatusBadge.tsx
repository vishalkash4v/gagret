import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StatusBadge({ active, labels = ["Active", "Blocked"] }: { active: boolean; labels?: [string, string] }) {
  return (
    <Badge variant={active ? "default" : "destructive"}>{active ? labels[0] : labels[1]}</Badge>
  );
}

export function TextBadge({ value }: { value?: string | null }) {
  const v = (value ?? "—").toString();
  const positive = /success|completed|paid|accepted|approved|confirmed/i.test(v);
  const negative = /fail|cancel|reject|refund/i.test(v);
  return (
    <Badge variant={positive ? "default" : negative ? "destructive" : "secondary"} className="capitalize">
      {v}
    </Badge>
  );
}

export type BadgeTone = "warning" | "info" | "success" | "danger" | "violet" | "neutral" | "orange";

export function EnumBadge({ label, tone }: { label: string; tone: BadgeTone }) {
  const toneClass = {
    warning: "border-transparent bg-accent-soft text-accent-foreground",
    info: "border-transparent bg-primary-soft text-primary",
    success: "border-transparent bg-success-soft text-success",
    danger: "border-transparent bg-destructive text-destructive-foreground",
    violet: "border-transparent bg-violet-soft text-violet",
    neutral: "border-transparent bg-secondary text-secondary-foreground",
    orange: "border-transparent bg-accent-soft text-accent-foreground",
  }[tone];

  return <Badge className={cn(toneClass)}>{label}</Badge>;
}
