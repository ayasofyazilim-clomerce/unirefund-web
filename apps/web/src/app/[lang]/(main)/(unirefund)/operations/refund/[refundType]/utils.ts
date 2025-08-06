import type {UniRefund_CRMService_RefundPoints_RefundPointListResponseDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import type {UniRefund_TagService_Tags_TagListItemDto} from "@ayasofyazilim/saas/TagService";

export function getTotals(totalType: string, selectedRows: UniRefund_TagService_Tags_TagListItemDto[]) {
  const total = selectedRows.reduce(
    (acc, row) => acc + (row.totals?.find((t) => t.totalType === totalType)?.amount || 0),
    0,
  );

  if (!total) return 0;

  return `${total.toFixed(2)} ${selectedRows[0]?.totals?.[0]?.currency || ""}`;
}

export function isUnauthorizedRefundPoint(
  refundPointId: string | undefined,
  accessibleRefundPoints: UniRefund_CRMService_RefundPoints_RefundPointListResponseDto[],
) {
  if (accessibleRefundPoints.length === 0 || !refundPointId) return false;

  return !accessibleRefundPoints.find((i) => i.id === refundPointId);
}
