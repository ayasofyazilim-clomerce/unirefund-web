import {CheckCircle, Tag, TrendingDown, XCircle} from "lucide-react";

interface StatusBadgeProps {
  status?: string | null;
}

function getStatusIcon(status?: string | null) {
  const normalized = (status ?? "").toLowerCase();
  if (normalized.includes("issued")) return <CheckCircle className="h-3 w-3" />;
  if (normalized.includes("refund")) return <TrendingDown className="h-3 w-3" />;
  if (normalized.includes("closed")) return <XCircle className="h-3 w-3" />;
  if (normalized.includes("validated")) return <CheckCircle className="h-3 w-3" />;
  return <Tag className="h-3 w-3" />;
}

function getStatusColor(status?: string | null) {
  const normalized = (status ?? "").toLowerCase();
  if (normalized.includes("issued")) return "bg-green-100 text-green-800";
  if (normalized.includes("refund")) return "bg-blue-100 text-blue-800";
  if (normalized.includes("closed")) return "bg-gray-100 text-gray-800";
  if (normalized.includes("validated")) return "bg-emerald-100 text-emerald-800";
  return "bg-yellow-100 text-yellow-800";
}

export function StatusBadge({status}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      {status ?? "—"}
    </span>
  );
}
