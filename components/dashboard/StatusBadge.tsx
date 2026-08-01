import { Badge } from "@/components/ui/badge";
import { RentalStatus } from "@/src/types/rental";

const STATUS_STYLES: Record<RentalStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  APPROVED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  REJECTED: "bg-red-100 text-red-800 hover:bg-red-100",
  ACTIVE: "bg-green-100 text-green-800 hover:bg-green-100",
  COMPLETED: "bg-gray-100 text-gray-800 hover:bg-gray-100",
};

export function StatusBadge({ status }: { status: RentalStatus }) {
  return (
    <Badge className={STATUS_STYLES[status]} variant="secondary">
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
