import { useMemo, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/admin/DataState";
import type { AdminRecord } from "@/hooks/use-admin-resource";
import { recordId } from "@/hooks/use-admin-resource";

const PAGE_SIZE = 10;

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function ResourceTable<T extends AdminRecord>({
  rows,
  columns,
  isLoading,
  error,
  onRetry,
  emptyMessage = "Nothing here yet.",
  searchPlaceholder = "Search…",
  searchFields,
}: {
  rows: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyMessage?: string;
  searchPlaceholder?: string;
  searchFields?: (row: T) => string;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((row) =>
      (searchFields ? searchFields(row) : JSON.stringify(row)).toLowerCase().includes(q),
    );
  }, [rows, query, searchFields]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="pl-9"
          />
        </div>
        <p className="text-xs text-muted-foreground">{filtered.length} record(s)</p>
      </div>

      {isLoading ? (
        <TableSkeleton cols={columns.length} />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : filtered.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <>
          <div className="max-h-[65vh] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col.header} className={col.className}>
                      {col.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((row, i) => (
                  <TableRow key={recordId(row) || i} className="transition-colors hover:bg-muted/60">
                    {columns.map((col) => (
                      <TableCell key={col.header} className={col.className}>
                        {col.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 border-t border-border p-3">
              <p className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
