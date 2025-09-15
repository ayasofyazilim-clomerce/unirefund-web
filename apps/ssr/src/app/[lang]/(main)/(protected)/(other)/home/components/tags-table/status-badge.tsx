import {cn} from "@/lib/utils";

export function StatusBadge({status}: {status: string}) {
  const getStatusConfig = (s: string) => {
    const configs: Record<string, {color: string; bgColor: string; icon?: string}> = {
      Open: {color: "text-blue-700", bgColor: "bg-blue-100 border-blue-200"},
      PreIssued: {color: "text-yellow-700", bgColor: "bg-yellow-100 border-yellow-200"},
      Issued: {color: "text-green-700", bgColor: "bg-green-100 border-green-200"},
      WaitingGoodsValidation: {color: "text-orange-700", bgColor: "bg-orange-100 border-orange-200"},
      WaitingStampValidation: {color: "text-orange-700", bgColor: "bg-orange-100 border-orange-200"},
      Declined: {color: "text-red-700", bgColor: "bg-red-100 border-red-200"},
      ExportValidated: {color: "text-purple-700", bgColor: "bg-purple-100 border-purple-200"},
      PaymentBlocked: {color: "text-red-700", bgColor: "bg-red-100 border-red-200"},
      PaymentInProgress: {color: "text-blue-700", bgColor: "bg-blue-100 border-blue-200"},
      PaymentProblem: {color: "text-red-700", bgColor: "bg-red-100 border-red-200"},
      Paid: {color: "text-emerald-700", bgColor: "bg-emerald-100 border-emerald-200"},
      Cancelled: {color: "text-gray-700", bgColor: "bg-gray-100 border-gray-200"},
      Expired: {color: "text-red-700", bgColor: "bg-red-100 border-red-200"},
      Correction: {color: "text-yellow-700", bgColor: "bg-yellow-100 border-yellow-200"},
      OptedOut: {color: "text-gray-700", bgColor: "bg-gray-100 border-gray-200"},
      EarlyPaid: {color: "text-green-700", bgColor: "bg-green-100 border-green-200"},
    };
    return configs[s] ?? {color: "text-gray-700", bgColor: "bg-gray-100 border-gray-200"};
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        config.bgColor,
        config.color,
      )}>
      {status}
    </span>
  );
}
