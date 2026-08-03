import { Badge } from "@/components/ui/badge";
import { RentalStatus } from "@/src/types/rental";

const STATUS_STYLES: Record<RentalStatus, string> = {
  PENDING:
    "border-amber-200 bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200/70 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
  APPROVED:
    "border-sky-200 bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200/70 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
  REJECTED:
    "border-rose-200 bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200/70 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300",
  ACTIVE:
    "border-emerald-200 bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/70 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
  COMPLETED:
    "border-slate-200 bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200/70 dark:border-slate-500/30 dark:bg-slate-500/10 dark:text-slate-300",
};

export function StatusBadge({ status }: { status: RentalStatus }) {
  return (
    <Badge
      className={`${STATUS_STYLES[status]} px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase`}
      variant="secondary"
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
