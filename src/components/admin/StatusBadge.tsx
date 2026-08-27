import { Badge } from "@/components/ui/badge";

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
