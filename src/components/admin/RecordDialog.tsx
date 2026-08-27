import { useEffect, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type FieldType = "text" | "email" | "number" | "file" | "select";

export interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  accept?: string;
}

export type RecordValues = Record<string, string | File | undefined>;

export function RecordDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  initialValues = {},
  submitLabel = "Save",
  onSubmit,
  trigger,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: FieldConfig[];
  initialValues?: Record<string, string | undefined>;
  submitLabel?: string;
  onSubmit: (values: RecordValues) => Promise<void>;
  trigger?: ReactNode;
}) {
  const [values, setValues] = useState<RecordValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(initialValues);
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      const value = values[field.name];
      const empty = value === undefined || value === null || (typeof value === "string" && value.trim() === "");
      if (field.required && empty) nextErrors[field.name] = `${field.label} is required`;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setBusy(true);
    try {
      await onSubmit(values);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {fields.map((field) => {
            const id = `field-${field.name}`;
            const value = values[field.name];
            return (
              <div key={field.name} className="space-y-1.5">
                <Label htmlFor={id}>
                  {field.label}
                  {field.required && <span className="text-destructive"> *</span>}
                </Label>

                {field.type === "select" ? (
                  <Select
                    value={typeof value === "string" ? value : undefined}
                    onValueChange={(v) => setValues((p) => ({ ...p, [field.name]: v }))}
                  >
                    <SelectTrigger id={id}>
                      <SelectValue placeholder={field.placeholder ?? "Select…"} />
                    </SelectTrigger>
                    <SelectContent>
                      {(field.options ?? []).map((opt) => (
                        <SelectItem key={opt} value={opt} className="capitalize">
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "file" ? (
                  <Input
                    id={id}
                    type="file"
                    accept={field.accept ?? "image/*"}
                    onChange={(e) =>
                      setValues((p) => ({ ...p, [field.name]: e.target.files?.[0] ?? undefined }))
                    }
                  />
                ) : (
                  <Input
                    id={id}
                    type={field.type ?? "text"}
                    placeholder={field.placeholder}
                    value={typeof value === "string" ? value : ""}
                    onChange={(e) => setValues((p) => ({ ...p, [field.name]: e.target.value }))}
                  />
                )}

                {errors[field.name] && (
                  <p className="text-xs font-medium text-destructive">{errors[field.name]}</p>
                )}
              </div>
            );
          })}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
